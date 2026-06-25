import { kv } from '@vercel/kv';
import { put, del } from '@vercel/blob';

const AUTH = process.env.ADMIN_SECRET;

function authorized(req) {
  const h = req.headers.get('authorization') || '';
  return h === `Bearer ${AUTH}`;
}

// GET /api/admin/content?type=gallery|videos|faq|extras|packages
export async function GET(req) {
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const type = new URL(req.url).searchParams.get('type') || 'gallery';
  if (type === 'packages') {
    const prices = await kv.get('content:prices') || {};
    return Response.json({ prices });
  }
  const items = await kv.get(`content:${type}`) || [];
  return Response.json({ items });
}

// POST /api/admin/content — add item or update prices
export async function POST(req) {
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const contentType = req.headers.get('content-type') || '';
  let item;

  if (contentType.includes('multipart/form-data')) {
    const form = await req.formData();
    const type = form.get('type') || 'gallery';

    // Before/after pair: two files (before + after)
    if (type === 'beforeafter') {
      const beforeFile = form.get('before');
      const afterFile = form.get('after');
      const caption = form.get('caption') || '';
      if (!beforeFile || !afterFile) return Response.json({ error: 'need_two_files' }, { status: 400 });
      const b = await put(`elite-vask/beforeafter/${Date.now()}-b-${beforeFile.name}`, beforeFile, { access: 'public' });
      const a = await put(`elite-vask/beforeafter/${Date.now()}-a-${afterFile.name}`, afterFile, { access: 'public' });
      const baItem = {
        id: Date.now().toString(),
        before: b.url,
        after: a.url,
        caption,
        source: 'upload',
        uploadedAt: new Date().toISOString(),
      };
      const existingBa = await kv.get('content:beforeafter') || [];
      await kv.set('content:beforeafter', [baItem, ...existingBa]);
      return Response.json({ ok: true, item: baItem });
    }

    // File upload via Vercel Blob (gallery)
    const file = form.get('file');
    const caption = form.get('caption') || '';
    const album = form.get('album') || '';

    if (!file) return Response.json({ error: 'no_file' }, { status: 400 });

    const blob = await put(`elite-vask/${type}/${Date.now()}-${file.name}`, file, {
      access: 'public',
    });

    item = {
      id: Date.now().toString(),
      url: blob.url,
      caption,
      ...(album ? { album } : {}),
      source: 'upload',
      uploadedAt: new Date().toISOString(),
    };

    const existing = await kv.get(`content:${type}`) || [];
    await kv.set(`content:${type}`, [item, ...existing]);
    return Response.json({ ok: true, item });

  } else {
    const body = await req.json();
    const { type = 'gallery' } = body;

    // Packages: replace entire price matrix
    if (type === 'packages') {
      const { prices } = body;
      if (!prices || typeof prices !== 'object') {
        return Response.json({ error: 'invalid_prices' }, { status: 400 });
      }
      await kv.set('content:prices', prices);
      return Response.json({ ok: true });
    }

    // FAQ item
    if (type === 'faq') {
      const { item: faqItem } = body;
      if (!faqItem || !faqItem.q || !faqItem.a) {
        return Response.json({ error: 'invalid_item' }, { status: 400 });
      }
      const newItem = { id: Date.now().toString(), ...faqItem };
      const existing = await kv.get('content:faq') || [];
      await kv.set('content:faq', [...existing, newItem]);
      return Response.json({ ok: true, item: newItem });
    }

    // Extras item
    if (type === 'extras') {
      const { item: extItem } = body;
      if (!extItem || !extItem.name) {
        return Response.json({ error: 'invalid_item' }, { status: 400 });
      }
      const newItem = { id: Date.now().toString(), ...extItem };
      const existing = await kv.get('content:extras') || [];
      await kv.set('content:extras', [...existing, newItem]);
      return Response.json({ ok: true, item: newItem });
    }

    // Before/after via URLs
    if (type === 'beforeafter') {
      const { before, after, caption = '' } = body;
      if (!before || !after) return Response.json({ error: 'need_two_urls' }, { status: 400 });
      const baItem = { id: Date.now().toString(), before, after, caption, source: 'url', uploadedAt: new Date().toISOString() };
      const existingBa = await kv.get('content:beforeafter') || [];
      await kv.set('content:beforeafter', [baItem, ...existingBa]);
      return Response.json({ ok: true, item: baItem });
    }

    // URL-based (gallery / videos)
    const { url, caption = '', title = '', album = '' } = body;
    if (!url) return Response.json({ error: 'no_url' }, { status: 400 });

    item = {
      id: Date.now().toString(),
      url,
      caption,
      title,
      ...(album ? { album } : {}),
      source: 'url',
      uploadedAt: new Date().toISOString(),
    };

    if (type === 'videos') {
      item.platform = url.includes('youtube') || url.includes('youtu.be') ? 'youtube' : 'vimeo';
      item.embedUrl = getEmbedUrl(url);
      item.thumbnail = getThumbnail(url);
    }

    const existing = await kv.get(`content:${type}`) || [];
    await kv.set(`content:${type}`, [item, ...existing]);
    return Response.json({ ok: true, item });
  }
}

// PUT /api/admin/content — update individual faq/extras item
export async function PUT(req) {
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const body = await req.json();
  const { type, id, item: updated } = body;

  if (!id || !updated || (type !== 'faq' && type !== 'extras' && type !== 'gallery' && type !== 'beforeafter')) {
    return Response.json({ error: 'invalid_request' }, { status: 400 });
  }

  const key = `content:${type}`;
  const existing = await kv.get(key) || [];
  const updated_list = existing.map(i => i.id === id ? { ...i, ...updated, id } : i);
  await kv.set(key, updated_list);
  return Response.json({ ok: true });
}

// DELETE /api/admin/content
export async function DELETE(req) {
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const { type = 'gallery', id, blobUrl, blobUrls } = await req.json();

  if (type === 'packages') {
    await kv.del('content:prices');
    return Response.json({ ok: true });
  }

  // Delete from Blob storage if it was an upload
  if (blobUrl) {
    try { await del(blobUrl); } catch {}
  }
  // Before/after items hold two blob URLs
  if (Array.isArray(blobUrls)) {
    for (const u of blobUrls) { try { await del(u); } catch {} }
  }

  const key = `content:${type}`;
  const existing = await kv.get(key) || [];
  await kv.set(key, existing.filter(i => i.id !== id));
  return Response.json({ ok: true });
}

function getEmbedUrl(url) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vmMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vmMatch) return `https://player.vimeo.com/video/${vmMatch[1]}`;
  return url;
}

function getThumbnail(url) {
  const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  return null;
}
