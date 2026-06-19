import nodemailer from 'nodemailer';
import { randomUUID } from 'crypto';

const COMPANY_EMAIL = 'elitevask01@gmail.com';
const SITE_URL = 'https://elitevask.vercel.app';

// In-memory fallback (works within same serverless instance)
const memSlots = new Map();

let kvClient = null;
async function getKV() {
  if (kvClient) return kvClient;
  try {
    const { Redis } = await import('@upstash/redis');
    // Support both default KV_ prefix and STORAGE_ prefix from Upstash integration
    const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
    const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
    if (!url || !token) return null;
    kvClient = new Redis({ url, token });
    return kvClient;
  } catch {
    return null;
  }
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
    if (kv) { await kv.set(key, JSON.stringify(value), { ex: 60 * 60 * 24 * 30 }); return; }
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

function slotKey(date, time) {
  return `slot:${date}:${time}`;
}

const SLOT_TIMES = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

function buildTransport() {
  const user = process.env.GMAIL_USER || COMPANY_EMAIL;
  const pass = process.env.GMAIL_PASS;
  if (!pass) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user, pass },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  if (!date) return Response.json({ booked: [] });
  try {
    const times = await getBookedSlots(date);
    return Response.json({ booked: times });
  } catch {
    return Response.json({ booked: [] });
  }
}

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { car, pkg, extras, addr, zip, city, date, time, name, phone, email, msg, price, lang, carId, slotsNeeded: rawSlots } = body;
  const CAR_SLOTS = { lille: 2, mellem: 3, stor: 4, varebil: 3 };
  const slotsNeeded = CAR_SLOTS[carId] || Math.max(1, Math.min(parseInt(rawSlots) || 2, 5));

  let cancelToken = null;

  if (date && time) {
    const nowInCph = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Copenhagen' });
    const nowUtc = new Date().toLocaleString('sv-SE', { timeZone: 'UTC' });
    const cphOffsetMs = (new Date(nowInCph) - new Date(nowUtc));
    const slotMsFinal = new Date(`${date}T${time}:00Z`).getTime() - cphOffsetMs;
    if (slotMsFinal < Date.now()) {
      const L = lang !== 'en';
      return Response.json({
        error: 'slot_past',
        message: L
          ? 'Dette tidspunkt er allerede passeret. Vælg venligst et fremtidigt tidspunkt.'
          : 'This time slot is in the past. Please choose a future time.',
      }, { status: 409 });
    }

    const L = lang !== 'en';
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
    cancelToken = randomUUID();
    const bookedSlots = [];
    for (let i = 0; i < slotsNeeded; i++) {
      const slotTime = SLOT_TIMES[startIdx + i];
      if (!slotTime) break;
      bookedSlots.push(slotTime);
      await bookSlot(slotKey(date, slotTime), { name: name || 'unknown', bookedAt: new Date().toISOString(), token: cancelToken });
    }
    try {
      const kv = await getKV();
      if (kv) {
        await kv.set(`booking:${cancelToken}`, JSON.stringify({
          date, time, car, pkg, price, lang,
          carId, slotsNeeded, slots: bookedSlots,
          name, phone, email, msg,
          bookedAt: new Date().toISOString(),
        }), { ex: 60 * 60 * 24 * 30 });
      }
    } catch {}
  }

  const L = lang !== 'en';
  const extrasStr = extras?.length ? (Array.isArray(extras) ? extras.join(', ') : extras) : (L ? 'Ingen' : 'None');
  const cancelLink = cancelToken ? `${SITE_URL}/cancel?token=${cancelToken}` : null;

  const text = [
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
    ...(cancelLink ? ['', (L ? 'Annulleringslink' : 'Cancel link') + ': ' + cancelLink] : []),
  ].join('\n');

  const companyHtml = text
    .replace(/\n/g, '<br>')
    .replace('🚗 Ny bookinganmodning – Elite Vask', '<strong style="font-size:18px">🚗 Ny bookinganmodning – Elite Vask</strong>')
    .replace('🚗 New booking request – Elite Vask', '<strong style="font-size:18px">🚗 New booking request – Elite Vask</strong>');

  const subject = 'Booking: ' + (car || '') + ' – ' + (date || '') + ' ' + (time || '');
  const transport = buildTransport();

  if (transport) {
    try {
      // Email to company
      await transport.sendMail({
        from: `"Elite Vask Booking" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
        to: COMPANY_EMAIL,
        subject,
        text,
        html: `<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:12px">${companyHtml}</div>`,
        replyTo: email || undefined,
      });

      // Confirmation email to customer
      if (email) {
        const fmt = (d) => {
          if (!d) return d;
          const [y, m, day] = d.split('-');
          const months = L
            ? ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec']
            : ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
          return `${parseInt(day)}. ${months[parseInt(m)-1]} ${y}`;
        };
        await transport.sendMail({
          from: `"Elite Vask" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
          to: email,
          subject: L ? `Bookingbekræftelse – ${fmt(date)} ${time}` : `Booking confirmation – ${fmt(date)} ${time}`,
          html: `<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:12px">
            <h2 style="color:#1a7a3f">✅ ${L ? 'Tak for din booking!' : 'Thank you for your booking!'}</h2>
            <p>${L ? `Hej ${name || ''},` : `Hi ${name || ''},`}</p>
            <p>${L ? 'Vi har modtaget din bookinganmodning og vender tilbage hurtigst muligt for at bekræfte tid og pris.' : 'We have received your booking request and will get back to you as soon as possible to confirm the time and price.'}</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:8px;color:#666">${L ? 'Dato & tid' : 'Date & time'}</td><td style="padding:8px;font-weight:600">${fmt(date)} · ${time || ''}</td></tr>
              <tr style="background:#f0f0f0"><td style="padding:8px;color:#666">${L ? 'Bil' : 'Car'}</td><td style="padding:8px;font-weight:600">${car || '-'}</td></tr>
              <tr><td style="padding:8px;color:#666">${L ? 'Pakke' : 'Package'}</td><td style="padding:8px;font-weight:600">${pkg || '-'}</td></tr>
              <tr style="background:#f0f0f0"><td style="padding:8px;color:#666">${L ? 'Adresse' : 'Address'}</td><td style="padding:8px;font-weight:600">${addr || ''}, ${zip || ''} ${city || ''}</td></tr>
              <tr><td style="padding:8px;color:#666">${L ? 'Anslået pris' : 'Estimated price'}</td><td style="padding:8px;font-weight:600">${price || '-'}</td></tr>
            </table>
            ${cancelLink ? `
            <hr style="margin:20px 0;border:none;border-top:1px solid #ddd">
            <p style="font-size:14px;color:#555">${L ? 'Ønsker du at annullere din booking, kan du gøre det ved at klikke på knappen herunder. Annullering bedes ske senest 24 timer inden aftalt tid.' : 'If you wish to cancel your booking, you can do so by clicking the button below. Please cancel at least 24 hours before the scheduled time.'}</p>
            <a href="${cancelLink}" style="display:inline-block;background:#e74c3c;color:#fff;padding:10px 20px;border-radius:8px;text-decoration:none;font-weight:700;font-size:14px">${L ? 'Annuller booking' : 'Cancel booking'}</a>
            ` : ''}
            <hr style="margin:20px 0;border:none;border-top:1px solid #ddd">
            <p style="font-size:13px;color:#888">${L ? 'Spørgsmål? Ring til os på +45 24 44 03 21 eller skriv til elitevask01@gmail.com' : 'Questions? Call us at +45 24 44 03 21 or email elitevask01@gmail.com'}</p>
          </div>`,
        });
      }

      return Response.json({ ok: true, ...(cancelToken ? { token: cancelToken } : {}) });
    } catch (err) {
      console.error('Email error:', err.message);
      return Response.json({ ok: false, error: 'email_failed' }, { status: 500 });
    }
  }

  console.warn('[book] No SMTP configured — GMAIL_PASS missing. Booking logged only.');
  console.log('BOOKING (no SMTP):\n' + text);
  return Response.json({ ok: true, warn: 'no_smtp', ...(cancelToken ? { token: cancelToken } : {}) });
}
