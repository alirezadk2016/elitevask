import { randomBytes, createHash } from 'crypto';
import { buildTransport, emailShell, tr, BOOKING_EMAIL, INFO_EMAIL, CONTACT_EMAIL } from '@/lib/mailer';

function hashEmail(email) {
  return createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}
const CANCEL_TTL = 60 * 60 * 24;      // 24 hours for cancel link
const BOOKING_TTL = 60 * 60 * 24 * 30; // 30 days for slot records

// In-memory fallback
const memSlots = new Map();
const memBookings = new Map();
const memRateLimit = new Map();

let kvClient = null;
async function getKV() {
  if (kvClient) return kvClient;
  try {
    const { Redis } = await import('@upstash/redis');
    const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
    if (!url || !token) return null;
    kvClient = new Redis({ url, token });
    return kvClient;
  } catch { return null; }
}

// Rate limiting: max 5 requests per minute per IP
async function checkRateLimit(ip) {
  const key = `rl:book:${ip}`;
  const now = Math.floor(Date.now() / 1000);
  const window = 60;
  try {
    const kv = await getKV();
    if (kv) {
      const count = await kv.incr(key);
      if (count === 1) await kv.expire(key, window);
      return count <= 5;
    }
  } catch {}
  // In-memory fallback
  const entry = memRateLimit.get(key);
  if (!entry || now - entry.start >= window) {
    memRateLimit.set(key, { start: now, count: 1 });
    return true;
  }
  entry.count++;
  return entry.count <= 5;
}

function secureToken() {
  return randomBytes(32).toString('hex'); // 64 hex chars, cryptographically random
}

async function isSlotBooked(key) {
  try {
    const kv = await getKV();
    if (kv) return !!(await kv.get(key));
  } catch {}
  return memSlots.has(key);
}

async function bookSlot(key, value) {
  try {
    const kv = await getKV();
    if (kv) { await kv.set(key, JSON.stringify(value), { ex: BOOKING_TTL }); return; }
  } catch {}
  memSlots.set(key, value);
}

async function getBookedSlots(date) {
  try {
    const kv = await getKV();
    if (kv) {
      const keys = await kv.keys(`slot:${date}:*`);
      return keys.map((k) => k.split(':').slice(2).join(':'));
    }
  } catch {}
  const prefix = `slot:${date}:`;
  return [...memSlots.keys()].filter(k => k.startsWith(prefix)).map(k => k.slice(prefix.length));
}

// Check duplicate booking by phone+date
async function isDuplicateBooking(phone, date) {
  if (!phone || !date) return false;
  const key = `dup:${phone.replace(/\D/g,'')}:${date}`;
  try {
    const kv = await getKV();
    if (kv) return !!(await kv.get(key));
  } catch {}
  return false;
}

async function markDuplicateBooking(phone, date) {
  if (!phone || !date) return;
  const key = `dup:${phone.replace(/\D/g,'')}:${date}`;
  try {
    const kv = await getKV();
    if (kv) { await kv.set(key, '1', { ex: BOOKING_TTL }); return; }
  } catch {}
}

function slotKey(date, time) { return `slot:${date}:${time}`; }

const SLOT_TIMES = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];


