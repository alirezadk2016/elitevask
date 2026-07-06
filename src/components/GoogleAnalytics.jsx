"use client";
import Script from "next/script";
import { useEffect, useState } from "react";

// Google Analytics 4 — loads ONLY when NEXT_PUBLIC_GA_ID is set AND the visitor
// has actively accepted cookies. Reacts live to the consent banner via the
// "cookie-consent-changed" event, so accepting starts tracking without a reload
// and declining keeps GA from ever mounting.
export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const read = () => {
      try { setConsented(localStorage.getItem("cookie_consent") === "accepted"); }
      catch { setConsented(false); }
    };
    read();
    window.addEventListener("cookie-consent-changed", read);
    return () => window.removeEventListener("cookie-consent-changed", read);
  }, []);

  if (!id || !consented) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${id}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
