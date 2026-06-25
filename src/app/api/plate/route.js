export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  const debug = searchParams.get('debug') === '1';

  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

  if (debug) {
    // Debug mode: return raw responses from each source
    const results = {};
    results.tjekbil = await debugSource(
      `https://www.tjekbil.dk/nummerplade/${clean}/overblik`
    );
    results.synsbasen = await debugSource(
      `https://api.synsbasen.dk/v1/vehicles/registration/${clean}`
    );
    results.dmr = await debugSource(
      `https://motorregister.skat.dk/dmr-front/resources/RegistreretKoeretoejer/${clean}`
    );
    return Response.json(results);
  }

  const result =
    (await tryTjekbil(clean)) ||
    (await trySynsbasenApi(clean)) ||
    (await tryDMR(clean)) ||
    (await trySynsbasenHtml(clean));

  if (result) {
    // console.log(`[plate] OK ${clean} → weight=${result.weight} cat=${result.category}`);
    return Response.json(result);
  }

  // console.log(`[plate] all sources failed for ${clean}`);
  return Response.json({ error: 'Not found' }, { status: 404 });
}

async function debugSource(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
        Accept: 'text/html,application/json,*/*',
        'Accept-Language': 'da-DK,da;q=0.9',
      },
      signal: AbortSignal.timeout(8000),
      redirect: 'follow',
    });
    const text = await res.text();
    return {
      status: res.status,
      url: res.url,
      bodySnippet: text.substring(0, 800),
      hasNextData: text.includes('__NEXT_DATA__'),
      weightFound: parseWeightHtml(text),
    };
  } catch (e) {
    return { error: e?.message };
  }
}

// ── tjekbil.dk — Next.js site, vehicle data embedded in __NEXT_DATA__ ─────────
async function tryTjekbil(plate) {
  for (const path of ['overblik', 'teknisk-info']) {
    try {
      const res = await fetch(
        `https://www.tjekbil.dk/nummerplade/${plate}/${path}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36',
            Accept: 'text/html,application/xhtml+xml',
            'Accept-Language': 'da-DK,da;q=0.9',
            Referer: 'https://www.tjekbil.dk/',
          },
          signal: AbortSignal.timeout(10000),
          redirect: 'follow',
        }
      );
      // console.log(`[tjekbil/${path}] status=${res.status}`);
      if (!res.ok) continue;

      const html = await res.text();
      // Parse __NEXT_DATA__ embedded JSON
      const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
      if (m) {
        try {
          const nd = JSON.parse(m[1]);
          const w = deepFindWeight(nd);
          // console.log(`[tjekbil/${path}] __NEXT_DATA__ weight=${w}`);
          if (w) return { weight: w, category: categorize(w) };
        } catch {}
      }
      const w = parseWeightHtml(html);
      // console.log(`[tjekbil/${path}] html weight=${w}`);
      if (w) return { weight: w, category: categorize(w) };
    } catch (e) {
      // console.log(`[tjekbil/${path}] err=${e?.message}`);
    }
  }
  return null;
}

// ── Synsbasen REST API ────────────────────────────────────────────────────────
async function trySynsbasenApi(plate) {
  try {
    const res = await fetch(
      `https://api.synsbasen.dk/v1/vehicles/registration/${plate}`,
      {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'Mozilla/5.0',
        },
        signal: AbortSignal.timeout(7000),
      }
    );
    // console.log(`[synsbasen-api] status=${res.status}`);
    if (!res.ok) return null;
    const raw = await res.json();
    const w = deepFindWeight(raw);
    // console.log(`[synsbasen-api] weight=${w}`);
    return w ? { weight: w, category: categorize(w) } : null;
  } catch (e) {
    // console.log(`[synsbasen-api] err=${e?.message}`);
    return null;
  }
}

// ── DMR (Statens Motorregister) ───────────────────────────────────────────────
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
    // console.log(`[dmr] status=${res.status}`);
    if (!res.ok) return null;
    const raw = await res.json();
    const w = deepFindWeight(raw);
    // console.log(`[dmr] weight=${w}`);
    return w ? { weight: w, category: categorize(w) } : null;
  } catch (e) {
    // console.log(`[dmr] err=${e?.message}`);
    return null;
  }
}

// ── Synsbasen HTML scrape ─────────────────────────────────────────────────────
async function trySynsbasenHtml(plate) {
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
    // console.log(`[synsbasen-html] status=${res.status}`);
    if (!res.ok) return null;
    const html = await res.text();
    const w = parseWeightHtml(html);
    // console.log(`[synsbasen-html] weight=${w}`);
    return w ? { weight: w, category: categorize(w) } : null;
  } catch (e) {
    // console.log(`[synsbasen-html] err=${e?.message}`);
    return null;
  }
}

function parseWeightHtml(html) {
  const patterns = [
    /tilladt\s+totalv[æa]gt[\s\S]{0,150}?(\d{3,5})\s*kg/i,
    /totalv[æa]gt[\s\S]{0,150}?(\d{3,5})\s*kg/i,
    /"totalWeight"\s*:\s*(\d{3,5})/i,
    /"tilladetTotalvaegt"\s*:\s*"?(\d{3,5})/i,
    /"allowedTotalWeight"\s*:\s*(\d{3,5})/i,
    /"total"\s*:\s*(\d{3,5})/i,
    /egenv[æa]gt[\s\S]{0,150}?(\d{3,5})\s*kg/i,
    /"kerbWeight"\s*:\s*(\d{3,5})/i,
    /v[æa]gt[\s\S]{0,80}?(\d{3,5})\s*kg/i,
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

function deepFindWeight(obj, depth = 0) {
  if (!obj || typeof obj !== 'object' || depth > 14) return 0;
  if (Array.isArray(obj)) {
    for (const item of obj) {
      const f = deepFindWeight(item, depth + 1);
      if (f) return f;
    }
    return 0;
  }
  const KEYS = ['totalvægt','totalvaegt','totalweight','tilladettotalvægt',
    'tilladettotalvaegt','tilladettotalweight','allowedtotalweight','kerbweight',
    'egenvægt','egenvagt','gross','total'];
  for (const k of Object.keys(obj)) {
    if (KEYS.includes(k.toLowerCase())) {
      const v = Number(obj[k]);
      if (v > 600 && v < 8000) return v;
    }
  }
  if (obj.weight && typeof obj.weight === 'object') {
    const v = Number(obj.weight.total || obj.weight.allowed || obj.weight.gross || 0);
    if (v > 600 && v < 8000) return v;
  }
  for (const k of Object.keys(obj)) {
    const f = deepFindWeight(obj[k], depth + 1);
    if (f) return f;
  }
  return 0;
}

function categorize(weight) {
  if (weight < 1350) return 'lille';
  if (weight < 1900) return 'mellem';
  if (weight < 3500) return 'stor';
  return 'varebil';
}
