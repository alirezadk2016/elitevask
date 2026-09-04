// Always the production canonical domain — never VERCEL_URL / the preview
// (*.vercel.app) domain, regardless of NEXT_PUBLIC_SITE_URL.
const SITE_URL = 'https://www.elite-vask.dk';

/* lastModified must be a real date, not `new Date()`.
 *
 * This file is generated per request, so `new Date()` stamped every URL with
 * the moment of the crawl — the sitemap claimed all 22 pages had just changed,
 * every single time Google fetched it. Google's documented response to a
 * lastmod it cannot trust is to ignore lastmod for the whole site, which cost
 * us the one signal that makes a genuinely updated page get recrawled quickly.
 *
 * So each entry carries the date its content actually last changed. When you
 * edit a page, bump its date here in the same commit. */
const PAGES = [
  ['',                                '2026-09-04', 'weekly',  1.0],
  ['/priser',                         '2026-09-03', 'monthly', 0.8],
  ['/galleri',                        '2026-09-03', 'weekly',  0.8],
  ['/faq',                            '2026-09-03', 'monthly', 0.7],
  ['/guide',                          '2026-09-03', 'monthly', 0.7],
  ['/kontakt',                        '2026-09-03', 'yearly',  0.6],
  ['/handelsbetingelser',             '2026-09-03', 'yearly',  0.4],
  ['/privatpolitik',                  '2026-09-03', 'yearly',  0.4],
  ['/cookies',                        '2026-09-03', 'yearly',  0.3],

  ['/guide/hvor-ofte',                '2026-06-01', 'yearly',  0.7],
  ['/guide/salt-og-lak',              '2026-06-01', 'yearly',  0.7],
  ['/guide/dampvask-vs-traditionel',  '2026-06-19', 'yearly',  0.7],

  ['/bilvask/koebenhavn',             '2026-07-18', 'monthly', 0.9],
  ['/bilvask/roskilde',               '2026-07-18', 'monthly', 0.9],
  ['/bilvask/koege',                  '2026-07-18', 'monthly', 0.9],
  ['/bilvask/naestved',               '2026-07-18', 'monthly', 0.9],
  ['/bilvask/ringsted',               '2026-07-18', 'monthly', 0.9],
  ['/bilvask/stevns',                 '2026-08-15', 'monthly', 0.9],
  ['/bilvask/faxe',                   '2026-08-15', 'monthly', 0.9],
  ['/bilvask/helsingoer',             '2026-08-15', 'monthly', 0.9],
  ['/bilvask/hilleroed',              '2026-08-15', 'monthly', 0.9],
  ['/bilvask/frederikssund',          '2026-08-15', 'monthly', 0.9],
];

export default function sitemap() {
  return PAGES.map(([path, lastmod, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(`${lastmod}T00:00:00Z`),
    changeFrequency,
    priority,
  }));
}
