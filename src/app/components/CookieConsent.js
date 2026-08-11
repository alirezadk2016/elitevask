"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useConsent, setConsent } from "@/lib/useConsent";

export default function CookieConsent() {
  const consent = useConsent();
  const pathname = usePathname() || "";

  // Internal tools — no marketing scripts run here, and the banner just
  // covers the admin/portal UI.
  if (pathname.startsWith("/admin") || pathname.startsWith("/portal")) return null;

  // Only shown until a choice has been made.
  if (consent !== null) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie samtykke">
      <div className="cookie-banner-inner">
        <p className="cookie-banner-text">
          Vi bruger cookies til at forbedre din oplevelse.{" "}
          <Link href="/cookies" className="cookie-banner-link">Læs mere</Link>
        </p>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn-accept" onClick={() => setConsent("accepted")}>Acceptér</button>
          <button className="cookie-btn cookie-btn-decline" onClick={() => setConsent("declined")}>Afvis</button>
        </div>
      </div>
    </div>
  );
}
