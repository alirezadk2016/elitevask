const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://elite-vask.dk';

export default function robots() {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/', '/cancel'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
