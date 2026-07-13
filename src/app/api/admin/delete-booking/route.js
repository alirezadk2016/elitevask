import { createHash, timingSafeEqual } from 'crypto';
import { buildTransport, emailShell, tr, esc, CONTACT_EMAIL, BOOKING_EMAIL } from '@/lib/mailer';

const CAR_SLOTS = { lille: 4, mellem: 6, stor: 8, varebil: 6 }; // 30-min units
const SLOT_TIMES = ['15:30','16:00','16:30','17:00','17:30','18:00','18:30','19:00','19:30','20:00','20:30','21:00','21:30'];

// Reconstruct the reserved hours for a booking that predates the `slots` field.
function slotsFor(data) {
  if (Array.isArray(data.slots) && data.slots.length) return data.slots;
  if (!data.time) return [];
  const start = SLOT_TIMES.indexOf(data.time);
  if (start < 0) return [];
  const n = data.slotsNeeded || CAR_SLOTS[data.carId] || 1;
  return SLOT_TIMES.slice(start, start + n);
}

function hashEmail(email) {
  return createHash('sha256').update(String(email).toLowerCase().trim()).digest('hex');
}

function fmtDate(d) {
  if (!d) return d;
  const [y, m, day] = d.split('-');
  const months = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'];
  return `${parseInt(day)}. ${months[parseInt(m)-1]} ${y}`;
}

async function sendCancelEmails(data) {
  const transport = buildTransport();
  if (!transport) return;
  const L = data.lang !== 'en';

  // Email to customer
  if (data.email) {
    await transport.sendMail({
      from: `"Elite Vask" <booking@elite-vask.dk>`,
      to: data.email,
      replyTo: CONTACT_EMAIL,
      subject: L ? 'Din booking er annulleret' : 'Your booking has been cancelled',
      html: emailShell({
        title: L ? '❌ Booking annulleret' : '❌ Booking cancelled',
        preheader: L ? `Din booking den ${fmtDate(data.date)} er annulleret.` : `Your booking on ${fmtDate(data.date)} has been cancelled.`,
        lang: data.lang || 'da',
        body: `
          <p style="color:#333;margin:0 0 20px;font-size:15px;line-height:1.7">
            ${L ? `Hej ${esc(data.name) || ''},` : `Hi ${esc(data.name) || ''},`}<br><br>
            ${L ? 'Vi bekræfter hermed, at din booking er blevet annulleret.' : 'We confirm that your booking has been cancelled.'}
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">
            ${tr(L ? 'Dato & tid' : 'Date & time', `${esc(fmtDate(data.date))} · kl. ${esc(data.time)}`, true)}
            ${tr(L ? 'Bil' : 'Car', esc(data.car) || '-')}
            ${tr(L ? 'Pakke' : 'Package', esc(data.pkg) || '-', true)}
          </table>
          <p style="font-size:13px;color:#777;margin:0;line-height:1.7">
            ${L
              ? `Ønsker du at booke en ny tid? Besøg <a href="https://elite-vask.dk" style="color:#0d4a25">elite-vask.dk</a> eller ring til os på <a href="tel:+4524440321" style="color:#0d4a25;font-weight:600">+45 24 44 03 21</a>.`
              : `Want to book a new appointment? Visit <a href="https://elite-vask.dk" style="color:#0d4a25">elite-vask.dk</a> or call us at <a href="tel:+4524440321" style="color:#0d4a25;font-weight:600">+45 24 44 03 21</a>.`}
          </p>
        `,
      }),
    }).catch(() => {});
  }

  // Notification to admin
  await transport.sendMail({
    from: `"Elite Vask System" <booking@elite-vask.dk>`,
    to: BOOKING_EMAIL,
    subject: `❌ Booking annulleret: ${(data.name || '?').replace(/[\r\n]/g, ' ')} – ${fmtDate(data.date)} kl. ${data.time}`,
    html: emailShell({
      title: '❌ Booking annulleret af admin',
      lang: 'da',
      body: `
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">
          ${tr('Navn', esc(data.name) || '-', true)}
          ${tr('Dato & tid', `${esc(fmtDate(data.date))} · kl. ${esc(data.time)}`)}
          ${tr('Bil', esc(data.car) || '-', true)}
          ${tr('Pakke', esc(data.pkg) || '-')}
          ${tr('Pris', esc(data.price) || '-', true)}
          ${tr('E-mail', esc(data.email) || '-')}
          ${tr('Telefon', esc(data.phone) || '-', true)}
        </table>
      `,
    }),
  }).catch(() => {});
}

async function getKV() {
  const { Redis } = await import('@upstash/redis');
  const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

function checkAuth(request) {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const header = request.headers.get('authorization') || '';
  const expected = `Bearer ${secret}`;
  // Constant-time compare (hash first so unequal lengths don't leak / throw)
  const a = createHash('sha256').update(header).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

// Cancel booking (keeps record, frees slots, sets status=cancelled)
export async function PATCH(request) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const { token } = await request.json().catch(() => ({}));
  if (!token) return Response.json({ error: 'missing_token' }, { status: 400 });
  try {
    const kv = await getKV();
    if (!kv) return Response.json({ error: 'no_redis' }, { status: 503 });
    const booking = await kv.get(`booking:${token}`);
    if (!booking) return Response.json({ error: 'not_found' }, { status: 404 });
    const data = typeof booking === 'string' ? JSON.parse(booking) : booking;
    data.status = 'cancelled';
    if (data.date) {
      await Promise.all(slotsFor(data).map(t => kv.del(`slot:${data.date}:${t}`)));
    }
    await kv.set(`booking:${token}`, JSON.stringify(data), { ex: 60 * 60 * 24 * 30 });
    await sendCancelEmails(data).catch(() => {});
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// Delete booking completely (also sends cancellation email)
export async function DELETE(request) {
  if (!checkAuth(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const { token } = await request.json().catch(() => ({}));
  if (!token) return Response.json({ error: 'missing_token' }, { status: 400 });
  try {
    const kv = await getKV();
    if (!kv) return Response.json({ error: 'no_redis' }, { status: 503 });
    const booking = await kv.get(`booking:${token}`);
    let email = null;
    if (booking) {
      const data = typeof booking === 'string' ? JSON.parse(booking) : booking;
      email = data.email || null;
      if (data.date) {
        await Promise.all(slotsFor(data).map(t => kv.del(`slot:${data.date}:${t}`)));
      }
      if (data.status !== 'cancelled') {
        await sendCancelEmails(data).catch(() => {});
      }
    }
    await kv.del(`booking:${token}`);
    // Remove the dangling token from the customer portal index.
    if (email) { try { await kv.srem(`user:bookings:${hashEmail(email)}`, token); } catch {} }
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
