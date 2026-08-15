import { DEFAULT_FAQ_BILINGUAL } from "@/lib/faqData";
import FaqClient from "./FaqClient";

export const metadata = {
  title: "FAQ – Elite Vask | Ofte stillede spørgsmål om mobil dampvask",
  description: "Svar på de mest stillede spørgsmål om Elite Vaskes mobile bil dampvask på Sjælland. Priser, behandlingstid, sikkerhed, elbiler, aftaler og meget mere.",
  alternates: { canonical: "/faq" },
  openGraph: {
    // Next merges page metadata over the layout SHALLOWLY, so a page that
    // declares openGraph without images ships with no og:image at all.
    images: [{ url: "/og-cover.jpg", width: 1200, height: 630, alt: "Elite Vask – mobil bil dampvask" }],
    title: "FAQ – Elite Vask | Ofte stillede spørgsmål",
    description: "Svar på de mest stillede spørgsmål om Elite Vaskes mobile bil dampvask på Sjælland.",
    type: "website",
    locale: "da_DK",
    url: "/faq",
  },
};

export const revalidate = 60;

/* Fetch the manager-edited FAQ from KV, falling back to the built-in list.
 * Items are returned with BOTH languages so the client page can follow the
 * visitor's language choice — until now this page flattened everything to
 * Danish and an English visitor's toggle simply stopped working here. */
async function getFaqItems() {
  const norm = (v) => {
    if (typeof v === "string") return { da: v, en: v };
    if (v && typeof v === "object") {
      const da = typeof v.da === "string" ? v.da : "";
      const en = typeof v.en === "string" ? v.en : "";
      return { da: da || en, en: en || da };
    }
    return { da: "", en: "" };
  };
  try {
    const { kv } = await import("@vercel/kv");
    const raw = await kv.get("content:faq");
    const faq = typeof raw === "string" ? JSON.parse(raw) : raw;
    // Any non-empty admin list wins. (It used to need >= 5, so trimming the
    // FAQ to a curated 4 silently restored every deleted default answer.)
    if (Array.isArray(faq) && faq.length > 0) {
      return faq
        .map((f) => ({ q: norm(f.q), a: norm(f.a) }))
        .filter((f) => f.q.da && f.a.da);
    }
  } catch (e) {}
  return DEFAULT_FAQ_BILINGUAL;
}

export default async function FaqPage() {
  const faqItems = await getFaqItems();

  // JSON-LD stays Danish — the page's canonical language and primary market.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((f) => ({
      "@type": "Question",
      name: f.q.da,
      acceptedAnswer: { "@type": "Answer", text: f.a.da },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <FaqClient items={faqItems} />
    </>
  );
}
