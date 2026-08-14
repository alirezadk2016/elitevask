import { randomBytes } from 'crypto';
import { buildSlotTimes, carSlotCount, isClosedDay, normalizeHours, DEFAULT_HOURS } from '@/lib/hours';

/* Shared booking primitives for the ADMIN and CRON routes.
 *
 * `src/app/api/book/route.js` (the customer-facing path) deliberately keeps
 * its own copies: it is the most safety-critical file on the site and is left
 * byte-for-byte untouched. What matters for correctness is that both paths
 * agree on the KEY FORMAT and the SET NX reservation protocol, which they do:
 *   slot key     : slot:{YYYY-MM-DD}:{HH:MM}
 *   booking key  : booking:{token}
 *   reservation  : SET key value NX EX BOOKING_TTL
 * Any change to those three lines must be mirrored in both files.
 */

export const BOOKING_TTL = 60 * 60 * 24 * 30; // 30 days
export const MAX_DAYS_AHEAD = 28;             // slot keys expire at 30d

let kvClient = null;
export async function getKV() {
  if (kvClient) return kvClient;
  const { Redis } = await import('@upstash/redis');
  const url = process.env.KV_REST_API_URL || process.env.STORAGE_KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.STORAGE_KV_REST_API_TOKEN;
  if (!url || !token) return null;
  kvClient = new Redis({ url, token });
  return kvClient;
}

export function slotKey(date, time) { return `slot:${date}:${time}`; }
export function secureToken() { return randomBytes(32).toString('hex'); }

/* Atomic reserve. Returns false when another booking already holds the slot.
   Throws on KV failure — the caller must abort rather than assume success,
   or two cars get scheduled for the same hour. */
export async function reserveSlot(key, value) {
  const kv = await getKV();
  if (!kv) throw new Error('kv_unavailable');
  const r = await kv.set(key, JSON.stringify(value), { nx: true, ex: BOOKING_TTL });
  return !!r;
}

/* Delete a slot key only if it belongs to `token`. Without the ownership
   check a rollback could delete the NEXT booking's slot and silently free an
   occupied hour. */
export async function delOwnedSlot(kv, date, time, token) {
  const key = slotKey(date, time);
  try {
    const raw = await kv.get(key);
    if (raw == null) return;
    const v = typeof raw === 'string' ? JSON.parse(raw) : raw;
    if (v && v.token && v.token !== token) return; // someone else's slot
  } catch { /* unparseable → fall through and delete */ }
  await kv.del(key);
}

/* Release every hour a booking holds.
 *
 * Records written before `slots` existed carry no slot list, and their
 * duration cannot be re-derived safely (guessing it is exactly the old
 * slot-stealing bug). For those we scan the day's real slot keys and delete
 * only the ones stamped with this booking's token — same approach the cancel
 * route uses. Without this, erasing an old booking left its hours red forever
 * with no booking behind them. */
export async function releaseBookingSlots(kv, booking) {
  if (!kv || !booking?.date) return 0;
  const { date, token, slots } = booking;
  if (Array.isArray(slots) && slots.length) {
    let n = 0;
    for (const t of slots) { try { await delOwnedSlot(kv, date, t, token); n++; } catch {} }
    return n;
  }
  if (!token) return 0;
  let n = 0;
  try {
    const keys = await kv.keys(`slot:${date}:*`);
    for (const key of keys) {
      try {
        const raw = await kv.get(key);
        const val = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (val && val.token === token) { await kv.del(key); n++; }
      } catch {}
    }
  } catch {}
  return n;
}

export async function releaseSlots(date, times, token) {
  const kv = await getKV();
  if (!kv) return;
  const run = () => Promise.allSettled(times.map(t => delOwnedSlot(kv, date, t, token)));
  const res = await run();
  if (res.some(r => r.status === 'rejected')) await run(); // one retry
}

export async function loadHours() {
  try {
    const kv = await getKV();
    if (kv) {
      const h = await kv.get('content:hours');
      if (h) return normalizeHours(h);
    }
  } catch {}
  return normalizeHours(DEFAULT_HOURS);
}

export async function listBookings() {
  const kv = await getKV();
  if (!kv) return [];
  const keys = await kv.keys('booking:*');
  if (!keys.length) return [];
  const values = await Promise.all(keys.map(k => kv.get(k)));
  return values
    .map((v, i) => {
      try {
        const data = typeof v === 'string' ? JSON.parse(v) : v;
        if (!data || typeof data !== 'object') return null;
        return { token: keys[i].replace('booking:', ''), ...data };
      } catch { return null; }
    })
    .filter(Boolean);
}

// ── Pricing (mirrors the customer path so a manual booking quotes the same) ──
export const DEFAULT_PRICES = {
  lille:   { hele: 800,  udv: 500, indv: 600, guld: 2000 },
  mellem:  { hele: 950,  udv: 550, indv: 700, guld: 2200 },
  stor:    { hele: 1100, udv: 650, indv: 850, guld: 2350 },
  varebil: { hele: 1400, udv: 750, indv: 750, guld: 2200 },
};
const DEFAULT_EXTRA_PRICES = { motor: 400, lak: 300, pleje: 200, haar: 300, saede: 400, barnesaede: 100 };

/* Keep only extra-service ids that actually exist (KV list, else the
   built-in defaults). Unvalidated ids from the request body would otherwise be
   stored on the booking and shown to the manager as a service that was never
   ordered — and priced at 0. */
