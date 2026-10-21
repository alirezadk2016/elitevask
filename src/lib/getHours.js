import { unstable_cache } from 'next/cache';
import { kv } from '@vercel/kv';
import { normalizeHours, DEFAULT_HOURS, hoursSummary } from './hours';

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
  // Saturday = 6, Sunday = 0
  const weekendOpen = !closed.includes(6) && !closed.includes(0);
  // Per-weekday schedule: `text` is the sentence-ready summary
  // ("alle dage kl. 15:30–22:00" / "man–fre kl. 15:30–22:00, lør kl. 10:00–16:00"),
  // `rows` the contact-card lines. `days`/`time` describe the shared window and
  // stay for older callers.
  const text = hoursSummary(h, lang);
  const rows = text.split(', ').map((part) => {
    const m = part.match(/^(.*?)\s+(?:kl\.\s+)?(\d\d:\d\d–\d\d:\d\d)$/);
    const lab = m ? m[1] : part;
    return [lab.charAt(0).toUpperCase() + lab.slice(1), m ? m[2].replace('–', ' – ') : ''];
  });
  return { time, days, text, rows, weekendOpen, open: h.open, close: h.close };
}

// schema.org openingHoursSpecification: one entry per distinct window.
export function openingHoursSpec(hours) {
  const h = normalizeHours(hours);
  const groups = new Map();
  h.days.forEach((d, i) => {
    if (d.closed) return;
    const key = `${d.open}|${d.close}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(DAY_SCHEMA[i]);
  });
  return [...groups.entries()].map(([key, dayOfWeek]) => {
    const [opens, close] = key.split('|');
    return { '@type': 'OpeningHoursSpecification', dayOfWeek, opens, closes: close === '24:00' ? '23:59' : close };
  });
}
