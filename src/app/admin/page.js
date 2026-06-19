"use client";
import { useState, useCallback, useEffect } from "react";

const S = {
  page:    { minHeight:"100dvh", background:"#0a0f0c", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif" },
  center:  { minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0f0c", padding:16 },
  card:    { background:"#111a14", border:"1px solid rgba(55,210,120,.15)", borderRadius:16, padding:"18px 16px", marginBottom:12 },
  label:   { color:"#555", fontSize:10, fontWeight:700, letterSpacing:1.2, textTransform:"uppercase", display:"block", marginBottom:2 },
  value:   { color:"#e0e0e0", fontSize:14, fontWeight:500 },
  row:     { marginBottom:10 },
  grid:    { display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 16px", marginBottom:14 },
  btnGold: { width:"100%", padding:"11px 0", background:"rgba(212,175,55,.12)", color:"#d4af37", border:"1px solid rgba(212,175,55,.3)", borderRadius:10, fontWeight:700, fontSize:14, cursor:"pointer", marginBottom:8 },
  btnRed:  { width:"100%", padding:"11px 0", background:"rgba(231,76,60,.1)",  color:"#e74c3c", border:"1px solid rgba(231,76,60,.25)", borderRadius:10, fontWeight:700, fontSize:14, cursor:"pointer" },
  btnGreen:{ width:"100%", padding:13, background:"#37d278", color:"#0a0f0c", border:"none", borderRadius:10, fontWeight:800, fontSize:15, cursor:"pointer" },
  input:   { width:"100%", padding:"13px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,.1)", background:"#0d170f", color:"#fff", fontSize:15, boxSizing:"border-box", marginBottom:12, outline:"none", fontFamily:"inherit" },
  confirm: { background:"rgba(0,0,0,.7)", border:"1px solid rgba(255,255,255,.1)", borderRadius:10, padding:"12px 14px", marginTop:10 },
  cfRow:   { display:"flex", gap:8, marginTop:10 },
  cfYes:   { flex:1, padding:"10px 0", background:"#c0392b", color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer" },
  cfNo:    { flex:1, padding:"10px 0", background:"rgba(255,255,255,.08)", color:"#aaa", border:"none", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer" },
};

const MONTHS = ["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
function fmtDate(d) {
  if (!d) return "-";
  const [,m,day] = d.split("-");
  return `${parseInt(day)}. ${MONTHS[parseInt(m)-1]}`;
}
function fmtBooked(iso) {
  if (!iso) return "-";
  try { return new Date(iso).toLocaleString("da-DK",{timeZone:"Europe/Copenhagen",day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"}); }
  catch { return "-"; }
}

const STATUS_LABEL = { confirmed:"Bekræftet", cancelled:"Annulleret", completed:"Udført", pending:"Afventer" };
const STATUS_COLOR = { confirmed:"#37d278", cancelled:"#e74c3c", completed:"#37d278", pending:"#d4af37" };

function BookingCard({ b, secret, onCancel, onDelete }) {
  const [state, setState] = useState("idle"); // idle | confirmCancel | confirmDelete | loading

  async function doCancel() {
    setState("loading");
    try {
      const r = await fetch("/api/admin/delete-booking", {
        method:"PATCH",
        headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
        body:JSON.stringify({ token:b.token }),
      });
      if (r.ok) onCancel(b.token);
      else setState("idle");
    } catch { setState("idle"); }
  }

  async function doDelete() {
    setState("loading");
    try {
      const r = await fetch("/api/admin/delete-booking", {
        method:"DELETE",
        headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
        body:JSON.stringify({ token:b.token }),
      });
      if (r.ok) onDelete(b.token);
      else setState("idle");
    } catch { setState("idle"); }
  }

  const cancelled = b.status === "cancelled";
  const loading   = state === "loading";

  return (
    <div style={{ ...S.card, opacity: cancelled ? 0.7 : 1 }}>
      {/* Status badge + name */}
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <span style={{ color:"#fff", fontWeight:700, fontSize:15 }}>{b.name || "Ukendt"}</span>
        <span style={{ fontSize:11, fontWeight:700, padding:"3px 9px", borderRadius:20, background:"rgba(0,0,0,.3)", color: STATUS_COLOR[b.status] || "#aaa" }}>
          {STATUS_LABEL[b.status] || b.status}
        </span>
      </div>

      {/* Info — compact rows */}
      <div style={{ fontSize:13, color:"#ccc", lineHeight:1.8, marginBottom:12 }}>
        <span style={{ color:"#555" }}>📅</span> {fmtDate(b.date)} · kl. {b.time}
        {" · "}<span style={{ color:"#37d278", fontWeight:700 }}>{b.price || "-"}</span>
      </div>
      <div style={{ fontSize:13, color:"#ccc", lineHeight:1.8, marginBottom:4 }}>
        <span style={{ color:"#555" }}>🚗</span> {b.car || "-"} · {b.pkg || "-"}
      </div>
      {b.addr ? <div style={{ fontSize:13, color:"#aaa", marginBottom:4 }}>📍 {b.addr}, {b.zip} {b.city}</div> : null}
      {b.email ? <div style={{ fontSize:13, color:"#aaa", marginBottom:4 }}>✉️ {b.email}</div> : null}
      {b.phone ? <div style={{ fontSize:13, color:"#aaa", marginBottom:4 }}>📞 {b.phone}</div> : null}
      {b.msg   ? <div style={{ fontSize:13, color:"#888", marginBottom:4, fontStyle:"italic" }}>💬 {b.msg}</div> : null}
      <div style={{ fontSize:11, color:"#444", marginBottom:12 }}>Booket: {fmtBooked(b.bookedAt)}</div>

      {/* Actions */}
      {!cancelled && state === "idle" && (
        <button style={S.btnGold} onClick={() => setState("confirmCancel")}>✕ Annuller booking</button>
      )}
      {state === "idle" && (
        <button style={S.btnRed} onClick={() => setState("confirmDelete")}>🗑 Slet permanent</button>
      )}
      {loading && <div style={{ color:"#aaa", fontSize:13, textAlign:"center", padding:"8px 0" }}>Behandler...</div>}

      {/* Confirm cancel */}
      {state === "confirmCancel" && (
        <div style={S.confirm}>
          <p style={{ color:"#ddd", fontSize:13, margin:0, lineHeight:1.5 }}>Send annullerings-e-mail til kunden?</p>
          <div style={S.cfRow}>
            <button style={S.cfYes} onClick={doCancel}>Ja, annuller</button>
            <button style={S.cfNo}  onClick={() => setState("idle")}>Tilbage</button>
          </div>
        </div>
      )}

      {/* Confirm delete */}
      {state === "confirmDelete" && (
        <div style={S.confirm}>
          <p style={{ color:"#ddd", fontSize:13, margin:0, lineHeight:1.5 }}>Slet booking permanent? Kan ikke fortrydes.</p>
          <div style={S.cfRow}>
            <button style={S.cfYes} onClick={doDelete}>Ja, slet</button>
            <button style={S.cfNo}  onClick={() => setState("idle")}>Tilbage</button>
          </div>
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
      const r = await fetch("/api/admin/bookings", { headers:{ Authorization:`Bearer ${s}` } });
      if (r.status === 401) { setError("Forkert adgangskode."); clearSecret(); return; }
      const data = await r.json();
      setBookings(data.bookings || []);
      setAuthed(true);
      saveSecret(s);
    } catch { setError("Netværksfejl — prøv igen."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("adm") || localStorage.getItem("adm");
      if (saved) { setSecret(saved); load(saved); }
    } catch {}
  }, [load]);

  // Save to both storages for reliability
  const saveSecret = (s) => {
    try { sessionStorage.setItem("adm", s); localStorage.setItem("adm", s); } catch {}
  };
  const clearSecret = () => {
    try { sessionStorage.removeItem("adm"); localStorage.removeItem("adm"); } catch {}
  };

  const active    = bookings.filter(b => b.status !== "cancelled").length;
  const cancelled = bookings.filter(b => b.status === "cancelled").length;

  if (!authed) return (
    <div style={S.center}>
      <form onSubmit={e => { e.preventDefault(); load(secret); }}
        style={{ background:"#111a14", border:"1px solid rgba(55,210,120,.15)", borderRadius:20, padding:"36px 24px", width:"100%", maxWidth:360, boxSizing:"border-box" }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:32, marginBottom:10 }}>🔐</div>
          <h2 style={{ color:"#fff", margin:"0 0 4px", fontSize:20, fontWeight:700 }}>Elite Vask Admin</h2>
          <p style={{ color:"#666", margin:0, fontSize:13 }}>Administrer bookinger</p>
        </div>
        <input type="password" placeholder="Adgangskode" value={secret} onChange={e => setSecret(e.target.value)} style={S.input} autoComplete="current-password" />
        {error && <p style={{ color:"#e74c3c", fontSize:13, margin:"0 0 10px", textAlign:"center" }}>{error}</p>}
        <button type="submit" disabled={loading} style={S.btnGreen}>{loading ? "..." : "Log ind →"}</button>
      </form>
    </div>
  );

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ background:"#111a14", borderBottom:"1px solid rgba(55,210,120,.15)", padding:"14px 16px", position:"sticky", top:0, zIndex:10 }}>
        <div style={{ maxWidth:600, margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:15 }}>Bookinger</div>
            <div style={{ color:"#555", fontSize:12 }}>
              <span style={{ color:"#37d278" }}>{active} aktive</span>
              {cancelled > 0 && <span> · {cancelled} annulleret</span>}
            </div>
          </div>
          <button onClick={() => load(secret)} style={{ background:"rgba(55,210,120,.12)", color:"#37d278", border:"1px solid rgba(55,210,120,.25)", borderRadius:10, padding:"9px 16px", cursor:"pointer", fontSize:13, fontWeight:600 }}>
            {loading ? "..." : "🔄 Opdater"}
          </button>
        </div>
      </div>

      {/* List */}
      <div style={{ maxWidth:600, margin:"0 auto", padding:"16px 12px 60px" }}>
        {loading && <div style={{ textAlign:"center", color:"#555", padding:"60px 0" }}>Indlæser...</div>}
        {!loading && bookings.length === 0 && (
          <div style={{ textAlign:"center", padding:"80px 0" }}>
            <div style={{ fontSize:36, marginBottom:10 }}>📭</div>
            <p style={{ color:"#555" }}>Ingen bookinger endnu</p>
          </div>
        )}
        {bookings.map(b => (
          <BookingCard
            key={b.token}
            b={b}
            secret={secret}
            onCancel={token => setBookings(bs => bs.map(x => x.token === token ? { ...x, status:"cancelled" } : x))}
            onDelete={token => setBookings(bs => bs.filter(x => x.token !== token))}
          />
        ))}
      </div>
    </div>
  );
}
