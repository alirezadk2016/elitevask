// Auto-extracted from original elitevask.html — runs once on mount.
export function initSite(overrides){overrides=overrides||{};
// Document/window-level listeners below accumulate on every init (React
// StrictMode runs effects twice in dev; client-side navigation back to the
// homepage re-runs initSite). Tie all global listeners to an AbortController
// that we abort at the start of each run, so stale handlers are torn down
// instead of stacking up. Element-level listeners attach to fresh DOM each
// run, so they don't need this.
var __sig;
if(typeof window!=='undefined'){
  if(window.__evAbort){try{window.__evAbort.abort();}catch(e){}}
  window.__evAbort=new AbortController();
  __sig=window.__evAbort.signal;
}
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
  {id:"guld",pop:false,gold:true,includes:["motor","lak"],relevant:["haar","barnesaede"],name:{da:"Guld pakke",en:"Gold package"},desc:{da:"Motorrens + lakforsegling + dybdebehandling inkl.",en:"Engine clean + paint sealant + deep treatment incl."},feat:{da:["Alt ind & ud","+ Motorrens","+ Lak- & glansbeskyttelse","+ Dybderens ved uheld","+ Interiørbeskyttelse"],en:["Everything in & out","+ Engine clean","+ Paint & gloss protection","+ Deep clean if needed","+ Interior protection"]}}
];
var EXTRAS=[
  {id:"motor",name:{da:"Motorrens",en:"Engine clean"},price:400,desc:{da:"Grundig afrensning af motorrum",en:"Thorough engine bay cleaning"}},
  {id:"lak",name:{da:"Lak & glansbeskyttelse",en:"Paint & gloss protection"},price:300,desc:{da:"Udvendig – langvarig ekstra glans",en:"Exterior – long-lasting gloss"}},
  {id:"pleje",name:{da:"Indvendig pleje & beskyttelse",en:"Interior care & protection"},price:200,desc:{da:"Beskytter og fornyer interiøret",en:"Protects and renews the interior"}},
  {id:"haar",name:{da:"Fjernelse af dyrehår",en:"Pet hair removal"},price:300,desc:{da:"Effektiv fjernelse af hår og fnug",en:"Effective removal of hair and lint"}},
  {id:"saede",name:{da:"Sæderens (stof)",en:"Seat clean (fabric)"},price:400,desc:{da:"Dybderens af stofsæder",en:"Deep clean of fabric seats"}},
  {id:"barnesaede",name:{da:"Barnesæde rens",en:"Child seat cleaning"},price:100,desc:{da:"Grundig og sikker rengøring",en:"Thorough and safe cleaning"}}
];
if(overrides.prices){CARS.forEach(function(c){if(overrides.prices[c.id])Object.assign(c.prices,overrides.prices[c.id]);});}
if(overrides.extras&&overrides.extras.length)EXTRAS=overrides.extras;
var REVIEWS=[];
var FAQ=[
  {q:{da:"Kan dampvask skade lakken?",en:"Can steam washing damage the paintwork?"},a:{da:"Nej – dampvask er faktisk <strong>skånsom for lakken</strong> end traditionel højtryk- eller tunnelvask. Vi bruger professionel damp ved kontrolleret temperatur og bløde mikrofiberklude. Der bruges ingen roterende børster, der kan ridse, og ingen aggressive kemikalier, der kan angribe lakken. Metoden er anbefalet til biler med keramisk coating, poleret lak og sarte overflader.",en:"No – steam washing is actually <strong>gentler on paintwork</strong> than traditional high-pressure or tunnel washing. We use professional steam at controlled temperature and soft microfibre cloths. No rotating brushes that can scratch, and no aggressive chemicals that attack the paint. The method is recommended for cars with ceramic coating, polished paint and delicate surfaces."}},
  {q:{da:"Hvor lang tid tager det?",en:"How long does it take?"},a:{da:"Det afhænger af bilstørrelse og pakke:<br>• <strong>Lille bil:</strong> 100–120 min<br>• <strong>Mellemstor bil:</strong> 120–180 min<br>• <strong>Stor bil / SUV:</strong> 150–200 min<br>• <strong>Varebil:</strong> 90–180 min<br>Vi er altid præcise med vores tidsestimater og holder dig opdateret undervejs.",en:"It depends on car size and package:<br>• <strong>Small car:</strong> 100–120 min<br>• <strong>Medium car:</strong> 120–180 min<br>• <strong>Large car / SUV:</strong> 150–200 min<br>• <strong>Van:</strong> 90–180 min<br>We always give accurate time estimates and keep you updated throughout."}},
  {q:{da:"Skal jeg være hjemme?",en:"Do I need to be home?"},a:{da:"Ikke nødvendigvis. Mange kunder er på arbejde, mens vi vasker bilen. Det eneste krav er, at bilen er tilgængelig og at der er fri adgang rundt om den. Har du en nøgle til bilen vi skal bruge, aftaler vi blot udvekslingen på forhånd. Ring eller skriv til os, så finder vi en løsning der passer dig.",en:"Not necessarily. Many customers are at work while we wash the car. The only requirement is that the car is accessible and there is clear space around it. If we need a key, we simply arrange the exchange in advance. Call or message us and we'll find a solution that suits you."}},
  {q:{da:"Vasker I elbiler?",en:"Do you wash electric cars?"},a:{da:"Ja, vi vasker alle typer elbiler – Tesla, Polestar, VW ID, Hyundai Ioniq og alle andre mærker. Dampvask er faktisk <strong>ideelt til elbiler</strong>: vi bruger minimalt vand, ingen aggressive kemikalier der kan påvirke tætninger og elektronik, og vi undgår højtryk tæt på batteripakke og ladeporte. Mange elbilsejere foretrækker netop dampvask.",en:"Yes, we wash all types of electric cars – Tesla, Polestar, VW ID, Hyundai Ioniq and all other brands. Steam washing is actually <strong>ideal for EVs</strong>: we use minimal water, no aggressive chemicals that could affect seals and electronics, and we avoid high pressure near the battery pack and charging ports. Many EV owners specifically prefer steam washing."}},
  {q:{da:"Hvad hvis det regner?",en:"What if it rains?"},a:{da:"Let regn er sjældent et problem – vi kan vaske under overdækning, i carporte eller i garager. Ved kraftigt regn kontakter vi dig dagen inden og tilbyder at ombooke til nærmeste ledige tid <strong>helt uden gebyr</strong>. Vi er fleksible og finder altid en løsning der passer begge parter.",en:"Light rain is rarely a problem – we can wash under cover, in carports or in garages. In heavy rain we contact you the day before and offer to rebook to the nearest available time <strong>completely free of charge</strong>. We are flexible and always find a solution that suits both parties."}},
  {q:{da:"Hvad koster mobil bilvask?",en:"What does mobile car wash cost?"},a:{da:"Prisen afhænger af biltype og pakke:<br>• <strong>Udvendig vask:</strong> fra 500 kr<br>• <strong>Hel bil (ind & ud):</strong> fra 800 kr<br>• <strong>Guld pakke</strong> (inkl. motorrens + lakforsegling): fra 2.000 kr<br>Kørsel til din adresse på Sjælland er <strong>gratis</strong>. <a href='#vaelg'>Se alle priser her →</a>",en:"Price depends on car type and package:<br>• <strong>Exterior wash:</strong> from 500 kr<br>• <strong>Full car (in & out):</strong> from 800 kr<br>• <strong>Gold package</strong> (incl. engine clean + paint protection): from 2,000 kr<br>Travel to your address on Zealand is <strong>free</strong>. <a href='#vaelg'>See all prices →</a>"}},
  {q:{da:"Kommer I til min adresse?",en:"Do you come to my address?"},a:{da:"Ja – det er hele idéen! Vi er 100% mobile og kører ud til dig, uanset om du er hjemme, på arbejdet eller i sommerhuset. Du behøver slet ikke flytte dig. Vi medbringer alt udstyr.",en:"Yes – that's the whole idea! We are 100% mobile and drive to you, whether you're at home, at work or at the summer house. You don't need to move. We bring all equipment."}},
  {q:{da:"Er dampvask sikkert for min bil?",en:"Is steam washing safe for my car?"},a:{da:"Ja, dampvask er faktisk <strong>skånsomt for bilen</strong> end traditionel højtryk- eller tunnelvask. Vi bruger professionelle, pH-neutrale produkter og varm damp der løsner snavs uden at ridse lakken. Metoden bruges af professionelle detailere verden over og er anbefalet til biler med keramisk coating, poleret lak og sarte overflader.",en:"Yes, steam washing is actually <strong>gentler for your car</strong> than traditional high-pressure or tunnel washing. We use professional, pH-neutral products and hot steam that loosens dirt without scratching the paint. The method is used by professional detailers worldwide and is recommended for cars with ceramic coating, polished paint and delicate surfaces."}},
  {q:{da:"Arbejder I i hele Sjælland?",en:"Do you work all over Zealand?"},a:{da:"Ja! Vi dækker hele Sjælland – postnumre 1000–4799 – inkl. Storkøbenhavn, Nordsjælland, Køge, Roskilde, Næstved, Ringsted og omegn. <strong>Kørsel er gratis</strong> til alle adresser inden for serviceområdet. Usikker på om vi dækker dit område? Ring til os på +45 24 44 03 21.",en:"Yes! We cover all of Zealand – postcodes 1000–4799 – including Greater Copenhagen, North Zealand, Køge, Roskilde, Næstved, Ringsted and surrounding areas. <strong>Travel is free</strong> to all addresses within the service area. Unsure if we cover your area? Call us on +45 24 44 03 21."}},
  {q:{da:"Hvad er inkluderet i Guld pakken?",en:"What is included in the Gold package?"},a:{da:"Guld pakken er vores mest komplette behandling og inkluderer <strong>alt</strong>:<br>• Komplet udvendig dampvask<br>• Grundig indvendig rens<br>• Professionel <strong>motorrens</strong><br>• <strong>Lak- & glansbeskyttelse</strong> (lakforsegling)<br>• Interiørbeskyttelse<br>• Dybderens ved uheld<br>Det er vores mest populære valg til biler der skal fremstå som nye.",en:"The Gold package is our most complete treatment and includes <strong>everything</strong>:<br>• Complete exterior steam wash<br>• Thorough interior clean<br>• Professional <strong>engine clean</strong><br>• <strong>Paint & gloss protection</strong> (paint sealant)<br>• Interior protection<br>• Deep clean if needed<br>It's our most popular choice for cars that need to look brand new."}},
  {q:{da:"Kan I vaske leasingbiler?",en:"Can you clean lease cars?"},a:{da:"Ja, vi klargør leasingbiler til aflevering. Vi sørger for at bilen fremstår ren og velholdt – både udvendigt og indvendigt – så du undgår ekstraomkostninger ved aflevering.",en:"Yes, we prepare lease cars for return. We ensure the car looks clean and well-maintained – both inside and out – so you avoid extra costs at return."}},
  {q:{da:"Hvad er forskellen på dampvask og almindelig bilvask?",en:"What is the difference between steam wash and regular wash?"},a:{da:"Traditionel bilvask (tunnelvask eller højtryk) ridser lakken over tid med børster og aggressive kemikalier. <strong>Dampvask</strong> bruger varme og tryk til at løsne snavs skånsomt – uden børster, uden aggressive kemikalier og med op til 90% mindre vandforbrug. Resultatet er en dybere rens, bedre glans og ingen mikroridser.",en:"Traditional car washing (tunnel wash or high pressure) scratches the paint over time with brushes and aggressive chemicals. <strong>Steam washing</strong> uses heat and pressure to gently loosen dirt – without brushes, without aggressive chemicals and with up to 90% less water. The result is a deeper clean, better gloss and no micro-scratches."}},
  {q:{da:"Skal jeg forberede bilen inden I kommer?",en:"Do I need to prepare the car before you arrive?"},a:{da:"Det er ikke nødvendigt, men du er velkommen til at fjerne løse genstande og personlige ejendele fra kabinen. Sørg blot for at bilen er tilgængelig og at der er fri plads rundt om den. Vi klarer resten!",en:"It's not necessary, but you're welcome to remove loose items and personal belongings from the cabin. Just make sure the car is accessible and there's clear space around it. We'll do the rest!"}},
  {q:{da:"Kan I vaske elbiler og hybridbiler?",en:"Can you wash electric and hybrid cars?"},a:{da:"Ja, vi vasker alle typer elbiler og hybridbiler. Dampvask er faktisk ideel til elbiler – vi bruger minimalt vand og ingen aggressive kemikalier, der kan påvirke tætninger og elektronik. Vi undgår naturligvis højtryksrenser tæt på batteripakken og ladeporte.",en:"Yes, we wash all types of electric and hybrid cars. Steam washing is actually ideal for EVs – we use minimal water and no aggressive chemicals that could affect seals and electronics. We naturally avoid high-pressure washing near the battery pack and charging ports."}},
  {q:{da:"Hvad er forskellen på udvendig, indvendig og hel vask?",en:"What is the difference between exterior, interior and full wash?"},a:{da:"Udvendig vask dækker karosseri, ruder, fælge og dæk. Indvendig vask dækker sæder, gulvmåtter, instrumentbræt, dørpaneler og ruder indefra. Hel vask er kombinationen af begge og er den mest populære løsning – alt renses i ét besøg.",en:"Exterior wash covers bodywork, windows, rims and tyres. Interior wash covers seats, floor mats, dashboard, door panels and windows from inside. Full wash is the combination of both and is our most popular option – everything is cleaned in a single visit."}},
{q:{da:"Hvad sker der, hvis det regner på min bookingdag?",en:"What happens if it rains on my booking day?"},a:{da:"Vi kontakter dig dagen inden og tilbyder enten at fortsætte (let regn er sjældent et problem indendørs eller under overdækning) eller at ombooke til nærmeste ledige tid uden ekstra gebyr. Vi er fleksible og finder altid en løsning.",en:"We contact you the day before and offer either to continue (light rain is rarely a problem indoors or under cover) or to rebook to the nearest available time at no extra charge. We are flexible and always find a solution."}},
  {q:{da:"Bruger I kemikalier, der kan skade lakken?",en:"Do you use chemicals that can damage the paintwork?"},a:{da:"Nej. Vi bruger miljøvenlige rengøringsmidler, der er testet til brug på biloverflader. Dampvasken kræver desuden langt færre kemikalier end traditionel bilvask – den varme damp opløser snavs og fedt mekanisk uden at angribe lakken.",en:"No. We use eco-friendly cleaning agents tested for use on car surfaces. Steam washing also requires far fewer chemicals than traditional car washing – the hot steam dissolves dirt and grease mechanically without attacking the paintwork."}},
  {q:{da:"Kan I vaske bilen, selvom den er meget beskidt eller fuld af dyrehår?",en:"Can you wash the car even if it is very dirty or full of pet hair?"},a:{da:"Ja. Vi er vant til biler i alle tilstande – fra leasingbiler klar til aflevering til familievogne med sæsoners ophobede snavs og kæledyrhår. Meget kraftig tilsmudsning kan i nogle tilfælde kræve ekstra tid, som vi aftaler med dig på forhånd.",en:"Yes. We are used to cars in all conditions – from lease cars ready for return to family vehicles with seasons of accumulated dirt and pet hair. Very heavy soiling may in some cases require extra time, which we agree with you in advance."}},
  {q:{da:"Tilbyder I erhvervsaftaler til virksomheder med flåder?",en:"Do you offer business agreements for companies with fleets?"},a:{da:"Ja, vi laver aftaler med virksomheder, der har behov for regelmæssig vask af firmabiler, varevogne eller hele flåder. Kontakt os på info@elite-vask.dk for et tilbud tilpasset jeres behov og lokation.",en:"Yes, we make agreements with companies that need regular washing of company cars, vans or entire fleets. Contact us at info@elite-vask.dk for a quote tailored to your needs and location."}},
  {q:{da:"Hvad er jeres aflysningspolitik?",en:"What is your cancellation policy?"},a:{da:"Du kan aflyse eller ombooke gratis op til 24 timer inden din booking. Ved aflysning kortere end 24 timer forbeholder vi os retten til at opkræve et aflysningsgebyr på 150 kr. for at dække den reserverede kørselstid.",en:"You can cancel or rebook for free up to 24 hours before your booking. For cancellations less than 24 hours in advance, we reserve the right to charge a cancellation fee of 150 kr to cover the reserved travel time."}},
  {q:{da:"Rengør I sæder af læder og stof forskelligt?",en:"Do you clean leather and fabric seats differently?"},a:{da:"Ja. Læder behandles med skånsom rengøring og afsluttes med en fugtighedscreme, der holder læret blødt og forhindrer revner. Stofbeklædning damprenses, hvilket løsner snavs, fjerner lugt og dræber bakterier uden at mætte stoffet med vand.",en:"Yes. Leather is treated with gentle cleaning and finished with a moisturising cream that keeps the leather supple and prevents cracking. Fabric upholstery is steam cleaned, which loosens dirt, removes odours and kills bacteria without saturating the fabric with water."}},
  {q:{da:"Hvad dækker tilfredsheds­garantien?",en:"What does the satisfaction guarantee cover?"},a:{da:"Hvis du ikke er tilfreds med resultatet, kigger vi altid på det igen og udbedrer det, der ikke lever op til vores standard – uden ekstra betaling. Vi beder dig blot kontakte os inden for 24 timer efter vasken med en beskrivelse og evt. billeder.",en:"If you are not satisfied with the result, we always take another look and fix anything that does not meet our standard – at no extra charge. We simply ask you to contact us within 24 hours after the wash with a description and any photos."}}
];
if(overrides.faq&&overrides.faq.length>=5)FAQ=overrides.faq;
var I18N={
  da:{ann_main:"Betal først når bilen er ren",ann_sub:"Ingen forudbetaling – 100% tilfredshedsgaranti",tb_local:"Lokalt firma på Sjælland",tb_ins:"Forsikret virksomhed",tb_rating:"Google anmeldelser",tb_mobile:"Mobil dampvask",nav_choose:"Priser",nav_work:"Galleri",nav_guide:"Guide",nav_reviews:"Anmeldelser",nav_contact:"Kontakt",nav_book:"Book nu",hero_badge:"Vi kører til dig – hele Sjælland",hero_h1a:"Vi kører til dig",hero_h1b:"og vasker din bil",hero_p:"Professionel mobil dampvask i hele Sjælland – vi kører til din adresse. Ingen kø, ingen kemi, bare en skinnende ren bil.",flow1:"Vælg biltype",flow2:"Se pris",flow3:"Book tid",hero_cta1:"Se priser",hero_cta2:"Book med det samme",htm_guarantee:"100% tilfredshedsgaranti",htm_rating:"5.0 på Google",htm_free:"Gratis kørsel",hero_t1:"Rent",hero_t2:"Effektivt",hero_t3:"Miljøvenligt",plate_search:"Slå op",plate_or:"– eller vælg manuelt –",sel_eyebrow:"Trin 1 af 2",sel_title:"Find pris til din bil",sel_sub:"Vælg din biltype nedenfor og se prisen med det samme.",calc_head_p:"Vælg den pakke der passer til dig",calc_note:"Priserne er vejledende og inkl. moms. Endelig pris bekræftes ved booking.",chip_drive:"Gratis kørsel – hele Sjælland",chip_guar:"Tilfredshedsgaranti",chip_pay:"Betal efter vask",trust1t:"Forsikret & professionel",trust1p:"Erfarne fagfolk · fuldt forsikret arbejde",trust2t:"Ingen forudbetaling",trust2p:"Du betaler først, når bilen er ren",trust3t:"Tilfredshedsgaranti",trust3p:"Ikke tilfreds? Så finder vi en løsning",trust4t:"Gratis kørsel",trust4p:"Vi kører til dig – hele Sjælland",trust_head:"Gælder alle pakker – altid inkluderet",vid_eyebrow:"Live optagelse",vid_title2:"Se dampen arbejde",vid_sub2:"Oplev vores mobile bilpleje i aktion – optaget på stedet, mens vi arbejder hjemme hos kunden.",ba_before:"Før",ba_after:"Efter",ba_c1:"Motorrens · Peugeot",ba_c2:"Motorrum · dybderens",ba_c3:"Sæderens · stofsæder",ba_c4:"Interiør · kabine",ba_c5:"Fodrum · måtter",ba_c6:"Tagkant · algerens",gal_sub2:"Flere eksempler på bilvask hjemme og bilrengøring hjemme hos kunden – klik for fuld størrelse.",g_bmw:"Dampvask · BMW",g_hood:"Motorhjelm · damp",see_all_ba:"Se alle før & efter",see_all_gallery:"Se hele galleriet",st1:"Biler vasket",st2:"Behandlingstid",st3:"Ingen forudbetaling",st4:"Vi kører til dig",how_eyebrow:"Sådan virker det",how_title:"3 nemme trin",how1t:"Vælg og book",how1p:"Vælg biltype og pakke, og book en tid på få minutter.",how2t:"Vi kører ud",how2p:"Vi ankommer med alt udstyr direkte til din adresse.",how3t:"Bilen skinner",how3p:"Nyd en ren, frisk bil. Du behøvede ikke flytte dig.",ba_eyebrow:"Vores arbejde",ba_title:"Før & efter",ba_sub:"Træk i slideren og se forskellen – ægte resultater fra professionel mobil bilvask hos vores kunder.",ba_cap:"Motorrens · Peugeot – afrenset med damp",vid_badge:"Se os i aktion",vid_title:"Professionel dampvask",vid_sub:"Se hvordan vi transformer din bil – fra snavset til skinnende ren",gal_eyebrow:"Galleri",gal_title:"Flere billeder fra vores arbejde",g_seat_for:"Sæderens · før",g_seat_efter:"Sæderens · efter",g_floor_for:"Fodrum · før",g_floor_efter:"Fodrum · efter",g_fuel_for:"Tankdæksel · før",g_fuel_efter:"Tankdæksel · efter",g_roof:"Tagkant · algerens",g_pedal:"Pedalområde · rens",g_onsite:"Mobil dampvask · på stedet",ex_eyebrow:"Tilvalg",ex_title:"Ekstra ydelser",ex_sub:"Kan tilføjes til enhver pakke. Indgår i Guld pakken.",ex1t:"Motorrens",ex1p:"Grundig afrensning af motorrum",ex2t:"Lak- & glansbeskyttelse",ex2p:"Udvendig – langvarig ekstra glans",ex3t:"Indvendig pleje & beskyttelse",ex3p:"Beskytter og fornyer interiøret",ex4t:"Fjernelse af dyrehår",ex4p:"Effektiv fjernelse af hår og fnug",ex5t:"Sæderens (stof)",ex5p:"Dybderens af stofsæder",ex6t:"Rens af barnesæde",ex6p:"Grundig og sikker rengøring",why_eyebrow:"Hvorfor vælge os",why_title:"Det lover vi – hver eneste gang",why1t:"Gennemsigtige priser",why1p:"Du kender prisen, før vi kører ud. Ingen overraskelser.",why2t:"Miljøvenlig dampvask",why2p:"Skånsom metode med minimalt vandforbrug.",why3t:"Vi kommer til dig",why3p:"Hjemme, på kontoret eller i sommerhuset.",why4t:"Tilfredshedsgaranti",why4p:"Ikke tilfreds? Så finder vi en løsning.",steam_eyebrow:"Hvad er dampvask?",steam_title:"Sådan virker det i praksis",steam_sub:"Damp ved høj temperatur løsner snavs fra overfladen uden børster og hårde kemikalier – skånsomt mod lakken, effektivt mod urenheder.",steam_f1t:"Ingen ridser – ingen børster",steam_f1p:"Damp løsner snavs ved høj temperatur uden mekanisk kontakt. Det betyder, at lakken forbliver intakt – der er ingen roterende børster eller højtryk, der kan efterlade mærker.",steam_f2t:"Lakken trækker vejret igen",steam_f2p:"Når overfladebelægninger og indgroet snavs er fjernet, kommer bilens originalfarve tydeligere frem. Du behøver ikke voks for at se forskel – renlighed er nok.",steam_f3t:"Bruger næsten ikke vand",steam_f3p:"En typisk vask bruger 3–5 liter vand mod 150–200 liter i en traditionel vaskehal. Det er godt for dit kloaksystem, og det er godt for miljøet.",info_eyebrow:"Om Elite Vask",info_title:"Mød holdet bag",info_sub:"Her fortæller vi snart mere om os og det udstyr, vi bruger.",info1t:"Hvorfor vælge Elite Vask?",info1p:"Premium mobil bilvask — vi sætter standarden. Klik for at læse mere.",info_soon:"Tilføjes snart",why_i1t:"Vi kommer direkte til dig",why_i1p:"Ingen ventetid i vaskehal. Vi møder op til din adresse i hele Sjælland — til tiden, klar til at levere.",why_i2t:"Håndværksmæssig præcision",why_i2p:"Hver bil behandles individuelt med fuld opmærksomhed og professionel teknik. Vi giver aldrig køb på kvaliteten.",why_i3t:"Bæredygtig damprensning",why_i3p:"Vores damp-teknologi bruger op til 90 % mindre vand end konventionelle bilvaske — skånsomt for naturen, hårdt mod snavs.",why_i4t:"Skåner lakken — altid",why_i4p:"Vi anvender udelukkende professionelle, pH-neutrale produkter som beskytter og bevarer bilens overflade.",why_i5t:"Dybdeglans & perfektion",why_i5p:"Dampen penetrerer overfladen, fjerner indgroet snavs og fremhæver bilens naturlige glans — fra hjul til tag.",why_i6t:"Betal kun når du er tilfreds",why_i6p:"Ingen forudbetaling. Vi fakturerer udelukkende efter afsluttet arbejde og din fulde tilfredshed.",why_i7t:"Service i verdensklasse",why_i7p:"Vi tilstræber at overgå dine forventninger ved hvert besøg — fra første kontakt til det afsluttende håndtryk.",info2t:"Vores udstyr",info2p:"Vi arbejder med Optima Steamer XD2 – en professionel damprenser med kontinuerlig damp, høj temperatur og minimalt vandforbrug. Perfekt til skånsom og effektiv bilvask.",info3t:"Dækningsområde",info3p:"Vi dækker store dele af Sjælland, herunder Storkøbenhavn.",rev_eyebrow:"Kundeanmeldelser",rev_title:"Det siger vores kunder",rev_empty_t:"Anmeldelser vises her snart",rev_empty_p:"Vi forbinder vores Google Business-profil. Når den er klar, vises rigtige kundeanmeldelser automatisk her.",rev_empty_cta:"Book din vask",faq_eyebrow:"Spørgsmål & svar",faq_title:"Ofte stillede spørgsmål",local_eyebrow:"Serviceområde",local_title:"Mobil bilvask i hele Sjælland",ct_title:"Klar til en skinnende ren bil?",ct_lead:"Kontakt os i dag og book din mobile dampvask. Vi kører til dig – nemt, hurtigt og lokalt.",ct_book:"Book online nu",ct_call:"Ring til os",ct_phone:"Telefon",ct_email:"E-mail",ct_addr:"Adresse",ct_hours:"Åbningstider",ct_hours_v:"Man–Fre · 08–20 · Lør–Søn · 10–20 · eller efter aftale",ct_h_wday:"Man – Fre",ct_h_wend:"Lør – Søn",ct_h_note:"eller efter aftale",foot_p:"Mobil bil dampvask på Sjælland. Vi kører til dig og vasker din bil – rent, effektivt og miljøvenligt.",foot_s1:"Service",foot_l1:"Vælg bil & priser",foot_l2:"Vores arbejde",foot_l3:"Anmeldelser",foot_s2:"Kontakt",m_call:"Ring nu",m_book:"Book nu",wiz_title:"Book din bilvask",chat_status:"Online nu",chat_intro_label:"Elite Bot er klar!",faqMore:"Se alle spørgsmål",faqLess:"Vis færre"},
  en:{ann_main:"Pay only when your car is clean",ann_sub:"No prepayment – 100% satisfaction guarantee",tb_local:"Local company on Zealand",tb_ins:"Insured business",tb_rating:"Google reviews",tb_mobile:"Mobile steam wash",nav_choose:"Prices",nav_work:"Gallery",nav_guide:"Guide",nav_reviews:"Reviews",nav_contact:"Contact",nav_book:"Book now",hero_badge:"We drive to you – all of Zealand",hero_h1a:"We drive to you",hero_h1b:"and wash your car",hero_p:"Professional mobile steam wash across Zealand – we drive to your address. No queues, no chemicals, just a spotless car.",flow1:"Choose car type",flow2:"See price",flow3:"Book time",hero_cta1:"See prices",hero_cta2:"Book right away",htm_guarantee:"100% satisfaction guarantee",htm_rating:"5.0 on Google",htm_free:"Free travel",hero_t1:"Clean",hero_t2:"Effective",hero_t3:"Eco-friendly",plate_search:"Search",plate_or:"– or select manually –",sel_eyebrow:"Step 1 of 2",sel_title:"Find price for your car",sel_sub:"Select your car type below and see the price instantly.",calc_head_p:"Pick the package that suits you",calc_note:"Prices are guidance and incl. VAT. Final price confirmed at booking.",chip_drive:"Free travel – all of Zealand",chip_guar:"Satisfaction guarantee",chip_pay:"Pay after wash",trust1t:"Insured & professional",trust1p:"Experienced pros · fully insured work",trust2t:"No prepayment",trust2p:"You only pay once the car is clean",trust3t:"Satisfaction guarantee",trust3p:"Not happy? Then we'll find a solution",trust4t:"Free travel",trust4p:"We come to you – all of Zealand",trust_head:"Applies to all packages – always included",vid_eyebrow:"Live footage",vid_title2:"Watch the steam work",vid_sub2:"Filmed on location with our customers – precision, power and care in every move.",ba_before:"Before",ba_after:"After",ba_c1:"Engine clean · Peugeot",ba_c2:"Engine bay · deep clean",ba_c3:"Seat clean · fabric",ba_c4:"Interior · cabin",ba_c5:"Footwell · mats",ba_c6:"Roof edge · algae",gal_sub2:"A selection of recent jobs – click to view full size.",g_bmw:"Steam wash · BMW",g_hood:"Hood · steam",see_all_ba:"See all before & after",see_all_gallery:"See full gallery",st1:"Cars washed",st2:"Service time",st3:"No prepayment",st4:"We come to you",how_eyebrow:"How it works",how_title:"3 easy steps",how1t:"Choose and book",how1p:"Pick car type and package, and book a time in minutes.",how2t:"We come to you",how2p:"We arrive with all equipment directly to your address.",how3t:"Your car shines",how3p:"Enjoy a clean, fresh car. You didn't even have to move.",ba_eyebrow:"Our work",ba_title:"Before & after",ba_sub:"Drag the slider to see the difference. Real results from our customers.",ba_cap:"Engine clean · Peugeot – steam cleaned",vid_badge:"Watch us in action",vid_title:"Professional steam wash",vid_sub:"See how we transform your car – from dirty to spotlessly clean",gal_eyebrow:"Gallery",gal_title:"More photos from our work",g_seat_for:"Seat clean · before",g_seat_efter:"Seat clean · after",g_floor_for:"Footwell · before",g_floor_efter:"Footwell · after",g_fuel_for:"Fuel cap · before",g_fuel_efter:"Fuel cap · after",g_roof:"Roof edge · algae removal",g_pedal:"Pedal area · clean",g_onsite:"Mobile steam wash · on location",ex_eyebrow:"Add-ons",ex_title:"Extra services",ex_sub:"Can be added to any package. Included in the Gold package.",ex1t:"Engine clean",ex1p:"Thorough engine bay cleaning",ex2t:"Paint & gloss protection",ex2p:"Exterior – long-lasting extra gloss",ex3t:"Interior care & protection",ex3p:"Protects and renews the interior",ex4t:"Pet hair removal",ex4p:"Effective removal of hair and lint",ex5t:"Seat clean (fabric)",ex5p:"Deep clean of fabric seats",ex6t:"Child seat cleaning",ex6p:"Thorough and safe cleaning",why_eyebrow:"Why choose us",why_title:"What we promise – every single time",why1t:"Transparent prices",why1p:"You know the price before we drive out. No surprises.",why2t:"Eco-friendly steam wash",why2p:"Gentle method with minimal water use.",why3t:"We come to you",why3p:"At home, the office or the summer house.",why4t:"Satisfaction guarantee",why4p:"Not happy? Then we'll find a solution.",steam_eyebrow:"What is steam cleaning?",steam_title:"How it works in practice",steam_sub:"Steam at high temperature loosens dirt from the surface without brushes or harsh chemicals – gentle on paintwork, effective against grime.",steam_f1t:"No scratches – no brushes",steam_f1p:"Steam loosens dirt at high temperature without mechanical contact. That means the paintwork stays intact – no rotating brushes or high-pressure jets that can leave marks.",steam_f2t:"Your paint breathes again",steam_f2p:"Once surface deposits and ingrained dirt are removed, the car's original colour comes through more clearly. You don't need wax to see the difference – cleanliness is enough.",steam_f3t:"Uses almost no water",steam_f3p:"A typical wash uses 3–5 litres of water compared to 150–200 litres in a traditional car wash. Better for your drains, better for the environment.",info_eyebrow:"About Elite Vask",info_title:"Meet the team",info_sub:"We'll soon tell you more about us and the equipment we use.",info1t:"Why choose Elite Vask?",info1p:"Premium mobile car wash — we set the standard. Click to read more.",info_soon:"Added soon",why_i1t:"We come directly to you",why_i1p:"No waiting at a car wash. We show up at your address across all of Zealand — on time, ready to deliver.",why_i2t:"Craftsmanship & precision",why_i2p:"Every car is treated individually with full attention and professional technique. We never compromise on quality.",why_i3t:"Sustainable steam cleaning",why_i3p:"Our steam technology uses up to 90% less water than conventional car washes — gentle on the environment, tough on dirt.",why_i4t:"Protects your paintwork — always",why_i4p:"We use only professional, pH-neutral products that protect and preserve your car's surface.",why_i5t:"Deep gloss & perfection",why_i5p:"Steam penetrates the surface, removes ingrained dirt and enhances your car's natural shine — from wheels to roof.",why_i6t:"Pay only when satisfied",why_i6p:"No prepayment. We invoice only after completed work and your full satisfaction.",why_i7t:"World-class service",why_i7p:"We strive to exceed your expectations at every visit — from first contact to the final handshake.",info2t:"Our equipment",info2p:"We use the Optima Steamer XD2 – a professional steam cleaner with continuous steam, high temperature and minimal water use. Perfect for gentle yet powerful car cleaning.",info3t:"Coverage area",info3p:"We cover large parts of Zealand, including Greater Copenhagen.",rev_eyebrow:"Customer reviews",rev_title:"What our customers say",rev_empty_t:"Reviews appear here soon",rev_empty_p:"We are connecting our Google Business profile. Once ready, real customer reviews appear here automatically.",rev_empty_cta:"Book your wash",faq_eyebrow:"Questions & answers",faq_title:"Frequently asked questions",local_eyebrow:"Service area",local_title:"Mobile car wash across Zealand",ct_title:"Ready for a spotless car?",ct_lead:"Contact us today and book your mobile steam wash. We come to you – easy, fast and local.",ct_book:"Book online now",ct_call:"Call us",ct_phone:"Phone",ct_email:"Email",ct_addr:"Address",ct_hours:"Opening hours",ct_hours_v:"Mon–Fri · 08–20 · Sat–Sun · 10–20 · or by arrangement",ct_h_wday:"Mon – Fri",ct_h_wend:"Sat – Sun",ct_h_note:"or by arrangement",foot_p:"Mobile car steam wash on Zealand. We drive to you and wash your car – clean, effective and eco-friendly.",foot_s1:"Service",foot_l1:"Choose car & prices",foot_l2:"Our work",foot_l3:"Reviews",foot_s2:"Contact",m_call:"Call now",m_book:"Book now",wiz_title:"Book your car wash",chat_status:"Online now",chat_intro_label:"Elite Bot is ready!",faqMore:"See all questions",faqLess:"Show fewer"}
};
var WIZ={
  da:{step:"Trin",of:"af",s1:"Vælg din bil",s2:"Vælg pakke",s3:"Tilvalg (valgfrit)",s4:"Din adresse",s5:"Vælg dato & tid",s6:"Kontaktinfo",addr:"Adresse",zip:"Postnr.",city:"By",date:"Dato",time:"Tidspunkt",name:"Navn",phone:"Telefon",email:"E-mail",msg:"Besked (valgfri)",next:"Næste",back:"Tilbage",send:"Send anmodning",sumcar:"Bil",sumpkg:"Pakke",sumext:"Tilvalg",sumprice:"Anslået pris",done_t:"Tak for din anmodning!",done_p:"Vi kontakter dig hurtigst muligt for at bekræfte tid og pris.",close:"Luk",pick:"Vælg",skip:"Spring over",plate_label:"Slå nummerplade op",plate_or:"– eller vælg manuelt –",plate_search:"Slå op",plate_searching:"Søger...",plate_found:"Se priser for denne bil"},
  en:{step:"Step",of:"of",s1:"Choose your car",s2:"Choose package",s3:"Add-ons (optional)",s4:"Your address",s5:"Choose date & time",s6:"Contact info",addr:"Address",zip:"Zip",city:"City",date:"Date",time:"Time",name:"Name",phone:"Phone",email:"Email",msg:"Message (optional)",next:"Next",back:"Back",send:"Send request",sumcar:"Car",sumpkg:"Package",sumext:"Add-ons",sumprice:"Estimated price",done_t:"Thank you for your request!",done_p:"We'll contact you as soon as possible to confirm time and price.",close:"Close",pick:"Choose",skip:"Skip",plate_label:"Look up plate number",plate_or:"– or select manually –",plate_search:"Search",plate_searching:"Searching...",plate_found:"See prices for this car"}
};

