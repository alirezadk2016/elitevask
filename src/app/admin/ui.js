// Shared design tokens for the admin panel. Kept in one place so the
// dashboard, the booking dialog and the customer view can never drift apart.
export const T = {
  bg0:          "#08110a",
  bg1:          "#0d1610",
  bg2:          "#111e15",
  accent:       "#37d278",
  accentDim:    "rgba(55,210,120,.12)",
  accentBorder: "rgba(55,210,120,.22)",
  t1: "#f0f4f1",
  t2: "#a8b8aa",
  t3: "#5a6e5c",
  t4: "#2e3e30",
  danger:       "#e5534b",
  dangerDim:    "rgba(229,83,75,.1)",
  dangerBorder: "rgba(229,83,75,.25)",
  gold:         "#d4af37",
  goldDim:      "rgba(212,175,55,.12)",
  goldBorder:   "rgba(212,175,55,.3)",
  blue:         "#4f8ef7",
  blueDim:      "rgba(79,142,247,.13)",
  blueBorder:   "rgba(79,142,247,.4)",
  amber:        "#f5a623",
  amberDim:     "rgba(245,166,35,.12)",
  amberBorder:  "rgba(245,166,35,.38)",
  border:       "rgba(255,255,255,.07)",
  shadow:       "0 1px 3px rgba(0,0,0,.4), 0 4px 16px rgba(0,0,0,.3)",
  shadowL:      "0 2px 8px rgba(0,0,0,.5), 0 8px 32px rgba(0,0,0,.4)",
};

export const FF = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

/* ── Surfaces ──────────────────────────────────────────────────────────────
   Flat panels on a flat background read as unfinished. Every card gets a
   faint top-down gradient and a hairline highlight along its top edge, which
   is what separates "a div with a border" from a surface with depth. */
export const surface = (accent = false) => ({
  background: accent
    ? `linear-gradient(180deg, rgba(55,210,120,.07) 0%, ${T.bg1} 60%)`
    : `linear-gradient(180deg, rgba(255,255,255,.028) 0%, ${T.bg1} 55%)`,
  border: `1px solid ${accent ? T.accentBorder : T.border}`,
  borderRadius: 16,
  boxShadow: "0 1px 0 rgba(255,255,255,.04) inset, 0 2px 10px rgba(0,0,0,.35)",
});

// Rows inside a surface: lighter, so the card still reads as the container.
export const row = (accent) => ({
  background: "rgba(255,255,255,.022)",
  border: `1px solid ${T.border}`,
  borderLeft: `3px solid ${accent || "transparent"}`,
  borderRadius: 12,
  transition: "background .15s, border-color .15s, transform .12s",
});

/* Package identity. The Guld package is the premium tier on the public site
   and was rendering in the same blue as everything else — it now carries the
   gold it is sold with, so the manager can read the day's mix at a glance. */
export const PKG_TONE = {
  guld: { fg: "#d4af37", dim: "rgba(212,175,55,.13)", border: "rgba(212,175,55,.42)" },
  hele: { fg: "#4f8ef7", dim: "rgba(79,142,247,.13)", border: "rgba(79,142,247,.40)" },
  udv:  { fg: "#46b0c9", dim: "rgba(70,176,201,.12)", border: "rgba(70,176,201,.38)" },
  indv: { fg: "#9b8cf0", dim: "rgba(155,140,240,.13)", border: "rgba(155,140,240,.40)" },
};
export function pkgTone(b) {
  const id = b?.pkgId || Object.keys(PKG_LABELS).find(k => PKG_LABELS[k] === b?.pkg);
  return PKG_TONE[id] || PKG_TONE.hele;
}

// Shimmering placeholder — a bare "Indlæser…" makes the panel feel cheap.
export const skeleton = (h = 14, w = "100%") => ({
  height: h, width: w, borderRadius: 7,
  background: "linear-gradient(90deg, rgba(255,255,255,.04) 25%, rgba(255,255,255,.09) 50%, rgba(255,255,255,.04) 75%)",
  backgroundSize: "200% 100%",
  animation: "evShimmer 1.3s ease-in-out infinite",
});

export const CAR_LABELS = { lille: "Lille bil", mellem: "Mellemstor bil", stor: "Stor bil / SUV", varebil: "Varebil" };
export const PKG_LABELS = { hele: "Hele bilen", udv: "Udvendig", indv: "Indvendig", guld: "Guld pakke" };
export const CAR_IDS = ["lille", "mellem", "stor", "varebil"];
export const PKG_IDS = ["hele", "udv", "indv", "guld"];

// Shared input styling — every field in the admin looks the same.
export const field = (extra = {}) => ({
  width: "100%", padding: "10px 12px", borderRadius: 9,
  border: `1px solid ${T.border}`, background: T.bg0, color: T.t1,
  fontSize: 14, outline: "none", fontFamily: FF, boxSizing: "border-box",
  ...extra,
});

export const label = {
  fontSize: 11, color: T.t3, margin: "0 0 5px", fontWeight: 700,
  letterSpacing: .4, textTransform: "uppercase",
};

export function fmtDateLong(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  const months = ["januar","februar","marts","april","maj","juni","juli","august","september","oktober","november","december"];
  return `${parseInt(d)}. ${months[parseInt(m) - 1]} ${y}`;
}

export function fmtDateShort(iso) {
  if (!iso) return "";
  const [, m, d] = iso.split("-");
  const months = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
  return `${parseInt(d)}. ${months[parseInt(m) - 1]}`;
}

// "HH:MM" → minutes. Shared so the dialog and the grid agree.
export function toMinutes(t) {
  return parseInt(t.slice(0, 2), 10) * 60 + parseInt(t.slice(3, 5), 10);
}

// Minutes since midnight in Copenhagen — the salon's clock, never the
// device's. Everything the manager sees is anchored to the same timezone the
// server validates against.
export function cphMinutesNow() {
  const s = new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Europe/Copenhagen", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(new Date());
  return toMinutes(s);
}

export function todayISO() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Copenhagen" }).format(new Date());
}
