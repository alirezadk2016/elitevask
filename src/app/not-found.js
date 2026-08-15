"use client";
import Link from "next/link";
import { useLang } from "@/lib/useLang";

/* Branded 404. A mistyped or outdated URL used to land on Next's bare
 * English default — no logo, no navigation, no way back — which is the most
 * visible "unfinished" signal a polished site can send. */
export default function NotFound() {
  const lang = useLang();
  const da = lang !== "en";
  return (
    <main style={{ minHeight: "100dvh", background: "#0b1310", color: "#e9f1ec", fontFamily: "Manrope, system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", marginBottom: 40 }}>
        <img src="/logo-96.webp" alt="Elite Vask" width="40" height="40" style={{ width: 40, height: 40, borderRadius: 10, objectFit: "cover" }} />
        <span style={{ fontSize: 15, fontWeight: 800, color: "#fff", letterSpacing: 1 }}>ELITE VASK</span>
      </Link>

      <p style={{ fontSize: 72, fontWeight: 800, letterSpacing: -3, lineHeight: 1, margin: "0 0 10px", color: "rgba(55,210,120,.35)" }}>404</p>
      <h1 style={{ fontSize: "clamp(22px,4vw,32px)", fontWeight: 800, letterSpacing: -0.8, color: "#fff", margin: "0 0 12px" }}>
        {da ? "Siden findes ikke" : "Page not found"}
      </h1>
      <p style={{ fontSize: 15, color: "#94a89c", lineHeight: 1.65, maxWidth: 420, margin: "0 0 32px" }}>
        {da
          ? "Siden er måske flyttet, eller adressen er tastet forkert. Bilen kan vi heldigvis stadig vaske."
          : "The page may have moved, or the address was mistyped. The good news: we can still wash your car."}
      </p>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "#37d278", color: "#062313", borderRadius: 10, padding: "13px 26px", fontWeight: 700, fontSize: 14.5, textDecoration: "none" }}>
          {da ? "Til forsiden" : "Go to front page"}
        </Link>
        <Link href="/faq" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", borderRadius: 10, padding: "13px 22px", fontWeight: 600, fontSize: 14.5, textDecoration: "none" }}>
          FAQ
        </Link>
        <a href="tel:+4524440321" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", borderRadius: 10, padding: "13px 22px", fontWeight: 600, fontSize: 14.5, textDecoration: "none" }}>
          {da ? "Ring til os" : "Call us"}
        </a>
      </div>
    </main>
  );
}
