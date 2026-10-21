// Single source of truth for booking opening hours.
//
// The manager edits these from the admin panel ("Åbningstider"); the value is
// stored in KV under `content:hours` and consumed by the booking API, the
// customer wizard and the admin calendar. Everything falls back to
// DEFAULT_HOURS when KV is empty, so the site keeps working before the first
// save.

// Opening window 15:30–22:00, 30-minute slots, open every day.
// closedDays = weekly closed weekdays (0=Sun..6=Sat);
// closedDates = specific closed calendar dates ("YYYY-MM-DD"), e.g. holidays.
export const DEFAULT_HOURS = { open: '15:30', close: '22:00', slotMinutes: 30, closedDays: [], closedDates: [] };

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Real service durations per car type, in minutes. Slot counts are derived
// from these so changing the slot interval never breaks the math.
export const CAR_DURATION_MIN = { lille: 120, mellem: 180, stor: 240, varebil: 180 };

// Only intervals that divide every duration evenly, so slot counts stay exact.
export const ALLOWED_SLOT_MINUTES = [15, 30, 60];

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function toMin(t) {
  if (t === '24:00') return 24 * 60; // midnight close, kept stable on round-trip
  const m = TIME_RE.exec(String(t || ''));
  if (!m) return NaN;
  return parseInt(m[1], 10) * 60 + parseInt(m[2], 10);
}

