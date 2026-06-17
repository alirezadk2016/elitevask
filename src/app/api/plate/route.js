export const runtime = 'nodejs';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const apis = [
    () => fetchTjekbil(clean),
    () => fetchNummerplade(clean),
  ];

  for (const api of apis) {
    try {
      const data = await api();
      if (data) return Response.json(data);
    } catch (e) {
      console.error('Plate API error:', e.message);
    }
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
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
  if (!res.ok) return null;
  const raw = await res.json();
  if (!raw || raw.error || (!raw.make && !raw.mærke && !raw.brand)) return null;
  return normalize(raw);
}

async function fetchNummerplade(plate) {
  const res = await fetch(`https://api.nrpcheck.dk/nummerplade/${plate}`, {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'Mozilla/5.0',
    },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  const raw = await res.json();
  if (!raw || raw.error || !raw.data) return null;
  const v = raw.data;
  return normalize(v);
}

function normalize(raw) {
  const make = raw.make || raw.brand || raw.mærke || raw.maerke || raw.Mærke || '';
  const model = raw.model || raw.modelBetegnelse || raw.Model || raw.model_name || '';
  if (!make && !model) return null;
  return {
    make,
    model,
    variant: raw.variant || raw.variantNavn || raw.Variant || '',
    firstRegistration: raw.firstRegistration || raw.registreringsDato || raw.foersteRegistreringsDato || raw.Første_reg || '',
    totalWeight: Number(raw.totalWeight || raw.totalVaegt || raw.tekniskTotalvægt || raw.total_weight || raw.TotalVægt || 0),
    usageCode: raw.usageCode || raw.anvBeskrivelse || raw.anvendelsesBeskrivelse || raw.kind || raw.vehicle_type || raw.Anvendelse || '',
  };
}
