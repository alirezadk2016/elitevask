import { getHours } from "@/lib/getHours";
import { hoursSummary } from "@/lib/hours";

/* llms.txt — a plain-text summary for AI assistants and answer engines
   (https://llmstxt.org). Every fact here is one the site already states;
   opening hours come live from the same KV record the booking system uses. */
export const revalidate = 3600;

const DEFAULT_PRICES = {
  lille: { udv: 500, indv: 600, hele: 800, guld: 2000 }, mellem: { udv: 550, indv: 700, hele: 950, guld: 2200 },
  stor: { udv: 650, indv: 850, hele: 1100, guld: 2350 }, varebil: { udv: 750, indv: 750, hele: 1400, guld: 2200 },
};
const CARS = [["lille", "Lille bil (Aygo, Up!, i10)"], ["mellem", "Mellemstor bil (Golf, Focus, i20)"],
  ["stor", "Stor bil / SUV (Passat, SUV, stationcar)"], ["varebil", "Varebil (Transit, Caddy, Berlingo)"]];
const kr = (n) => `${Number(n).toLocaleString("da-DK")} kr`;
async function prices() {
  const m = JSON.parse(JSON.stringify(DEFAULT_PRICES));
  try {
    const { kv } = await import("@vercel/kv");
    const raw = await kv.get("content:prices");
    const p = typeof raw === "string" ? JSON.parse(raw) : raw;
    for (const id of Object.keys(m)) for (const k of Object.keys(m[id])) {
      const n = Number(p?.[id]?.[k]); if (Number.isFinite(n) && n > 0) m[id][k] = n;
    }
  } catch {}
  return m;
}


export async function GET() {
  let hoursLine = "Alle dage 15:30–22:00, eller efter aftale.";
  try {
    const h = await getHours();
    const s = hoursSummary(h, "da");
    hoursLine = `${s.charAt(0).toUpperCase() + s.slice(1)}, eller efter aftale.`;
  } catch {}
  const P = await prices();
  const rows = CARS.map(([id, label]) => `| ${label} | ${kr(P[id].udv)} | ${kr(P[id].indv)} | ${kr(P[id].hele)} | ${kr(P[id].guld)} |`).join("\n");

  const body = `# Elite Vask

> Elite Vask er en mobil bilvask på Sjælland. Vi damprenser bilen der hvor den holder – hjemme, på arbejdet eller ved sommerhuset – med 1–3 liter vand og uden skrappe kemikalier. Kørsel er gratis i hele Sjælland (postnr. 1000–4799). Booking sker online, og der betales først efter vasken.

## Fakta
- Virksomhed: Elite Vask, CVR 46392264
- Område: hele Sjælland, bl.a. København, Roskilde, Køge, Næstved, Ringsted, Helsingør, Hillerød, Frederikssund, Stevns og Faxe
- Åbningstider: ${hoursLine}
- Telefon: +45 24 44 03 21
- E-mail: info@elite-vask.dk
- Betaling: MobilePay, bankoverførsel eller kontant – efter vasken, ingen forudbetaling
- Afbestilling: gratis indtil 24 timer før via linket i bekræftelsen

## Priser (inkl. moms, fra-priser)
| Biltype | Udvendig | Indvendig | Hele bilen | Guld pakke |
|---|---|---|---|---|
${rows}

Aktuelle priser: https://www.elite-vask.dk/priser

## Sider
- [Forside og booking](https://www.elite-vask.dk/): vælg biltype, se pris og book en tid
- [Priser](https://www.elite-vask.dk/priser): fuld prisliste og hvad hver pakke indeholder
- [FAQ](https://www.elite-vask.dk/faq): ofte stillede spørgsmål om dampvask, vejr, elbiler og tid
- [Galleri](https://www.elite-vask.dk/galleri): før- og efterbilleder fra rigtige opgaver
- [Kontakt](https://www.elite-vask.dk/kontakt): telefon, e-mail og serviceområde

## Guides
- [Hvor ofte bør man vaske sin bil?](https://www.elite-vask.dk/guide/hvor-ofte)
- [Beskyt bilens lak mod vejsalt](https://www.elite-vask.dk/guide/salt-og-lak)
- [Dampvask vs. traditionel bilvask](https://www.elite-vask.dk/guide/dampvask-vs-traditionel)

## Optional
- [Handelsbetingelser](https://www.elite-vask.dk/handelsbetingelser)
- [Privatlivspolitik](https://www.elite-vask.dk/privatpolitik)
`;
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "public, max-age=3600" } });
}
