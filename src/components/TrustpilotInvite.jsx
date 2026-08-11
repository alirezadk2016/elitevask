"use client";
import { useEffect } from "react";
import { useConsent } from "@/lib/useConsent";

// Trustpilot invitation script — loaded only after the visitor accepts
// cookies, and only once.
export default function TrustpilotInvite() {
  const consented = useConsent() === "accepted";

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
