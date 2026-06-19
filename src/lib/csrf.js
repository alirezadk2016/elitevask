const ALLOWED_ORIGINS = [
  'https://elitevask.vercel.app',
  'http://localhost:3000',
];

export function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const check = origin || (referer ? new URL(referer).origin : null);
  if (!check) return false; // no origin header = reject for state-changing requests
  return ALLOWED_ORIGINS.includes(check);
}
