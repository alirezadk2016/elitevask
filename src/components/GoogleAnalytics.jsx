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
      let ok = false;
      try { ok = localStorage.getItem("cookie_consent") === "accepted"; } catch {}
      setConsented(ok);
      // Accept → decline flip: unmounting doesn't remove the already-loaded
      // gtag script, so explicitly stop collection and drop GA cookies.
      if (!ok && typeof window !== "undefined" && window.dataLayer) {
        try {
          window[`ga-disable-${id}`] = true;
          // Also tell gtag consent is withdrawn (v2 consent mode).
          if (typeof window.gtag === "function") {
            window.gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
          }
          const host = location.hostname;
          // Only set a domain-scoped cookie for real dot-domains; "domain=.localhost"
          // (or a bare IP) is rejected by browsers and would silently no-op.
          const base = host.replace(/^www\./, "");
          const canScope = base.includes(".") && !/^[\d.]+$/.test(base);
          document.cookie.split(";").forEach((c) => {
            const name = c.split("=")[0].trim();
            if (/^(_ga|_gid|_gat)/.test(name)) {
              document.cookie = `${name}=; Max-Age=0; path=/`;
              if (canScope) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${base}`;
            }
          });
        } catch {}
      }
    };
    read();
    window.addEventListener("cookie-consent-changed", read);
    return () => window.removeEventListener("cookie-consent-changed", read);
  }, [id]);

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
