export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const HEADERS = {
    'Accept': 'application/json',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  };

  const apis = [
    () => fetchSynsbasen(clean, HEADERS),
    () => fetchTjekbil(clean, HEADERS),
  ];

  for (const api of apis) {
    try {
      const data = await api();
      if (data) return Response.json(data);
    } catch {}
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}

async function fetchSynsbasen(plate, headers) {
  const res = await fetch(`https://api.synsbasen.dk/v1/vehicles/registration/${plate}`, {
    headers,
    next: { revalidate: 300 }
  });
  if (!res.ok) return null;
  const raw = await res.json();
  const v = raw.data || raw;
  if (!v || (!v.make && !v.brand && !v.maerke)) return null;
  return normalize(v);
}

async function fetchTjekbil(plate, headers) {
  const res = await fetch(`https://www.tjekbil.dk/api/v3/dmr/plate/${plate}`, {
    headers: { ...headers, 'Referer': 'https://www.tjekbil.dk/' },
    next: { revalidate: 300 }
  });
  if (!res.ok) return null;
  const raw = await res.json();
  if (!raw || raw.error) return null;
  return normalize(raw);
}

function normalize(raw) {
  const make = raw.make || raw.brand || raw.maerke || raw.mærke || '';
  const model = raw.model || raw.modelBetegnelse || raw.model_name || '';
  if (!make && !model) return null;
  return {
    make,
    model,
    variant: raw.variant || raw.variantNavn || raw.variant_name || '',
    firstRegistration: raw.firstRegistration || raw.registreringsDato || raw.foersteRegistreringsDato || raw.first_registration || '',
    totalWeight: Number(raw.totalWeight || raw.totalVaegt || raw.tekniskTotalvægt || raw.total_weight || 0),
    usageCode: raw.usageCode || raw.anvBeskrivelse || raw.anvendelsesBeskrivelse || raw.kind || raw.vehicle_type || '',
  };
}
