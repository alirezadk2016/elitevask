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
  // booking status colors
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

const FF = "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const DEFAULT_PRICES = {
  lille:   { hele:800,  udv:500,  indv:600,  guld:2000 },
  mellem:  { hele:950,  udv:550,  indv:700,  guld:2200 },
  stor:    { hele:1100, udv:650,  indv:850,  guld:2350 },
  varebil: { hele:1400, udv:750,  indv:750,  guld:2200 },
};

const DEFAULT_FAQ = [
  {q:{da:"Kan dampvask skade lakken?",en:"Can steam washing damage the paintwork?"},a:{da:"Nej – dampvask er faktisk skånsom for lakken end traditionel højtryk- eller tunnelvask. Vi bruger professionel damp ved kontrolleret temperatur og bløde mikrofiberklude. Der bruges ingen roterende børster, der kan ridse, og ingen aggressive kemikalier, der kan angribe lakken. Metoden er anbefalet til biler med keramisk coating, poleret lak og sarte overflader.",en:"No – steam washing is actually gentler on paintwork than traditional high-pressure or tunnel washing. We use professional steam at controlled temperature and soft microfibre cloths. No rotating brushes that can scratch, and no aggressive chemicals that attack the paint. The method is recommended for cars with ceramic coating, polished paint and delicate surfaces."}},
  {q:{da:"Hvor lang tid tager det?",en:"How long does it take?"},a:{da:"Det afhænger af bilstørrelse og pakke: Lille bil: 100–120 min, Mellemstor bil: 120–180 min, Stor bil / SUV: 150–200 min, Varebil: 90–180 min. Vi er altid præcise med vores tidsestimater og holder dig opdateret undervejs.",en:"It depends on car size and package: Small car: 100–120 min, Medium car: 120–180 min, Large car / SUV: 150–200 min, Van: 90–180 min. We always give accurate time estimates and keep you updated throughout."}},
  {q:{da:"Skal jeg være hjemme?",en:"Do I need to be home?"},a:{da:"Ikke nødvendigvis. Mange kunder er på arbejde, mens vi vasker bilen. Det eneste krav er, at bilen er tilgængelig og at der er fri adgang rundt om den.",en:"Not necessarily. Many customers are at work while we wash the car. The only requirement is that the car is accessible and there is clear space around it."}},
  {q:{da:"Vasker I elbiler?",en:"Do you wash electric cars?"},a:{da:"Ja, vi vasker alle typer elbiler – Tesla, Polestar, VW ID, Hyundai Ioniq og alle andre mærker. Dampvask er faktisk ideelt til elbiler: vi bruger minimalt vand, ingen aggressive kemikalier der kan påvirke tætninger og elektronik.",en:"Yes, we wash all types of electric cars – Tesla, Polestar, VW ID, Hyundai Ioniq and all other brands. Steam washing is actually ideal for EVs: we use minimal water, no aggressive chemicals that could affect seals and electronics."}},
  {q:{da:"Hvad hvis det regner?",en:"What if it rains?"},a:{da:"Let regn er sjældent et problem – vi kan vaske under overdækning, i carporte eller i garager. Ved kraftigt regn kontakter vi dig dagen inden og tilbyder at ombooke til nærmeste ledige tid helt uden gebyr.",en:"Light rain is rarely a problem – we can wash under cover, in carports or in garages. In heavy rain we contact you the day before and offer to rebook to the nearest available time completely free of charge."}},
  {q:{da:"Hvad koster mobil bilvask?",en:"What does mobile car wash cost?"},a:{da:"Prisen afhænger af biltype og pakke: Udvendig vask: fra 500 kr, Hel bil (ind & ud): fra 800 kr, Guld pakke (inkl. motorrens + lakforsegling): fra 2.000 kr. Kørsel til din adresse på Sjælland er gratis.",en:"Price depends on car type and package: Exterior wash: from 500 kr, Full car (in & out): from 800 kr, Gold package (incl. engine clean + paint protection): from 2,000 kr. Travel to your address on Zealand is free."}},
  {q:{da:"Hvor lang tid tager vasken?",en:"How long does the wash take?"},a:{da:"Det afhænger af bilstørrelse og pakke: Lille bil: 100–120 min, Mellemstor bil: 120–180 min, Stor bil / SUV: 150–200 min, Varebil: 90–180 min.",en:"It depends on car size and package: Small car: 100–120 min, Medium car: 120–180 min, Large car / SUV: 150–200 min, Van: 90–180 min."}},
  {q:{da:"Kommer I til min adresse?",en:"Do you come to my address?"},a:{da:"Ja – det er hele idéen! Vi er 100% mobile og kører ud til dig, uanset om du er hjemme, på arbejdet eller i sommerhuset. Du behøver slet ikke flytte dig. Vi medbringer alt udstyr.",en:"Yes – that's the whole idea! We are 100% mobile and drive to you, whether you're at home, at work or at the summer house. You don't need to move. We bring all equipment."}},
  {q:{da:"Er dampvask sikkert for min bil?",en:"Is steam washing safe for my car?"},a:{da:"Ja, dampvask er faktisk skånsomt for bilen end traditionel højtryk- eller tunnelvask. Vi bruger professionelle, pH-neutrale produkter og varm damp der løsner snavs uden at ridse lakken.",en:"Yes, steam washing is actually gentler for your car than traditional high-pressure or tunnel washing. We use professional, pH-neutral products and hot steam that loosens dirt without scratching the paint."}},
  {q:{da:"Arbejder I i hele Sjælland?",en:"Do you work all over Zealand?"},a:{da:"Ja! Vi dækker hele Sjælland – postnumre 1000–4799 – inkl. Storkøbenhavn, Nordsjælland, Køge, Roskilde, Næstved, Ringsted og omegn. Kørsel er gratis til alle adresser inden for serviceområdet.",en:"Yes! We cover all of Zealand – postcodes 1000–4799 – including Greater Copenhagen, North Zealand, Køge, Roskilde, Næstved, Ringsted and surrounding areas. Travel is free to all addresses within the service area."}},
  {q:{da:"Hvad er inkluderet i Guld pakken?",en:"What is included in the Gold package?"},a:{da:"Guld pakken er vores mest komplette behandling og inkluderer alt: Komplet udvendig dampvask, Grundig indvendig rens, Professionel motorrens, Lak- & glansbeskyttelse (lakforsegling), Interiørbeskyttelse, Dybderens ved uheld.",en:"The Gold package is our most complete treatment and includes everything: Complete exterior steam wash, Thorough interior clean, Professional engine clean, Paint & gloss protection (paint sealant), Interior protection, Deep clean if needed."}},
  {q:{da:"Kan I vaske leasingbiler?",en:"Can you clean lease cars?"},a:{da:"Ja, vi klargør leasingbiler til aflevering. Vi sørger for at bilen fremstår ren og velholdt – både udvendigt og indvendigt – så du undgår ekstraomkostninger ved aflevering.",en:"Yes, we prepare lease cars for return. We ensure the car looks clean and well-maintained – both inside and out – so you avoid extra costs at return."}},
  {q:{da:"Hvad er forskellen på dampvask og almindelig bilvask?",en:"What is the difference between steam wash and regular wash?"},a:{da:"Traditionel bilvask (tunnelvask eller højtryk) ridser lakken over tid med børster og aggressive kemikalier. Dampvask bruger varme og tryk til at løsne snavs skånsomt – uden børster, uden aggressive kemikalier og med op til 90% mindre vandforbrug.",en:"Traditional car washing (tunnel wash or high pressure) scratches the paint over time with brushes and aggressive chemicals. Steam washing uses heat and pressure to gently loosen dirt – without brushes, without aggressive chemicals and with up to 90% less water."}},
  {q:{da:"Skal jeg forberede bilen inden I kommer?",en:"Do I need to prepare the car before you arrive?"},a:{da:"Det er ikke nødvendigt, men du er velkommen til at fjerne løse genstande og personlige ejendele fra kabinen. Sørg blot for at bilen er tilgængelig og at der er fri plads rundt om den.",en:"It's not necessary, but you're welcome to remove loose items and personal belongings from the cabin. Just make sure the car is accessible and there's clear space around it."}},
  {q:{da:"Kan I vaske elbiler og hybridbiler?",en:"Can you wash electric and hybrid cars?"},a:{da:"Ja, vi vasker alle typer elbiler og hybridbiler. Dampvask er faktisk ideel til elbiler – vi bruger minimalt vand og ingen aggressive kemikalier, der kan påvirke tætninger og elektronik.",en:"Yes, we wash all types of electric and hybrid cars. Steam washing is actually ideal for EVs – we use minimal water and no aggressive chemicals that could affect seals and electronics."}},
  {q:{da:"Hvad er forskellen på udvendig, indvendig og hel vask?",en:"What is the difference between exterior, interior and full wash?"},a:{da:"Udvendig vask dækker karosseri, ruder, fælge og dæk. Indvendig vask dækker sæder, gulvmåtter, instrumentbræt, dørpaneler og ruder indefra. Hel vask er kombinationen af begge og er den mest populære løsning.",en:"Exterior wash covers bodywork, windows, rims and tyres. Interior wash covers seats, floor mats, dashboard, door panels and windows from inside. Full wash is the combination of both and is our most popular option."}},
  {q:{da:"Hvad sker der, hvis det regner på min bookingdag?",en:"What happens if it rains on my booking day?"},a:{da:"Vi kontakter dig dagen inden og tilbyder enten at fortsætte (let regn er sjældent et problem indendørs eller under overdækning) eller at ombooke til nærmeste ledige tid uden ekstra gebyr.",en:"We contact you the day before and offer either to continue (light rain is rarely a problem indoors or under cover) or to rebook to the nearest available time at no extra charge."}},
  {q:{da:"Bruger I kemikalier, der kan skade lakken?",en:"Do you use chemicals that can damage the paintwork?"},a:{da:"Nej. Vi bruger miljøvenlige rengøringsmidler, der er testet til brug på biloverflader. Dampvasken kræver desuden langt færre kemikalier end traditionel bilvask.",en:"No. We use eco-friendly cleaning agents tested for use on car surfaces. Steam washing also requires far fewer chemicals than traditional car washing."}},
  {q:{da:"Kan I vaske bilen, selvom den er meget beskidt eller fuld af dyrehår?",en:"Can you wash the car even if it is very dirty or full of pet hair?"},a:{da:"Ja. Vi er vant til biler i alle tilstande – fra leasingbiler klar til aflevering til familievogne med sæsoners ophobede snavs og kæledyrhår.",en:"Yes. We are used to cars in all conditions – from lease cars ready for return to family vehicles with seasons of accumulated dirt and pet hair."}},
  {q:{da:"Tilbyder I erhvervsaftaler til virksomheder med flåder?",en:"Do you offer business agreements for companies with fleets?"},a:{da:"Ja, vi laver aftaler med virksomheder, der har behov for regelmæssig vask af firmabiler, varevogne eller hele flåder. Kontakt os på info@elite-vask.dk for et tilbud tilpasset jeres behov.",en:"Yes, we make agreements with companies that need regular washing of company cars, vans or entire fleets. Contact us at info@elite-vask.dk for a quote tailored to your needs."}},
  {q:{da:"Hvad er jeres aflysningspolitik?",en:"What is your cancellation policy?"},a:{da:"Du kan aflyse eller ombooke gratis op til 24 timer inden din booking. Ved aflysning kortere end 24 timer forbeholder vi os retten til at opkræve et aflysningsgebyr på 150 kr.",en:"You can cancel or rebook for free up to 24 hours before your booking. For cancellations less than 24 hours in advance, we reserve the right to charge a cancellation fee of 150 kr."}},
  {q:{da:"Rengør I sæder af læder og stof forskelligt?",en:"Do you clean leather and fabric seats differently?"},a:{da:"Ja. Læder behandles med skånsom rengøring og afsluttes med en fugtighedscreme. Stofbeklædning damprenses, hvilket løsner snavs, fjerner lugt og dræber bakterier.",en:"Yes. Leather is treated with gentle cleaning and finished with a moisturising cream. Fabric upholstery is steam cleaned, which loosens dirt, removes odours and kills bacteria."}},
];

