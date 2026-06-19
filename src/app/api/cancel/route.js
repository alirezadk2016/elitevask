import nodemailer from 'nodemailer';

const COMPANY_EMAIL = 'elitevask01@gmail.com';

// In-memory fallback
const memBookings = new Map();

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
  } catch {
    return null;
  }
}

async function getBooking(token) {
  try {
    const kv = await getKV();
    if (kv) {
      const raw = await kv.get(`booking:${token}`);
      if (!raw) return null;
      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    }
  } catch {}
  return memBookings.get(token) || null;
}

async function deleteBooking(token) {
  try {
    const kv = await getKV();
    if (kv) { await kv.del(`booking:${token}`); return; }
  } catch {}
  memBookings.delete(token);
}

async function deleteSlot(date, slotTime) {
  try {
    const kv = await getKV();
    if (kv) { await kv.del(`slot:${date}:${slotTime}`); return; }
  } catch {}
}

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

// GET ?token=xxx — return booking details (sanitized)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get('token');
  if (!token) return Response.json({ error: 'Missing token' }, { status: 400 });

  const booking = await getBooking(token);
  if (!booking) return Response.json({ error: 'not_found' }, { status: 404 });

  // Return sanitized booking (no internal fields like token itself)
  return Response.json({
    date: booking.date,
    time: booking.time,
    car: booking.car,
    pkg: booking.pkg,
    price: booking.price,
    name: booking.name,
    lang: booking.lang,
    bookedAt: booking.bookedAt,
  });
}

// POST {token} — cancel the booking
export async function POST(request) {
  let body;
  try { body = await request.json(); } catch {
    return Response.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { token } = body;
  if (!token) return Response.json({ error: 'Missing token' }, { status: 400 });

  const booking = await getBooking(token);
  if (!booking) {
    return Response.json({ error: 'not_found', message: 'Booking ikke fundet eller allerede annulleret.' }, { status: 404 });
  }

  // Delete all slot keys
  if (booking.date && Array.isArray(booking.slots)) {
    for (const slotTime of booking.slots) {
      await deleteSlot(booking.date, slotTime);
    }
  }

  // Delete booking record
  await deleteBooking(token);

  const L = booking.lang !== 'en';
  const transport = buildTransport();

  if (transport) {
    // Notify company
    const companyText = [
      L ? 'Booking annulleret – Elite Vask' : 'Booking cancelled – Elite Vask',
      '',
      (L ? 'Navn' : 'Name') + ': ' + (booking.name || '-'),
      (L ? 'Bil' : 'Car') + ': ' + (booking.car || '-'),
      (L ? 'Pakke' : 'Package') + ': ' + (booking.pkg || '-'),
      (L ? 'Dato & tid' : 'Date & time') + ': ' + (booking.date || '-') + ' ' + (booking.time || ''),
      'Email: ' + (booking.email || '-'),
      (L ? 'Telefon' : 'Phone') + ': ' + (booking.phone || '-'),
    ].join('\n');

    try {
      await transport.sendMail({
        from: `"Elite Vask Booking" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
        to: COMPANY_EMAIL,
        subject: (L ? 'Annulleret booking: ' : 'Cancelled booking: ') + (booking.car || '') + ' – ' + (booking.date || '') + ' ' + (booking.time || ''),
        text: companyText,
        html: `<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#fff3f3;border-radius:12px;border-left:4px solid #e74c3c">${companyText.replace(/\n/g, '<br>')}</div>`,
      });
    } catch (err) {
      console.error('Company cancel email error:', err.message);
    }

    // Confirm to customer
    if (booking.email) {
      const customerSubject = L ? 'Din booking er annulleret – Elite Vask' : 'Your booking has been cancelled – Elite Vask';
      const customerText = L ? [
        `Hej ${booking.name || ''},`,
        '',
        'Din booking hos Elite Vask er nu annulleret.',
        '',
        'Annulleret booking:',
        'Bil: ' + (booking.car || '-'),
        'Pakke: ' + (booking.pkg || '-'),
        'Dato & tid: ' + (booking.date || '-') + ' ' + (booking.time || ''),
        '',
        'Ønsker du at booke en ny tid, er du meget velkommen på elitevask.vercel.app',
        '',
        'Med venlig hilsen',
        'Elite Vask',
        'Tlf: +45 24 44 03 21',
      ].join('\n') : [
        `Hi ${booking.name || ''},`,
        '',
        'Your booking with Elite Vask has been cancelled.',
        '',
        'Cancelled booking:',
        'Car: ' + (booking.car || '-'),
        'Package: ' + (booking.pkg || '-'),
        'Date & time: ' + (booking.date || '-') + ' ' + (booking.time || ''),
        '',
        'To book a new appointment, visit elitevask.vercel.app',
        '',
        'Best regards,',
        'Elite Vask',
        'Phone: +45 24 44 03 21',
      ].join('\n');

      try {
        await transport.sendMail({
          from: `"Elite Vask" <${process.env.GMAIL_USER || COMPANY_EMAIL}>`,
          to: booking.email,
          subject: customerSubject,
          text: customerText,
          html: `<div style="font-family:sans-serif;max-width:560px;padding:24px;background:#f9f9f9;border-radius:12px;color:#222">${customerText.replace(/\n/g, '<br>')}</div>`,
        });
      } catch (err) {
        console.error('Customer cancel email error:', err.message);
      }
    }
  }

  return Response.json({ ok: true });
}
