// Always the production canonical domain — never the preview (*.vercel.app) domain.
const SITE_URL = 'https://www.elite-vask.dk';

export default function robots() {
  return {
    rules: [{
      userAgent: '*',
      // The public content endpoints must stay crawlable: the homepage and
      // /galleri load their live content from them client-side, and a blanket
      // /api/ disallow makes Googlebot's renderer skip those fetches — it would
      // then only ever index the hardcoded fallbacks. Private/admin endpoints
      // are still blocked individually.
      allow: ['/', '/api/site-content', '/api/content/'],
      disallow: [
        '/api/book', '/api/cancel', '/api/auth/', '/api/admin', '/api/admin/',
        '/api/customer/', '/admin', '/portal', '/cancel', '/annuller',
      ],
    }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
