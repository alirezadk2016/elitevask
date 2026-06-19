const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elite-vask.dk';

export default function sitemap() {
  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/handelsbetingelser`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/privatpolitik`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.4 },
    { url: `${SITE_URL}/cookies`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.3 },
  ];
}
