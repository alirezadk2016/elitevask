import { kv } from '@vercel/kv';

export const revalidate = 60;

export async function GET() {
  try {
    const [faq, prices, extras] = await Promise.all([
      kv.get('content:faq'),
      kv.get('content:prices'),
      kv.get('content:extras'),
    ]);

    const result = {};
    if (faq)    result.faq    = typeof faq    === 'string' ? JSON.parse(faq)    : faq;
    if (prices) result.prices = typeof prices === 'string' ? JSON.parse(prices) : prices;
    if (extras) result.extras = typeof extras === 'string' ? JSON.parse(extras) : extras;

    return Response.json(result, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    });
  } catch {
    return Response.json({}, {
      headers: { 'Cache-Control': 'public, s-maxage=30' },
    });
  }
}
