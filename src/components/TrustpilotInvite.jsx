"use client";
import { useEffect, useState } from "react";

// Trustpilot invitation script — loaded only after the visitor accepts
// cookies (same consent gate as Google Analytics), and only once.
export default function TrustpilotInvite() {
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const read = () => {
      try { setConsented(localStorage.getItem("cookie_consent") === "accepted"); } catch {}
    };
    read();
    window.addEventListener("cookie-consent-changed", read);
    return () => window.removeEventListener("cookie-consent-changed", read);
  }, []);

  useEffect(() => {
    if (!consented || window.__tpInviteLoaded) return;
    window.__tpInviteLoaded = true;
    window.TrustpilotObject = "tp";
    window.tp = window.tp || function () { (window.tp.q = window.tp.q || []).push(arguments); };
    const s = document.createElement("script");
    s.async = true;
    s.src = "https://invitejs.trustpilot.com/tp.min.js";
    document.head.appendChild(s);
    window.tp("register", "alMjUlvV9s57mEha");
  }, [consented]);

  return null;
}
