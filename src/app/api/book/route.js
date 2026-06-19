import nodemailer from 'nodemailer';
import { randomBytes } from 'crypto';

const COMPANY_EMAIL = 'elitevask01@gmail.com';
const SITE_URL = 'https://elitevask.vercel.app';
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

function buildTransport() {
  const user = process.env.GMAIL_USER || COMPANY_EMAIL;
  const pass = process.env.GMAIL_PASS;
  if (!pass) return null;
  return nodemailer.createTransport({ host: 'smtp.gmail.com', port: 465, secure: true, auth: { user, pass } });
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
  }

  const extrasStr = extras?.length ? (Array.isArray(extras) ? extras.join(', ') : extras) : (L ? 'Ingen' : 'None');
  const cancelLink = cancelToken ? `${SITE_URL}/cancel?token=${cancelToken}` : null;

  const textLines = [
    L ? '🚗 Ny bookinganmodning – Elite Vask' : '🚗 New booking request – Elite Vask',
    '',
    (L ? 'Bil' : 'Car') + ': ' + (car || '-'),
    (L ? 'Pakke' : 'Package') + ': ' + (pkg || '-'),
    (L ? 'Tilvalg' : 'Add-ons') + ': ' + extrasStr,
    '',
    (L ? 'Dato & tid' : 'Date & time') + ': ' + (date || '-') + ' ' + (time || ''),
    (L ? 'Adresse' : 'Address') + ': ' + (addr || '-') + ', ' + (zip || '') + ' ' + (city || ''),
    '',
    (L ? 'Navn' : 'Name') + ': ' + (name || '-'),
    (L ? 'Telefon' : 'Phone') + ': ' + (phone || '-'),
    'Email: ' + (email || '-'),
    (L ? 'Besked' : 'Message') + ': ' + (msg || '-'),
    '',
    (L ? 'Anslået pris' : 'Estimated price') + ': ' + (price || '-'),
    ...(cancelLink ? ['', (L ? 'Annulleringslink (24t)' : 'Cancel link (24h)') + ': ' + cancelLink] : []),
  ];

  const subject = 'Booking: ' + (car || '') + ' – ' + (date || '') + ' ' + (time || '');
  const transport = buildTransport();

  if (transport) {
    try {
      // Company email
      await transport.sendMail({
        from: `"Elite Vask Booking" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
        to: COMPANY_EMAIL,
        subject,
        text: textLines.join('\n'),
        html: `<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:12px">${textLines.join('<br>').replace(textLines[0], `<strong style="font-size:18px">${textLines[0]}</strong>`)}</div>`,
        replyTo: email || undefined,
      });

      // Customer confirmation email
      if (email) {
        await transport.sendMail({
          from: `"Elite Vask" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
          to: email,
          subject: L ? `Bookingbekræftelse – ${fmtDate(date, true)} kl. ${time}` : `Booking confirmation – ${fmtDate(date, false)} at ${time}`,
          html: `<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:12px">
            <h2 style="color:#1a7a3f;margin-bottom:4px">✅ ${L ? 'Tak for din booking!' : 'Thank you for your booking!'}</h2>
            <p style="color:#555;margin-bottom:20px">${L ? `Hej ${name || ''},<br>Vi har modtaget din anmodning og kontakter dig hurtigst muligt for at bekræfte.` : `Hi ${name || ''},<br>We've received your request and will contact you shortly to confirm.`}</p>
            <table style="width:100%;border-collapse:collapse;margin:0 0 20px;font-size:14px">
              <tr><td style="padding:10px 12px;background:#e8f5ee;color:#555;width:40%">${L ? 'Dato & tid' : 'Date & time'}</td><td style="padding:10px 12px;background:#e8f5ee;font-weight:600">${fmtDate(date, L)} · kl. ${time}</td></tr>
              <tr><td style="padding:10px 12px;color:#555">${L ? 'Bil' : 'Car'}</td><td style="padding:10px 12px;font-weight:600">${car || '-'}</td></tr>
              <tr><td style="padding:10px 12px;background:#e8f5ee;color:#555">${L ? 'Pakke' : 'Package'}</td><td style="padding:10px 12px;background:#e8f5ee;font-weight:600">${pkg || '-'}</td></tr>
              <tr><td style="padding:10px 12px;color:#555">${L ? 'Adresse' : 'Address'}</td><td style="padding:10px 12px;font-weight:600">${addr || ''}, ${zip || ''} ${city || ''}</td></tr>
              <tr><td style="padding:10px 12px;background:#e8f5ee;color:#555">${L ? 'Anslået pris' : 'Est. price'}</td><td style="padding:10px 12px;background:#e8f5ee;font-weight:600">${price || '-'}</td></tr>
            </table>
            ${cancelLink ? `
            <div style="background:#fff8f8;border:1px solid #fdd;border-radius:8px;padding:16px;margin-bottom:20px">
              <p style="font-size:13px;color:#666;margin-bottom:10px">${L ? '⏱ Annulleringslink er gyldigt i 24 timer. Annullering bedes ske senest 24 timer inden aftalt tid.' : '⏱ Cancellation link valid for 24 hours. Please cancel at least 24 hours before the scheduled time.'}</p>
              <a href="${cancelLink}" style="display:inline-block;background:#e74c3c;color:#fff;padding:10px 20px;border-radius:6px;text-decoration:none;font-weight:700;font-size:14px">${L ? 'Annuller booking' : 'Cancel booking'}</a>
            </div>` : ''}
            <p style="font-size:13px;color:#999">${L ? 'Spørgsmål? +45 24 44 03 21 · elitevask01@gmail.com' : 'Questions? +45 24 44 03 21 · elitevask01@gmail.com'}</p>
          </div>`,
        });
      }

      return Response.json({ ok: true, ...(cancelToken ? { token: cancelToken } : {}) });
    } catch (err) {
      console.error('Email error:', err.message);
      return Response.json({ ok: false, error: 'email_failed' }, { status: 500 });
    }
  }

  console.warn('[book] No SMTP — booking logged only.');
  console.log('BOOKING:\n' + textLines.join('\n'));
  return Response.json({ ok: true, warn: 'no_smtp', ...(cancelToken ? { token: cancelToken } : {}) });
}
