const SITE_URL = 'https://elitevask.vercel.app';

export default function sitemap() {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/handelsbetingelser`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privatpolitik`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/cookies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
    { url: `${SITE_URL}/guide/hvor-ofte`, lastModified: new Date('2026-06-01'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/guide/salt-og-lak`, lastModified: new Date('2026-06-01'), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/guide/dampvask-vs-traditionel`, lastModified: new Date('2026-06-19'), changeFrequency: 'monthly', priority: 0.7 },
  ];
}
