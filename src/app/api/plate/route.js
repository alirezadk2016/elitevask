// Returns ONLY {weight, category} — no personal data

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const result =
    (await tryTjekbil(clean)) ||
    (await tryDMR(clean)) ||
    (await trySynsbasen(clean));

  if (result) {
    console.log(`[plate] OK ${clean} → weight=${result.weight} cat=${result.category}`);
    return Response.json(result);
  }

  console.log(`[plate] all sources failed for ${clean}`);
  return Response.json({ error: 'Not found' }, { status: 404 });
}

// ── tjekbil.dk — scrape __NEXT_DATA__ JSON embedded in public HTML ────────────
async function tryTjekbil(plate) {
  try {
    const res = await fetch(
      `https://www.tjekbil.dk/nummerplade/${plate}/teknisk-info`,
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml',
          'Accept-Language': 'da-DK,da;q=0.9',
        },
        signal: AbortSignal.timeout(10000),
        redirect: 'follow',
      }
    );
    console.log(`[tjekbil] status=${res.status} url=${res.url}`);
    if (!res.ok) return null;

    const html = await res.text();

    // Next.js embeds all page data in __NEXT_DATA__ script tag
    const ndMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    if (ndMatch) {
      try {
        const nd = JSON.parse(ndMatch[1]);
        const weight = deepFindWeight(nd);
        console.log(`[tjekbil] __NEXT_DATA__ weight=${weight}`);
        if (weight) return { weight, category: categorize(weight) };
      } catch (e) {
        console.log(`[tjekbil] JSON parse err: ${e?.message}`);
      }
    }

    // Fallback: regex patterns on raw HTML
    const weight = parseWeightHtml(html);
    console.log(`[tjekbil] html regex weight=${weight}`);
    if (weight) return { weight, category: categorize(weight) };

    return null;
  } catch (e) {
    console.log(`[tjekbil] err: ${e?.message}`);
    return null;
  }
}

// ── Statens Motorregister (DMR) ───────────────────────────────────────────────
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
    const weight = deepFindWeight(raw);
    console.log(`[dmr] weight=${weight}`);
    if (!weight) return null;
    return { weight, category: categorize(weight) };
  } catch (e) {
    console.log(`[dmr] err: ${e?.message}`);
    return null;
  }
}

// ── Synsbasen HTML ────────────────────────────────────────────────────────────
async function trySynsbasen(plate) {
  try {
    const res = await fetch(
      `https://www.synsbasen.dk/stelnummer-nummerpladesoeg/results/?query=${plate}`,
      {
        headers: {
          Accept: 'text/html',
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
  // Common weight field patterns in Danish car sites
  const patterns = [
    /tilladt\s+totalv[æa]gt[\s\S]{0,120}?(\d{3,5})\s*kg/i,
    /totalv[æa]gt[\s\S]{0,120}?(\d{3,5})\s*kg/i,
    /"totalWeight"\s*:\s*(\d{3,5})/i,
    /"tilladetTotalvaegt"\s*:\s*"?(\d{3,5})/i,
    /"allowedTotalWeight"\s*:\s*(\d{3,5})/i,
    /tilladt[\s\S]{0,40}?(\d{3,5})\s*kg/i,
    /egenv[æa]gt[\s\S]{0,120}?(\d{3,5})\s*kg/i,
    /"weight"\s*:\s*\{[^}]{0,200}?"total"\s*:\s*(\d{3,5})/i,
    /"kerbWeight"\s*:\s*(\d{3,5})/i,
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

// Recursively walk any JSON object to find weight fields
function deepFindWeight(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 12) return 0;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const f = deepFindWeight(item, depth + 1);
      if (f) return f;
    }
    return 0;
  }
  const WEIGHT_KEYS = [
    'totalvægt','totalvaegt','totalweight','tilladettotalvægt',
    'tilladettotalvaegt','tilladettotalweight','allowedtotalweight',
    'kerbweight','egenvægt','egenvagt',
  ];
  for (const k of Object.keys(obj)) {
    if (WEIGHT_KEYS.includes(k.toLowerCase())) {
      const v = Number(obj[k]);
      if (v > 600 && v < 8000) return v;
    }
  }
  // Also check nested "weight" object with "total" field
  if (obj.weight && typeof obj.weight === 'object') {
    const v = Number(obj.weight.total || obj.weight.allowed || obj.weight.gross || 0);
    if (v > 600 && v < 8000) return v;
  }
  for (const k of Object.keys(obj)) {
    const child = obj[k];
    if (child && typeof child === 'object') {
      const found = deepFindWeight(child, depth + 1);
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
