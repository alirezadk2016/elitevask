export const runtime = 'edge';

// Returns ONLY {weight, category} — no personal data ever exposed

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Try DMR (Statens Motorregister) — official government API
  const dmr = await tryDMR(clean);
  if (dmr) return Response.json(dmr);

  // Try Synsbasen HTML scrape — weight is public technical data
  const syn = await trySynsbasen(clean);
  if (syn) return Response.json(syn);

  return Response.json({ error: 'Not found' }, { status: 404 });
}

async function tryDMR(plate) {
  try {
    const res = await fetch(
      `https://motorregister.skat.dk/dmr-front/resources/RegistreretKoeretoejer/${plate}`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'da-DK,da;q=0.9',
          'User-Agent': 'Mozilla/5.0 (compatible; site/1.0)',
        },
        signal: AbortSignal.timeout(8000),
      }
    );
    console.log(`[dmr] status=${res.status} plate=${plate}`);
    if (!res.ok) return null;

    const raw = await res.json();
    console.log('[dmr] raw keys:', Object.keys(raw || {}).join(','));

    const weight = extractWeight(raw);
    console.log(`[dmr] weight=${weight}`);
    if (!weight) return null;
    return { weight, category: categorize(weight) };
  } catch (e) {
    console.log(`[dmr] error: ${e?.message}`);
    return null;
  }
}

async function trySynsbasen(plate) {
  // Synsbasen shows public inspection records incl. vehicle weight
  try {
    const res = await fetch(
      `https://www.synsbasen.dk/stelnummer-nummerpladesoeg/results/?query=${plate}`,
      {
        headers: {
          Accept: 'text/html',
          'User-Agent': 'Mozilla/5.0 (compatible; site/1.0)',
        },
        signal: AbortSignal.timeout(9000),
      }
    );
    console.log(`[synsbasen] status=${res.status} plate=${plate}`);
    if (!res.ok) return null;

    const html = await res.text();
    // Extract total weight from HTML — look for "totalvægt" or "Tilladt totalvægt"
    const weight = parseWeightFromHtml(html);
    console.log(`[synsbasen] weight=${weight}`);
    if (!weight) return null;
    return { weight, category: categorize(weight) };
  } catch (e) {
    console.log(`[synsbasen] error: ${e?.message}`);
    return null;
  }
}

function parseWeightFromHtml(html) {
  // Try to find "tilladt totalvægt" or "totalvægt" row in HTML tables
  const patterns = [
    /tilladt\s+totalv[æa]gt[^0-9]{0,60}?(\d{3,5})/i,
    /totalv[æa]gt[^0-9]{0,60}?(\d{3,5})/i,
    /total\s+weight[^0-9]{0,60}?(\d{3,5})/i,
    /"totalWeight"\s*:\s*(\d{3,5})/i,
    /"tilladetTotalvaegt"\s*:\s*(\d{3,5})/i,
    /egenv[æa]gt[^0-9]{0,60}?(\d{3,5})/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const w = Number(m[1]);
      if (w > 500 && w < 8000) return w;
    }
  }
  return 0;
}

// Walk nested DMR JSON looking for weight fields
function extractWeight(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 8) return 0;
  const weightKeys = ['totalVægt','totalVaegt','totalWeight','tilladetTotalvægt',
    'tilladetTotalvaegt','tilladetTotalVaegt','egenvægt','egenvagt','kerbWeight'];
  for (const k of Object.keys(obj)) {
    if (weightKeys.some(wk => k.toLowerCase() === wk.toLowerCase())) {
      const v = Number(obj[k]);
      if (v > 500 && v < 8000) return v;
    }
  }
  for (const k of Object.keys(obj)) {
    const child = obj[k];
    if (child && typeof child === 'object') {
      const found = extractWeight(child, depth + 1);
      if (found) return found;
    }
  }
  return 0;
}

function categorize(weight) {
  if (weight <= 0) return 'mellem';
  if (weight < 1350) return 'lille';
  if (weight < 1900) return 'mellem';
  if (weight < 3500) return 'stor';
  return 'varebil';
}
