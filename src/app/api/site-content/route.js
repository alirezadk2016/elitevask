import { kv } from '@vercel/kv';
import { normalizeHours } from '@/lib/hours';

export const revalidate = 60;

export async function GET() {
  try {
    const [faq, prices, extras, hours] = await Promise.all([
      kv.get('content:faq'),
      kv.get('content:prices'),
      kv.get('content:extras'),
      kv.get('content:hours'),
    ]);

    const result = {};
    if (faq)    result.faq    = typeof faq    === 'string' ? JSON.parse(faq)    : faq;
    if (prices) result.prices = typeof prices === 'string' ? JSON.parse(prices) : prices;
    if (extras) result.extras = typeof extras === 'string' ? JSON.parse(extras) : extras;
    // Always return a valid hours object (normalized) so the client never has
    // to know the defaults — hours drives the booking slot grid.
    result.hours = normalizeHours(hours);

    return Response.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch {
    return Response.json({}, {
      headers: { 'Cache-Control': 'public, s-maxage=30' },
    });
  }
}
