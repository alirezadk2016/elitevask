export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const apis = [
    { name: 'motorapi', fn: () => fetchMotorapi(clean) },
    { name: 'tjekbil', fn: () => fetchTjekbil(clean) },
    { name: 'nummerplade', fn: () => fetchNummerpladeScrape(clean) },
    { name: 'synsbasen', fn: () => fetchSynsbasen(clean) },
    { name: 'bilinfo', fn: () => fetchBilinfo(clean) },
  ];

  for (const { name, fn } of apis) {
    try {
      const data = await fn();
      if (data && (data.make || data.model)) {
        const result = { ...data, category: categorize(data) };
        console.log(`[plate] ok via ${name}:`, clean, result.make, result.model, result.category);
        return Response.json(result);
      }
    } catch (e) {
      console.error(`[plate] ${name} error:`, e?.message || e);
    }
  }

  console.error('[plate] all apis failed for:', clean);
  return Response.json({ error: 'Not found' }, { status: 404 });
}

async function fetchMotorapi(plate) {
  const res = await fetch(`https://motorapi.dk/vehicles/${plate}`, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) { console.log('[plate] motorapi status:', res.status); return null; }
  const raw = await res.json();
  if (!raw || raw.error) return null;
  // motorapi.dk response shape
  const make = raw.make || raw.brand || raw.mærke || '';
  const model = raw.model || raw.modelName || '';
  if (!make && !model) return null;
  return {
    make,
    model,
    variant: raw.variant || raw.body || '',
    firstRegistration: raw.firstRegistration || raw.year || '',
    totalWeight: Number(raw.totalWeight || raw.weight || raw.curb_weight || 0),
    usageCode: raw.usageCode || raw.type || raw.kind || '',
  };
}

async function fetchTjekbil(plate) {
  const res = await fetch(`https://www.tjekbil.dk/api/v3/dmr/plate/${plate}`, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Referer': 'https://www.tjekbil.dk/',
      'Origin': 'https://www.tjekbil.dk',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) { console.log('[plate] tjekbil status:', res.status); return null; }
  const raw = await res.json();
  if (!raw || raw.error || (!raw.make && !raw.mærke && !raw.brand)) return null;
  return normalize(raw);
}

async function fetchNummerpladeScrape(plate) {
  const res = await fetch(`https://www.nummerplade.net/nummerplade.asp?nummerplade=${plate}`, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Accept-Language': 'da-DK,da;q=0.9,en;q=0.8',
    },
    signal: AbortSignal.timeout(12000),
  });
  if (!res.ok) { console.log('[plate] nummerplade.net status:', res.status); return null; }
  const html = await res.text();

  function extract(label) {
    const re = new RegExp(label + '[^<]*<[^>]+>([^<]{1,80})', 'i');
    const m = html.match(re);
    return m ? m[1].trim() : '';
  }

  const make = extract('Mærke') || extract('Fabrikat') || extract('Make');
  const model = extract('Model');
  const variant = extract('Variant');
  const firstReg = extract('1\\. reg') || extract('Første reg') || extract('Registrering');
  const weightStr = extract('Totalvægt') || extract('teknisk totalvægt') || '';
  const totalWeight = parseInt(weightStr.replace(/\D/g, ''), 10) || 0;
  const usageCode = extract('Anvendelse') || extract('Køretøjsart');

  console.log('[plate] nummerplade.net scraped:', { make, model, totalWeight, usageCode });
  if (!make && !model) return null;
  return { make, model, variant, firstRegistration: firstReg, totalWeight, usageCode };
}

async function fetchSynsbasen(plate) {
  const res = await fetch(`https://api.synsbasen.dk/v1/vehicles/registration/${plate}`, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) { console.log('[plate] synsbasen status:', res.status); return null; }
  const raw = await res.json();
  if (!raw || raw.error) return null;
  const v = raw.data || raw.vehicle || raw;
  return normalize(v);
}

async function fetchBilinfo(plate) {
  // bilinfo.dk uses a public search endpoint
  const res = await fetch(`https://www.bilinfo.dk/api/search/vehicles?registrationNumber=${plate}`, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) { console.log('[plate] bilinfo status:', res.status); return null; }
  const raw = await res.json();
  const v = Array.isArray(raw) ? raw[0] : (raw.data?.[0] || raw.vehicles?.[0] || raw);
  if (!v) return null;
  return normalize(v);
}

function normalize(raw) {
  if (!raw) return null;
  const make = raw.make || raw.brand || raw.mærke || raw.maerke || raw.Mærke || raw.Maerke || raw.make_name || '';
  const model = raw.model || raw.modelBetegnelse || raw.Model || raw.model_name || raw.modelNavn || raw.model_description || '';
  if (!make && !model) return null;
  return {
    make,
    model,
    variant: raw.variant || raw.variantNavn || raw.Variant || raw.body_type || '',
    firstRegistration: raw.firstRegistration || raw.registreringsDato || raw.foersteRegistreringsDato || raw.first_registration || raw.year || '',
    totalWeight: Number(raw.totalWeight || raw.totalVaegt || raw.tekniskTotalvægt || raw.total_weight || raw.TotalVægt || raw.weight || raw.curb_weight || 0),
    usageCode: raw.usageCode || raw.anvBeskrivelse || raw.anvendelsesBeskrivelse || raw.vehicle_type || raw.Anvendelse || raw.usage || raw.kind || '',
  };
}

function categorize({ make = '', model = '', totalWeight = 0, usageCode = '' }) {
  const usage = (usageCode || '').toLowerCase();
  const mdl = (model || '').toLowerCase();

  if (usage.includes('vare') || usage.includes('truck') || usage.includes('van') || usage.includes('last')) return 'varebil';
  const vanModels = ['transit','sprinter','crafter','ducato','boxer','master','trafic','vito','caddy','berlingo','partner','combo','connect','tourneo','proace','movano','vivaro'];
  if (vanModels.some(v => mdl.includes(v))) return 'varebil';

  if (totalWeight > 0) {
    if (totalWeight < 1300) return 'lille';
    if (totalWeight < 1750) return 'mellem';
    if (totalWeight < 2800) return 'stor';
    return 'varebil';
  }

  const smallModels = ['aygo','yaris','up','i10','i20','polo','fiesta','corsa','clio','208','108','c1','ka','micra','spark','picanto','swift','jazz','note','fabia','ibiza','rio','seibertling'];
  const largeModels = ['passat','octavia','superb','mondeo','insignia','camry','rav4','cr-v','tiguan','touareg','x5','x3','q5','q7','kodiaq','qashqai','tucson','santa fe','sorento','kuga','3008','5008','xc60','xc90','cx-5','cx-60','palisade','stinger'];
  if (smallModels.some(m => mdl.includes(m))) return 'lille';
  if (largeModels.some(m => mdl.includes(m))) return 'stor';

  return 'mellem';
}
