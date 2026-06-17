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
  da:{tb_local:"Lokalt firma på Sjælland",tb_ins:"Forsikret virksomhed",tb_rating:"Google anmeldelser",tb_mobile:"Mobil dampvask",nav_choose:"Vælg bil",nav_work:"Vores arbejde",nav_reviews:"Anmeldelser",nav_contact:"Kontakt",nav_book:"Book nu",hero_badge:"Vi kører til dig – hele Sjælland",hero_h1a:"Vi kører til dig",hero_h1b:"og vasker din bil",hero_p:"Mobil bil dampvask med premium produkter. Rent, effektivt og miljøvenligt – uden at du forlader hjemmet.",flow1:"Indtast nummerplade",flow2:"Se pris",flow3:"Book tid",hero_cta1:"Slå nummerplade op",hero_cta2:"Book med det samme",hero_t1:"Rent",hero_t2:"Effektivt",hero_t3:"Miljøvenligt",plate_search:"Slå op",plate_or:"– eller vælg manuelt –",sel_eyebrow:"Trin 1 af 2",sel_title:"Find pris til din bil",sel_sub:"Indtast din nummerplade – vi finder bilen automatisk og viser prisen med det samme.",calc_head_p:"Vælg den pakke der passer til dig",calc_zip:"Postnr.",calc_note:"Priserne er vejledende. Kørsel beregnes ud fra postnummer. Endelig pris bekræftes ved booking.",st1:"Skånsom rensemetode",st2:"Typisk behandlingstid",st3:"Mobil – vi kører ud",st4:"Vores serviceområde",how_eyebrow:"Sådan virker det",how_title:"3 nemme trin",how1t:"Vælg og book",how1p:"Vælg biltype og pakke, og book en tid på få minutter.",how2t:"Vi kører ud",how2p:"Vi ankommer med alt udstyr direkte til din adresse.",how3t:"Bilen skinner",how3p:"Nyd en ren, frisk bil. Du behøvede ikke flytte dig.",ba_eyebrow:"Vores arbejde",ba_title:"Før & efter",ba_sub:"Træk i slideren for at se forskellen. Rigtige resultater fra vores kunder.",ba_cap:"Motorrens · Peugeot – afrenset med damp",gal_eyebrow:"Galleri",gal_title:"Billeder fra vores arbejde",g_seat_for:"Sæderens · før",g_seat_efter:"Sæderens · efter",g_floor_for:"Fodrum · før",g_floor_efter:"Fodrum · efter",g_fuel_for:"Tankdæksel · før",g_fuel_efter:"Tankdæksel · efter",g_roof:"Tagkant · algerens",g_pedal:"Pedalområde · rens",g_onsite:"Mobil dampvask · på stedet",ex_eyebrow:"Tilvalg",ex_title:"Ekstra ydelser",ex_sub:"Kan tilføjes til enhver pakke. Indgår i Guld pakken.",ex1t:"Motorrens",ex1p:"Grundig afrensning af motorrum",ex2t:"Lak- & glansbeskyttelse",ex2p:"Udvendig – langvarig ekstra glans",ex3t:"Indvendig pleje & beskyttelse",ex3p:"Beskytter og fornyer interiøret",ex4t:"Fjernelse af dyrehår",ex4p:"Effektiv fjernelse af hår og fnug",ex5t:"Sæderens (stof)",ex5p:"Dybderens af stofsæder",ex6t:"Rens af barnesæde",ex6p:"Grundig og sikker rengøring",why_eyebrow:"Hvorfor vælge os",why_title:"Tillid og kvalitet i centrum",why1t:"Gennemsigtige priser",why1p:"Du kender prisen, før vi kører ud. Ingen overraskelser.",why2t:"Miljøvenlig dampvask",why2p:"Skånsom metode med minimalt vandforbrug.",why3t:"Vi kommer til dig",why3p:"Hjemme, på kontoret eller i sommerhuset.",why4t:"Tilfredshedsgaranti",why4p:"Ikke tilfreds? Så finder vi en løsning.",info_eyebrow:"Om Elite Vask",info_title:"Mød holdet bag",info_sub:"Her fortæller vi snart mere om os og det udstyr, vi bruger.",info1t:"Ejer & kontaktperson",info1p:"Navn og direkte kontakt til indehaveren tilføjes her.",info_soon:"Tilføjes snart",info2t:"Vores udstyr",info2p:"Beskrivelse af de dampmaskiner og produkter vi vasker med.",info_soon2:"Tilføjes snart",info3t:"Dækningsområde",info3p:"Vi dækker store dele af Sjælland, herunder Storkøbenhavn.",rev_eyebrow:"Kundeanmeldelser",rev_title:"Det siger vores kunder",rev_empty_t:"Anmeldelser vises her snart",rev_empty_p:"Vi forbinder vores Google Business-profil. Når den er klar, vises rigtige kundeanmeldelser automatisk her.",rev_empty_cta:"Book din vask",faq_eyebrow:"Spørgsmål & svar",faq_title:"Ofte stillede spørgsmål",local_eyebrow:"Serviceområde",local_title:"Mobil bilvask i hele Sjælland",ct_title:"Klar til en skinnende ren bil?",ct_lead:"Kontakt os i dag og book din mobile dampvask. Vi kører til dig – nemt, hurtigt og lokalt.",ct_book:"Book online nu",ct_call:"Ring til os",ct_phone:"Telefon",ct_email:"E-mail",ct_hours:"Åbningstider",ct_hours_v:"Man–Søn · 08–20",foot_p:"Mobil bil dampvask på Sjælland. Vi kører til dig og vasker din bil – rent, effektivt og miljøvenligt.",foot_s1:"Service",foot_l1:"Vælg bil & priser",foot_l2:"Vores arbejde",foot_l3:"Anmeldelser",foot_s2:"Kontakt",m_call:"Ring nu",m_book:"Book nu",wiz_title:"Book din bilvask"},
  en:{tb_local:"Local company on Zealand",tb_ins:"Insured business",tb_rating:"Google reviews",tb_mobile:"Mobile steam wash",nav_choose:"Choose car",nav_work:"Our work",nav_reviews:"Reviews",nav_contact:"Contact",nav_book:"Book now",hero_badge:"We drive to you – all of Zealand",hero_h1a:"We drive to you",hero_h1b:"and wash your car",hero_p:"Mobile car steam wash with premium products. Clean, effective and eco-friendly – without leaving home.",flow1:"Enter plate number",flow2:"See price",flow3:"Book time",hero_cta1:"Look up plate number",hero_cta2:"Book right away",hero_t1:"Clean",hero_t2:"Effective",hero_t3:"Eco-friendly",plate_search:"Search",plate_or:"– or select manually –",sel_eyebrow:"Step 1 of 2",sel_title:"Find price for your car",sel_sub:"Enter your license plate – we find your car automatically and show the price instantly.",calc_head_p:"Pick the package that suits you",calc_zip:"Zip",calc_note:"Prices are guidance. Travel is calculated from zip code. Final price confirmed at booking.",st1:"Gentle steam method",st2:"Typical service time",st3:"Mobile – we come to you",st4:"Our service area",how_eyebrow:"How it works",how_title:"3 easy steps",how1t:"Choose and book",how1p:"Pick car type and package, and book a time in minutes.",how2t:"We come to you",how2p:"We arrive with all equipment directly to your address.",how3t:"Your car shines",how3p:"Enjoy a clean, fresh car. You didn't even have to move.",ba_eyebrow:"Our work",ba_title:"Before & after",ba_sub:"Drag the slider to see the difference. Real results from our customers.",ba_cap:"Engine clean · Peugeot – steam cleaned",gal_eyebrow:"Gallery",gal_title:"Photos from our work",g_seat_for:"Seat clean · before",g_seat_efter:"Seat clean · after",g_floor_for:"Footwell · before",g_floor_efter:"Footwell · after",g_fuel_for:"Fuel cap · before",g_fuel_efter:"Fuel cap · after",g_roof:"Roof edge · algae removal",g_pedal:"Pedal area · clean",g_onsite:"Mobile steam wash · on location",ex_eyebrow:"Add-ons",ex_title:"Extra services",ex_sub:"Can be added to any package. Included in the Gold package.",ex1t:"Engine clean",ex1p:"Thorough engine bay cleaning",ex2t:"Paint & gloss protection",ex2p:"Exterior – long-lasting extra gloss",ex3t:"Interior care & protection",ex3p:"Protects and renews the interior",ex4t:"Pet hair removal",ex4p:"Effective removal of hair and lint",ex5t:"Seat clean (fabric)",ex5p:"Deep clean of fabric seats",ex6t:"Child seat cleaning",ex6p:"Thorough and safe cleaning",why_eyebrow:"Why choose us",why_title:"Trust and quality first",why1t:"Transparent prices",why1p:"You know the price before we drive out. No surprises.",why2t:"Eco-friendly steam wash",why2p:"Gentle method with minimal water use.",why3t:"We come to you",why3p:"At home, the office or the summer house.",why4t:"Satisfaction guarantee",why4p:"Not happy? Then we'll find a solution.",info_eyebrow:"About Elite Vask",info_title:"Meet the team",info_sub:"We'll soon tell you more about us and the equipment we use.",info1t:"Owner & contact",info1p:"Name and direct contact to the owner will be added here.",info_soon:"Added soon",info2t:"Our equipment",info2p:"Description of the steam machines and products we use.",info_soon2:"Added soon",info3t:"Coverage area",info3p:"We cover large parts of Zealand, including Greater Copenhagen.",rev_eyebrow:"Customer reviews",rev_title:"What our customers say",rev_empty_t:"Reviews appear here soon",rev_empty_p:"We are connecting our Google Business profile. Once ready, real customer reviews appear here automatically.",rev_empty_cta:"Book your wash",faq_eyebrow:"Questions & answers",faq_title:"Frequently asked questions",local_eyebrow:"Service area",local_title:"Mobile car wash across Zealand",ct_title:"Ready for a spotless car?",ct_lead:"Contact us today and book your mobile steam wash. We come to you – easy, fast and local.",ct_book:"Book online now",ct_call:"Call us",ct_phone:"Phone",ct_email:"Email",ct_hours:"Opening hours",ct_hours_v:"Mon–Sun · 08–20",foot_p:"Mobile car steam wash on Zealand. We drive to you and wash your car – clean, effective and eco-friendly.",foot_s1:"Service",foot_l1:"Choose car & prices",foot_l2:"Our work",foot_l3:"Reviews",foot_s2:"Contact",m_call:"Call now",m_book:"Book now",wiz_title:"Book your car wash"}
};
var WIZ={da:{step:"Trin",of:"af",s1:"Vælg biltype",s2:"Vælg pakke",s3:"Din adresse",s4:"Vælg dato & tid",s5:"Kontaktinfo",addr:"Adresse",zip:"Postnr.",city:"By",date:"Dato",time:"Tidspunkt",name:"Navn",phone:"Telefon",email:"E-mail (valgfri)",msg:"Besked (valgfri)",next:"Næste",back:"Tilbage",send:"Send anmodning",sumcar:"Bil",sumpkg:"Pakke",sumprice:"Anslået pris",done_t:"Tak for din anmodning!",done_p:"Vi kontakter dig hurtigst muligt for at bekræfte tid og pris.",close:"Luk",pick:"Vælg"},en:{step:"Step",of:"of",s1:"Choose car type",s2:"Choose package",s3:"Your address",s4:"Choose date & time",s5:"Contact info",addr:"Address",zip:"Zip",city:"City",date:"Date",time:"Time",name:"Name",phone:"Phone",email:"Email (optional)",msg:"Message (optional)",next:"Next",back:"Back",send:"Send request",sumcar:"Car",sumpkg:"Package",sumprice:"Estimated price",done_t:"Thank you for your request!",done_p:"We'll contact you as soon as possible to confirm time and price.",close:"Close",pick:"Choose"}};

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

