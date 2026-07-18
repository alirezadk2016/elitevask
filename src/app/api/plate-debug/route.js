export const runtime = 'nodejs';
import { checkBearer } from '@/lib/adminAuth';

// Debug endpoint — requires ADMIN_SECRET (Authorization: Bearer <secret>) to
// prevent info leakage; secret is never accepted in the query string (would
// leak into logs / Referer).
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  if (!checkBearer(request)) {
    return Response.json({ error: 'forbidden' }, { status: 403 });
  }

  const plate = (searchParams.get('plate') || 'AB12345').toUpperCase().replace(/[^A-Z0-9]/g, '');
  const results = {};

  const tests = [
    { name: 'motorapi',    url: `https://motorapi.dk/vehicles/${plate}` },
    { name: 'tjekbil',    url: `https://www.tjekbil.dk/api/v3/dmr/plate/${plate}` },
    { name: 'synsbasen',  url: `https://api.synsbasen.dk/v1/vehicles/registration/${plate}` },
    { name: 'nummerplade', url: `https://www.nummerplade.net/nummerplade.asp?nummerplade=${plate}` },
  ];

  for (const { name, url } of tests) {
    try {
      const r = await fetch(url, {
        headers: { Accept: 'application/json, text/html', 'User-Agent': 'Mozilla/5.0' },
        signal: AbortSignal.timeout(6000),
      });
      const text = await r.text();
      results[name] = { status: r.status, ok: r.ok, snippet: text.slice(0, 200) };
    } catch (e) {
      results[name] = { error: e.message };
    }
  }

  return Response.json({ plate, results });
}
