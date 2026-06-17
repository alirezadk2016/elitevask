// Auto-extracted from original elitevask.html — runs once on mount.
export function initSite(){
var CARS=[
  {id:"lille",label:{da:"Lille bil",en:"Small car"},ex:{da:"Aygo, Up!, i10",en:"Aygo, Up!, i10"},prices:{hele:800,udv:500,indv:600,guld:2000},svg:'<path d="M18 44 Q16 30 24 26 L34 24 Q40 18 50 17 L70 18 Q82 20 90 28 L100 36 Q104 38 104 42 L104 46 Q104 48 100 48 L96 48"/><path d="M18 44 L18 46 Q18 48 22 48 L26 48"/><path d="M44 48 L78 48"/><circle cx="36" cy="48" r="8"/><circle cx="36" cy="48" r="3"/><circle cx="88" cy="48" r="8"/><circle cx="88" cy="48" r="3"/><path d="M34 25 Q40 20 48 19 L48 33 L26 33 Q24 28 34 25"/><path d="M52 19 L66 19 Q76 21 82 28 L82 33 L52 33 Z"/>'},
  {id:"mellem",label:{da:"Mellem bil",en:"Medium car"},ex:{da:"Golf, Focus, i20",en:"Golf, Focus, i20"},prices:{hele:950,udv:550,indv:700,guld:2200},svg:'<path d="M8 44 Q6 32 16 28 L30 24 Q42 16 58 16 L78 17 Q94 19 106 27 L114 34 Q116 36 116 40 L116 46 Q116 48 112 48 L106 48"/><path d="M8 44 L8 46 Q8 48 12 48 L16 48"/><path d="M38 48 L82 48"/><circle cx="28" cy="48" r="8.5"/><circle cx="28" cy="48" r="3"/><circle cx="92" cy="48" r="8.5"/><circle cx="92" cy="48" r="3"/><path d="M32 24 Q42 17 56 17 L56 31 L22 31 Q22 27 32 24"/><path d="M60 17 L76 18 Q90 20 102 28 L60 31 Z"/>'},
  {id:"stor",label:{da:"Stor bil",en:"Large car"},ex:{da:"Passat, SUV, stationcar",en:"Passat, SUV, estate"},prices:{hele:1100,udv:650,indv:850,guld:2350},svg:'<path d="M8 42 Q6 26 18 23 L32 20 Q42 13 58 13 L86 14 Q102 16 110 26 L114 34 Q116 36 116 40 L116 45 Q116 47 112 47 L104 47"/><path d="M8 42 L8 45 Q8 47 12 47 L20 47"/><path d="M40 47 L84 47"/><circle cx="30" cy="47" r="9.5"/><circle cx="30" cy="47" r="3.5"/><circle cx="92" cy="47" r="9.5"/><circle cx="92" cy="47" r="3.5"/><path d="M34 21 Q42 14 56 14 L56 30 L24 30 Q24 25 34 21"/><path d="M60 14 L84 15 Q100 17 108 28 L108 30 L60 30 Z"/>'},
  {id:"varebil",label:{da:"Varebil",en:"Van"},ex:{da:"Transit, Caddy, Berlingo",en:"Transit, Caddy, Berlingo"},prices:{hele:1400,udv:750,indv:750,guld:2200},svg:'<path d="M6 48 L6 18 Q6 14 12 14 L74 14 Q82 14 88 22 L108 38 Q112 41 112 46 L112 47 Q112 48 108 48"/><path d="M40 48 L82 48"/><circle cx="28" cy="48" r="8.5"/><circle cx="28" cy="48" r="3"/><circle cx="92" cy="48" r="8.5"/><circle cx="92" cy="48" r="3"/><path d="M74 16 L80 30 L110 30"/><path d="M38 14 L38 30 L6 30"/>'}
];
var PKGS=[
  {id:"hele",pop:true,gold:false,name:{da:"Hele bilen",en:"Full car"},desc:{da:"Ind & ud – komplet behandling",en:"In & out – complete service"},feat:{da:["Udvendig håndvask + fælge","Grundig indvendig støvsugning","Rens af måtter & sæder","Dampbehandling af kabine","Voksfinish & ruder ind/ud"],en:["Exterior hand wash + rims","Thorough interior vacuum","Mats & seats cleaned","Cabin steam treatment","Wax finish & windows"]}},
  {id:"udv",pop:false,gold:false,name:{da:"Udvendig",en:"Exterior"},desc:{da:"Skånsom udvendig dampvask",en:"Gentle exterior steam wash"},feat:{da:["Udvendig håndvask","Fælge & dæk","Lakrens: tjære & insekter","Voksfinish","Ruder udvendigt"],en:["Exterior hand wash","Rims & tyres","Paint: tar & insects","Wax finish","Windows outside"]}},
  {id:"indv",pop:false,gold:false,name:{da:"Indvendig",en:"Interior"},desc:{da:"Dybderens af kabinen",en:"Deep clean of the cabin"},feat:{da:["Grundig støvsugning","Rens af måtter","Dampbehandling af sæder","Desinficering","Ruder indvendigt"],en:["Thorough vacuum","Mat cleaning","Seat steam treatment","Disinfection","Windows inside"]}},
  {id:"guld",pop:false,gold:true,name:{da:"Guld pakke",en:"Gold package"},desc:{da:"Inkl. alle ydelser",en:"All services included"},feat:{da:["Alt ind & ud","+ Motorrens","+ Lak- & glansbeskyttelse","+ Dybderens ved uheld","+ Interiørbeskyttelse"],en:["Everything in & out","+ Engine clean","+ Paint & gloss protection","+ Deep clean if needed","+ Interior protection"]}}
];
var EXTRAS=[
  {id:"motor",name:{da:"Motorrens",en:"Engine clean"},price:300,desc:{da:"Grundig afrensning af motorrum",en:"Thorough engine bay cleaning"}},
  {id:"lak",name:{da:"Lak & glansbeskyttelse",en:"Paint & gloss protection"},price:250,desc:{da:"Udvendig – langvarig ekstra glans",en:"Exterior – long-lasting gloss"}},
  {id:"haar",name:{da:"Fjernelse af dyrehår",en:"Pet hair removal"},price:150,desc:{da:"Effektiv fjernelse af hår og fnug",en:"Effective removal of hair and lint"}},
  {id:"barnesaede",name:{da:"Barnesæde rens",en:"Child seat cleaning"},price:100,desc:{da:"Grundig og sikker rengøring",en:"Thorough and safe cleaning"}}
];
var REVIEWS=[];
var FAQ=[
  {q:{da:"Hvad koster mobil bilvask?",en:"What does mobile car wash cost?"},a:{da:"Prisen afhænger af biltype og pakke. En komplet vask starter fra 799 kr. Vælg din biltype ovenfor for at se den præcise pris.",en:"Price depends on car type and package. A full wash starts from 799 kr. Select your car type above to see the exact price."}},
  {q:{da:"Hvor lang tid tager det?",en:"How long does it take?"},a:{da:"Typisk mellem 1 og 4 timer, afhængigt af pakke og bilens størrelse.",en:"Typically between 1 and 4 hours, depending on package and car size."}},
  {q:{da:"Dækker I hele Sjælland?",en:"Do you cover all of Zealand?"},a:{da:"Ja, vi dækker store dele af Sjælland, herunder Storkøbenhavn og Nordsjælland.",en:"Yes, we cover large parts of Zealand, including Greater Copenhagen and North Zealand."}},
  {q:{da:"Kan I vaske leasingbiler?",en:"Can you clean lease cars?"},a:{da:"Ja, vores Returklargøring-pakke er lavet specielt til aflevering af leasingbiler.",en:"Yes, our Lease return package is made specifically for returning lease cars."}},
  {q:{da:"Kommer I hjem til mig?",en:"Do you come to my home?"},a:{da:"Ja, vi er mobile og kører ud til din adresse – hjemme eller på arbejde.",en:"Yes, we are mobile and drive to your address – at home or at work."}},
  {q:{da:"Hvad er forskellen på dampvask og almindelig bilvask?",en:"What is the difference between steam wash and regular wash?"},a:{da:"Dampvask bruger varm damp med minimalt vandforbrug, renser mere skånsomt og desinficerer overflader uden aggressive kemikalier.",en:"Steam washing uses hot steam with minimal water, cleans more gently and disinfects surfaces without aggressive chemicals."}}
];
var I18N={
  da:{tb_local:"Lokalt firma på Sjælland",tb_ins:"Forsikret virksomhed",tb_rating:"Google anmeldelser",tb_mobile:"Mobil dampvask",nav_choose:"Vælg bil",nav_work:"Vores arbejde",nav_reviews:"Anmeldelser",nav_contact:"Kontakt",nav_book:"Book nu",hero_badge:"Vi kører til dig – hele Sjælland",hero_h1a:"Vi kører til dig",hero_h1b:"og vasker din bil",hero_p:"Mobil bil dampvask med premium produkter. Rent, effektivt og miljøvenligt – uden at du forlader hjemmet.",flow1:"Indtast nummerplade",flow2:"Se pris",flow3:"Book tid",hero_cta1:"Slå nummerplade op",hero_cta2:"Book med det samme",hero_t1:"Rent",hero_t2:"Effektivt",hero_t3:"Miljøvenligt",plate_search:"Slå op",plate_or:"– eller vælg manuelt –",sel_eyebrow:"Trin 1 af 2",sel_title:"Find pris til din bil",sel_sub:"Indtast din nummerplade – vi finder bilen automatisk og viser prisen med det samme.",calc_head_p:"Vælg den pakke der passer til dig",calc_zip:"Postnr.",calc_note:"Priserne er vejledende. Kørsel beregnes ud fra postnummer. Endelig pris bekræftes ved booking.",st1:"Skånsom rensemetode",st2:"Typisk behandlingstid",st3:"Mobil – vi kører ud",st4:"Vores serviceområde",how_eyebrow:"Sådan virker det",how_title:"3 nemme trin",how1t:"Vælg og book",how1p:"Vælg biltype og pakke, og book en tid på få minutter.",how2t:"Vi kører ud",how2p:"Vi ankommer med alt udstyr direkte til din adresse.",how3t:"Bilen skinner",how3p:"Nyd en ren, frisk bil. Du behøvede ikke flytte dig.",ba_eyebrow:"Vores arbejde",ba_title:"Før & efter",ba_sub:"Træk i slideren for at se forskellen. Rigtige resultater fra vores kunder.",ba_cap:"Motorrens · Peugeot – afrenset med damp",gal_eyebrow:"Galleri",gal_title:"Billeder fra vores arbejde",g_seat_for:"Sæderens · før",g_seat_efter:"Sæderens · efter",g_floor_for:"Fodrum · før",g_floor_efter:"Fodrum · efter",g_fuel_for:"Tankdæksel · før",g_fuel_efter:"Tankdæksel · efter",g_roof:"Tagkant · algerens",g_pedal:"Pedalområde · rens",g_onsite:"Mobil dampvask · på stedet",ex_eyebrow:"Tilvalg",ex_title:"Ekstra ydelser",ex_sub:"Kan tilføjes til enhver pakke. Indgår i Guld pakken.",ex1t:"Motorrens",ex1p:"Grundig afrensning af motorrum",ex2t:"Lak- & glansbeskyttelse",ex2p:"Udvendig – langvarig ekstra glans",ex3t:"Indvendig pleje & beskyttelse",ex3p:"Beskytter og fornyer interiøret",ex4t:"Fjernelse af dyrehår",ex4p:"Effektiv fjernelse af hår og fnug",ex5t:"Sæderens (stof)",ex5p:"Dybderens af stofsæder",ex6t:"Rens af barnesæde",ex6p:"Grundig og sikker rengøring",why_eyebrow:"Hvorfor vælge os",why_title:"Tillid og kvalitet i centrum",why1t:"Gennemsigtige priser",why1p:"Du kender prisen, før vi kører ud. Ingen overraskelser.",why2t:"Miljøvenlig dampvask",why2p:"Skånsom metode med minimalt vandforbrug.",why3t:"Vi kommer til dig",why3p:"Hjemme, på kontoret eller i sommerhuset.",why4t:"Tilfredshedsgaranti",why4p:"Ikke tilfreds? Så finder vi en løsning.",info_eyebrow:"Om Elite Vask",info_title:"Mød holdet bag",info_sub:"Her fortæller vi snart mere om os og det udstyr, vi bruger.",info1t:"Ejer & kontaktperson",info1p:"Navn og direkte kontakt til indehaveren tilføjes her.",info_soon:"Tilføjes snart",info2t:"Vores udstyr",info2p:"Beskrivelse af de dampmaskiner og produkter vi vasker med.",info_soon2:"Tilføjes snart",info3t:"Dækningsområde",info3p:"Vi dækker store dele af Sjælland, herunder Storkøbenhavn.",rev_eyebrow:"Kundeanmeldelser",rev_title:"Det siger vores kunder",rev_empty_t:"Anmeldelser vises her snart",rev_empty_p:"Vi forbinder vores Google Business-profil. Når den er klar, vises rigtige kundeanmeldelser automatisk her.",rev_empty_cta:"Book din vask",faq_eyebrow:"Spørgsmål & svar",faq_title:"Ofte stillede spørgsmål",local_eyebrow:"Serviceområde",local_title:"Mobil bilvask i hele Sjælland",ct_title:"Klar til en skinnende ren bil?",ct_lead:"Kontakt os i dag og book din mobile dampvask. Vi kører til dig – nemt, hurtigt og lokalt.",ct_book:"Book online nu",ct_call:"Ring til os",ct_phone:"Telefon",ct_email:"E-mail",ct_addr:"Adresse",ct_hours:"Åbningstider",ct_hours_v:"Man–Søn · 08–20",foot_p:"Mobil bil dampvask på Sjælland. Vi kører til dig og vasker din bil – rent, effektivt og miljøvenligt.",foot_s1:"Service",foot_l1:"Vælg bil & priser",foot_l2:"Vores arbejde",foot_l3:"Anmeldelser",foot_s2:"Kontakt",m_call:"Ring nu",m_book:"Book nu",wiz_title:"Book din bilvask",chat_status:"Svar indenfor minutter"},
  en:{tb_local:"Local company on Zealand",tb_ins:"Insured business",tb_rating:"Google reviews",tb_mobile:"Mobile steam wash",nav_choose:"Choose car",nav_work:"Our work",nav_reviews:"Reviews",nav_contact:"Contact",nav_book:"Book now",hero_badge:"We drive to you – all of Zealand",hero_h1a:"We drive to you",hero_h1b:"and wash your car",hero_p:"Mobile car steam wash with premium products. Clean, effective and eco-friendly – without leaving home.",flow1:"Enter plate number",flow2:"See price",flow3:"Book time",hero_cta1:"Look up plate number",hero_cta2:"Book right away",hero_t1:"Clean",hero_t2:"Effective",hero_t3:"Eco-friendly",plate_search:"Search",plate_or:"– or select manually –",sel_eyebrow:"Step 1 of 2",sel_title:"Find price for your car",sel_sub:"Enter your license plate – we find your car automatically and show the price instantly.",calc_head_p:"Pick the package that suits you",calc_zip:"Zip",calc_note:"Prices are guidance. Travel is calculated from zip code. Final price confirmed at booking.",st1:"Gentle steam method",st2:"Typical service time",st3:"Mobile – we come to you",st4:"Our service area",how_eyebrow:"How it works",how_title:"3 easy steps",how1t:"Choose and book",how1p:"Pick car type and package, and book a time in minutes.",how2t:"We come to you",how2p:"We arrive with all equipment directly to your address.",how3t:"Your car shines",how3p:"Enjoy a clean, fresh car. You didn't even have to move.",ba_eyebrow:"Our work",ba_title:"Before & after",ba_sub:"Drag the slider to see the difference. Real results from our customers.",ba_cap:"Engine clean · Peugeot – steam cleaned",gal_eyebrow:"Gallery",gal_title:"Photos from our work",g_seat_for:"Seat clean · before",g_seat_efter:"Seat clean · after",g_floor_for:"Footwell · before",g_floor_efter:"Footwell · after",g_fuel_for:"Fuel cap · before",g_fuel_efter:"Fuel cap · after",g_roof:"Roof edge · algae removal",g_pedal:"Pedal area · clean",g_onsite:"Mobile steam wash · on location",ex_eyebrow:"Add-ons",ex_title:"Extra services",ex_sub:"Can be added to any package. Included in the Gold package.",ex1t:"Engine clean",ex1p:"Thorough engine bay cleaning",ex2t:"Paint & gloss protection",ex2p:"Exterior – long-lasting extra gloss",ex3t:"Interior care & protection",ex3p:"Protects and renews the interior",ex4t:"Pet hair removal",ex4p:"Effective removal of hair and lint",ex5t:"Seat clean (fabric)",ex5p:"Deep clean of fabric seats",ex6t:"Child seat cleaning",ex6p:"Thorough and safe cleaning",why_eyebrow:"Why choose us",why_title:"Trust and quality first",why1t:"Transparent prices",why1p:"You know the price before we drive out. No surprises.",why2t:"Eco-friendly steam wash",why2p:"Gentle method with minimal water use.",why3t:"We come to you",why3p:"At home, the office or the summer house.",why4t:"Satisfaction guarantee",why4p:"Not happy? Then we'll find a solution.",info_eyebrow:"About Elite Vask",info_title:"Meet the team",info_sub:"We'll soon tell you more about us and the equipment we use.",info1t:"Owner & contact",info1p:"Name and direct contact to the owner will be added here.",info_soon:"Added soon",info2t:"Our equipment",info2p:"Description of the steam machines and products we use.",info_soon2:"Added soon",info3t:"Coverage area",info3p:"We cover large parts of Zealand, including Greater Copenhagen.",rev_eyebrow:"Customer reviews",rev_title:"What our customers say",rev_empty_t:"Reviews appear here soon",rev_empty_p:"We are connecting our Google Business profile. Once ready, real customer reviews appear here automatically.",rev_empty_cta:"Book your wash",faq_eyebrow:"Questions & answers",faq_title:"Frequently asked questions",local_eyebrow:"Service area",local_title:"Mobile car wash across Zealand",ct_title:"Ready for a spotless car?",ct_lead:"Contact us today and book your mobile steam wash. We come to you – easy, fast and local.",ct_book:"Book online now",ct_call:"Call us",ct_phone:"Phone",ct_email:"Email",ct_addr:"Address",ct_hours:"Opening hours",ct_hours_v:"Mon–Sun · 08–20",foot_p:"Mobile car steam wash on Zealand. We drive to you and wash your car – clean, effective and eco-friendly.",foot_s1:"Service",foot_l1:"Choose car & prices",foot_l2:"Our work",foot_l3:"Reviews",foot_s2:"Contact",m_call:"Call now",m_book:"Book now",wiz_title:"Book your car wash",chat_status:"Reply within minutes"}
};
var WIZ={
  da:{step:"Trin",of:"af",s1:"Vælg din bil",s2:"Vælg pakke",s3:"Tilvalg (valgfrit)",s4:"Din adresse",s5:"Vælg dato & tid",s6:"Kontaktinfo",addr:"Adresse",zip:"Postnr.",city:"By",date:"Dato",time:"Tidspunkt",name:"Navn",phone:"Telefon",email:"E-mail (valgfri)",msg:"Besked (valgfri)",next:"Næste",back:"Tilbage",send:"Send anmodning",sumcar:"Bil",sumpkg:"Pakke",sumext:"Tilvalg",sumprice:"Anslået pris",done_t:"Tak for din anmodning!",done_p:"Vi kontakter dig hurtigst muligt for at bekræfte tid og pris.",close:"Luk",pick:"Vælg",skip:"Spring over",plate_label:"Slå nummerplade op",plate_or:"– eller vælg manuelt –",plate_search:"Slå op",plate_searching:"Søger...",plate_found:"Se priser for denne bil"},
  en:{step:"Step",of:"of",s1:"Choose your car",s2:"Choose package",s3:"Add-ons (optional)",s4:"Your address",s5:"Choose date & time",s6:"Contact info",addr:"Address",zip:"Zip",city:"City",date:"Date",time:"Time",name:"Name",phone:"Phone",email:"Email (optional)",msg:"Message (optional)",next:"Next",back:"Back",send:"Send request",sumcar:"Car",sumpkg:"Package",sumext:"Add-ons",sumprice:"Estimated price",done_t:"Thank you for your request!",done_p:"We'll contact you as soon as possible to confirm time and price.",close:"Close",pick:"Choose",skip:"Skip",plate_label:"Look up plate number",plate_or:"– or select manually –",plate_search:"Search",plate_searching:"Searching...",plate_found:"See prices for this car"}
};

/* ====== STATE ====== */
var LANG="da", selCar=null, zipVal="";
function t(k){return (I18N[LANG][k]!==undefined)?I18N[LANG][k]:k;}
function svgWrap(inner,w,h,col){return '<svg viewBox="0 0 120 64" width="'+w+'" height="'+h+'" fill="none" stroke="'+(col||"currentColor")+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'+inner+'</svg>';}
function fmtKr(n){return Math.round(n).toLocaleString('da-DK')+' kr';}

/* ====== KØRSEL ====== */
function driveFee(zip){
  if(!zip||zip.length<3) return 0;
  var z=parseInt(zip,10);
  if(isNaN(z)) return 0;
  if(z>=1000&&z<=2999) return 149;
  if(z>=3000&&z<=3699) return 199;
  if(z>=4000&&z<=4099) return 99;
  if(z>=4600&&z<=4699) return 99;
  if(z>=4100&&z<=4399) return 0;
  if(z>=4700&&z<=4999) return 0;
  if(z>=4200&&z<=4299) return 79;
  return 199;
}

/* ====== RENDER CARS ====== */
function renderCars(){
  var g=document.getElementById('carGrid');g.innerHTML='';
  CARS.forEach(function(c){
    var d=document.createElement('div');d.className='car';d.dataset.id=c.id;
    if(selCar&&selCar.id===c.id)d.classList.add('on');
    d.innerHTML='<svg class="cs" viewBox="0 0 120 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'+c.svg+'</svg><div class="nm">'+c.label[LANG]+'</div><div class="ex">'+c.ex[LANG]+'</div>';
    d.addEventListener('click',function(){selCar=c;renderCars();renderCalc();var cal=document.getElementById('calc');cal.classList.add('show');setTimeout(function(){cal.scrollIntoView({behavior:'smooth',block:'nearest'});},60);});
    g.appendChild(d);
  });
}
/* ====== RENDER CALC ====== */
function renderCalc(){
  if(!selCar)return;
  document.getElementById('calcTitle').textContent=selCar.label[LANG];
  document.getElementById('calcIcon').innerHTML=svgWrap(selCar.svg,60,34,'#9af0bd');
  var fee=driveFee(zipVal);
  var p=document.getElementById('pkgs');p.innerHTML='';
  PKGS.forEach(function(pk){
    var price=selCar.prices[pk.id];
    var total=price+fee;
    var cls='pkg'+(pk.pop?' pop':'')+(pk.gold?' gold':'');
    var tag=pk.pop?'<div class="tag">'+(LANG==="da"?"Mest populær":"Most popular")+'</div>':(pk.gold?'<div class="tag">'+(LANG==="da"?"Premium":"Premium")+'</div>':'');
    var feats=pk.feat[LANG].map(function(f){return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'+f+'</li>';}).join('');
    var driveLine=fee>0?'<div class="drive"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2v-4c0-1-.7-1.8-1.5-2L16 10l-2.2-2.3c-.4-.4-1-.7-1.7-.7H5c-.6 0-1.1.4-1.4 1L2 11v6h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>+ '+(LANG==="da"?"kørsel":"travel")+' '+fmtKr(fee)+'</div>':'';
    var totLine=fee>0?'<div class="total">'+(LANG==="da"?"I alt:":"Total:")+' '+fmtKr(total)+'</div>':'<div class="total">'+(LANG==="da"?"+ evt. kørsel":"+ travel if any")+'</div>';
    var el=document.createElement('div');el.className=cls;
    el.innerHTML=tag+'<div class="pn">'+pk.name[LANG]+'</div><div class="pd">'+pk.desc[LANG]+'</div><div class="price">'+fmtKr(price)+'</div><div class="ps">'+(LANG==="da"?"inkl. moms":"incl. VAT")+'</div>'+driveLine+totLine+'<ul>'+feats+'</ul><button class="btn pbtn">'+(LANG==="da"?"Bestil denne pakke":"Order this package")+'</button>';
    el.querySelector('.pbtn').addEventListener('click',function(){openWiz(selCar,pk);});
    p.appendChild(el);
  });
  // Render package tabs for mobile
  var tabs=document.getElementById('pkgTabs');
  if(tabs){
    tabs.innerHTML=PKGS.map(function(pk,i){return '<button class="pkg-tab'+(i===0?' on':'')+'" data-pkg-idx="'+i+'">'+pk.name[LANG]+'</button>';}).join('');
    if(window.innerWidth<=880){
      var els=p.querySelectorAll('.pkg');
      els.forEach(function(el,j){el.style.display=j===0?'':'none';});
    }
  }
}
/* ====== REVIEWS / FAQ ====== */
function renderReviews(){
  var g=document.getElementById('reviewsGrid');if(!g)return;g.innerHTML='';
  REVIEWS.forEach(function(r){
    var stars='';for(var i=0;i<5;i++)stars+='<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z"/></svg>';
    var el=document.createElement('div');el.className='review';
    el.innerHTML='<div class="rs">'+stars+'</div><p>"'+r.t[LANG]+'"</p><div class="who"><div class="av" style="background:'+r.av+'">'+r.ini+'</div><div><div class="nm">'+r.n+'</div><div class="ca">'+r.c[LANG]+'</div></div></div>';
    g.appendChild(el);
  });
}
function renderFaq(){
  var g=document.getElementById('faqList');g.innerHTML='';
  FAQ.forEach(function(f){
    var el=document.createElement('div');el.className='qa';
    el.innerHTML='<button>'+f.q[LANG]+'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="ans"><p>'+f.a[LANG]+'</p></div>';
    el.querySelector('button').addEventListener('click',function(){el.classList.toggle('open');});
    g.appendChild(el);
  });
}
/* ====== I18N APPLY ====== */
function applyLang(){
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-i18n]').forEach(function(e){var k=e.getAttribute('data-i18n');if(I18N[LANG][k]!==undefined)e.textContent=I18N[LANG][k];});
  renderCars();renderFaq();if(selCar)renderCalc();
}
document.querySelectorAll('.lang button').forEach(function(b){
  b.addEventListener('click',function(){LANG=b.dataset.lang;document.querySelectorAll('.lang button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');applyLang();});
});

/* ====== ZIP ====== */
document.getElementById('zip').addEventListener('input',function(e){zipVal=e.target.value.replace(/\D/g,'');e.target.value=zipVal;if(selCar)renderCalc();});
/* ====== PKG TABS (mobile) ====== */
document.addEventListener('click',function(e){
  var tab=e.target.closest('.pkg-tab');if(!tab)return;
  var idx=parseInt(tab.dataset.pkgIdx,10);
  document.querySelectorAll('.pkg-tab').forEach(function(t){t.classList.remove('on');});
  tab.classList.add('on');
  if(window.innerWidth<=880){document.querySelectorAll('#pkgs .pkg').forEach(function(p,j){p.style.display=j===idx?'':'none';});}
});

/* ====== PLATE LOOKUP (main page) ====== */
function mapDmrToCar(data){
  // usageCode from normalized route.js (Danish "anvBeskrivelse" → usageCode)
  var kind=(data.usageCode||data.kind||'').toLowerCase();
  if(kind.includes('vare')||kind.includes('lastbil')||kind.includes('truck')||kind.includes('van'))return 'varebil';
  if(kind.includes('person')||kind.includes('privat')){}// continue to weight check
  var w=Number(data.totalWeight||data.weight||0);
  if(w>0){
    if(w<1250)return 'lille';
    if(w<1600)return 'mellem';
    if(w<2500)return 'stor';
    return 'varebil';
  }
  var make=(data.make||'').toLowerCase();
  var model=(data.model||'').toLowerCase();
  var full=make+' '+model;
  var vanCars=['transit','caddy','berlingo','partner','jumpy','master','ducato','sprinter','vito','crafter','trafic'];
  var largeCars=['passat','a4','a6','5-series','e-class','3-series','touareg','q5','q7','x5','cx-5','rav4','discovery','land rover','xc90','xc60','stationcar','verso','outlander','sorento'];
  var smallCars=['aygo','up!','up ','i10','i20','polo','fiesta','208','fabia','yaris','corsa','swift','twingo','smart','picanto','rio','ibiza','107','108','c1','vw lupo'];
  for(var i=0;i<vanCars.length;i++){if(full.includes(vanCars[i]))return 'varebil';}
  for(var i=0;i<largeCars.length;i++){if(full.includes(largeCars[i]))return 'stor';}
  for(var i=0;i<smallCars.length;i++){if(full.includes(smallCars[i]))return 'lille';}
  return 'mellem';
}
function selectCarById(id){
  var c=CARS.filter(function(x){return x.id===id;})[0];
  if(!c)return;
  selCar=c;renderCars();renderCalc();
  var cal=document.getElementById('calc');cal.classList.add('show');
  setTimeout(function(){cal.scrollIntoView({behavior:'smooth',block:'nearest'});},60);
}
var plateBtn=document.getElementById('plateLookupBtn');
var plateInput=document.getElementById('plateInput');
var plateResult=document.getElementById('plateResult');
function showPlateResult(html,type){
  plateResult.style.display='block';
  plateResult.className='plate-result plate-result-'+type;
  plateResult.innerHTML=html;
}
function fetchPlate(plate){
  // Try client-side direct fetch first (bypasses Vercel network restrictions)
  return fetch('https://www.tjekbil.dk/api/v3/dmr/plate/'+plate,{headers:{'Accept':'application/json'}})
    .then(function(r){if(!r.ok)throw new Error('tjekbil '+r.status);return r.json();})
    .then(function(d){
      if(!d||d.error||(!d.make&&!d.mærke&&!d.brand))throw new Error('no data');
      // normalize client-side
      var make=d.make||d.brand||d.mærke||d.maerke||'';
      var model=d.model||d.modelBetegnelse||d.Model||'';
      var w=Number(d.totalWeight||d.totalVaegt||d.tekniskTotalvægt||0);
      var usage=d.usageCode||d.anvBeskrivelse||d.anvendelsesBeskrivelse||'';
      return {make:make,model:model,variant:d.variant||'',firstRegistration:d.firstRegistration||d.registreringsDato||d.foersteRegistreringsDato||'',totalWeight:w,usageCode:usage};
    })
    .catch(function(){
      // Fall back to our server proxy
      return fetch('/api/plate?plate='+encodeURIComponent(plate)).then(function(r){return r.json();});
    });
}
function doLookup(){
  var plate=plateInput.value.replace(/\s/g,'').toUpperCase();
  if(plate.length<2){showPlateResult('<span>'+(LANG==='da'?'Indtast en gyldig nummerplade':'Enter a valid plate number')+'</span>','err');return;}
  plateBtn.disabled=true;
  plateBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>'+(LANG==='da'?'Søger...':'Searching...')+'</span>';
  fetchPlate(plate)
    .then(function(r){return r.json();})
    .then(function(data){
      plateBtn.disabled=false;
      plateBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><span data-i18n="plate_search">'+(LANG==='da'?'Slå op':'Search')+'</span>';
      if(data.error){showPlateResult('<span>'+(LANG==='da'?'Bilen blev ikke fundet. Prøv igen eller vælg manuelt.':'Car not found. Try again or select manually.')+'</span>','err');return;}
      var make=data.make||'';var model=data.model||'';var variant=data.variant||'';
      var year=data.firstRegistration?(data.firstRegistration+'').substring(0,4):'';
      var carId=data.category||mapDmrToCar(data);
      var carObj=CARS.filter(function(c){return c.id===carId;})[0];
      var carLabel=carObj?carObj.label[LANG]:'';
      var html='<div class="plate-found">';
      html+='<div class="plate-car-info"><div class="plate-car-title"><strong>'+(make+' '+model+(variant?' '+variant:'')).trim()+'</strong>'+(year?' ('+year+')':'')+'</div>';
      html+='<div class="plate-car-type"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'+(LANG==='da'?'Kategoriseret som: ':'Categorized as: ')+'<strong>'+carLabel+'</strong></div></div>';
      html+='<button class="btn btn-green plate-select-btn" id="plateSelectBtn">'+(LANG==='da'?'Se priser for denne bil':'See prices for this car')+'</button></div>';
      showPlateResult(html,'ok');
      document.getElementById('plateSelectBtn').addEventListener('click',function(){
        selectCarById(carId);
        document.getElementById('vaelg').scrollIntoView({behavior:'smooth',block:'start'});
      });
    })
    .catch(function(){
      plateBtn.disabled=false;
      plateBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><span>'+(LANG==='da'?'Slå op':'Search')+'</span>';
      showPlateResult('<span>'+(LANG==='da'?'Forbindelsesfejl. Prøv igen.':'Connection error. Please try again.')+'</span>','err');
    });
}
/* ====== PLATE localStorage ====== */
(function(){
  try{
    var saved=localStorage.getItem('ev_plate');
    if(saved&&plateInput){
      plateInput.value=saved;
      // Show suggestion chip above the input
      var wrap=plateInput.parentElement;
      if(wrap&&!document.getElementById('plateSuggestion')){
        var chip=document.createElement('div');
        chip.id='plateSuggestion';
        chip.style.cssText='display:flex;align-items:center;gap:8px;margin-bottom:8px;font-size:13px;color:var(--muted)';
        chip.innerHTML=(LANG==='da'?'Sidst søgt: ':'Last searched: ')+'<button style="background:var(--green);color:#fff;border:none;border-radius:20px;padding:3px 12px;font-size:13px;font-weight:600;cursor:pointer" id="plateUseSaved">'+saved+'</button>';
        wrap.insertBefore(chip,plateInput);
        document.getElementById('plateUseSaved').addEventListener('click',function(){
          plateInput.value=saved;doLookup();
        });
      }
    }
  }catch(e){}
})();
function savePlate(plate){try{if(plate)localStorage.setItem('ev_plate',plate);}catch(e){}}
if(plateBtn){
  plateBtn.addEventListener('click',doLookup);
  plateInput.addEventListener('keydown',function(e){if(e.key==='Enter')doLookup();});
  plateInput.addEventListener('input',function(){plateInput.value=plateInput.value.toUpperCase();});
}
// Save plate on successful lookup
var _origShowPlate=showPlateResult;
showPlateResult=function(html,type){_origShowPlate(html,type);if(type==='ok')savePlate(plateInput.value.replace(/\s/g,'').toUpperCase());};

/* ====== FLOW STEP 3 = open booking ====== */
var flowBook3=document.getElementById('flowBook3');
if(flowBook3){flowBook3.addEventListener('click',function(e){e.preventDefault();openWiz();});}

/* ====== BEFORE/AFTER SLIDER ====== */
(function(){
  var sl=document.getElementById('baSlider'),af=document.getElementById('baAfter'),hd=document.getElementById('baHandle');
  function setPos(x){
    var r=sl.getBoundingClientRect();var p=(x-r.left)/r.width;p=Math.max(0,Math.min(1,p));
    af.style.clipPath='inset(0 0 0 '+(p*100)+'%)';hd.style.left=(p*100)+'%';
  }
  var drag=false;
  sl.addEventListener('mousedown',function(e){drag=true;setPos(e.clientX);});
  window.addEventListener('mousemove',function(e){if(drag)setPos(e.clientX);});
  window.addEventListener('mouseup',function(){drag=false;});
  sl.addEventListener('touchstart',function(e){drag=true;setPos(e.touches[0].clientX);},{passive:true});
  sl.addEventListener('touchmove',function(e){if(drag)setPos(e.touches[0].clientX);},{passive:true});
  window.addEventListener('touchend',function(){drag=false;});
})();

/* ====== BOOKING WIZARD ====== */
var modal=document.getElementById('modal'),wizBody=document.getElementById('wizBody'),wizProg=document.getElementById('wizProg');
var wiz={car:null,pkg:null,extras:[],addr:"",zip:"",city:"",date:"",time:"",name:"",phone:"",email:"",msg:""};
var step=1, TOTAL=7;
function W(k){return WIZ[LANG][k]||k;}
function openWiz(car,pkg){wiz.car=car||selCar||CARS[0];wiz.pkg=pkg||PKGS[0];wiz.zip=zipVal;wiz.extras=[];step=1;modal.classList.add('open');document.body.style.overflow='hidden';drawWiz();}
function closeWiz(){modal.classList.remove('open');document.body.style.overflow='';}
document.getElementById('wizClose').addEventListener('click',closeWiz);
modal.addEventListener('click',function(e){if(e.target===modal)closeWiz();});
document.querySelectorAll('[data-book]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openWiz();});});
function progress(){var h='';for(var i=1;i<=TOTAL;i++)h+='<span class="'+(i<=step?'done':'')+'"></span>';wizProg.innerHTML=h;}

function doWizPlateLookup(inputEl,resultEl,btnEl){
  var plate=(inputEl.value||'').replace(/\s/g,'').toUpperCase();
  if(plate.length<2){resultEl.style.display='block';resultEl.className='wiz-plate-result err';resultEl.innerHTML=LANG==='da'?'Indtast en gyldig nummerplade':'Enter a valid plate number';return;}
  btnEl.disabled=true;
  btnEl.innerHTML='<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>';
  fetchPlate(plate)
    .then(function(data){
      btnEl.disabled=false;btnEl.textContent=W('plate_search');
      if(data.error){resultEl.style.display='block';resultEl.className='wiz-plate-result err';resultEl.innerHTML=LANG==='da'?'Bil ikke fundet. Vælg manuelt.':'Car not found. Select manually.';return;}
      var carId=data.category||mapDmrToCar(data);
      var carObj=CARS.filter(function(c){return c.id===carId;})[0];
      if(carObj){
        wiz.car=carObj;
        resultEl.style.display='block';resultEl.className='wiz-plate-result ok';
        var make=(data.make||'');var model=(data.model||'');var year=data.firstRegistration?(data.firstRegistration+'').substring(0,4):'';
        resultEl.innerHTML='<strong>'+(make+' '+model).trim()+(year?' ('+year+')':'')+'</strong> → <strong style="color:var(--green)">'+carObj.label[LANG]+'</strong>';
        // highlight the matching car option
        wizBody.querySelectorAll('[data-car]').forEach(function(o){o.classList.toggle('sel',o.dataset.car===carId);});
      }
    })
    .catch(function(){btnEl.disabled=false;btnEl.textContent=W('plate_search');resultEl.style.display='block';resultEl.className='wiz-plate-result err';resultEl.innerHTML=LANG==='da'?'Fejl. Prøv igen.':'Error. Try again.';});
}

function drawWiz(){
  progress();
  var h='<div class="wiz-stepnum">'+W('step')+' '+step+' '+W('of')+' '+TOTAL+'</div>';
  if(step===1){
    h+='<div class="wiz-q">'+W('s1')+'</div>';
    // plate lookup widget
    h+='<div class="wiz-plate-row">';
    h+='<div class="wiz-plate-dk"><div class="wiz-plate-flag"><svg viewBox="0 0 20 28" width="18" height="24" fill="none"><rect width="20" height="28" fill="#C60C30"/><rect x="6" y="0" width="4" height="28" fill="white"/><rect x="0" y="12" width="20" height="4" fill="white"/></svg><span>DK</span></div>';
    h+='<input id="wizPlateInput" type="text" maxlength="8" placeholder="AB 12 345" autocomplete="off"></div>';
    h+='<button id="wizPlateLookupBtn" class="btn btn-green wiz-plate-lookup">'+W('plate_search')+'</button>';
    h+='</div>';
    h+='<div id="wizPlateResult" class="wiz-plate-result" style="display:none"></div>';
    h+='<div class="plate-divider" style="margin:14px 0 10px"><span>'+W('plate_or')+'</span></div>';
    h+='<div class="opt-grid">';
    CARS.forEach(function(c){h+='<div class="opt'+(wiz.car&&wiz.car.id===c.id?' sel':'')+'" data-car="'+c.id+'">'+svgWrap(c.svg,46,26)+'<span>'+c.label[LANG]+'</span></div>';});
    h+='</div>';
  }else if(step===2){
    h+='<div class="wiz-q">'+W('s2')+'</div><div class="opt-row">';
    PKGS.forEach(function(p){var price=wiz.car?wiz.car.prices[p.id]:0;h+='<div class="opt opt-wide'+(wiz.pkg&&wiz.pkg.id===p.id?' sel':'')+'" data-pkg="'+p.id+'"><span>'+p.name[LANG]+'</span><span class="op">'+fmtKr(price)+'</span></div>';});
    h+='</div>';
  }else if(step===3){
    h+='<div class="wiz-q">'+W('s3')+'</div>';
    h+='<p style="font-size:13px;color:var(--muted);margin-bottom:12px">'+(LANG==='da'?'Vælg hvad du vil tilføje. Pris tillægges automatisk.':'Choose extras to add. Price is calculated automatically.')+'</p>';
    h+='<div class="extras-grid">';
    EXTRAS.forEach(function(ex){
      var sel=wiz.extras.indexOf(ex.id)>=0;
      h+='<div class="extra-item'+(sel?' sel':'')+'" data-ext="'+ex.id+'">';
      h+='<div class="ex-name">'+ex.name[LANG]+'</div>';
      h+='<div class="ex-price">+'+fmtKr(ex.price)+'</div>';
      h+='<div class="ex-desc">'+ex.desc[LANG]+'</div>';
      h+='</div>';
    });
    h+='</div>';
  }else if(step===4){
    h+='<div class="wiz-q">'+W('s4')+'</div>';
    h+='<div class="field"><label>'+W('addr')+'</label><input id="f_addr" value="'+wiz.addr+'" placeholder="Vejnavn 12"></div>';
    h+='<div class="field"><div class="row2"><div><label>'+W('zip')+'</label><input id="f_zip" inputmode="numeric" maxlength="4" value="'+(wiz.zip||"")+'" placeholder="4700"></div><div><label>'+W('city')+'</label><input id="f_city" value="'+wiz.city+'" placeholder="Næstved"></div></div></div>';
  }else if(step===5){
    var minD=(function(){var d=new Date();d.setDate(d.getDate()+1);return d.toISOString().split('T')[0];})();
    h+='<div class="wiz-q">'+W('s5')+'</div>';
    h+='<div class="field"><label>'+W('date')+'</label><input id="f_date" type="date" value="'+wiz.date+'" min="'+minD+'"></div>';
    h+='<div class="field"><label>'+(LANG==='da'?'Vælg tidspunkt':'Choose time')+'</label>';
    h+='<div class="slot-grid" id="slotGrid">';
    var SLOTS=['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
    if(!wiz.date){
      h+='<div class="slot-hint">'+(LANG==='da'?'Vælg dato først':'Choose date first')+'</div>';
    }else{
      SLOTS.forEach(function(s){
        h+='<button class="slot'+(wiz.time===s?' sel':'')+'" data-slot="'+s+'">'+s+'</button>';
      });
    }
    h+='</div></div>';
  }else if(step===6){
    h+='<div class="wiz-q">'+W('s6')+'</div>';
    h+='<div class="field"><label>'+W('name')+'</label><input id="f_name" value="'+wiz.name+'" placeholder="Dit navn"></div>';
    h+='<div class="field"><label>'+W('phone')+'</label><input id="f_phone" inputmode="tel" value="'+wiz.phone+'" placeholder="12 34 56 78"></div>';
    h+='<div class="field"><label>'+W('email')+'</label><input id="f_email" value="'+wiz.email+'" placeholder="dig@mail.dk"></div>';
    h+='<div class="field"><label>'+W('msg')+'</label><textarea id="f_msg" rows="2">'+wiz.msg+'</textarea></div>';
  }else if(step===7){
    var fee=driveFee(wiz.zip);
    var price=wiz.car?wiz.car.prices[wiz.pkg?wiz.pkg.id:'hele']:0;
    var extPrice=wiz.extras.reduce(function(s,id){var e=EXTRAS.filter(function(x){return x.id===id;})[0];return s+(e?e.price:0);},0);
    var tot=price+fee+extPrice;
    h+='<div class="wiz-q">'+(LANG==="da"?"Gennemse & send":"Review & send")+'</div>';
    h+='<div class="summary">';
    h+='<div class="sr"><span class="k">'+W('sumcar')+'</span><span class="v">'+(wiz.car?wiz.car.label[LANG]:'-')+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('sumpkg')+'</span><span class="v">'+(wiz.pkg?wiz.pkg.name[LANG]:'-')+'</span></div>';
    if(wiz.extras.length>0){
      var extNames=wiz.extras.map(function(id){var e=EXTRAS.filter(function(x){return x.id===id;})[0];return e?e.name[LANG]:'';}).join(', ');
      h+='<div class="sr"><span class="k">'+W('sumext')+'</span><span class="v">'+extNames+'</span></div>';
    }
    h+='<div class="sr"><span class="k">'+W('addr')+'</span><span class="v">'+(wiz.addr||"-")+' '+(wiz.zip||"")+' '+(wiz.city||"")+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('date')+'</span><span class="v">'+(wiz.date||"-")+' '+(wiz.time||"")+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('name')+'</span><span class="v">'+(wiz.name||"-")+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('phone')+'</span><span class="v">'+(wiz.phone||"-")+'</span></div>';
    if(fee>0)h+='<div class="sr"><span class="k">'+(LANG==="da"?"Kørsel":"Travel")+'</span><span class="v">'+fmtKr(fee)+'</span></div>';
    if(extPrice>0)h+='<div class="sr"><span class="k">'+W('sumext')+'</span><span class="v">'+fmtKr(extPrice)+'</span></div>';
    h+='<div class="sr tot"><span class="k">'+W('sumprice')+'</span><span class="v">'+fmtKr(tot)+'</span></div>';
    h+='</div>';
  }else if(step===8){
    h='<div class="wiz-done"><div class="chk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div><h3>'+W('done_t')+'</h3><p>'+W('done_p')+'</p><div class="wiz-nav"><a class="btn wiz-back" href="tel:+4524440321">'+(LANG==="da"?"Ring i stedet":"Call instead")+'</a><button class="btn btn-green" id="wizFinish">'+W('close')+'</button></div></div>';
    wizBody.innerHTML=h;wizProg.querySelectorAll('span').forEach(function(s){s.classList.add('done');});
    document.getElementById('wizFinish').addEventListener('click',closeWiz);
    return;
  }
  h+='<div class="wiz-nav">';
  if(step>1)h+='<button class="btn wiz-back" id="wizBack">'+W('back')+'</button>';
  h+='<button class="btn btn-green" id="wizNext">'+(step===TOTAL?W('send'):W('next'))+'</button>';
  h+='</div>';
  wizBody.innerHTML=h;
  // bind step 1 plate lookup
  if(step===1){
    var wpi=document.getElementById('wizPlateInput');
    var wpr=document.getElementById('wizPlateResult');
    var wpb=document.getElementById('wizPlateLookupBtn');
    if(wpi)wpi.addEventListener('input',function(){wpi.value=wpi.value.toUpperCase();});
    if(wpb){wpb.addEventListener('click',function(){doWizPlateLookup(wpi,wpr,wpb);});wpi.addEventListener('keydown',function(e){if(e.key==='Enter')doWizPlateLookup(wpi,wpr,wpb);});}
  }
  // bind step 5 date+slot
  if(step===5){
    var fd=document.getElementById('f_date');
    if(fd){
      fd.addEventListener('change',function(){wiz.date=fd.value;wiz.time='';loadSlots(fd.value);});
      if(wiz.date)loadSlots(wiz.date);
    }
    document.addEventListener('click',function slotClick(e){
      var s=e.target.closest('.slot');if(!s||s.classList.contains('booked'))return;
      document.querySelectorAll('#slotGrid .slot').forEach(function(x){x.classList.remove('sel');});
      s.classList.add('sel');wiz.time=s.dataset.slot;
    },{once:false});
  }
  // bind car options
  wizBody.querySelectorAll('[data-car]').forEach(function(o){o.addEventListener('click',function(){wiz.car=CARS.filter(function(c){return c.id===o.dataset.car;})[0];wizBody.querySelectorAll('[data-car]').forEach(function(x){x.classList.remove('sel');});o.classList.add('sel');});});
  // bind package options
  wizBody.querySelectorAll('[data-pkg]').forEach(function(o){o.addEventListener('click',function(){wiz.pkg=PKGS.filter(function(p){return p.id===o.dataset.pkg;})[0];wizBody.querySelectorAll('[data-pkg]').forEach(function(x){x.classList.remove('sel');});o.classList.add('sel');});});
  // bind extras (multi-select toggle)
  wizBody.querySelectorAll('[data-ext]').forEach(function(o){o.addEventListener('click',function(){var id=o.dataset.ext;var idx=wiz.extras.indexOf(id);if(idx>=0){wiz.extras.splice(idx,1);o.classList.remove('sel');}else{wiz.extras.push(id);o.classList.add('sel');}});});
  var bk=document.getElementById('wizBack');if(bk)bk.addEventListener('click',function(){saveStep();step--;drawWiz();});
  document.getElementById('wizNext').addEventListener('click',function(){
    saveStep();
    if(step<TOTAL){step++;drawWiz();}
    else{
      var btn=document.getElementById('wizNext');
      if(btn){btn.disabled=true;btn.textContent=(LANG==='da'?'Sender...':'Sending...');}
      submitBooking(function(err){
        if(err){
          if(btn){btn.disabled=false;btn.textContent=W('send');}
          var errEl=document.getElementById('wiz-err');
          if(!errEl){errEl=document.createElement('p');errEl.id='wiz-err';errEl.style.cssText='color:#c0392b;font-size:13px;margin-top:8px;text-align:center';wizBody.appendChild(errEl);}
          errEl.textContent=err;
        }else{step=8;drawWiz();}
      });
    }
  });
}
function saveStep(){
  if(step===4){wiz.addr=val('f_addr');wiz.zip=val('f_zip');wiz.city=val('f_city');}
  if(step===5){wiz.date=val('f_date');}// time saved on slot click
  if(step===6){wiz.name=val('f_name');wiz.phone=val('f_phone');wiz.email=val('f_email');wiz.msg=val('f_msg');}
}
function loadSlots(date){
  var grid=document.getElementById('slotGrid');if(!grid)return;
  var SLOTS=['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00'];
  grid.innerHTML='<div class="slot-hint" style="grid-column:1/-1">'+(LANG==='da'?'Henter ledige tider…':'Loading available times…')+'</div>';
  fetch('/api/book?date='+encodeURIComponent(date))
    .then(function(r){return r.json();})
    .then(function(res){
      var booked=(res.booked||[]);
      grid.innerHTML=SLOTS.map(function(s){
        var isBooked=booked.indexOf(s)>=0;
        var isSel=wiz.time===s;
        return '<button class="slot'+(isBooked?' booked':isSel?' sel':'')+'" data-slot="'+s+'"'+(isBooked?' disabled title="'+(LANG==='da'?'Optaget':'Booked')+'"':'')+'>'+s+(isBooked?' 🔴':'')+'</button>';
      }).join('');
      grid.querySelectorAll('.slot:not(.booked)').forEach(function(btn){
        btn.addEventListener('click',function(){
          grid.querySelectorAll('.slot').forEach(function(x){x.classList.remove('sel');});
          btn.classList.add('sel');wiz.time=btn.dataset.slot;
        });
      });
    })
    .catch(function(){
      grid.innerHTML=SLOTS.map(function(s){
        var isSel=wiz.time===s;
        return '<button class="slot'+(isSel?' sel':'')+'" data-slot="'+s+'">'+s+'</button>';
      }).join('');
      grid.querySelectorAll('.slot').forEach(function(btn){
        btn.addEventListener('click',function(){
          grid.querySelectorAll('.slot').forEach(function(x){x.classList.remove('sel');});
          btn.classList.add('sel');wiz.time=btn.dataset.slot;
        });
      });
    });
}
function val(id){var e=document.getElementById(id);return e?e.value:'';}

function submitBooking(cb){
  var fee=driveFee(wiz.zip);
  var price=wiz.car?wiz.car.prices[wiz.pkg?wiz.pkg.id:'hele']:0;
  var extPrice=wiz.extras.reduce(function(s,id){var e=EXTRAS.filter(function(x){return x.id===id;})[0];return s+(e?e.price:0);},0);
  var tot=price+fee+extPrice;
  var L=(LANG==="da");
  var extList=wiz.extras.length>0?wiz.extras.map(function(id){var e=EXTRAS.filter(function(x){return x.id===id;})[0];return e?e.name[LANG]:'';}).join(', '):(L?"Ingen":"None");
  var priceStr=fmtKr(tot)+(fee>0?(" ("+(L?"inkl. kørsel ":"incl. travel ")+fmtKr(fee)+")"):"");
  fetch('/api/book',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      car:wiz.car?wiz.car.label[LANG]:'-',
      pkg:wiz.pkg?wiz.pkg.name[LANG]:'-',
      extras:extList,
      addr:wiz.addr,zip:wiz.zip,city:wiz.city,
      date:wiz.date,time:wiz.time,
      name:wiz.name,phone:wiz.phone,email:wiz.email,msg:wiz.msg,
      price:priceStr,lang:LANG
    })
  }).then(function(r){
    return r.json().then(function(d){return {status:r.status,data:d};});
  }).then(function(res){
    if(res.status===409&&res.data&&res.data.message){cb(res.data.message);}
    else{cb(null);}
  }).catch(function(){cb(null);});
}

/* ====== LIGHTBOX ====== */
(function(){
  var lb=document.getElementById('lightbox'),img=document.getElementById('lbImg');
  document.querySelectorAll('.gitem').forEach(function(g){
    g.addEventListener('click',function(){img.src=g.dataset.full;lb.classList.add('open');document.body.style.overflow='hidden';});
  });
  function close(){lb.classList.remove('open');document.body.style.overflow='';img.src='';}
  document.getElementById('lbClose').addEventListener('click',close);
  lb.addEventListener('click',function(e){if(e.target===lb)close();});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
})();

/* ====== CHATBOT ====== */
(function(){
  var toggle=document.getElementById('chatToggle');
  var win=document.getElementById('chatWindow');
  var msgs=document.getElementById('chatMessages');
  var quick=document.getElementById('chatQuick');
  var input=document.getElementById('chatInput');
  var send=document.getElementById('chatSend');
  var badge=document.getElementById('chatBadge');
  if(!toggle)return;
  var opened=false;
  var FAQ_BOT={
    da:[
      {keys:['pris','kost','hvad kost','priser'],ans:'Priser starter fra 500 kr for udvendig vask, og 800 kr for komplet vask. Det afhænger af bilens størrelse og pakke. <a href="#vaelg">Se alle priser her</a>.'},
      {keys:['tid','lang','timer','varighed'],ans:'Typisk tager en vask 1–4 timer afhængigt af pakken og bilens størrelse.'},
      {keys:['sjælland','dækker','område','kjer','adresse','kører'],ans:'Vi dækker hele Sjælland – inkl. Storkøbenhavn, Nordsjælland og Sydsjælland. Vi kører ud til dig!'},
      {keys:['book','bestil','tid'],ans:'Du kan booke direkte her på siden. Klik på "Book nu" eller <a href="#vaelg">vælg din bil og pakke</a> for at komme i gang.'},
      {keys:['damp','dampvask','miljø','vand'],ans:'Dampvask bruger varm damp med minimalt vandforbrug. Det renser skånsomt, desinficerer og er miljøvenligt.'},
      {keys:['leasing','lease','aflevering'],ans:'Ja! Vi tilbyder Returklargøring specielt til aflevering af leasingbiler. Ring til os for en aftale.'},
      {keys:['motor','motorrens'],ans:'Ja, vi tilbyder motorrens som tilvalg (+300 kr). Det kan tilføjes til enhver pakke.'},
      {keys:['hjem','hjemme','arbejde'],ans:'Ja, vi er 100% mobile. Vi kører ud til din adresse – hjemme, på arbejdet eller hvad der passer dig.'},
      {keys:['kontakt','ring','telefon','nummer'],ans:'Du kan ringe til os på <a href="tel:+4524440321">+45 24 44 03 21</a> eller skrive til alirezadk2021@gmail.com'},
      {keys:['firma','adresse','kontor','søborg'],ans:'Firmaadresse: Høje Gladsaxe 17, 2860 Søborg. Men vi kører ud til dig – du behøver ikke komme til os!'},
    ],
    en:[
      {keys:['price','cost','how much','prices'],ans:'Prices start from 500 kr for exterior wash, and 800 kr for full wash. Depends on car size and package. <a href="#vaelg">See all prices here</a>.'},
      {keys:['time','long','hours','duration'],ans:'Typically 1–4 hours depending on package and car size.'},
      {keys:['zealand','area','cover','where'],ans:'We cover all of Zealand – including Greater Copenhagen, North Zealand and South Zealand. We drive to you!'},
      {keys:['book','order','reserve'],ans:'You can book directly on this page. Click "Book now" or <a href="#vaelg">select your car and package</a> to get started.'},
      {keys:['steam','eco','water','environment'],ans:'Steam washing uses hot steam with minimal water. It cleans gently, disinfects and is eco-friendly.'},
      {keys:['lease','leasing','return'],ans:'Yes! We offer a Lease Return package specially made for returning lease cars.'},
      {keys:['engine','engine clean'],ans:'Yes, we offer engine cleaning as an add-on (+300 kr). Can be added to any package.'},
      {keys:['home','address','workplace'],ans:'Yes, we are 100% mobile. We drive to your address – at home, at work, wherever suits you.'},
      {keys:['contact','call','phone','number'],ans:'You can call us at <a href="tel:+4524440321">+45 24 44 03 21</a> or email alirezadk2021@gmail.com'},
      {keys:['office','address','company','søborg'],ans:'Company address: Høje Gladsaxe 17, 2860 Søborg. But we drive to you – you don\'t need to come to us!'},
    ]
  };
  var QUICK={
    da:['Hvad koster det?','Hvor lang tid?','Dækker I mit område?','Kan I vaske leasingbil?'],
    en:['What does it cost?','How long does it take?','Do you cover my area?','Can you clean lease cars?']
  };
  function addMsg(text,who){
    var d=document.createElement('div');d.className='chat-msg '+who;d.innerHTML=text;msgs.appendChild(d);msgs.scrollTop=msgs.scrollHeight;
  }
  function botReply(text){
    var faq=FAQ_BOT[LANG]||FAQ_BOT.da;
    var tl=text.toLowerCase();
    var found=null;
    for(var i=0;i<faq.length;i++){for(var j=0;j<faq[i].keys.length;j++){if(tl.includes(faq[i].keys[j])){found=faq[i].ans;break;}}if(found)break;}
    if(!found)found=LANG==='da'?'Det ved jeg ikke helt. Ring til os på <a href="tel:+4524440321">+45 24 44 03 21</a> – vi hjælper gerne!':'I\'m not sure about that. Call us at <a href="tel:+4524440321">+45 24 44 03 21</a> – we\'re happy to help!';
    setTimeout(function(){addMsg(found,'bot');},500);
  }
  function sendMsg(){
    var txt=input.value.trim();if(!txt)return;
    addMsg(txt,'user');input.value='';
    quick.innerHTML='';
    botReply(txt);
  }
  function showQuick(){
    quick.innerHTML='';
    (QUICK[LANG]||QUICK.da).forEach(function(q){
      var btn=document.createElement('button');btn.className='chat-chip';btn.textContent=q;
      btn.addEventListener('click',function(){addMsg(q,'user');quick.innerHTML='';botReply(q);});
      quick.appendChild(btn);
    });
  }
  toggle.addEventListener('click',function(){
    if(!opened){
      win.style.display='flex';win.style.flexDirection='column';
      badge.style.display='none';opened=true;
      if(msgs.children.length===0){
        addMsg(LANG==='da'?'Hej! 👋 Jeg er Elite Vaskes bot. Hvad kan jeg hjælpe dig med?':'Hi! 👋 I\'m Elite Vask\'s bot. How can I help you?','bot');
        showQuick();
      }
    }else{win.style.display='none';opened=false;}
  });
  document.getElementById('chatClose').addEventListener('click',function(){win.style.display='none';opened=false;});
  send.addEventListener('click',sendMsg);
  input.addEventListener('keydown',function(e){if(e.key==='Enter')sendMsg();});
})();

/* ====== HAMBURGER DRAWER ====== */
(function(){
  var btn=document.getElementById('menuBtn');
  var drawer=document.getElementById('navDrawer');
  if(!btn||!drawer)return;
  btn.addEventListener('click',function(){
    drawer.classList.toggle('open');
    btn.classList.toggle('open');
  });
  // close on any drawer link click
  drawer.querySelectorAll('.drawer-link,.drawer-book,.drawer-call').forEach(function(el){
    el.addEventListener('click',function(){drawer.classList.remove('open');btn.classList.remove('open');});
  });
  // lang buttons in drawer
  drawer.querySelectorAll('[data-lang]').forEach(function(el){
    el.addEventListener('click',function(){
      LANG=el.getAttribute('data-lang');
      localStorage.setItem('lang',LANG);
      applyLang();
      drawer.classList.remove('open');btn.classList.remove('open');
    });
  });
  // close on outside click
  document.addEventListener('click',function(e){
    if(drawer.classList.contains('open')&&!drawer.contains(e.target)&&e.target!==btn&&!btn.contains(e.target)){
      drawer.classList.remove('open');btn.classList.remove('open');
    }
  });
})();

/* ====== MOBILE PARALLAX ====== */
if(window.innerWidth<=880){
  var heroBg=document.querySelector('.hero-bg-img');
  if(heroBg){
    window.addEventListener('scroll',function(){
      var y=window.scrollY;
      heroBg.style.transform='translateY('+Math.round(y*0.35)+'px)';
    },{passive:true});
  }
}

applyLang();
}
