import { checkBearer } from '@/lib/adminAuth';
import { getKV, listBookings } from '@/lib/bookingStore';
import { cphEpoch } from '@/lib/cphTime';
import { emailShell, tr, esc, buildTransport, BOOKING_EMAIL, CONTACT_EMAIL } from '@/lib/mailer';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/* Appointment reminders.
 *
 * The privacy policy promises customers a reminder ("påmindelse") and until
 * now only the instant confirmation was ever sent. This runs on a schedule
 * (see vercel.json) and emails everyone whose appointment starts inside the
 * next REMIND_WITHIN hours.
 *
 * Idempotency: before sending, a `reminded:{token}` key is claimed with
 * SET NX. Two overlapping cron runs — or a retry after a timeout — therefore
 * cannot send the same customer two reminders. The flag is only written when
 * the claim succeeds, so a crash mid-send costs at most one missed reminder,
 * never a duplicate storm.
 */
const REMIND_WITHIN_H = 26;  // fires on a daily schedule with margin to spare
const REMIND_MIN_H    = 2;   // don't "remind" about something starting now
const FLAG_TTL        = 60 * 60 * 24 * 14;

function authorized(request) {
  // Vercel Cron sends the project's CRON_SECRET as a bearer token; the same
  // route can be triggered by hand from the admin panel with ADMIN_SECRET.
  const header = request.headers.get('authorization') || '';
  const cronSecret = process.env.CRON_SECRET;
  if (cronSecret && header === `Bearer ${cronSecret}`) return true;
  return checkBearer(request);
}

async function run(request, { dryRun = false } = {}) {
  const kv = await getKV();
  if (!kv) return { error: 'store_unavailable', sent: 0 };

  const now = Date.now();
  const all = await listBookings();

  const due = all.filter((b) => {
    if (b.status === 'cancelled') return false;
    if (!b.email || !b.date || !b.time) return false;
    const start = cphEpoch(b.date, b.time);
    if (!Number.isFinite(start)) return false;
    const hoursOut = (start - now) / 3600000;
    return hoursOut > REMIND_MIN_H && hoursOut <= REMIND_WITHIN_H;
  });

  if (dryRun) return { dryRun: true, due: due.length, tokens: due.map(b => b.token) };
  if (!due.length) return { sent: 0, skipped: 0, failed: 0, considered: all.length };

  const transport = buildTransport();
  if (!transport) return { error: 'smtp_unavailable', sent: 0, due: due.length };

  const reqUrl = new URL(request.url);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL || `${reqUrl.protocol}//${reqUrl.host}`;
  const months = ['jan','feb','mar','apr','maj','jun','jul','aug','sep','okt','nov','dec'];

  const tomorrowISO = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Copenhagen' })
    .format(new Date(now + 86400000));

  let sent = 0, skipped = 0, failed = 0;
  for (const b of due) {
    // Claim first — a send we aren't sure about must never be retried.
    let claimed = false;
    try {
      claimed = !!(await kv.set(`reminded:${b.token}`, new Date().toISOString(), { nx: true, ex: FLAG_TTL }));
    } catch { failed++; continue; }
    if (!claimed) { skipped++; continue; }

    const L = b.lang !== 'en';
    const [, m, d] = b.date.split('-');
    const nice = `${parseInt(d)}. ${months[parseInt(m) - 1]}`;
    // The cron runs the evening before, but a manual trigger can fire any
    // time — so say "i morgen" only when it really is tomorrow.
    const isTomorrow = b.date === tomorrowISO;
    const whenWord = isTomorrow ? (L ? 'i morgen' : 'tomorrow') : `${nice}`;
    try {
      await transport.sendMail({
        from: `"Elite Vask" <${process.env.SMTP_USER || BOOKING_EMAIL}>`,
        to: b.email,
        replyTo: CONTACT_EMAIL,
        subject: L ? `Påmindelse: din tid ${whenWord} kl. ${b.time}` : `Reminder: your appointment ${whenWord} at ${b.time}`,
        html: emailShell({
          lang: b.lang,
          title: L ? (isTomorrow ? 'Vi ses i morgen' : 'Påmindelse om din tid') : (isTomorrow ? 'See you tomorrow' : 'Appointment reminder'),
          preheader: L ? `${nice} kl. ${b.time} – vi kommer til dig.` : `${nice} at ${b.time} – we come to you.`,
          body: `<p style="margin:0 0 18px;font-size:15px;color:#333;line-height:1.6">${L ? 'Hej' : 'Hi'} ${esc(b.name || '')},</p>
            <p style="margin:0 0 20px;font-size:15px;color:#333;line-height:1.6">${L
              ? 'Bare en venlig påmindelse om din tid hos Elite Vask:'
              : 'Just a friendly reminder about your appointment with Elite Vask:'}</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #eaefeb;border-radius:8px;overflow:hidden;margin-bottom:20px">
              ${tr(L ? 'Dato & tid' : 'Date & time', `${nice} ${L ? 'kl.' : 'at'} ${esc(b.time)}`, true)}
              ${tr(L ? 'Bil' : 'Car', esc(b.car || '-'))}
              ${tr(L ? 'Pakke' : 'Package', esc(b.pkg || '-'), true)}
              ${b.addr ? tr(L ? 'Adresse' : 'Address', esc(`${b.addr}, ${b.zip || ''} ${b.city || ''}`)) : ''}
            </table>
            <p style="margin:0 0 8px;font-size:14px;color:#555;line-height:1.6">${L
              ? 'Sørg venligst for, at bilen er tilgængelig, og at der er plads omkring den. Du betaler først, når bilen er ren.'
              : 'Please make sure the car is accessible with space around it. You only pay once the car is clean.'}</p>
            <p style="margin:18px 0 0;font-size:13px;color:#777">${L
              ? `Passer det ikke alligevel? Ring på <a href="tel:+4524440321" style="color:#0d4a25;font-weight:600">+45 24 44 03 21</a> eller <a href="${siteUrl}/annuller?token=${b.token}" style="color:#0d4a25;font-weight:600">annuller her</a>.`
              : `Doesn't fit after all? Call <a href="tel:+4524440321" style="color:#0d4a25;font-weight:600">+45 24 44 03 21</a> or <a href="${siteUrl}/annuller?token=${b.token}" style="color:#0d4a25;font-weight:600">cancel here</a>.`}</p>`,
        }),
      });
      sent++;
    } catch (e) {
      failed++;
      // Release the claim so the next run can retry a genuinely failed send.
      try { await kv.del(`reminded:${b.token}`); } catch {}
      console.error('[cron/reminders] send failed', b.token, e?.message);
    }
  }
  return { sent, skipped, failed, due: due.length };
}

export async function GET(request) {
  if (!authorized(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const dryRun = new URL(request.url).searchParams.get('dry') === '1';
  try {
    return Response.json({ ok: true, ...(await run(request, { dryRun })) });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

// Same job, triggered manually from the admin panel.
export async function POST(request) { return GET(request); }
