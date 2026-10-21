/* The date each public page's content last changed. One table for both the
 * sitemap's <lastmod> and the pages' schema.org dateModified, so the two can
 * never disagree. When you edit a page, bump its date here. */
export const PAGES = [
  ['',                                '2026-10-21', 'weekly',  1.0],
  ['/priser',                         '2026-10-10', 'monthly', 0.8],
  ['/galleri',                        '2026-10-21', 'weekly',  0.8],
  ['/faq',                            '2026-10-21', 'monthly', 0.7],
  ['/guide',                          '2026-10-21', 'monthly', 0.7],
  ['/om-os',                          '2026-10-11', 'yearly',  0.6],
  ['/kontakt',                        '2026-09-14', 'yearly',  0.6],
  ['/handelsbetingelser',             '2026-09-03', 'yearly',  0.4],
  ['/privatpolitik',                  '2026-09-03', 'yearly',  0.4],
  ['/cookies',                        '2026-09-03', 'yearly',  0.3],

  ['/guide/hvor-ofte',                '2026-10-21', 'yearly',  0.7],
  ['/guide/salt-og-lak',              '2026-10-21', 'yearly',  0.7],
  ['/guide/dampvask-vs-traditionel',  '2026-10-21', 'yearly',  0.7],

  ['/bilvask/koebenhavn',             '2026-10-21', 'monthly', 0.9],
  ['/bilvask/roskilde',               '2026-10-21', 'monthly', 0.9],
  ['/bilvask/koege',                  '2026-10-21', 'monthly', 0.9],
  ['/bilvask/naestved',               '2026-10-21', 'monthly', 0.9],
  ['/bilvask/ringsted',               '2026-10-21', 'monthly', 0.9],
  ['/bilvask/stevns',                 '2026-10-21', 'monthly', 0.9],
  ['/bilvask/faxe',                   '2026-10-21', 'monthly', 0.9],
  ['/bilvask/helsingoer',             '2026-10-21', 'monthly', 0.9],
  ['/bilvask/hilleroed',              '2026-10-21', 'monthly', 0.9],
  ['/bilvask/frederikssund',          '2026-10-21', 'monthly', 0.9],
];

export function lastModified(path) {
  const row = PAGES.find(([p]) => p === (path === '/' ? '' : path));
  return row ? row[1] : null;
}
