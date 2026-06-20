"use client";
import { useState, useEffect, useRef } from "react";

const T = {
  bg0:          "#08110a",
  bg1:          "#0d1610",
  bg2:          "#111e15",
  bg3:          "#172318",
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
  border:       "rgba(255,255,255,.07)",
  shadow:       "0 1px 3px rgba(0,0,0,.4), 0 4px 16px rgba(0,0,0,.3)",
  shadowL:      "0 2px 8px rgba(0,0,0,.5), 0 8px 32px rgba(0,0,0,.4)",
};

const FF = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

function toEmbedUrl(url) {
  const yt = url.match(/(?:youtu\.be\/|[?&]v=)([\w-]{11})/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return url;
}

const SECRET_KEY = "ev_admin_secret";

export default function ContentAdmin() {
  const [secret, setSecret]               = useState("");
  const [authed, setAuthed]               = useState(false);
  const [secretInput, setSecretInput]     = useState("");
  const [tab, setTab]                     = useState("gallery");
  const [gallery, setGallery]             = useState([]);
  const [videos, setVideos]               = useState([]);
  const [loading, setLoading]             = useState(false);
  const [msg, setMsg]                     = useState(null);
  const [urlInput, setUrlInput]           = useState("");
  const [captionInput, setCaptionInput]   = useState("");
  const [dragOver, setDragOver]           = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [previewItem, setPreviewItem]     = useState(null);
  const [hoveredId, setHoveredId]         = useState(null);
  const [expandedVideoId, setExpandedVideoId] = useState(null);
  const [narrow, setNarrow]               = useState(false);
  const [hoverDropzone, setHoverDropzone] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const saved = sessionStorage.getItem(SECRET_KEY);
    if (saved) { setSecret(saved); setAuthed(true); }
  }, []);

  useEffect(() => {
    if (authed) fetchItems(tab);
  }, [authed, tab]);

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  async function login(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/content?type=gallery", {
      headers: { Authorization: `Bearer ${secretInput}` },
    });
    if (res.ok) {
      sessionStorage.setItem(SECRET_KEY, secretInput);
      setSecret(secretInput); setAuthed(true);
    } else {
      setMsg({ type: "err", text: "Forkert adgangskode" });
    }
  }

  async function fetchItems(type) {
    const res = await fetch(`/api/admin/content?type=${type}`, {
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data = await res.json();
    if (type === "gallery") setGallery(data.items || []);
    else setVideos(data.items || []);
  }

  async function addUrl(type) {
    if (!urlInput.trim()) return;
    setLoading(true); setMsg(null);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ type, url: urlInput.trim(), caption: captionInput, title: captionInput }),
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setMsg({ type: "ok", text: "Tilføjet!" });
      setUrlInput(""); setCaptionInput(""); fetchItems(type);
    } else {
      setMsg({ type: "err", text: "Fejl – prøv igen" });
    }
  }

  function uploadFile(file, type) {
    if (!file) return;
    setUploadProgress(0); setMsg(null);
    const form = new FormData();
    form.append("file", file); form.append("type", type); form.append("caption", captionInput);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) setUploadProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      let data;
      try { data = JSON.parse(xhr.responseText); } catch { data = {}; }
      setUploadProgress(null);
      if (data.ok) {
        setMsg({ type: "ok", text: "Uploadet!" });
        setCaptionInput(""); fetchItems(type);
      } else {
        setMsg({ type: "err", text: data.error || "Upload fejlede" });
      }
    };
    xhr.onerror = () => { setUploadProgress(null); setMsg({ type: "err", text: "Netværksfejl" }); };
    xhr.open("POST", "/api/admin/content");
    xhr.setRequestHeader("Authorization", `Bearer ${secret}`);
    xhr.send(form);
  }

  async function deleteItem(type, id, blobUrl) {
    if (!confirm("Slet dette element?")) return;
    await fetch("/api/admin/content", {
      method: "DELETE",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/json" },
      body: JSON.stringify({ type, id, blobUrl: blobUrl || null }),
    });
    fetchItems(type);
  }

  function onDrop(e, type) {
    e.preventDefault(); setDragOver(false);
    const file = e.dataTransfer?.files?.[0];
    if (file) uploadFile(file, type);
  }

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (!authed) return (
    <div style={{ minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:T.bg0, fontFamily:FF, padding:16 }}>
      <div style={{ width:"100%", maxWidth:380 }}>
        {/* Logo */}
        <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:32, justifyContent:"center" }}>
          <div style={{ width:32, height:32, background:T.accent, borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.bg0} strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </div>
          <span style={{ color:T.t1, fontWeight:800, fontSize:17, letterSpacing:"-.3px" }}>EliteVask <span style={{ color:T.t3, fontWeight:500 }}>Admin</span></span>
        </div>

        <div style={{ background:T.bg1, border:`1px solid ${T.accentBorder}`, borderRadius:20, padding:32, boxShadow:T.shadowL }}>
          <p style={{ color:T.t1, fontSize:20, fontWeight:800, margin:"0 0 4px", letterSpacing:"-.3px" }}>Indhold</p>
          <p style={{ color:T.t3, fontSize:13, margin:"0 0 24px" }}>Log ind med din admin-adgangskode</p>
          <form onSubmit={login}>
            <input
              style={{ width:"100%", padding:"13px 16px", borderRadius:10, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:15, boxSizing:"border-box", marginBottom:12, outline:"none", fontFamily:FF }}
              type="password" placeholder="Adgangskode" value={secretInput}
              onChange={e => { setSecretInput(e.target.value); setMsg(null); }} autoFocus
            />
            <button style={{ width:"100%", padding:13, background:T.accent, color:T.bg0, border:"none", borderRadius:10, fontWeight:800, fontSize:15, cursor:"pointer", fontFamily:FF }} type="submit">
              Log ind
            </button>
          </form>
          {msg && (
            <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8, background:T.dangerDim, border:`1px solid ${T.dangerBorder}`, borderRadius:8, padding:"10px 14px", fontSize:13, color:T.danger }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {msg.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // ── MAIN LAYOUT ───────────────────────────────────────────────────────────
  const navItem = (label, icon, href, active, onClick) => (
    <a href={href||"#"} onClick={onClick ? (e)=>{e.preventDefault();onClick();} : undefined}
      style={{ display:"flex", alignItems:"center", gap:10, padding:"9px 10px", borderRadius:8, fontSize:14, fontWeight: active?600:500, color: active?T.accent:T.t2, background: active?T.accentDim:"transparent", textDecoration:"none", cursor:"pointer", transition:"background .15s, color .15s", marginBottom:2 }}>
      {icon}
      {label}
    </a>
  );

  const iconCalendar = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  const iconImage    = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>;
  const iconVideo    = <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>;

  const sectionLabel = (text) => (
    <p style={{ fontSize:10, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase", margin:"0 0 8px", padding:"0 10px" }}>{text}</p>
  );

  return (
    <div style={{ minHeight:"100dvh", background:T.bg0, fontFamily:FF, color:T.t2 }}>

      {/* ── TOP BAR ── */}
      <div style={{ height:52, background:"rgba(8,17,10,.9)", backdropFilter:"blur(12px)", borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", padding:"0 20px", gap:12, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ width:26, height:26, background:T.accent, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.bg0} strokeWidth="2.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/></svg>
          </div>
          <span style={{ color:T.t1, fontWeight:800, fontSize:15, letterSpacing:"-.2px" }}>EliteVask</span>
          <span style={{ color:T.t4, fontSize:14 }}>·</span>
          <span style={{ color:T.t2, fontSize:14 }}>Indhold</span>
        </div>
        <div style={{ flex:1 }}/>
        <a href="/admin" style={{ display:"flex", alignItems:"center", gap:6, color:T.t3, fontSize:13, textDecoration:"none" }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Bookinger
        </a>
      </div>

      {/* ── LAYOUT ── */}
      <div style={{ display:narrow?"block":"grid", gridTemplateColumns:"220px 1fr", minHeight:"calc(100dvh - 52px)" }}>

        {/* ── SIDEBAR ── */}
        {!narrow ? (
          <aside style={{ background:T.bg0, borderRight:`1px solid ${T.border}`, padding:"24px 12px", position:"sticky", top:52, height:"calc(100dvh - 52px)", overflowY:"auto" }}>
            {sectionLabel("Navigation")}
            {navItem("Bookinger", iconCalendar, "/admin", false)}
            {navItem("Indhold", iconImage, "#", true)}
            <div style={{ height:1, background:T.border, margin:"16px 4px" }}/>
            {sectionLabel("Indhold")}
            {navItem("Galleri", iconImage, "#", tab==="gallery", () => { setTab("gallery"); setMsg(null); setUrlInput(""); })}
            {navItem("Videoer", iconVideo, "#", tab==="videos", () => { setTab("videos"); setMsg(null); setUrlInput(""); })}
            <div style={{ height:1, background:T.border, margin:"16px 4px" }}/>
            <p style={{ fontSize:11, color:T.t4, padding:"0 10px", margin:0 }}>Session aktiv</p>
          </aside>
        ) : (
          // Mobile tab strip
          <div style={{ display:"flex", gap:8, padding:"16px 16px 0" }}>
            {[["gallery","Galleri",iconImage],["videos","Videoer",iconVideo]].map(([t,label,icon]) => (
              <button key={t} onClick={() => { setTab(t); setMsg(null); setUrlInput(""); }}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:8, border:`1px solid ${tab===t?T.accentBorder:T.border}`, background:tab===t?T.accentDim:"transparent", color:tab===t?T.accent:T.t3, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FF }}>
                {icon}{label}
              </button>
            ))}
          </div>
        )}

        {/* ── MAIN ── */}
        <main style={{ padding: narrow?"20px 16px":"32px 32px", maxWidth:900 }}>

          {/* Page header */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
            <h1 style={{ fontSize:22, fontWeight:800, color:T.t1, margin:0, letterSpacing:"-.3px" }}>
              {tab === "gallery" ? "Galleri" : "Videoer"}
            </h1>
            <span style={{ background:T.accentDim, color:T.accent, borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>
              {tab === "gallery" ? gallery.length : videos.length} {tab === "gallery" ? (gallery.length === 1 ? "billede" : "billeder") : (videos.length === 1 ? "video" : "videoer")}
            </span>
          </div>

          {/* ─── GALLERY TAB ─── */}
          {tab === "gallery" && (
            <>
              {/* Upload card */}
              <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:16, padding:24, marginBottom:32 }}>
                <p style={{ fontSize:10, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase", margin:"0 0 16px" }}>Tilføj billede</p>

                {/* Dropzone */}
                <div
                  style={{ border:`2px dashed ${dragOver ? T.accent : hoverDropzone ? "rgba(55,210,120,.35)" : "rgba(55,210,120,.2)"}`, borderRadius:12, padding:"40px 24px", textAlign:"center", cursor:"pointer", transition:"all .2s", background: dragOver ? "rgba(55,210,120,.04)" : "transparent", transform: dragOver ? "scale(1.005)" : "none" }}
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

                {/* URL input row */}
                <div style={{ display:"flex", gap:8 }}>
                  <input style={{ flex:1, padding:"11px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:14, outline:"none", fontFamily:FF }} placeholder="https://…" value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                  <button
                    style={{ padding:"11px 20px", background:T.accent, color:T.bg0, fontWeight:700, fontSize:13, borderRadius:8, border:"none", cursor: urlInput.trim()&&!loading ? "pointer":"not-allowed", opacity: urlInput.trim()&&!loading ? 1 : .4, whiteSpace:"nowrap", fontFamily:FF }}
                    disabled={loading || !urlInput.trim()} onClick={() => addUrl("gallery")}>
                    {loading ? "Tilføjer…" : "Tilføj"}
                  </button>
                </div>
                <input style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:14, outline:"none", fontFamily:FF, marginTop:8, boxSizing:"border-box" }} placeholder="Billedtekst (valgfri)" value={captionInput} onChange={e => setCaptionInput(e.target.value)} />

                {/* Feedback */}
                {msg && (
                  <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8, background: msg.type==="ok" ? T.accentDim : T.dangerDim, border:`1px solid ${msg.type==="ok" ? T.accentBorder : T.dangerBorder}`, borderRadius:8, padding:"10px 14px", fontSize:13, color: msg.type==="ok" ? T.accent : T.danger }}>
                    {msg.type === "ok"
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>}
                    {msg.text}
                  </div>
                )}
              </div>

              {/* Gallery section header */}
              {gallery.length > 0 && (
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <span style={{ fontSize:11, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase" }}>Billeder i galleriet</span>
                  <span style={{ background:T.bg2, color:T.t3, borderRadius:20, padding:"2px 9px", fontSize:12 }}>{gallery.length}</span>
                </div>
              )}

              {/* Gallery grid */}
              {gallery.length > 0 ? (
                <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fill, minmax(${narrow?"160px":"220px"},1fr))`, gap:14 }}>
                  {gallery.map(item => (
                    <div key={item.id}
                      style={{ position:"relative", borderRadius:12, overflow:"hidden", background:T.bg1, border:`1px solid ${hoveredId===item.id ? T.accentBorder : T.border}`, boxShadow: hoveredId===item.id ? T.shadowL : T.shadow, transition:"border .2s, box-shadow .2s, transform .15s", transform: hoveredId===item.id ? "translateY(-2px)" : "none", cursor:"pointer" }}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      <img src={item.url} alt={item.caption||""} style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", display:"block" }} />

                      {/* Hover overlay */}
                      <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top, rgba(8,17,10,.92) 0%, rgba(8,17,10,.35) 55%, transparent 100%)", display:"flex", flexDirection:"column", justifyContent:"flex-end", padding:12, opacity: hoveredId===item.id ? 1 : 0, transition:"opacity .2s" }}>
                        {item.caption && <p style={{ fontSize:12, color:T.t1, fontWeight:500, margin:"0 0 10px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.caption}</p>}
                        <div style={{ display:"flex", gap:6 }}>
                          <button
                            onClick={() => setPreviewItem(item)}
                            style={{ flex:1, padding:"7px 0", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)", borderRadius:8, color:T.t1, fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, fontFamily:FF }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                            Vis
                          </button>
                          <button
                            onClick={() => deleteItem("gallery", item.id, item.source==="upload" ? item.url : null)}
                            style={{ flex:1, padding:"7px 0", background:T.dangerDim, border:`1px solid ${T.dangerBorder}`, borderRadius:8, color:T.danger, fontSize:12, fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:5, fontFamily:FF }}>
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                            Slet
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding:"72px 24px", textAlign:"center" }}>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke={T.t4} strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom:20, opacity:.5 }}><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
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

          {/* ─── VIDEOS TAB ─── */}
          {tab === "videos" && (
            <>
              {/* Add video card */}
              <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:16, padding:24, marginBottom:32 }}>
                <p style={{ fontSize:10, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase", margin:"0 0 16px" }}>Tilføj video</p>
                <input style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:14, outline:"none", fontFamily:FF, boxSizing:"border-box", marginBottom:8 }} placeholder="YouTube eller Vimeo URL" value={urlInput} onChange={e => setUrlInput(e.target.value)} />
                <input style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:14, outline:"none", fontFamily:FF, boxSizing:"border-box", marginBottom:12 }} placeholder="Titel (valgfri)" value={captionInput} onChange={e => setCaptionInput(e.target.value)} />
                <button
                  style={{ width:"100%", padding:12, background:T.accent, color:T.bg0, fontWeight:700, fontSize:14, borderRadius:8, border:"none", cursor: urlInput.trim()&&!loading ? "pointer":"not-allowed", opacity: urlInput.trim()&&!loading ? 1 : .4, fontFamily:FF }}
                  disabled={loading || !urlInput.trim()} onClick={() => addUrl("videos")}>
                  {loading ? "Tilføjer…" : "Tilføj video"}
                </button>
                {msg && (
                  <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8, background: msg.type==="ok" ? T.accentDim : T.dangerDim, border:`1px solid ${msg.type==="ok" ? T.accentBorder : T.dangerBorder}`, borderRadius:8, padding:"10px 14px", fontSize:13, color: msg.type==="ok" ? T.accent : T.danger }}>
                    {msg.type === "ok"
                      ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>}
                    {msg.text}
                  </div>
                )}
              </div>

              {/* Video list */}
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
                        {/* Thumbnail */}
                        {item.thumbnail ? (
                          <img src={item.thumbnail} alt="" style={{ width:160, height:90, objectFit:"cover", flexShrink:0 }} />
                        ) : (
                          <div style={{ width:160, height:90, background:T.bg0, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                            <svg width="28" height="28" viewBox="0 0 24 24" fill={T.accent}><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          </div>
                        )}

                        {/* Info */}
                        <div style={{ flex:1, padding:"14px 16px", display:"flex", flexDirection:"column", gap:4, minWidth:0 }}>
                          <p style={{ margin:0, fontSize:15, fontWeight:600, color:T.t1, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.title || "Video"}</p>
                          <p style={{ margin:0, fontSize:11, color:T.t3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{item.url}</p>
                          <span style={{ marginTop:"auto", alignSelf:"flex-start", fontSize:10, color:T.accent, fontWeight:700, textTransform:"uppercase", letterSpacing:.5, background:T.accentDim, borderRadius:4, padding:"2px 8px" }}>{item.platform || "video"}</span>
                        </div>

                        {/* Actions */}
                        <div style={{ display:"flex", flexDirection:"column", gap:6, padding:"12px 14px", justifyContent:"center", flexShrink:0 }}>
                          <button
                            onClick={() => setExpandedVideoId(expandedVideoId===item.id ? null : item.id)}
                            style={{ padding:"7px 14px", background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:8, color:T.accent, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", fontFamily:FF }}>
                            {expandedVideoId===item.id ? "Luk" : "Vis"}
                          </button>
                          <button
                            onClick={() => deleteItem("videos", item.id, null)}
                            style={{ padding:"7px 14px", background:T.dangerDim, border:`1px solid ${T.dangerBorder}`, borderRadius:8, color:T.danger, fontSize:12, fontWeight:600, cursor:"pointer", whiteSpace:"nowrap", fontFamily:FF }}>
                            Slet
                          </button>
                        </div>
                      </div>

                      {/* Expandable embed */}
                      <div style={{ overflow:"hidden", maxHeight: expandedVideoId===item.id ? 360 : 0, transition:"max-height .3s ease", borderTop: expandedVideoId===item.id ? `1px solid ${T.border}` : "none" }}>
                        {expandedVideoId===item.id && (
                          <iframe src={toEmbedUrl(item.url)} width="100%" height="340" style={{ display:"block", border:"none" }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding:"72px 24px", textAlign:"center" }}>
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke={T.t4} strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom:20, opacity:.5 }}><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>
                  <p style={{ fontSize:17, fontWeight:700, color:T.t2, margin:"0 0 6px" }}>Ingen videoer endnu</p>
                  <p style={{ fontSize:13, color:T.t3, margin:0 }}>Indsæt et YouTube- eller Vimeo-link ovenfor</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* ── LIGHTBOX ── */}
      {previewItem && (
        <div
          onClick={() => setPreviewItem(null)}
          style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.88)", backdropFilter:"blur(10px)", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
          <button
            onClick={() => setPreviewItem(null)}
            style={{ position:"absolute", top:20, right:20, width:40, height:40, borderRadius:"50%", background:"rgba(255,255,255,.1)", border:"1px solid rgba(255,255,255,.15)", color:T.t1, display:"flex", alignItems:"center", justifyContent:"center", cursor:"pointer", fontFamily:FF, fontSize:18 }}>
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
