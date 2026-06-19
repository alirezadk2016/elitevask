"use client";
import { useState, useCallback, useEffect } from "react";

const GREEN = "#37d278";
const DARK  = "#0a0f0c";
const CARD  = "#111a14";
const BORDER= "rgba(55,210,120,.15)";

const STATUS_LABEL = { confirmed: "Bekræftet", cancelled: "Annulleret", completed: "Udført", pending: "Afventer" };
const STATUS_COLOR = { confirmed: "#37d278", cancelled: "#e74c3c", completed: "#37d278", pending: "#d4af37" };
const STATUS_BG    = { confirmed: "rgba(55,210,120,.12)", cancelled: "rgba(231,76,60,.12)", completed: "rgba(55,210,120,.12)", pending: "rgba(212,175,55,.12)" };

function fmtDate(d) {
  if (!d) return "-";
  const [y, m, day] = d.split("-");
  const months = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
  return `${parseInt(day)}. ${months[parseInt(m)-1]} ${y}`;
}
function fmtBooked(iso) {
  if (!iso) return "-";
  return new Date(iso).toLocaleString("da-DK", { timeZone: "Europe/Copenhagen", day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}

function Field({ label, value, green }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ color: "#555", fontSize: 10, fontWeight: 700, letterSpacing: 1.2, textTransform: "uppercase", marginBottom: 2 }}>{label}</div>
      <div style={{ color: green ? GREEN : "#e8e8e8", fontWeight: green ? 700 : 500, fontSize: 14, lineHeight: 1.4 }}>{value || "-"}</div>
    </div>
  );
}

