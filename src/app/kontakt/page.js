import RelatedLinks from "@/components/RelatedLinks";
import JsonLd from "@/components/JsonLd";
import { breadcrumbLd, SITE } from "@/lib/seo";

export const metadata = {
  title: "Kontakt Elite Vask – Mobil bilvask på Sjælland",
  description: "Kontakt Elite Vask om mobil dampvask, priser og booking. Ring +45 24 44 03 21, skriv til info@elite-vask.dk, eller book online. Vi kører til dig i hele Sjælland.",
  alternates: { canonical: "/kontakt" },
  openGraph: {
    title: "Kontakt Elite Vask",
    description: "Ring, skriv eller book online. Mobil dampvask – vi kører til dig i hele Sjælland.",
    type: "website",
    locale: "da_DK",
    url: "/kontakt",
  },
};

const contactPageLd = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Kontakt Elite Vask",
  url: `${SITE}/kontakt`,
  inLanguage: "da-DK",
  about: { "@id": `${SITE}/#business` },
  mainEntity: {
    "@type": "AutoWash",
    "@id": `${SITE}/#business`,
    name: "Elite Vask",
    telephone: "+4524440321",
    email: "info@elite-vask.dk",
    url: SITE,
    address: {
      "@type": "PostalAddress",
      addressLocality: "København",
      addressRegion: "Sjælland",
      addressCountry: "DK",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+4524440321",
      email: "info@elite-vask.dk",
      contactType: "customer service",
      areaServed: "Sjælland",
      availableLanguage: ["da", "en"],
    },
  },
};

export default function Kontakt() {
  return (
    <div className="legal-page">
      <JsonLd
        items={[
          breadcrumbLd([
            { name: "Forside", path: "/" },
            { name: "Kontakt", path: "/kontakt" },
          ]),
          contactPageLd,
        ]}
      />
      <div className="legal-wrap">
        <a href="/" className="legal-back">← Tilbage til forsiden</a>

        <div className="guide-eyebrow">Kontakt</div>
        <h1>Kontakt Elite Vask</h1>
        <p className="guide-lead">
          Har du spørgsmål om mobil dampvask, priser eller booking? Vi sidder klar til at hjælpe – ring, skriv eller book online. Vi kører til dig i hele Sjælland, og kørsel er altid gratis.
        </p>

        <div className="contact-cta" style={{ margin: "8px 0 36px" }}>
          <a href="/#vaelg" className="btn btn-green btn-lg">Se priser &amp; book nu</a>
          <a href="tel:+4524440321" className="btn btn-ghost btn-lg">Ring til os</a>
        </div>

        <div className="contact-list">
          <a href="tel:+4524440321" className="cl-item">
            <span className="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" /></svg></span>
            <span><span className="lab">Telefon</span><br /><span className="val">+45 24 44 03 21</span></span>
          </a>
          <a href="mailto:info@elite-vask.dk" className="cl-item">
            <span className="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-10 5L2 7" /></svg></span>
            <span><span className="lab">E-mail</span><br /><span className="val">info@elite-vask.dk</span></span>
          </a>
          <div className="cl-item cl-item-hours">
            <span className="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg></span>
            <span><span className="lab">Åbningstider</span>
              <div className="hours-grid">
                <div className="hrow"><span className="hday">Man – Fre</span><span className="htime">08:00 – 20:00</span></div>
                <div className="hrow"><span className="hday">Lør – Søn</span><span className="htime">10:00 – 20:00</span></div>
                <div className="hrow hrow-note"><span>eller efter aftale</span></div>
              </div>
            </span>
          </div>
          <div className="cl-item">
            <span className="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg></span>
            <span><span className="lab">Adresse</span><br /><span className="val">København · Sjælland · Danmark</span></span>
          </div>
          <a href="https://www.facebook.com/share/14ciFraNT4M/" target="_blank" rel="noopener noreferrer" className="cl-item">
            <span className="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg></span>
            <span><span className="lab">Facebook</span><br /><span className="val">Elite Vask</span></span>
          </a>
          <a href="https://instagram.com/elitevasksjaelland" target="_blank" rel="noopener noreferrer" className="cl-item">
            <span className="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><path d="M17.5 6.5h.01" /></svg></span>
            <span><span className="lab">Instagram</span><br /><span className="val">@elitevasksjaelland</span></span>
          </a>
          <div className="cl-item">
            <span className="cl-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg></span>
            <span><span className="lab">CVR</span><br /><span className="val">46392264</span></span>
          </div>
        </div>
        <RelatedLinks />
      </div>
    </div>
  );
}
