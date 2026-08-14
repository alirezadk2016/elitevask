import { unstable_cache } from 'next/cache';
import { kv } from '@vercel/kv';

/* Manager-entered customer reviews.
 *
 * The homepage section is headed "Det siger vores kunder" but had no reviews
 * behind it — only a score and a button asking the visitor to write one. A
 * visitor was being asked to give trust at the exact moment they came to
 * receive it. These are real quotes the manager copies in from Google or
 * Trustpilot; nothing here is generated. */
export const getReviews = unstable_cache(
  async () => {
    try {
      const raw = await kv.get('content:reviews');
      const list = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Array.isArray(list) ? list.filter(r => r && r.text) : [];
    } catch {
      return [];
    }
  },
  ['site-reviews'],
  { revalidate: 300, tags: ['reviews'] },
);

/* Aggregate for the score block and for schema.org. Derived from the reviews
   actually shown, so the headline number can never claim more than the page
   can back up. */
export function reviewStats(list) {
  const rated = list.filter(r => Number(r.rating) >= 1 && Number(r.rating) <= 5);
  if (!rated.length) return { count: 0, avg: null };
  const avg = rated.reduce((s, r) => s + Number(r.rating), 0) / rated.length;
  return { count: rated.length, avg: Math.round(avg * 10) / 10 };
}

export function initials(name) {
  return String(name || '?')
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map(w => w.charAt(0).toUpperCase())
    .join('');
}
