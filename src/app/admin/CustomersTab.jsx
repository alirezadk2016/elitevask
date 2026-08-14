"use client";
import { useState, useEffect, useMemo, useCallback } from "react";
import { T, FF, field, fmtDateShort, todayISO } from "./ui";

/* Customer view. Bookings are grouped by phone number (falling back to email),
   so the manager can finally see that the person on the phone has been here
   four times before — and can honour a GDPR erasure request without hunting
   through the booking list one record at a time. */
export default function CustomersTab({ secret, narrow, addToast, authFailed, onRefreshBookings }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [openKey, setOpenKey] = useState(null);
  const [erasing, setErasing] = useState(null); // {key, keepFuture}
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/admin/customers", { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" });
      if (authFailed(r.status)) return;
      if (!r.ok) { setError("Kunne ikke hente kunder."); return; }
      const data = await r.json();
      setCustomers(Array.isArray(data.customers) ? data.customers : []);
    } catch { setError("Netværksfejl."); }
    finally { setLoading(false); }
  }, [secret, authFailed]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const today = todayISO();
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return customers;
    const digits = s.replace(/\D/g, "");
    return customers.filter(c =>
      c.name.toLowerCase().includes(s) ||
      c.email.toLowerCase().includes(s) ||
      c.city.toLowerCase().includes(s) ||
      c.addr.toLowerCase().includes(s) ||
      (digits.length >= 3 && c.phone.replace(/\D/g, "").includes(digits))
    );
  }, [customers, q]);

  const totals = useMemo(() => ({
    people: customers.length,
    returning: customers.filter(c => c.visits > 1).length,
    revenue: customers.reduce((s, c) => s + c.revenue, 0),
  }), [customers]);

  async function erase() {
    if (!erasing) return;
    setBusy(true);
    try {
      const r = await fetch("/api/admin/customers", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({ key: erasing.key, keepFuture: erasing.keepFuture }),
      });
      if (authFailed(r.status)) return;
      const data = await r.json().catch(() => ({}));
      if (!r.ok || !data.ok) { addToast("err", data.error === "not_found" ? "Kunden findes ikke længere" : "Sletning fejlede"); return; }
      addToast("ok", `${data.deleted} booking${data.deleted === 1 ? "" : "er"} slettet permanent${data.kept ? ` · ${data.kept} fremtidig beholdt` : ""}`);
      setErasing(null); setOpenKey(null);
      load();
      onRefreshBookings?.();
    } catch { addToast("err", "Netværksfejl"); }
    finally { setBusy(false); }
  }

  const stat = (labelText, value, accent) => (
    <div style={{ flex: 1, minWidth: 130, background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, padding: "16px 18px" }}>
      <div style={{ fontSize: 24, fontWeight: 800, color: accent ? T.accent : T.t1, letterSpacing: "-.5px", fontVariantNumeric: "tabular-nums" }}>{value}</div>
      <div style={{ fontSize: 11.5, color: T.t3, fontWeight: 600, marginTop: 2 }}>{labelText}</div>
    </div>
  );

  const statusPill = (b) => {
    const cancelled = b.status === "cancelled";
    const upcoming = !cancelled && b.date >= today;
    const c = cancelled ? T.amber : upcoming ? T.accent : T.t3;
    const bg = cancelled ? T.amberDim : upcoming ? T.accentDim : "rgba(255,255,255,.05)";
    return (
      <span style={{ fontSize: 10.5, fontWeight: 700, color: c, background: bg, borderRadius: 6, padding: "2px 7px", whiteSpace: "nowrap" }}>
        {cancelled ? "Aflyst" : upcoming ? "Kommende" : "Udført"}
      </span>
    );
  };

  return (
    <>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 16 }}>
        {stat("Kunder i alt", totals.people, true)}
        {stat("Gengangere", totals.returning)}
        {stat("Omsætning i alt", `${totals.revenue.toLocaleString("da-DK")} kr`)}
      </div>

      <div style={{ display: "flex", gap: 9, marginBottom: 14, flexWrap: "wrap" }}>
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Søg navn, telefon, e-mail eller by…"
          style={field({ flex: 1, minWidth: 200, width: "auto" })} />
        <button onClick={load} disabled={loading}
          style={{ padding: "10px 16px", background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: 9, color: T.accent, fontSize: 13, fontWeight: 600, cursor: loading ? "wait" : "pointer", fontFamily: FF, whiteSpace: "nowrap" }}>
          {loading ? "…" : "Opdater"}
        </button>
      </div>

      {error && <div style={{ background: T.dangerDim, border: `1px solid ${T.dangerBorder}`, borderRadius: 10, padding: "11px 14px", fontSize: 13, color: T.danger, marginBottom: 14 }}>{error}</div>}
      {loading && <p style={{ color: T.t3, fontSize: 13 }}>Indlæser…</p>}
      {!loading && !filtered.length && (
        <p style={{ color: T.t3, fontSize: 13 }}>{customers.length ? "Ingen kunder matcher søgningen." : "Ingen kunder endnu."}</p>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(c => {
          const open = openKey === c.key;
          return (
            <div key={c.key} style={{ background: T.bg1, border: `1px solid ${open ? T.accentBorder : T.border}`, borderRadius: 13, overflow: "hidden", transition: "border .15s" }}>
              <button onClick={() => setOpenKey(open ? null : c.key)}
                style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "transparent", border: "none", cursor: "pointer", fontFamily: FF, textAlign: "left" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: T.accentDim, border: `1px solid ${T.accentBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 14, fontWeight: 800, color: T.accent }}>
                  {(c.name || "?").trim().charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: T.t1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                    {c.visits > 1 && (
                      <span style={{ fontSize: 10, fontWeight: 800, color: T.gold, background: T.goldDim, border: `1px solid ${T.goldBorder}`, borderRadius: 6, padding: "1px 6px", whiteSpace: "nowrap" }}>
                        {c.visits}× kunde
                      </span>
                    )}
                    {c.nextDate && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: T.blue, background: T.blueDim, borderRadius: 6, padding: "1px 6px", whiteSpace: "nowrap" }}>
                        {fmtDateShort(c.nextDate)}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 12, color: T.t3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {[c.phone, c.email, c.city].filter(Boolean).join(" · ") || "—"}
                  </div>
                </div>
                {!narrow && (
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 800, color: T.accent, fontVariantNumeric: "tabular-nums" }}>{c.revenue.toLocaleString("da-DK")} kr</div>
                    <div style={{ fontSize: 11, color: T.t4 }}>{c.total} booking{c.total === 1 ? "" : "er"}</div>
                  </div>
                )}
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke={T.t3} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}><polyline points="6 9 12 15 18 9" /></svg>
              </button>

              {open && (
                <div style={{ borderTop: `1px solid ${T.border}`, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14 }}>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {c.phone && <a href={`tel:${c.phone}`} style={{ padding: "7px 13px", background: T.accentDim, border: `1px solid ${T.accentBorder}`, borderRadius: 8, color: T.accent, fontSize: 12.5, fontWeight: 700, textDecoration: "none" }}>Ring {c.phone}</a>}
                    {c.email && <a href={`mailto:${c.email}`} style={{ padding: "7px 13px", background: "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 8, color: T.t2, fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}>{c.email}</a>}
                    {c.addr && (
                      <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${c.addr}, ${c.zip} ${c.city}`)}`} target="_blank" rel="noopener noreferrer"
                        style={{ padding: "7px 13px", background: "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 8, color: T.t2, fontSize: 12.5, fontWeight: 600, textDecoration: "none" }}>
                        {c.addr}, {c.zip} {c.city}
                      </a>
                    )}
                  </div>

                  <div>
                    <p style={{ fontSize: 10.5, letterSpacing: 1.4, fontWeight: 700, color: T.t4, textTransform: "uppercase", margin: "0 0 7px" }}>Historik</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                      {c.bookings.map(b => (
                        <div key={b.token} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", background: T.bg0, border: `1px solid ${T.border}`, borderRadius: 9 }}>
                          <span style={{ fontSize: 12.5, fontWeight: 700, color: T.t2, fontVariantNumeric: "tabular-nums", minWidth: 78, flexShrink: 0 }}>{fmtDateShort(b.date)} · {b.time}</span>
                          <span style={{ flex: 1, minWidth: 0, fontSize: 12, color: T.t3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{b.car} · {b.pkg}</span>
                          {b.source === "admin" && <span style={{ fontSize: 10, color: T.t4, fontWeight: 700, whiteSpace: "nowrap" }}>TLF</span>}
                          <span style={{ fontSize: 12, fontWeight: 700, color: T.t2, flexShrink: 0, fontVariantNumeric: "tabular-nums" }}>{b.price || "–"}</span>
                          {statusPill(b)}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* GDPR */}
                  <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12 }}>
                    <p style={{ fontSize: 11.5, color: T.t3, margin: "0 0 8px", lineHeight: 1.5 }}>
                      <strong style={{ color: T.t2 }}>GDPR — ret til sletning.</strong> Sletter alle personoplysninger om kunden permanent. Kan ikke fortrydes.
                    </p>
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button onClick={() => setErasing({ key: c.key, keepFuture: true, name: c.name, count: c.total })}
                        style={{ padding: "8px 14px", background: "rgba(255,255,255,.05)", border: `1px solid ${T.border}`, borderRadius: 8, color: T.t2, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: FF }}>
                        Slet historik (behold kommende)
                      </button>
                      <button onClick={() => setErasing({ key: c.key, keepFuture: false, name: c.name, count: c.total })}
                        style={{ padding: "8px 14px", background: T.dangerDim, border: `1px solid ${T.dangerBorder}`, borderRadius: 8, color: T.danger, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: FF }}>
                        Slet alle data
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {erasing && (
        <div onClick={() => !busy && setErasing(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.72)", backdropFilter: "blur(3px)", zIndex: 320, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
          <div onClick={e => e.stopPropagation()}
            style={{ background: T.bg1, border: `1px solid ${T.dangerBorder}`, borderRadius: 16, padding: 26, maxWidth: 420, width: "100%", boxShadow: T.shadowL, maxHeight: "90dvh", overflowY: "auto", boxSizing: "border-box" }}>
            <p style={{ margin: "0 0 10px", fontSize: 16, fontWeight: 800, color: T.t1 }}>Slet persondata?</p>
            <p style={{ margin: "0 0 18px", fontSize: 13.5, color: T.t2, lineHeight: 1.6 }}>
              {erasing.keepFuture
                ? <>Alle tidligere og aflyste bookinger for <strong style={{ color: T.t1 }}>{erasing.name}</strong> slettes permanent. Kommende aftaler beholdes.</>
                : <>Alle {erasing.count} bookinger for <strong style={{ color: T.t1 }}>{erasing.name}</strong> slettes permanent — også kommende aftaler, hvis tidspunkter så bliver ledige igen.</>}
            </p>
            <div style={{ display: "flex", gap: 9 }}>
              <button onClick={erase} disabled={busy}
                style={{ flex: 1, padding: "11px 0", background: T.danger, color: "#fff", border: "none", borderRadius: 9, fontWeight: 700, fontSize: 13.5, cursor: busy ? "wait" : "pointer", fontFamily: FF }}>
                {busy ? "Sletter…" : "Ja, slet permanent"}
              </button>
              <button onClick={() => setErasing(null)} disabled={busy}
                style={{ flex: 1, padding: "11px 0", background: "rgba(255,255,255,.06)", color: T.t3, border: "none", borderRadius: 9, fontWeight: 600, fontSize: 13.5, cursor: "pointer", fontFamily: FF }}>
                Annuller
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