const DEFAULT_EXTRAS = [
  {id:"motor", name:{da:"Motorrens",en:"Engine clean"}, price:400, desc:{da:"Grundig afrensning af motorrum",en:"Thorough engine bay cleaning"}},
  {id:"lak",   name:{da:"Lak & glansbeskyttelse",en:"Paint & gloss protection"}, price:300, desc:{da:"Udvendig – langvarig ekstra glans",en:"Exterior – long-lasting gloss"}},
  {id:"pleje", name:{da:"Indvendig pleje & beskyttelse",en:"Interior care & protection"}, price:200, desc:{da:"Beskytter og fornyer interiøret",en:"Protects and renews the interior"}},
  {id:"haar",  name:{da:"Fjernelse af dyrehår",en:"Pet hair removal"}, price:300, desc:{da:"Effektiv fjernelse af hår og fnug",en:"Effective removal of hair and lint"}},
  {id:"saede", name:{da:"Sæderens (stof)",en:"Seat clean (fabric)"}, price:400, desc:{da:"Dybderens af stofsæder",en:"Deep clean of fabric seats"}},
  {id:"barnesaede", name:{da:"Barnesæde rens",en:"Child seat cleaning"}, price:100, desc:{da:"Grundig og sikker rengøring",en:"Thorough and safe cleaning"}},
];

const MONTHS =["jan","feb","mar","apr","maj","jun","jul","aug","sep","okt","nov","dec"];
const FULL_MONTHS = ["januar","februar","marts","april","maj","juni","juli","august","september","oktober","november","december"];
const DAYS = ["Man","Tir","Ons","Tor","Fre","Lør","Søn"];

function getWeekStart(offset) {
  const d = new Date();
  const day = d.getDay();
  const diff = (day === 0 ? -6 : 1 - day);
  d.setDate(d.getDate() + diff + offset * 7);
  d.setHours(0,0,0,0);
  return d;
}

function toISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getWeekNumber(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(),0,1));
  return Math.ceil((((date - yearStart) / 86400000) + 1)/7);
}
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
      if (r.ok) { onDelete(b.token); setState("idle"); }
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

