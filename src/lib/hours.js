// Single source of truth for booking opening hours.
//
// The manager edits these from the admin panel ("Åbningstider"); the value is
// stored in KV under `content:hours` and consumed by the booking API, the
// customer wizard and the admin calendar. Everything falls back to
// DEFAULT_HOURS when KV is empty, so the site keeps working before the first
// save.

// Opening window 15:30–22:00, 30-minute slots, open every day.
export const DEFAULT_HOURS = { open: '15:30', close: '22:00', slotMinutes: 30, closedDays: [] };

// Real service durations per car type, in minutes. Slot counts are derived
// from these so changing the slot interval never breaks the math.
export const CAR_DURATION_MIN = { lille: 120, mellem: 180, stor: 240, varebil: 180 };

// Only intervals that divide every duration evenly, so slot counts stay exact.
export const ALLOWED_SLOT_MINUTES = [15, 30, 60];

const TIME_RE = /^([01]\d|2[0-3]):([0-5]\d)$/;

export function toMin(t) {
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
export function normalizeHours(raw) {
  const h = raw && typeof raw === 'object' ? raw : {};
  let slot = parseInt(h.slotMinutes, 10);
  if (!ALLOWED_SLOT_MINUTES.includes(slot)) slot = DEFAULT_HOURS.slotMinutes;

  let openM = toMin(h.open);
  let closeM = toMin(h.close);
  if (Number.isNaN(openM)) openM = toMin(DEFAULT_HOURS.open);
  if (Number.isNaN(closeM)) closeM = toMin(DEFAULT_HOURS.close);
  // Snap to the slot grid and guarantee at least one bookable slot.
  openM = Math.round(openM / slot) * slot;
  closeM = Math.round(closeM / slot) * slot;
  if (closeM - openM < slot) closeM = openM + slot;

  const closedDays = Array.isArray(h.closedDays)
    ? [...new Set(h.closedDays.map(Number).filter(d => d >= 0 && d <= 6))].sort((a, b) => a - b)
    : [];

  return { open: minToLabel(openM), close: minToLabel(closeM), slotMinutes: slot, closedDays };
}

// Ordered list of selectable start times ("HH:MM") within the window.
export function buildSlotTimes(hours) {
  const h = normalizeHours(hours);
  const start = toMin(h.open), end = toMin(h.close);
  const out = [];
  for (let m = start; m + h.slotMinutes <= end; m += h.slotMinutes) out.push(minToLabel(m));
  return out;
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
  return h.closedDays.includes(weekdayOf(dateStr));
}
