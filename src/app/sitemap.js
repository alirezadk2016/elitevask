import { PAGES } from '@/lib/pageDates';
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


export default function sitemap() {
  return PAGES.map(([path, lastmod, changeFrequency, priority]) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(`${lastmod}T00:00:00Z`),
    changeFrequency,
    priority,
  }));
}
