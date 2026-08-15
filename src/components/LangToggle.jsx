"use client";
import { useLang, setLang } from "@/lib/useLang";

/* The DK/UK switch, previously only present in the homepage nav. Same flags,
   same behaviour — one shared component so subpages can finally offer it. */
export default function LangToggle() {
  const lang = useLang();
  const btn = (v, label, flag, aria) => (
    <button
      type="button"
      onClick={() => setLang(v)}
      aria-label={aria}
      aria-pressed={lang === v}
      style={{
        display: "flex", alignItems: "center", gap: 5, padding: "5px 9px",
        borderRadius: 99, border: "none", cursor: "pointer", lineHeight: 1,
        fontSize: 11, fontWeight: 700, fontFamily: "inherit",
        background: lang === v ? "rgba(55,210,120,.16)" : "transparent",
        color: lang === v ? "#37d278" : "rgba(255,255,255,.55)",
        transition: "background .15s, color .15s",
      }}
    >
      {flag}
      {label}
    </button>
  );
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 2, background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.09)", borderRadius: 99, padding: 2 }}>
      {btn("da", "DK",
        <svg viewBox="0 0 20 14" width="18" height="13" aria-hidden="true"><rect width="20" height="14" fill="#C60C30" /><rect x="6" y="0" width="3" height="14" fill="white" /><rect x="0" y="5.5" width="20" height="3" fill="white" /></svg>,
        "Skift til dansk")}
      {btn("en", "UK",
        <svg viewBox="0 0 30 20" width="18" height="13" aria-hidden="true"><rect width="30" height="20" fill="#012169" /><path d="M0,0 L30,20 M30,0 L0,20" stroke="white" strokeWidth="4" /><path d="M0,0 L30,20 M30,0 L0,20" stroke="#C8102E" strokeWidth="2.4" /><rect x="12" y="0" width="6" height="20" fill="white" /><rect x="0" y="7" width="30" height="6" fill="white" /><rect x="13" y="0" width="4" height="20" fill="#C8102E" /><rect x="0" y="8" width="30" height="4" fill="#C8102E" /></svg>,
        "Switch to English")}
    </div>
  );
}
