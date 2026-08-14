import { checkBearer } from '@/lib/adminAuth';
import { emailShell, tr, esc, buildTransport, BOOKING_EMAIL, CONTACT_EMAIL } from '@/lib/mailer';
import { cphEpoch } from '@/lib/cphTime';
import {
  getKV, listBookings, slotKey, reserveSlot, releaseSlots, secureToken,
  computePrice, validateSlot, validExtraIds, CAR_LABELS, PKG_LABELS, BOOKING_TTL,
} from '@/lib/bookingStore';

export async function GET(request) {
  if (!process.env.ADMIN_SECRET) return Response.json({ error: 'not_configured' }, { status: 503 });
  if (!checkBearer(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  try {
    const bookings = (await listBookings()).sort((a, b) => new Date(b.bookedAt) - new Date(a.bookedAt));
    return Response.json({ bookings });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

/* Manual booking — the manager takes a call and puts the appointment straight
   into the calendar. It reserves the very same slot keys the public wizard
   uses (SET NX), so the hour turns red on the website immediately and the two
   channels can never sell the same time twice. */
export async function POST(request) {
  if (!process.env.ADMIN_SECRET) return Response.json({ error: 'not_configured' }, { status: 503 });
  if (!checkBearer(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'bad_json' }, { status: 400 }); }

  const str = (v, max) => String(v ?? '').trim().slice(0, max);
  const name  = str(body.name, 100);
  const phone = str(body.phone, 30);
  const email = str(body.email, 120);
  const addr  = str(body.addr, 200);
  const zip   = str(body.zip, 10);
  const city  = str(body.city, 80);
  const msg   = str(body.msg, 1000);
  const date  = str(body.date, 10);
  const time  = str(body.time, 5);
  const carId = str(body.carId, 20);
  const pkgId = str(body.pkgId, 20);
  const rawExtras = Array.isArray(body.extraIds) ? body.extraIds.slice(0, 24).map(x => str(x, 40)) : [];
  const notify = body.notify !== false; // manager can skip the customer email

  if (!name) return Response.json({ error: 'invalid_name', message: 'Indtast kundens navn.' }, { status: 400 });
  if (!phone && !email) {
    return Response.json({ error: 'invalid_contact', message: 'Indtast enten telefon eller e-mail.' }, { status: 400 });
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return Response.json({ error: 'invalid_email', message: 'E-mailadressen ser ikke rigtig ud.' }, { status: 400 });
  }
  if (notify && !email) {
    return Response.json({ error: 'invalid_email', message: 'Der skal en e-mail til for at sende bekræftelse. Fjern fluebenet for at booke uden.' }, { status: 400 });
  }

  const v = await validateSlot({ date, time, carId });
  if (!v.ok) return Response.json({ error: v.error, message: v.message }, { status: 400 });
  const { hours, slotTimes, startIdx, slotsNeeded } = v;

  const kv = await getKV();
  if (!kv) {
    return Response.json({ error: 'store_unavailable', message: 'Databasen svarer ikke — prøv igen om lidt.' }, { status: 503 });
  }

  // Drop any id that isn't a real extra service before it reaches the record.
  const extraIds = await validExtraIds(rawExtras);
  const price = (await computePrice(carId, pkgId, extraIds)) || '';
  const token = secureToken();
  const bookedAt = new Date().toISOString();
  const cancelExpiresAt = new Date(cphEpoch(date, time) - 24 * 3600 * 1000).toISOString();

  // Reserve every slot the job occupies, rolling back on the first clash so a
  // half-reserved booking never blocks hours nobody is coming for.
  const taken = [];
  for (let i = 0; i < slotsNeeded; i++) {
    const t = slotTimes[startIdx + i];
    let got;
    try {
      got = await reserveSlot(slotKey(date, t), { name, bookedAt, token });
    } catch {
      if (taken.length) await releaseSlots(date, taken, token);
      return Response.json({ error: 'store_failed', message: 'Databasefejl — bookingen blev IKKE oprettet.' }, { status: 503 });
    }
    if (!got) {
      if (taken.length) await releaseSlots(date, taken, token);
      return Response.json({
        error: 'slot_taken',
        message: `Kl. ${t} er allerede optaget den dag. Vælg et andet tidspunkt.`,
      }, { status: 409 });
    }
    taken.push(t);
  }

  const record = {
    status: 'confirmed',
    date, time,
    car: CAR_LABELS[carId], pkg: PKG_LABELS[pkgId] || PKG_LABELS.hele,
    price, lang: 'da',
    carId, pkgId, slotsNeeded, slots: taken,
    durationMin: slotsNeeded * hours.slotMinutes,
    slotMinutes: hours.slotMinutes,
    name, phone, email, msg,
    extras: extraIds, extraIds,
    addr, zip, city,
    bookedAt, cancelExpiresAt,
    // Marks the booking as entered by hand, so the calendar can badge it and
    // the manager knows which appointments never went through the website.
    source: 'admin',
    createdBy: 'admin',
  };

  try {
    await kv.set(`booking:${token}`, JSON.stringify(record), { ex: BOOKING_TTL });
  } catch {
    await releaseSlots(date, taken, token);
    return Response.json({ error: 'store_failed', message: 'Kunne ikke gemme bookingen — tiden er frigivet igen.' }, { status: 503 });
  }

  // The booking is already safely stored. Email is best-effort from here on:
  // unlike the customer path we must NOT roll back a confirmed appointment
  // just because SMTP is down — the manager has the customer on the phone.
  let emailed = false, emailError = null;
  if (notify) {
    try {
      const transport = buildTransport();
      if (!transport) throw new Error('SMTP er ikke konfigureret');
      const reqUrl = new URL(request.url);
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || `${reqUrl.protocol}//${reqUrl.host}`;
      const [, m, d] = date.split('-');
      const months = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'];
      const nice = `${parseInt(d)}. ${months[parseInt(m) - 1]}`;
      await transport.sendMail({
        from: `"Elite Vask" <${process.env.SMTP_USER || BOOKING_EMAIL}>`,
        to: email,
        replyTo: CONTACT_EMAIL,
        subject: `Din tid er booket – ${nice} kl. ${time}`,
        html: emailShell({
          title: 'Din tid er booket',
          preheader: `${nice} kl. ${time} – vi kommer til dig.`,
          body: `<p style="margin:0 0 18px;font-size:15px;color:#333;line-height:1.6">Hej ${esc(name)},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#333;line-height:1.6">Vi har booket din tid som aftalt i telefonen. Her er detaljerne:</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eaefeb;border-radius:8px;overflow:hidden;margin-bottom:20px">
              ${tr('Dato & tid', `${nice} kl. ${esc(time)}`, true)}
              ${tr('Bil', esc(CAR_LABELS[carId]))}
              ${tr('Pakke', esc(PKG_LABELS[pkgId] || PKG_LABELS.hele), true)}
              ${price ? tr('Pris', esc(price)) : ''}
              ${addr ? tr('Adresse', esc(`${addr}, ${zip} ${city}`), !price) : ''}
            </table>
            <p style="margin:0 0 8px;font-size:14px;color:#555;line-height:1.6">Du betaler først, når bilen er ren. Skal tiden ændres, så ring til os på <a href="tel:+4524440321" style="color:#0d4a25;font-weight:600">+45 24 44 03 21</a>.</p>
            <p style="margin:18px 0 0;font-size:13px;color:#777">Kan du ikke alligevel? <a href="${siteUrl}/annuller?token=${token}" style="color:#0d4a25;font-weight:600">Annuller din booking her</a>.</p>`,
        }),
      });
      emailed = true;
    } catch (e) {
      emailError = e?.message || 'ukendt fejl';
      console.error('[admin/bookings] confirmation email failed', emailError);
    }
  }

  return Response.json({ ok: true, token, booking: { token, ...record }, emailed, emailError });
}
