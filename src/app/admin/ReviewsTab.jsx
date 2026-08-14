"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { T, FF, field, label, surface } from "./ui";
import { Toolbar, SearchBox, ToolButton, ReorderButtons, EmptyState, persistOrder, moveInArray } from "./ContentToolbar";

/* Customer reviews.
 *
 * The homepage section is headed "Det siger vores kunder" but had nothing
 * behind it. These are REAL quotes the manager copies in from Google or
 * Trustpilot — the panel deliberately offers no way to generate one. Order
 * here is the order visitors see; the first six are shown on the homepage. */
const SOURCES = [
  { id: "google", label: "Google" },
  { id: "trustpilot", label: "Trustpilot" },
  { id: "facebook", label: "Facebook" },
];

export default function ReviewsTab({ secret, narrow, addToast, authFailed }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmDel, setConfirmDel] = useState(null);

  const blank = { name: "", city: "", text: "", rating: 5, source: "google" };
  const [draft, setDraft] = useState(blank);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/admin/content?type=reviews", { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" });
      if (authFailed(r.status)) return;
      const d = await r.json().catch(() => ({}));
      setItems(Array.isArray(d.items) ? d.items : []);
    } catch { addToast("err", "Kunne ikke hente anmeldelser"); }
    finally { setLoading(false); }
  }, [secret, authFailed, addToast]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return items;
    return items.filter(r => `${r.name} ${r.city} ${r.text}`.toLowerCase().includes(s));
  }, [items, q]);

  async function add(e) {
    e.preventDefault();
    if (!draft.text.trim() || busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/content", {
        method: "POST",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reviews", item: draft }),
      });
      if (authFailed(r.status)) return;
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) { addToast("err", d.error || "Kunne ikke gemme"); return; }
      addToast("ok", "Anmeldelse tilføjet");
      setDraft(blank); setAddOpen(false); load();
    } catch { addToast("err", "Netværksfejl"); }
    finally { setBusy(false); }
  }

  async function save(item) {
    if (busy) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reviews", id: item.id, item: {
          name: item.name, city: item.city, text: item.text,
          rating: Math.max(1, Math.min(5, Number(item.rating) || 5)), source: item.source,
        } }),
      });
      if (authFailed(r.status)) return;
      const d = await r.json().catch(() => ({}));
      if (!r.ok || !d.ok) { addToast("err", "Kunne ikke gemme"); return; }
      addToast("ok", "Gemt"); setEditing(null); load();
    } catch { addToast("err", "Netværksfejl"); }
    finally { setBusy(false); }
  }

  async function remove(id) {
    setBusy(true);
    try {
      const r = await fetch("/api/admin/content", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({ type: "reviews", id }),
      });
      if (authFailed(r.status)) return;
      if (!r.ok) { addToast("err", "Sletning fejlede"); return; }
      addToast("ok", "Slettet"); setConfirmDel(null); load();
    } catch { addToast("err", "Netværksfejl"); }
    finally { setBusy(false); }
  }

  async function reorder(id, dir) {
    const from = items.findIndex(i => i.id === id);
    const to = from + dir;
    if (from < 0 || to < 0 || to >= items.length) return;
    const next = moveInArray(items, from, to);
    setItems(next);
    try {
      const r = await persistOrder(secret, "reviews", next.map(i => i.id));
      if (authFailed(r.status)) return;
      if (!r.ok) { setItems(items); addToast("err", "Rækkefølgen blev ikke gemt"); }
    } catch { setItems(items); addToast("err", "Netværksfejl"); }
  }

  const stars = (n, onPick) => (
    <div style={{ display: "flex", gap: 3 }}>
      {[1, 2, 3, 4, 5].map(i => (
        <button key={i} type="button" onClick={onPick ? () => onPick(i) : undefined} disabled={!onPick}
          aria-label={`${i} stjerner`}
          style={{ background: "none", border: "none", padding: 0, cursor: onPick ? "pointer" : "default", lineHeight: 0 }}>
          <svg width="17" height="17" viewBox="0 0 24 24"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z"
            fill={i <= n ? "#FBBC05" : "rgba(255,255,255,.14)"} /></svg>
        </button>
      ))}
    </div>
  );

  const inp = (v, on, ph, extra) => <input value={v} onChange={e => on(e.target.value)} placeholder={ph} style={field(extra)} />;

  return (
    <>
      <div style={{ ...surface(), padding: "14px 18px", marginBottom: 16, display: "flex", alignItems: "center", gap: 11, flexWrap: "wrap" }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="9" /><path d="M12 8v5" /><path d="M12 16h.01" /></svg>
        <span style={{ flex: 1, minWidth: 220, fontSize: 12.5, color: T.t2, lineHeight: 1.6 }}>
          Indsæt kun <strong style={{ color: T.t1 }}>rigtige</strong> anmeldelser, du har fået fra kunder på Google, Trustpilot eller Facebook.
          De seks øverste vises på forsiden.
        </span>
      </div>

      <Toolbar>
        <SearchBox value={q} onChange={setQ} placeholder="Søg i anmeldelser…" count={shown.length} />
        <ToolButton tone="accent" onClick={() => { setAddOpen(o => !o); setDraft(blank); }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
          {addOpen ? "Luk" : "Tilføj anmeldelse"}
        </ToolButton>
      </Toolbar>

      {addOpen && (
        <form onSubmit={add} style={{ ...surface(true), padding: 20, marginBottom: 16, display: "flex", flexDirection: "column", gap: 11 }}>
          <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: 10 }}>
            <div><p style={label}>Navn</p>{inp(draft.name, v => setDraft(d => ({ ...d, name: v })), "F.eks. Mette S.")}</div>
            <div><p style={label}>By (valgfri)</p>{inp(draft.city, v => setDraft(d => ({ ...d, city: v })), "F.eks. Roskilde")}</div>
          </div>
          <div>
            <p style={label}>Anmeldelse *</p>
            <textarea value={draft.text} onChange={e => setDraft(d => ({ ...d, text: e.target.value }))} rows={4}
              placeholder="Kopiér kundens tekst ind her…" maxLength={900} style={field({ resize: "vertical" })} />
            <p style={{ margin: "5px 0 0", fontSize: 11, color: T.t4, textAlign: "right" }}>{draft.text.length}/900</p>
          </div>
          <div style={{ display: "flex", gap: 22, flexWrap: "wrap", alignItems: "center" }}>
            <div><p style={label}>Vurdering</p>{stars(draft.rating, n => setDraft(d => ({ ...d, rating: n })))}</div>
            <div>
              <p style={label}>Kilde</p>
              <div style={{ display: "flex", gap: 6 }}>
                {SOURCES.map(s => (
                  <button key={s.id} type="button" onClick={() => setDraft(d => ({ ...d, source: s.id }))}
                    style={{ padding: "7px 12px", borderRadius: 8, fontFamily: FF, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                      border: `1px solid ${draft.source === s.id ? T.accentBorder : T.border}`,
                      background: draft.source === s.id ? T.accentDim : "transparent",
                      color: draft.source === s.id ? T.accent : T.t3 }}>{s.label}</button>
                ))}
              </div>
            </div>
          </div>
          <button type="submit" disabled={!draft.text.trim() || busy}
            style={{ padding: "12px 0", background: draft.text.trim() ? T.accent : "rgba(55,210,120,.2)", color: T.bg0, border: "none", borderRadius: 10, fontWeight: 800, fontSize: 14, cursor: draft.text.trim() && !busy ? "pointer" : "not-allowed", fontFamily: FF }}>
            {busy ? "Gemmer…" : "Tilføj anmeldelse"}
          </button>
        </form>
      )}

      {loading && <p style={{ color: T.t3, fontSize: 13 }}>Indlæser…</p>}
      {!loading && !items.length && (
        <EmptyState
          icon={<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" /></svg>}
          title="Ingen anmeldelser endnu"
          hint="Forsiden viser i stedet kun Google-scoren. Tilføj rigtige kundeanmeldelser, så de vises som citater." />
      )}
      {!loading && items.length > 0 && !shown.length && (
        <EmptyState icon={<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="11" cy="11" r="7" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>}
          title="Ingen match" hint="Prøv en anden søgning." />
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
        {shown.map(item => {
          const idx = items.findIndex(i => i.id === item.id);
          const isEd = editing?.id === item.id;
          const d = isEd ? editing : item;
          return (
            <div key={item.id} style={{ ...surface(isEd), padding: 18 }}>
              {idx < 6 && !q.trim() && (
                <span style={{ display: "inline-block", marginBottom: 10, fontSize: 10, fontWeight: 800, letterSpacing: .6, textTransform: "uppercase", color: T.accent, background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: 6, padding: "2px 7px" }}>Vises på forsiden</span>
              )}
              {isEd ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  <div style={{ display: "grid", gridTemplateColumns: narrow ? "1fr" : "1fr 1fr", gap: 10 }}>
                    {inp(d.name || "", v => setEditing(x => ({ ...x, name: v })), "Navn")}
                    {inp(d.city || "", v => setEditing(x => ({ ...x, city: v })), "By")}
                  </div>
                  <textarea value={d.text || ""} onChange={e => setEditing(x => ({ ...x, text: e.target.value }))} rows={4} maxLength={900} style={field({ resize: "vertical" })} />
                  <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
                    {stars(Number(d.rating) || 5, n => setEditing(x => ({ ...x, rating: n })))}
                    <div style={{ display: "flex", gap: 6 }}>
                      {SOURCES.map(s => (
                        <button key={s.id} type="button" onClick={() => setEditing(x => ({ ...x, source: s.id }))}
                          style={{ padding: "6px 11px", borderRadius: 7, fontFamily: FF, fontSize: 12, fontWeight: 600, cursor: "pointer",
                            border: `1px solid ${d.source === s.id ? T.accentBorder : T.border}`,
                            background: d.source === s.id ? T.accentDim : "transparent",
                            color: d.source === s.id ? T.accent : T.t3 }}>{s.label}</button>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => save(editing)} disabled={busy}
                      style={{ flex: 1, padding: "10px 0", background: T.accent, color: T.bg0, border: "none", borderRadius: 9, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: FF }}>Gem</button>
                    <button onClick={() => setEditing(null)}
                      style={{ flex: 1, padding: "10px 0", background: "rgba(255,255,255,.06)", color: T.t3, border: "none", borderRadius: 9, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: FF }}>Annuller</button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      {stars(Number(item.rating) || 5)}
                      <p style={{ margin: "10px 0 10px", fontSize: 14, color: T.t2, lineHeight: 1.6 }}>&ldquo;{item.text}&rdquo;</p>
                      <p style={{ margin: 0, fontSize: 12.5, color: T.t3 }}>
                        <strong style={{ color: T.t1 }}>{item.name || "Anonym"}</strong>
                        {item.city ? ` · ${item.city}` : ""} · {SOURCES.find(s => s.id === item.source)?.label || "Google"}
                      </p>
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end", flexShrink: 0 }}>
                      {!q.trim() && <ReorderButtons vertical first={idx === 0} last={idx === items.length - 1}
                        onUp={() => reorder(item.id, -1)} onDown={() => reorder(item.id, 1)} />}
                      <div style={{ display: "flex", gap: 6 }}>
                        <button onClick={() => setEditing({ ...item })}
                          style={{ padding: "6px 11px", background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: 7, color: T.accent, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>Rediger</button>
                        <button onClick={() => setConfirmDel(item)}
                          style={{ padding: "6px 11px", background: T.dangerDim, border: `1px solid ${T.dangerBorder}`, borderRadius: 7, color: T.danger, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>Slet</button>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {confirmDel && (
        <div onClick={() => !busy && setConfirmDel(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", backdropFilter: "blur(3px)", zIndex: 320, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ ...surface(), border: `1px solid ${T.dangerBorder}`, padding: 24, maxWidth: 400, width: "100%", maxHeight: "90dvh", overflowY: "auto", boxSizing: "border-box" }}>
            <p style={{ margin: "0 0 9px", fontSize: 16, fontWeight: 800, color: T.t1 }}>Slet anmeldelse?</p>
            <p style={{ margin: "0 0 18px", fontSize: 13.5, color: T.t2, lineHeight: 1.6 }}>Anmeldelsen fra <strong style={{ color: T.t1 }}>{confirmDel.name || "Anonym"}</strong> fjernes fra forsiden permanent.</p>
            <div style={{ display: "flex", gap: 9 }}>
              <button onClick={() => remove(confirmDel.id)} disabled={busy}
                style={{ flex: 1, padding: "11px 0", background: T.danger, color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 13.5, cursor: busy ? "wait" : "pointer", fontFamily: FF }}>{busy ? "Sletter…" : "Slet"}</button>
              <button onClick={() => setConfirmDel(null)}
                style={{ flex: 1, padding: "11px 0", background: "rgba(255,255,255,.06)", color: T.t3, border: "none", borderRadius: 9, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: FF }}>Annuller</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
