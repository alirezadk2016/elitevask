import { unstable_cache } from 'next/cache';
import { kv } from '@vercel/kv';
import { normalizeSettings } from './settings';

// Server-side, cached read of the company settings. Tagged 'settings' so the
// admin save refreshes it at once; otherwise every 5 min. Never throws.
export const getSettings = unstable_cache(
  async () => {
    try { return normalizeSettings(await kv.get('content:settings')); }
    catch { return normalizeSettings(null); }
  },
  ['site-settings'],
  { revalidate: 300, tags: ['settings'] },
);
