"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

// Interstitial login confirmation. The email link lands here (plain GET, no
// side effects), and the single-use token is only consumed on the explicit
// button click below (POST). This stops corporate email scanners that
// prefetch links from burning the token before the customer clicks.
function VerifyContent() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [state, setState] = useState("idle"); // idle | loading | error
  const [errMsg, setErrMsg] = useState("");

  const valid = /^[a-f0-9]{64}$/.test(token);

  async function confirm() {
    setState("loading");
    setErrMsg("");
    try {
      const r = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (r.ok) { router.replace("/portal"); return; }
      const data = await r.json().catch(() => ({}));
      setState("error");
      setErrMsg(
        data.error === "expired"
          ? "Loginlinket er udløbet eller allerede brugt. Anmod om et nyt fra login-siden."
          : data.error === "unavailable"
            ? "Tjenesten er midlertidigt utilgængelig. Prøv igen om lidt."
            : "Ugyldigt loginlink. Anmod om et nyt fra login-siden."
      );
    } catch {
      setState("error");
      setErrMsg("Netværksfejl. Tjek din forbindelse og prøv igen.");
    }
  }

  return (
    <div className="portal-auth-page">
      <div className="portal-auth-card">
        <a href="/" className="portal-auth-logo">
          <span className="portal-auth-logo-mark">EV</span>
          <span className="portal-auth-logo-text">Elite Vask</span>
        </a>
        <h1 style={{ fontSize: 20, margin: "18px 0 8px" }}>Log ind på kundeportalen</h1>

        {!valid ? (
          <>
            <p style={{ opacity: 0.75, fontSize: 14, lineHeight: 1.6 }}>
              Ugyldigt loginlink. Anmod om et nyt fra login-siden.
            </p>
            <a href="/portal/login" className="btn btn-green" style={{ display: "inline-block", marginTop: 14 }}>
              Til login
            </a>
          </>
        ) : (
          <>
            <p style={{ opacity: 0.75, fontSize: 14, lineHeight: 1.6 }}>
              Klik på knappen for at fuldføre login. Linket kan kun bruges én gang.
            </p>
            <button
              onClick={confirm}
              disabled={state === "loading"}
              className="btn btn-green"
              style={{ width: "100%", marginTop: 14, padding: "12px 0", fontSize: 15, fontWeight: 700, cursor: state === "loading" ? "default" : "pointer" }}
            >
              {state === "loading" ? "Logger ind…" : "Fortsæt til portalen"}
            </button>
            {state === "error" && (
              <>
                <p style={{ color: "#f87171", fontSize: 13, marginTop: 12, lineHeight: 1.5 }}>{errMsg}</p>
                <a href="/portal/login" style={{ fontSize: 13, display: "inline-block", marginTop: 6 }}>Anmod om nyt link →</a>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="portal-auth-page"><div className="portal-auth-card"><p>Indlæser…</p></div></div>}>
      <VerifyContent />
    </Suspense>
  );
}
