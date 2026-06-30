const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.elite-vask.dk';

export default function robots() {
  return {
    rules: [{
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin', '/portal', '/cancel', '/annuller'],
    }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
