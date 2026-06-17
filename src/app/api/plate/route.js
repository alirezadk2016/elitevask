export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const apis = [
    () => fetchMotorapi(clean),
    () => fetchTjekbil(clean),
    () => fetchSynsbasen(clean),
    () => fetchNummerplade(clean),
  ];

  for (const api of apis) {
    try {
      const data = await api();
      if (data) {
        const result = { ...data, category: categorize(data) };
        console.log('[plate] success:', clean, result.make, result.model, result.category);
        return Response.json(result);
      }
    } catch (e) {
      console.error('[plate] API error:', e?.message || e);
    }
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}

async function fetchMotorapi(plate) {
  const res = await fetch(`https://motorapi.dk/vehicles/${plate}`, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) { console.log('[plate] motorapi status:', res.status); return null; }
  const raw = await res.json();
  if (!raw || raw.error) return null;
  return normalize({
    make: raw.make || raw.brand,
    model: raw.model,
    variant: raw.variant || raw.body_type,
    firstRegistration: raw.first_registration || raw.registration_date,
    totalWeight: raw.total_weight || raw.weight,
    usageCode: raw.vehicle_type || raw.usage,
  });
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

async function fetchSynsbasen(plate) {
  const res = await fetch(`https://api.synsbasen.dk/v1/vehicles/registration/${plate}`, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) { console.log('[plate] synsbasen status:', res.status); return null; }
  const raw = await res.json();
  if (!raw || raw.error) return null;
  const v = raw.data || raw.vehicle || raw;
  return normalize(v);
}

async function fetchNummerplade(plate) {
  const res = await fetch(`https://api.nrpcheck.dk/nummerplade/${plate}`, {
    headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) { console.log('[plate] nrpcheck status:', res.status); return null; }
  const raw = await res.json();
  if (!raw || raw.error || !raw.data) return null;
  return normalize(raw.data);
}

function normalize(raw) {
  if (!raw) return null;
  const make = raw.make || raw.brand || raw.mærke || raw.maerke || raw.Mærke || raw.Maerke || '';
  const model = raw.model || raw.modelBetegnelse || raw.Model || raw.model_name || raw.modelNavn || '';
  if (!make && !model) return null;
  return {
    make,
    model,
    variant: raw.variant || raw.variantNavn || raw.Variant || raw.body_type || '',
    firstRegistration: raw.firstRegistration || raw.registreringsDato || raw.foersteRegistreringsDato || raw.Første_reg || raw.first_registration || '',
    totalWeight: Number(raw.totalWeight || raw.totalVaegt || raw.tekniskTotalvægt || raw.total_weight || raw.TotalVægt || raw.weight || 0),
    usageCode: raw.usageCode || raw.anvBeskrivelse || raw.anvendelsesBeskrivelse || raw.kind || raw.vehicle_type || raw.Anvendelse || raw.usage || '',
  };
}

function categorize({ make = '', model = '', totalWeight = 0, usageCode = '' }) {
  const usage = (usageCode || '').toLowerCase();
  const mdl = (model || '').toLowerCase();

  // Vans / commercial
  if (usage.includes('vare') || usage.includes('truck') || usage.includes('van') || usage.includes('last')) return 'varebil';
  const vanModels = ['transit','sprinter','crafter','ducato','boxer','master','trafic','vito','caddy','berlingo','partner','combo','connect','tourneo','proace'];
  if (vanModels.some(v => mdl.includes(v))) return 'varebil';

  // Weight-based (most reliable)
  if (totalWeight > 0) {
    if (totalWeight < 1300) return 'lille';
    if (totalWeight < 1750) return 'mellem';
    if (totalWeight < 2800) return 'stor';
    return 'varebil';
  }

  // Model name fallback
  const smallModels = ['aygo','yaris','up','i10','i20','polo','fiesta','corsa','clio','208','108','c1','ka','micra','spark','picanto','swift','jazz','note'];
  const largeModels = ['passat','octavia','superb','mondeo','insignia','camry','rav4','cr-v','tiguan','touareg','x5','x3','q5','q7','kodiaq','qashqai','tucson','santa fe','sorento','kuga','3008','5008'];
  if (smallModels.some(m => mdl.includes(m))) return 'lille';
  if (largeModels.some(m => mdl.includes(m))) return 'stor';

  return 'mellem';
}
