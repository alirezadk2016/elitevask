export const runtime = 'edge';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

  try {
    const res = await fetch(
      `https://motorregister.skat.dk/dmr-front/resources/RegistreretKoeretoejer/${clean}`,
      {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'da-DK,da;q=0.9',
        },
        signal: AbortSignal.timeout(10000),
      }
    );

    if (!res.ok) {
      console.log(`[plate] DMR status ${res.status} for ${clean}`);
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    const raw = await res.json();
    const data = extractDmr(raw);

    if (!data.make && !data.model) {
      return Response.json({ error: 'Not found' }, { status: 404 });
    }

    const result = { ...data, category: categorize(data) };
    console.log(`[plate] DMR ok: ${clean} → ${result.make} ${result.model} (${result.category})`);
    return Response.json(result);
  } catch (e) {
    console.error(`[plate] DMR error: ${e?.message}`);
    return Response.json({ error: 'Not found' }, { status: 404 });
  }
}

function extractDmr(raw) {
  // DMR returns a nested structure; field names vary by API version
  const v = raw?.køretøj || raw?.koeretoejet || raw?.vehicle || raw || {};
  const basis = v?.køretøjsartVærdi || v?.koeretoejet || v?.basis || v;

  const make =
    v?.mærke || v?.maerke || v?.make ||
    basis?.mærke || basis?.maerke || basis?.make ||
    raw?.mærke || raw?.maerke || raw?.make || '';

  const model =
    v?.model || basis?.model || raw?.model || '';

  const variant =
    v?.variant || basis?.variant || raw?.variant || '';

  const firstRegistration =
    v?.førsteRegistreringDato || v?.foersteRegistreringDato ||
    v?.firstRegistration || raw?.firstRegistration || '';

  const totalWeight = Number(
    v?.totalVægt || v?.totalVaegt || v?.totalWeight ||
    basis?.totalVægt || raw?.totalWeight || 0
  );

  const usageCode =
    v?.anvendelse || v?.usageCode || basis?.anvendelse ||
    raw?.anvendelse || raw?.usageCode || '';

  return {
    make: String(make).trim(),
    model: String(model).trim(),
    variant: String(variant).trim(),
    firstRegistration: String(firstRegistration).substring(0, 4),
    totalWeight,
    usageCode: String(usageCode).trim(),
  };
}

function categorize({ make = '', model = '', totalWeight = 0, usageCode = '' }) {
  const usage = (usageCode || '').toLowerCase();
  const mdl = (model || '').toLowerCase();
  const mk = (make || '').toLowerCase();
  const full = mk + ' ' + mdl;

  if (usage.includes('vare') || usage.includes('truck') || usage.includes('van') || usage.includes('last')) return 'varebil';
  const vanModels = ['transit','sprinter','crafter','ducato','boxer','master','trafic','vito','caddy','berlingo','partner','combo','connect','tourneo','proace','movano','vivaro'];
  if (vanModels.some(v => full.includes(v))) return 'varebil';

  if (totalWeight > 0) {
    if (totalWeight < 1300) return 'lille';
    if (totalWeight < 1750) return 'mellem';
    if (totalWeight < 2800) return 'stor';
    return 'varebil';
  }

  const smallModels = ['mx-5','aygo','yaris','up','i10','i20','polo','fiesta','corsa','clio','208','108','c1','ka','micra','spark','picanto','swift','jazz','note','fabia','ibiza','rio','lupo','arosa','107','forfour','smart','roadster','cabrio','convertible'];
  const largeModels = ['passat','octavia','superb','mondeo','insignia','camry','rav4','cr-v','tiguan','touareg','x5','x3','q5','q7','kodiaq','qashqai','tucson','santa fe','sorento','kuga','3008','5008','xc60','xc90','cx-5','cx-60','palisade','stinger','outlander'];
  if (smallModels.some(m => full.includes(m))) return 'lille';
  if (largeModels.some(m => full.includes(m))) return 'stor';

  return 'mellem';
}
