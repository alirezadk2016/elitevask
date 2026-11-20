import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
  // KV down → empty list (200), so the page keeps its built-in photos
  // instead of logging a 500.
  let items = [];
  try {
    items = (await kv.get('content:beforeafter')) || [];
  } catch {
    return Response.json({ items: [] }, { headers: { 'Cache-Control': 'no-store' } });
  }
  return Response.json({ items }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
