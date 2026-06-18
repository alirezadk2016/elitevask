export const runtime = 'edge';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'da-DK,da;q=0.9,en;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  if (!plate || plate.length < 2) {
    return Response.json({ error: 'Invalid plate' }, { status: 400 });
  }
  const clean = plate.toUpperCase().replace(/[^A-Z0-9]/g, '');

  const apis = [
    { name: 'tjekbil-html', fn: () => fetchTjekbilHtml(clean) },
    { name: 'nummerplade', fn: () => fetchNummerplade(clean) },
    { name: 'motorapi', fn: () => fetchMotorapi(clean) },
  ];

  for (const { name, fn } of apis) {
    try {
      const data = await fn();
      if (data && (data.make || data.model)) {
        const result = { ...data, category: categorize(data) };
        console.log(`[plate] ok via ${name}: ${clean} → ${result.make} ${result.model} (${result.category})`);
        return Response.json(result);
      }
    } catch (e) {
      console.error(`[plate] ${name} failed: ${e?.message}`);
    }
  }

  return Response.json({ error: 'Not found' }, { status: 404 });
}

// Scrape tjekbil.dk overblik page — most reliable, has real DMR data
async function fetchTjekbilHtml(plate) {
  const res = await fetch(`https://www.tjekbil.dk/nummerplade/${plate}/overblik`, {
    headers: { ...HEADERS, 'Referer': 'https://www.tjekbil.dk/' },
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) { console.log('[plate] tjekbil-html status:', res.status); return null; }
  const html = await res.text();

  // Extract from <title>: "DG94158 - MAZDA MX-5 1.5 SKYACTIV..."
  const titleM = html.match(/<title[^>]*>[^-]+-\s*([A-ZÆØÅ][^\|<]{2,60})<\/title>/i);
  // Extract from <h1>: "MAZDA MX-5"
  const h1M = html.match(/<h1[^>]*>\s*([A-ZÆØÅ][^<]{2,50})\s*<\/h1>/i);
  // Extract variant/subtitle
  const varM = html.match(/<[hp][^>]*>\s*([\d\.]+\s+[A-Z][^<]{5,60})\s*<\/[hp]>/i);

  let make = '', model = '', variant = '';

  if (h1M) {
    const parts = h1M[1].trim().split(/\s+/);
    make = parts[0] || '';
    model = parts.slice(1).join(' ') || '';
  } else if (titleM) {
    const parts = titleM[1].trim().split(/\s+/);
    make = parts[0] || '';
    model = parts.slice(1).join(' ') || '';
  }
  if (varM) variant = varM[1].trim();

  // Extract year from "10. oktober 2022" or similar
  const yearM = html.match(/(\d{4})/);
  const firstReg = yearM ? yearM[1] : '';

  // Detect fuel/type
  const isBenzin = /benzin/i.test(html);
  const isEl = /elbil|elektrisk|electric/i.test(html);
  const isVan = /varebil|varevogn|van\b/i.test(html);

  const usageCode = isVan ? 'Varebil' : 'Personbil';

  console.log('[plate] tjekbil-html parsed:', { make, model, variant });
  if (!make && !model) return null;
  return { make, model, variant, firstRegistration: firstReg, totalWeight: 0, usageCode };
}

async function fetchNummerplade(plate) {
  const res = await fetch(`https://www.nummerplade.net/nummerplade.asp?nummerplade=${plate}`, {
    headers: HEADERS,
    signal: AbortSignal.timeout(10000),
  });
  if (!res.ok) return null;
  const html = await res.text();

  function exTd(label) {
    const re = new RegExp('<td[^>]*>\\s*' + label + '[^<]*</td>\\s*<td[^>]*>([^<]{1,100})', 'i');
    const m = html.match(re);
    return m ? m[1].trim() : '';
  }

  const make = exTd('M.rke') || exTd('Fabrikat');
  const model = exTd('Model');
  const variant = exTd('Variant');
  const firstReg = exTd('1\\. reg') || exTd('Registrering');
  const ws = exTd('Totalv.gt');
  const totalWeight = parseInt(ws.replace(/\D/g, ''), 10) || 0;
  const usageCode = exTd('Anvendelse') || exTd('K.ret.jsart');

  if (!make && !model) return null;
  return { make, model, variant, firstRegistration: firstReg, totalWeight, usageCode };
}

async function fetchMotorapi(plate) {
  const res = await fetch(`https://motorapi.dk/vehicles/${plate}`, {
    headers: { ...HEADERS, Accept: 'application/json' },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) return null;
  let raw;
  try { raw = await res.json(); } catch { return null; }
  if (!raw || raw.error) return null;
  const make = raw.make || raw.brand || raw.mærke || '';
  const model = raw.model || raw.modelName || '';
  if (!make && !model) return null;
  return {
    make, model,
    variant: raw.variant || raw.body || '',
    firstRegistration: raw.firstRegistration || raw.year || '',
    totalWeight: Number(raw.totalWeight || raw.weight || 0),
    usageCode: raw.usageCode || raw.type || raw.kind || '',
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
