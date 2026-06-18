// Node.js runtime — better network access than edge
// Returns ONLY {weight, category} — no personal data

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

  // Try each source in order, return first success
  const result =
    (await tryMotorapi(clean)) ||
    (await tryDMR(clean)) ||
    (await trySynsbasenHtml(clean));

  if (result) {
    console.log(`[plate] OK ${clean} → weight=${result.weight} cat=${result.category}`);
    return Response.json(result);
  }

  console.log(`[plate] all sources failed for ${clean}`);
  return Response.json({ error: 'Not found' }, { status: 404 });
}

// ── motorapi.dk ──────────────────────────────────────────────────────────────
async function tryMotorapi(plate) {
  try {
    const res = await fetch(`https://motorapi.dk/vehicles/${plate}`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Mozilla/5.0',
      },
      signal: AbortSignal.timeout(7000),
    });
    console.log(`[motorapi] status=${res.status}`);
    if (!res.ok) return null;
    const raw = await res.json();
    const weight = Number(
      raw?.totalWeight || raw?.total_weight || raw?.vægt?.total ||
      raw?.technicalData?.totalWeight || raw?.weight?.total || 0
    );
    console.log(`[motorapi] weight=${weight} keys=${Object.keys(raw||{}).join(',')}`);
    if (!weight) return null;
    return { weight, category: categorize(weight) };
  } catch (e) {
    console.log(`[motorapi] err: ${e?.message}`);
    return null;
  }
}

// ── Statens Motorregister (DMR / SKAT) ───────────────────────────────────────
async function tryDMR(plate) {
  try {
    const res = await fetch(
      `https://motorregister.skat.dk/dmr-front/resources/RegistreretKoeretoejer/${plate}`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'da-DK,da;q=0.9',
          'User-Agent': 'Mozilla/5.0',
        },
        signal: AbortSignal.timeout(9000),
      }
    );
    console.log(`[dmr] status=${res.status}`);
    if (!res.ok) return null;
    const raw = await res.json();
    console.log(`[dmr] top-level keys: ${Object.keys(raw || {}).join(',')}`);
    const weight = deepFindWeight(raw);
    console.log(`[dmr] weight=${weight}`);
    if (!weight) return null;
    return { weight, category: categorize(weight) };
  } catch (e) {
    console.log(`[dmr] err: ${e?.message}`);
    return null;
  }
}

// ── Synsbasen HTML scrape — weight is public technical specification ──────────
async function trySynsbasenHtml(plate) {
  try {
    const res = await fetch(
      `https://www.synsbasen.dk/stelnummer-nummerpladesoeg/results/?query=${plate}`,
      {
        headers: {
          Accept: 'text/html,application/xhtml+xml',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept-Language': 'da-DK,da;q=0.9',
        },
        signal: AbortSignal.timeout(10000),
      }
    );
    console.log(`[synsbasen] status=${res.status}`);
    if (!res.ok) return null;
    const html = await res.text();
    const weight = parseWeightHtml(html);
    console.log(`[synsbasen] weight=${weight}`);
    if (!weight) return null;
    return { weight, category: categorize(weight) };
  } catch (e) {
    console.log(`[synsbasen] err: ${e?.message}`);
    return null;
  }
}

function parseWeightHtml(html) {
  const patterns = [
    /tilladt\s+totalv[æa]gt[\s\S]{0,80}?(\d{3,5})/i,
    /totalv[æa]gt[\s\S]{0,80}?(\d{3,5})/i,
    /"tilladetTotalvaegt"\s*:\s*"?(\d{3,5})/i,
    /"totalWeight"\s*:\s*"?(\d{3,5})/i,
    /egenv[æa]gt[\s\S]{0,80}?(\d{3,5})/i,
  ];
  for (const re of patterns) {
    const m = html.match(re);
    if (m) {
      const w = Number(m[1]);
      if (w > 600 && w < 8000) return w;
    }
  }
  return 0;
}

// Recursively search JSON for weight fields
function deepFindWeight(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 10) return 0;
  const KEYS = [
    'totalvaegt','totalvægt','totalweight','tilladeттotalvægt',
    'tilladettotalvaegt','tilladettotalvægt','kerbweight','egenvægt','egenvagt',
  ];
  for (const k of Object.keys(obj)) {
    if (KEYS.includes(k.toLowerCase())) {
      const v = Number(obj[k]);
      if (v > 600 && v < 8000) return v;
    }
  }
  for (const k of Object.keys(obj)) {
    if (obj[k] && typeof obj[k] === 'object') {
      const found = deepFindWeight(obj[k], depth + 1);
      if (found) return found;
    }
  }
  return 0;
}

function categorize(weight) {
  if (weight < 1350) return 'lille';
  if (weight < 1900) return 'mellem';
  if (weight < 3500) return 'stor';
  return 'varebil';
}
