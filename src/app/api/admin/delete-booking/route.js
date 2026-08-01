import { createHash, timingSafeEqual } from 'crypto';
import { buildTransport, emailShell, tr, esc, CONTACT_EMAIL, BOOKING_EMAIL } from '@/lib/mailer';

// The slot keys a booking reserved.
//
// Only ever derived from data the booking itself carries — never guessed from
// carId and never anchored to a hardcoded opening-hours grid (both would break
// as soon as the manager edits the hours, and a wrong guess deletes slot keys
// belonging to the NEXT booking, silently freeing an occupied hour). Records
// with no duration info return [] and are swept by token instead.
function slotsFor(data) {
  const { time, slots, slotsNeeded, durationMin, slotMinutes } = data;
  if (Array.isArray(slots) && slots.length) return slots;
  if (!time || !/^([01]\d|2[0-3]):([0-5]\d)$/.test(time)) return [];
  const step = [15, 30, 60].includes(slotMinutes) ? slotMinutes : 30;
  const dur = durationMin || (slotsNeeded ? slotsNeeded * step : 0);
  if (!dur) return [];
  const [h, m] = time.split(':').map(Number);
  const start = h * 60 + (m || 0);
  const out = [];
  for (let t = start; t < start + dur; t += step) {
    out.push(`${String(Math.floor(t / 60)).padStart(2, '0')}:${String(t % 60).padStart(2, '0')}`);
  }
  return out;
}

// Delete a slot key only if it still belongs to this booking. Without this an
// already-cancelled booking (whose slots were freed and then re-booked by
// someone else) would, on permanent delete, wipe the NEW booking's
// reservation — freeing an occupied hour while that booking stays confirmed.
// Legacy keys with no stored token are still cleaned up.
async function delOwnedSlot(kv, key, token) {
  try {
    const raw = await kv.get(key);
    if (raw === null || raw === undefined) return;
    const val = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (val && val.token && val.token !== token) return; // belongs to someone else
    await kv.del(key);
  } catch {}
}

// Free a booking's slots; falls back to deleting only the day's slot keys that
// point at THIS token, so another booking's reservation can never be touched.
async function releaseSlots(kv, data, token) {
  const times = slotsFor(data);
  if (times.length) {
    for (const t of times) {
      await delOwnedSlot(kv, `slot:${data.date}:${t}`, token);
    }
    return;
  }
  if (!data.date) return;
  try {
    const keys = await kv.keys(`slot:${data.date}:*`);
    for (const key of keys) {
      try {
        const raw = await kv.get(key);
        const val = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (val && val.token === token) await kv.del(key);
      } catch {}
    }
  } catch {}
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
    // Persist first, then free slots: a failed write must never leave slots
    // released for a booking that still reads as confirmed.
    await kv.set(`booking:${token}`, JSON.stringify(data), { ex: 60 * 60 * 24 * 30 });
    if (data.date) await releaseSlots(kv, data, token);
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
      // An already-cancelled booking released its slots when it was cancelled;
      // touching them again could only affect a booking made since.
      if (data.date && data.status !== 'cancelled') await releaseSlots(kv, data, token);
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
