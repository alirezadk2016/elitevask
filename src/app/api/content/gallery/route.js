import { kv } from '@vercel/kv';

export const dynamic = 'force-dynamic';

export async function GET() {
  const items = await kv.get('content:gallery') || [];
  return Response.json({ items }, {
    headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
  });
}
