import { checkBearer } from '@/lib/adminAuth';
import { getKV, listBookings, customerKey, delOwnedSlot } from '@/lib/bookingStore';

/* Customer view. There is no separate customer table — a "customer" is every
   booking that shares a phone number (or, lacking one, an email). Deriving it
   on read keeps a single source of truth and means historic bookings show up
   without a migration. */
function build(bookings) {
  const map = new Map();
  for (const b of bookings) {
    const key = customerKey(b);
    if (!key) continue;
    let c = map.get(key);
    if (!c) {
      c = {
        key, name: b.name || 'Ukendt', phone: b.phone || '', email: b.email || '',
        addr: b.addr || '', zip: b.zip || '', city: b.city || '',
        total: 0, cancelled: 0, revenue: 0,
        firstAt: null, lastAt: null, nextDate: null, bookings: [],
      };
      map.set(key, c);
    }
    // Latest booking wins for the contact details — people move house.
    if (!c.lastAt || (b.bookedAt || '') > c.lastAt) {
      c.lastAt = b.bookedAt || c.lastAt;
      if (b.name)  c.name  = b.name;
      if (b.phone) c.phone = b.phone;
      if (b.email) c.email = b.email;
      if (b.addr)  { c.addr = b.addr; c.zip = b.zip || ''; c.city = b.city || ''; }
    }
    if (!c.firstAt || (b.bookedAt || '') < c.firstAt) c.firstAt = b.bookedAt || c.firstAt;
    c.total++;
    if (b.status === 'cancelled') c.cancelled++;
    else {
      const n = parseInt(String(b.price || '').replace(/[^\d]/g, ''), 10);
      if (Number.isFinite(n)) c.revenue += n;
    }
    c.bookings.push({
      token: b.token, date: b.date, time: b.time, car: b.car, pkg: b.pkg,
      price: b.price, status: b.status, source: b.source || 'web', bookedAt: b.bookedAt,
    });
  }
  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Copenhagen' }).format(new Date());
  for (const c of map.values()) {
    c.bookings.sort((a, z) => `${z.date} ${z.time}`.localeCompare(`${a.date} ${a.time}`));
    const upcoming = c.bookings.filter(b => b.status !== 'cancelled' && b.date >= today);
    c.nextDate = upcoming.length ? upcoming[upcoming.length - 1].date : null;
    c.visits = c.total - c.cancelled;
  }
  return [...map.values()].sort((a, z) => (z.lastAt || '').localeCompare(a.lastAt || ''));
}

export async function GET(request) {
  if (!checkBearer(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });
  try {
    return Response.json({ customers: build(await listBookings()) });
  } catch (e) {
    return Response.json({ error: e.message }, { status: 500 });
  }
}

/* GDPR erasure (art. 17). Deletes every booking record belonging to one
   customer plus the slot keys those bookings hold. Future appointments are
   erased too, so their hours are handed back to the booking calendar rather
   than staying red for a booking that no longer exists.

   `keepFuture` lets the manager erase only the history of a customer who
   still has an appointment coming up. */
export async function DELETE(request) {
  if (!checkBearer(request)) return Response.json({ error: 'unauthorized' }, { status: 401 });

  let body;
  try { body = await request.json(); } catch { return Response.json({ error: 'bad_json' }, { status: 400 }); }
  const key = String(body.key || '');
  const keepFuture = body.keepFuture === true;
  if (!key) return Response.json({ error: 'missing_key' }, { status: 400 });

  const kv = await getKV();
  if (!kv) return Response.json({ error: 'store_unavailable' }, { status: 503 });

  const today = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Copenhagen' }).format(new Date());
  const all = await listBookings();
  const mine = all.filter(b => customerKey(b) === key);
  if (!mine.length) return Response.json({ error: 'not_found' }, { status: 404 });

  let deleted = 0, freed = 0, kept = 0;
  for (const b of mine) {
    const isFuture = b.status !== 'cancelled' && (b.date || '') >= today;
    if (keepFuture && isFuture) { kept++; continue; }
    // Free the hours BEFORE dropping the record: if we die in between, an
    // orphaned slot key is recoverable from the record, but not vice versa.
    if (b.date && Array.isArray(b.slots)) {
      for (const t of b.slots) {
        try { await delOwnedSlot(kv, b.date, t, b.token); freed++; } catch {}
      }
    }
    try { await kv.del(`booking:${b.token}`); deleted++; } catch {}
  }

  return Response.json({ ok: true, deleted, freed, kept });
}
