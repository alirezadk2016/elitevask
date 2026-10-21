// Company settings the manager can edit in the admin panel (Indstillinger),
// stored in KV under `content:settings`. Pure + client-safe: the same helpers
// run on the server (pages, JSON-LD, llms.txt) and in siteInit (chatbot,
// announcement bar).
//
// The site's markup was written with the original values hard-coded, so
// applySettings() swaps those literal defaults for the configured values. With
// nothing saved, every value equals its default and the output is unchanged.
// NOT covered on purpose: the booking API and the e-mails (they keep the
// original contact details — see the note in the admin panel).

export const DEFAULT_SETTINGS = {
  phone: '+45 24 44 03 21',
  email: 'info@elite-vask.dk',
  instagram: 'elitevasksjaelland',
  facebook: 'https://www.facebook.com/share/14ciFraNT4M/',
  annMain: { da: 'Betal først når bilen er ren', en: 'Pay only when your car is clean' },
  annSub: { da: 'Ingen forudbetaling – 100% tilfredshedsgaranti', en: 'No prepayment – 100% satisfaction guarantee' },
};

const EMAIL_RE = /^[^\s@<>"']{1,64}@[a-z0-9.-]{1,190}\.[a-z]{2,}$/i;
const IG_RE = /^[a-z0-9._]{1,30}$/i;
const FB_RE = /^https:\/\/(www\.|m\.)?facebook\.com\/[^\s"'<>]{1,200}$/i;

const clip = (v, n) => String(v == null ? '' : v).replace(/[<>]/g, '').trim().slice(0, n);

// "+45 24 44 03 21" style display + "+4524440321" for tel: links.
export function phoneTel(display) {
  let d = String(display || '').replace(/[^\d]/g, '');
  if (d.length === 8) d = '45' + d;
  return '+' + d;
}

export function normalizeSettings(raw) {
  const r = raw && typeof raw === 'object' ? raw : {};
  const D = DEFAULT_SETTINGS;
  const digits = String(r.phone || '').replace(/[^\d]/g, '');
  const phone = (digits.length >= 8 && digits.length <= 15 && /^[\d\s+()-]+$/.test(String(r.phone))) ? clip(r.phone, 24) : D.phone;
  const email = EMAIL_RE.test(String(r.email || '').trim()) ? String(r.email).trim().toLowerCase() : D.email;
  const instagram = IG_RE.test(String(r.instagram || '').replace(/^@/, '')) ? String(r.instagram).replace(/^@/, '') : D.instagram;
  const facebook = FB_RE.test(String(r.facebook || '').trim()) ? String(r.facebook).trim() : D.facebook;
  const bi = (v, d) => ({
    da: clip(v && v.da, 90) || d.da,
    en: clip(v && v.en, 90) || d.en,
  });
  return { phone, email, instagram, facebook, annMain: bi(r.annMain, D.annMain), annSub: bi(r.annSub, D.annSub) };
}

// Replace the original hard-coded contact details in a string of markup/text.
export function applySettings(str, settings) {
  const s = normalizeSettings(settings);
  const D = DEFAULT_SETTINGS;
  let out = String(str);
  if (s.phone !== D.phone) {
    const tel = phoneTel(s.phone);
    out = out.split(D.phone).join(s.phone)          // "+45 24 44 03 21"
      .split(phoneTel(D.phone)).join(tel)            // "+4524440321"
      .split('24 44 03 21').join(s.phone.replace(/^\+45\s*/, ''));
  }
  if (s.email !== D.email) out = out.split(D.email).join(s.email);
  if (s.instagram !== D.instagram) out = out.split(D.instagram).join(s.instagram);
  if (s.facebook !== D.facebook) out = out.split(D.facebook).join(s.facebook);
  return out;
}
