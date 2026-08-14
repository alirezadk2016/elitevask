import { createHash, timingSafeEqual, randomUUID } from 'crypto';
import { kv } from '@vercel/kv';
import { put, del } from '@vercel/blob';
import { normalizeHours, DEFAULT_HOURS } from '@/lib/hours';
import { revalidatePath, revalidateTag } from 'next/cache';

const AUTH = process.env.ADMIN_SECRET;

function authorized(req) {
  // No secret configured → deny everything (never accept "Bearer undefined").
  if (!AUTH) return false;
  const h = req.headers.get('authorization') || '';
  const a = createHash('sha256').update(h).digest();
  const b = createHash('sha256').update(`Bearer ${AUTH}`).digest();
  return timingSafeEqual(a, b);
}

// Only these content collections may be written – prevents a bogus ?type=
// from creating/overwriting arbitrary content:* keys.
const CONTENT_TYPES = new Set(['gallery', 'videos', 'faq', 'extras', 'beforeafter']);

// The public content route caches for 60s; bust it so a CMS edit shows on the
// site immediately instead of a minute later.
function revalidateContent(type) {
  try {
    revalidatePath('/api/site-content');
    if (type === 'gallery' || type === 'beforeafter') revalidatePath('/galleri');
    if (type === 'faq') revalidatePath('/faq');
  } catch {}
}

