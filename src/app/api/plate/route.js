export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');
  try {
    const res = await fetch(`https://www.tjekbil.dk/api/v3/dmr/plate/${clean}`, {
      headers: { 'Accept': 'application/json', 'User-Agent': 'Mozilla/5.0' },
      next: { revalidate: 300 }
    });
    if (!res.ok) return Response.json({ error: 'Not found' }, { status: 404 });
    const data = await res.json();
    return Response.json(data);
  } catch {
    return Response.json({ error: 'Lookup failed' }, { status: 500 });
  }
}
