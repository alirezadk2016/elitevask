"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConsent, setConsent } from "@/lib/useConsent";
import { useLang } from "@/lib/useLang";

export default function CookieConsent() {
  const consent = useConsent();
  const pathname = usePathname() || "";
  const en = useLang() === "en";

  // Internal tools — no marketing scripts run here, and the banner just
  // covers the admin/portal UI.
  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) return null;

  // Only shown until a choice has been made.
  if (consent !== null) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label={en ? "Cookie consent" : "Cookie samtykke"}>
      <div className="cookie-banner-inner">
        <p className="cookie-banner-text">
          {en ? "We use cookies to improve your experience." : "Vi bruger cookies til at forbedre din oplevelse."}{" "}
          <Link href="/cookies" className="cookie-banner-link">{en ? "Read more" : "Læs mere"}</Link>
        </p>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn-accept" onClick={() => setConsent("accepted")}>{en ? "Accept" : "Acceptér"}</button>
          <button className="cookie-btn cookie-btn-decline" onClick={() => setConsent("declined")}>{en ? "Decline" : "Afvis"}</button>
        </div>
      </div>
    </div>
  );
}
