import nodemailer from 'nodemailer';

const COMPANY_EMAIL = 'elitevask01@gmail.com';
const SITE_URL = 'https://elitevask.vercel.app';

// In-memory fallback (works within same serverless instance)
const memSlots = new Map();
const memBookings = new Map();

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

async function storeBooking(token, value) {
  try {
    const kv = await getKV();
    if (kv) { await kv.set(`booking:${token}`, JSON.stringify(value), { ex: 60 * 60 * 24 * 30 }); return; }
  } catch {}
  memBookings.set(token, value);
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

  // Generate cancellation token
  const token = crypto.randomUUID();
  const bookedAt = new Date().toISOString();

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
    // Check all slots needed for this car's duration are free
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

    // Collect booked slot times
    const bookedSlots = [];
    const startIdx2 = SLOT_TIMES.indexOf(time);
    for (let i = 0; i < slotsNeeded; i++) {
      const slotTime = SLOT_TIMES[startIdx2 + i];
      if (!slotTime) break;
      bookedSlots.push(slotTime);
      await bookSlot(slotKey(date, slotTime), { name: name || 'unknown', bookedAt, token });
    }

    // Store booking record
    await storeBooking(token, {
      date, time, carId, slotsNeeded, name, email, phone, car, pkg, price, lang,
      slots: bookedSlots, bookedAt,
      extras, addr, zip, city, msg,
    });
  }

  const L = lang !== 'en';
  const extrasStr = extras?.length ? (Array.isArray(extras) ? extras.join(', ') : extras) : (L ? 'Ingen' : 'None');
  const cancelLink = `${SITE_URL}/cancel?token=${token}`;

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
    '',
    (L ? 'Annulleringslink' : 'Cancellation link') + ': ' + cancelLink,
  ].join('\n');

  const html = text
    .replace(/\n/g, '<br>')
    .replace('🚗 Ny bookinganmodning – Elite Vask', '<strong style="font-size:18px">🚗 Ny bookinganmodning – Elite Vask</strong>')
    .replace('🚗 New booking request – Elite Vask', '<strong style="font-size:18px">🚗 New booking request – Elite Vask</strong>');

  const subject = 'Booking: ' + (car || '') + ' – ' + (date || '') + ' ' + (time || '');

  const transport = buildTransport();

  if (transport) {
    try {
      // Send to company
      await transport.sendMail({
        from: `"Elite Vask Booking" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
        to: COMPANY_EMAIL,
        subject,
        text,
        html: `<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:12px">${html}</div>`,
        replyTo: email || undefined,
      });

      // Send confirmation to customer if email provided
      if (email) {
        const customerSubject = L ? 'Bookingbekræftelse – Elite Vask' : 'Booking Confirmation – Elite Vask';
        const customerText = L ? [
          `Hej ${name || ''},`,
          '',
          'Tak for din booking hos Elite Vask! Vi har modtaget din forespørgsel og vender tilbage med bekræftelse.',
          '',
          '--- Din booking ---',
          'Bil: ' + (car || '-'),
          'Pakke: ' + (pkg || '-'),
          'Dato & tid: ' + (date || '-') + ' ' + (time || ''),
          'Anslået pris: ' + (price || '-'),
          '',
          'Ønsker du at aflyse din booking, kan du gøre det via linket nedenfor senest 24 timer før den aftalte tid:',
          cancelLink,
          '',
          'Med venlig hilsen',
          'Elite Vask',
          'Tlf: +45 24 44 03 21',
          'elitevask01@gmail.com',
        ].join('\n') : [
          `Hi ${name || ''},`,
          '',
          'Thank you for booking with Elite Vask! We have received your request and will confirm shortly.',
          '',
          '--- Your booking ---',
          'Car: ' + (car || '-'),
          'Package: ' + (pkg || '-'),
          'Date & time: ' + (date || '-') + ' ' + (time || ''),
          'Estimated price: ' + (price || '-'),
          '',
          'To cancel your booking, use the link below at least 24 hours before your appointment:',
          cancelLink,
          '',
          'Best regards,',
          'Elite Vask',
          'Phone: +45 24 44 03 21',
          'elitevask01@gmail.com',
        ].join('\n');

        const customerHtmlBody = L ? `
<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:12px;color:#222">
  <h2 style="color:#0f5a30;margin-bottom:16px">Bookingbekræftelse – Elite Vask</h2>
  <p>Hej ${name || ''},</p>
  <p>Tak for din booking hos Elite Vask! Vi har modtaget din forespørgsel og vender tilbage med bekræftelse.</p>
  <div style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:16px;margin:20px 0">
    <strong style="display:block;margin-bottom:10px;color:#0f5a30">Din booking</strong>
    <p style="margin:4px 0"><strong>Bil:</strong> ${car || '-'}</p>
    <p style="margin:4px 0"><strong>Pakke:</strong> ${pkg || '-'}</p>
    <p style="margin:4px 0"><strong>Dato &amp; tid:</strong> ${date || '-'} ${time || ''}</p>
    <p style="margin:4px 0"><strong>Anslået pris:</strong> ${price || '-'}</p>
  </div>
  <p>Ønsker du at aflyse din booking, kan du gøre det via linket nedenfor senest <strong>24 timer</strong> før den aftalte tid:</p>
  <p><a href="${cancelLink}" style="color:#22a35a;font-weight:bold">${cancelLink}</a></p>
  <p style="color:#666;font-size:13px;margin-top:24px">Med venlig hilsen<br><strong>Elite Vask</strong><br>Tlf: +45 24 44 03 21</p>
</div>` : `
<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:12px;color:#222">
  <h2 style="color:#0f5a30;margin-bottom:16px">Booking Confirmation – Elite Vask</h2>
  <p>Hi ${name || ''},</p>
  <p>Thank you for booking with Elite Vask! We have received your request and will confirm shortly.</p>
  <div style="background:#fff;border:1px solid #e0e0e0;border-radius:8px;padding:16px;margin:20px 0">
    <strong style="display:block;margin-bottom:10px;color:#0f5a30">Your Booking</strong>
    <p style="margin:4px 0"><strong>Car:</strong> ${car || '-'}</p>
    <p style="margin:4px 0"><strong>Package:</strong> ${pkg || '-'}</p>
    <p style="margin:4px 0"><strong>Date &amp; time:</strong> ${date || '-'} ${time || ''}</p>
    <p style="margin:4px 0"><strong>Estimated price:</strong> ${price || '-'}</p>
  </div>
  <p>To cancel your booking, use the link below at least <strong>24 hours</strong> before your appointment:</p>
  <p><a href="${cancelLink}" style="color:#22a35a;font-weight:bold">${cancelLink}</a></p>
  <p style="color:#666;font-size:13px;margin-top:24px">Best regards,<br><strong>Elite Vask</strong><br>Phone: +45 24 44 03 21</p>
</div>`;

        await transport.sendMail({
          from: `"Elite Vask" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
          to: email,
          subject: customerSubject,
          text: customerText,
          html: customerHtmlBody,
        });
      }

      return Response.json({ ok: true, token });
    } catch (err) {
      console.error('Email error:', err.message);
      return Response.json({ ok: false, error: 'email_failed' }, { status: 500 });
    }
  }

  console.warn('[book] No SMTP configured — GMAIL_PASS missing. Booking logged only.');
  console.log('BOOKING (no SMTP):\n' + text);
  return Response.json({ ok: true, token, warn: 'no_smtp' });
}