function ConfirmBar({ msg, onYes, onNo }) {
  return (
    <div style={{ background: "rgba(0,0,0,.6)", borderRadius: 10, padding: "12px 14px", marginTop: 10, border: "1px solid rgba(255,255,255,.1)" }}>
      <p style={{ color: "#ddd", fontSize: 13, margin: "0 0 10px", lineHeight: 1.5 }}>{msg}</p>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={onYes} style={{ flex: 1, padding: "9px", background: "#c0392b", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Ja, bekræft</button>
        <button onClick={onNo}  style={{ flex: 1, padding: "9px", background: "rgba(255,255,255,.08)", color: "#aaa", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Annuller</button>
      </div>
    </div>
  );
}

function BookingCard({ b, secret, onCancel, onDelete }) {
  const [cancelling, setCancelling] = useState(false);
  const [deleting,   setDeleting]   = useState(false);
  const [expanded,   setExpanded]   = useState(false);
  const [confirm,    setConfirm]    = useState(null); // "cancel" | "delete" | null

  async function doCancel() {
    setConfirm(null);
    setCancelling(true);
    try {
      const r = await fetch("/api/admin/delete-booking", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({ token: b.token }),
      });
      if (r.ok) onCancel(b.token);
    } finally { setCancelling(false); }
  }

  async function doDelete() {
    setConfirm(null);
    setDeleting(true);
    try {
      const r = await fetch("/api/admin/delete-booking", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
        body: JSON.stringify({ token: b.token }),
      });
      if (r.ok) onDelete(b.token);
    } finally { setDeleting(false); }
  }

  const cancelled = b.status === "cancelled";

  return (
    <div style={{
      background: CARD,
      border: `1px solid ${cancelled ? "rgba(231,76,60,.2)" : BORDER}`,
      borderRadius: 16,
      marginBottom: 12,
      overflow: "hidden",
      opacity: cancelled ? 0.75 : 1,
    }}>
      <div
        onClick={() => { setExpanded(e => !e); setConfirm(null); }}
        style={{ padding: "16px 18px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, WebkitTapHighlightColor: "transparent" }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
            <span style={{ color: "#fff", fontWeight: 700, fontSize: 15 }}>{b.name || "Ukendt"}</span>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
              background: STATUS_BG[b.status] || "rgba(255,255,255,.08)",
              color: STATUS_COLOR[b.status] || "#aaa",
            }}>{STATUS_LABEL[b.status] || b.status}</span>
          </div>
          <div style={{ color: "#aaa", fontSize: 13, marginTop: 4 }}>
            {fmtDate(b.date)} · kl. {b.time}
            <span style={{ color: GREEN }}> · {b.price || "-"}</span>
          </div>
        </div>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2.5" strokeLinecap="round"
          style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform .2s", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </div>

      {expanded && (
        <div style={{ padding: "0 18px 18px", borderTop: `1px solid ${BORDER}` }}>
          <div style={{ paddingTop: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "4px 20px" }}>
            <Field label="Bil"     value={b.car} />
            <Field label="Pakke"   value={b.pkg} />
            <Field label="Pris"    value={b.price} green />
            <Field label="Adresse" value={b.addr ? `${b.addr}, ${b.zip} ${b.city}` : null} />
            <Field label="E-mail"  value={b.email} />
            <Field label="Telefon" value={b.phone} />
            <Field label="Booket"  value={fmtBooked(b.bookedAt)} />
            {b.extras?.length ? <Field label="Tilvalg" value={b.extras.join(", ")} /> : null}
            {b.msg ? <div style={{ gridColumn: "1/-1" }}><Field label="Besked" value={b.msg} /></div> : null}
          </div>

          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            {!cancelled && (
              <button onClick={() => setConfirm(confirm === "cancel" ? null : "cancel")} disabled={cancelling} style={{
                flex: 1, minWidth: 120, padding: "11px 16px",
                background: confirm === "cancel" ? "rgba(212,175,55,.25)" : "rgba(212,175,55,.12)",
                color: "#d4af37", border: "1px solid rgba(212,175,55,.3)",
                borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer",
              }}>
                {cancelling ? "..." : "✕ Annuller"}
              </button>
            )}
            <button onClick={() => setConfirm(confirm === "delete" ? null : "delete")} disabled={deleting} style={{
              flex: 1, minWidth: 120, padding: "11px 16px",
              background: confirm === "delete" ? "rgba(231,76,60,.25)" : "rgba(231,76,60,.1)",
              color: "#e74c3c", border: "1px solid rgba(231,76,60,.25)",
              borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer",
            }}>
              {deleting ? "..." : "🗑 Slet"}
            </button>
          </div>

          {confirm === "cancel" && (
            <ConfirmBar
              msg="Annuller booking og send e-mail til kunden?"
              onYes={doCancel}
              onNo={() => setConfirm(null)}
            />
          )}
          {confirm === "delete" && (
            <ConfirmBar
              msg="Slet booking permanent? Dette kan ikke fortrydes."
              onYes={doDelete}
              onNo={() => setConfirm(null)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function AdminPage() {
  const [secret,   setSecret]   = useState("");
  const [authed,   setAuthed]   = useState(false);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  const load = useCallback(async (s) => {
    setLoading(true); setError("");
    try {
      const r = await fetch("/api/admin/bookings", { headers: { Authorization: `Bearer ${s}` } });
      if (r.status === 401) { setError("Forkert adgangskode."); sessionStorage.removeItem("adm"); return; }
      const data = await r.json();
      setBookings(data.bookings || []);
      setAuthed(true);
      sessionStorage.setItem("adm", s);
    } catch { setError("Netværksfejl — prøv igen."); }
    finally { setLoading(false); }
  }, []);

  // Auto-login from session
  useEffect(() => {
    const saved = sessionStorage.getItem("adm");
    if (saved) { setSecret(saved); load(saved); }
  }, [load]);

  const confirmed = bookings.filter(b => b.status !== "cancelled").length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;

  if (!authed) return (
    <div style={{ minHeight: "100dvh", display: "flex", alignItems: "center", justifyContent: "center", background: DARK, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", padding: 16 }}>
      <form onSubmit={e => { e.preventDefault(); load(secret); }}
        style={{ background: CARD, border: `1px solid ${BORDER}`, borderRadius: 20, padding: "36px 28px", width: "100%", maxWidth: 360, boxSizing: "border-box" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: "rgba(55,210,120,.15)", border: `1px solid ${BORDER}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", fontSize: 22 }}>🔐</div>
          <h2 style={{ color: "#fff", margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Elite Vask Admin</h2>
          <p style={{ color: "#666", margin: 0, fontSize: 13 }}>Administrer bookinger</p>
        </div>
        <input
          type="password"
          placeholder="Adgangskode"
          value={secret}
          onChange={e => setSecret(e.target.value)}
          style={{ width: "100%", padding: "13px 16px", borderRadius: 10, border: "1px solid rgba(255,255,255,.1)", background: "#0d170f", color: "#fff", fontSize: 15, boxSizing: "border-box", marginBottom: 12, outline: "none", fontFamily: "inherit" }}
          autoFocus
        />
        {error && <p style={{ color: "#e74c3c", fontSize: 13, margin: "0 0 10px", textAlign: "center" }}>{error}</p>}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 13, background: GREEN, color: DARK, border: "none", borderRadius: 10, fontWeight: 800, fontSize: 15, cursor: "pointer", fontFamily: "inherit" }}>
          {loading ? "..." : "Log ind →"}
        </button>
      </form>
    </div>
  );

  return (
    <div style={{ minHeight: "100dvh", background: DARK, fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" }}>
      <div style={{ background: CARD, borderBottom: `1px solid ${BORDER}`, padding: "16px 18px", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 720, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>Bookinger</div>
            <div style={{ color: "#555", fontSize: 12, marginTop: 2 }}>
              <span style={{ color: GREEN }}>{confirmed} aktive</span>
              {cancelled > 0 && <span> · {cancelled} annulleret</span>}
            </div>
          </div>
          <button onClick={() => load(secret)} style={{
            background: "rgba(55,210,120,.12)", color: GREEN,
            border: `1px solid rgba(55,210,120,.25)`, borderRadius: 10,
            padding: "9px 16px", cursor: "pointer", fontSize: 13, fontWeight: 600,
          }}>
            {loading ? "..." : "🔄 Opdater"}
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 14px 40px" }}>
        {loading && <div style={{ textAlign: "center", padding: "60px 0", color: "#555" }}>Indlæser...</div>}
        {!loading && bookings.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ color: "#555", fontSize: 16 }}>Ingen bookinger endnu</p>
          </div>
        )}
        {bookings.map(b => (
          <BookingCard
            key={b.token}
            b={b}
            secret={secret}
            onCancel={token => setBookings(bs => bs.map(x => x.token === token ? { ...x, status: "cancelled" } : x))}
            onDelete={token => setBookings(bs => bs.filter(x => x.token !== token))}
          />
        ))}
      </div>
    </div>
  );
}
