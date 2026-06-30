// Always the production canonical domain — never the preview (*.vercel.app) domain.
const SITE_URL = 'https://www.elite-vask.dk';

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
