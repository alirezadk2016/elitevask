"use client";
import { T, FF, field, surface } from "./ui";

/* Shared chrome for every content collection (gallery, videos, before/after,
   FAQ, extras). Each tab used to be a bare list with no way to find, filter or
   act on more than one item at a time — fine with five items, unusable with
   fifty. Keeping it in one place means the tabs cannot drift apart. */

export function Toolbar({ children }) {
  return (
    <div style={{ display: "flex", gap: 9, flexWrap: "wrap", alignItems: "center", marginBottom: 14 }}>
      {children}
    </div>
  );
}

export function SearchBox({ value, onChange, placeholder, count }) {
  return (
    <div style={{ position: "relative", flex: "1 1 220px", minWidth: 180 }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.t3} strokeWidth="2.2" strokeLinecap="round"
        style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}>
        <circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={field({ paddingLeft: 34, paddingRight: value ? 62 : 12 })} />
      {value && (
        <button type="button" onClick={() => onChange("")}
          style={{ position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", display: "flex", alignItems: "center", gap: 5, background: "transparent", border: "none", color: T.t3, cursor: "pointer", fontFamily: FF, fontSize: 11 }}>
          {count != null && <span style={{ fontVariantNumeric: "tabular-nums" }}>{count}</span>}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
        </button>
      )}
    </div>
  );
}

export function FilterChip({ active, onClick, children, count }) {
  return (
    <button type="button" onClick={onClick}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,.05)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
      style={{
        display: "flex", alignItems: "center", gap: 6, padding: "9px 13px", borderRadius: 9,
        border: `1px solid ${active ? T.accentBorder : T.border}`,
        background: active ? T.accentDim : "transparent",
        color: active ? T.accent : T.t3,
        fontSize: 12.5, fontWeight: active ? 700 : 600, cursor: "pointer", fontFamily: FF,
        whiteSpace: "nowrap", transition: "background .14s",
      }}>
      {children}
      {count != null && (
        <span style={{ fontSize: 10.5, fontWeight: 800, background: active ? "rgba(55,210,120,.22)" : "rgba(255,255,255,.06)", color: active ? T.accent : T.t4, borderRadius: 9, padding: "1px 6px", fontVariantNumeric: "tabular-nums" }}>{count}</span>
      )}
    </button>
  );
}

export function ToolButton({ onClick, children, tone, disabled, title }) {
  const c = tone === "danger" ? { fg: T.danger, bg: T.dangerDim, bd: T.dangerBorder }
    : tone === "accent" ? { fg: T.accent, bg: T.accentDim, bd: T.accentBorder }
    : { fg: T.t2, bg: "rgba(255,255,255,.04)", bd: T.border };
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title}
      style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 13px", borderRadius: 9,
        border: `1px solid ${c.bd}`, background: c.bg, color: c.fg, fontSize: 12.5, fontWeight: 700,
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? .45 : 1, fontFamily: FF, whiteSpace: "nowrap" }}>
      {children}
    </button>
  );
}

/* Selection bar — appears only once something is ticked, so it never competes
   with the content in the normal case. */
export function SelectionBar({ n, total, onAll, onNone, children }) {
  if (!n) return null;
  return (
    <div style={{ ...surface(true), display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: "11px 15px", marginBottom: 13, borderRadius: 12 }}>
      <span style={{ fontSize: 13, fontWeight: 800, color: T.accent, whiteSpace: "nowrap" }}>{n} valgt</span>
      <button type="button" onClick={n === total ? onNone : onAll}
        style={{ background: "transparent", border: "none", color: T.t3, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF, textDecoration: "underline", textUnderlineOffset: 3 }}>
        {n === total ? "Fravælg alle" : `Vælg alle (${total})`}
      </button>
      <div style={{ flex: 1, minWidth: 8 }} />
      {children}
    </div>
  );
}

// Up/down (or left/right) nudge controls — the stored order is what the
// public site renders, so the manager needs a way to decide what comes first.
export function ReorderButtons({ onUp, onDown, first, last, vertical }) {
  const btn = (fn, disabled, path, label) => (
    <button type="button" onClick={fn} disabled={disabled} aria-label={label} title={label}
      style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 26, height: 24,
        borderRadius: 6, border: `1px solid ${T.border}`, background: "rgba(0,0,0,.45)",
        color: disabled ? T.t4 : T.t2, cursor: disabled ? "not-allowed" : "pointer", padding: 0 }}>
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">{path}</svg>
    </button>
  );
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {btn(onUp, first, vertical ? <polyline points="18 15 12 9 6 15" /> : <polyline points="15 18 9 12 15 6" />, "Flyt op")}
      {btn(onDown, last, vertical ? <polyline points="6 9 12 15 18 9" /> : <polyline points="9 18 15 12 9 6" />, "Flyt ned")}
    </div>
  );
}

export function EmptyState({ icon, title, hint, action }) {
  return (
    <div style={{ ...surface(), borderStyle: "dashed", padding: "44px 24px", textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 12, color: T.t4 }}>{icon}</div>
      <p style={{ margin: "0 0 5px", fontSize: 15, fontWeight: 700, color: T.t2 }}>{title}</p>
      {hint && <p style={{ margin: "0 0 16px", fontSize: 13, color: T.t4, lineHeight: 1.6 }}>{hint}</p>}
      {action}
    </div>
  );
}

// Reordering rewrites the whole array server-side; the helper keeps the
// optimistic local move and the request in one place.
export async function persistOrder(secret, type, ids) {
  const r = await fetch("/api/admin/content", {
    method: "PATCH",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
    body: JSON.stringify({ type, order: ids }),
  });
  return r;
}

export function moveInArray(arr, from, to) {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [it] = next.splice(from, 1);
  next.splice(to, 0, it);
  return next;
}