/* ====== STATE ====== */
var LANG=localStorage.getItem('lang')||"da", selCar=null;
function t(k){return (I18N[LANG][k]!==undefined)?I18N[LANG][k]:k;}
function svgWrap(inner,w,h,col){return '<svg viewBox="0 0 120 64" width="'+w+'" height="'+h+'" fill="none" stroke="'+(col||"currentColor")+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><g transform="translate(120,0) scale(-1,1)">'+inner+'</g></svg>';}
function fmtKr(n){return Math.round(n).toLocaleString('da-DK')+' kr';}

/* ====== KØRSEL ====== */
function driveFee(){return 0;}

/* ====== RENDER CARS ====== */
function markActiveCar(id){var g=document.getElementById('carGrid');if(!g)return;g.querySelectorAll('.car').forEach(function(d){d.classList.toggle('on',d.dataset.id===id);});}
function activateCar(c){selCar=c;markActiveCar(c.id);renderCalc();var cal=document.getElementById('calc');cal.classList.add('show');}
function renderCars(){
  var g=document.getElementById('carGrid');g.innerHTML='';
  CARS.forEach(function(c){
    var d=document.createElement('div');d.className='car';d.dataset.id=c.id;
    if(selCar&&selCar.id===c.id)d.classList.add('on');
    var minPrice=Math.min(c.prices.udv,c.prices.indv,c.prices.hele);
    d.innerHTML='<span class="car-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span><div class="car-stage"><svg class="cs" viewBox="0 0 120 64" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"><g transform="translate(120,0) scale(-1,1)">'+c.svg+'</g></svg></div><div class="nm">'+c.label[LANG]+'</div><div class="ex">'+c.ex[LANG]+'</div><div class="car-price"><span class="car-price-from">'+(LANG==='da'?'Fra':'From')+'</span> '+fmtKr(minPrice)+'</div>';
    d.addEventListener('mouseenter',function(){activateCar(c);});
    d.addEventListener('click',function(){activateCar(c);setTimeout(function(){document.getElementById('calc').scrollIntoView({behavior:'smooth',block:'nearest'});},60);});
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
  var fee=0;
  var p=document.getElementById('pkgs');p.innerHTML='';
  PKGS.forEach(function(pk){
    var price=selCar.prices[pk.id];
    var total=price+fee;
    var cls='pkg'+(pk.pop?' pop':'')+(pk.gold?' gold':'');
    var tag=pk.pop?'<div class="tag">'+(LANG==="da"?"Mest populær":"Most popular")+'</div>':(pk.gold?'<div class="tag">★ '+(LANG==="da"?"Premium":"Premium")+'</div>':'');
    var feats=pk.feat[LANG].map(function(f){return '<li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>'+f+'</li>';}).join('');
    var driveLine=fee>0?'<div class="drive"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2v-4c0-1-.7-1.8-1.5-2L16 10l-2.2-2.3c-.4-.4-1-.7-1.7-.7H5c-.6 0-1.1.4-1.4 1L2 11v6h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>+ '+(LANG==="da"?"kørsel":"travel")+' '+fmtKr(fee)+'</div>':'';
    var totLine=fee>0?'<div class="total">'+(LANG==="da"?"I alt:":"Total:")+' '+fmtKr(total)+'</div>':'';
    var el=document.createElement('div');el.className=cls;
    var saveBadge='';
    var btnTxt=pk.pop?(LANG==="da"?"Bestil mest populære":"Order most popular"):(LANG==="da"?"Bestil denne pakke":"Order this package");
    var goldScene=pk.gold?'<div class="gold-emblem" aria-hidden="true"><span class="ge-halo"></span><svg class="ge-crown" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l4.5 3.2L12 5l4.5 6.7L21 8.5l-1.6 9.5H4.6L3 8.5z"/><circle cx="3" cy="8.5" r="1"/><circle cx="21" cy="8.5" r="1"/><circle cx="12" cy="4.2" r="1"/></svg><span class="ge-shine"></span><span class="ge-spark s1">✦</span><span class="ge-spark s2">✦</span></div>':'';
    el.innerHTML=goldScene+'<div class="pkg-badge-row">'+tag+'</div><div class="pn">'+pk.name[LANG]+'</div><div class="pd">'+pk.desc[LANG]+'</div>'+saveBadge+'<div class="price">'+fmtKr(price)+'</div><div class="ps">'+(LANG==="da"?"inkl. moms":"incl. VAT")+'</div>'+driveLine+totLine+'<ul>'+feats+'</ul><button class="btn pbtn">'+btnTxt+'</button>';
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
  var INIT=4;
  var g=document.getElementById('faqList');g.innerHTML='';
  var old=document.getElementById('faqMoreBtn');if(old)old.remove();
  var items=[];
  FAQ.forEach(function(f,i){
    var el=document.createElement('div');el.className='qa';
    if(i>=INIT){el.setAttribute('data-faq-extra','1');el.style.display='none';}
    el.innerHTML='<button type="button" aria-expanded="false">'+((f.q&&f.q[LANG])||(typeof f.q==='string'?f.q:'')||'')+'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button><div class="ans"><p>'+((f.a&&f.a[LANG])||(typeof f.a==='string'?f.a:'')||'')+'</p></div>';
    el.querySelector('button').addEventListener('click',function(){var open=el.classList.toggle('open');this.setAttribute('aria-expanded',open?'true':'false');});
    g.appendChild(el);
    items.push(el);
  });
  if(FAQ.length>INIT){
    var wrap=document.createElement('div');wrap.id='faqMoreBtn';wrap.style.cssText='text-align:center;padding:20px 0 4px;';
    var btn=document.createElement('button');
    btn.type='button';
    btn.className='faq-more-btn';
    var expanded=false;
    function setLabel(){
      btn.innerHTML=expanded
        ?((I18N[LANG].faqLess||'Vis færre')+' <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="18 15 12 9 6 15"/></svg>')
        :((I18N[LANG].faqMore||'Se alle spørgsmål')+' <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="6 9 12 15 18 9"/></svg>');
    }
    setLabel();
    btn.addEventListener('click',function(){
      expanded=!expanded;
      document.querySelectorAll('[data-faq-extra]').forEach(function(el){el.style.display=expanded?'':'none';});
      setLabel();
      if(expanded){
        /* Move button to after the last item */
        items[items.length-1].after(wrap);
      } else {
        /* Move button back to after item 4 and scroll to it */
        items[INIT-1].after(wrap);
        wrap.scrollIntoView({behavior:'smooth',block:'nearest'});
      }
    });
    wrap.appendChild(btn);
    /* Insert button right after the 4th item so it's always at the fold */
    if(items[INIT-1]){items[INIT-1].after(wrap);}else{g.appendChild(wrap);}
  }
}
/* ====== I18N APPLY ====== */
function applyLang(){
  document.documentElement.lang=LANG;
  document.querySelectorAll('[data-i18n]').forEach(function(e){var k=e.getAttribute('data-i18n');if(I18N[LANG][k]!==undefined)e.textContent=I18N[LANG][k];});
  document.querySelectorAll('[data-lang]').forEach(function(x){var active=x.getAttribute('data-lang')===LANG;x.classList.toggle('on',active);x.setAttribute('aria-pressed',active?'true':'false');});
  renderCars();renderFaq();if(selCar)renderCalc();
}
document.querySelectorAll('.lang button').forEach(function(b){
  if(b.dataset.lang===LANG)b.classList.add('on');
  b.addEventListener('click',function(){LANG=b.dataset.lang;localStorage.setItem('lang',LANG);document.querySelectorAll('.lang button').forEach(function(x){x.classList.remove('on');});b.classList.add('on');applyLang();});
});

/* ====== PKG TABS (mobile) ====== */
document.addEventListener('click',function(e){
  var tab=e.target.closest('.pkg-tab');if(!tab)return;
  var idx=parseInt(tab.dataset.pkgIdx,10);
  document.querySelectorAll('.pkg-tab').forEach(function(t){t.classList.remove('on');});
  tab.classList.add('on');
  if(window.innerWidth<=880){document.querySelectorAll('#pkgs .pkg').forEach(function(p,j){p.style.display=j===idx?'':'none';});}
},{signal:__sig});

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

/* ====== BEFORE/AFTER SLIDERS (multiple) ====== */
(function(){
  var dragging=null;
  document.querySelectorAll('.ba-slider').forEach(function(sl){
    var af=sl.querySelector('.ba-after'),hd=sl.querySelector('.ba-handle');
    if(!af||!hd)return;
    function setPos(x){
      var r=sl.getBoundingClientRect();var p=(x-r.left)/r.width;p=Math.max(0,Math.min(1,p));
      af.style.clipPath='inset(0 0 0 '+(p*100)+'%)';hd.style.left=(p*100)+'%';
    }
    sl.__setPos=setPos;
    sl.addEventListener('mousedown',function(e){dragging=sl;setPos(e.clientX);e.preventDefault();});
    sl.addEventListener('touchstart',function(e){dragging=sl;setPos(e.touches[0].clientX);},{passive:true});
    sl.addEventListener('touchmove',function(e){if(dragging===sl)setPos(e.touches[0].clientX);},{passive:true});
  });
  window.addEventListener('mousemove',function(e){if(dragging&&dragging.__setPos)dragging.__setPos(e.clientX);},{signal:__sig});
  window.addEventListener('mouseup',function(){dragging=null;},{signal:__sig});
  window.addEventListener('touchend',function(){dragging=null;},{signal:__sig});
})();

/* ====== BOOKING WIZARD ====== */
var modal=document.getElementById('modal'),wizBody=document.getElementById('wizBody'),wizProg=document.getElementById('wizProg');
var wiz={car:null,pkg:null,extras:[],addr:"",zip:"",city:"",date:"",time:"",name:"",phone:"",email:"",msg:""};
var step=1, TOTAL=7;
function W(k){return WIZ[LANG][k]||k;}
function openWiz(car,pkg){
  wiz.car=car||null;wiz.pkg=pkg||null;wiz.zip="";wiz.extras=[];
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
    CARS.forEach(function(c){var minP=Math.min(c.prices.udv,c.prices.indv,c.prices.hele);h+='<div class="opt'+(wiz.car&&wiz.car.id===c.id?' sel':'')+'" data-car="'+c.id+'"><div class="opt-icon-wrap">'+svgWrap(c.svg,46,26)+'</div><span class="opt-lbl">'+c.label[LANG]+'</span><span class="opt-ex">'+c.ex[LANG]+'</span><span class="opt-fra">'+(LANG==='da'?'Fra ':'From ')+fmtKr(minP)+'</span><span class="opt-time">'+c.time[LANG]+'</span></div>';});
    h+='</div>';
  }else if(step===2){
    h+='<div class="wiz-q">'+W('s2')+'</div><div class="opt-row">';
    PKGS.forEach(function(p){
      var price=wiz.car?wiz.car.prices[p.id]:0;
      var badge=p.pop?'<span class="pkg-badge pop">'+(LANG==='da'?'Mest populær':'Most popular')+'</span>':(p.gold?'<span class="pkg-badge gold">★ Premium</span>':'');
      var feats=p.feat[LANG].slice(0,3).map(function(f){return '<li>'+f+'</li>';}).join('');
      h+='<div class="opt opt-pkg'+(wiz.pkg&&wiz.pkg.id===p.id?' sel':'')+(p.gold?' opt-gold':'')+(p.pop?' opt-pop':'')+'" data-pkg="'+p.id+'">';
      h+='<div class="opt-pkg-top">'+badge+'<span class="opt-lbl">'+p.name[LANG]+'</span><span class="opt-pkg-price">'+fmtKr(price)+'</span></div>';
      h+='<ul class="opt-pkg-feats">'+feats+'</ul>';
      h+='</div>';
    });
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
      h+='<div class="slot-hint" style="grid-column:1/-1">'+(LANG==='da'?'Henter ledige tider…':'Loading available times…')+'</div>';
    }
    h+='</div></div>';
  }else if(step===6){
    h+='<div class="wiz-q">'+W('s6')+'</div>';
    h+='<div class="field"><label>'+W('name')+'</label><input id="f_name" value="'+wiz.name+'" placeholder="Dit navn"></div>';
    h+='<div class="field"><label>'+W('phone')+'</label><input id="f_phone" inputmode="tel" value="'+wiz.phone+'" placeholder="+45 12 34 56 78"></div>';
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
    h+='<div class="sr"><span class="k">'+W('date')+'</span><span class="v">'+fmtDate(wiz.date,LANG)+(wiz.time?' · '+wiz.time:'')+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('name')+'</span><span class="v">'+(wiz.name||"-")+'</span></div>';
    h+='<div class="sr"><span class="k">'+W('phone')+'</span><span class="v">'+(wiz.phone||"-")+'</span></div>';
    if(wiz.email)h+='<div class="sr"><span class="k">'+W('email')+'</span><span class="v">'+wiz.email+'</span></div>';
    if(fee>0)h+='<div class="sr"><span class="k">'+(LANG==="da"?"Kørsel":"Travel")+'</span><span class="v">'+fmtKr(fee)+'</span></div>';
    if(extPrice>0)h+='<div class="sr"><span class="k">'+W('sumext')+'</span><span class="v">'+fmtKr(extPrice)+'</span></div>';
    h+='<div class="sr tot"><span class="k">'+W('sumprice')+'</span><span class="v">'+fmtKr(tot)+'</span></div>';
    h+='</div>';
    h+='<p class="wiz-trust"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="13" height="13"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>'+(LANG==='da'?'Ingen forudbetaling · Betal efter vask · Tilfredshedsgaranti':'No prepayment · Pay after wash · Satisfaction guarantee')+'</p>';
  }else if(step===8){
    var doneCarPkg=(wiz.car?wiz.car.label[LANG]:'')+' · '+(wiz.pkg?wiz.pkg.name[LANG]:'');
    h='<div class="wiz-done"><div class="chk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg></div><h3>'+W('done_t')+'</h3><p>'+W('done_p')+'</p><div class="spam-notice"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>'+(LANG==='da'?'Bekræftelsesmail afsendt – tjek din <strong>spam- eller junk-mappe</strong>, hvis du ikke ser den inden for få minutter.':'Confirmation email sent – check your <strong>spam or junk folder</strong> if you don\'t see it within a few minutes.')+'</span></div>';
    h+='<div class="done-summary">';
    h+='<div class="done-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><span>'+fmtDate(wiz.date,LANG)+(wiz.time?' · '+wiz.time:'')+'</span></div>';
    h+='<div class="done-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M19 17h2v-4c0-1-.7-1.8-1.5-2L16 10l-2.2-2.3c-.4-.4-1-.7-1.7-.7H5c-.6 0-1.1.4-1.4 1L2 11v6h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg><span>'+doneCarPkg+'</span></div>';
    h+='<div class="done-row"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="15" height="15"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg><span>'+wiz.addr+', '+wiz.zip+' '+wiz.city+'</span></div>';
    h+='</div>';
    h+='<div class="review-prompt"><p>'+(LANG==='da'?'⭐ Tilfreds med Elite Vask? Del din oplevelse – det hjælper os enormt!':'⭐ Happy with Elite Vask? Share your experience – it helps us a lot!')+'</p><a href="https://www.google.com/maps?cid=14890071893602568107&action=write_review" target="_blank" rel="noopener"><svg width="16" height="16" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>'+(LANG==='da'?'Skriv en Google-anmeldelse':'Write a Google review')+'</a></div>';
    h+='<div class="wiz-nav"><a class="btn wiz-back" href="tel:+4524440321">'+(LANG==="da"?"Ring i stedet":"Call instead")+'</a><button class="btn btn-green" id="wizFinish">'+W('close')+'</button></div></div>';
    wizBody.innerHTML=h;wizProg.querySelectorAll('span').forEach(function(s){s.classList.add('done');});
    document.getElementById('wizFinish').addEventListener('click',closeWiz);
    return;
  }
  h+='<div class="wiz-nav">';
  if(step>1)h+='<button class="btn wiz-back" id="wizBack">'+W('back')+'</button>';
  h+='<button class="btn btn-green" id="wizNext">'+(step===TOTAL?W('send'):W('next'))+'</button>';
  h+='</div>';
  wizBody.innerHTML=h;
  wizBody.classList.remove('wiz-anim');
  requestAnimationFrame(function(){wizBody.classList.add('wiz-anim');});
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
  // zip/city/address autocomplete (step 4)
  if(step===4){bindAddressAutocomplete();}
  var bk=document.getElementById('wizBack');if(bk)bk.addEventListener('click',function(){saveStep();step--;drawWiz();});
  document.getElementById('wizNext').addEventListener('click',function(){
    saveStep();
    // Validate required fields per step
    if(step===1&&!wiz.car){showWizErr(LANG==='da'?'Vælg venligst din biltype.':'Please select your car type.');return;}
    if(step===2&&!wiz.pkg){showWizErr(LANG==='da'?'Vælg venligst en pakke.':'Please select a package.');return;}
    if(step===4&&!wiz.addr.trim()){showWizErr(LANG==='da'?'Indtast venligst din adresse.':'Please enter your address.');return;}
    if(step===4&&!wiz.zip.trim()){showWizErr(LANG==='da'?'Indtast venligst dit postnummer.':'Please enter your postcode.');return;}
    if(step===4&&!isServiceZip(wiz.zip)){showWizErr(LANG==='da'?'Vi dækker desværre ikke dette postnummer. Vi betjener hele Sjælland (1000–4799). Kontakt os gerne på +45 24 44 03 21, så finder vi en løsning.':'We do not currently cover this postcode. We serve all of Zealand (1000–4799). Please contact us on +45 24 44 03 21 and we will do our best to help.');return;}
    if(step===5){
      if(!wiz.date){showWizErr(LANG==='da'?'Vælg venligst en dato.':'Please select a date.');return;}
      if(!wiz.time){showWizErr(LANG==='da'?'Vælg venligst et tidspunkt.':'Please select a time slot.');return;}
    }
    if(step===6&&!wiz.name.trim()){showWizErr(LANG==='da'?'Indtast venligst dit navn.':'Please enter your name.');return;}
    if(step===6&&!isValidPhone(wiz.phone)){showWizErr(LANG==='da'?'Indtast venligst et dansk telefonnummer med landekode (+45 XX XX XX XX).':'Please enter a valid Danish phone number with country code (+45 XX XX XX XX).');return;}
    if(step===6&&wiz.email.trim()&&!isValidEmail(wiz.email)){showWizErr(LANG==='da'?'Indtast venligst en gyldig e-mailadresse.':'Please enter a valid email address.');return;}
    if(step===6&&!wiz.email.trim()){showWizErr(LANG==='da'?'Indtast venligst din e-mailadresse.':'Please enter your email address.');return;}
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
function bindAddressAutocomplete(){
  var fz=document.getElementById('f_zip');
  var fc=document.getElementById('f_city');
  var fa=document.getElementById('f_addr');
  if(!fz||!fc) return;

  // zip → city
  fz.addEventListener('input',function(){
    var z=fz.value.replace(/\D/g,'');fz.value=z;
    if(z.length===4){
      fetch('https://api.dataforsyningen.dk/postnumre/'+z)
        .then(function(r){return r.ok?r.json():null;})
        .then(function(d){if(d&&d.navn){fc.value=d.navn;wiz.city=d.navn;}})
        .catch(function(){});
    }
    if(fa) removeDropdown('addr-drop');
  });

  // city → zip suggestions
  var cityTimer=null;
  fc.addEventListener('input',function(){
    clearTimeout(cityTimer);
    var q=fc.value.trim();
    if(q.length<2){removeDropdown('city-drop');return;}
    cityTimer=setTimeout(function(){
      fetch('https://api.dataforsyningen.dk/postnumre?q='+encodeURIComponent(q)+'&per_side=8')
        .then(function(r){return r.ok?r.json():[];})
        .then(function(list){
          if(list&&list.length===1){fz.value=list[0].nr;wiz.zip=list[0].nr;}
          showCitySuggestions(list,fz,fc);
        })
        .catch(function(){});
    },300);
  });

  // address autocomplete — use adgangsadresser which works with partial street names
  if(fa){
    var addrTimer=null;
    fa.addEventListener('input',function(){
      clearTimeout(addrTimer);
      var q=fa.value.trim();
      removeDropdown('addr-drop');
      if(q.length<2) return;
      addrTimer=setTimeout(function(){
        var url='https://api.dataforsyningen.dk/adgangsadresser/autocomplete?q='+encodeURIComponent(q)+'&per_side=8&fuzzy=';
        if(fz.value.length===4) url+='&postnr='+fz.value;
        fetch(url)
          .then(function(r){return r.ok?r.json():[];})
          .then(function(list){showAddrSuggestions(list,fa,fz,fc);})
          .catch(function(){});
      },250);
    });
    fa.addEventListener('blur',function(){setTimeout(function(){removeDropdown('addr-drop');},200);});
  }
  fc.addEventListener('blur',function(){setTimeout(function(){removeDropdown('city-drop');},200);});
}

function removeDropdown(id){var d=document.getElementById(id);if(d)d.remove();}

function showCitySuggestions(list,fz,fc){
  removeDropdown('city-drop');
  if(!list||list.length<=1) return;
  var drop=document.createElement('ul');
  drop.id='city-drop';drop.className='ac-drop';
  list.slice(0,8).forEach(function(item){
    var li=document.createElement('li');
    li.textContent=item.navn+' ('+item.nr+')';
    li.addEventListener('mousedown',function(e){
      e.preventDefault();
      fc.value=item.navn;fz.value=item.nr;
      wiz.city=item.navn;wiz.zip=item.nr;
      removeDropdown('city-drop');
    });
    drop.appendChild(li);
  });
  fc.parentNode.style.position='relative';
  fc.parentNode.appendChild(drop);
}

function showAddrSuggestions(list,fa,fz,fc){
  removeDropdown('addr-drop');
  if(!list||!list.length) return;
  var drop=document.createElement('ul');
  drop.id='addr-drop';drop.className='ac-drop';
  list.slice(0,8).forEach(function(item){
    var li=document.createElement('li');
    // adgangsadresser returns item.tekst and item.adgangsadresse
    var a=item.adgangsadresse||item.adresse||{};
    li.textContent=item.tekst||'';
    li.addEventListener('mousedown',function(e){
      e.preventDefault();
      var street=((a.vejnavn||'')+' '+(a.husnr||'')).trim();
      fa.value=street;
      wiz.addr=street;
      // always update zip + city from selected suggestion
      if(a.postnr){fz.value=a.postnr;wiz.zip=a.postnr;}
      if(a.postnrnavn){fc.value=a.postnrnavn;wiz.city=a.postnrnavn;}
      removeDropdown('addr-drop');
    });
    drop.appendChild(li);
  });
  fa.parentNode.style.position='relative';
  fa.parentNode.appendChild(drop);
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
function fmtDate(d,lang){
  if(!d)return '-';
  var p=d.split('-');if(p.length<3)return d;
  var dt=new Date(parseInt(p[0]),parseInt(p[1])-1,parseInt(p[2]));
  if(lang==='en'){var dn=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],mn=['January','February','March','April','May','June','July','August','September','October','November','December'];return dn[dt.getDay()]+' '+dt.getDate()+'. '+mn[dt.getMonth()]+' '+p[0];}
  var dn=['Søndag','Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag'],mn=['januar','februar','marts','april','maj','juni','juli','august','september','oktober','november','december'];
  return dn[dt.getDay()]+' '+dt.getDate()+'. '+mn[dt.getMonth()]+' '+p[0];
}
function isServiceZip(z){var n=parseInt(z);if(isNaN(n)||String(z).replace(/\D/g,'').length<4)return false;if(n>=3700&&n<=3790)return false;return n>=1000&&n<=4799;}
function isValidPhone(p){var d=p.replace(/\D/g,'');return(d.startsWith('45')&&d.length>=10)||(!d.startsWith('45')&&false);}
function isValidEmail(e){return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);}
function showWizErr(msg){
  var el=document.getElementById('wiz-err');
  if(!el){
    el=document.createElement('p');el.id='wiz-err';
    el.style.cssText='color:#e74c3c;font-size:13px;margin-bottom:10px;text-align:center;font-weight:600;padding:10px 14px;background:rgba(231,76,60,.1);border:1px solid rgba(231,76,60,.25);border-radius:8px;transition:opacity .3s';
    var nav=document.querySelector('#wizBody .wiz-nav');
    if(nav)nav.parentNode.insertBefore(el,nav);
    else document.getElementById('wizBody').appendChild(el);
  }
  el.style.opacity='1';el.textContent=msg;
  setTimeout(function(){el.style.opacity='0';setTimeout(function(){el.textContent='';el.style.opacity='1';},300);},3500);
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
    window.__lbItems=items;window.__lbOpen=open;
  }
  function close(){lb.classList.remove('open');document.body.style.overflow='';img.src='';}
  function prev(){cur=(cur-1+items.length)%items.length;img.src=items[cur];}
  function next(){cur=(cur+1)%items.length;img.src=items[cur];}
  document.querySelectorAll('.gitem').forEach(function(g,i){
    items.push(g.dataset.full||g.querySelector('img')?.src||'');
    g.addEventListener('click',function(){open(i);});
  });
  window.__lbItems=items;window.__lbOpen=open;
  document.getElementById('lbClose').addEventListener('click',close);
  document.getElementById('lbPrev').addEventListener('click',function(e){e.stopPropagation();prev();});
  document.getElementById('lbNext').addEventListener('click',function(e){e.stopPropagation();next();});
  lb.addEventListener('click',function(e){if(e.target===lb)close();});
  document.addEventListener('keydown',function(e){
    if(!lb.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowLeft')prev();
    if(e.key==='ArrowRight')next();
  },{signal:__sig});
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
      {keys:['hej','hey','hi ','hallo','goddag','god morgen','god aften','godaften','godmorgen','halløj','hejsa','yo ','hola'],
       ans:['Hej! 👋 Jeg er <strong>Elite Bot</strong> fra Elite Vask – her for at hjælpe dig med alt om mobil bilvask på Sjælland. Hvad kan jeg gøre for dig i dag? 😊',
            'Hejsa! Velkommen til Elite Vask 🌿 Jeg er <strong>Elite Bot</strong> – din personlige guide til mobil dampvask. Hvad ønsker du at vide?',
            'Hej og velkommen! 🤖 Jeg er <strong>Elite Bot</strong> fra Elite Vask. Jeg kan svare på spørgsmål om priser, booking, dækningsområde og meget mere. Hvad kan jeg hjælpe med?'],
       follow:['Hvad koster det?','Dækker I mit område?','Book nu','Hvad er dampvask?']},
      {keys:['hvem er du','hvad er du','hvad kan du','elite bot','chatbot','robot','assistent','hvad hedder','fortæl om dig'],
       ans:['Jeg er <strong>Elite Bot</strong> 🤖 – den digitale assistent for <strong>Elite Vask</strong>. Vi er en mobil dampvaskservice der kører ud til dig på hele Sjælland. Jeg kan hjælpe dig med priser, booking, svare på spørgsmål og meget mere!',
            'Hej! Jeg er <strong>Elite Bot</strong>, lavet til at hjælpe kunder af <strong>Elite Vask</strong> – Sjællands mobile dampvaskservice 🌿 Spørg mig om pakker, priser, kørsel, og hvad dampvask egentlig er!'],
       follow:['Hvad koster det?','Hvad er dampvask?','Book nu']},
      {keys:['tak','mange tak','tusind tak','super','perfekt','fedt','fantastisk','dejligt','godt','flot'],
       ans:['Det var da så lidt! 😊 Kan jeg hjælpe dig med noget mere?',
            'Altid gerne! 🌟 Har du andre spørgsmål?',
            'Tak for det! 💚 Lad mig endelig vide, hvis der er andet jeg kan hjælpe med.'],
       follow:['Book nu','Hvad koster det?']},
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
       ans:['Du kan ringe til os på <a href="tel:+4524440321"><strong>+45 24 44 03 21</strong></a> eller skrive til <a href="mailto:info@elite-vask.dk">info@elite-vask.dk</a> 📩'],
       follow:['Book nu','Åbningstider']},
      {keys:['åbningstid','åbent','hvornår','åbnings','weekend','hverdage'],
       ans:['Vi holder åbent <strong>mandag–fredag kl. 08–20</strong> og <strong>lørdag–søndag kl. 10–20</strong> – eller efter aftale. Online booking er tilgængelig hele døgnet 🕗'],
       follow:['Book nu','Kontakt']},
      {keys:['garanti','tilfreds','klage','refund','utilfreds'],
       ans:['Vi tilbyder <strong>tilfredshedsgaranti</strong> – er du ikke tilfreds, finder vi en løsning 💚 Din tilfredshed er vores prioritet.'],
       follow:['Book nu','Kontakt']},
      {keys:['sæde','stof','indvendig','interiør','lugt'],
       ans:['Vi tilbyder <strong>indvendig rens</strong> med damp – sæder, gulvtæpper, instrumentpanel og alle overflader. Til stof-sæder tilbyder vi også dybderens. <a href="#vaelg">Se pakker →</a>'],
       follow:['Hvad koster det?','Book nu']},
      {keys:['betal','betaling','forudbetaling','hvornår betaler','faktura','mobilepay','kontant','penge'],
       ans:['Du betaler <strong>først efter</strong> vasken er færdig – og kun når du er <strong>100% tilfreds</strong> 💳 Ingen forudbetaling. Vi modtager MobilePay, bankoverførsel og kontant.'],
       follow:['Tilfredshedsgaranti?','Book nu']},
      {keys:['gebyr','kørselsgebyr','tillæg','ekstra kørsel','by','byområde','langt','gratis kørsel'],
       ans:['<strong>Kørsel er helt gratis</strong> på hele Sjælland – også inde i byområderne 🚗💨 Ingen kørselsgebyrer eller skjulte tillæg, uanset din adresse.'],
       follow:['Dækker I mit område?','Book nu']},
      {keys:['aflys','afbestil','ændre','flytte tid','aflysning','ombook'],
       ans:['Du kan <strong>frit ændre eller aflyse</strong> din tid – giv os blot besked i god tid, så finder vi en ny tid der passer dig 🗓️ <a href="tel:+4524440321">Ring +45 24 44 03 21</a>'],
       follow:['Åbningstider','Book nu']},
      {keys:['regn','vejr','sne','blæser','udendørs','koldt'],
       ans:['Vi arbejder i <strong>næsten alt vejr</strong> 🌦️ Vores damp fungerer fint i køligt vejr. Ved kraftig regn finder vi sammen en overdækket plads eller en ny tid.'],
       follow:['Book nu','Dækker I mit område?']},
    ],
    en:[
      {keys:['hi ','hey','hello','hiya','howdy','good morning','good evening','sup ','yo ','hola'],
       ans:['Hi there! 👋 I\'m <strong>Elite Bot</strong> from Elite Vask – here to help you with everything about mobile car washing on Zealand. What can I do for you today? 😊',
            'Hello and welcome! 🌿 I\'m <strong>Elite Bot</strong> – your personal guide to mobile steam car wash. What would you like to know?',
            'Hey! 🤖 I\'m <strong>Elite Bot</strong> from Elite Vask. I can answer questions about prices, booking, coverage area and much more. How can I help?'],
       follow:['What does it cost?','Do you cover my area?','Book now','What is steam wash?']},
      {keys:['who are you','what are you','what can you do','elite bot','chatbot','robot','assistant','your name','about you'],
       ans:['I\'m <strong>Elite Bot</strong> 🤖 – the digital assistant for <strong>Elite Vask</strong>. We\'re a mobile steam car wash service that drives to you anywhere on Zealand. I can help with prices, booking, questions and more!',
            'Hi! I\'m <strong>Elite Bot</strong>, built to help customers of <strong>Elite Vask</strong> – Zealand\'s mobile steam car wash 🌿 Ask me about packages, prices, travel and what steam cleaning actually is!'],
       follow:['What does it cost?','What is steam wash?','Book now']},
      {keys:['thank','thanks','thank you','great','perfect','awesome','wonderful','lovely'],
       ans:['My pleasure! 😊 Can I help you with anything else?',
            'Always happy to help! 🌟 Any other questions?',
            'Glad I could help! 💚 Feel free to ask if there\'s anything else.'],
       follow:['Book now','What does it cost?']},
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
       ans:['You can call us at <a href="tel:+4524440321"><strong>+45 24 44 03 21</strong></a> or email <a href="mailto:info@elite-vask.dk">info@elite-vask.dk</a> 📩'],
       follow:['Book now','Opening hours']},
      {keys:['hours','open','when','weekend','weekday'],
       ans:['We are open <strong>Monday–Friday 08–20</strong> and <strong>Saturday–Sunday 10–20</strong> – or by arrangement. Online booking is available 24/7 🕗'],
       follow:['Book now','Contact']},
      {keys:['guarantee','not happy','complaint','refund'],
       ans:['We offer a <strong>satisfaction guarantee</strong> – if you\'re not happy, we\'ll find a solution 💚 Your satisfaction is our priority.'],
       follow:['Book now','Contact']},
      {keys:['seat','fabric','interior','smell'],
       ans:['We offer <strong>interior steam cleaning</strong> – seats, floor mats, dashboard and all surfaces. We also offer deep fabric seat cleaning. <a href="#vaelg">See packages →</a>'],
       follow:['What does it cost?','Book now']},
      {keys:['pay','payment','prepay','when do i pay','invoice','mobilepay','cash','money'],
       ans:['You pay <strong>only after</strong> the wash is finished – and only when you are <strong>100% satisfied</strong> 💳 No prepayment. We accept MobilePay, bank transfer and cash.'],
       follow:['Satisfaction guarantee?','Book now']},
      {keys:['fee','travel fee','surcharge','extra travel','city','far','free travel'],
       ans:['<strong>Travel is completely free</strong> across all of Zealand – including inside the city areas 🚗💨 No travel fees or hidden surcharges, wherever you live.'],
       follow:['Do you cover my area?','Book now']},
      {keys:['cancel','reschedule','change time','rebook'],
       ans:['You can <strong>freely change or cancel</strong> your booking – just let us know in good time and we\'ll find a new slot that suits you 🗓️ <a href="tel:+4524440321">Call +45 24 44 03 21</a>'],
       follow:['Opening hours','Book now']},
      {keys:['rain','weather','snow','wind','outdoor','cold'],
       ans:['We work in <strong>almost any weather</strong> 🌦️ Our steam works fine in cold conditions. In heavy rain we\'ll find a covered spot together or reschedule.'],
       follow:['Book now','Do you cover my area?']},
    ]
  };
  var QUICK={
    da:[{l:'💰 Hvad koster det?',q:'Hvad koster det?'},{l:'⏱ Hvor lang tid?',q:'Hvor lang tid?'},{l:'📍 Dækker I mit område?',q:'Dækker I mit område?'},{l:'🌿 Hvad er dampvask?',q:'Hvad er dampvask?'},{l:'💳 Betal efter vask?',q:'Hvornår betaler jeg?'},{l:'🛡️ Tilfredshedsgaranti?',q:'Har I tilfredshedsgaranti?'}],
    en:[{l:'💰 What does it cost?',q:'What does it cost?'},{l:'⏱ How long does it take?',q:'How long does it take?'},{l:'📍 Do you cover my area?',q:'Do you cover my area?'},{l:'🌿 What is steam wash?',q:'What is steam wash?'},{l:'💳 Pay after wash?',q:'When do I pay?'},{l:'🛡️ Satisfaction guarantee?',q:'Do you have a satisfaction guarantee?'}]
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
        addMsg(LANG==='da'
          ?'Hej! 👋 Jeg er <strong>Elite Bot</strong> fra Elite Vask – mobil dampvask på Sjælland 🌿<br>Hvad kan jeg hjælpe dig med i dag?'
          :'Hi! 👋 I\'m <strong>Elite Bot</strong> from Elite Vask – mobile steam wash on Zealand 🌿<br>What can I help you with today?',
        'bot');
        setTimeout(showQuick,400);
      },250);
    }
  }
  input.addEventListener('input',function(){send.disabled=!input.value.trim();});
  send.disabled=true;
  toggle.addEventListener('click',function(){
    if(!opened){
      win.style.display='flex';win.style.flexDirection='column';
      win.classList.remove('closing');win.classList.add('opening');
      setTimeout(function(){win.classList.remove('opening');},520);
      badge.style.display='none';opened=true;
      var intro=document.getElementById('chatIntro');
      if(intro&&!introPlayed){
        introPlayed=true;intro.style.display='flex';
        setTimeout(function(){intro.classList.add('hiding');setTimeout(function(){intro.style.display='none';showGreeting();},450);},3200);
      }else{showGreeting();}
    }else{closeWin();}
  });
  function closeWin(){win.classList.add('closing');setTimeout(function(){win.style.display='none';win.classList.remove('closing');opened=false;},280);}
  document.getElementById('chatClose').addEventListener('click',closeWin);
  send.addEventListener('click',sendMsg);
  input.addEventListener('keydown',function(e){if(e.key==='Enter'&&!e.shiftKey)sendMsg();});

  /* Mobile keyboard fix: reposition chat window when virtual keyboard opens */
  (function(){
    var vv=window.visualViewport;
    if(!vv)return;
    function onVVResize(){
      if(!opened)return;
      var keyH=Math.max(0,window.innerHeight-vv.height-vv.offsetTop);
      if(keyH>50){
        win.style.bottom=(keyH+8)+'px';
        win.style.maxHeight=(vv.height-90)+'px';
      }else{
        win.style.bottom='';win.style.maxHeight='';
      }
    }
    vv.addEventListener('resize',onVVResize);
    input.addEventListener('blur',function(){win.style.bottom='';win.style.maxHeight='';});
  })();

  // Swipe-to-dismiss chatbot
  var chatbot=document.querySelector('.chatbot');
  if(chatbot){
    var dismissed=false;
    // Mini re-open button (reuse across re-inits)
    var mini=document.querySelector('.chat-mini-btn');
    if(!mini){
      mini=document.createElement('button');
      mini.type='button';
      mini.className='chat-mini-btn';
      mini.setAttribute('aria-label','Åbn chat');
      mini.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';
      document.body.appendChild(mini);
    }
    function dismissChat(){
      dismissed=true;
      chatbot.classList.add('chat-dismissed');
      mini.classList.add('vis');
      if(opened){closeWin();}
    }
    function restoreChat(){
      dismissed=false;
      chatbot.classList.remove('chat-dismissed');
      mini.classList.remove('vis');
    }
    mini.addEventListener('click',restoreChat);
    // Touch swipe on chatbot toggle
    var t0x=0,t0y=0;
    toggle.addEventListener('touchstart',function(e){t0x=e.touches[0].clientX;t0y=e.touches[0].clientY;},{passive:true});
    toggle.addEventListener('touchend',function(e){
      var dx=e.changedTouches[0].clientX-t0x;
      var dy=e.changedTouches[0].clientY-t0y;
      var dist=Math.sqrt(dx*dx+dy*dy);
      if(dist>40&&(dx<-20||dy>20)){e.preventDefault();dismissChat();}
    });
  }
})();

