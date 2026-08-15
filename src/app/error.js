"use client";
import { useLang } from "@/lib/useLang";

/* Global error boundary. Without it, a render error showed Next's raw
 * "Application error" screen. Booking still works by phone even when a page
 * breaks — say so instead of leaving the visitor with a dead end. */
export default function GlobalError({ error, reset }) {
  const lang = useLang();
  const da = lang !== "en";
  return (
    <main style={{ minHeight: "100dvh", background: "#0b1310", color: "#e9f1ec", fontFamily: "Manrope, system-ui, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 24px", textAlign: "center" }}>
      <p style={{ fontSize: 46, margin: "0 0 14px" }} aria-hidden="true">⚠️</p>
      <h1 style={{ fontSize: "clamp(22px,4vw,30px)", fontWeight: 800, letterSpacing: -0.7, color: "#fff", margin: "0 0 12px" }}>
        {da ? "Noget gik galt" : "Something went wrong"}
      </h1>
      <p style={{ fontSize: 15, color: "#94a89c", lineHeight: 1.65, maxWidth: 420, margin: "0 0 30px" }}>
        {da
          ? "Prøv at genindlæse siden. Hvis det sker igen, kan du altid ringe til os – vi tager gerne din booking over telefonen."
          : "Try reloading the page. If it happens again you can always call us – we're happy to take your booking over the phone."}
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
        <button onClick={() => reset()} style={{ background: "#37d278", color: "#062313", border: "none", borderRadius: 10, padding: "13px 26px", fontWeight: 700, fontSize: 14.5, cursor: "pointer", fontFamily: "inherit" }}>
          {da ? "Prøv igen" : "Try again"}
        </button>
        <a href="/" style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", borderRadius: 10, padding: "13px 22px", fontWeight: 600, fontSize: 14.5, textDecoration: "none" }}>
          {da ? "Til forsiden" : "Front page"}
        </a>
        <a href="tel:+4524440321" style={{ display: "inline-flex", alignItems: "center", background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.14)", color: "#fff", borderRadius: 10, padding: "13px 22px", fontWeight: 600, fontSize: 14.5, textDecoration: "none" }}>
          +45 24 44 03 21
        </a>
      </div>
    </main>
  );
}