export function minToLabel(m) {
  const h = Math.floor(m / 60), mm = m % 60;
  return `${String(h).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
}

// Coerce arbitrary (possibly user- or KV-supplied) data into a valid hours
// object. Never throws — bad fields fall back to the default so the booking
// engine can always build a slot grid.
//
// Per-weekday schedule: `days[0..6]` (0=Sun..6=Sat), each {closed, open, close}.
// Older records have only one shared open/close + closedDays; they are
// expanded into seven identical days, so nothing changes until the manager
// saves a per-day schedule. The top-level open/close are kept as the UNION of
// the open days (earliest open → latest close) and closedDays as the closed
// weekdays — that is the shared slot grid every consumer (incl. the booking
// API) builds on; a single day's bookable times are that grid limited to the
// day's own window (see buildSlotTimes(hours, date)).
function clampWindow(openRaw, closeRaw, slot, fbOpen, fbClose) {
  let openM = toMin(openRaw);
  let closeM = toMin(closeRaw);
  if (Number.isNaN(openM)) openM = toMin(fbOpen);
  if (Number.isNaN(closeM)) closeM = toMin(fbClose);
  if (closeM > 24 * 60) closeM = 24 * 60;
  if (closeM - openM < slot) closeM = Math.min(openM + slot, 24 * 60);
  return [openM, closeM];
}

export function normalizeHours(raw) {
  const h = raw && typeof raw === 'object' ? raw : {};
  let slot = parseInt(h.slotMinutes, 10);
  if (!ALLOWED_SLOT_MINUTES.includes(slot)) slot = DEFAULT_HOURS.slotMinutes;

  // WYSIWYG: keep the manager's exact open/close (no snapping to the grid,
  // which would silently move the window). Only guarantee at least one whole
  // bookable slot fits, and never let the window run past midnight.
  const [gOpen, gClose] = clampWindow(h.open, h.close, slot, DEFAULT_HOURS.open, DEFAULT_HOURS.close);

  const legacyClosed = Array.isArray(h.closedDays)
    ? new Set(h.closedDays.map(Number).filter(d => d >= 0 && d <= 6))
    : new Set();

  const rawDays = Array.isArray(h.days) && h.days.length === 7 ? h.days : null;
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = rawDays && rawDays[i] && typeof rawDays[i] === 'object' ? rawDays[i] : null;
    if (!d) return { closed: legacyClosed.has(i), open: minToLabel(gOpen), close: minToLabel(gClose) };
    const [o, c] = clampWindow(d.open, d.close, slot, minToLabel(gOpen), minToLabel(gClose));
    return { closed: !!d.closed, open: minToLabel(o), close: minToLabel(c) };
  });

  const openDays = days.filter(d => !d.closed);
  const unionOpen = openDays.length ? Math.min(...openDays.map(d => toMin(d.open))) : gOpen;
  const unionClose = openDays.length ? Math.max(...openDays.map(d => toMin(d.close))) : gClose;
  const closedDays = days.map((d, i) => (d.closed ? i : -1)).filter(i => i >= 0);

  // Specific closed dates (holidays). Deduped, valid format only, capped so a
  // corrupt record can never balloon the config.
  const closedDates = Array.isArray(h.closedDates)
    ? [...new Set(h.closedDates.map(String).filter(d => DATE_RE.test(d)))].sort().slice(0, 120)
    : [];

  // Special hours for single dates (e.g. Christmas Eve 10:00–14:00), keyed
  // "YYYY-MM-DD" → {open, close}. They override that date's weekday window
  // and can even open a normally closed weekday. Capped like closedDates.
  const specialDates = {};
  if (h.specialDates && typeof h.specialDates === 'object') {
    // Past special dates are dropped so an old Christmas Eve window doesn't
    // keep widening the shared grid all year (one day of slack for timezones).
    const cutoff = new Date(Date.now() - 2 * 864e5).toISOString().slice(0, 10);
    Object.keys(h.specialDates).filter(d => DATE_RE.test(d) && d >= cutoff).sort().slice(0, 60).forEach(d => {
      const v = h.specialDates[d];
      if (!v || typeof v !== 'object') return;
      const [o, c] = clampWindow(v.open, v.close, slot, minToLabel(gOpen), minToLabel(gClose));
      specialDates[d] = { open: minToLabel(o), close: minToLabel(c) };
    });
  }
  // The shared grid must cover the special windows too, otherwise their
  // slots could not exist in /api/book's grid.
  const specials = Object.values(specialDates);
  const gridOpen = Math.min(unionOpen, ...specials.map(v => toMin(v.open)));
  const gridClose = Math.max(unionClose, ...specials.map(v => toMin(v.close)));

  return { open: minToLabel(gridOpen), close: minToLabel(gridClose), slotMinutes: slot, closedDays, closedDates, days, specialDates };
}

// The opening window for one date (or null when that weekday is closed).
export function windowFor(hours, dateStr) {
  const h = normalizeHours(hours);
  if (h.closedDates.includes(String(dateStr))) return null;
  if (h.specialDates[dateStr]) return { ...h.specialDates[dateStr] };
  const wd = weekdayOf(dateStr);
  const d = h.days[wd];
  if (!d || d.closed) return null;
  return { open: d.open, close: d.close };
}

// Ordered list of selectable start times ("HH:MM").
// Without a date: the shared grid (union of all open days) — what the booking
// API and the calendar rows use. With a date: that grid limited to the
// weekday's own window, so a slot exists only if the whole slot fits that day.
export function buildSlotTimes(hours, dateStr) {
  const h = normalizeHours(hours);
  const start = toMin(h.open), end = toMin(h.close);
  const out = [];
  for (let m = start; m + h.slotMinutes <= end; m += h.slotMinutes) out.push(minToLabel(m));
  if (!dateStr) return out;
  const w = windowFor(h, dateStr);
  if (!w) return [];
  const o = toMin(w.open), c = toMin(w.close);
  return out.filter(t => { const m = toMin(t); return m >= o && m + h.slotMinutes <= c; });
}

// How many consecutive slots a given car occupies. Falls back to a medium job
// for unknown car ids so a bogus id can never book a zero-length appointment.
export function carSlotCount(hours, carId) {
  const h = normalizeHours(hours);
  const dur = CAR_DURATION_MIN[carId];
  if (dur) return Math.round(dur / h.slotMinutes);
  return Math.max(1, Math.round(180 / h.slotMinutes));
}

// 0=Sunday .. 6=Saturday for a "YYYY-MM-DD" date, timezone-independent.
export function weekdayOf(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return Number.isNaN(d.getTime()) ? -1 : d.getUTCDay();
}

export function isClosedDay(hours, dateStr) {
  const h = normalizeHours(hours);
  if (h.closedDates.includes(String(dateStr))) return true;
  if (h.specialDates[dateStr]) return false; // special hours open the date
  return h.closedDays.includes(weekdayOf(dateStr));
}

// Human summary of the weekly schedule, grouping consecutive weekdays with the
// same window (Monday first): "alle dage kl. 15:30–22:00" or
// "man–fre kl. 15:30–22:00, lør kl. 10:00–16:00". Lower-case, mid-sentence.
const DAY_SHORT = {
  da: ['søn', 'man', 'tir', 'ons', 'tor', 'fre', 'lør'],
  en: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
};
export function hoursSummary(hours, lang = 'da') {
  const h = normalizeHours(hours);
  const L = lang === 'en' ? 'en' : 'da';
  const order = [1, 2, 3, 4, 5, 6, 0];
  const at = L === 'da' ? 'kl. ' : '';
  const win = (d) => `${d.open}–${d.close}`;
  const open = order.filter(i => !h.days[i].closed);
  if (!open.length) return L === 'da' ? 'efter aftale' : 'by arrangement';
  const same = open.every(i => win(h.days[i]) === win(h.days[open[0]]));
  if (same && open.length === 7) return (L === 'da' ? 'alle dage ' : 'every day ') + at + win(h.days[open[0]]);
  const groups = [];
  for (const i of order) {
    const d = h.days[i];
    const last = groups[groups.length - 1];
    const key = d.closed ? 'closed' : win(d);
    if (last && last.key === key && order.indexOf(i) === order.indexOf(last.end) + 1) last.end = i;
    else groups.push({ key, start: i, end: i });
  }
  const name = (g) => g.start === g.end ? DAY_SHORT[L][g.start] : `${DAY_SHORT[L][g.start]}–${DAY_SHORT[L][g.end]}`;
  return groups.filter(g => g.key !== 'closed').map(g => `${name(g)} ${at}${g.key}`).join(', ');
}
