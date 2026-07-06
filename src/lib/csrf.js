const ALLOWED_ORIGINS = [
  'https://elite-vask.dk',
  'https://www.elite-vask.dk',
  'https://elitevask.vercel.app',
  // localhost only outside production
  ...(process.env.NODE_ENV !== 'production' ? ['http://localhost:3000'] : []),
];

export function isSameOrigin(request) {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  const check = origin || (referer ? new URL(referer).origin : null);
  if (!check) return false; // no origin header = reject for state-changing requests
  if (ALLOWED_ORIGINS.includes(check)) return true;
  // also accept the host the request actually arrived on (covers preview deploys)
  try {
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_BASE_URL;
    if (envUrl && check === new URL(envUrl).origin) return true;
    if (check === new URL(request.url).origin) return true;
    const reqOrigin = `https://${request.headers.get('host') || ''}`;
    return check === reqOrigin;
  } catch { return false; }
}
