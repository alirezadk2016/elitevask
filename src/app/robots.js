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
      // /admin, /portal and /annuller are deliberately NOT listed here any
      // more. They now send `noindex` (see the layouts under those routes),
      // and a crawler that is forbidden to fetch a page can never read its
      // noindex — a disallowed URL can still be indexed from an inbound link,
      // with no snippet. Letting Googlebot fetch them is what actually keeps
      // them out of the index. The API paths below have no meta tag to read,
      // so for those the disallow is still the right tool.
      disallow: [
        '/api/book', '/api/cancel', '/api/auth/', '/api/admin', '/api/admin/',
        '/api/customer/', '/api/admin-clear',
      ],
    }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
