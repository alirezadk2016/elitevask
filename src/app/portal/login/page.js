"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginContent() {
  const params = useSearchParams();
  const errorParam = params.get("error");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle");
  const [errMsg, setErrMsg] = useState("");

  useEffect(() => {
    if (errorParam === "expired") setErrMsg("Loginlinket er udløbet eller allerede brugt. Anmod om et nyt nedenfor.");
    else if (errorParam === "invalid") setErrMsg("Ugyldigt loginlink. Prøv at anmode om et nyt.");
    else if (errorParam === "unavailable") setErrMsg("Tjenesten er midlertidigt utilgængelig. Prøv igen om lidt.");
  }, [errorParam]);

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    setErrMsg("");
    try {
      const r = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json();
      if (!r.ok) { setErrMsg(data.message || "Noget gik galt. Prøv igen."); setState("error"); return; }
      setState("sent");
    } catch {
      setErrMsg("Netværksfejl. Tjek din forbindelse og prøv igen.");
      setState("error");
    }
  }

  return (
    <div className="portal-auth-page">
      <div className="portal-auth-card">
        <a href="/" className="portal-auth-logo">
          <span className="portal-auth-logo-mark">EV</span>
          <span className="portal-auth-logo-text">Elite Vask</span>
        </a>

        {state === "sent" ? (
          <div className="portal-sent">
            <div className="portal-sent-icon">📧</div>
            <h1>Tjek din e-mail</h1>
            <p>Vi har sendt et loginlink til <strong>{email}</strong>.<br />Linket er gyldigt i 15 minutter og kan kun bruges én gang.</p>
            <p className="portal-sent-hint">Kan du ikke finde mailen? Tjek din spam-mappe.</p>
            <button className="portal-btn-ghost" onClick={() => { setState("idle"); setEmail(""); setErrMsg(""); }}>
              Brug anden e-mail
            </button>
          </div>
        ) : (
          <>
            <div className="portal-auth-header">
              <h1>Log ind</h1>
              <p>Ingen adgangskode. Indtast din e-mail og vi sender dig et sikkert link.</p>
            </div>

            {errMsg && <div className="portal-error-box">{errMsg}</div>}

            <form onSubmit={handleSubmit} className="portal-auth-form">
              <div className="portal-field">
                <label htmlFor="portal-email">E-mailadresse</label>
                <input
                  id="portal-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="din@email.dk"
                  required
                  autoFocus
                  disabled={state === "loading"}
                />
              </div>
              <button type="submit" className="portal-btn-primary" disabled={state === "loading" || !email}>
                {state === "loading" ? "Sender…" : "Send loginlink →"}
              </button>
            </form>

            <p className="portal-auth-footer">
              <a href="/">← Tilbage til forsiden</a>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="portal-auth-page"><div className="portal-auth-card"><p style={{color:"#94a89c"}}>Indlæser…</p></div></div>}>
      <LoginContent />
    </Suspense>
  );
}