/* ====== STEAM FACTS ACCORDION (mobile) ====== */
(function(){
  function initSteamAcc(){
    var items=document.querySelectorAll('.sf-item');
    if(!items.length)return;
    items.forEach(function(item){
      if(item.dataset.sfBound)return;
      item.dataset.sfBound='1';
      var row=item.querySelector('.sf-row');
      if(!row)return;
      row.addEventListener('click',function(){
        if(window.innerWidth>880)return;
        var isOpen=item.classList.contains('sf-open');
        items.forEach(function(i){i.classList.remove('sf-open');});
        if(!isOpen)item.classList.add('sf-open');
      });
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initSteamAcc);}else{setTimeout(initSteamAcc,0);}
})();

/* ====== REVEAL CHATBOT AFTER SCROLL (less intrusive first impression) ====== */
(function(){
  function initChatReveal(){
    var cb=document.getElementById('chatbot');
    if(!cb||cb.__revealBound)return;
    cb.__revealBound=true;
    var shown=false;
    function check(){
      if(shown)return;
      if(window.scrollY>320){cb.classList.add('chat-revealed');shown=true;window.removeEventListener('scroll',check);}
    }
    window.addEventListener('scroll',check,{passive:true});
    check();
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initChatReveal);}
  else{initChatReveal();}
})();

