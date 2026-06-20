"use client";
import { useState, useEffect, useRef } from "react";

const S = {
  page:    { minHeight:"100dvh", background:"#0a0f0c", fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif", color:"#e0e0e0" },
  center:  { minHeight:"100dvh", display:"flex", alignItems:"center", justifyContent:"center", background:"#0a0f0c", padding:16 },
  loginBox:{ background:"#111a14", border:"1px solid rgba(55,210,120,.2)", borderRadius:20, padding:32, width:"100%", maxWidth:380 },
  h1:      { color:"#fff", fontSize:22, fontWeight:800, margin:"0 0 6px", letterSpacing:"-.3px" },
  sub:     { color:"#555", fontSize:13, margin:"0 0 24px" },
  input:   { width:"100%", padding:"13px 16px", borderRadius:10, border:"1px solid rgba(255,255,255,.1)", background:"#0d170f", color:"#fff", fontSize:15, boxSizing:"border-box", marginBottom:12, outline:"none", fontFamily:"inherit" },
  btn:     { width:"100%", padding:13, background:"#37d278", color:"#0a0f0c", border:"none", borderRadius:10, fontWeight:800, fontSize:15, cursor:"pointer" },
  header:  { background:"#0d1410", borderBottom:"1px solid rgba(55,210,120,.1)", padding:"0 20px", display:"flex", alignItems:"center", gap:16, height:56 },
  logo:    { color:"#37d278", fontWeight:800, fontSize:16, letterSpacing:"-.2px" },
  backBtn: { color:"#555", fontSize:13, textDecoration:"none", display:"flex", alignItems:"center", gap:6 },
  body:    { padding:"24px 16px", maxWidth:860, margin:"0 auto" },
  tabs:    { display:"flex", gap:8, marginBottom:24 },
  tab:     { padding:"9px 20px", borderRadius:8, border:"1px solid rgba(255,255,255,.08)", background:"transparent", color:"#888", fontSize:14, fontWeight:600, cursor:"pointer" },
  tabOn:   { background:"rgba(55,210,120,.12)", border:"1px solid rgba(55,210,120,.3)", color:"#37d278" },
  card:    { background:"#111a14", border:"1px solid rgba(55,210,120,.1)", borderRadius:14, padding:20, marginBottom:16 },
  label:   { color:"#555", fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase", display:"block", marginBottom:6 },
  row:     { display:"flex", gap:10, alignItems:"flex-start" },
  smallBtn:{ padding:"10px 18px", borderRadius:8, border:"none", fontWeight:700, fontSize:13, cursor:"pointer" },
  grid:    { display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px,1fr))", gap:14, marginTop:16 },
  imgCard: { background:"#0d1410", border:"1px solid rgba(255,255,255,.07)", borderRadius:12, overflow:"hidden", position:"relative", boxShadow:"0 2px 8px rgba(0,0,0,.3)" },
  del:     { position:"absolute", top:8, right:8, background:"rgba(231,76,60,.9)", border:"none", color:"#fff", borderRadius:8, padding:"6px 12px", fontSize:12, fontWeight:800, cursor:"pointer", display:"flex", alignItems:"center", gap:4, boxShadow:"0 2px 6px rgba(0,0,0,.4)" },
  vidCard: { background:"#0d1410", border:"1px solid rgba(255,255,255,.07)", borderRadius:10, overflow:"hidden", display:"flex", gap:12, padding:12, alignItems:"center" },
  dropzone:{ border:"2px dashed rgba(55,210,120,.25)", borderRadius:12, padding:"32px 16px", textAlign:"center", cursor:"pointer", transition:"border .2s" },
  err:     { color:"#e74c3c", fontSize:13, marginTop:8 },
  ok:      { color:"#37d278", fontSize:13, marginTop:8 },
};

const SECRET_KEY = "ev_admin_secret";

export default function ContentAdmin() {
  const [secret, setSecret] = useState("");
  const [authed, setAuthed] = useState(false);
  const [secretInput, setSecretInput] = useState("");
  const [tab, setTab] = useState("gallery");
  const [gallery, setGallery] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // {type:'ok'|'err', text}
  const [urlInput, setUrlInput] = useState("");
  const [captionInput, setCaptionInput] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  useEffect(() => {
    const saved = sessionStorage.getItem(SECRET_KEY);
    if (saved) { setSecret(saved); setAuthed(true); }
  }, []);

  useEffect(() => {
    if (authed) fetchItems(tab);
  }, [authed, tab]);

  async function login(e) {
    e.preventDefault();
    const res = await fetch("/api/admin/content?type=gallery", {
      headers: { Authorization: `Bearer ${secretInput}` },
    });
    if (res.ok) {
      sessionStorage.setItem(SECRET_KEY, secretInput);
      setSecret(secretInput);
      setAuthed(true);
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
      setUrlInput(""); setCaptionInput("");
      fetchItems(type);
    } else {
      setMsg({ type: "err", text: "Fejl – prøv igen" });
    }
  }

  async function uploadFile(file, type) {
    if (!file) return;
    setLoading(true); setMsg(null);
    const form = new FormData();
    form.append("file", file);
    form.append("type", type);
    form.append("caption", captionInput);
    const res = await fetch("/api/admin/content", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}` },
      body: form,
    });
    const data = await res.json();
    setLoading(false);
    if (data.ok) {
      setMsg({ type: "ok", text: "Uploadet!" });
      setCaptionInput("");
      fetchItems(type);
    } else {
      setMsg({ type: "err", text: data.error || "Upload fejlede" });
    }
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

  if (!authed) return (
    <div style={S.center}>
      <div style={S.loginBox}>
        <p style={S.h1}>Indhold</p>
        <p style={S.sub}>Log ind med din admin-adgangskode</p>
        <form onSubmit={login}>
          <input style={S.input} type="password" placeholder="Adgangskode" value={secretInput}
            onChange={e => { setSecretInput(e.target.value); setMsg(null); }} autoFocus />
          <button style={S.btn} type="submit">Log ind</button>
        </form>
        {msg && <p style={msg.type==="err"?S.err:S.ok}>{msg.text}</p>}
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.header}>
        <a href="/admin" style={S.backBtn}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Bookinger
        </a>
        <span style={{flex:1}}/>
        <span style={S.logo}>Elite Vask · Indhold</span>
      </div>

      <div style={S.body}>
        {/* TABS */}
        <div style={S.tabs}>
          {["gallery","videos"].map(t => (
            <button key={t} style={{...S.tab,...(tab===t?S.tabOn:{})}} onClick={() => { setTab(t); setMsg(null); }}>
              {t === "gallery" ? "📸 Galleri" : "🎬 Videoer"}
            </button>
          ))}
        </div>

        {/* GALLERY TAB */}
        {tab === "gallery" && (
          <>
            <div style={S.card}>
              <span style={S.label}>Tilføj billede</span>

              {/* Dropzone */}
              <div
                style={{...S.dropzone, borderColor: dragOver ? "#37d278" : "rgba(55,210,120,.25)"}}
                onDragOver={e=>{e.preventDefault();setDragOver(true)}}
                onDragLeave={()=>setDragOver(false)}
                onDrop={e=>onDrop(e,"gallery")}
                onClick={()=>fileRef.current?.click()}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#37d278" strokeWidth="1.5" strokeLinecap="round" style={{marginBottom:8}}>
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <p style={{color:"#555",fontSize:13,margin:0}}>Træk billede hertil eller <span style={{color:"#37d278"}}>klik for at vælge</span></p>
                <p style={{color:"#444",fontSize:11,margin:"4px 0 0"}}>JPG, PNG, WEBP – maks 4,5 MB</p>
                <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>uploadFile(e.target.files[0],"gallery")} />
              </div>

              <div style={{margin:"12px 0 4px",color:"#444",fontSize:12,textAlign:"center"}}>— eller indsæt URL —</div>

              <div style={S.row}>
                <input style={{...S.input,margin:0,flex:1}} placeholder="https://..." value={urlInput} onChange={e=>setUrlInput(e.target.value)} />
              </div>
              <input style={{...S.input,marginTop:8}} placeholder="Billedtekst (valgfri)" value={captionInput} onChange={e=>setCaptionInput(e.target.value)} />
              <button style={{...S.smallBtn,background:"#37d278",color:"#0a0f0c",width:"100%",padding:12}} disabled={loading||!urlInput.trim()} onClick={()=>addUrl("gallery")}>
                {loading ? "Tilføjer…" : "Tilføj via URL"}
              </button>
              {msg && <p style={msg.type==="ok"?S.ok:S.err}>{msg.text}</p>}
            </div>

            {/* Gallery grid */}
            {gallery.length > 0 ? (
              <>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginTop:20,marginBottom:4}}>
                  <span style={{color:"#555",fontSize:13}}>{gallery.length} {gallery.length===1?"billede":"billeder"} i galleriet</span>
                </div>
                <div style={S.grid}>
                  {gallery.map(item => (
                    <div key={item.id} style={S.imgCard}>
                      <img src={item.url} alt={item.caption||""} style={{width:"100%",aspectRatio:"4/3",objectFit:"cover",display:"block"}} />
                      {item.caption && <p style={{fontSize:12,color:"#888",padding:"8px 10px 6px",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.caption}</p>}
                      <button style={S.del} onClick={()=>deleteItem("gallery",item.id,item.source==="upload"?item.url:null)}>
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                        Slet
                      </button>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <p style={{color:"#444",fontSize:14,textAlign:"center",padding:"32px 0"}}>Ingen billeder endnu</p>
            )}
          </>
        )}

        {/* VIDEOS TAB */}
        {tab === "videos" && (
          <>
            <div style={S.card}>
              <span style={S.label}>Tilføj video</span>
              <input style={S.input} placeholder="YouTube eller Vimeo URL" value={urlInput} onChange={e=>setUrlInput(e.target.value)} />
              <input style={S.input} placeholder="Titel (valgfri)" value={captionInput} onChange={e=>setCaptionInput(e.target.value)} />
              <button style={{...S.smallBtn,background:"#37d278",color:"#0a0f0c",width:"100%",padding:12}} disabled={loading||!urlInput.trim()} onClick={()=>addUrl("videos")}>
                {loading ? "Tilføjer…" : "Tilføj video"}
              </button>
              {msg && <p style={msg.type==="ok"?S.ok:S.err}>{msg.text}</p>}
            </div>

            {videos.length > 0 ? (
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {videos.map(item => (
                  <div key={item.id} style={S.vidCard}>
                    {item.thumbnail ? (
                      <img src={item.thumbnail} alt="" style={{width:100,height:60,objectFit:"cover",borderRadius:6,flexShrink:0}} />
                    ) : (
                      <div style={{width:100,height:60,background:"#0a0f0c",borderRadius:6,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="#37d278"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                      </div>
                    )}
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{margin:0,fontSize:14,fontWeight:600,color:"#e0e0e0",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.title||"Video"}</p>
                      <p style={{margin:"3px 0 0",fontSize:11,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{item.url}</p>
                      <span style={{fontSize:10,color:"#37d278",fontWeight:700,textTransform:"uppercase",letterSpacing:.5}}>{item.platform||"video"}</span>
                    </div>
                    <button style={{...S.smallBtn,background:"rgba(231,76,60,.1)",color:"#e74c3c",border:"1px solid rgba(231,76,60,.25)",padding:"8px 12px",flexShrink:0}} onClick={()=>deleteItem("videos",item.id,null)}>
                      Slet
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{color:"#444",fontSize:14,textAlign:"center",padding:"32px 0"}}>Ingen videoer endnu</p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