// GET /api/admin/content?type=gallery|videos|faq|extras|packages
export async function GET(req) {
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  const type = new URL(req.url).searchParams.get('type') || 'gallery';
  if (type === 'packages') {
    const prices = await kv.get('content:prices') || {};
    return Response.json({ prices });
  }
  if (type === 'hours') {
    const stored = await kv.get('content:hours');
    return Response.json({ hours: normalizeHours(stored || DEFAULT_HOURS), isDefault: !stored });
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
        id: randomUUID(),
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
      id: randomUUID(),
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

    // Packages: replace entire price matrix (validated: only known car/pkg
    // keys, numeric cells; empty/NaN cells dropped so the public site never
    // gets "fra kr. 0" or string-concatenation totals).
    if (type === 'packages') {
      const { prices } = body;
      if (!prices || typeof prices !== 'object' || Array.isArray(prices)) {
        return Response.json({ error: 'invalid_prices' }, { status: 400 });
      }
      const CARS = ['lille', 'mellem', 'stor', 'varebil'];
      const PKGS = ['hele', 'udv', 'indv', 'guld'];
      const clean = {};
      for (const car of CARS) {
        const row = prices[car];
        if (!row || typeof row !== 'object') continue;
        const cleanRow = {};
        for (const p of PKGS) {
          const n = Number(row[p]);
          if (Number.isFinite(n) && n > 0) cleanRow[p] = n;
        }
        if (Object.keys(cleanRow).length) clean[car] = cleanRow;
      }
      await kv.set('content:prices', clean);
      return Response.json({ ok: true, prices: clean });
    }

    // Opening hours: validate + store the whole config (single object).
    if (type === 'hours') {
      const clean = normalizeHours(body.hours);
      await kv.set('content:hours', clean);
      // Bust the cached public content route so the booking wizard picks up
      // the new hours on the next request instead of after the 60s TTL.
      try { revalidatePath('/api/site-content'); revalidateTag('hours'); } catch {}
      return Response.json({ ok: true, hours: clean });
    }

    // FAQ item
    if (type === 'faq') {
      const { item: faqItem } = body;
      if (!faqItem || !faqItem.q || !faqItem.a) {
        return Response.json({ error: 'invalid_item' }, { status: 400 });
      }
      const newItem = { id: randomUUID(), ...faqItem };
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
      // Keep a stable slug id when one is supplied (the built-in add-ons use
      // 'motor', 'lak', … and the package "included" logic matches on those).
      // A random UUID here made the Guld package re-sell services it already
      // includes. Unknown/unsafe ids still get a UUID.
      const existing = await kv.get('content:extras') || [];
      const wanted = typeof extItem.id === 'string' && /^[a-z0-9_-]{1,40}$/.test(extItem.id)
        && !existing.some((e) => e && e.id === extItem.id)
        ? extItem.id : randomUUID();
      const newItem = { ...extItem, id: wanted };
      await kv.set('content:extras', [...existing, newItem]);
      return Response.json({ ok: true, item: newItem });
    }

    // Before/after via URLs
    if (type === 'beforeafter') {
      const { before, after, caption = '' } = body;
      if (!before || !after) return Response.json({ error: 'need_two_urls' }, { status: 400 });
      const baItem = { id: randomUUID(), before, after, caption, source: 'url', uploadedAt: new Date().toISOString() };
      const existingBa = await kv.get('content:beforeafter') || [];
      await kv.set('content:beforeafter', [baItem, ...existingBa]);
      return Response.json({ ok: true, item: baItem });
    }

    // URL-based (gallery / videos) — reject unknown collections
    if (!CONTENT_TYPES.has(type)) {
      return Response.json({ error: 'invalid_type' }, { status: 400 });
    }
    const { url, caption = '', title = '', album = '' } = body;
    if (!url) return Response.json({ error: 'no_url' }, { status: 400 });

    if (type === 'videos') {
      const isYT = /youtube\.com|youtu\.be/.test(url);
      const isVimeo = /vimeo\.com/.test(url);
      if (!isYT && !isVimeo) {
        return Response.json({ error: 'unsupported_video', message: 'Kun YouTube- og Vimeo-links understøttes.' }, { status: 400 });
      }
    }

    item = {
      id: randomUUID(),
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
  const { type = 'gallery', id, ids, blobUrl, blobUrls } = await req.json();

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

  // Bulk form: `ids` removes several items in one write. Doing it one request
  // per item would interleave with the manager's other edits and could lose
  // changes, since every write rewrites the whole array.
  if (Array.isArray(ids) && ids.length) {
    const drop = new Set(ids.map(String));
    const removed = existing.filter(i => drop.has(String(i.id)));
    // Free the storage behind anything that was uploaded rather than linked.
    for (const it of removed) {
      for (const u of [it.url, it.before, it.after]) {
        if (u && it.source === 'upload') { try { await del(u); } catch {} }
      }
    }
    await kv.set(key, existing.filter(i => !drop.has(String(i.id))));
    revalidateContent(type);
    return Response.json({ ok: true, deleted: removed.length });
  }

  await kv.set(key, existing.filter(i => i.id !== id));
  revalidateContent(type);
  return Response.json({ ok: true });
}

/* PATCH — reorder a collection, or move several items between albums.
   The public site renders these arrays in stored order, so this is the only
   way for the manager to decide what a visitor sees first. */
export async function PATCH(req) {
  if (!authorized(req)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  let body;
  try { body = await req.json(); } catch { return Response.json({ error: 'bad_json' }, { status: 400 }); }
  const { type, order, ids, album } = body;
  if (!CONTENT_TYPES.has(type)) return Response.json({ error: 'invalid_type' }, { status: 400 });

  const key = `content:${type}`;
  const existing = await kv.get(key) || [];

  if (Array.isArray(order)) {
    // Rebuild from the given id order, then append anything the client did not
    // mention — a stale tab must never silently drop items it hadn't loaded.
    const byId = new Map(existing.map(i => [String(i.id), i]));
    const next = [];
    for (const id of order) {
      const it = byId.get(String(id));
      if (it) { next.push(it); byId.delete(String(id)); }
    }
    for (const it of existing) if (byId.has(String(it.id))) next.push(it);
    await kv.set(key, next);
    revalidateContent(type);
    return Response.json({ ok: true, count: next.length });
  }

  if (Array.isArray(ids) && typeof album === 'string') {
    const move = new Set(ids.map(String));
    const cleaned = album.trim().slice(0, 60);
    await kv.set(key, existing.map(i => move.has(String(i.id)) ? { ...i, album: cleaned } : i));
    revalidateContent(type);
    return Response.json({ ok: true, moved: move.size });
  }

  return Response.json({ error: 'invalid_request' }, { status: 400 });
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
