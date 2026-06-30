// Structured-data (JSON-LD) helpers — keep one canonical domain + business id.
export const SITE = "https://www.elite-vask.dk";
const BIZ_ID = `${SITE}/#business`;

export function breadcrumbLd(trail) {
  // trail: [{ name, path }]
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${SITE}${t.path}`,
    })),
  };
}

export function cityServiceLd({ city, path }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `Mobil bilvask i ${city}`,
    serviceType: "Mobil bil dampvask",
    provider: { "@id": BIZ_ID },
    areaServed: { "@type": "City", name: city },
    url: `${SITE}${path}`,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "DKK",
      lowPrice: "500",
      highPrice: "2350",
      offerCount: "4",
    },
    inLanguage: "da-DK",
  };
}

export function articleLd({ title, description, path, datePublished, dateModified }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: `${SITE}${path}`,
    author: { "@type": "Organization", name: "Elite Vask", url: SITE },
    publisher: { "@id": BIZ_ID },
    image: `${SITE}/hero.jpg.png`,
    datePublished,
    dateModified: dateModified || datePublished,
    inLanguage: "da-DK",
  };
}
