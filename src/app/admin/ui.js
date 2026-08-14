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

export function todayISO() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Europe/Copenhagen" }).format(new Date());
}
