// Convert a Copenhagen wall-clock date+time ("2026-07-05", "12:00") to a UTC epoch ms,
// DST-aware via Intl (no hardcoded offsets).
export function cphEpoch(date, time) {
  const utcGuess = new Date(`${date}T${time}:00Z`).getTime();
  if (Number.isNaN(utcGuess)) return NaN;
  const wall = new Date(utcGuess).toLocaleString('sv-SE', { timeZone: 'Europe/Copenhagen' });
  const offset = new Date(wall.replace(' ', 'T') + 'Z').getTime() - utcGuess;
  return utcGuess - offset;
}
