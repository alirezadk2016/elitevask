"use client";
import Link from "next/link";
import { useLang, setLang } from "@/lib/useLang";

/* Shown on pages whose long-form content only exists in Danish (legal text
 * and the local SEO articles). Until now an English visitor landed on those
 * pages with no acknowledgement at all — the site simply pretended their
 * language choice never happened. Silently ignoring the choice is worse than
 * being honest about what exists in which language. */
export default function DanishOnlyNotice() {
  const lang = useLang();
  if (lang !== "en") return null;
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
      background: "rgba(55,210,120,.07)", border: "1px solid rgba(55,210,120,.22)",
      borderRadius: 12, padding: "13px 16px", margin: "0 0 22px",
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#37d278" strokeWidth="2" strokeLinecap="round" style={{ flexShrink: 0 }} aria-hidden="true">
        <circle cx="12" cy="12" r="10" /><path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
      <span style={{ flex: 1, minWidth: 220, fontSize: 13.5, lineHeight: 1.55, color: "rgba(255,255,255,.82)" }}>
        This page is currently available in Danish only. Prices, booking and our{" "}
        <Link href="/faq" style={{ color: "#37d278", fontWeight: 600 }}>FAQ</Link> are available in English —
        or call us on <a href="tel:+4524440321" style={{ color: "#37d278", fontWeight: 600, whiteSpace: "nowrap" }}>+45 24 44 03 21</a>.
      </span>
      <button type="button" onClick={() => setLang("da")}
        style={{ background: "transparent", border: "1px solid rgba(255,255,255,.16)", borderRadius: 8, color: "rgba(255,255,255,.6)", fontSize: 12, fontWeight: 600, padding: "6px 11px", cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
        Vis på dansk
      </button>
    </div>
  );
}