/* ====== LAZY VIDEO — only load & play when on screen (saves mobile data) ====== */
(function(){
  function initLazyVideo(){
    var v=document.querySelector('.ev-video');
    if(!v||v.__lazyBound)return;
    v.__lazyBound=true;
    if(!('IntersectionObserver' in window)){v.setAttribute('preload','metadata');v.play&&v.play().catch(function(){});return;}
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(e.isIntersecting){
          if(v.preload!=='metadata')v.preload='metadata';
          var p=v.play();if(p&&p.catch)p.catch(function(){});
        } else if(!v.paused){
          v.pause();
        }
      });
    },{threshold:0.25});
    io.observe(v);
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initLazyVideo);}
  else{initLazyVideo();}
})();

/* ====== BEFORE/AFTER CAROUSEL ====== */
(function(){
  var cur=0;

  function getPerPage(){
    var vp=document.getElementById('baViewport');
    if(!vp)return 4;
    var w=vp.offsetWidth;
    if(w<900)return 2;
    return 4;
  }

  function buildDots(total,perPage,dotsEl){
    if(!dotsEl)return;
    dotsEl.innerHTML='';
    var pages=Math.ceil(total/perPage);
    if(pages<=1){dotsEl.style.display='none';return;}
    dotsEl.style.display='';
    for(var i=0;i<pages;i++){
      var btn=document.createElement('button');
      btn.className='gcar-dot'+(i===cur?' active':'');
      btn.setAttribute('aria-label','Side '+(i+1));
      (function(idx){btn.addEventListener('click',function(){cur=idx;render();});})(i);
      dotsEl.appendChild(btn);
    }
  }

  function render(){
    var track=document.getElementById('baGallery');
    var viewport=document.getElementById('baViewport');
    var prev=document.getElementById('baPrev');
    var next=document.getElementById('baNext');
    var dotsEl=document.getElementById('baDots');
    if(!track||!viewport||!prev||!next)return;

    var vw=viewport.offsetWidth;
    var perPage=getPerPage();
    var gap=16;
    var itemW=Math.floor((vw-(gap*(perPage-1)))/perPage);

    Array.from(track.children).forEach(function(item){
      item.style.width=itemW+'px';
      item.style.flexShrink='0';
    });

    var items=Array.from(track.children);
    var pages=Math.ceil(items.length/perPage);
    cur=Math.max(0,Math.min(cur,pages-1));

    var showNav=(pages>1);
    prev.style.opacity=showNav?(cur<=0?'0.3':'1'):'0';
    prev.style.pointerEvents=showNav&&cur>0?'auto':'none';
    next.style.opacity=showNav?(cur>=pages-1?'0.3':'1'):'0';
    next.style.pointerEvents=showNav&&cur<pages-1?'auto':'none';
    if(dotsEl)dotsEl.style.visibility=showNav?'':'hidden';

    // right-align the last page so a partial page never leaves an empty gap
    var trackW=items.length*itemW+(items.length-1)*gap;
    var maxOffset=Math.max(0,trackW-vw);
    var offset=Math.min(cur*perPage*(itemW+gap),maxOffset);
    track.style.transform='translateX(-'+offset+'px)';

    prev.disabled=(cur<=0);
    next.disabled=(cur>=pages-1);

    buildDots(items.length,perPage,dotsEl);
    var dots=dotsEl?dotsEl.querySelectorAll('.gcar-dot'):[];
    dots.forEach(function(d,i){d.classList.toggle('active',i===cur);});
  }

  function initCarousel(){
    var wrap=document.getElementById('baNavWrap');
    if(!wrap||wrap.__baInit)return;
    wrap.__baInit=true;
    var prev=document.getElementById('baPrev');
    var next=document.getElementById('baNext');
    if(!prev||!next)return;
    prev.addEventListener('click',function(){cur--;render();});
    next.addEventListener('click',function(){cur++;render();});
    window.addEventListener('resize',function(){cur=0;render();});
    /* touch swipe */
    var tx=null;
    var vp=document.getElementById('baViewport');
    if(vp){
      vp.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
      vp.addEventListener('touchend',function(e){
        if(tx===null)return;
        var dx=tx-e.changedTouches[0].clientX;
        if(Math.abs(dx)>40){if(dx>0){cur++;render();}else{cur--;render();}}
        tx=null;
      },{passive:true});
    }
    /* ensure layout is complete before render */
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ render(); });
    });
  }

  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',initCarousel);}
  else{requestAnimationFrame(initCarousel);}
})();

