"use client";
import { useState, useEffect, useRef, useCallback } from "react";

const T = {
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
  border:       "rgba(255,255,255,.07)",
  shadow:       "0 1px 3px rgba(0,0,0,.4), 0 4px 16px rgba(0,0,0,.3)",
  shadowL:      "0 2px 8px rgba(0,0,0,.5), 0 8px 32px rgba(0,0,0,.4)",
};

const FF = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

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

function toEmbedUrl(url) {
  const yt = url.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

const STATUS_LABEL = { confirmed:"Bekræftet", cancelled:"Annulleret", completed:"Udført", pending:"Afventer" };
const STATUS_COLOR = { confirmed:T.accent, cancelled:T.danger, completed:T.accent, pending:T.gold };

// ── Booking Card ──────────────────────────────────────────────────────────────
function BookingCard({ b, secret, onCancel, onDelete }) {
  const [state, setState] = useState("idle");

  async function doCancel() {
    setState("loading");
    try {
      const r = await fetch("/api/admin/delete-booking", {
        method:"PATCH",
        headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
        body:JSON.stringify({ token:b.token }),
      });
      if (r.ok) { onCancel(b.token); setState("idle"); }
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
    <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:14, padding:"18px 20px", marginBottom:10, opacity: cancelled ? .65 : 1 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:12 }}>
        <span style={{ color:T.t1, fontWeight:700, fontSize:15 }}>{b.name || "Ukendt"}</span>
        <span style={{ fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:20, background:"rgba(0,0,0,.3)", color: STATUS_COLOR[b.status] || T.t3 }}>
          {STATUS_LABEL[b.status] || b.status}
        </span>
      </div>

      <div style={{ fontSize:13, color:T.t2, lineHeight:1.9, marginBottom:6 }}>
        <span style={{ color:T.t4 }}>📅</span> {fmtDate(b.date)} · kl. {b.time}
        {" · "}<span style={{ color:T.accent, fontWeight:700 }}>{b.price || "-"}</span>
      </div>
      <div style={{ fontSize:13, color:T.t2, lineHeight:1.9, marginBottom:2 }}>
        <span style={{ color:T.t4 }}>🚗</span> {b.car || "-"} · {b.pkg || "-"}
      </div>
      {b.addr  && <div style={{ fontSize:13, color:T.t3, marginBottom:2 }}>📍 {b.addr}, {b.zip} {b.city}</div>}
      {b.email && <div style={{ fontSize:13, color:T.t3, marginBottom:2 }}>✉️ {b.email}</div>}
      {b.phone && <div style={{ fontSize:13, color:T.t3, marginBottom:2 }}>📞 {b.phone}</div>}
      {b.msg   && <div style={{ fontSize:13, color:T.t4, marginBottom:2, fontStyle:"italic" }}>💬 {b.msg}</div>}
      <div style={{ fontSize:11, color:T.t4, marginBottom:14 }}>Booket: {fmtBooked(b.bookedAt)}</div>

      {!cancelled && state === "idle" && (
        <button onClick={() => setState("confirmCancel")}
          style={{ width:"100%", padding:"10px 0", background:T.goldDim, color:T.gold, border:`1px solid ${T.goldBorder}`, borderRadius:9, fontWeight:700, fontSize:13, cursor:"pointer", marginBottom:8, fontFamily:FF }}>
          Annuller booking
        </button>
      )}
      {state === "idle" && (
        <button onClick={() => setState("confirmDelete")}
          style={{ width:"100%", padding:"10px 0", background:T.dangerDim, color:T.danger, border:`1px solid ${T.dangerBorder}`, borderRadius:9, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:FF }}>
          Slet permanent
        </button>
      )}
      {loading && <div style={{ color:T.t3, fontSize:13, textAlign:"center", padding:"8px 0" }}>Behandler…</div>}

      {state === "confirmCancel" && (
        <div style={{ background:"rgba(0,0,0,.4)", border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px", marginTop:4 }}>
          <p style={{ color:T.t2, fontSize:13, margin:"0 0 10px", lineHeight:1.5 }}>Send annullerings-e-mail til kunden?</p>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={doCancel} style={{ flex:1, padding:"9px 0", background:"#c0392b", color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:FF }}>Ja, annuller</button>
            <button onClick={() => setState("idle")} style={{ flex:1, padding:"9px 0", background:"rgba(255,255,255,.07)", color:T.t3, border:"none", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:FF }}>Tilbage</button>
          </div>
        </div>
      )}

      {state === "confirmDelete" && (
        <div style={{ background:"rgba(0,0,0,.4)", border:`1px solid ${T.border}`, borderRadius:10, padding:"12px 14px", marginTop:4 }}>
          <p style={{ color:T.t2, fontSize:13, margin:"0 0 10px", lineHeight:1.5 }}>Slet booking permanent? Kan ikke fortrydes.</p>
          <div style={{ display:"flex", gap:8 }}>
            <button onClick={doDelete} style={{ flex:1, padding:"9px 0", background:"#c0392b", color:"#fff", border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:FF }}>Ja, slet</button>
            <button onClick={() => setState("idle")} style={{ flex:1, padding:"9px 0", background:"rgba(255,255,255,.07)", color:T.t3, border:"none", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:FF }}>Tilbage</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Main Admin Panel ──────────────────────────────────────────────────────────
export default function AdminPanel() {
  const [secret, setSecret]               = useState("");
  const [authed, setAuthed]               = useState(false);
  const [secretInput, setSecretInput]     = useState("");
  const [tab, setTab]                     = useState("bookings");

  // Bookings state
  const [bookings, setBookings]           = useState([]);
  const [bLoading, setBLoading]           = useState(false);
  const [bError, setBError]               = useState("");

  // Content state
  const [gallery, setGallery]             = useState([]);
  const [videos, setVideos]               = useState([]);
  const [cLoading, setCLoading]           = useState(false);
  const [msg, setMsg]                     = useState(null);
  const [urlInput, setUrlInput]           = useState("");
  const [captionInput, setCaptionInput]   = useState("");
  const [dragOver, setDragOver]           = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [previewItem, setPreviewItem]     = useState(null);
  const [hoveredId, setHoveredId]         = useState(null);
  const [expandedVideoId, setExpandedVideoId] = useState(null);
  const [hoverDropzone, setHoverDropzone] = useState(false);
  const [narrow, setNarrow]               = useState(false);
  const [loginErr, setLoginErr]           = useState("");
  const fileRef = useRef();

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const loadBookings = useCallback(async (s) => {
    setBLoading(true); setBError("");
    try {
      const r = await fetch("/api/admin/bookings", { headers:{ Authorization:`Bearer ${s}` } });
      if (r.status === 401) { setBError("Forkert adgangskode."); return; }
      const data = await r.json();
      setBookings(data.bookings || []);
    } catch { setBError("Netværksfejl — prøv igen."); }
    finally { setBLoading(false); }
  }, []);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("adm") || localStorage.getItem("adm");
      if (saved) { setSecret(saved); setAuthed(true); loadBookings(saved); }
    } catch {}
  }, [loadBookings]);

  async function login(e) {
    e.preventDefault();
    const r = await fetch("/api/admin/bookings", { headers:{ Authorization:`Bearer ${secretInput}` } });
    if (r.ok) {
      try { sessionStorage.setItem("adm", secretInput); localStorage.setItem("adm", secretInput); } catch {}
      const data = await r.json();
      setBookings(data.bookings || []);
      setSecret(secretInput); setAuthed(true);
    } else {
      setLoginErr("Forkert adgangskode");
    }
  }

  async function fetchContent(type) {
    const res = await fetch(`/api/admin/content?type=${type}`, { headers:{ Authorization:`Bearer ${secret}` } });
    const data = await res.json();
    if (type === "gallery") setGallery(data.items || []);
    else setVideos(data.items || []);
  }

  useEffect(() => {
    if (authed && (tab === "gallery" || tab === "videos")) fetchContent(tab);
  }, [authed, tab]);

  async function addUrl(type) {
    if (!urlInput.trim()) return;
    setCLoading(true); setMsg(null);
    const res = await fetch("/api/admin/content", {
      method:"POST",
      headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
      body: JSON.stringify({ type, url:urlInput.trim(), caption:captionInput, title:captionInput }),
    });
    const data = await res.json();
    setCLoading(false);
    if (data.ok) { setMsg({ type:"ok", text:"Tilføjet!" }); setUrlInput(""); setCaptionInput(""); fetchContent(type); }
    else setMsg({ type:"err", text:"Fejl – prøv igen" });
  }

  function uploadFile(file, type) {
    if (!file) return;
    setUploadProgress(0); setMsg(null);
    const form = new FormData();
    form.append("file", file); form.append("type", type); form.append("caption", captionInput);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => { if (e.lengthComputable) setUploadProgress(Math.round((e.loaded/e.total)*100)); };
    xhr.onload = () => {
      let data; try { data = JSON.parse(xhr.responseText); } catch { data = {}; }
      setUploadProgress(null);
      if (data.ok) { setMsg({ type:"ok", text:"Uploadet!" }); setCaptionInput(""); fetchContent(type); }
      else setMsg({ type:"err", text:data.error || "Upload fejlede" });
    };
    xhr.onerror = () => { setUploadProgress(null); setMsg({ type:"err", text:"Netværksfejl" }); };
    xhr.open("POST", "/api/admin/content");
    xhr.setRequestHeader("Authorization", `Bearer ${secret}`);
    xhr.send(form);
  }

  async function deleteItem(type, id, blobUrl) {
    if (!confirm("Slet dette element?")) return;
    await fetch("/api/admin/content", {
      method:"DELETE",
      headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
      body: JSON.stringify({ type, id, blobUrl:blobUrl||null }),
    });
    fetchContent(type);
  }

  function onDrop(e, type) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadFile(file, type);
  }

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:T.bg0, fontFamily:FF, padding:16 }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32, justifyContent:"center" }}>
          <div style={{ width:32, height:32, background:T.accent, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.bg0} strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span style={{ color:T.t1, fontWeight:800, fontSize:17, letterSpacing:"-.3px" }}>EliteVask <span style={{ color:T.t3, fontWeight:500 }}>Admin</span></span>
        </div>
        <div style={{ background:T.bg1, border:`1px solid ${T.accentBorder}`, borderRadius:20, padding:32, boxShadow:T.shadowL }}>
          <p style={{ color:T.t1, fontSize:20, fontWeight:800, margin:"0 0 4px", letterSpacing:"-.3px" }}>Log ind</p>
          <p style={{ color:T.t3, fontSize:13, margin:"0 0 24px" }}>Administrer bookinger og indhold</p>
          <form onSubmit={login}>
            <input style={{ width:"100%", padding:"13px 16px", borderRadius:10, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:15, boxSizing:"border-box", marginBottom:12, outline:"none", fontFamily:FF }}
              type="password" placeholder="Adgangskode" value={secretInput}
              onChange={e => { setSecretInput(e.target.value); setLoginErr(""); }} autoFocus />
            <button style={{ width:"100%", padding:13, background:T.accent, color:T.bg0, border:"none", borderRadius:10, fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:FF }} type="submit">
              Log ind
            </button>
          </form>
          {loginErr && (
            <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8, background:T.dangerDim, border:`1px solid ${T.dangerBorder}`, borderRadius:8, padding:"10px 14px", fontSize:13, color:T.danger }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {loginErr}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── HELPERS ────────────────────────────────────────────────────────────────
  const activeBookings    = bookings.filter(b => b.status !== "cancelled").length;
  const cancelledBookings = bookings.filter(b => b.status === "cancelled").length;

  const navItem = (id, label, icon, badge) => {
    const active = tab === id;
    return (
      <button onClick={() => { setTab(id); setMsg(null); setUrlInput(""); }}
        style={{ display:"flex", alignItems:"center", gap:10, width:"100%", padding:"9px 10px", borderRadius:8, fontSize:14, fontWeight:active?600:500, color:active?T.accent:T.t2, background:active?T.accentDim:"transparent", border:"none", cursor:"pointer", fontFamily:FF, textAlign:"left", transition:"background .15s, color .15s", marginBottom:2, position:"relative" }}>
        {icon}
        <span style={{ flex:1 }}>{label}</span>
        {badge != null && <span style={{ fontSize:11, fontWeight:700, background:active?T.accentBorder:"rgba(255,255,255,.07)", color:active?T.accent:T.t3, borderRadius:20, padding:"1px 7px" }}>{badge}</span>}
      </button>
    );
  };

  const sectionLabel = (text) => (
    <p style={{ fontSize:10, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase", margin:"0 0 6px", padding:"0 10px" }}>{text}</p>
  );

  const Feedback = ({ m }) => m ? (
    <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8, background:m.type==="ok"?T.accentDim:T.dangerDim, border:`1px solid ${m.type==="ok"?T.accentBorder:T.dangerBorder}`, borderRadius:8, padding:"10px 14px", fontSize:13, color:m.type==="ok"?T.accent:T.danger }}>
      {m.type==="ok"
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>}
      {m.text}
    </div>
  ) : null;

  const icons = {
    bookings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
    gallery:  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>,
    videos:   <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>,
    refresh:  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15"/></svg>,
  };

  // ── MAIN RENDER ────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100dvh", background:T.bg0, fontFamily:FF, color:T.t2 }}>

      {/* TOP BAR */}
      <div style={{ height:52, background:"rgba(8,17,10,.92)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:12, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:26, height:26, background:T.accent, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.bg0} strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          </div>
          <span style={{ color:T.t1, fontWeight:800, fontSize:15, letterSpacing:"-.2px" }}>EliteVask</span>
          <span style={{ color:T.t4, fontSize:14 }}>·</span>
          <span style={{ color:T.t2, fontSize:14 }}>Admin</span>
        </div>
        <div style={{ flex:1 }}/>
        {tab === "bookings" && (
          <button onClick={() => loadBookings(secret)}
            style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px", background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:8, color:T.accent, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FF }}>
            {icons.refresh} {bLoading ? "…" : "Opdater"}
          </button>
        )}
      </div>

      {/* LAYOUT */}
      <div style={{ display: narrow ? "block" : "grid", gridTemplateColumns:"220px 1fr", minHeight:"calc(100dvh - 52px)" }}>

        {/* SIDEBAR */}
        {!narrow ? (
          <aside style={{ background:T.bg0, borderRight:`1px solid ${T.border}`, padding:"24px 12px", position:"sticky", top:52, height:"calc(100dvh - 52px)", overflowY:"auto", boxSizing:"border-box" }}>
            {sectionLabel("Navigation")}
            {navItem("bookings", "Bookinger", icons.bookings, activeBookings || undefined)}
            <div style={{ height:1, background:T.border, margin:"14px 4px" }}/>
            {sectionLabel("Indhold")}
            {navItem("gallery", "Galleri", icons.gallery, gallery.length || undefined)}
            {navItem("videos",  "Videoer",  icons.videos,  videos.length  || undefined)}
            <div style={{ height:1, background:T.border, margin:"14px 4px" }}/>
            <p style={{ fontSize:11, color:T.t4, padding:"0 10px", margin:0 }}>Session aktiv</p>
          </aside>
        ) : (
          <div style={{ display:"flex", gap:8, padding:"16px 16px 0", overflowX:"auto" }}>
            {[["bookings","Bookinger",icons.bookings],["gallery","Galleri",icons.gallery],["videos","Videoer",icons.videos]].map(([id,label,icon]) => (
              <button key={id} onClick={() => { setTab(id); setMsg(null); setUrlInput(""); }}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:8, border:`1px solid ${tab===id?T.accentBorder:T.border}`, background:tab===id?T.accentDim:"transparent", color:tab===id?T.accent:T.t3, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FF, whiteSpace:"nowrap" }}>
                {icon}{label}
              </button>
            ))}
          </div>
        )}

        {/* MAIN CONTENT */}
        <main style={{ padding: narrow ? "20px 16px" : "32px 32px", maxWidth:900 }}>

          {/* Page title + badge */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
            <h1 style={{ fontSize:22, fontWeight:800, color:T.t1, margin:0, letterSpacing:"-.3px" }}>
              {tab === "bookings" ? "Bookinger" : tab === "gallery" ? "Galleri" : "Videoer"}
            </h1>
            <span style={{ background:T.accentDim, color:T.accent, borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>
              {tab === "bookings" ? `${activeBookings} aktive` : tab === "gallery" ? `${gallery.length} ${gallery.length===1?"billede":"billeder"}` : `${videos.length} ${videos.length===1?"video":"videoer"}`}
            </span>
          </div>

          {/* ── BOOKINGS ── */}
          {tab === "bookings" && (
            <>
              {bLoading && <div style={{ textAlign:"center", color:T.t3, padding:"60px 0", fontSize:14 }}>Indlæser…</div>}
              {bError && (
                <div style={{ display:"flex", alignItems:"center", gap:8, background:T.dangerDim, border:`1px solid ${T.dangerBorder}`, borderRadius:8, padding:"12px 16px", fontSize:13, color:T.danger, marginBottom:16 }}>
                  {bError}
                </div>
              )}
              {!bLoading && bookings.length === 0 && !bError && (
                <div style={{ textAlign:"center", padding:"80px 0" }}>
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={T.t4} strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom:16, opacity:.4 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <p style={{ fontSize:16, fontWeight:700, color:T.t2, margin:"0 0 6px" }}>Ingen bookinger endnu</p>
                  <p style={{ fontSize:13, color:T.t3, margin:0 }}>Nye bookinger vises her</p>
                </div>
              )}
              {bookings.map(b => (
                <BookingCard key={b.token} b={b} secret={secret}
                  onCancel={token => setBookings(bs => bs.map(x => x.token===token ? {...x, status:"cancelled"} : x))}
                  onDelete={token => setBookings(bs => bs.filter(x => x.token!==token))}
                />
              ))}
            </>
          )}

          {/* ── GALLERY ── */}
          {tab === "gallery" && (
            <>
              <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:16, padding:24, marginBottom:32 }}>
                <p style={{ fontSize:10, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase", margin:"0 0 16px" }}>Tilføj billede</p>

                {/* Dropzone */}
                <div
                  style={{ border:`2px dashed ${dragOver ? T.accent : hoverDropzone ? "rgba(55,210,120,.35)" : "rgba(55,210,120,.2)"}`, borderRadius:12, padding:"40px 24px", textAlign:"center", cursor:"pointer", transition:"all .2s", background:dragOver?"rgba(55,210,120,.04)":"transparent", transform:dragOver?"scale(1.005)":"none" }}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => onDrop(e, "gallery")}
                  onClick={() => fileRef.current?.click()}
                  onMouseEnter={() => setHoverDropzone(true)}
                  onMouseLeave={() => setHoverDropzone(false)}
                >
                  {uploadProgress !== null ? (
                    <div>
                      <p style={{ color:T.t2, fontSize:13, margin:"0 0 12px" }}>Uploader… {uploadProgress}%</p>
                      <div style={{ width:"100%", height:4, background:T.border, borderRadius:2 }}>
                        <div style={{ width:`${uploadProgress}%`, height:4, background:T.accent, borderRadius:2, transition:"width .1s linear" }}/>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div style={{ width:48, height:48, borderRadius:"50%", background:T.accentDim, display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px" }}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.accent} strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                      </div>
                      <p style={{ fontSize:15, fontWeight:600, color:T.t1, margin:"0 0 4px" }}>Træk billeder hertil</p>
                      <p style={{ color:T.t3, fontSize:13, margin:0 }}>eller <span style={{ color:T.accent }}>klik for at vælge</span></p>
                      <p style={{ color:T.t4, fontSize:11, marginTop:8, marginBottom:0 }}>JPG · PNG · WEBP — maks 4,5 MB</p>
                    </>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" style={{ display:"none" }} onChange={e => uploadFile(e.target.files[0], "gallery")} />
                </div>

                {/* Divider */}
                <div style={{ display:"flex", alignItems:"center", gap:12, margin:"20px 0" }}>
                  <div style={{ flex:1, height:1, background:T.border }}/>
                  <span style={{ fontSize:11, color:T.t4, letterSpacing:1, textTransform:"uppercase", whiteSpace:"nowrap" }}>eller URL</span>
                  <div style={{ flex:1, height:1, background:T.border }}/>
                </div>

                <div style={{ display:"flex", gap:8 }}>
                  <input style={{ flex:1, padding:"11px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:14, outline:"none", fontFamily:FF }} placeholder="https://…" value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                  <button onClick={() => addUrl("gallery")} disabled={cLoading||!urlInput.trim()}
                    style={{ padding:"11px 20px", background:T.accent, color:T.bg0, fontWeight:700, fontSize:13, borderRadius:8, border:"none", cursor:urlInput.trim()&&!cLoading?"pointer":"not-allowed", opacity:urlInput.trim()&&!cLoading?1:.4, whiteSpace:"nowrap", fontFamily:FF }}>
                    {cLoading ? "…" : "Tilføj"}
                  </button>
                </div>
                <input style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:14, outline:"none", fontFamily:FF, marginTop:8, boxSizing:"border-box" }} placeholder="Billedtekst (valgfri)" value={captionInput} onChange={e => setCaptionInput(e.target.value)} />
                <Feedback m={msg} />
              </div>

              {gallery.length > 0 && (
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <span style={{ fontSize:11, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase" }}>Billeder i galleriet</span>
                  <span style={{ background:T.bg2, color:T.t3, borderRadius:20, padding:"2px 9px", fontSize:12 }}>{gallery.length}</span>
                </div>
              )}

              {gallery.length > 0 ? (
                <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fill, minmax(${narrow?"160px":"220px"},1fr))`, gap:14 }}>
                  {gallery.map(item => (
                    <div key={item.id}
                      style={{ position:"relative", borderRadius:12, overflow:"hidden", background:T.bg1, border:`1px solid ${hoveredId===item.id?T.accentBorder:T.border}`, boxShadow:hoveredId===item.id?T.shadowL:T.shadow, transition:"border .2s, box-shadow .2s, transform .15s", transform:hoveredId===item.id?"translateY(-2px)":"none", cursor:"pointer" }}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <img src={item.url} alt={item.caption||""} style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", display:"block" }} />
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(8,17,10,.92) 0%, rgba(8,17,10,.3) 55%, transparent 100%)", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:12, opacity:hoveredId===item.id?1:0, transition:"opacity .2s" }}>
                        {item.caption && <p style={{ fontSize:12, color:T.t1, fontWeight:500, margin:"0 0 10px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.caption}</p>}
                        <div style={{ display:"flex", gap:6 }}>
                          <button onClick={() => setPreviewItem(item)}
                            style={{ flex:1, padding:"7px 0", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)", borderRadius:8, color:T.t1, fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, fontFamily:FF }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Vis
                          </button>
                          <button onClick={() => deleteItem("gallery", item.id, item.source==="upload"?item.url:null)}
                            style={{ flex:1, padding:"7px 0", background:T.dangerDim, border:`1px solid ${T.dangerBorder}`, borderRadius:8, color:T.danger, fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, fontFamily:FF }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>
                            Slet
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding:"72px 24px", textAlign:"center" }}>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke={T.t4} strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom:20, opacity:.4 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <p style={{ fontSize:17, fontWeight:700, color:T.t2, margin:"0 0 6px" }}>Ingen billeder endnu</p>
                  <p style={{ fontSize:13, color:T.t3, margin:"0 0 20px" }}>Upload dit første billede ovenfor</p>
                  <button onClick={() => fileRef.current?.click()}
                    style={{ padding:"10px 20px", background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:8, color:T.accent, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FF }}>
                    Upload billede
                  </button>
                </div>
              )}
            </>
          )}

          {/* ── VIDEOS ── */}
          {tab === "videos" && (
            <>
              <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:16, padding:24, marginBottom:32 }}>
                <p style={{ fontSize:10, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase", margin:"0 0 16px" }}>Tilføj video</p>
                <input style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:14, outline:"none", fontFamily:FF, boxSizing:"border-box", marginBottom:8 }} placeholder="YouTube eller Vimeo URL" value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                <input style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:14, outline:"none", fontFamily:FF, boxSizing:"border-box", marginBottom:12 }} placeholder="Titel (valgfri)" value={captionInput} onChange={e => setCaptionInput(e.target.value)} />
                <button onClick={() => addUrl("videos")} disabled={cLoading||!urlInput.trim()}
                  style={{ width:"100%", padding:12, background:T.accent, color:T.bg0, fontWeight:700, fontSize:14, borderRadius:8, border:"none", cursor:urlInput.trim()&&!cLoading?"pointer":"not-allowed", opacity:urlInput.trim()&&!cLoading?1:.4, fontFamily:FF }}>
                  {cLoading ? "Tilføjer…" : "Tilføj video"}
                </button>
                <Feedback m={msg} />
              </div>

              {videos.length > 0 && (
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <span style={{ fontSize:11, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase" }}>Videoer i galleriet</span>
                  <span style={{ background:T.bg2, color:T.t3, borderRadius:20, padding:"2px 9px", fontSize:12 }}>{videos.length}</span>
                </div>
              )}

              {videos.length > 0 ? (
                <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
                  {videos.map(item => (
                    <div key={item.id} style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:12, overflow:"hidden" }}>
                      <div style={{ display:"flex", alignItems:"stretch" }}>
                        {item.thumbnail
                          ? <img src={item.thumbnail} alt="" style={{ width:160, height:90, objectFit:"cover", flexShrink:0 }} />
                          : <div style={{ width:160, height:90, background:T.bg0, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                              <svg width="28" height="28" viewBox="0 0 24 24" fill={T.accent}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                            </div>}
                        <div style={{ flex:1, padding:"14px 16px", display:"flex", flexDirection:"column", gap:4, minWidth:0 }}>
                          <p style={{ margin:0, fontSize:15, fontWeight:600, color:T.t1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title || "Video"}</p>
                          <p style={{ margin:0, fontSize:11, color:T.t3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.url}</p>
                          <span style={{ marginTop:"auto", alignSelf:"flex-start", fontSize:10, color:T.accent, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, background:T.accentDim, borderRadius:4, padding:"2px 8px" }}>{item.platform||"video"}</span>
                        </div>
                        <div style={{ display:"flex", flexDirection:"column", gap:6, padding:"12px 14px", justifyContent:"center", flexShrink:0 }}>
                          <button onClick={() => setExpandedVideoId(expandedVideoId===item.id?null:item.id)}
                            style={{ padding:"7px 14px", background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:8, color:T.accent, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", fontFamily:FF }}>
                            {expandedVideoId===item.id?"Luk":"Vis"}
                          </button>
                          <button onClick={() => deleteItem("videos", item.id, null)}
                            style={{ padding:"7px 14px", background:T.dangerDim, border:`1px solid ${T.dangerBorder}`, borderRadius:8, color:T.danger, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", fontFamily:FF }}>
                            Slet
                          </button>
                        </div>
                      </div>
                      <div style={{ overflow:"hidden", maxHeight:expandedVideoId===item.id?360:0, transition:"max-height .3s ease", borderTop:expandedVideoId===item.id?`1px solid ${T.border}`:"none" }}>
                        {expandedVideoId===item.id && <iframe src={toEmbedUrl(item.url)} width="100%" height="340" style={{ display:"block", border:"none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding:"72px 24px", textAlign:"center" }}>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke={T.t4} strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom:20, opacity:.4 }}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                  <p style={{ fontSize:17, fontWeight:700, color:T.t2, margin:"0 0 6px" }}>Ingen videoer endnu</p>
                  <p style={{ fontSize:13, color:T.t3, margin:0 }}>Indsæt et YouTube- eller Vimeo-link ovenfor</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* LIGHTBOX */}
      {previewItem && (
        <div onClick={() => setPreviewItem(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.88)", backdropFilter:"blur(10px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <button onClick={() => setPreviewItem(null)}
            style={{ position:"absolute", top:20, right:20, width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)", color:T.t1, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontFamily:FF, fontSize:18, flexShrink:0 }}>
            ✕
          </button>
          <div onClick={e => e.stopPropagation()} style={{ textAlign:"center" }}>
            <img src={previewItem.url} alt={previewItem.caption||""} style={{ maxWidth:"90vw", maxHeight:"80vh", objectFit:"contain", borderRadius:12, boxShadow:"0 8px 48px rgba(0,0,0,.7)", display:"block" }} />
            {previewItem.caption && <p style={{ color:T.t2, fontSize:14, marginTop:16, margin:"16px 0 0" }}>{previewItem.caption}</p>}
          </div>
        </div>
      )}
    </div>
  );
}