function Feedback({ m }) {
  if (!m) return null;
  const ok = m.type === "ok";
  return (
    <div style={{ marginTop:12, display:"flex", alignItems:"center", gap:8, background:ok?T.accentDim:T.dangerDim, border:`1px solid ${ok?T.accentBorder:T.dangerBorder}`, borderRadius:8, padding:"10px 14px", fontSize:13, color:ok?T.accent:T.danger }}>
      {ok
        ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/></svg>}
      {m.text}
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
  const [weekOffset, setWeekOffset]       = useState(0);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [modalState, setModalState]       = useState("idle");

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
  const [nowTime, setNowTime]             = useState(() => new Date());

  // CMS state — FAQ, Priser, Ekstra
  const [faqItems, setFaqItems]           = useState([]);
  const [extrasItems, setExtrasItems]     = useState([]);
  const [pricesData, setPricesData]       = useState({});
  const [faqNewQda, setFaqNewQda]         = useState("");
  const [faqNewQen, setFaqNewQen]         = useState("");
  const [faqNewAda, setFaqNewAda]         = useState("");
  const [faqNewAen, setFaqNewAen]         = useState("");
  const [extNewNameDa, setExtNewNameDa]   = useState("");
  const [extNewNameEn, setExtNewNameEn]   = useState("");
  const [extNewDescDa, setExtNewDescDa]   = useState("");
  const [extNewDescEn, setExtNewDescEn]   = useState("");
  const [extNewPrice, setExtNewPrice]     = useState("");
  const [priceEdits, setPriceEdits]       = useState({});
  const [editingExt, setEditingExt]       = useState(null);
  const [editingGallery, setEditingGallery] = useState(null);
  const [expandedFaqId, setExpandedFaqId] = useState(null);
  const [faqDrafts, setFaqDrafts]         = useState({});
  const [addFaqOpen, setAddFaqOpen]       = useState(false);
  const [cmsLoading, setCmsLoading]       = useState(false);
  const [cmsMsg, setCmsMsg]               = useState(null);
  const [pricesFromDefault, setPricesFromDefault] = useState(false);
  const [albumInput, setAlbumInput]               = useState("Enkelt");
  const [galleryAlbum, setGalleryAlbum]           = useState("alle");

  const fileRef = useRef();
  const todayColRef = useRef();
  const calScrollRef = useRef();

  useEffect(() => {
    const check = () => setNarrow(window.innerWidth < 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Update current time every 10 seconds — only when bookings tab is active
  useEffect(() => {
    if (tab !== "bookings") return;
    const id = setInterval(() => setNowTime(new Date()), 10000);
    return () => clearInterval(id);
  }, [tab]);

  // Auto-scroll calendar to today column on mobile
  useEffect(() => {
    if (tab === "bookings" && narrow && calScrollRef.current && todayColRef.current) {
      const container = calScrollRef.current;
      const col = todayColRef.current;
      const offset = col.offsetLeft - container.offsetWidth / 2 + col.offsetWidth / 2;
      container.scrollLeft = Math.max(0, offset);
    }
  }, [tab, narrow, authed]);

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
    if (type === "gallery")  setGallery(data.items || []);
    else if (type === "videos")  setVideos(data.items || []);
    else if (type === "faq")     setFaqItems(data.items || []);
    else if (type === "extras")  setExtrasItems(data.items || []);
    else if (type === "packages") {
      const hasPrices = data.prices && Object.keys(data.prices).length > 0;
      const prices = hasPrices ? data.prices : DEFAULT_PRICES;
      setPricesData(prices);
      setPriceEdits(prices);
      setPricesFromDefault(!hasPrices);
    }
  }

  useEffect(() => {
    if (authed && (tab === "gallery" || tab === "videos")) fetchContent(tab);
    if (authed && tab === "faq")      fetchContent("faq");
    if (authed && tab === "extras")   fetchContent("extras");
    if (authed && tab === "priser")   fetchContent("packages");
  }, [authed, tab]);

  async function addUrl(type) {
    if (!urlInput.trim()) return;
    setCLoading(true); setMsg(null);
    const res = await fetch("/api/admin/content", {
      method:"POST",
      headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
      body: JSON.stringify({ type, url:urlInput.trim(), caption:captionInput, title:captionInput, album: type === "gallery" ? albumInput : undefined }),
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
    form.append("file", file); form.append("type", type); form.append("caption", captionInput); if (type === "gallery" && albumInput) form.append("album", albumInput);
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
      <button onClick={() => { setTab(id); setMsg(null); setUrlInput(""); setCmsMsg(null); setExpandedFaqId(null); setFaqDrafts({}); setAddFaqOpen(false); setEditingExt(null); setEditingGallery(null); }}
        style={{ display:"flex", alignItems:"center", gap:8, width:"100%", padding:"7px 9px", borderRadius:7, fontSize:13, fontWeight:active?600:400, color:active?T.accent:T.t3, background:active?T.accentDim:"transparent", border:"none", cursor:"pointer", fontFamily:FF, textAlign:"left", transition:"all .12s", marginBottom:1 }}>
        <span style={{ opacity: active ? 1 : 0.7, display:"flex" }}>{icon}</span>
        <span style={{ flex:1 }}>{label}</span>
        {badge != null && <span style={{ fontSize:10, fontWeight:700, background:active?"rgba(55,210,120,.25)":"rgba(255,255,255,.06)", color:active?T.accent:T.t4, borderRadius:10, padding:"1px 6px", minWidth:16, textAlign:"center" }}>{badge}</span>}
      </button>
    );
  };

  const sectionLabel = (text) => (
    <p style={{ fontSize:9.5, letterSpacing:1.5, fontWeight:600, color:T.t4, textTransform:"uppercase", margin:"0 0 4px", padding:"0 9px" }}>{text}</p>
  );


  const icons = {
    bookings: <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2.5"/><path d="M16 2v4M8 2v4"/><path d="M3 10h18"/></svg>,
    gallery:  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2.5"/><path d="M3 16l5-5 4 4 3-3 6 6"/><circle cx="8.5" cy="8.5" r="1.5"/></svg>,
    videos:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="6" width="14" height="12" rx="2.5"/><path d="M16 10l5-3v10l-5-3V10z"/></svg>,
    faq:      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    priser:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>,
    extras:   <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
    refresh:  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 11-9-9c2.52 0 4.8.99 6.48 2.59L21 8"/><path d="M21 3v5h-5"/></svg>,
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
            {sectionLabel("CMS")}
            {navItem("faq",    "FAQ",    icons.faq,    faqItems.length   || undefined)}
            {navItem("priser", "Priser", icons.priser)}
            {navItem("extras", "Ekstra", icons.extras, extrasItems.length || undefined)}
            <div style={{ height:1, background:T.border, margin:"14px 4px" }}/>
            <p style={{ fontSize:11, color:T.t4, padding:"0 10px", margin:0 }}>Session aktiv</p>
          </aside>
        ) : (
          <div style={{ display:"flex", gap:8, padding:"16px 16px 0", overflowX:"auto" }}>
            {[["bookings","Bookinger",icons.bookings],["gallery","Galleri",icons.gallery],["videos","Videoer",icons.videos],["faq","FAQ",icons.faq],["priser","Priser",icons.priser],["extras","Ekstra",icons.extras]].map(([id,label,icon]) => (
              <button key={id} onClick={() => { setTab(id); setMsg(null); setUrlInput(""); setCmsMsg(null); setExpandedFaqId(null); setFaqDrafts({}); setAddFaqOpen(false); setEditingExt(null); setEditingGallery(null); }}
                style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", borderRadius:8, border:`1px solid ${tab===id?T.accentBorder:T.border}`, background:tab===id?T.accentDim:"transparent", color:tab===id?T.accent:T.t3, fontSize:13, fontWeight:600, cursor:"pointer", fontFamily:FF, whiteSpace:"nowrap" }}>
                {icon}{label}
              </button>
            ))}
          </div>
        )}

        {/* MAIN CONTENT */}
        <main style={{ padding: narrow ? "16px 12px" : "28px 28px", boxSizing:"border-box", minWidth:0, overflow:"hidden" }}>

          {/* Page title + badge */}
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:28 }}>
            <h1 style={{ fontSize:22, fontWeight:800, color:T.t1, margin:0, letterSpacing:"-.3px" }}>
              {tab === "bookings" ? "Bookinger" : tab === "gallery" ? "Galleri" : tab === "videos" ? "Videoer" : tab === "faq" ? "FAQ" : tab === "priser" ? "Priser" : "Ekstra ydelser"}
            </h1>
            <span style={{ background:T.accentDim, color:T.accent, borderRadius:20, padding:"3px 12px", fontSize:12, fontWeight:700 }}>
              {tab === "bookings" ? `${activeBookings} aktive` : tab === "gallery" ? `${gallery.length} ${gallery.length===1?"billede":"billeder"}` : tab === "videos" ? `${videos.length} ${videos.length===1?"video":"videoer"}` : tab === "faq" ? `${faqItems.length} spørgsmål` : tab === "priser" ? "Prismatrix" : `${extrasItems.length} ydelser`}
            </span>
          </div>

          {/* ── BOOKINGS WEEKLY CALENDAR ── */}
          {tab === "bookings" && (() => {
            const weekStart = getWeekStart(weekOffset);
            const weekDays = Array.from({length:7}, (_,i) => {
              const d = new Date(weekStart);
              d.setDate(weekStart.getDate() + i);
              return d;
            });
            const todayISO = toISO(new Date());
            const weekISOs = weekDays.map(toISO);
            const weekNum = getWeekNumber(weekStart);
            const weekEnd = weekDays[6];
            const sM = FULL_MONTHS[weekStart.getMonth()];
            const eM = FULL_MONTHS[weekEnd.getMonth()];
            const dateRange = sM === eM
              ? `${weekStart.getDate()}–${weekEnd.getDate()} ${sM}`
              : `${weekStart.getDate()} ${sM} – ${weekEnd.getDate()} ${eM}`;
            const weekLabel = { num: weekNum, range: dateRange, year: weekStart.getFullYear() };

            const weekBookings = bookings.filter(b => weekISOs.includes(b.date));
            const activeThisWeek = weekBookings.filter(b => b.status !== "cancelled").length;
            const totalActive = bookings.filter(b => b.status !== "cancelled").length;

            // 08:00 → 20:00 = 13 hours
            const HOURS = Array.from({length:13}, (_,i) => i + 8);
            const ROW_H = 52;
            const COL_W = narrow ? 120 : 140;
            const TIME_W = 52;

            function slotCount(b) {
              if (b.slotsNeeded) return b.slotsNeeded;
              const p = (b.pkg||"").toLowerCase();
              if (p.includes("stor") || p.includes("varebil")) return 4;
              if (p.includes("mellem")) return 3;
              return 2;
            }

            function bookingStartHour(b) {
              if (!b.time) return null;
              const [h] = b.time.split(":").map(Number);
              return h;
            }

            const navBtn = (onClick, children, active) => (
              <button onClick={onClick} style={{ display:"flex", alignItems:"center", gap:6, padding:"8px 16px", background:active?T.accentDim:T.bg1, color:active?T.accent:T.t2, border:`1px solid ${active?T.accentBorder:T.border}`, borderRadius:9, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:FF, whiteSpace:"nowrap" }}>
                {children}
              </button>
            );

            return (
              <>
                {bLoading && <div style={{ textAlign:"center", color:T.t3, padding:"60px 0", fontSize:14 }}>Indlæser…</div>}
                {bError && (
                  <div style={{ display:"flex", alignItems:"center", gap:8, background:T.dangerDim, border:`1px solid ${T.dangerBorder}`, borderRadius:8, padding:"12px 16px", fontSize:13, color:T.danger, marginBottom:16 }}>
                    {bError}
                  </div>
                )}

                {!bLoading && !bError && (
                  <>
                    {/* Wrapper so toolbar and calendar share the same width */}
                    <div style={{ width: "100%", maxWidth:"100%" }}>
                    {/* Week nav toolbar */}
                    <div style={{ display:"flex", alignItems:"center", gap: narrow ? 8 : 12, marginBottom:16, background:T.bg1, border:`1px solid rgba(255,255,255,.1)`, borderRadius:14, padding: narrow ? "10px 12px" : "12px 18px", boxShadow:"0 0 0 1px rgba(55,210,120,.06), 0 4px 24px rgba(0,0,0,.5)", minWidth:0, overflow:"hidden" }}>

                      {/* Prev / Today / Next */}
                      <div style={{ display:"flex", gap:4, flexShrink:0 }}>
                        <button onClick={() => setWeekOffset(w=>w-1)}
                          style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,.05)", color:T.t1, border:`1px solid rgba(255,255,255,.09)`, borderRadius:8, cursor:"pointer", fontFamily:FF }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button onClick={() => setWeekOffset(0)}
                          style={{ height:32, padding:"0 12px", background: weekOffset===0 ? T.accent : "rgba(255,255,255,.05)", color: weekOffset===0 ? T.bg0 : T.t1, border: weekOffset===0 ? "none" : `1px solid rgba(255,255,255,.09)`, borderRadius:8, cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:FF, boxShadow: weekOffset===0 ? `0 0 12px rgba(55,210,120,.35)` : "none", whiteSpace:"nowrap" }}>
                          I dag
                        </button>
                        <button onClick={() => setWeekOffset(w=>w+1)}
                          style={{ width:32, height:32, display:"flex", alignItems:"center", justifyContent:"center", background:"rgba(255,255,255,.05)", color:T.t1, border:`1px solid rgba(255,255,255,.09)`, borderRadius:8, cursor:"pointer", fontFamily:FF }}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                      </div>

                      {/* Week label */}
                      <div style={{ display:"flex", alignItems:"center", gap: narrow ? 6 : 10, flex:1, minWidth:0, overflow:"hidden" }}>
                        <span style={{ fontSize: narrow ? 13 : 17, fontWeight:800, color:T.t1, letterSpacing:"-.4px", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>{weekLabel.range}</span>
                        {!narrow && <span style={{ fontSize:13, color:T.t3, fontWeight:500, flexShrink:0 }}>{weekLabel.year}</span>}
                        <span style={{ fontSize:11, color:T.accent, background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:6, padding:"2px 7px", fontWeight:700, letterSpacing:".3px", whiteSpace:"nowrap", flexShrink:0 }}>U{weekLabel.num}</span>
                      </div>

                      {/* Stats */}
                      <div style={{ display:"flex", gap:6, alignItems:"center", flexShrink:0 }}>
                        {activeThisWeek > 0 && !narrow && (
                          <div style={{ display:"flex", alignItems:"center", gap:5, fontSize:12, fontWeight:700, color:T.accent, background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:8, padding:"5px 11px", whiteSpace:"nowrap" }}>
                            <span style={{ width:6, height:6, borderRadius:"50%", background:T.accent, display:"inline-block", boxShadow:`0 0 8px ${T.accent}` }}/>
                            {activeThisWeek} denne uge
                          </div>
                        )}
                        <div style={{ fontSize:12, color:T.t2, background:"rgba(255,255,255,.05)", border:`1px solid rgba(255,255,255,.09)`, borderRadius:8, padding:"5px 10px", fontWeight:600, whiteSpace:"nowrap" }}>
                          {narrow ? activeThisWeek > 0 ? `${activeThisWeek}/${totalActive}` : `${totalActive}` : `${totalActive} i alt`}
                        </div>
                      </div>
                    </div>

                    {/* Calendar */}
                    <div ref={calScrollRef} style={{ overflowX:"auto", borderRadius:14, border:`1px solid rgba(255,255,255,.1)`, background:T.bg1, boxShadow:"0 0 0 1px rgba(55,210,120,.06), 0 4px 24px rgba(0,0,0,.5)", width:"100%" }}>
                      <div style={{ minWidth: TIME_W + COL_W * 7, width:"100%", position:"relative" }}>

                        {/* Day headers */}
                        <div style={{ display:"flex", borderBottom:`1px solid ${T.border}`, background:T.bg0 }}>
                          <div style={{ width:TIME_W, flexShrink:0, borderRight:`1px solid ${T.border}` }}/>
                          {weekDays.map((d, i) => {
                            const iso = toISO(d);
                            const isToday = iso === todayISO;
                            const dayBookings = bookings.filter(b => b.date === iso && b.status !== "cancelled");
                            const isWeekend = i >= 5;
                            return (
                              <div key={i} ref={isToday ? todayColRef : null} style={{ flex:1, minWidth:COL_W, textAlign:"center", padding:"10px 6px 8px", background:isToday?"rgba(55,210,120,.06)":isWeekend?"rgba(255,255,255,.015)":"transparent", borderRight: i<6 ? `1px solid ${T.border}` : "none" }}>
                                <div style={{ fontSize:10, fontWeight:600, color:isToday?T.accent:isWeekend?"rgba(255,255,255,.2)":T.t4, textTransform:"uppercase", letterSpacing:1, marginBottom:6 }}>{DAYS[i]}</div>
                                {/* Date circle — filled for today */}
                                <div style={{ display:"inline-flex", alignItems:"center", justifyContent:"center", width:32, height:32, borderRadius:"50%", background:isToday?T.accent:"transparent", marginBottom:4 }}>
                                  <span style={{ fontSize:16, fontWeight:700, color:isToday?T.bg0:isWeekend?"rgba(255,255,255,.35)":T.t1, lineHeight:1 }}>{d.getDate()}</span>
                                </div>
                                {/* Today pulse dot + booking dots */}
                                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:3, marginTop:3, minHeight:10 }}>
                                  {isToday && (
                                    <span style={{ position:"relative", display:"inline-flex", alignItems:"center", justifyContent:"center" }}>
                                      <span style={{ width:7, height:7, borderRadius:"50%", background:T.accent, display:"block", position:"relative", zIndex:1 }}/>
                                      <span style={{ position:"absolute", width:13, height:13, borderRadius:"50%", background:"rgba(55,210,120,.25)", animation:"calPulse 1.8s ease-out infinite" }}/>
                                    </span>
                                  )}
                                  {dayBookings.slice(0, isToday ? 3 : 4).map((_,di) => (
                                    <span key={di} style={{ width:5, height:5, borderRadius:"50%", background:T.blue, flexShrink:0, opacity:.7 }}/>
                                  ))}
                                  {dayBookings.length > (isToday ? 3 : 4) && <span style={{ fontSize:9, color:T.blue, fontWeight:700 }}>+{dayBookings.length-(isToday?3:4)}</span>}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Current time line — only shown when this week is visible */}
                        {weekOffset === 0 && (() => {
                          const nowH = nowTime.getHours();
                          const nowM = nowTime.getMinutes();
                          const nowS = nowTime.getSeconds();
                          if (nowH < 8 || nowH >= 21) return null;
                          // Header height ~67px, each row ROW_H px
                          const HEADER_H = 67;
                          const topPx = HEADER_H + (nowH - 8) * ROW_H + ((nowM * 60 + nowS) / 3600) * ROW_H;
                          const todayIdx = weekDays.findIndex(d => toISO(d) === todayISO);
                          const leftPx = TIME_W + todayIdx * COL_W;
                          return (
                            <div style={{ position:"absolute", top:topPx, left:0, right:0, zIndex:10, pointerEvents:"none", display:"flex", alignItems:"center" }}>
                              {/* dot on time label */}
                              <div style={{ width:TIME_W, display:"flex", justifyContent:"flex-end", paddingRight:6 }}>
                                <div style={{ width:9, height:9, borderRadius:"50%", background:"#e5534b", boxShadow:"0 0 0 3px rgba(229,83,75,.25)" }}/>
                              </div>
                              {/* line across all columns */}
                              <div style={{ flex:1, height:2, background:"rgba(229,83,75,.7)", boxShadow:"0 0 6px rgba(229,83,75,.4)" }}/>
                            </div>
                          );
                        })()}

                        {/* Time rows */}
                        {HOURS.map((hour, hi) => {
                          const isLast = hi === HOURS.length - 1;
                          const nowH = nowTime.getHours();
                          const isPast = weekOffset < 0 || (weekOffset === 0 && hour < nowH);
                          const isCurrentHour = weekOffset === 0 && hour === nowH;
                          return (
                            <div key={hour} style={{ display:"flex", borderBottom: isLast?"none":`1px solid ${T.border}`, minHeight:ROW_H, position:"relative", background: isPast ? "rgba(0,0,0,.12)" : "transparent" }}>
                              {/* Time label */}
                              <div style={{ width:TIME_W, flexShrink:0, borderRight:`1px solid ${T.border}`, padding:"6px 8px 0", textAlign:"right", paddingTop:8 }}>
                                <span style={{ fontSize:11, color:isCurrentHour?"#e5534b":isPast?T.t4:T.t3, fontWeight:isCurrentHour?700:500, fontVariantNumeric:"tabular-nums" }}>
                                  {String(hour).padStart(2,"0")}:00
                                </span>
                              </div>

                              {/* Day cells */}
                              {weekDays.map((d, di) => {
                                const iso = toISO(d);
                                const isToday = iso === todayISO;
                                const startingHere = bookings.filter(b => b.date === iso && bookingStartHour(b) === hour);
                                return (
                                  <div key={di} style={{ flex:1, minWidth:COL_W, borderRight: di<6 ? `1px solid ${T.border}` : "none", padding:"3px 4px", background:isToday?"rgba(55,210,120,.025)":"transparent", position:"relative", minHeight:ROW_H, display:"flex", flexDirection:"column", gap:3 }}>
                                    {startingHere.map(b => {
                                      const slots = slotCount(b);
                                      const durationMin = slots * 30;
                                      const heightPx = Math.round((durationMin / 60) * ROW_H) - 6;
                                      const isCancelled = b.status === "cancelled";
                                      const isPending   = b.status === "pending";
                                      const isCompleted = b.status === "completed";

                                      // confirmed/completed = blue, cancelled = amber, pending = grey
                                      const cardBg   = isCancelled ? T.amberDim  : isPending ? "rgba(255,255,255,.05)" : T.blueDim;
                                      const cardBor  = isCancelled ? T.amberBorder : isPending ? "rgba(255,255,255,.12)" : T.blueBorder;
                                      const cardLeft = isCancelled ? T.amber      : isPending ? T.t3                   : T.blue;
                                      const cardText = isCancelled ? T.amber      : isPending ? T.t2                   : T.blue;

                                      return (
                                        <div key={b.token}
                                          onClick={() => { setSelectedBooking(b); setModalState("idle"); }}
                                          style={{ background:cardBg, border:`1px solid ${cardBor}`, borderLeft:`3px solid ${cardLeft}`, borderRadius:8, padding:"6px 8px", cursor:"pointer", height:heightPx, minHeight:42, boxSizing:"border-box", display:"flex", flexDirection:"column", justifyContent:"space-between", overflow:"hidden", transition:"filter .15s, transform .1s", opacity:isCancelled?.55:1, WebkitTapHighlightColor:"transparent" }}
                                          onMouseEnter={e => { e.currentTarget.style.filter="brightness(1.2)"; e.currentTarget.style.transform="scale(1.01)"; }}
                                          onMouseLeave={e => { e.currentTarget.style.filter=""; e.currentTarget.style.transform=""; }}
                                        >
                                          <div>
                                            <div style={{ display:"flex", alignItems:"center", gap:4, marginBottom:2 }}>
                                              {isCancelled
                                                ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={cardText} strokeWidth="3" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                                                : <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={cardText} strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                                              <span style={{ fontSize:12, fontWeight:800, color:cardText, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", flex:1 }}>{b.name || "Ukendt"}</span>
                                            </div>
                                            <div style={{ fontSize:10, color:cardText, opacity:.75, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{b.pkg || "-"}</div>
                                          </div>
                                          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                                            <span style={{ fontSize:10, fontWeight:700, color:cardText }}>{b.time} · {durationMin}min</span>
                                            {b.phone && (
                                              <a href={`tel:${b.phone}`} onClick={e => e.stopPropagation()}
                                                style={{ display:"flex", alignItems:"center", justifyContent:"center", width:22, height:22, borderRadius:6, background:"rgba(255,255,255,.12)", color:cardText, textDecoration:"none", flexShrink:0 }}>
                                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.15 1.28 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                                              </a>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                );
                              })}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {bookings.length === 0 && !bLoading && (
                      <div style={{ textAlign:"center", padding:"60px 0" }}>
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke={T.t4} strokeWidth="1.5" strokeLinecap="round" style={{ marginBottom:16, opacity:.4 }}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                        <p style={{ fontSize:16, fontWeight:700, color:T.t2, margin:"0 0 6px" }}>Ingen bookinger endnu</p>
                        <p style={{ fontSize:13, color:T.t3, margin:0 }}>Nye bookinger vises automatisk her</p>
                      </div>
                    )}
                    </div>{/* end wrapper */}
                  </>
                )}
              </>
            );
          })()}

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
                <select value={albumInput} onChange={e => setAlbumInput(e.target.value)}
                  style={{ width:"100%", padding:"11px 14px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:14, outline:"none", fontFamily:FF, marginTop:8, boxSizing:"border-box", cursor:"pointer" }}>
                  <option value="Enkelt">Enkelt billede</option>
                  <option value="Før & Efter">Før & Efter</option>
                </select>
                <Feedback m={msg} />
              </div>

              {gallery.length > 0 && (
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:12 }}>
                  <span style={{ fontSize:11, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase" }}>Billeder i galleriet</span>
                  <span style={{ background:T.bg2, color:T.t3, borderRadius:20, padding:"2px 9px", fontSize:12 }}>{gallery.length}</span>
                </div>
              )}

              {gallery.length > 0 ? (() => {
                const beKeywords = /f\xf8r|efter|before|after/i;
                const categorized = gallery.map(i => ({...i, _cat:(i.album==="F\xf8r & Efter"||beKeywords.test(i.caption||"")||beKeywords.test(i.album||""))?"F\xf8r & Efter":"Enkelt"}));
                const beforeAfter = categorized.filter(i => i._cat==="F\xf8r & Efter");
                const enkelt = categorized.filter(i => i._cat==="Enkelt");
                const filteredGallery = galleryAlbum==="alle" ? categorized : galleryAlbum==="F\xf8r & Efter" ? beforeAfter : enkelt;
                const catTabs = ["alle","F\xf8r & Efter","Enkelt"];
                return (
                  <>
                    <div style={{ display:"flex", gap:6, flexWrap:"wrap", marginBottom:16 }}>
                      {catTabs.map(alb => {
                        const count = alb==="alle" ? gallery.length : alb==="F\xf8r & Efter" ? beforeAfter.length : enkelt.length;
                        const active = galleryAlbum===alb;
                        return (
                          <button key={alb} onClick={() => setGalleryAlbum(alb)}
                            style={{ padding:"6px 14px", borderRadius:20, border:`1px solid ${active?T.accentBorder:T.border}`, background:active?T.accentDim:"transparent", color:active?T.accent:T.t3, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FF }}>
                            {alb==="alle" ? `Alle (${count})` : `${alb} (${count})`}
                          </button>
                        );
                      })}
                    </div>
                    <div style={{ display:"grid", gridTemplateColumns:`repeat(auto-fill, minmax(${narrow?"160px":"220px"},1fr))`, gap:14 }}>
                      {filteredGallery.map(item => {
                  const isEditingThis = editingGallery?.id === item.id;
                  const isBE = item._cat==="F\xf8r & Efter";
                  return (
                    <div key={item.id}
                      style={{ borderRadius:12, overflow:"hidden", background:T.bg1, border:`1px solid ${hoveredId===item.id?T.accentBorder:T.border}`, boxShadow:hoveredId===item.id?T.shadowL:T.shadow, transition:"border .2s, box-shadow .2s, transform .15s", transform:hoveredId===item.id?"translateY(-2px)":"none", display:"flex", flexDirection:"column" }}
                      onMouseEnter={() => setHoveredId(item.id)}
                      onMouseLeave={() => setHoveredId(null)}
                    >
                      {/* Image */}
                      <div style={{ position:"relative", overflow:"hidden" }}>
                        <img src={item.url} alt={item.caption||""} style={{ width:"100%", aspectRatio:"4/3", objectFit:"cover", display:"block", cursor:"pointer" }} onClick={() => setPreviewItem(item)} />
                        <span style={{ position:"absolute", top:8, left:8, fontSize:10, fontWeight:700, color:T.bg0, background:isBE?T.gold:T.accent, borderRadius:4, padding:"2px 7px", letterSpacing:.3 }}>{item._cat}</span>
                      </div>

                      {/* Inline edit form */}
                      {isEditingThis ? (
                        <div style={{ padding:"12px 12px 10px", display:"flex", flexDirection:"column", gap:8 }}>
                          <input
                            value={editingGallery.caption}
                            onChange={e => setEditingGallery(d => ({...d, caption:e.target.value}))}
                            placeholder="Billedtekst…"
                            style={{ width:"100%", padding:"8px 10px", borderRadius:7, border:`1px solid ${T.accentBorder}`, background:T.bg0, color:T.t1, fontSize:12, outline:"none", fontFamily:FF, boxSizing:"border-box" }}
                          />
                          <select
                            value={editingGallery.album}
                            onChange={e => setEditingGallery(d => ({...d, album:e.target.value}))}
                            style={{ width:"100%", padding:"8px 10px", borderRadius:7, border:`1px solid ${T.border}`, background:T.bg0, color:editingGallery.album?T.t1:T.t4, fontSize:12, outline:"none", fontFamily:FF, cursor:"pointer" }}
                          >
                            <option value="Enkelt">Enkelt billede</option>
                            <option value="F\xf8r & Efter">F\xf8r &amp; Efter</option>
                          </select>
                          <div style={{ display:"flex", gap:6 }}>
                            <button
                              onClick={async () => {
                                await fetch("/api/admin/content", {
                                  method:"PUT",
                                  headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
                                  body: JSON.stringify({ type:"gallery", id:item.id, item:{ caption:editingGallery.caption, album:editingGallery.album } }),
                                });
                                setEditingGallery(null);
                                fetchContent("gallery");
                              }}
                              style={{ flex:1, padding:"7px 0", background:T.accent, color:T.bg0, border:"none", borderRadius:7, fontWeight:700, fontSize:12, cursor:"pointer", fontFamily:FF }}
                            >Gem</button>
                            <button
                              onClick={() => setEditingGallery(null)}
                              style={{ flex:1, padding:"7px 0", background:"rgba(255,255,255,.06)", color:T.t3, border:"none", borderRadius:7, fontWeight:600, fontSize:12, cursor:"pointer", fontFamily:FF }}
                            >Annuller</button>
                          </div>
                        </div>
                      ) : (
                        /* Always-visible bottom bar */
                        <div style={{ padding:"8px 10px", display:"flex", gap:5, alignItems:"center", borderTop:`1px solid ${T.border}` }}>
                          {item.caption
                            ? <span style={{ flex:1, fontSize:11, color:T.t3, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap", minWidth:0 }}>{item.caption}</span>
                            : <span style={{ flex:1 }}/>}
                          <button
                            onClick={() => setPreviewItem(item)}
                            style={{ padding:"5px 9px", background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:6, color:T.accent, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:FF, whiteSpace:"nowrap" }}
                          >Vis</button>
                          <button
                            onClick={() => setEditingGallery({ id:item.id, caption:item.caption||"", album:item.album||"" })}
                            style={{ padding:"5px 9px", background:"rgba(255,255,255,.06)", border:`1px solid ${T.border}`, borderRadius:6, color:T.t2, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:FF, whiteSpace:"nowrap" }}
                          >✏</button>
                          <button
                            onClick={() => deleteItem("gallery", item.id, item.source==="upload"?item.url:null)}
                            style={{ padding:"5px 9px", background:T.dangerDim, border:`1px solid ${T.dangerBorder}`, borderRadius:6, color:T.danger, fontSize:11, fontWeight:600, cursor:"pointer", fontFamily:FF, whiteSpace:"nowrap" }}
                          >Slet</button>
                        </div>
                      )}
                    </div>
                  );
                })}
                    </div>
                  </>
                );
              })() : (
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

          {/* ── FAQ ── */}
          {tab === "faq" && (() => {
            function getDraft(item) {
              if (faqDrafts[item.id]) return faqDrafts[item.id];
              return { qDa:item.q?.da||item.q||"", qEn:item.q?.en||item.qEn||"", aDa:item.a?.da||item.a||"", aEn:item.a?.en||item.aEn||"" };
            }
            async function addFaq(e) {
              e.preventDefault();
              if (!faqNewQda.trim() || !faqNewAda.trim()) return;
              setCmsLoading(true); setCmsMsg(null);
              const res = await fetch("/api/admin/content", {
                method:"POST",
                headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
                body: JSON.stringify({ type:"faq", item:{ q:{da:faqNewQda.trim(), en:faqNewQen.trim()||faqNewQda.trim()}, a:{da:faqNewAda.trim(), en:faqNewAen.trim()||faqNewAda.trim()} } }),
              });
              const data = await res.json();
              setCmsLoading(false);
              if (data.ok) { setCmsMsg({ type:"ok", text:"Tilføjet!" }); setFaqNewQda(""); setFaqNewAda(""); setFaqNewQen(""); setFaqNewAen(""); setAddFaqOpen(false); fetchContent("faq"); }
              else setCmsMsg({ type:"err", text:"Fejl – prøv igen" });
            }
            async function saveFaqItem(id) {
              const item = faqItems.find(i => i.id === id);
              if (!item) return;
              const draft = getDraft(item);
              setCmsLoading(true); setCmsMsg(null);
              const res = await fetch("/api/admin/content", {
                method:"PUT",
                headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
                body: JSON.stringify({ type:"faq", id, item:{ q:{da:draft.qDa||"", en:draft.qEn||draft.qDa||""}, a:{da:draft.aDa||"", en:draft.aEn||draft.aDa||""} } }),
              });
              const data = await res.json();
              setCmsLoading(false);
              if (data.ok) { setCmsMsg({ type:"ok", text:"Gemt!" }); setExpandedFaqId(null); setFaqDrafts(d => { const n={...d}; delete n[id]; return n; }); fetchContent("faq"); }
              else setCmsMsg({ type:"err", text:"Fejl – prøv igen" });
            }
            async function deleteFaq(id) {
              if (!confirm("Slet dette FAQ-punkt?")) return;
              await fetch("/api/admin/content", { method:"DELETE", headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" }, body:JSON.stringify({ type:"faq", id }) });
              fetchContent("faq");
            }
            async function seedAllFaq() {
              setCmsLoading(true); setCmsMsg(null);
              // Delete existing items first to avoid duplicates
              for (const item of faqItems) {
                await fetch("/api/admin/content", { method:"DELETE", headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" }, body:JSON.stringify({ type:"faq", id:item.id }) });
              }
              for (const faq of DEFAULT_FAQ) {
                await fetch("/api/admin/content", { method:"POST", headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" }, body: JSON.stringify({ type:"faq", item:{ q:faq.q, a:faq.a } }) });
              }
              setCmsLoading(false); setCmsMsg({ type:"ok", text:"Alle standarddata gemt!" }); fetchContent("faq");
            }
            const txStyle = { width:"100%", padding:"9px 12px", borderRadius:7, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:13, outline:"none", fontFamily:FF, boxSizing:"border-box", resize:"vertical" };
            return (
              <>
                {/* ADD NEW — collapsible at top */}
                <div style={{ background:T.bg1, border:`1px solid ${addFaqOpen?T.accentBorder:T.border}`, borderRadius:12, marginBottom:16, overflow:"hidden", transition:"border .15s" }}>
                  <button type="button" onClick={() => setAddFaqOpen(o => !o)}
                    style={{ width:"100%", display:"flex", alignItems:"center", gap:10, padding:"14px 18px", background:"transparent", border:"none", cursor:"pointer", fontFamily:FF, textAlign:"left" }}>
                    <span style={{ width:24, height:24, borderRadius:6, background:addFaqOpen?T.accent:T.accentDim, border:`1px solid ${T.accentBorder}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, transition:"background .15s" }}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={addFaqOpen?T.bg0:T.accent} strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                    </span>
                    <span style={{ flex:1, fontSize:14, fontWeight:700, color:T.t1 }}>Tilføj nyt spørgsmål</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.t3} strokeWidth="2.5" strokeLinecap="round" style={{ transform:addFaqOpen?"rotate(180deg)":"none", transition:"transform .2s" }}><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {addFaqOpen && (
                    <div style={{ padding:"0 18px 18px", borderTop:`1px solid ${T.border}` }}>
                      <form onSubmit={addFaq} style={{ display:"flex", flexDirection:"column", gap:8, paddingTop:14 }}>
                        <div style={{ display:"grid", gridTemplateColumns:narrow?"1fr":"1fr 1fr", gap:8 }}>
                          <div>
                            <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Spørgsmål (DA) *</p>
                            <input value={faqNewQda} onChange={e=>setFaqNewQda(e.target.value)} placeholder="Spørgsmål på dansk…" style={{...txStyle, resize:"none"}} />
                          </div>
                          <div>
                            <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Question (EN)</p>
                            <input value={faqNewQen} onChange={e=>setFaqNewQen(e.target.value)} placeholder="Question in English…" style={{...txStyle, resize:"none"}} />
                          </div>
                          <div>
                            <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Svar (DA) *</p>
                            <textarea value={faqNewAda} onChange={e=>setFaqNewAda(e.target.value)} placeholder="Svar på dansk…" rows={3} style={txStyle} />
                          </div>
                          <div>
                            <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Answer (EN)</p>
                            <textarea value={faqNewAen} onChange={e=>setFaqNewAen(e.target.value)} placeholder="Answer in English…" rows={3} style={txStyle} />
                          </div>
                        </div>
                        <button type="submit" disabled={cmsLoading||!faqNewQda.trim()||!faqNewAda.trim()}
                          style={{ padding:"11px 0", background:T.accent, color:T.bg0, fontWeight:700, fontSize:14, borderRadius:8, border:"none", cursor:(cmsLoading||!faqNewQda.trim()||!faqNewAda.trim())?"not-allowed":"pointer", opacity:(cmsLoading||!faqNewQda.trim()||!faqNewAda.trim())?.4:1, fontFamily:FF }}>
                          {cmsLoading ? "…" : "Tilføj spørgsmål"}
                        </button>
                      </form>
                    </div>
                  )}
                </div>

                <Feedback m={cmsMsg} />

                {/* ACCORDION LIST */}
                {faqItems.length > 0 && faqItems.length < 5 && (
                  <div style={{ marginBottom:12, background:"rgba(245,166,35,.08)", border:"1px solid rgba(245,166,35,.35)", borderRadius:10, padding:"11px 16px", fontSize:13, color:"#f5a623", display:"flex", alignItems:"center", gap:8 }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span>Kun {faqItems.length} spørgsmål gemt — offentlig side viser standarddata indtil du har gemt mindst 5. Klik <strong>Gem alle standarddata</strong> nedenfor for at udfylde.</span>
                  </div>
                )}
                {faqItems.length > 0 ? (
                  <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                    {faqItems.map((item, idx) => {
                      const isOpen = expandedFaqId === item.id;
                      const draft = getDraft(item);
                      const titleDa = item.q?.da || item.q || "(intet spørgsmål)";
                      return (
                        <div key={item.id} style={{ background:T.bg1, border:`1px solid ${isOpen?T.accentBorder:T.border}`, borderRadius:11, overflow:"hidden", transition:"border .15s" }}>
                          <div style={{ display:"flex", alignItems:"center" }}>
                            <button onClick={() => setExpandedFaqId(isOpen ? null : item.id)}
                              style={{ flex:1, display:"flex", alignItems:"center", gap:10, padding:"13px 16px", background:"transparent", border:"none", cursor:"pointer", fontFamily:FF, textAlign:"left", minWidth:0 }}>
                              <span style={{ fontSize:11, fontWeight:700, color:isOpen?T.accent:T.t4, minWidth:22, flexShrink:0 }}>#{idx+1}</span>
                              <span style={{ flex:1, fontSize:14, fontWeight:isOpen?700:500, color:isOpen?T.t1:T.t2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{titleDa}</span>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={isOpen?T.accent:T.t4} strokeWidth="2.5" strokeLinecap="round" style={{ transform:isOpen?"rotate(180deg)":"none", transition:"transform .2s", flexShrink:0 }}><polyline points="6 9 12 15 18 9"/></svg>
                            </button>
                            <button onClick={() => deleteFaq(item.id)}
                              style={{ padding:"13px 14px", background:"transparent", border:"none", borderLeft:`1px solid ${T.border}`, cursor:"pointer", color:T.t4, display:"flex", alignItems:"center", flexShrink:0, transition:"color .15s" }}
                              onMouseEnter={e => e.currentTarget.style.color=T.danger}
                              onMouseLeave={e => e.currentTarget.style.color=T.t4}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg>
                            </button>
                          </div>
                          {isOpen && (
                            <div style={{ borderTop:`1px solid ${T.border}`, padding:"14px 16px", display:"flex", flexDirection:"column", gap:10 }}>
                              <div style={{ display:"grid", gridTemplateColumns:narrow?"1fr":"1fr 1fr", gap:8 }}>
                                <div>
                                  <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Spørgsmål (DA)</p>
                                  <input value={draft.qDa} onChange={e => setFaqDrafts(d => ({...d, [item.id]:{...getDraft(item), qDa:e.target.value}}))} style={{...txStyle, resize:"none"}} />
                                </div>
                                <div>
                                  <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Question (EN)</p>
                                  <input value={draft.qEn} onChange={e => setFaqDrafts(d => ({...d, [item.id]:{...getDraft(item), qEn:e.target.value}}))} style={{...txStyle, resize:"none"}} />
                                </div>
                                <div>
                                  <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Svar (DA)</p>
                                  <textarea value={draft.aDa} onChange={e => setFaqDrafts(d => ({...d, [item.id]:{...getDraft(item), aDa:e.target.value}}))} rows={4} style={txStyle} />
                                </div>
                                <div>
                                  <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Answer (EN)</p>
                                  <textarea value={draft.aEn} onChange={e => setFaqDrafts(d => ({...d, [item.id]:{...getDraft(item), aEn:e.target.value}}))} rows={4} style={txStyle} />
                                </div>
                              </div>
                              <div style={{ display:"flex", gap:8 }}>
                                <button onClick={() => saveFaqItem(item.id)} disabled={cmsLoading}
                                  style={{ flex:1, padding:"10px 0", background:T.accent, color:T.bg0, border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:FF }}>Gem ændringer</button>
                                <button onClick={() => { setExpandedFaqId(null); setFaqDrafts(d => { const n={...d}; delete n[item.id]; return n; }); }}
                                  style={{ flex:1, padding:"10px 0", background:"rgba(255,255,255,.06)", color:T.t3, border:"none", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:FF }}>Annuller</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : null}
                {faqItems.length > 0 && faqItems.length < 5 && (
                  <>
                    <button onClick={seedAllFaq} disabled={cmsLoading} style={{ marginTop:10, width:"100%", padding:"11px 0", background:T.accent, border:"none", borderRadius:9, color:T.bg0, fontWeight:700, fontSize:13, cursor:cmsLoading?"not-allowed":"pointer", fontFamily:FF }}>
                      {cmsLoading ? "Gemmer…" : "Gem alle standarddata (erstatter nuværende)"}
                    </button>
                    <p style={{ fontSize:11, color:T.t4, margin:"18px 0 8px", letterSpacing:1, fontWeight:700, textTransform:"uppercase" }}>Eller gem enkeltvis:</p>
                    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                      {DEFAULT_FAQ.map((faq, idx) => (
                        <div key={idx} style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:11, display:"flex", alignItems:"center", padding:"12px 16px", gap:10 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:T.t4, minWidth:22, flexShrink:0 }}>#{idx+1}</span>
                          <span style={{ flex:1, fontSize:14, color:T.t2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{faq.q.da}</span>
                          <button type="button" onClick={async () => { await fetch("/api/admin/content", { method:"POST", headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" }, body:JSON.stringify({ type:"faq", item:{ q:faq.q, a:faq.a } }) }); fetchContent("faq"); }}
                            style={{ padding:"5px 12px", background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:7, color:T.accent, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FF, whiteSpace:"nowrap", flexShrink:0 }}>+ Gem</button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {faqItems.length === 0 && (
                  <>
                    <div style={{ marginBottom:12, background:"rgba(55,210,120,.06)", border:`1px solid ${T.accentBorder}`, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
                      <span style={{ fontSize:13, color:T.accent, fontWeight:600 }}>Viser standarddata — gem enkeltvis eller alle på én gang</span>
                      <button onClick={seedAllFaq} disabled={cmsLoading}
                        style={{ padding:"8px 18px", background:T.accent, color:T.bg0, border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:cmsLoading?"not-allowed":"pointer", opacity:cmsLoading?.6:1, fontFamily:FF, whiteSpace:"nowrap" }}>
                        {cmsLoading ? "Gemmer…" : "Gem alle"}
                      </button>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                      {DEFAULT_FAQ.map((faq, idx) => (
                        <div key={idx} style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:11, display:"flex", alignItems:"center", padding:"12px 16px", gap:10 }}>
                          <span style={{ fontSize:11, fontWeight:700, color:T.t4, minWidth:22, flexShrink:0 }}>#{idx+1}</span>
                          <span style={{ flex:1, fontSize:14, color:T.t2, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{faq.q.da}</span>
                          <button onClick={async () => { await fetch("/api/admin/content", { method:"POST", headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" }, body:JSON.stringify({ type:"faq", item:{ q:faq.q, a:faq.a } }) }); fetchContent("faq"); }}
                            style={{ padding:"5px 12px", background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:7, color:T.accent, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FF, whiteSpace:"nowrap", flexShrink:0 }}>+ Gem</button>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </>
            );
          })()}

          {/* ── PRISER ── */}
          {tab === "priser" && (() => {
            const CARS = ["lille","mellem","stor","varebil"];
            const CAR_LABELS = { lille:"Lille bil", mellem:"Mellemstor bil", stor:"Stor bil / SUV", varebil:"Varebil" };
            const PKGS = ["hele","udv","indv","guld"];
            const PKG_LABELS = { hele:"Hele bilen", udv:"Udvendig", indv:"Indvendig", guld:"Guld pakke" };

            async function savePrices() {
              setCmsLoading(true); setCmsMsg(null);
              const res = await fetch("/api/admin/content", {
                method:"POST",
                headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
                body: JSON.stringify({ type:"packages", prices:priceEdits }),
              });
              const data = await res.json();
              setCmsLoading(false);
              if (data.ok) { setCmsMsg({ type:"ok", text:"Priser gemt!" }); setPricesData({...priceEdits}); setPricesFromDefault(false); }
              else setCmsMsg({ type:"err", text:"Fejl – prøv igen" });
            }

            function setPrice(carId, pkgId, val) {
              setPriceEdits(prev => ({
                ...prev,
                [carId]: { ...(prev[carId]||{}), [pkgId]: val }
              }));
            }

            const hasChanges = JSON.stringify(priceEdits) !== JSON.stringify(pricesData);

            return (
              <>
                {pricesFromDefault && (
                  <div style={{ marginBottom:16, background:"rgba(55,210,120,.06)", border:`1px solid ${T.accentBorder}`, borderRadius:10, padding:"12px 16px" }}>
                    <span style={{ fontSize:13, color:T.accent, fontWeight:600 }}>Viser standardpriser — rediger og klik 'Gem priser' for at gemme</span>
                  </div>
                )}
                <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:16, padding:24, marginBottom:16, overflowX:"auto" }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
                    <p style={{ fontSize:10, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase", margin:0 }}>Prismatrix (kr.)</p>
                    <button onClick={savePrices} disabled={cmsLoading||!hasChanges}
                      style={{ padding:"9px 20px", background:hasChanges&&!cmsLoading?T.accent:"rgba(55,210,120,.2)", color:T.bg0, border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:hasChanges&&!cmsLoading?"pointer":"not-allowed", opacity:hasChanges&&!cmsLoading?1:.5, fontFamily:FF }}>
                      {cmsLoading ? "Gemmer…" : "Gem priser"}
                    </button>
                  </div>
                  <table style={{ width:"100%", borderCollapse:"collapse", minWidth:400 }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign:"left", padding:"8px 10px", fontSize:11, color:T.t4, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", borderBottom:`1px solid ${T.border}` }}>Biltype</th>
                        {PKGS.map(p => (
                          <th key={p} style={{ textAlign:"center", padding:"8px 10px", fontSize:11, color:T.accent, fontWeight:700, letterSpacing:.5, textTransform:"uppercase", borderBottom:`1px solid ${T.border}` }}>{PKG_LABELS[p]}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {CARS.map((carId, ri) => (
                        <tr key={carId} style={{ background: ri%2===0?"transparent":"rgba(255,255,255,.02)" }}>
                          <td style={{ padding:"10px 10px", fontSize:13, color:T.t1, fontWeight:600, borderBottom:`1px solid rgba(255,255,255,.04)`, whiteSpace:"nowrap" }}>{CAR_LABELS[carId]}</td>
                          {PKGS.map(pkgId => {
                            const val = (priceEdits[carId]||{})[pkgId] || "";
                            return (
                              <td key={pkgId} style={{ padding:"8px 6px", borderBottom:`1px solid rgba(255,255,255,.04)` }}>
                                <input
                                  type="number" min="0" step="1"
                                  value={val}
                                  onChange={e => setPrice(carId, pkgId, e.target.value)}
                                  placeholder="–"
                                  style={{ width:"100%", padding:"8px 10px", borderRadius:7, border:`1px solid ${T.border}`, background:T.bg0, color:T.accent, fontSize:14, fontWeight:700, outline:"none", fontFamily:FF, textAlign:"center", boxSizing:"border-box" }}
                                />
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <Feedback m={cmsMsg} />
                </div>
                <p style={{ fontSize:12, color:T.t4, margin:0 }}>Priser vises som "kr. X" på hjemmesiden. Tomme felter bruger standardpriser fra koden.</p>
              </>
            );
          })()}

          {/* ── EKSTRA ── */}
          {tab === "extras" && (() => {
            async function addExtra(e) {
              e.preventDefault();
              if (!extNewNameDa.trim()) return;
              setCmsLoading(true); setCmsMsg(null);
              const res = await fetch("/api/admin/content", {
                method:"POST",
                headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
                body: JSON.stringify({ type:"extras", item:{ name:{da:extNewNameDa.trim(), en:extNewNameEn.trim()||extNewNameDa.trim()}, desc:{da:extNewDescDa.trim(), en:extNewDescEn.trim()||extNewDescDa.trim()}, price:Number(extNewPrice)||0 } }),
              });
              const data = await res.json();
              setCmsLoading(false);
              if (data.ok) { setCmsMsg({ type:"ok", text:"Tilføjet!" }); setExtNewNameDa(""); setExtNewNameEn(""); setExtNewDescDa(""); setExtNewDescEn(""); setExtNewPrice(""); fetchContent("extras"); }
              else setCmsMsg({ type:"err", text:"Fejl – prøv igen" });
            }
            async function saveExtra(item) {
              setCmsLoading(true); setCmsMsg(null);
              const res = await fetch("/api/admin/content", {
                method:"PUT",
                headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
                body: JSON.stringify({ type:"extras", id:item.id, item:{ name:{da:item.nameDa||"", en:item.nameEn||item.nameDa||""}, desc:{da:item.descDa||"", en:item.descEn||item.descDa||""}, price:Number(item.price)||0 } }),
              });
              const data = await res.json();
              setCmsLoading(false);
              if (data.ok) { setCmsMsg({ type:"ok", text:"Gemt!" }); setEditingExt(null); fetchContent("extras"); }
              else setCmsMsg({ type:"err", text:"Fejl – prøv igen" });
            }
            async function deleteExtra(id) {
              if (!confirm("Slet denne ydelse?")) return;
              await fetch("/api/admin/content", { method:"DELETE", headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" }, body:JSON.stringify({ type:"extras", id }) });
              fetchContent("extras");
            }
            const inp = (val, onChange, ph) => <input value={val} onChange={e=>onChange(e.target.value)} placeholder={ph} style={{ width:"100%", padding:"10px 13px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.t1, fontSize:13, outline:"none", fontFamily:FF, boxSizing:"border-box" }} />;
            return (
              <>
                <div style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:16, padding:24, marginBottom:28 }}>
                  <p style={{ fontSize:10, letterSpacing:2, fontWeight:700, color:T.t3, textTransform:"uppercase", margin:"0 0 16px" }}>Tilføj ekstra ydelse</p>
                  <form onSubmit={addExtra} style={{ display:"flex", flexDirection:"column", gap:8 }}>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                      <div>
                        <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Navn (DA) *</p>
                        {inp(extNewNameDa, setExtNewNameDa, "f.eks. Polering")}
                      </div>
                      <div>
                        <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Name (EN)</p>
                        {inp(extNewNameEn, setExtNewNameEn, "e.g. Polishing")}
                      </div>
                      <div>
                        <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Beskrivelse (DA)</p>
                        {inp(extNewDescDa, setExtNewDescDa, "Kort beskrivelse…")}
                      </div>
                      <div>
                        <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Description (EN)</p>
                        {inp(extNewDescEn, setExtNewDescEn, "Short description…")}
                      </div>
                    </div>
                    <div>
                      <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Pris (kr.)</p>
                      <input type="number" min="0" step="1" value={extNewPrice} onChange={e=>setExtNewPrice(e.target.value)} placeholder="f.eks. 299" style={{ padding:"10px 13px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.accent, fontSize:14, fontWeight:700, outline:"none", fontFamily:FF, width:160 }} />
                    </div>
                    <button type="submit" disabled={cmsLoading||!extNewNameDa.trim()}
                      style={{ padding:"11px 0", background:T.accent, color:T.bg0, fontWeight:700, fontSize:14, borderRadius:8, border:"none", cursor:(cmsLoading||!extNewNameDa.trim())?"not-allowed":"pointer", opacity:(cmsLoading||!extNewNameDa.trim())?.4:1, fontFamily:FF }}>
                      {cmsLoading ? "…" : "Tilføj ydelse"}
                    </button>
                  </form>
                  <Feedback m={cmsMsg} />
                </div>

                {extrasItems.length > 0 && (
                  <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                    {extrasItems.map((item) => {
                      const isEditing = editingExt?.id === item.id;
                      // Support both nested {da,en} format (KV) and flat (legacy)
                      const nameDa = item.name?.da || item.name || "";
                      const nameEn = item.name?.en || item.nameEn || "";
                      const descDa = item.desc?.da || item.desc || "";
                      const descEn = item.desc?.en || item.descEn || "";
                      const draft = isEditing ? editingExt : { nameDa, nameEn, descDa, descEn, price: item.price||"" };
                      return (
                        <div key={item.id} style={{ background:T.bg1, border:`1px solid ${isEditing?T.accentBorder:T.border}`, borderRadius:12, padding:20 }}>
                          {isEditing ? (
                            <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                                <div>
                                  <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Navn (DA)</p>
                                  {inp(draft.nameDa||"", v=>setEditingExt(d=>({...d,nameDa:v})), "Navn…")}
                                </div>
                                <div>
                                  <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Name (EN)</p>
                                  {inp(draft.nameEn||"", v=>setEditingExt(d=>({...d,nameEn:v})), "Name…")}
                                </div>
                                <div>
                                  <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Beskrivelse (DA)</p>
                                  {inp(draft.descDa||"", v=>setEditingExt(d=>({...d,descDa:v})), "Beskrivelse…")}
                                </div>
                                <div>
                                  <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Description (EN)</p>
                                  {inp(draft.descEn||"", v=>setEditingExt(d=>({...d,descEn:v})), "Description…")}
                                </div>
                              </div>
                              <div>
                                <p style={{ fontSize:11, color:T.t4, margin:"0 0 4px", fontWeight:600 }}>Pris (kr.)</p>
                                <input type="number" min="0" step="1" value={draft.price||""} onChange={e=>setEditingExt(d=>({...d,price:e.target.value}))} style={{ padding:"10px 13px", borderRadius:8, border:`1px solid ${T.border}`, background:T.bg0, color:T.accent, fontSize:14, fontWeight:700, outline:"none", fontFamily:FF, width:160 }} />
                              </div>
                              <div style={{ display:"flex", gap:8 }}>
                                <button onClick={() => saveExtra(draft)} disabled={cmsLoading}
                                  style={{ flex:1, padding:"9px 0", background:T.accent, color:T.bg0, border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:FF }}>Gem</button>
                                <button onClick={() => setEditingExt(null)}
                                  style={{ flex:1, padding:"9px 0", background:"rgba(255,255,255,.06)", color:T.t3, border:"none", borderRadius:8, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:FF }}>Annuller</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display:"flex", alignItems:"center", gap:16 }}>
                              <div style={{ flex:1, minWidth:0 }}>
                                <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                                  <span style={{ fontSize:14, fontWeight:700, color:T.t1 }}>{nameDa}</span>
                                  {nameEn && <span style={{ fontSize:12, color:T.t4, fontStyle:"italic" }}>/ {nameEn}</span>}
                                  {item.price ? <span style={{ fontSize:13, fontWeight:700, color:T.accent, background:T.accentDim, borderRadius:6, padding:"2px 8px" }}>kr. {item.price}</span> : null}
                                </div>
                                {descDa && <p style={{ fontSize:12, color:T.t3, margin:0, lineHeight:1.5 }}>{descDa}</p>}
                              </div>
                              <div style={{ display:"flex", gap:6, flexShrink:0 }}>
                                <button onClick={() => setEditingExt({ id:item.id, nameDa, nameEn, descDa, descEn, price:item.price||"" })}
                                  style={{ padding:"6px 12px", background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:6, color:T.accent, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FF }}>Rediger</button>
                                <button onClick={() => deleteExtra(item.id)}
                                  style={{ padding:"6px 12px", background:T.dangerDim, border:`1px solid ${T.dangerBorder}`, borderRadius:6, color:T.danger, fontSize:12, fontWeight:600, cursor:"pointer", fontFamily:FF }}>Slet</button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {extrasItems.length === 0 && (() => {
                  async function seedAllExtras() {
                    setCmsLoading(true); setCmsMsg(null);
                    for (const ext of DEFAULT_EXTRAS) {
                      await fetch("/api/admin/content", {
                        method:"POST",
                        headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
                        body: JSON.stringify({ type:"extras", item:{ name:ext.name, desc:ext.desc, price:ext.price } }),
                      });
                    }
                    setCmsLoading(false);
                    setCmsMsg({ type:"ok", text:"Alle standarddata gemt!" });
                    fetchContent("extras");
                  }
                  return (
                    <>
                      <div style={{ marginBottom:16, background:"rgba(55,210,120,.06)", border:`1px solid ${T.accentBorder}`, borderRadius:10, padding:"12px 16px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:12, flexWrap:"wrap" }}>
                        <span style={{ fontSize:13, color:T.accent, fontWeight:600 }}>Viser standardydelser — klik 'Gem alle' for at gøre dem redigerbare</span>
                        <button onClick={seedAllExtras} disabled={cmsLoading}
                          style={{ padding:"8px 18px", background:T.accent, color:T.bg0, border:"none", borderRadius:8, fontWeight:700, fontSize:13, cursor:cmsLoading?"not-allowed":"pointer", opacity:cmsLoading?.6:1, fontFamily:FF, whiteSpace:"nowrap" }}>
                          {cmsLoading ? "Gemmer…" : "Gem alle standarddata"}
                        </button>
                      </div>
                      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                        {DEFAULT_EXTRAS.map((ext, idx) => (
                          <div key={idx} style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:12, padding:20, display:"flex", gap:12, alignItems:"center" }}>
                            <div style={{ flex:1, minWidth:0 }}>
                              <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4 }}>
                                <span style={{ fontSize:14, fontWeight:700, color:T.t2 }}>{ext.name.da}</span>
                                {ext.name.en && <span style={{ fontSize:12, color:T.t4, fontStyle:"italic" }}>/ {ext.name.en}</span>}
                                <span style={{ fontSize:13, fontWeight:700, color:T.accent, background:T.accentDim, borderRadius:6, padding:"2px 8px" }}>kr. {ext.price}</span>
                              </div>
                              {ext.desc?.da && <p style={{ fontSize:12, color:T.t3, margin:0, lineHeight:1.5 }}>{ext.desc.da}</p>}
                            </div>
                            <button
                              onClick={async () => {
                                await fetch("/api/admin/content", {
                                  method:"POST",
                                  headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
                                  body: JSON.stringify({ type:"extras", item:{ name:ext.name, desc:ext.desc, price:ext.price } }),
                                });
                                fetchContent("extras");
                              }}
                              style={{ padding:"6px 14px", background:T.accentDim, border:`1px solid ${T.accentBorder}`, borderRadius:7, color:T.accent, fontSize:12, fontWeight:700, cursor:"pointer", fontFamily:FF, whiteSpace:"nowrap", flexShrink:0 }}
                            >+ Tilføj</button>
                          </div>
                        ))}
                      </div>
                      <Feedback m={cmsMsg} />
                    </>
                  );
                })()}
              </>
            );
          })()}

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

      {/* BOOKING DETAIL MODAL */}
      {selectedBooking && (() => {
        const b = selectedBooking;
        const cancelled = b.status === "cancelled";

        async function doCancel() {
          setModalState("loading");
          try {
            const r = await fetch("/api/admin/delete-booking", {
              method:"PATCH",
              headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
              body:JSON.stringify({ token:b.token }),
            });
            if (r.ok) {
              setBookings(bs => bs.map(x => x.token===b.token ? {...x, status:"cancelled"} : x));
              setSelectedBooking(sb => sb ? {...sb, status:"cancelled"} : null);
            }
            setModalState("idle");
          } catch { setModalState("idle"); }
        }

        async function doDelete() {
          setModalState("loading");
          try {
            const r = await fetch("/api/admin/delete-booking", {
              method:"DELETE",
              headers:{ Authorization:`Bearer ${secret}`, "Content-Type":"application/json" },
              body:JSON.stringify({ token:b.token }),
            });
            if (r.ok) {
              setBookings(bs => bs.filter(x => x.token!==b.token));
              setSelectedBooking(null);
            } else { setModalState("idle"); }
          } catch { setModalState("idle"); }
        }

        const statusColor = STATUS_COLOR[b.status] || T.t3;
        const statusLabel = STATUS_LABEL[b.status] || b.status;

        return (
          <div onClick={() => setSelectedBooking(null)}
            style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.88)", backdropFilter:"blur(10px)", zIndex:300, display:"flex", alignItems:"center", justifyContent:"center", padding:24 }}>
            <div onClick={e => e.stopPropagation()}
              style={{ background:T.bg1, border:`1px solid ${T.border}`, borderRadius:20, padding:32, maxWidth:480, width:"100%", boxShadow:T.shadowL, maxHeight:"90vh", overflowY:"auto", boxSizing:"border-box" }}>

              {/* Header */}
              <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:20 }}>
                <div style={{ flex:1, minWidth:0, marginRight:12 }}>
                  <div style={{ fontSize:20, fontWeight:800, color:T.t1, marginBottom:8, lineHeight:1.2 }}>{b.name || "Ukendt"}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:8, flexWrap:"wrap" }}>
                    <span style={{ fontSize:12, fontWeight:700, padding:"4px 12px", borderRadius:20, background:"rgba(0,0,0,.4)", color:statusColor, border:`1px solid ${statusColor}33` }}>{statusLabel}</span>
                    {b.phone && (
                      <a href={`tel:${b.phone}`}
                        style={{ display:"flex", alignItems:"center", gap:6, padding:"4px 12px", borderRadius:20, background:T.accentDim, border:`1px solid ${T.accentBorder}`, color:T.accent, fontSize:12, fontWeight:700, textDecoration:"none" }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.15 1.28 2 2 0 012.11 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                        {b.phone}
                      </a>
                    )}
                  </div>
                </div>
                <button onClick={() => setSelectedBooking(null)}
                  style={{ width:36, height:36, borderRadius:"50%", background:"rgba(255,255,255,.08)", border:`1px solid ${T.border}`, color:T.t2, fontSize:16, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:FF, flexShrink:0 }}>
                  ✕
                </button>
              </div>

              {/* Details */}
              <div style={{ display:"flex", flexDirection:"column", gap:8, marginBottom:24 }}>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <div style={{ background:T.bg0, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, color:T.t4, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Dato</div>
                    <div style={{ fontSize:14, color:T.t1, fontWeight:600 }}>{fmtDate(b.date)}</div>
                  </div>
                  <div style={{ background:T.bg0, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, color:T.t4, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Tidspunkt</div>
                    <div style={{ fontSize:14, color:T.t1, fontWeight:600 }}>kl. {b.time || "-"}</div>
                  </div>
                  <div style={{ background:T.bg0, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, color:T.t4, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Pakke</div>
                    <div style={{ fontSize:14, color:T.t1, fontWeight:600 }}>{b.pkg || "-"}</div>
                  </div>
                  <div style={{ background:T.bg0, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, color:T.t4, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Pris</div>
                    <div style={{ fontSize:14, color:T.accent, fontWeight:700 }}>{b.price || "-"}</div>
                  </div>
                </div>

                {b.car && (
                  <div style={{ background:T.bg0, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, color:T.t4, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Bil</div>
                    <div style={{ fontSize:14, color:T.t1, fontWeight:600 }}>{b.car}</div>
                  </div>
                )}

                {(b.addr || b.zip || b.city) && (
                  <div style={{ background:T.bg0, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, color:T.t4, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Adresse</div>
                    <div style={{ fontSize:14, color:T.t1 }}>{[b.addr, b.zip, b.city].filter(Boolean).join(", ")}</div>
                  </div>
                )}

                {b.email && (
                  <div style={{ background:T.bg0, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, color:T.t4, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>E-mail</div>
                    <div style={{ fontSize:14, color:T.t1 }}>{b.email}</div>
                  </div>
                )}

                {b.phone && (
                  <div style={{ background:T.bg0, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, color:T.t4, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Telefon</div>
                    <div style={{ fontSize:14, color:T.t1 }}>{b.phone}</div>
                  </div>
                )}

                {b.msg && (
                  <div style={{ background:T.bg0, borderRadius:10, padding:"12px 14px" }}>
                    <div style={{ fontSize:10, color:T.t4, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Besked</div>
                    <div style={{ fontSize:13, color:T.t2, fontStyle:"italic", lineHeight:1.5 }}>{b.msg}</div>
                  </div>
                )}

                <div style={{ background:T.bg0, borderRadius:10, padding:"12px 14px" }}>
                  <div style={{ fontSize:10, color:T.t4, fontWeight:700, letterSpacing:1, textTransform:"uppercase", marginBottom:4 }}>Booket</div>
                  <div style={{ fontSize:13, color:T.t3 }}>{fmtBooked(b.bookedAt)}</div>
                </div>
              </div>

              {/* Actions */}
              {modalState === "loading" && (
                <div style={{ textAlign:"center", color:T.t3, fontSize:13, padding:"8px 0 16px" }}>Behandler…</div>
              )}

              {modalState === "idle" && (
                <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                  {!cancelled && (
                    <button onClick={() => setModalState("confirmCancel")}
                      style={{ width:"100%", padding:"12px 0", background:T.goldDim, color:T.gold, border:`1px solid ${T.goldBorder}`, borderRadius:10, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:FF }}>
                      Annuller booking
                    </button>
                  )}
                  <button onClick={() => setModalState("confirmDelete")}
                    style={{ width:"100%", padding:"12px 0", background:T.dangerDim, color:T.danger, border:`1px solid ${T.dangerBorder}`, borderRadius:10, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:FF }}>
                    Slet permanent
                  </button>
                </div>
              )}

              {modalState === "confirmCancel" && (
                <div style={{ background:"rgba(0,0,0,.3)", border:`1px solid ${T.dangerBorder}`, borderRadius:12, padding:"16px 18px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style={{ color:T.t1, fontSize:14, fontWeight:700 }}>Annuller booking</span>
                  </div>
                  <p style={{ color:T.t2, fontSize:13, margin:"0 0 14px", lineHeight:1.6 }}>
                    Kunden modtager en annullerings-e-mail automatisk. Tidslottet frigives til nye bookinger.
                  </p>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={doCancel} style={{ flex:1, padding:"11px 0", background:"#c0392b", color:"#fff", border:"none", borderRadius:9, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:FF }}>Send e-mail og annuller</button>
                    <button onClick={() => setModalState("idle")} style={{ flex:1, padding:"11px 0", background:"rgba(255,255,255,.07)", color:T.t3, border:"none", borderRadius:9, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:FF }}>Tilbage</button>
                  </div>
                </div>
              )}

              {modalState === "confirmDelete" && (
                <div style={{ background:"rgba(0,0,0,.3)", border:`1px solid ${T.dangerBorder}`, borderRadius:12, padding:"16px 18px" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={T.danger} strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                    <span style={{ color:T.t1, fontSize:14, fontWeight:700 }}>Slet permanent</span>
                  </div>
                  <p style={{ color:T.t2, fontSize:13, margin:"0 0 14px", lineHeight:1.6 }}>
                    Bookingen slettes fuldstændigt. Kunden modtager en annullerings-e-mail. Kan ikke fortrydes.
                  </p>
                  <div style={{ display:"flex", gap:8 }}>
                    <button onClick={doDelete} style={{ flex:1, padding:"11px 0", background:"#c0392b", color:"#fff", border:"none", borderRadius:9, fontWeight:700, fontSize:14, cursor:"pointer", fontFamily:FF }}>Send e-mail og slet</button>
                    <button onClick={() => setModalState("idle")} style={{ flex:1, padding:"11px 0", background:"rgba(255,255,255,.07)", color:T.t3, border:"none", borderRadius:9, fontWeight:600, fontSize:13, cursor:"pointer", fontFamily:FF }}>Tilbage</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })()}

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