export async function validExtraIds(extraIds) {
  if (!Array.isArray(extraIds) || !extraIds.length) return [];
  let known = new Set(Object.keys(DEFAULT_EXTRA_PRICES));
  try {
    const kv = await getKV();
    if (kv) {
      const raw = await kv.get('content:extras');
      const ex = typeof raw === 'string' ? JSON.parse(raw) : raw;
      if (Array.isArray(ex) && ex.length) known = new Set(ex.filter(e => e && e.id).map(e => String(e.id)));
    }
  } catch {}
  return [...new Set(extraIds.map(String))].filter(id => known.has(id)).slice(0, 12);
}

export async function computePrice(carId, pkgId, extraIds) {
  if (!DEFAULT_PRICES[carId]) return null;
  const pkg = ['hele', 'udv', 'indv', 'guld'].includes(pkgId) ? pkgId : 'hele';
  let prices = DEFAULT_PRICES, extraPrices = DEFAULT_EXTRA_PRICES;
  try {
    const kv = await getKV();
    if (kv) {
      const stored = await kv.get('content:prices');
      const p = typeof stored === 'string' ? JSON.parse(stored) : stored;
      if (p && p[carId] && Number(p[carId][pkg]) > 0) prices = p;
      const rawEx = await kv.get('content:extras');
      const ex = typeof rawEx === 'string' ? JSON.parse(rawEx) : rawEx;
      if (Array.isArray(ex) && ex.length) {
        extraPrices = {};
        for (const e of ex) if (e && e.id) extraPrices[e.id] = Number(e.price) || 0;
      }
    }
  } catch {}
  const base = Number(prices[carId]?.[pkg]) || Number(DEFAULT_PRICES[carId][pkg]) || 0;
  if (!base) return null;
  const addOns = Array.isArray(extraIds)
    ? extraIds.slice(0, 12).reduce((s, id) => s + (Number(extraPrices[id]) || 0), 0)
    : 0;
  return `${Math.round(base + addOns).toLocaleString('da-DK')} kr`;
}

// ── Labels, so a manual booking reads exactly like an online one ────────────
export const CAR_LABELS = { lille: 'Lille bil', mellem: 'Mellemstor bil', stor: 'Stor bil / SUV', varebil: 'Varebil' };
export const PKG_LABELS = { hele: 'Hele bilen', udv: 'Udvendig', indv: 'Indvendig', guld: 'Guld pakke' };

export function cphNow() {
  const s = new Date().toLocaleString('sv-SE', { timeZone: 'Europe/Copenhagen' });
  return {
    date: s.slice(0, 10),
    minutes: parseInt(s.slice(11, 13), 10) * 60 + parseInt(s.slice(14, 16), 10),
  };
}
export function toMinutes(t) { return parseInt(t.slice(0, 2), 10) * 60 + parseInt(t.slice(3, 5), 10); }

/* Validate a would-be booking against opening hours, the slot grid and the
   clock. Returns { ok:true, slotTimes, startIdx, slotsNeeded, hours } or
   { ok:false, error, message }. Shared by the admin POST so a manually
   entered time can never land outside the grid the calendar draws. */
export async function validateSlot({ date, time, carId }) {
  const hours = await loadHours();
  const slotTimes = buildSlotTimes(hours);
  const bad = (error, message) => ({ ok: false, error, message, hours });

  if (!['lille', 'mellem', 'stor', 'varebil'].includes(carId)) return bad('invalid_car', 'Vælg en biltype.');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return bad('invalid_slot', 'Ugyldig dato.');
  if (!slotTimes.includes(time)) return bad('invalid_slot', `Tidspunktet passer ikke i tidsplanen (${hours.open}–${hours.close}, ${hours.slotMinutes} min.).`);
  if (isClosedDay(hours, date)) return bad('closed_day', 'Der er lukket den valgte dag — åbn dagen under Åbningstider først.');

  const slotsNeeded = carSlotCount(hours, carId);
  const startIdx = slotTimes.indexOf(time);
  if (startIdx + slotsNeeded > slotTimes.length) {
    const hrs = +(slotsNeeded * hours.slotMinutes / 60).toFixed(1);
    return bad('slot_range', `Denne biltype tager ${hrs} timer og kan ikke nå at blive færdig inden ${hours.close}.`);
  }
  const now = cphNow();
  if (date < now.date || (date === now.date && toMinutes(time) <= now.minutes)) {
    return bad('slot_past', 'Tidspunktet er allerede passeret.');
  }
  const maxDate = new Date(Date.parse(now.date + 'T00:00:00Z') + MAX_DAYS_AHEAD * 86400000).toISOString().slice(0, 10);
  if (date > maxDate) return bad('too_far', `Der kan bookes højst ${MAX_DAYS_AHEAD} dage frem.`);

  return { ok: true, hours, slotTimes, startIdx, slotsNeeded };
}

/* Stable per-customer key: phone if we have one (managers type phone numbers,
   not emails), else email. Digits only so "+45 24 44 03 21" and "24440321"
   are the same person. */
export function customerKey(b) {
  const digits = String(b.phone || '').replace(/\D/g, '').replace(/^45(?=\d{8}$)/, '');
  if (digits.length >= 8) return `p:${digits}`;
  const mail = String(b.email || '').trim().toLowerCase();
  return mail ? `e:${mail}` : null;
}