/* ====== GALLERY CAROUSEL ====== */
(function(){
  var cur=0;

  function getPerPage(){
    var vp=document.getElementById('galViewport');
    if(!vp)return 4;
    var w=vp.offsetWidth;
    if(w<900)return 2;
    return 4;
  }

  function buildDots(total,perPage,dotsEl){
    if(!dotsEl)return;
    dotsEl.innerHTML='';
    var pages=Math.ceil(total/perPage);
    if(pages<=1){dotsEl.style.display='none';return;}
    dotsEl.style.display='';
    for(var i=0;i<pages;i++){
      var btn=document.createElement('button');
      btn.className='gcar-dot'+(i===cur?' active':'');
      btn.setAttribute('aria-label','Side '+(i+1));
      (function(idx){btn.addEventListener('click',function(){cur=idx;render();});})(i);
      dotsEl.appendChild(btn);
    }
  }

  function render(){
    var track=document.getElementById('gallery');
    var viewport=document.getElementById('galViewport');
    var prev=document.getElementById('galPrev');
    var next=document.getElementById('galNext');
    var dotsEl=document.getElementById('galDots');
    if(!track||!viewport||!prev||!next)return;

    var vw=viewport.offsetWidth;
    var perPage=getPerPage();
    var gap=16;
    // calculate exact item width from real viewport width
    var itemW=Math.floor((vw-(gap*(perPage-1)))/perPage);

    // apply width to all items (JS-driven, avoids % flex-basis issues)
    Array.from(track.children).forEach(function(item){
      item.style.width=itemW+'px';
      item.style.flexShrink='0';
    });

    var items=Array.from(track.children);
    var pages=Math.ceil(items.length/perPage);
    cur=Math.max(0,Math.min(cur,pages-1));

    var showNav=(pages>1);
    prev.style.opacity=showNav?(cur<=0?'0.3':'1'):'0';
    prev.style.pointerEvents=showNav&&cur>0?'auto':'none';
    next.style.opacity=showNav?(cur>=pages-1?'0.3':'1'):'0';
    next.style.pointerEvents=showNav&&cur<pages-1?'auto':'none';
    if(dotsEl)dotsEl.style.visibility=showNav?'':'hidden';

    // right-align the last page so a partial page never leaves an empty gap
    var trackW=items.length*itemW+(items.length-1)*gap;
    var maxOffset=Math.max(0,trackW-vw);
    var offset=Math.min(cur*perPage*(itemW+gap),maxOffset);
    track.style.transform='translateX(-'+offset+'px)';

    prev.disabled=(cur<=0);
    next.disabled=(cur>=pages-1);

    buildDots(items.length,perPage,dotsEl);
    var dots=dotsEl?dotsEl.querySelectorAll('.gcar-dot'):[];
    dots.forEach(function(d,i){d.classList.toggle('active',i===cur);});
  }

  function initCarousel(){
    var wrap=document.getElementById('galleryNavWrap');
    if(!wrap||wrap.__carInit)return;
    wrap.__carInit=true;
    var prev=document.getElementById('galPrev');
    var next=document.getElementById('galNext');
    if(!prev||!next)return;

    prev.addEventListener('click',function(){cur--;render();});
    next.addEventListener('click',function(){cur++;render();});
    window.addEventListener('resize',function(){cur=0;render();});

    /* touch swipe */
    var tx=null;
    var viewport=document.getElementById('galViewport');
    if(viewport){
      viewport.addEventListener('touchstart',function(e){tx=e.touches[0].clientX;},{passive:true});
      viewport.addEventListener('touchend',function(e){
        if(tx===null)return;
        var dx=tx-e.changedTouches[0].clientX;
        if(Math.abs(dx)>40){if(dx>0){cur++;render();}else{cur--;render();}}
        tx=null;
      },{passive:true});
    }

    /* ensure layout is complete before render */
    requestAnimationFrame(function(){
      requestAnimationFrame(function(){ render(); });
    });
    wrap.__carRender=render;
  }

  function loadDynamicGallery(){
    var track=document.getElementById('gallery');
    if(!track||track.__kvLoaded)return;
    track.__kvLoaded=true;
    fetch('/api/content/gallery')
      .then(function(r){return r.json();})
      .then(function(data){
        var kvItems=data.items||[];
        track.querySelectorAll('.gitem-dynamic').forEach(function(el){el.remove();});
        kvItems.forEach(function(item){
          var fig=document.createElement('figure');
          fig.className='gitem gitem-dynamic';
          fig.dataset.full=item.url;
          var img=document.createElement('img');
          img.src=item.url;img.alt=item.caption||'Galleri';img.loading='lazy';
          fig.appendChild(img);
          if(item.caption){var cap=document.createElement('figcaption');cap.textContent=item.caption;fig.appendChild(cap);}
          track.appendChild(fig);
          if(window.__lbItems){
            var idx=window.__lbItems.length;
            window.__lbItems.push(item.url);
            fig.addEventListener('click',function(){if(window.__lbOpen)window.__lbOpen(idx);});
          }
        });
        var wrap=document.getElementById('galleryNavWrap');
        if(wrap&&wrap.__carRender)wrap.__carRender();
      })
      .catch(function(){track.__kvLoaded=false;});
  }

  function init(){initCarousel();loadDynamicGallery();}
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',init);}
  else{init();}
})();

