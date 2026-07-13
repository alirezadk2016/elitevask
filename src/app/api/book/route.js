import { randomBytes, createHash } from 'crypto';
import dns from 'node:dns/promises';
import { cphEpoch } from '@/lib/cphTime';
import { buildSlotTimes, carSlotCount, isClosedDay, normalizeHours, DEFAULT_HOURS } from '@/lib/hours';
import { buildTransport, emailShell, tr, BOOKING_EMAIL, INFO_EMAIL, CONTACT_EMAIL } from '@/lib/mailer';

// Known disposable / throwaway email domains – block fake bookings
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com','tempmail.com','temp-mail.org','10minutemail.com','guerrillamail.com',
  'guerrillamail.net','sharklasers.com','yopmail.com','yopmail.fr','trashmail.com',
  'getnada.com','nada.email','throwawaymail.com','fakeinbox.com','dispostable.com',
  'maildrop.cc','mailnesia.com','tempinbox.com','mintemail.com','mohmal.com',
  'emailondeck.com','spambog.com','mytemp.email','tempr.email','discard.email',
  'mailcatch.com','inboxbear.com','tempmailo.com','luxusmail.org','mailto.plus',
  'fakemail.net','burnermail.io','33mail.com','spam4.me','grr.la','guerrillamailblock.com',
  'maileater.com','wegwerfmail.de','trashmail.de','byom.de','tmail.ws','minuteinbox.com',
]);

// Verify the email domain can actually receive mail (MX, with A/AAAA fallback).
// Only a DEFINITE "domain does not exist" answer rejects the customer –
// transient DNS trouble (timeouts, resolver refusals) must never block a
// real booking, so anything else fails OPEN.
const DNS_NO = new Set(['ENOTFOUND', 'ENODATA', 'NODATA', 'NXDOMAIN']);
async function emailDomainHasMail(domain) {
  try {
    const mx = await dns.resolveMx(domain);
    if (mx && mx.length > 0) return true;
  } catch (e) { if (!DNS_NO.has(e.code)) return true; }
  try {
    const a = await dns.resolve(domain);
    if (a && a.length > 0) return true;
  } catch (e) { if (!DNS_NO.has(e.code)) return true; }
  try {
    const aaaa = await dns.resolve6(domain);
    if (aaaa && aaaa.length > 0) return true;
  } catch (e) { if (!DNS_NO.has(e.code)) return true; }
  return false;
}

function hashEmail(email) {
  return createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
}

// User input goes into HTML emails – escape it so nobody can inject
// links/markup into the company's or the customer's inbox.
function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
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

/* Atomic reserve (SET NX): returns false if someone else grabbed the slot
   first – closes the race where two customers pass the availability check
   at the same moment and both "book" the same hour. */
async function reserveSlot(key, value) {
  const kv = await getKV();
  if (kv) {
    // If KV is configured but errors, do NOT fall back to per-instance
    // memory (invisible to other instances → double booking). Let the
    // error propagate so the caller can answer 503.
    const r = await kv.set(key, JSON.stringify(value), { nx: true, ex: BOOKING_TTL });
    return !!r; // 'OK' on success, null if the key already existed
  }
  if (memSlots.has(key)) return false;
  memSlots.set(key, value);
  return true;
}

/* Current date + hour in the salon's timezone, not the server's (UTC). */
function cphNow() {
  const s = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Copenhagen' });
  return {
    date: s.slice(0, 10),
    hour: parseInt(s.slice(11, 13), 10),
    minutes: parseInt(s.slice(11, 13), 10) * 60 + parseInt(s.slice(14, 16), 10),
  };
}
function toMinutes(t) { return parseInt(t.slice(0, 2), 10) * 60 + parseInt(t.slice(3, 5), 10); }

