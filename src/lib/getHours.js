import { unstable_cache } from 'next/cache';
import { kv } from '@vercel/kv';
import { normalizeHours, DEFAULT_HOURS } from './hours';

// Server-side, cached read of the manager-editable opening hours. Tagged
// 'hours' so the admin save can revalidate it instantly; otherwise refreshes
// every 5 min. Always returns a valid, normalized object.
export const getHours = unstable_cache(
  async () => {
    try {
      const h = await kv.get('content:hours');
      return normalizeHours(h || DEFAULT_HOURS);
    } catch {
      return normalizeHours(DEFAULT_HOURS);
    }
  },
  ['site-hours'],
  { revalidate: 300, tags: ['hours'] },
);

const DAY_DA = ['Søndag', 'Mandag', 'Tirsdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lørdag'];
const DAY_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
// schema.org day URIs, index 0 = Sunday
const DAY_SCHEMA = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

// Human-readable summary for the contact card / marketing copy.
// da: "Alle dage" or "Alle dage undtagen søndag"; time "15:30 – 22:00".
export function hoursDisplay(hours, lang = 'da') {
  const h = normalizeHours(hours);
  const da = lang !== 'en';
  const closed = h.closedDays || [];
  const time = `${h.open} – ${h.close}`;
  let days;
  if (closed.length === 0) days = da ? 'Alle dage' : 'Every day';
  else if (closed.length >= 7) days = da ? 'Lukket' : 'Closed';
  else {
    const names = closed.map((d) => (da ? DAY_DA[d] : DAY_EN[d]).toLowerCase());
    const joiner = da ? ' og ' : ' and ';
    const list = names.length === 1 ? names[0]
      : names.slice(0, -1).join(', ') + joiner + names[names.length - 1];
    days = da ? `Alle dage undtagen ${list}` : `Every day except ${list}`;
  }
  return { time, days, open: h.open, close: h.close };
}

// schema.org openingHoursSpecification for the open weekdays only.
export function openingHoursSpec(hours) {
  const h = normalizeHours(hours);
  const closed = new Set(h.closedDays || []);
  const openDays = DAY_SCHEMA.filter((_, i) => !closed.has(i));
  if (!openDays.length) return [];
  const close = h.close === '24:00' ? '23:59' : h.close;
  return [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: openDays,
    opens: h.open,
    closes: close,
  }];
}