/* ====== HAMBURGER DRAWER ====== */
(function(){
  var btn=document.getElementById('menuBtn');
  var drawer=document.getElementById('navDrawer');
  if(!btn||!drawer)return;
  function setDrawer(open){
    drawer.classList.toggle('open',open);
    btn.classList.toggle('open',open);
    btn.setAttribute('aria-expanded',open?'true':'false');
  }
  btn.addEventListener('click',function(){
    setDrawer(!drawer.classList.contains('open'));
  });
  // close on any drawer link click
  drawer.querySelectorAll('.drawer-link,.drawer-book,.drawer-call').forEach(function(el){
    el.addEventListener('click',function(){setDrawer(false);});
  });
  // lang buttons in drawer
  drawer.querySelectorAll('[data-lang]').forEach(function(el){
    el.addEventListener('click',function(){
      LANG=el.getAttribute('data-lang');
      localStorage.setItem('lang',LANG);
      applyLang();
      setDrawer(false);
    });
  });
  // close on outside click
  document.addEventListener('click',function(e){
    if(drawer.classList.contains('open')&&!drawer.contains(e.target)&&e.target!==btn&&!btn.contains(e.target)){
      setDrawer(false);
    }
  },{signal:__sig});
  // close on Escape
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&drawer.classList.contains('open')){setDrawer(false);btn.focus();}
  },{signal:__sig});
})();

