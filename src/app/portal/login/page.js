"use client";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { useLang } from "@/lib/useLang";

export const dynamic = 'force-dynamic';

function LoginContent() {
  const params = useSearchParams();
  const en = useLang() === "en";
  const T = (da, eng) => (en ? eng : da);
  const error = params.get("error");
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | sent | error
  // Message for a ?error= in the URL is derived, not state — computing it
  // during render avoids an effect and the extra render it caused.
  const urlErrMsg =
    error === "expired" ? T("Loginlinket er udløbet eller allerede brugt. Anmod om et nyt.", "The login link has expired or was already used. Request a new one.")
    : error === "invalid" ? T("Ugyldigt loginlink.", "Invalid login link.")
    : error === "unavailable" ? T("Tjenesten er midlertidigt utilgængelig. Prøv igen.", "The service is temporarily unavailable. Please try again.")
    : "";
  const [submitErr, setSubmitErr] = useState("");
  const errMsg = submitErr || urlErrMsg;

  async function handleSubmit(e) {
    e.preventDefault();
    setState("loading");
    setSubmitErr("");
    try {
      const r = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json();
      if (!r.ok) {
        setSubmitErr((en ? "" : data.message) || T("Noget gik galt. Prøv igen.", "Something went wrong. Please try again."));
        setState("error");
        return;
      }
      setState("sent");
    } catch {
      setSubmitErr(T("Netværksfejl. Tjek din forbindelse og prøv igen.", "Network error. Check your connection and try again."));
      setState("error");
    }
  }

  return (
    <div className="portal-auth-page">
      <div className="portal-auth-card">
        <Link href="/" className="portal-auth-logo">
          <span className="portal-auth-logo-mark" style={{ background: "none", padding: 0, overflow: "hidden" }}><img src="/logo-96.webp" width="36" height="36" alt="" style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover", display: "block" }} /></span>
          <span className="portal-auth-logo-text">Elite Vask</span>
        </Link>

        {state === "sent" ? (
          <div className="portal-sent">
            <div className="portal-sent-icon">📧</div>
            <h1>{T("Tjek din e-mail", "Check your e-mail")}</h1>
            <p>{T("Vi har sendt et loginlink til", "We have sent a login link to")} <strong>{email}</strong>.<br />{T("Linket er gyldigt i 15 minutter.", "The link is valid for 15 minutes.")}</p>
            <p className="portal-sent-hint">{T("Kan du ikke finde mailen? Tjek din spam-mappe.", "Can't find the e-mail? Check your spam folder.")}</p>
            <button className="portal-btn-ghost" onClick={() => { setState("idle"); setEmail(""); }}>
              {T("Brug anden e-mail", "Use another e-mail")}
            </button>
          </div>
        ) : (
          <>
            <div className="portal-auth-header">
              <h1>{T("Log ind", "Log in")}</h1>
              <p>{T("Indtast din e-mail og vi sender dig et sikkert loginlink. Ingen adgangskode nødvendig.", "Enter your e-mail and we will send you a secure login link. No password needed.")}</p>
            </div>

            {errMsg && (
              <div className="portal-error-box">{errMsg}</div>
            )}

            <form onSubmit={handleSubmit} className="portal-auth-form">
              <div className="portal-field">
                <label htmlFor="email">{T("E-mailadresse", "E-mail address")}</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={T("din@email.dk", "you@email.com")}
                  required
                  autoFocus
                  disabled={state === "loading"}
                />
              </div>
              <button type="submit" className="portal-btn-primary" disabled={state === "loading" || !email}>
                {state === "loading" ? T("Sender…", "Sending…") : T("Send loginlink →", "Send login link →")}
              </button>
            </form>

            <p className="portal-auth-footer">
              <Link href="/">{T("← Tilbage til forsiden", "← Back to home")}</Link>
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