function fmtDate(d, L) {
  if (!d) return d;
  const [, m, day] = d.split('-');
  const months = L
    ? ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec']
    : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${parseInt(day)}. ${months[parseInt(m)-1]}`;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  if (!date) return Response.json({ booked: [] });
  try {
    const times = await getBookedSlots(date);
    return Response.json({ booked: times });
  } catch { return Response.json({ booked: [] }); }
}

export async function POST(request) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  if (!await checkRateLimit(ip)) {
    return Response.json({ error: 'rate_limit', message: 'For mange anmodninger. Prøv igen om et minut.' }, { status: 429 });
  }

  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { car, pkg, extras, addr, zip, city, date, time, name, phone, email, msg, price, lang, carId, slotsNeeded: rawSlots } = body;

  // Input validation
  if (email && !/^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/.test(email)) {
    return Response.json({ error: 'invalid_email' }, { status: 400 });
  }
  if (phone && !/^[\d\s\-\+\(\)]{6,25}$/.test(phone)) {
    return Response.json({ error: 'invalid_phone' }, { status: 400 });
  }
  if (name && name.length > 120) return Response.json({ error: 'name_too_long' }, { status: 400 });
  if (addr && addr.length > 200) return Response.json({ error: 'addr_too_long' }, { status: 400 });
  if (msg  && msg.length  > 1000) return Response.json({ error: 'msg_too_long'  }, { status: 400 });
  if (zip  && !/^\d{3,5}$/.test(zip.trim())) return Response.json({ error: 'invalid_zip' }, { status: 400 });

  const CAR_SLOTS = { lille: 2, mellem: 3, stor: 4, varebil: 3 };
  const slotsNeeded = CAR_SLOTS[carId] || Math.max(1, Math.min(parseInt(rawSlots) || 2, 5));
  const L = lang !== 'en';

  let cancelToken = null;

  if (date && time) {
    // Past slot check
    const nowInCph = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Copenhagen' });
    const nowUtc = new Date().toLocaleString('sv-SE', { timeZone: 'UTC' });
    const cphOffsetMs = new Date(nowInCph) - new Date(nowUtc);
    if (new Date(`${date}T${time}:00Z`).getTime() - cphOffsetMs < Date.now()) {
      return Response.json({
        error: 'slot_past',
        message: L ? 'Dette tidspunkt er allerede passeret.' : 'This time slot is in the past.',
      }, { status: 409 });
    }

    // Duplicate booking by phone check
    if (phone && await isDuplicateBooking(phone, date)) {
      return Response.json({
        error: 'duplicate',
        message: L
          ? 'Der findes allerede en booking med dette telefonnummer på den valgte dato. Kontakt os på +45 24 44 03 21 for at ændre din booking.'
          : 'A booking with this phone number already exists for the selected date. Contact us at +45 24 44 03 21 to change your booking.',
      }, { status: 409 });
    }

    // Slot availability check
    const startIdx = SLOT_TIMES.indexOf(time);
    for (let i = 0; i < slotsNeeded; i++) {
      const slotTime = SLOT_TIMES[startIdx + i];
      if (!slotTime) break;
      if (await isSlotBooked(slotKey(date, slotTime))) {
        return Response.json({
          error: 'slot_taken',
          message: L
            ? 'Dette tidspunkt er desværre allerede booket. Vælg venligst et andet tidspunkt.'
            : 'This time slot is already booked. Please choose a different time.',
        }, { status: 409 });
      }
    }

    // Book slots + store booking record
    cancelToken = secureToken(); // 64-char hex, cryptographically secure
    const bookedSlots = [];
    const bookedAt = new Date().toISOString();
    const cancelExpiresAt = new Date(Date.now() + CANCEL_TTL * 1000).toISOString();

    for (let i = 0; i < slotsNeeded; i++) {
      const slotTime = SLOT_TIMES[startIdx + i];
      if (!slotTime) break;
      bookedSlots.push(slotTime);
      await bookSlot(slotKey(date, slotTime), { name: name || 'unknown', bookedAt, token: cancelToken });
    }

    // Store booking with soft-delete support and cancel expiry
    const bookingRecord = {
      status: 'confirmed',
      date, time, car, pkg, price, lang,
      carId, slotsNeeded, slots: bookedSlots,
      name, phone, email, msg, extras,
      addr, zip, city,
      bookedAt, cancelExpiresAt,
      ip, userAgent: request.headers.get('user-agent') || '',
    };
    try {
      const kv = await getKV();
      if (kv) {
        await kv.set(`booking:${cancelToken}`, JSON.stringify(bookingRecord), { ex: BOOKING_TTL });
      } else {
        memBookings.set(cancelToken, bookingRecord);
      }
    } catch {}

    // Mark phone+date to prevent duplicate bookings
    await markDuplicateBooking(phone, date);

    // Index booking by email for customer portal
    if (email) {
      try {
        const kv2 = await getKV();
        if (kv2) {
          const { createHash } = await import('crypto');
          const emailHash = createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
          await kv2.sadd(`user:bookings:${emailHash}`, cancelToken);
        }
      } catch {}
    }
  }

  // Derive site URL from the incoming request so the cancel link always works
  // regardless of which Vercel deployment or domain is active.
  // NEXT_PUBLIC_SITE_URL env var can override if needed.
  const reqUrl = new URL(request.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ||
    `${reqUrl.protocol}//${reqUrl.host}`;

  const extrasStr = extras?.length ? (Array.isArray(extras) ? extras.join(', ') : extras) : (L ? 'Ingen' : 'None');
  const cancelLink = cancelToken ? `${siteUrl}/annuller?token=${cancelToken}` : null;
  const senderUser = process.env.SMTP_USER || process.env.GMAIL_USER || BOOKING_EMAIL;

  const transport = buildTransport();

  if (transport) {
    // ── Company notification ─────────────────────────────────────────────────
    try {
      await transport.sendMail({
        from: `"Elite Vask Booking" <${senderUser}>`,
        to: BOOKING_EMAIL,
        replyTo: email || CONTACT_EMAIL,
        subject: `📋 Ny booking: ${car || ''} – ${date || ''} kl. ${time || ''}`,
        html: emailShell({
          title: `Ny bookinganmodning`,
          lang: 'da',
          body: `
            <p style="color:#333;margin:0 0 20px;font-size:15px;line-height:1.6">En ny bookingforespørgsel er modtaget via hjemmesiden.</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px">
              ${tr('Dato & tid', `${fmtDate(date, true)} · kl. ${time}`, true)}
              ${tr('Adresse', addr ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${addr}, ${zip} ${city}`)}" style="color:#0d4a25;font-weight:700">${addr}, ${zip} ${city} 📍</a>` : '-')}
              ${tr('Bil', car || '-', true)}
              ${tr('Pakke', pkg || '-')}
              ${tr('Tilvalg', extrasStr, true)}
              ${tr('Anslået pris', price || '-')}
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;border-top:2px solid #e0e8e3">
              ${tr('Navn', name || '-', true)}
              ${tr('Telefon', `<a href="tel:${(phone||'').replace(/\s/g,'')}" style="color:#0d4a25">${phone || '-'}</a>`)}
              ${tr('Email', email ? `<a href="mailto:${email}" style="color:#0d4a25">${email}</a>` : '-', true)}
              ${msg ? tr('Besked', msg) : ''}
            </table>
            ${cancelLink ? `<p style="font-size:12px;color:#999;margin:0">Annulleringslink (24t): <a href="${cancelLink}" style="color:#0d4a25">${cancelLink}</a></p>` : ''}
          `,
        }),
      });
    } catch (err) {
      console.error('[book] Company email failed:', err.message);
      return Response.json({ ok: false, error: 'email_failed' }, { status: 500 });
    }

    // ── Customer confirmation ────────────────────────────────────────────────
    if (email) {
      try {
        await transport.sendMail({
          from: `"Elite Vask" <${senderUser}>`,
          to: email,
          replyTo: CONTACT_EMAIL,
          subject: L
            ? `Bookingbekræftelse – ${fmtDate(date, true)} kl. ${time}`
            : `Booking confirmation – ${fmtDate(date, false)} at ${time}`,
          headers: {
            'X-Entity-Ref-ID': cancelToken || Date.now().toString(),
            'List-Unsubscribe': `<mailto:${CONTACT_EMAIL}?subject=afmeld>`,
          },
          html: emailShell({
            title: L ? '✅ Tak for din booking!' : '✅ Thank you for your booking!',
            preheader: L
              ? `Vi har modtaget din booking til ${fmtDate(date, true)} kl. ${time}.`
              : `We received your booking for ${fmtDate(date, false)} at ${time}.`,
            lang: lang || 'da',
            body: `
              <p style="color:#333;margin:0 0 20px;font-size:15px;line-height:1.7">
                ${L ? `Hej ${name || ''},` : `Hi ${name || ''},`}<br><br>
                ${L
                  ? 'Vi har modtaget din bookingforespørgsel og vender tilbage hurtigst muligt for at bekræfte tid og endelig pris.'
                  : "We've received your booking request and will get back to you as soon as possible to confirm the time and final price."}
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">
                ${tr(L ? 'Dato & tid' : 'Date & time', `${fmtDate(date, L)} · kl. ${time}`, true)}
                ${tr(L ? 'Bil' : 'Car', car || '-')}
                ${tr(L ? 'Pakke' : 'Package', pkg || '-', true)}
                ${extras?.length ? tr(L ? 'Tilvalg' : 'Add-ons', extrasStr) : ''}
                ${tr(L ? 'Adresse' : 'Address', `${addr || ''}, ${zip || ''} ${city || ''}`, true)}
                ${tr(L ? 'Anslået pris' : 'Est. price', `<strong style="color:#0d4a25;font-size:15px">${price || '-'}</strong>`)}
              </table>

              ${cancelLink ? `
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
                <tr><td style="background:#fdf3f3;border:1px solid #f5c6c6;border-radius:8px;padding:16px 20px">
                  <p style="margin:0 0 10px;font-size:13px;color:#555;line-height:1.5">
                    ${L
                      ? '⏱ Du kan annullere gratis op til 24 timer inden din aftalte tid.'
                      : '⏱ You can cancel free of charge up to 24 hours before your scheduled time.'}
                  </p>
                  <a href="${cancelLink}" style="display:inline-block;background:#c0392b;color:#ffffff;padding:11px 24px;border-radius:7px;text-decoration:none;font-weight:700;font-size:14px">
                    ${L ? 'Annuller booking' : 'Cancel booking'}
                  </a>
                </td></tr>
              </table>` : ''}

              <p style="font-size:13px;color:#777;margin:0;line-height:1.7">
                ${L
                  ? `Spørgsmål? Ring til os på <a href="tel:+4524440321" style="color:#0d4a25;font-weight:600">+45 24 44 03 21</a> eller skriv til <a href="mailto:${CONTACT_EMAIL}" style="color:#0d4a25">${CONTACT_EMAIL}</a>.`
                  : `Questions? Call us on <a href="tel:+4524440321" style="color:#0d4a25;font-weight:600">+45 24 44 03 21</a> or email <a href="mailto:${CONTACT_EMAIL}" style="color:#0d4a25">${CONTACT_EMAIL}</a>.`}
              </p>
            `,
          }),
        });
        console.log(`[book] Customer confirmation sent to ${email}`);
      } catch (err) {
        console.error(`[book] Customer email FAILED to ${email}:`, err.message);
      }
    }

    return Response.json({ ok: true, ...(cancelToken ? { token: cancelToken } : {}) });
  }

  console.warn('[book] No SMTP — booking logged only.');
  console.log('BOOKING:\n' + textLines.join('\n'));
  return Response.json({ ok: true, warn: 'no_smtp', ...(cancelToken ? { token: cancelToken } : {}) });
}