/* ====== BILPLEJE GUIDE DROPDOWN ====== */
(function(){
  var btn=document.getElementById('guideNavBtn');
  var panel=document.getElementById('guideDropdown');
  if(!btn||!panel)return;
  function openGuide(){btn.setAttribute('aria-expanded','true');panel.classList.add('open');panel.setAttribute('aria-hidden','false');}
  function closeGuide(){btn.setAttribute('aria-expanded','false');panel.classList.remove('open');panel.setAttribute('aria-hidden','true');}
  var hoverCapable=window.matchMedia&&window.matchMedia('(hover:hover)').matches;
  if(hoverCapable){
    // Desktop: hover previews the dropdown, click navigates to the full guide page
    btn.addEventListener('mouseenter',openGuide);
    var maybeClose=function(){setTimeout(function(){if(!btn.matches(':hover')&&!panel.matches(':hover'))closeGuide();},140);};
    btn.addEventListener('mouseleave',maybeClose);
    panel.addEventListener('mouseleave',maybeClose);
    btn.addEventListener('click',function(){window.location.href='/guide';});
  }else{
    // Touch: tap toggles the preview; cards link to their pages
    btn.addEventListener('click',function(e){e.stopPropagation();panel.classList.contains('open')?closeGuide():openGuide();});
  }
  document.getElementById('guideDropdownClose').addEventListener('click',closeGuide);
  document.addEventListener('click',function(e){if(!panel.contains(e.target)&&e.target!==btn)closeGuide();},{signal:__sig});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeGuide();},{signal:__sig});
})();

