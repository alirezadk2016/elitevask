import { kv } from '@vercel/kv';
import { put, del } from '@vercel/blob';

const AUTH = process.env.ADMIN_SECRET;

function authorized(req) {
  const h = req.headers.get('authorization') || '';
  return h === `Bearer ${AUTH}`;
}

// GET /api/admin/content?type=gallery|videos
export async function GET(req) {
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const type = new URL(req.url).searchParams.get('type') || 'gallery';
  const items = await kv.get(`content:${type}`) || [];
  return Response.json({ items });
}

// POST /api/admin/content — add item
export async function POST(req) {
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const contentType = req.headers.get('content-type') || '';
  let item;

  if (contentType.includes('multipart/form-data')) {
    // File upload via Vercel Blob
    const form = await req.formData();
    const file = form.get('file');
    const type = form.get('type') || 'gallery';
    const caption = form.get('caption') || '';

    if (!file) return Response.json({ error: 'no_file' }, { status: 400 });

    const blob = await put(`elite-vask/${type}/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    item = {
      id: Date.now().toString(),
      url: blob.url,
      caption,
      source: 'upload',
      uploadedAt: new Date().toISOString(),
    };

    const existing = await kv.get(`content:${type}`) || [];
    await kv.set(`content:${type}`, [item, ...existing]);
    return Response.json({ ok: true, item });

  } else {
    // URL-based
    const body = await req.json();
    const { type = 'gallery', url, caption = '', title = '' } = body;

    if (!url) return Response.json({ error: 'no_url' }, { status: 400 });

    item = {
      id: Date.now().toString(),
      url,
      caption,
      title,
      source: 'url',
      uploadedAt: new Date().toISOString(),
    };

    if (type === 'videos') {
      // Detect platform and extract embed URL
      item.platform = url.includes('youtube') || url.includes('youtu.be') ? 'youtube' : 'vimeo';
      item.embedUrl = getEmbedUrl(url);
      item.thumbnail = getThumbnail(url);
    }

    const existing = await kv.get(`content:${type}`) || [];
    await kv.set(`content:${type}`, [item, ...existing]);
    return Response.json({ ok: true, item });
  }
}

// DELETE /api/admin/content
export async function DELETE(req) {
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const { type = 'gallery', id, blobUrl } = await req.json();

  // Delete from Blob storage if it was an upload
  if (blobUrl) {
    try { await del(blobUrl); } catch {}
  }

  const existing = await kv.get(`content:${type}`) || [];
  await kv.set(`content:${type}`, existing.filter(i => i.id !== id));
  return Response.json({ ok: true });
}

function getEmbedUrl(url) {
  // YouTube
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  // Vimeo
  const vmMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`;
  return url;
}

function getThumbnail(url) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  return null;
}
