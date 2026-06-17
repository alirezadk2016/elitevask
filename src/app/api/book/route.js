import nodemailer from 'nodemailer';

const COMPANY_EMAIL = 'elitevask01@gmail.com';

let kvClient = null;
async function getKV() {
  if (kvClient) return kvClient;
  try {
    const { kv } = await import('@vercel/kv');
    kvClient = kv;
    return kv;
  } catch {
    return null;
  }
}

function slotKey(date, time) {
  return `slot:${date}:${time}`;
}

function buildTransport() {
  const user = process.env.GMAIL_USER || COMPANY_EMAIL;
  const pass = process.env.GMAIL_PASS;
  if (!pass) return null;
  return nodemailer.createTransport({
    service: 'gmail',
    auth: { user, pass },
  });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  if (!date) return Response.json({ booked: [] });

  try {
    const kv = await getKV();
    if (!kv) return Response.json({ booked: [] });
    const keys = await kv.keys(`slot:${date}:*`);
    const times = keys.map((k) => k.split(':').slice(2).join(':'));
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

  const { car, pkg, extras, addr, zip, city, date, time, name, phone, email, msg, price, lang } = body;

  if (date && time) {
    try {
      const kv = await getKV();
      if (kv) {
        const key = slotKey(date, time);
        const existing = await kv.get(key);
        if (existing) {
          const L = lang !== 'en';
          return Response.json({
            error: 'slot_taken',
            message: L
              ? 'Dette tidspunkt er desværre allerede booket. Vælg venligst et andet tidspunkt.'
              : 'This time slot is already booked. Please choose a different time.',
          }, { status: 409 });
        }
        await kv.set(key, { name: name || 'unknown', bookedAt: new Date().toISOString() }, { ex: 60 * 60 * 24 * 30 });
      }
    } catch (kvErr) {
      console.error('KV error:', kvErr.message);
    }
  }

  const L = lang !== 'en';
  const extrasStr = extras?.length ? (Array.isArray(extras) ? extras.join(', ') : extras) : (L ? 'Ingen' : 'None');

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
  ].join('\n');

  const html = text
    .replace(/\n/g, '<br>')
    .replace('🚗 Ny bookinganmodning – Elite Vask', '<strong style="font-size:18px">🚗 Ny bookinganmodning – Elite Vask</strong>')
    .replace('🚗 New booking request – Elite Vask', '<strong style="font-size:18px">🚗 New booking request – Elite Vask</strong>');

  const subject = 'Booking: ' + (car || '') + ' – ' + (date || '') + ' ' + (time || '');

  const transport = buildTransport();

  if (transport) {
    try {
      await transport.sendMail({
        from: `"Elite Vask Booking" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
        to: COMPANY_EMAIL,
        subject,
        text,
        html: `<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:12px">${html}</div>`,
        replyTo: email || undefined,
      });
      return Response.json({ ok: true });
    } catch (err) {
      console.error('Email error:', err.message);
      return Response.json({ ok: false, error: 'email_failed' }, { status: 500 });
    }
  }

  console.log('BOOKING (no SMTP):\n' + text);
  return Response.json({ ok: true, warn: 'no_smtp' });
}