/* ====== DESKTOP PARALLAX ONLY ====== */
if(window.innerWidth>880){
  var heroBg=document.querySelector('.hero-bg-img');
  if(heroBg){
    window.addEventListener('scroll',function(){
      var y=window.scrollY;
      heroBg.style.transform='translateY('+Math.round(y*0.25)+'px)';
    },{passive:true,signal:__sig});
  }
}

/* ====== SCROLL TO TOP ====== */
(function(){
  // Reuse an existing button across re-inits instead of appending a new one each time.
  var btn=document.querySelector('.scroll-top');
  if(!btn){
    btn=document.createElement('button');
    btn.type='button';
    btn.className='scroll-top';
    btn.setAttribute('aria-label','Scroll to top');
    btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" aria-hidden="true"><path d="M18 15l-6-6-6 6"/></svg>';
    document.body.appendChild(btn);
  }
  btn.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'});},{signal:__sig});
  var ticking=false;
  window.addEventListener('scroll',function(){
    if(!ticking){
      requestAnimationFrame(function(){
        btn.classList.toggle('vis',window.scrollY>500);
        ticking=false;
      });
      ticking=true;
    }
  },{passive:true,signal:__sig});
})();

window.toggleWhyCard=function(){
  var card=document.getElementById('whyCard');
  if(card){ var open=card.classList.toggle('open'); card.setAttribute('aria-expanded',open?'true':'false'); }
};

applyLang();
}
