"use client";
import Script from "next/script";
import { useEffect } from "react";
import { useConsent } from "@/lib/useConsent";

// Google Analytics 4 — loads ONLY when NEXT_PUBLIC_GA_ID is set AND the
// visitor has actively accepted cookies. Reacts live to the consent banner,
// so accepting starts tracking without a reload and declining stops it.
export default function GoogleAnalytics() {
  const id = process.env.NEXT_PUBLIC_GA_ID;
  const consented = useConsent() === "accepted";

  useEffect(() => {
    if (consented || typeof window === "undefined" || !id) return;
    // Accept → decline flip: unmounting doesn't remove the already-loaded
    // gtag script, so explicitly stop collection and drop GA cookies.
    if (!window.dataLayer) return;
    try {
      window[`ga-disable-${id}`] = true;
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", { analytics_storage: "denied", ad_storage: "denied" });
      }
      const base = location.hostname.replace(/^www\./, "");
      // Browsers reject a domain-scoped cookie on localhost or a bare IP.
      const canScope = base.includes(".") && !/^[\d.]+$/.test(base);
      document.cookie.split(";").forEach((c) => {
        const name = c.split("=")[0].trim();
        if (/^(_ga|_gid|_gat)/.test(name)) {
          document.cookie = `${name}=; Max-Age=0; path=/`;
          if (canScope) document.cookie = `${name}=; Max-Age=0; path=/; domain=.${base}`;
        }
      });
    } catch {}
  }, [consented, id]);

  if (!id || !consented) return null;
  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('js',new Date());
gtag('config','${id}',{anonymize_ip:true});`}
      </Script>
    </>
  );
}
