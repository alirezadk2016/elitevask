export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
  try {
    const res = await fetch(`https://www.tjekbil.dk/api/v3/dmr/plate/${clean}`, {
      headers: {
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://www.tjekbil.dk/',
      },
      next: { revalidate: 300 }
    });
    if (!res.ok) return Response.json({ error: 'Not found' }, { status: 404 });
    const raw = await res.json();
    // Normalize Danish DMR field names to English
    const data = {
      make: raw.maerke || raw.make || raw.brand || '',
      model: raw.model || raw.modelBetegnelse || '',
      variant: raw.variant || raw.variantNavn || '',
      firstRegistration: raw.registreringsDato || raw.foersteRegistreringsDato || raw.firstRegistration || '',
      totalWeight: Number(raw.totalVaegt || raw.tekniskTotalvægt || raw.totalWeight || 0),
      usageCode: raw.anvBeskrivelse || raw.anvendelsesBeskrivelse || raw.anvendelse || raw.usageCode || raw.kind || '',
    };
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Lookup failed' }, { status: 500 });
  }
}
