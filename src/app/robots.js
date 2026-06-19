const SITE_URL = 'https://elitevask.vercel.app';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/cancel'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
