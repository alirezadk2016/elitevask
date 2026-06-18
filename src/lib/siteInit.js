// Auto-extracted from original elitevask.html — runs once on mount.
export function initSite(){
var CARS=[
  {id:"lille",label:{da:"Lille bil",en:"Small car"},ex:{da:"Aygo, Up!, i10",en:"Aygo, Up!, i10"},time:{da:"100–120 min",en:"100–120 min"},prices:{hele:800,udv:500,indv:600,guld:2000},svg:'<path d="M18 44 Q16 30 24 26 L34 24 Q40 18 50 17 L70 18 Q82 20 90 28 L100 36 Q104 38 104 42 L104 46 Q104 48 100 48 L96 48"/><path d="M18 44 L18 46 Q18 48 22 48 L26 48"/><path d="M44 48 L78 48"/><circle cx="36" cy="48" r="8"/><circle cx="36" cy="48" r="3"/><circle cx="88" cy="48" r="8"/><circle cx="88" cy="48" r="3"/><path d="M34 25 Q40 20 48 19 L48 33 L26 33 Q24 28 34 25"/><path d="M52 19 L66 19 Q76 21 82 28 L82 33 L52 33 Z"/>'},
  {id:"mellem",label:{da:"Mellem bil",en:"Medium car"},ex:{da:"Golf, Focus, i20",en:"Golf, Focus, i20"},time:{da:"120–180 min",en:"120–180 min"},prices:{hele:950,udv:550,indv:700,guld:2200},svg:'<path d="M8 44 Q6 32 16 28 L30 24 Q42 16 58 16 L78 17 Q94 19 106 27 L114 34 Q116 36 116 40 L116 46 Q116 48 112 48 L106 48"/><path d="M8 44 L8 46 Q8 48 12 48 L16 48"/><path d="M38 48 L82 48"/><circle cx="28" cy="48" r="8.5"/><circle cx="28" cy="48" r="3"/><circle cx="92" cy="48" r="8.5"/><circle cx="92" cy="48" r="3"/><path d="M32 24 Q42 17 56 17 L56 31 L22 31 Q22 27 32 24"/><path d="M60 17 L76 18 Q90 20 102 28 L60 31 Z"/>'},
  {id:"stor",label:{da:"Stor bil",en:"Large car"},ex:{da:"Passat, SUV, stationcar",en:"Passat, SUV, estate"},time:{da:"150–200 min",en:"150–200 min"},prices:{hele:1100,udv:650,indv:850,guld:2350},svg:'<path d="M8 42 Q6 26 18 23 L32 20 Q42 13 58 13 L86 14 Q102 16 110 26 L114 34 Q116 36 116 40 L116 45 Q116 47 112 47 L104 47"/><path d="M8 42 L8 45 Q8 47 12 47 L20 47"/><path d="M40 47 L84 47"/><circle cx="30" cy="47" r="9.5"/><circle cx="30" cy="47" r="3.5"/><circle cx="92" cy="47" r="9.5"/><circle cx="92" cy="47" r="3.5"/><path d="M34 21 Q42 14 56 14 L56 30 L24 30 Q24 25 34 21"/><path d="M60 14 L84 15 Q100 17 108 28 L108 30 L60 30 Z"/>'},
  {id:"varebil",label:{da:"Varebil",en:"Van"},ex:{da:"Transit, Caddy, Berlingo",en:"Transit, Caddy, Berlingo"},time:{da:"90–180 min",en:"90–180 min"},prices:{hele:1400,udv:750,indv:750,guld:2200},svg:'<path d="M6 48 L6 18 Q6 14 12 14 L74 14 Q82 14 88 22 L108 38 Q112 41 112 46 L112 47 Q112 48 108 48"/><path d="M40 48 L82 48"/><circle cx="28" cy="48" r="8.5"/><circle cx="28" cy="48" r="3"/><circle cx="92" cy="48" r="8.5"/><circle cx="92" cy="48" r="3"/><path d="M74 16 L80 30 L110 30"/><path d="M38 14 L38 30 L6 30"/>'}
];
var PKGS=[
  {id:"hele",pop:true,gold:false,includes:[],relevant:["motor","lak","haar","barnesaede"],name:{da:"Hele bilen",en:"Full car"},desc:{da:"Ind & ud – komplet behandling",en:"In & out – complete service"},feat:{da:["Udvendig håndvask + fælge","Grundig indvendig støvsugning","Rens af måtter & sæder","Dampbehandling af kabine","Voksfinish & ruder ind/ud"],en:["Exterior hand wash + rims","Thorough interior vacuum","Mats & seats cleaned","Cabin steam treatment","Wax finish & windows"]}},
  {id:"udv",pop:false,gold:false,includes:[],relevant:["motor","lak"],name:{da:"Udvendig",en:"Exterior"},desc:{da:"Skånsom udvendig dampvask",en:"Gentle exterior steam wash"},feat:{da:["Udvendig håndvask","Fælge & dæk","Lakrens: tjære & insekter","Voksfinish","Ruder udvendigt"],en:["Exterior hand wash","Rims & tyres","Paint: tar & insects","Wax finish","Windows outside"]}},
  {id:"indv",pop:false,gold:false,includes:[],relevant:["haar","barnesaede"],name:{da:"Indvendig",en:"Interior"},desc:{da:"Dybderens af kabinen",en:"Deep clean of the cabin"},feat:{da:["Grundig støvsugning","Rens af måtter","Dampbehandling af sæder","Desinficering","Ruder indvendigt"],en:["Thorough vacuum","Mat cleaning","Seat steam treatment","Disinfection","Windows inside"]}},
  {id:"guld",pop:false,gold:true,includes:["motor","lak"],relevant:["haar","barnesaede"],name:{da:"Guld pakke",en:"Gold package"},desc:{da:"Inkl. alle ydelser",en:"All services included"},feat:{da:["Alt ind & ud","+ Motorrens","+ Lak- & glansbeskyttelse","+ Dybderens ved uheld","+ Interiørbeskyttelse"],en:["Everything in & out","+ Engine clean","+ Paint & gloss protection","+ Deep clean if needed","+ Interior protection"]}}
];
var EXTRAS=[
  {id:"motor",name:{da:"Motorrens",en:"Engine clean"},price:400,desc:{da:"Grundig afrensning af motorrum",en:"Thorough engine bay cleaning"}},
  {id:"lak",name:{da:"Lak & glansbeskyttelse",en:"Paint & gloss protection"},price:300,desc:{da:"Udvendig – langvarig ekstra glans",en:"Exterior – long-lasting gloss"}},
  {id:"pleje",name:{da:"Indvendig pleje & beskyttelse",en:"Interior care & protection"},price:200,desc:{da:"Beskytter og fornyer interiøret",en:"Protects and renews the interior"}},
  {id:"haar",name:{da:"Fjernelse af dyrehår",en:"Pet hair removal"},price:300,desc:{da:"Effektiv fjernelse af hår og fnug",en:"Effective removal of hair and lint"}},
  {id:"saede",name:{da:"Sæderens (stof)",en:"Seat clean (fabric)"},price:400,desc:{da:"Dybderens af stofsæder",en:"Deep clean of fabric seats"}},
  {id:"barnesaede",name:{da:"Barnesæde rens",en:"Child seat cleaning"},price:100,desc:{da:"Grundig og sikker rengøring",en:"Thorough and safe cleaning"}}
];
var REVIEWS=[];
var FAQ=[
  {q:{da:"Hvad koster mobil bilvask?",en:"What does mobile car wash cost?"},a:{da:"Prisen afhænger af biltype og pakke. En komplet vask starter fra 799 kr. Vælg din biltype ovenfor for at se den præcise pris.",en:"Price depends on car type and package. A full wash starts from 799 kr. Select your car type above to see the exact price."}},
  {q:{da:"Hvor lang tid tager det?",en:"How long does it take?"},a:{da:"Det afhænger af bilstørrelse:<br>• <strong>Lille bil:</strong> 100–120 min<br>• <strong>Mellemstor bil:</strong> 120–180 min<br>• <strong>Stor bil / SUV:</strong> 150–200 min<br>• <strong>Varebil:</strong> 90–180 min",en:"It depends on the car size:<br>• <strong>Small car:</strong> 100–120 min<br>• <strong>Medium car:</strong> 120–180 min<br>• <strong>Large car / SUV:</strong> 150–200 min<br>• <strong>Van:</strong> 90–180 min"}},
  {q:{da:"Dækker I hele Sjælland?",en:"Do you cover all of Zealand?"},a:{da:"Ja, vi dækker store dele af Sjælland, herunder Storkøbenhavn og Nordsjælland.",en:"Yes, we cover large parts of Zealand, including Greater Copenhagen and North Zealand."}},
  {q:{da:"Kan I vaske leasingbiler?",en:"Can you clean lease cars?"},a:{da:"Ja, vores Returklargøring-pakke er lavet specielt til aflevering af leasingbiler.",en:"Yes, our Lease return package is made specifically for returning lease cars."}},
  {q:{da:"Kommer I hjem til mig?",en:"Do you come to my home?"},a:{da:"Ja, vi er mobile og kører ud til din adresse – hjemme eller på arbejde.",en:"Yes, we are mobile and drive to your address – at home or at work."}},
  {q:{da:"Hvad er forskellen på dampvask og almindelig bilvask?",en:"What is the difference between steam wash and regular wash?"},a:{da:"Dampvask bruger varm damp med minimalt vandforbrug, renser mere skånsomt og desinficerer overflader uden aggressive kemikalier.",en:"Steam washing uses hot steam with minimal water, cleans more gently and disinfects surfaces without aggressive chemicals."}}
];
var I18N={
  da:{ann_main:"Betal først når bilen er ren",ann_sub:"Ingen forudbetaling – 100% tilfredshedsgaranti",tb_local:"Lokalt firma på Sjælland",tb_ins:"Forsikret virksomhed",tb_rating:"Google anmeldelser",tb_mobile:"Mobil dampvask",nav_choose:"Se priser",nav_work:"Vores arbejde",nav_reviews:"Anmeldelser",nav_contact:"Kontakt",nav_book:"Book nu",hero_badge:"Vi kører til dig – hele Sjælland",hero_h1a:"Vi kører til dig",hero_h1b:"og vasker din bil",hero_p:"Mobil bil dampvask med premium produkter. Rent, effektivt og miljøvenligt – uden at du forlader hjemmet.",flow1:"Vælg biltype",flow2:"Se pris",flow3:"Book tid",hero_cta1:"Se priser",hero_cta2:"Book med det samme",hero_t1:"Rent",hero_t2:"Effektivt",hero_t3:"Miljøvenligt",plate_search:"Slå op",plate_or:"– eller vælg manuelt –",sel_eyebrow:"Trin 1 af 2",sel_title:"Find pris til din bil",sel_sub:"Vælg din biltype nedenfor og se prisen med det samme.",calc_head_p:"Vælg den pakke der passer til dig",calc_zip:"Postnr.",calc_note:"Priserne er vejledende. Gratis kørsel til hele Sjælland. Endelig pris bekræftes ved booking.",st1:"Skånsom rensemetode",st2:"Typisk behandlingstid",st3:"Mobil – vi kører ud",st4:"Vores serviceområde",how_eyebrow:"Sådan virker det",how_title:"3 nemme trin",how1t:"Vælg og book",how1p:"Vælg biltype og pakke, og book en tid på få minutter.",how2t:"Vi kører ud",how2p:"Vi ankommer med alt udstyr direkte til din adresse.",how3t:"Bilen skinner",how3p:"Nyd en ren, frisk bil. Du behøvede ikke flytte dig.",ba_eyebrow:"Vores arbejde",ba_title:"Før & efter",ba_sub:"Træk i slideren for at se forskellen. Rigtige resultater fra vores kunder.",ba_cap:"Motorrens · Peugeot – afrenset med damp",gal_eyebrow:"Galleri",gal_title:"Billeder fra vores arbejde",g_seat_for:"Sæderens · før",g_seat_efter:"Sæderens · efter",g_floor_for:"Fodrum · før",g_floor_efter:"Fodrum · efter",g_fuel_for:"Tankdæksel · før",g_fuel_efter:"Tankdæksel · efter",g_roof:"Tagkant · algerens",g_pedal:"Pedalområde · rens",g_onsite:"Mobil dampvask · på stedet",ex_eyebrow:"Tilvalg",ex_title:"Ekstra ydelser",ex_sub:"Kan tilføjes til enhver pakke. Indgår i Guld pakken.",ex1t:"Motorrens",ex1p:"Grundig afrensning af motorrum",ex2t:"Lak- & glansbeskyttelse",ex2p:"Udvendig – langvarig ekstra glans",ex3t:"Indvendig pleje & beskyttelse",ex3p:"Beskytter og fornyer interiøret",ex4t:"Fjernelse af dyrehår",ex4p:"Effektiv fjernelse af hår og fnug",ex5t:"Sæderens (stof)",ex5p:"Dybderens af stofsæder",ex6t:"Rens af barnesæde",ex6p:"Grundig og sikker rengøring",why_eyebrow:"Hvorfor vælge os",why_title:"Tillid og kvalitet i centrum",why1t:"Gennemsigtige priser",why1p:"Du kender prisen, før vi kører ud. Ingen overraskelser.",why2t:"Miljøvenlig dampvask",why2p:"Skånsom metode med minimalt vandforbrug.",why3t:"Vi kommer til dig",why3p:"Hjemme, på kontoret eller i sommerhuset.",why4t:"Tilfredshedsgaranti",why4p:"Ikke tilfreds? Så finder vi en løsning.",info_eyebrow:"Om Elite Vask",info_title:"Mød holdet bag",info_sub:"Her fortæller vi snart mere om os og det udstyr, vi bruger.",info1t:"Ejer & kontaktperson",info1p:"Navn og direkte kontakt til indehaveren tilføjes her.",info_soon:"Tilføjes snart",info2t:"Vores udstyr",info2p:"Vi arbejder med Optima Steamer XD2 – en professionel damprenser med kontinuerlig damp, høj temperatur og minimalt vandforbrug. Perfekt til skånsom og effektiv bilvask.",info3t:"Dækningsområde",info3p:"Vi dækker store dele af Sjælland, herunder Storkøbenhavn.",rev_eyebrow:"Kundeanmeldelser",rev_title:"Det siger vores kunder",rev_empty_t:"Anmeldelser vises her snart",rev_empty_p:"Vi forbinder vores Google Business-profil. Når den er klar, vises rigtige kundeanmeldelser automatisk her.",rev_empty_cta:"Book din vask",faq_eyebrow:"Spørgsmål & svar",faq_title:"Ofte stillede spørgsmål",local_eyebrow:"Serviceområde",local_title:"Mobil bilvask i hele Sjælland",ct_title:"Klar til en skinnende ren bil?",ct_lead:"Kontakt os i dag og book din mobile dampvask. Vi kører til dig – nemt, hurtigt og lokalt.",ct_book:"Book online nu",ct_call:"Ring til os",ct_phone:"Telefon",ct_email:"E-mail",ct_addr:"Adresse",ct_hours:"Åbningstider",ct_hours_v:"Man–Fre · 08–20 · Lør–Søn · 10–20 · eller efter aftale",foot_p:"Mobil bil dampvask på Sjælland. Vi kører til dig og vasker din bil – rent, effektivt og miljøvenligt.",foot_s1:"Service",foot_l1:"Vælg bil & priser",foot_l2:"Vores arbejde",foot_l3:"Anmeldelser",foot_s2:"Kontakt",m_call:"Ring nu",m_book:"Book nu",wiz_title:"Book din bilvask",chat_status:"Online nu",chat_intro_label:"Elite Bot er klar!"},
  en:{ann_main:"Pay only when your car is clean",ann_sub:"No prepayment – 100% satisfaction guarantee",tb_local:"Local company on Zealand",tb_ins:"Insured business",tb_rating:"Google reviews",tb_mobile:"Mobile steam wash",nav_choose:"See prices",nav_work:"Our work",nav_reviews:"Reviews",nav_contact:"Contact",nav_book:"Book now",hero_badge:"We drive to you – all of Zealand",hero_h1a:"We drive to you",hero_h1b:"and wash your car",hero_p:"Mobile car steam wash with premium products. Clean, effective and eco-friendly – without leaving home.",flow1:"Choose car type",flow2:"See price",flow3:"Book time",hero_cta1:"See prices",hero_cta2:"Book right away",hero_t1:"Clean",hero_t2:"Effective",hero_t3:"Eco-friendly",plate_search:"Search",plate_or:"– or select manually –",sel_eyebrow:"Step 1 of 2",sel_title:"Find price for your car",sel_sub:"Select your car type below and see the price instantly.",calc_head_p:"Pick the package that suits you",calc_zip:"Zip",calc_note:"Prices are guidance. Free travel across all of Zealand. Final price confirmed at booking.",st1:"Gentle steam method",st2:"Typical service time",st3:"Mobile – we come to you",st4:"Our service area",how_eyebrow:"How it works",how_title:"3 easy steps",how1t:"Choose and book",how1p:"Pick car type and package, and book a time in minutes.",how2t:"We come to you",how2p:"We arrive with all equipment directly to your address.",how3t:"Your car shines",how3p:"Enjoy a clean, fresh car. You didn't even have to move.",ba_eyebrow:"Our work",ba_title:"Before & after",ba_sub:"Drag the slider to see the difference. Real results from our customers.",ba_cap:"Engine clean · Peugeot – steam cleaned",gal_eyebrow:"Gallery",gal_title:"Photos from our work",g_seat_for:"Seat clean · before",g_seat_efter:"Seat clean · after",g_floor_for:"Footwell · before",g_floor_efter:"Footwell · after",g_fuel_for:"Fuel cap · before",g_fuel_efter:"Fuel cap · after",g_roof:"Roof edge · algae removal",g_pedal:"Pedal area · clean",g_onsite:"Mobile steam wash · on location",ex_eyebrow:"Add-ons",ex_title:"Extra services",ex_sub:"Can be added to any package. Included in the Gold package.",ex1t:"Engine clean",ex1p:"Thorough engine bay cleaning",ex2t:"Paint & gloss protection",ex2p:"Exterior – long-lasting extra gloss",ex3t:"Interior care & protection",ex3p:"Protects and renews the interior",ex4t:"Pet hair removal",ex4p:"Effective removal of hair and lint",ex5t:"Seat clean (fabric)",ex5p:"Deep clean of fabric seats",ex6t:"Child seat cleaning",ex6p:"Thorough and safe cleaning",why_eyebrow:"Why choose us",why_title:"Trust and quality first",why1t:"Transparent prices",why1p:"You know the price before we drive out. No surprises.",why2t:"Eco-friendly steam wash",why2p:"Gentle method with minimal water use.",why3t:"We come to you",why3p:"At home, the office or the summer house.",why4t:"Satisfaction guarantee",why4p:"Not happy? Then we'll find a solution.",info_eyebrow:"About Elite Vask",info_title:"Meet the team",info_sub:"We'll soon tell you more about us and the equipment we use.",info1t:"Owner & contact",info1p:"Name and direct contact to the owner will be added here.",info_soon:"Added soon",info2t:"Our equipment",info2p:"We use the Optima Steamer XD2 – a professional steam cleaner with continuous steam, high temperature and minimal water use. Perfect for gentle yet powerful car cleaning.",info3t:"Coverage area",info3p:"We cover large parts of Zealand, including Greater Copenhagen.",rev_eyebrow:"Customer reviews",rev_title:"What our customers say",rev_empty_t:"Reviews appear here soon",rev_empty_p:"We are connecting our Google Business profile. Once ready, real customer reviews appear here automatically.",rev_empty_cta:"Book your wash",faq_eyebrow:"Questions & answers",faq_title:"Frequently asked questions",local_eyebrow:"Service area",local_title:"Mobile car wash across Zealand",ct_title:"Ready for a spotless car?",ct_lead:"Contact us today and book your mobile steam wash. We come to you – easy, fast and local.",ct_book:"Book online now",ct_call:"Call us",ct_phone:"Phone",ct_email:"Email",ct_addr:"Address",ct_hours:"Opening hours",ct_hours_v:"Mon–Fri · 08–20 · Sat–Sun · 10–20 · or by arrangement",foot_p:"Mobile car steam wash on Zealand. We drive to you and wash your car – clean, effective and eco-friendly.",foot_s1:"Service",foot_l1:"Choose car & prices",foot_l2:"Our work",foot_l3:"Reviews",foot_s2:"Contact",m_call:"Call now",m_book:"Book now",wiz_title:"Book your car wash",chat_status:"Online now",chat_intro_label:"Elite Bot is ready!"}
};
var WIZ={
  da:{step:"Trin",of:"af",s1:"Vælg din bil",s2:"Vælg pakke",s3:"Tilvalg (valgfrit)",s4:"Din adresse",s5:"Vælg dato & tid",s6:"Kontaktinfo",addr:"Adresse",zip:"Postnr.",city:"By",date:"Dato",time:"Tidspunkt",name:"Navn",phone:"Telefon",email:"E-mail (valgfri)",msg:"Besked (valgfri)",next:"Næste",back:"Tilbage",send:"Send anmodning",sumcar:"Bil",sumpkg:"Pakke",sumext:"Tilvalg",sumprice:"Anslået pris",done_t:"Tak for din anmodning!",done_p:"Vi kontakter dig hurtigst muligt for at bekræfte tid og pris.",close:"Luk",pick:"Vælg",skip:"Spring over",plate_label:"Slå nummerplade op",plate_or:"– eller vælg manuelt –",plate_search:"Slå op",plate_searching:"Søger...",plate_found:"Se priser for denne bil"},
  en:{step:"Step",of:"of",s1:"Choose your car",s2:"Choose package",s3:"Add-ons (optional)",s4:"Your address",s5:"Choose date & time",s6:"Contact info",addr:"Address",zip:"Zip",city:"City",date:"Date",time:"Time",name:"Name",phone:"Phone",email:"Email (optional)",msg:"Message (optional)",next:"Next",back:"Back",send:"Send request",sumcar:"Car",sumpkg:"Package",sumext:"Add-ons",sumprice:"Estimated price",done_t:"Thank you for your request!",done_p:"We'll contact you as soon as possible to confirm time and price.",close:"Close",pick:"Choose",skip:"Skip",plate_label:"Look up plate number",plate_or:"– or select manually –",plate_search:"Search",plate_searching:"Searching...",plate_found:"See prices for this car"}
};

/* ====== STATE ====== */
var LANG=localStorage.getItem('lang')||"da", selCar=null, zipVal="";
function t(k){return (I18N[LANG][k]!==undefined)?I18N[LANG][k]:k;}
function svgWrap(inner,w,h,col){return '<svg viewBox="0 0 120 64" width="'+w+'" height="'+h+'" fill="none" stroke="'+(col||"currentColor")+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'+inner+'</svg>';}
function fmtKr(n){return Math.round(n).toLocaleString('da-DK')+' kr';}

/* ====== KØRSEL ====== */
function driveFee(){return 0;}

/* ====== RENDER CARS ====== */
function renderCars(){
  var g=document.getElementById('carGrid');g.innerHTML='';
  CARS.forEach(function(c){
    var d=document.createElement('div');d.className='car';d.dataset.id=c.id;
    if(selCar&&selCar.id===c.id)d.classList.add('on');
    var minPrice=Math.min(c.prices.udv,c.prices.indv,c.prices.hele);
    d.innerHTML='<svg class="cs" viewBox="0 0 120 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">'+c.svg+'</svg><div class="nm">'+c.label[LANG]+'</div><div class="ex">'+c.ex[LANG]+'</div><div class="car-price">'+(LANG==='da'?'Fra ':'From ')+fmtKr(minPrice)+'</div>';
    d.addEventListener('click',function(){selCar=c;renderCars();renderCalc();var cal=document.getElementById('calc');cal.classList.add('show');setTimeout(function(){cal.scrollIntoView({behavior:'smooth',block:'nearest'});},60);});
    g.appendChild(d);
  });
}
/* ====== RENDER CALC ====== */
function renderCalc(){
  if(!selCar)return;
  document.getElementById('calcTitle').textContent=selCar.label[LANG];
  document.getElementById('calcIcon').innerHTML=svgWrap(selCar.svg,60,34,'#9af0bd');
  var timeEl=document.getElementById('calcTime');
  if(timeEl){timeEl.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="14" height="14"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> '+(LANG==='da'?'Behandlingstid':'Service time')+': <strong>'+selCar.time[LANG]+'</strong>';}
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
  if(b.dataset.lang===LANG)b.classList.add('on');
  b.addEventListener('click',function(){LANG=b.dataset.lang;localStorage.setItem('lang',LANG);document.querySelectorAll('.lang button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');applyLang();});
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
  return fetch('/api/plate?plate='+encodeURIComponent(plate)).then(function(r){return r.json();});
}
function doLookup(){
  var plate=plateInput.value.replace(/\s/g,'').toUpperCase();
  if(plate.length<2){showPlateResult('<span>'+(LANG==='da'?'Indtast en gyldig nummerplade':'Enter a valid plate number')+'</span>','err');return;}
  plateBtn.disabled=true;
  plateBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg><span>'+(LANG==='da'?'Søger...':'Searching...')+'</span>';
  fetchPlate(plate)
    .then(function(data){
      plateBtn.disabled=false;
      plateBtn.innerHTML='<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><span data-i18n="plate_search">'+(LANG==='da'?'Slå op':'Search')+'</span>';
      if(data.error){showPlateResult('<span>'+(LANG==='da'?'Bilen blev ikke fundet. Vælg venligst manuelt nedenfor.':'Car not found. Please select manually below.')+'</span>','err');return;}
      var carId=data.category||'mellem';
      var carObj=CARS.filter(function(c){return c.id===carId;})[0];
      var carLabel=carObj?carObj.label[LANG]:'';
      var weightTxt=data.weight?(LANG==='da'?'Totalvægt: ':'Total weight: ')+'<strong>'+data.weight+' kg</strong> · ':'';
      var html='<div class="plate-found">';
      html+='<div class="plate-car-info">';
      html+='<div class="plate-car-type"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'+weightTxt+(LANG==='da'?'Kategori: ':'Category: ')+'<strong>'+carLabel+'</strong></div></div>';
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
function openWiz(car,pkg){
  wiz.car=car||null;wiz.pkg=pkg||null;wiz.zip=zipVal;wiz.extras=[];
  if(car&&pkg){step=3;}
  else if(car){step=2;}
  else{wiz.car=selCar||CARS[0];step=1;}
  modal.classList.add('open');document.body.style.overflow='hidden';drawWiz();
}
function closeWiz(){modal.classList.remove('open');document.body.style.overflow='';if(_slotPollTimer){clearInterval(_slotPollTimer);_slotPollTimer=null;}}
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
      var carId=data.category||'mellem';
      var carObj=CARS.filter(function(c){return c.id===carId;})[0];
      if(carObj){
        wiz.car=carObj;
        resultEl.style.display='block';resultEl.className='wiz-plate-result ok';
        var weightInfo=data.weight?(' · '+data.weight+' kg'):'';
        resultEl.innerHTML='<strong style="color:var(--green)">'+carObj.label[LANG]+'</strong>'+weightInfo;
        // highlight the matching car option
        wizBody.querySelectorAll('[data-car]').forEach(function(o){o.classList.toggle('sel',o.dataset.car===carId);});
      }
    })
    .catch(function(){btnEl.disabled=false;btnEl.textContent=W('plate_search');resultEl.style.display='block';resultEl.className='wiz-plate-result err';resultEl.innerHTML=LANG==='da'?'Fejl. Prøv igen.':'Error. Try again.';});
}

function drawWiz(){
  progress();
  // Context bar: show already-chosen car/package with edit links
  var ctxBar='';
  if(step>=2&&wiz.car){
    ctxBar+='<div class="wiz-ctx">';
    ctxBar+='<span class="wiz-ctx-item">'+wiz.car.label[LANG]+'<button class="wiz-ctx-edit" data-goto="1">✎</button></span>';
    if(step>=3&&wiz.pkg){
      ctxBar+='<span class="wiz-ctx-sep">›</span>';
      ctxBar+='<span class="wiz-ctx-item">'+wiz.pkg.name[LANG]+'<button class="wiz-ctx-edit" data-goto="2">✎</button></span>';
    }
    ctxBar+='</div>';
  }
  var h=ctxBar+'<div class="wiz-stepnum">'+W('step')+' '+step+' '+W('of')+' '+TOTAL+'</div>';
  if(step===1){
    h+='<div class="wiz-q">'+W('s1')+'</div>';
    h+='<div class="opt-grid">';
    CARS.forEach(function(c){h+='<div class="opt'+(wiz.car&&wiz.car.id===c.id?' sel':'')+'" data-car="'+c.id+'">'+svgWrap(c.svg,46,26)+'<span>'+c.label[LANG]+'</span></div>';});
    h+='</div>';
  }else if(step===2){
    h+='<div class="wiz-q">'+W('s2')+'</div><div class="opt-row">';
    PKGS.forEach(function(p){var price=wiz.car?wiz.car.prices[p.id]:0;h+='<div class="opt opt-wide'+(wiz.pkg&&wiz.pkg.id===p.id?' sel':'')+'" data-pkg="'+p.id+'"><span>'+p.name[LANG]+'</span><span class="op">'+fmtKr(price)+'</span></div>';});
    h+='</div>';
  }else if(step===3){
    h+='<div class="wiz-q">'+W('s3')+'</div>';
    var pkgIncludes=(wiz.pkg&&wiz.pkg.includes)||[];
    var pkgRelevant=(wiz.pkg&&wiz.pkg.relevant)||EXTRAS.map(function(e){return e.id;});
    var optionalExtras=EXTRAS.filter(function(ex){return pkgRelevant.indexOf(ex.id)>=0&&pkgIncludes.indexOf(ex.id)<0;});
    if(pkgIncludes.length>0){
      h+='<p style="font-size:13px;color:var(--green);margin-bottom:8px;font-weight:600">'+(LANG==='da'?'✓ Inkluderet i din pakke:':'✓ Included in your package:')+'</p>';
      h+='<div class="extras-grid" style="margin-bottom:16px">';
      EXTRAS.filter(function(ex){return pkgIncludes.indexOf(ex.id)>=0;}).forEach(function(ex){
        h+='<div class="extra-item included" style="opacity:0.7;cursor:default">';
        h+='<div class="ex-name">✓ '+ex.name[LANG]+'</div>';
        h+='<div class="ex-price" style="color:var(--green)">'+(LANG==='da'?'Inkluderet':'Included')+'</div>';
        h+='<div class="ex-desc">'+ex.desc[LANG]+'</div></div>';
      });
      h+='</div>';
    }
    if(optionalExtras.length>0){
      if(pkgIncludes.length>0)h+='<p style="font-size:13px;color:var(--muted);margin-bottom:8px">'+(LANG==='da'?'Tilvalg (ekstra pris):':'Add-ons (extra cost):')+'</p>';
      else h+='<p style="font-size:13px;color:var(--muted);margin-bottom:12px">'+(LANG==='da'?'Vælg hvad du vil tilføje. Pris tillægges automatisk.':'Choose extras to add. Price is calculated automatically.')+'</p>';
      h+='<div class="extras-grid">';
      optionalExtras.forEach(function(ex){
        var sel=wiz.extras.indexOf(ex.id)>=0;
        h+='<div class="extra-item'+(sel?' sel':'')+'" data-ext="'+ex.id+'">';
        h+='<div class="ex-name">'+ex.name[LANG]+'</div>';
        h+='<div class="ex-price">+'+fmtKr(ex.price)+'</div>';
        h+='<div class="ex-desc">'+ex.desc[LANG]+'</div>';
        h+='</div>';
      });
      h+='</div>';
    }else if(pkgIncludes.length===0){
      h+='<p style="font-size:13px;color:var(--muted);text-align:center;padding:16px">'+(LANG==='da'?'Ingen tilvalg tilgængelige for denne pakke.':'No add-ons available for this package.')+'</p>';
    }
  }else if(step===4){
    h+='<div class="wiz-q">'+W('s4')+'</div>';
    h+='<div class="field"><label>'+W('addr')+'</label><input id="f_addr" value="'+wiz.addr+'" placeholder="Vejnavn 12"></div>';
    h+='<div class="field"><div class="row2"><div><label>'+W('zip')+'</label><input id="f_zip" inputmode="numeric" maxlength="4" value="'+(wiz.zip||"")+'" placeholder="4700"></div><div><label>'+W('city')+'</label><input id="f_city" value="'+wiz.city+'" placeholder="Næstved"></div></div></div>';
  }else if(step===5){
    var minD=(function(){var d=new Date();return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Copenhagen'}).format(d);})();
    h+='<div class="wiz-q">'+W('s5')+'</div>';
    h+='<div class="field"><label>'+W('date')+'</label><input id="f_date" type="date" value="'+wiz.date+'" min="'+minD+'"></div>';
    h+='<div class="field"><label>'+(LANG==='da'?'Vælg tidspunkt':'Choose time')+'</label>';
    h+='<div class="slot-grid" id="slotGrid">';
    var SLOTS=['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
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
    var pkgInc=(wiz.pkg&&wiz.pkg.includes)||[];
    var allExtras=pkgInc.concat(wiz.extras);
    if(allExtras.length>0){
      var extNames=allExtras.map(function(id){var e=EXTRAS.filter(function(x){return x.id===id;})[0];return e?e.name[LANG]:'';}).filter(Boolean).join(', ');
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
  // bind context bar edit buttons
  wizBody.querySelectorAll('.wiz-ctx-edit').forEach(function(btn){btn.addEventListener('click',function(){saveStep();step=parseInt(btn.dataset.goto,10);drawWiz();});});
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
    // slot clicks handled inside renderSlotGrid
  }
  // bind car options
  wizBody.querySelectorAll('[data-car]').forEach(function(o){o.addEventListener('click',function(){wiz.car=CARS.filter(function(c){return c.id===o.dataset.car;})[0];wizBody.querySelectorAll('[data-car]').forEach(function(x){x.classList.remove('sel');});o.classList.add('sel');});});
  // bind package options — clear any extras that are now included in the new package
  wizBody.querySelectorAll('[data-pkg]').forEach(function(o){o.addEventListener('click',function(){wiz.pkg=PKGS.filter(function(p){return p.id===o.dataset.pkg;})[0];wizBody.querySelectorAll('[data-pkg]').forEach(function(x){x.classList.remove('sel');});o.classList.add('sel');if(wiz.pkg){var rel=wiz.pkg.relevant||[];var inc=wiz.pkg.includes||[];wiz.extras=wiz.extras.filter(function(id){return rel.indexOf(id)>=0&&inc.indexOf(id)<0;});}});});
  // bind extras (multi-select toggle)
  wizBody.querySelectorAll('[data-ext]').forEach(function(o){o.addEventListener('click',function(){var id=o.dataset.ext;var idx=wiz.extras.indexOf(id);if(idx>=0){wiz.extras.splice(idx,1);o.classList.remove('sel');}else{wiz.extras.push(id);o.classList.add('sel');}});});
  var bk=document.getElementById('wizBack');if(bk)bk.addEventListener('click',function(){saveStep();step--;drawWiz();});
  document.getElementById('wizNext').addEventListener('click',function(){
    saveStep();
    // Validate required fields per step
    if(step===1&&!wiz.car){showWizErr(LANG==='da'?'Vælg venligst din biltype.':'Please select your car type.');return;}
    if(step===2&&!wiz.pkg){showWizErr(LANG==='da'?'Vælg venligst en pakke.':'Please select a package.');return;}
    if(step===4&&!wiz.addr.trim()){showWizErr(LANG==='da'?'Indtast venligst din adresse.':'Please enter your address.');return;}
    if(step===5){
      if(!wiz.date){showWizErr(LANG==='da'?'Vælg venligst en dato.':'Please select a date.');return;}
      if(!wiz.time){showWizErr(LANG==='da'?'Vælg venligst et tidspunkt.':'Please select a time slot.');return;}
    }
    if(step===6&&!wiz.name.trim()){showWizErr(LANG==='da'?'Indtast venligst dit navn.':'Please enter your name.');return;}
    if(step===6&&!wiz.phone.trim()){showWizErr(LANG==='da'?'Indtast venligst dit telefonnummer.':'Please enter your phone number.');return;}
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
function nowCopenhagen(){
  // Returns current date+time string "YYYY-MM-DDTHH:MM" in Copenhagen timezone (handles DST automatically)
  return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Copenhagen',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'}).format(new Date()).replace(' ','T');
}
function isPastSlot(date,time){
  return (date+'T'+time)<nowCopenhagen();
}
function renderSlotGrid(grid,booked,date){
  var SLOTS=['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];
  var CAR_SLOTS={lille:2,mellem:3,stor:4,varebil:3};
  var need=CAR_SLOTS[wiz.car?wiz.car.id:'']||1;
  var visible=SLOTS.filter(function(s){return !isPastSlot(date,s);});
  if(visible.length===0){
    grid.innerHTML='<div class="slot-hint" style="grid-column:1/-1">'+(LANG==='da'?'Ingen ledige tider for denne dag. Vælg en anden dato.':'No available times for this day. Choose another date.')+'</div>';
    return;
  }
  // A slot is selectable only if all 'need' consecutive slots from it are free
  function canBook(s){
    var idx=SLOTS.indexOf(s);
    for(var i=0;i<need;i++){var t=SLOTS[idx+i];if(!t||booked.indexOf(t)>=0)return false;}
    return true;
  }
  // Which slots are in the selected range
  var selStart=wiz.time?SLOTS.indexOf(wiz.time):-1;
  var selSlots={};
  if(selStart>=0){for(var i=0;i<need;i++){if(SLOTS[selStart+i])selSlots[SLOTS[selStart+i]]=i===0?'sel':'sel-range';}}

  grid.innerHTML=visible.map(function(s){
    var isBooked=booked.indexOf(s)>=0;
    var blocked=!isBooked&&!canBook(s);
    var cls=isBooked?'booked':selSlots[s]?selSlots[s]:blocked?'unavail':'';
    var label=s+(isBooked?' <small>🔴</small>':'');
    return '<button class="slot'+(cls?' '+cls:'')+'" data-slot="'+s+'"'+((isBooked||blocked)?' disabled':'')+'>'+label+'</button>';
  }).join('');
  if(need>1&&!document.querySelector('.slot-dur-hint')){
    grid.insertAdjacentHTML('beforebegin','<p class="slot-dur-hint">'+(LANG==='da'?'Behandlingstid: <strong>~'+need+' timer</strong> – de markerede tider reserveres automatisk':'Service time: <strong>~'+need+' hours</strong> – marked slots reserved automatically')+'</p>');
  }
  grid.querySelectorAll('.slot:not([disabled])').forEach(function(btn){
    btn.addEventListener('click',function(){
      wiz.time=btn.dataset.slot;
      renderSlotGrid(grid,booked,date);
    });
  });
}
var _slotPollTimer=null;
function loadSlots(date){
  var grid=document.getElementById('slotGrid');if(!grid)return;
  grid.innerHTML='<div class="slot-hint" style="grid-column:1/-1">'+(LANG==='da'?'Henter ledige tider…':'Loading available times…')+'</div>';
  fetch('/api/book?date='+encodeURIComponent(date))
    .then(function(r){return r.json();})
    .then(function(res){renderSlotGrid(grid,res.booked||[],date);})
    .catch(function(){renderSlotGrid(grid,[],date);});
  // Poll every 30s so newly booked slots from other users appear automatically
  if(_slotPollTimer)clearInterval(_slotPollTimer);
  _slotPollTimer=setInterval(function(){
    var g=document.getElementById('slotGrid');
    if(!g){clearInterval(_slotPollTimer);_slotPollTimer=null;return;}
    fetch('/api/book?date='+encodeURIComponent(date))
      .then(function(r){return r.json();})
      .then(function(res){var g2=document.getElementById('slotGrid');if(g2)renderSlotGrid(g2,res.booked||[],date);})
      .catch(function(){});
  },30000);
}
function val(id){var e=document.getElementById(id);return e?e.value:'';}
function showWizErr(msg){
  var el=document.getElementById('wiz-err');
  if(!el){el=document.createElement('p');el.id='wiz-err';el.style.cssText='color:#e74c3c;font-size:13px;margin-top:8px;text-align:center;font-weight:600';document.getElementById('wizBody').appendChild(el);}
  el.textContent=msg;
  setTimeout(function(){if(el)el.textContent='';},3000);
}

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
      carId:wiz.car?wiz.car.id:null,
      pkg:wiz.pkg?wiz.pkg.name[LANG]:'-',
      extras:extList,
      addr:wiz.addr,zip:wiz.zip,city:wiz.city,
      date:wiz.date,time:wiz.time,
      name:wiz.name,phone:wiz.phone,email:wiz.email,msg:wiz.msg,
      price:priceStr,lang:LANG,
      slotsNeeded:({lille:2,mellem:3,stor:4,varebil:3}[wiz.car?wiz.car.id:'']||2)
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
  var items=[],cur=0;
  function open(idx){
    cur=idx;img.src=items[cur];lb.classList.add('open');document.body.style.overflow='hidden';
    document.getElementById('lbPrev').style.display=items.length>1?'':'none';
    document.getElementById('lbNext').style.display=items.length>1?'':'none';
  }
  function close(){lb.classList.remove('open');document.body.style.overflow='';img.src='';}
  function prev(){cur=(cur-1+items.length)%items.length;img.src=items[cur];}
  function next(){cur=(cur+1)%items.length;img.src=items[cur];}
  document.querySelectorAll('.gitem').forEach(function(g,i){
    items.push(g.dataset.full||g.querySelector('img')?.src||'');
    g.addEventListener('click',function(){open(i);});
  });
  document.getElementById('lbClose').addEventListener('click',close);
  document.getElementById('lbPrev').addEventListener('click',function(e){e.stopPropagation();prev();});
  document.getElementById('lbNext').addEventListener('click',function(e){e.stopPropagation();next();});
  lb.addEventListener('click',function(e){if(e.target===lb)close();});
  document.addEventListener('keydown',function(e){
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowLeft')prev();
    if(e.key==='ArrowRight')next();
  });
  // swipe support
  var tx=0;
  lb.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
  lb.addEventListener('touchend',function(e){
    var dx=e.changedTouches[0].clientX-tx;
    if(Math.abs(dx)>50){dx<0?next():prev();}
  });
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
  var opened=false,introPlayed=false,typingEl=null;
  var MINI_AV='<div class="chat-mini-av"><svg width="14" height="14" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="3" r="1.5" fill="#062313"/><line x1="12" y1="4.5" x2="12" y2="7" stroke="#062313" stroke-width="1.5" stroke-linecap="round"/><rect x="4" y="7" width="16" height="10" rx="3" fill="#062313"/><circle cx="8.5" cy="12" r="2" fill="#9afabd"/><circle cx="15.5" cy="12" r="2" fill="#9afabd"/><circle cx="8.5" cy="12" r="0.9" fill="#062313"/><circle cx="15.5" cy="12" r="0.9" fill="#062313"/><rect x="9" y="15.5" width="6" height="1.5" rx="0.75" fill="#9afabd"/></svg></div>';
  var FAQ={
    da:[
      {keys:['pris','kost','hvad kost','priser','billig','dyr'],
       ans:['Priserne starter fra <strong>499 kr</strong> for udvendig vask og <strong>799 kr</strong> for fuld pakke. Prisen afhænger af bilstørrelse og dit postnummer. <a href="#vaelg">👉 Se alle pakker her</a>',
            'Vi har pakker fra <strong>499 kr</strong> – ingen skjulte gebyrer! Prisen beregnes efter din bil og adresse. <a href="#vaelg">Sammenlign pakker →</a>'],
       follow:['Hvad er inkluderet?','Kan I komme i dag?','Book nu']},
      {keys:['inkluderet','hvad får','hvad indeholder','pakke indhold'],
       ans:['Det afhænger af pakken 😊 <br>• <strong>Udvendig:</strong> vask, fælge, glas og gummi<br>• <strong>Fuld:</strong> + indvendig rens<br>• <strong>Guld:</strong> alt inkl. motorrens og lakbeskyttelse<br><a href="#vaelg">Se pakkerne →</a>'],
       follow:['Hvad koster Guld?','Book nu']},
      {keys:['tid','lang','timer','varighed','hurtigt'],
       interactive:'duration_da',
       ans:[''],
       follow:[]},
      {keys:['sjælland','dækker','område','kørsel','postnr','kører','afstand','nærhed'],
       ans:['Vi dækker <strong>hele Sjælland</strong> – Storkøbenhavn, Nordsjælland og Sydsjælland. <strong>Kørsel er gratis</strong> til alle adresser. <a href="#vaelg">Se priser →</a>'],
       follow:['Hvad koster det?','Book nu']},
      {keys:['book','bestil','reserve','aftale','time','dato'],
       ans:['Booking er nemt! Vælg pakke, udfyld din adresse og vælg et tidspunkt. <a href="#vaelg">👉 Book her</a>',
            'Du kan booke direkte her på siden – det tager kun et par minutter. <a href="#vaelg">Klik her for at komme i gang →</a>'],
       follow:['Hvad koster det?','Dækker I mit område?']},
      {keys:['damp','dampvask','miljø','vand','skånsom','kemi'],
       ans:['Dampvask bruger varm damp under tryk med <strong>minimalt vandforbrug</strong>. Det renser skånsomt, desinficerer og er 100% miljøvenligt – perfekt til både interiør og eksteriør 🌿'],
       follow:['Se pakker','Book nu']},
      {keys:['leasing','lease','aflevering','retur','returnere'],
       ans:['Ja! Vi tilbyder <strong>Returklargøring</strong> – en grundig vask tilpasset leasingaflevering. Ring til os for et tilbud! <a href="tel:+4524440321">📞 +45 24 44 03 21</a>'],
       follow:['Hvad koster det?','Book nu']},
      {keys:['motor','motorrens','motorrum','motor'],
       ans:['Ja, <strong>motorrens (+400 kr)</strong> kan tilføjes til enhver pakke – og er allerede inkluderet i Guld-pakken 🔧 En grundig dampvask af motorrum.'],
       follow:['Se Guld pakken','Book nu']},
      {keys:['hjem','hjemme','arbejde','kontor','adresse'],
       ans:['Vi er <strong>100% mobile</strong> – vi kører ud til dig, hvad enten du er hjemme, på arbejdet eller et andet sted. Du behøver ikke flytte bilen! 🚗'],
       follow:['Book nu','Hvad koster det?']},
      {keys:['kontakt','ring','telefon','nummer','mail','email','skrive'],
       ans:['Du kan ringe til os på <a href="tel:+4524440321"><strong>+45 24 44 03 21</strong></a> eller skrive til <a href="mailto:elitevask01@gmail.com">elitevask01@gmail.com</a> 📩'],
       follow:['Book nu','Åbningstider']},
      {keys:['åbningstid','åbent','hvornår','åbnings','weekend','hverdage'],
       ans:['Vi holder åbent <strong>mandag–søndag kl. 08–20</strong>. Online booking er tilgængelig hele døgnet 🕗'],
       follow:['Book nu','Kontakt']},
      {keys:['garanti','tilfreds','klage','refund','utilfreds'],
       ans:['Vi tilbyder <strong>tilfredshedsgaranti</strong> – er du ikke tilfreds, finder vi en løsning 💚 Din tilfredshed er vores prioritet.'],
       follow:['Book nu','Kontakt']},
      {keys:['sæde','stof','indvendig','interiør','lugt'],
       ans:['Vi tilbyder <strong>indvendig rens</strong> med damp – sæder, gulvtæpper, instrumentpanel og alle overflader. Til stof-sæder tilbyder vi også dybderens. <a href="#vaelg">Se pakker →</a>'],
       follow:['Hvad koster det?','Book nu']},
    ],
    en:[
      {keys:['price','cost','how much','prices','cheap','expensive'],
       ans:['Prices start from <strong>499 kr</strong> for exterior wash and <strong>799 kr</strong> for a full package. Price depends on car size and zip code. <a href="#vaelg">👉 See all packages</a>',
            'We offer packages from <strong>499 kr</strong> – no hidden fees! Price is calculated based on your car and address. <a href="#vaelg">Compare packages →</a>'],
       follow:["What's included?","Can you come today?","Book now"]},
      {keys:['included','what do i get','package','contain'],
       ans:["Depends on the package 😊<br>• <strong>Exterior:</strong> wash, rims, glass and rubber<br>• <strong>Full:</strong> + interior cleaning<br>• <strong>Gold:</strong> everything + engine clean and paint protection<br><a href='#vaelg'>See packages →</a>"],
       follow:['How much is Gold?','Book now']},
      {keys:['time','long','hours','duration','fast','quick'],
       interactive:'duration_en',
       ans:[''],
       follow:[]},
      {keys:['zealand','area','cover','where','zip','distance'],
       ans:['We cover <strong>all of Zealand</strong> – Greater Copenhagen, North and South Zealand. Travel is calculated from your zip code. <a href="#vaelg">Check price for your area →</a>'],
       follow:['What does it cost?','Book now']},
      {keys:['book','order','reserve','appointment','date'],
       ans:['Booking is easy! Pick your package, enter your address and choose a time slot. <a href="#vaelg">👉 Book here</a>',
            'You can book directly on this page – it only takes a couple of minutes. <a href="#vaelg">Click here to get started →</a>'],
       follow:['What does it cost?','Do you cover my area?']},
      {keys:['steam','eco','water','environment','gentle','chemical'],
       ans:['Steam washing uses hot pressurized steam with <strong>minimal water use</strong>. It cleans gently, disinfects and is 100% eco-friendly – perfect for both interior and exterior 🌿'],
       follow:['See packages','Book now']},
      {keys:['lease','leasing','return'],
       ans:['Yes! We offer a <strong>Lease Return</strong> package – a thorough wash tailored for lease car returns. Call us for a custom quote! <a href="tel:+4524440321">📞 +45 24 44 03 21</a>'],
       follow:['What does it cost?','Book now']},
      {keys:['engine','engine clean','hood','motor'],
       ans:['Yes, <strong>engine cleaning (+400 kr)</strong> can be added to any package – and is already included in the Gold package 🔧'],
       follow:['See Gold package','Book now']},
      {keys:['home','address','workplace','office'],
       ans:['We are <strong>100% mobile</strong> – we drive to you whether you\'re at home, at work or anywhere else. No need to move your car! 🚗'],
       follow:['Book now','What does it cost?']},
      {keys:['contact','call','phone','number','mail','email'],
       ans:['You can call us at <a href="tel:+4524440321"><strong>+45 24 44 03 21</strong></a> or email <a href="mailto:elitevask01@gmail.com">elitevask01@gmail.com</a> 📩'],
       follow:['Book now','Opening hours']},
      {keys:['hours','open','when','weekend','weekday'],
       ans:['We are open <strong>Monday–Sunday 08–20</strong>. Online booking is available 24/7 🕗'],
       follow:['Book now','Contact']},
      {keys:['guarantee','not happy','complaint','refund'],
       ans:['We offer a <strong>satisfaction guarantee</strong> – if you\'re not happy, we\'ll find a solution 💚 Your satisfaction is our priority.'],
       follow:['Book now','Contact']},
      {keys:['seat','fabric','interior','smell'],
       ans:['We offer <strong>interior steam cleaning</strong> – seats, floor mats, dashboard and all surfaces. We also offer deep fabric seat cleaning. <a href="#vaelg">See packages →</a>'],
       follow:['What does it cost?','Book now']},
    ]
  };
  var QUICK={
    da:[{l:'💰 Hvad koster det?',q:'Hvad koster det?'},{l:'⏱ Hvor lang tid?',q:'Hvor lang tid?'},{l:'📍 Dækker I mit område?',q:'Dækker I mit område?'},{l:'🚗 Leasingbil?',q:'Kan I vaske leasingbil?'}],
    en:[{l:'💰 What does it cost?',q:'What does it cost?'},{l:'⏱ How long does it take?',q:'How long does it take?'},{l:'📍 Do you cover my area?',q:'Do you cover my area?'},{l:'🚗 Lease car?',q:'Can you clean lease cars?'}]
  };
  function showTyping(){
    if(typingEl)return;
    typingEl=document.createElement('div');typingEl.className='chat-typing';
    typingEl.innerHTML='<span></span><span></span><span></span>';
    msgs.appendChild(typingEl);msgs.scrollTop=msgs.scrollHeight;
  }
  function hideTyping(){if(typingEl){typingEl.remove();typingEl=null;}}
  function addMsg(html,who){
    hideTyping();
    var row=document.createElement('div');row.className='chat-row chat-row-'+who;
    if(who==='bot')row.innerHTML=MINI_AV;
    var d=document.createElement('div');d.className='chat-msg '+who+' msg-in';d.innerHTML=html;
    row.appendChild(d);msgs.appendChild(row);msgs.scrollTop=msgs.scrollHeight;
  }
  function showFollowUp(arr){
    if(!arr||!arr.length)return;
    setTimeout(function(){
      var fw=document.createElement('div');fw.className='chat-follow';
      arr.forEach(function(q){
        var btn=document.createElement('button');btn.className='follow-chip';btn.textContent=q;
        btn.addEventListener('click',function(){fw.remove();addMsg(q,'user');quick.innerHTML='';botReply(q);});
        fw.appendChild(btn);
      });
      msgs.appendChild(fw);msgs.scrollTop=msgs.scrollHeight;
    },350);
  }
  var DURATIONS={
    da:{
      q:'Hvilken bilstørrelse har du? 🚗',
      cars:[
        {l:'🚙 Lille bil',t:'100–120 min'},
        {l:'🚗 Mellemstor bil',t:'120–180 min'},
        {l:'🚐 Stor bil / SUV',t:'150–200 min'},
        {l:'🚚 Varebil',t:'90–180 min'}
      ],
      ans:'<strong>{l}</strong> tager typisk <strong>{t}</strong>. Vi bekræfter præcis tid ved booking 🕐',
      follow:['Hvad koster det?','Book nu']
    },
    en:{
      q:'Which car size do you have? 🚗',
      cars:[
        {l:'🚙 Small car',t:'100–120 min'},
        {l:'🚗 Medium car',t:'120–180 min'},
        {l:'🚐 Large car / SUV',t:'150–200 min'},
        {l:'🚚 Van',t:'90–180 min'}
      ],
      ans:'<strong>{l}</strong> typically takes <strong>{t}</strong>. We confirm exact time at booking 🕐',
      follow:['What does it cost?','Book now']
    }
  };
  function showDurationPicker(){
    var d=DURATIONS[LANG]||DURATIONS.da;
    showTyping();
    setTimeout(function(){
      addMsg(d.q,'bot');
      var fw=document.createElement('div');fw.className='chat-follow';
      d.cars.forEach(function(car){
        var btn=document.createElement('button');btn.className='follow-chip';btn.textContent=car.l;
        btn.addEventListener('click',function(){
          fw.remove();
          addMsg(car.l,'user');
          var ans=d.ans.replace('{l}',car.l).replace('{t}',car.t);
          showTyping();
          setTimeout(function(){addMsg(ans,'bot');showFollowUp(d.follow);},800);
        });
        fw.appendChild(btn);
      });
      msgs.appendChild(fw);msgs.scrollTop=msgs.scrollHeight;
    },700);
  }
  function botReply(text){
    var faq=FAQ[LANG]||FAQ.da;var tl=text.toLowerCase();var match=null;
    for(var i=0;i<faq.length;i++){for(var j=0;j<faq[i].keys.length;j++){if(tl.includes(faq[i].keys[j])){match=faq[i];break;}}if(match)break;}
    if(match&&match.interactive&&match.interactive.startsWith('duration')){
      showDurationPicker();return;
    }
    var ans,follow;
    if(match){
      var av=match.ans;ans=Array.isArray(av)?av[Math.floor(Math.random()*av.length)]:av;follow=match.follow;
    }else{
      ans=LANG==='da'?'Hmm, det er jeg ikke helt sikker på 🤔 Ring til os på <a href="tel:+4524440321"><strong>+45 24 44 03 21</strong></a> – vi hjælper med det samme!':'Hmm, I\'m not entirely sure 🤔 Call us at <a href="tel:+4524440321"><strong>+45 24 44 03 21</strong></a> – we\'ll help right away!';
      follow=LANG==='da'?['Hvad koster det?','Book nu']:['What does it cost?','Book now'];
    }
    showTyping();
    var delay=Math.min(700+ans.length*5,2000);
    setTimeout(function(){addMsg(ans,'bot');showFollowUp(follow);},delay);
  }
  function sendMsg(){
    var txt=input.value.trim();if(!txt)return;
    addMsg(txt,'user');input.value='';send.disabled=true;
    quick.innerHTML='';botReply(txt);
    setTimeout(function(){send.disabled=!input.value.trim();},600);
  }
  function showQuick(){
    quick.innerHTML='';
    (QUICK[LANG]||QUICK.da).forEach(function(item){
      var btn=document.createElement('button');btn.className='chat-chip';btn.textContent=item.l;
      btn.addEventListener('click',function(){addMsg(item.q,'user');quick.innerHTML='';botReply(item.q);});
      quick.appendChild(btn);
    });
  }
  function showGreeting(){
    if(msgs.children.length===0){
      setTimeout(function(){
        addMsg(LANG==='da'?'Hej! 👋 Jeg er <strong>Elite Bot</strong>. Hvad kan jeg hjælpe dig med i dag?':'Hi! 👋 I\'m <strong>Elite Bot</strong>. How can I help you today?','bot');
        setTimeout(showQuick,350);
      },250);
    }
  }
  input.addEventListener('input',function(){send.disabled=!input.value.trim();});
  send.disabled=true;
  toggle.addEventListener('click',function(){
    if(!opened){
      win.style.display='flex';win.style.flexDirection='column';
      win.classList.add('opening');setTimeout(function(){win.classList.remove('opening');},350);
      badge.style.display='none';opened=true;
      var intro=document.getElementById('chatIntro');
      if(intro&&!introPlayed){
        introPlayed=true;intro.style.display='flex';
        setTimeout(function(){intro.classList.add('hiding');setTimeout(function(){intro.style.display='none';showGreeting();},450);},3200);
      }else{showGreeting();}
    }else{win.style.display='none';opened=false;}
  });
  document.getElementById('chatClose').addEventListener('click',function(){win.style.display='none';opened=false;});
  send.addEventListener('click',sendMsg);
  input.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey)sendMsg();});
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

/* ====== DESKTOP PARALLAX ONLY ====== */
if(window.innerWidth>880){
  var heroBg=document.querySelector('.hero-bg-img');
  if(heroBg){
    window.addEventListener('scroll',function(){
      var y=window.scrollY;
      heroBg.style.transform='translateY('+Math.round(y*0.25)+'px)';
    },{passive:true});
  }
}

applyLang();
}
