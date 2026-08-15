"use client";
import Link from "next/link";
import { useLang } from "@/lib/useLang";
import LangToggle from "@/components/LangToggle";

/* The visible /faq page. It lives in a client component so the whole page —
 * header, intro, every question and the CTA — follows the visitor's language
 * choice, exactly like the homepage. The server component around it still
 * owns metadata, the (Danish) JSON-LD and the KV fetch. */

const T = {
  da: {
    eyebrow: "Spørgsmål & svar",
    title: "Ofte stillede spørgsmål",
    lead: "Her finder du svar på alt om Elite Vaskes mobile bil dampvask på Sjælland — priser, behandlingstid, sikkerhed og meget mere.",
    ctaEyebrow: "Klar til en ren bil?",
    ctaTitle: "Book din dampvask i dag",
    ctaLead: "Vi kører til dig — gratis kørsel i hele Sjælland. Betal først når bilen er ren.",
    ctaBook: "Se priser & book",
    ctaCall: "Ring nu",
    back: "Tilbage til forsiden",
    book: "Book nu",
  },
  en: {
    eyebrow: "Questions & answers",
    title: "Frequently asked questions",
    lead: "Answers to everything about Elite Vask's mobile car steam wash on Zealand — prices, duration, safety and much more.",
    ctaEyebrow: "Ready for a clean car?",
    ctaTitle: "Book your steam wash today",
    ctaLead: "We come to you — free travel across Zealand. Pay only once the car is clean.",
    ctaBook: "See prices & book",
    ctaCall: "Call now",
    back: "Back to the front page",
    book: "Book now",
  },
};

const pick = (v, lang) => {
  if (typeof v === "string") return v;
  if (v && typeof v === "object") return v[lang] || v.da || v.en || "";
  return "";
};

export default function FaqClient({ items }) {
  const lang = useLang();
  const t = T[lang];

  return (
    <main style={{ background: "var(--bg0,#0b1310)", color: "var(--txt,#e9f1ec)", minHeight: "100vh", fontFamily: "Manrope, system-ui, sans-serif" }}>
      {/* ── HEADER ── */}
      <header style={{ borderBottom: "1px solid rgba(255,255,255,.07)", position: "sticky", top: 0, zIndex: 100, background: "rgba(11,19,16,.92)", backdropFilter: "blur(12px)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            <img src="/logo-96.webp" alt="Elite Vask" width="34" height="34" style={{ width: 34, height: 34, borderRadius: 8, objectFit: "cover" }} />
            <div style={{ lineHeight: 1.2 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>ELITE VASK</div>
              <div style={{ fontSize: 10, color: "#37d278", fontWeight: 600, letterSpacing: 0.5 }}>MOBIL BIL DAMPVASK</div>
            </div>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <LangToggle />
            <a href="tel:+4524440321" aria-label="+45 24 44 03 21" style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: 13, fontWeight: 600 }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
            </a>
            <Link href="/#vaelg" style={{ background: "#37d278", color: "#062313", borderRadius: 8, padding: "9px 18px", fontWeight: 700, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
              {t.book}
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "56px 24px 16px", textAlign: "center" }}>
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase", color: "#37d278", marginBottom: 14 }}>
          {t.eyebrow}
        </p>
        <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: 800, letterSpacing: -1, color: "#fff", lineHeight: 1.1, marginBottom: 18 }}>
          {t.title}
        </h1>
        <p style={{ fontSize: "clamp(14px,2vw,16px)", color: "#94a89c", lineHeight: 1.7, maxWidth: 560, margin: "0 auto 52px" }}>
          {t.lead}
        </p>
      </div>

      {/* ── FAQ ACCORDION ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "0 24px 20px" }}>
        {items.map((f, i) => (
          <details key={i} className="faq-page-item">
            <summary>
              <span>{pick(f.q, lang)}</span>
              <svg className="faq-page-icon" viewBox="0 0 24 24" fill="none" stroke="#37d278" strokeWidth="2.2" strokeLinecap="round" width="20" height="20">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </summary>
            <div className="faq-page-ans">
              <p>{pick(f.a, lang)}</p>
            </div>
          </details>
        ))}
      </div>

      {/* ── CTA ── */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px", textAlign: "center" }}>
        <div style={{ background: "rgba(55,210,120,.06)", border: "1px solid rgba(55,210,120,.18)", borderRadius: 18, padding: "40px 28px" }}>
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, textTransform: "uppercase", color: "#37d278", marginBottom: 12 }}>{t.ctaEyebrow}</p>
          <h2 style={{ fontSize: "clamp(22px,4vw,34px)", fontWeight: 800, color: "#fff", letterSpacing: -0.5, marginBottom: 10 }}>
            {t.ctaTitle}
          </h2>
          <p style={{ fontSize: 15, color: "#94a89c", lineHeight: 1.65, maxWidth: 440, margin: "0 auto 28px" }}>
            {t.ctaLead}
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/#vaelg" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#37d278", color: "#062313", borderRadius: 10, padding: "13px 28px", fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
              {t.ctaBook}
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </Link>
            <a href="tel:+4524440321" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", borderRadius: 10, padding: "13px 24px", fontWeight: 600, fontSize: 15, textDecoration: "none" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z"/></svg>
              {t.ctaCall}
            </a>
          </div>
        </div>

        <div style={{ marginTop: 32, display: "flex", justifyContent: "center" }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,.45)", fontSize: 13, textDecoration: "none", fontWeight: 500 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            {t.back}
          </Link>
        </div>
      </div>
    </main>
  );
}
