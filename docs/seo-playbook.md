# SEO playbook — Elite Vask (Mak-metoden)

The owner's SEO method (the "mak" skill: one page per search intent, pillar
cluster, title/description/URL/H1 per row, internal links, knowledge graph,
Search Console) applied to elite-vask.dk. Only Elite Vask's own facts are
used here; nothing from the course's sample businesses.

## Limits (rule 5)

| | Binding | Target |
| --- | --- | --- |
| Title | ≤ 580 px (20px Arial) | 50–60 chars, keyword first, `\| Elite Vask` last, brand once |
| Description | ≤ 920 px (14px Arial) | 140–158 chars, answer first, true call to action |
| H1 | exactly one | carries the primary keyword in natural form |

Facts a title or description may use: mobile steam wash at the customer's
address in all of Sjælland, from 500 kr., free driving, pay after the wash /
no prepayment, 1–3 litres of water, online booking. Never a time, guarantee
or number the site does not state.

## Pillars (rule 7)

| Job people come for | Where it lives |
| --- | --- |
| Get the car washed where it stands | `/`, `/priser`, `/bilvask/<by>` |
| Learn before deciding | `/guide`, `/guide/*`, `/faq` |
| Trust the business | `/galleri`, `/om-os`, `/kontakt` |

Full sheet: `docs/seo-pillar-cluster.csv`.

## URLs (rule 8)

URLs never move. A new page follows `/<type>/<name>` in Danish ASCII
(æ→ae, ø→oe, å→aa), lowercase, hyphens, no year, ≤ 5 words. A city page is
`/bilvask/<by>`; a guide is `/guide/<emne>`. Add it to `src/lib/pageDates.js`
(sitemap) in the same change.

## Internal links (rule 9)

- `RelatedLinks` on a city page: core pages + that city's geographic
  neighbours only (was: 16 identical chips on every page).
- Anchors name the target in its own words, varied ("Mobil bilvask i Køge",
  "Priser på mobil bilvask", "Spørgsmål om dampvask").
- Hubs (`/priser`, `/kontakt`) list every city — there the list is the
  structure.

## Keyword seeds (rule 6) — volumes unknown until the owner exports them

Run each through Google Keyword Planner (Danish, Danmark) and store the
export as `docs/keyword-pool/<seed>.csv` with `keyword, volume, difficulty,
source, date`. No volume is estimated.

Short seeds first: `bilvask` · `mobil bilvask` · `dampvask bil` ·
`bilpleje` · `indvendig rengøring bil` · `bilrengøring` · `vask bil hjemme`

Checks: `mobil bilvask <by>` for each city page · `bilvask pris` ·
`indvendig bilrens pris` · `dampvask elbil` · `rens af bilsæder` ·
`lugtfjernelse bil` · `hvor ofte vaske bil` · `vejsalt lak` ·
`motorvask` · `lakforsegling`

Candidates that need a page-one check (google.dk, logged out) before they
get a page: one page per package (indvendig rens, lakforsegling, motorrens)
and one per car type (elbil, varebil). Until then: "to check".

## Search Console (rule 14)

- Domain property for `elite-vask.dk`, verified by a DNS TXT record.
- Submit `https://www.elite-vask.dk/sitemap.xml`; also Bing Webmaster Tools.
- Read it daily at first. Many impressions + low CTR → rewrite that title
  and description. One query on two URLs → decide by intent (rule 1).
- Access: the owner only; anyone else gets restricted (view-only).

## Log

- 2026-10-21 — Rule 11/12 pass: shared "Sådan foregår" section on every city page, guide "Læs også" links, docs/seo-knowledge-graph.json (city pages now cover 29–31 of 31 nodes).
- 2026-10-21 — First Mak pass: every title/description measured and inside
  580/920 px; titles keyword-first with the brand last; H1s on home, FAQ,
  guide and gallery carry the primary keyword; city `RelatedLinks` cut to
  neighbours with varied anchors.
