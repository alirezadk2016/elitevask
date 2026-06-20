import { buildTransport, emailShell, tr, CONTACT_EMAIL, BOOKING_EMAIL } from '@/lib/mailer';

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
            ${L ? `Hej ${data.name || ''},` : `Hi ${data.name || ''},`}<br><br>
            ${L ? 'Vi bekræfter hermed, at din booking er blevet annulleret.' : 'We confirm that your booking has been cancelled.'}
          </p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">
            ${tr(L ? 'Dato & tid' : 'Date & time', `${fmtDate(data.date)} · kl. ${data.time}`, true)}
            ${tr(L ? 'Bil' : 'Car', data.car || '-')}
            ${tr(L ? 'Pakke' : 'Package', data.pkg || '-', true)}
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
    subject: `❌ Booking annulleret: ${data.name || '?'} – ${fmtDate(data.date)} kl. ${data.time}`,
    html: emailShell({
      title: '❌ Booking annulleret af admin',
      lang: 'da',
      body: `
        <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;margin-bottom:24px">
          ${tr('Navn', data.name || '-', true)}
          ${tr('Dato & tid', `${fmtDate(data.date)} · kl. ${data.time}`)}
          ${tr('Bil', data.car || '-', true)}
          ${tr('Pakke', data.pkg || '-')}
          ${tr('Pris', data.price || '-', true)}
          ${tr('E-mail', data.email || '-')}
          ${tr('Telefon', data.phone || '-', true)}
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
  return request.headers.get('authorization') === `Bearer ${secret}`;
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
    if (data.date && data.slots) {
      await Promise.all(data.slots.map(t => kv.del(`slot:${data.date}:${t}`)));
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
    if (booking) {
      const data = typeof booking === 'string' ? JSON.parse(booking) : booking;
      if (data.date && data.slots) {
        await Promise.all(data.slots.map(t => kv.del(`slot:${data.date}:${t}`)));
      }
      if (data.status !== 'cancelled') {
        await sendCancelEmails(data).catch(() => {});
      }
    }
    await kv.del(`booking:${token}`);
    return Response.json({ ok: true });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}