// Release reserved slots (used when we could NOT notify anyone about the booking,
// so the slot must not stay red for a booking nobody knows about).
async function releaseSlots(date, times, cancelToken) {
  let kv = null;
  try { kv = await getKV(); } catch {}
  if (kv) {
    // allSettled + one retry: a transient Redis hiccup must not leave
    // orphaned red slots for 30 days.
    const delAll = () => Promise.allSettled([
      ...times.map((t) => kv.del(slotKey(date, t))),
      ...(cancelToken ? [kv.del(`booking:${cancelToken}`)] : []),
    ]);
    const results = await delAll();
    if (results.some((r) => r.status === 'rejected')) {
      const retry = await delAll();
      const failed = retry.filter((r) => r.status === 'rejected').length;
      if (failed) console.error(`[book] releaseSlots: ${failed} key(s) could not be deleted`, { date, times });
    }
    return;
  }
  for (const t of times) memSlots.delete(slotKey(date, t));
  if (cancelToken) memBookings.delete(cancelToken);
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

function slotKey(date, time) { return `slot:${date}:${time}`; }

// Opening hours are manager-editable (admin → Åbningstider), stored in KV
// under `content:hours`. A booking occupies carSlotCount() consecutive slots
// and the whole duration must finish by the closing time.
async function loadHours() {
  try {
    const kv = await getKV();
    if (kv) {
      const h = await kv.get('content:hours');
      if (h) return normalizeHours(h);
    }
  } catch {}
  return normalizeHours(DEFAULT_HOURS);
}

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
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return Response.json({ booked: [] });
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

  const { car, pkg, extras, addr, zip, city, date, time, name, phone, email, msg, price, lang, carId } = body;

  // Input validation
  const L0 = lang !== 'en';
  if (email) {
    const em = email.trim().toLowerCase();
    if (!/^[^\s@\r\n]+@[^\s@\r\n]+\.[a-z]{2,}$/.test(em)) {
      return Response.json({ error: 'invalid_email', message: L0
        ? 'Indtast venligst en gyldig e-mailadresse, så vi kan sende din bekræftelse. Ring til os på +45 24 44 03 21, hvis du har brug for hjælp.'
        : 'Please enter a valid email address so we can send your confirmation. Call us on +45 24 44 03 21 if you need help.' }, { status: 400 });
    }
    const domain = em.split('@')[1];
    if (DISPOSABLE_DOMAINS.has(domain)) {
      return Response.json({ error: 'disposable_email', message: L0
        ? 'Brug venligst en rigtig e-mailadresse – midlertidige e-mails accepteres ikke. Ring til os på +45 24 44 03 21, hvis du har brug for hjælp.'
        : 'Please use a real email address – temporary emails are not accepted. Call us on +45 24 44 03 21 if you need help.' }, { status: 400 });
    }
    if (!(await emailDomainHasMail(domain))) {
      return Response.json({ error: 'invalid_email', message: L0
        ? 'Denne e-mailadresse ser ikke ud til at findes. Indtast venligst en rigtig e-mail, eller ring til os på +45 24 44 03 21.'
        : 'This email address does not appear to exist. Please enter a real email, or call us on +45 24 44 03 21.' }, { status: 400 });
    }
  }
  if (phone && !/^[\d\s\-\+\(\)]{6,25}$/.test(phone)) {
    return Response.json({ error: 'invalid_phone' }, { status: 400 });
  }
  if (name && name.length > 120) return Response.json({ error: 'name_too_long' }, { status: 400 });
  if (addr && addr.length > 200) return Response.json({ error: 'addr_too_long' }, { status: 400 });
  if (msg  && msg.length  > 1000) return Response.json({ error: 'msg_too_long'  }, { status: 400 });
  if (zip  && !/^\d{3,5}$/.test(zip.trim())) return Response.json({ error: 'invalid_zip' }, { status: 400 });
  if (zip) {
    const z = parseInt(zip.trim(), 10);
    if (z < 1000 || z > 4799 || (z >= 3700 && z <= 3790)) { // 37xx = Bornholm
      return Response.json({ error: 'outside_area', message: L0
        ? 'Vi dækker kun Sjælland (postnr. 1000–4799). Ring til os på +45 24 44 03 21, så finder vi en løsning.'
        : 'We only cover Zealand (postcodes 1000–4799). Call us on +45 24 44 03 21 and we will find a solution.' }, { status: 400 });
    }
  }

  // Current opening hours (manager-configurable) drive the slot grid + duration.
  const hours = await loadHours();
  const SLOT_TIMES = buildSlotTimes(hours);
  const slotsNeeded = carSlotCount(hours, carId);
  const L = lang !== 'en';

  let cancelToken = null;
  let bookedSlots = [];

  if (date && time) {
    /* date/time must be real, in the future (Copenhagen time), a known slot,
       and the whole duration must fit inside opening hours */
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !SLOT_TIMES.includes(time)) {
      return Response.json({
        error: 'invalid_slot',
        message: L ? 'Ugyldig dato eller tidspunkt. Prøv venligst igen.' : 'Invalid date or time. Please try again.',
      }, { status: 400 });
    }
    if (isClosedDay(hours, date)) {
      return Response.json({
        error: 'closed_day',
        message: L
          ? 'Vi holder lukket den valgte dag. Vælg venligst en anden dato.'
          : 'We are closed on the selected day. Please choose another date.',
      }, { status: 400 });
    }
    const startIdx = SLOT_TIMES.indexOf(time);
    if (startIdx + slotsNeeded > SLOT_TIMES.length) {
      const hrs = slotsNeeded / 2;
      return Response.json({
        error: 'slot_range',
        message: L
          ? `Denne bil kræver ${hrs} timer – vælg venligst et tidligere starttidspunkt.`
          : `This car needs ${hrs} hours – please choose an earlier start time.`,
      }, { status: 400 });
    }
    const now = cphNow();
    if (date < now.date || (date === now.date && toMinutes(time) <= now.minutes)) {
      return Response.json({
        error: 'slot_past',
        message: L
          ? 'Tidspunktet er allerede passeret. Vælg venligst et senere tidspunkt.'
          : 'That time has already passed. Please choose a later time.',
      }, { status: 400 });
    }
    // Slot keys live BOOKING_TTL (30 days) – a booking further out than that
    // would silently reappear as free before the appointment. Cap at 28 days.
    const maxDate = new Date(Date.parse(now.date + 'T00:00:00Z') + 28 * 86400000)
      .toISOString().slice(0, 10);
    if (date > maxDate) {
      return Response.json({
        error: 'too_far',
        message: L
          ? 'Der kan bookes højst 28 dage frem. Ring til os på +45 24 44 03 21 for tider længere ude.'
          : 'Bookings can be made up to 28 days ahead. Call us on +45 24 44 03 21 for later dates.',
      }, { status: 400 });
    }

    // Reserve atomically (SET NX) so two simultaneous customers can never
    // book the same hour; roll back partial reservations on a clash.
    cancelToken = secureToken(); // 64-char hex, cryptographically secure
    const bookedAt = new Date().toISOString();
    // The self-service cancel link works right up until the 24h-before-
    // appointment cutoff (matching the cancellation policy), not just 24h
    // after booking — a customer booking a week ahead can still cancel day 5.
    const cancelExpiresAt = new Date(cphEpoch(date, time) - 24 * 3600 * 1000).toISOString();

    for (let i = 0; i < slotsNeeded; i++) {
      const slotTime = SLOT_TIMES[startIdx + i];
      let got;
      try {
        got = await reserveSlot(slotKey(date, slotTime), { name: name || 'unknown', bookedAt, token: cancelToken });
      } catch (err) {
        console.error('[book] KV error during reservation — aborting', err?.message);
        if (bookedSlots.length) await releaseSlots(date, bookedSlots, null);
        return Response.json({
          error: 'store_failed',
          message: L
            ? 'Vi kunne desværre ikke gennemføre din booking online lige nu. Ring venligst til os på +45 24 44 03 21, så booker vi din tid med det samme.'
            : 'We could not complete your booking online right now. Please call us on +45 24 44 03 21 and we will book your time straight away.',
        }, { status: 503 });
      }
      if (!got) {
        if (bookedSlots.length) await releaseSlots(date, bookedSlots, null);
        return Response.json({
          error: 'slot_taken',
          message: L
            ? 'Dette tidspunkt er desværre lige blevet booket. Vælg venligst et andet tidspunkt.'
            : 'This time slot was just booked. Please choose a different time.',
        }, { status: 409 });
      }
      bookedSlots.push(slotTime);
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
    // If the record can't be stored, release the slots: a red slot must
    // ALWAYS have a matching booking visible in the admin.
    try {
      const kv = await getKV();
      if (kv) {
        await kv.set(`booking:${cancelToken}`, JSON.stringify(bookingRecord), { ex: BOOKING_TTL });
      } else {
        memBookings.set(cancelToken, bookingRecord);
      }
    } catch (err) {
      console.error('[book] booking record store FAILED — releasing slots', err?.message);
      await releaseSlots(date, bookedSlots, cancelToken);
      return Response.json({
        error: 'store_failed',
        message: L
          ? 'Vi kunne desværre ikke gennemføre din booking online lige nu. Ring venligst til os på +45 24 44 03 21, så booker vi din tid med det samme.'
          : 'We could not complete your booking online right now. Please call us on +45 24 44 03 21 and we will book your time straight away.',
      }, { status: 503 });
    }

  }

  // Derive site URL from the incoming request so the cancel link always works
  // regardless of which Vercel deployment or domain is active.
  // NEXT_PUBLIC_SITE_URL env var can override if needed.
  const reqUrl = new URL(request.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL ||
    `${reqUrl.protocol}//${reqUrl.host}`;

  const extrasStr = extras?.length ? (Array.isArray(extras) ? extras.join(', ') : extras) : (L ? 'Ingen' : 'None');
  const cancelLink = cancelToken ? `${siteUrl}/annuller?token=${cancelToken}` : null;
  const senderUser = process.env.SMTP_USER || process.env.GMAIL_USER || BOOKING_EMAIL;

  const transport = buildTransport();

  // A booking nobody is notified about is worse than no booking: if we can't
  // even email the company, release the slot so it doesn't stay red, and tell
  // the customer to call instead of falsely showing "confirmed".
  const notifyFailed = async (reason) => {
    console.error(`[book] notification failed (${reason}) — releasing slots`, { date, time });
    if (date && bookedSlots.length) await releaseSlots(date, bookedSlots, cancelToken);
    return Response.json({
      error: 'notify_failed',
      message: L
        ? 'Vi kunne desværre ikke bekræfte din booking online lige nu. Ring venligst til os på +45 24 44 03 21, så booker vi din tid med det samme.'
        : 'We could not confirm your booking online right now. Please call us on +45 24 44 03 21 and we will book your time straight away.',
    }, { status: 503 });
  };

  if (!transport) {
    return await notifyFailed('no_smtp');
  }

  {
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
              ${tr('Adresse', addr ? `<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${addr}, ${zip} ${city}`)}" style="color:#0d4a25;font-weight:700">${esc(addr)}, ${esc(zip)} ${esc(city)} 📍</a>` : '-')}
              ${tr('Bil', esc(car) || '-', true)}
              ${tr('Pakke', esc(pkg) || '-')}
              ${tr('Tilvalg', esc(extrasStr), true)}
              ${tr('Anslået pris', esc(price) || '-')}
            </table>
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:20px;border-top:2px solid #e0e8e3">
              ${tr('Navn', esc(name) || '-', true)}
              ${tr('Telefon', `<a href="tel:${esc((phone||'').replace(/[^\d+]/g,''))}" style="color:#0d4a25">${esc(phone) || '-'}</a>`)}
              ${tr('Email', email ? `<a href="mailto:${esc(email)}" style="color:#0d4a25">${esc(email)}</a>` : '-', true)}
              ${msg ? tr('Besked', esc(msg)) : ''}
            </table>
          `,
        }),
      });
    } catch (err) {
      return await notifyFailed('company_email:' + err.message);
    }

    // ── Customer confirmation ────────────────────────────────────────────────
    if (email) {
      try {
        await transport.sendMail({
          from: `"Elite Vask" <${senderUser}>`,
          to: email,
          bcc: 'elite-vask.dk+55afb24837@invite.trustpilot.com',
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
                ${L ? `Hej ${esc(name) || ''},` : `Hi ${esc(name) || ''},`}<br><br>
                ${L
                  ? 'Vi har modtaget din bookingforespørgsel og vender tilbage hurtigst muligt for at bekræfte tid og endelig pris.'
                  : "We've received your booking request and will get back to you as soon as possible to confirm the time and final price."}
              </p>

              <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">
                ${tr(L ? 'Dato & tid' : 'Date & time', `${fmtDate(date, L)} · kl. ${time}`, true)}
                ${tr(L ? 'Bil' : 'Car', esc(car) || '-')}
                ${tr(L ? 'Pakke' : 'Package', esc(pkg) || '-', true)}
                ${extras?.length ? tr(L ? 'Tilvalg' : 'Add-ons', esc(extrasStr)) : ''}
                ${tr(L ? 'Adresse' : 'Address', esc(`${addr || ''}, ${zip || ''} ${city || ''}`), true)}
                ${tr(L ? 'Anslået pris' : 'Est. price', `<strong style="color:#0d4a25;font-size:15px">${esc(price) || '-'}</strong>`)}
              </table>

              ${cancelLink ? `
              <p style="font-size:13px;color:#777;margin:0 0 20px;line-height:1.7">
                ${L
                  ? `Skal du alligevel ikke bruge tiden? <a href="${cancelLink}" style="color:#0d4a25;font-weight:600">Annullér din booking her</a> (kan bruges indtil 24 timer før din tid).`
                  : `Need to cancel? <a href="${cancelLink}" style="color:#0d4a25;font-weight:600">Cancel your booking here</a> (usable until 24 hours before your appointment).`}
              </p>` : ''}


              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px">
                <tr><td style="background:#fff8e6;border-left:4px solid #f5a623;border-radius:0 8px 8px 0;padding:12px 16px">
                  <p style="margin:0;font-size:13px;color:#7a5c00;line-height:1.6">
                    <strong>${L ? '⚠️ Afbud / ændring' : '⚠️ Cancellation policy'}</strong><br>
                    ${L
                      ? 'Ønsker du at aflyse eller ændre din booking, bedes du kontakte os <strong>mindst 24 timer i forvejen</strong>.'
                      : 'If you need to cancel or change your booking, please contact us <strong>at least 24 hours in advance</strong>.'}
                    <br><a href="tel:+4524440321" style="color:#0d4a25;font-weight:700">+45 24 44 03 21</a>
                  </p>
                </td></tr>
              </table>

              <p style="font-size:13px;color:#777;margin:0 0 16px;line-height:1.7">
                ${L
                  ? `Spørgsmål? Ring til os på <a href="tel:+4524440321" style="color:#0d4a25;font-weight:600">+45 24 44 03 21</a> eller skriv til <a href="mailto:${CONTACT_EMAIL}" style="color:#0d4a25">${CONTACT_EMAIL}</a>.`
                  : `Questions? Call us on <a href="tel:+4524440321" style="color:#0d4a25;font-weight:600">+45 24 44 03 21</a> or email <a href="mailto:${CONTACT_EMAIL}" style="color:#0d4a25">${CONTACT_EMAIL}</a>.`}
              </p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px">
                <tr><td style="background:linear-gradient(135deg,#0d4a25 0%,#0a3a1c 100%);border-radius:12px;padding:28px 24px;text-align:center">
                  <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,.5)">
                    ${L ? 'Din mening betyder alt' : 'Your opinion means everything'}
                  </p>
                  <p style="margin:0 0 6px;font-size:22px;color:#ffffff;font-weight:700;line-height:1.3">
                    ${L ? 'Var du tilfreds?' : 'Were you satisfied?'}
                  </p>
                  <p style="margin:0 0 20px;font-size:13px;color:rgba(255,255,255,.65);line-height:1.6;max-width:320px;margin-left:auto;margin-right:auto">
                    ${L
                      ? 'En kort anmeldelse på Google tager kun 30 sekunder – og hjælper andre med at finde os. Vi sætter stor pris på det.'
                      : 'A short review on Google takes only 30 seconds – and helps others find us. We really appreciate it.'}
                  </p>
                  <p style="margin:0 0 20px;font-size:24px;letter-spacing:3px;color:#FBBC05">★★★★★</p>
                  <a href="https://www.google.com/maps?cid=14890071893602568107&action=write_review" style="display:inline-flex;align-items:center;gap:10px;background:#ffffff;border-radius:50px;padding:13px 28px;text-decoration:none;font-weight:700;font-size:14px;color:#0d4a25;box-shadow:0 4px 20px rgba(0,0,0,.3)">
                    <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    ${L ? 'Skriv en anmeldelse' : 'Write a review'}
                  </a>
                </td></tr>
              </table>
              <p style="font-size:12px;color:#aaa;margin:0;line-height:1.6;border-top:1px solid #eee;padding-top:14px">
                ${L
                  ? '📬 Modtager du ikke vores e-mails? Tjek venligst din spam- eller junk-mappe og markér os som sikker afsender.'
                  : "📬 Not receiving our emails? Please check your spam or junk folder and mark us as a safe sender."}
              </p>
            `,
          }),
        });
        // confirmation sent
      } catch (err) {
        console.error(`[book] Customer email FAILED to ${email}:`, err.message);
      }
    }

    // Index booking by email for the customer portal – only AFTER the
    // notification went out, so a released ghost booking never leaves a
    // dangling token in the user's portal index.
    if (email && cancelToken) {
      try {
        const kv2 = await getKV();
        if (kv2) {
          const emailHash = hashEmail(email);
          await kv2.sadd(`user:bookings:${emailHash}`, cancelToken);
        }
      } catch {}
    }

    return Response.json({ ok: true, ...(cancelToken ? { token: cancelToken } : {}) });
  }
}