/* ====== PLATE LOOKUP ====== */
function mapDmrToCar(data){
  var kind=(data.kind||data.usageCode||'').toLowerCase();
  if(kind.includes('vare')||kind.includes('lastbil')||kind.includes('truck'))return 'varebil';
  var w=data.totalWeight||data.weight||data.registrationWeight||0;
  if(w>0){
    if(w<1250)return 'lille';
    if(w<1600)return 'mellem';
    return 'stor';
  }
  var make=(data.make||'').toLowerCase();
  var model=(data.model||'').toLowerCase();
  var smallCars=['aygo','up','i10','i20','polo','fiesta','208','fabia','yaris','corsa','swift','twingo','smart','kia picanto','kia rio','seat ibiza','skoda fabia'];
  var largeCars=['passat','a4','a6','5-series','e-class','3-series','suv','touareg','q5','q7','x5','cx-5','rav4','discovery','land rover','volvo xc90','volvo xc60','stationcar','verso'];
  var vanCars=['transit','caddy','berlingo','partner','jumpy','master','ducato','sprinter','vito','crafter','traffic'];
  var full=make+' '+model;
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
function doLookup(){
  var plate=plateInput.value.replace(/\s/g,'').toUpperCase();
  if(plate.length<2){showPlateResult('<span>'+(LANG==='da'?'Indtast en gyldig nummerplade':'Enter a valid plate number')+'</span>','err');return;}
  plateBtn.disabled=true;
  plateBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>'+(LANG==='da'?'Søger...':'Searching...')+'</span>';
  fetch('/api/plate?plate='+encodeURIComponent(plate))
    .then(function(r){return r.json();})
    .then(function(data){
      plateBtn.disabled=false;
      plateBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><span>'+(LANG==='da'?'Slå op':'Search')+'</span>';
      if(data.error){showPlateResult('<span>'+(LANG==='da'?'Bilen blev ikke fundet. Prøv igen eller vælg manuelt.':'Car not found. Try again or select manually.')+'</span>','err');return;}
      var make=data.make||'';var model=data.model||'';var variant=data.variant||'';
      var year=data.firstRegistration?(data.firstRegistration+'').substring(0,4):'';
      var carId=mapDmrToCar(data);
      var carObj=CARS.filter(function(c){return c.id===carId;})[0];
      var carLabel=carObj?carObj.label[LANG]:'';
      var html='<div class="plate-found">';
      html+='<div class="plate-car-info"><div class="plate-car-title"><strong>'+make+' '+model+(variant?' '+variant:'')+'</strong>'+(year?' ('+year+')':'')+'</div>';
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
if(plateBtn){
  plateBtn.addEventListener('click',doLookup);
  plateInput.addEventListener('keydown',function(e){if(e.key==='Enter')doLookup();});
  plateInput.addEventListener('input',function(){plateInput.value=plateInput.value.toUpperCase();});
}

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
var wiz={car:null,pkg:null,addr:"",zip:"",city:"",date:"",time:"",name:"",phone:"",email:"",msg:""};
var step=1, TOTAL=6;
function W(k){return WIZ[LANG][k];}
function openWiz(car,pkg){wiz.car=car||selCar||CARS[0];wiz.pkg=pkg||PKGS[0];wiz.zip=zipVal;step=1;modal.classList.add('open');document.body.style.overflow='hidden';drawWiz();}
function closeWiz(){modal.classList.remove('open');document.body.style.overflow='';}
document.getElementById('wizClose').addEventListener('click',closeWiz);
modal.addEventListener('click',function(e){if(e.target===modal)closeWiz();});
document.querySelectorAll('[data-book]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openWiz();});});
function progress(){var h='';for(var i=1;i<=TOTAL;i++)h+='<span class="'+(i<=step?'done':'')+'"></span>';wizProg.innerHTML=h;}
function drawWiz(){
  progress();
  var h='<div class="wiz-stepnum">'+W('step')+' '+step+' '+W('of')+' '+TOTAL+'</div>';
  if(step===1){
    h+='<div class="wiz-q">'+W('s1')+'</div><div class="opt-grid">';
    CARS.forEach(function(c){h+='<div class="opt'+(wiz.car&&wiz.car.id===c.id?' sel':'')+'" data-car="'+c.id+'">'+svgWrap(c.svg,46,26)+'<span>'+c.label[LANG]+'</span></div>';});
    h+='</div>';
  }else if(step===2){
    h+='<div class="wiz-q">'+W('s2')+'</div><div class="opt-row">';
    PKGS.forEach(function(p){var price=wiz.car.prices[p.id];h+='<div class="opt opt-wide'+(wiz.pkg&&wiz.pkg.id===p.id?' sel':'')+'" data-pkg="'+p.id+'"><span>'+p.name[LANG]+'</span><span class="op">'+fmtKr(price)+'</span></div>';});
    h+='</div>';
  }else if(step===3){
    h+='<div class="wiz-q">'+W('s3')+'</div>';
    h+='<div class="field"><label>'+W('addr')+'</label><input id="f_addr" value="'+wiz.addr+'" placeholder="Vejnavn 12"></div>';
    h+='<div class="field"><div class="row2"><div><label>'+W('zip')+'</label><input id="f_zip" inputmode="numeric" maxlength="4" value="'+(wiz.zip||"")+'" placeholder="4700"></div><div><label>'+W('city')+'</label><input id="f_city" value="'+wiz.city+'" placeholder="Næstved"></div></div></div>';
  }else if(step===4){
    h+='<div class="wiz-q">'+W('s4')+'</div>';
    h+='<div class="field"><label>'+W('date')+'</label><input id="f_date" type="date" value="'+wiz.date+'"></div>';
    h+='<div class="field"><label>'+W('time')+'</label><input id="f_time" type="time" value="'+wiz.time+'"></div>';
  }else if(step===5){
    h+='<div class="wiz-q">'+W('s5')+'</div>';
    h+='<div class="field"><label>'+W('name')+'</label><input id="f_name" value="'+wiz.name+'" placeholder="Dit navn"></div>';
    h+='<div class="field"><label>'+W('phone')+'</label><input id="f_phone" inputmode="tel" value="'+wiz.phone+'" placeholder="12 34 56 78"></div>';
    h+='<div class="field"><label>'+W('email')+'</label><input id="f_email" value="'+wiz.email+'" placeholder="dig@mail.dk"></div>';
    h+='<div class="field"><label>'+W('msg')+'</label><textarea id="f_msg" rows="2">'+wiz.msg+'</textarea></div>';
  }else if(step===6){
    var fee=driveFee(wiz.zip);var price=wiz.car.prices[wiz.pkg.id];var tot=price+fee;
    h+='<div class="wiz-q">'+(LANG==="da"?"Gennemse & send":"Review & send")+'</div>';
    h+='<div class="summary">';
    h+='<div class="sr"><span class="k">'+W('sumcar')+'</span><span class="v">'+wiz.car.label[LANG]+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('sumpkg')+'</span><span class="v">'+wiz.pkg.name[LANG]+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('addr')+'</span><span class="v">'+(wiz.addr||"-")+' '+(wiz.zip||"")+' '+(wiz.city||"")+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('date')+'</span><span class="v">'+(wiz.date||"-")+' '+(wiz.time||"")+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('name')+'</span><span class="v">'+(wiz.name||"-")+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('phone')+'</span><span class="v">'+(wiz.phone||"-")+'</span></div>';
    if(fee>0)h+='<div class="sr"><span class="k">'+(LANG==="da"?"Kørsel":"Travel")+'</span><span class="v">'+fmtKr(fee)+'</span></div>';
    h+='<div class="sr tot"><span class="k">'+W('sumprice')+'</span><span class="v">'+fmtKr(tot)+'</span></div>';
    h+='</div>';
  }else if(step===7){
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
  wizBody.querySelectorAll('[data-car]').forEach(function(o){o.addEventListener('click',function(){wiz.car=CARS.filter(function(c){return c.id===o.dataset.car;})[0];drawWiz();});});
  wizBody.querySelectorAll('[data-pkg]').forEach(function(o){o.addEventListener('click',function(){wiz.pkg=PKGS.filter(function(p){return p.id===o.dataset.pkg;})[0];drawWiz();});});
  var bk=document.getElementById('wizBack');if(bk)bk.addEventListener('click',function(){saveStep();step--;drawWiz();});
  document.getElementById('wizNext').addEventListener('click',function(){saveStep();if(step<TOTAL){step++;drawWiz();}else{submitBooking();step=7;drawWiz();}});
}
function saveStep(){
  if(step===3){wiz.addr=val('f_addr');wiz.zip=val('f_zip');wiz.city=val('f_city');}
  if(step===4){wiz.date=val('f_date');wiz.time=val('f_time');}
  if(step===5){wiz.name=val('f_name');wiz.phone=val('f_phone');wiz.email=val('f_email');wiz.msg=val('f_msg');}
}
function val(id){var e=document.getElementById(id);return e?e.value:'';}

function submitBooking(){
  var fee=driveFee(wiz.zip);var price=wiz.car.prices[wiz.pkg.id];var tot=price+fee;
  var L=(LANG==="da");
  var lines=[
    (L?"Ny bookinganmodning fra Elite Vask":"New booking request from Elite Vask"),"",
    (L?"Bil":"Car")+": "+wiz.car.label[LANG],
    (L?"Pakke":"Package")+": "+wiz.pkg.name[LANG],
    (L?"Adresse":"Address")+": "+wiz.addr+", "+(wiz.zip||"")+" "+(wiz.city||""),
    (L?"Dato":"Date")+": "+(wiz.date||"-")+" "+(wiz.time||""),
    (L?"Navn":"Name")+": "+(wiz.name||"-"),
    (L?"Telefon":"Phone")+": "+(wiz.phone||"-"),
    "Email: "+(wiz.email||"-"),
    (L?"Besked":"Message")+": "+(wiz.msg||"-"),"",
    (L?"Anslået pris":"Estimated price")+": "+fmtKr(tot)+(fee>0?(" ("+(L?"inkl. kørsel":"incl. travel")+" "+fmtKr(fee)+")"):"")
  ];
  var subject=encodeURIComponent((L?"Booking: ":"Booking: ")+wiz.car.label[LANG]+" – "+wiz.pkg.name[LANG]);
  var body=encodeURIComponent(lines.join("\n"));
  try{window.location.href="mailto:elitevask01@gmail.com?subject="+subject+"&body="+body;}catch(e){}
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
/* ====== MENU + INIT ====== */
document.getElementById('menuBtn').addEventListener('click',function(){document.getElementById('vaelg').scrollIntoView({behavior:'smooth'});});
applyLang();
}
