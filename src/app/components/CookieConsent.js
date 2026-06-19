"use client";
import { useEffect, useState } from "react";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem("cookie_consent", "accepted");
    setVisible(false);
  }

  function decline() {
    localStorage.setItem("cookie_consent", "declined");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie samtykke">
      <div className="cookie-banner-inner">
        <p className="cookie-banner-text">
          Vi bruger cookies til at forbedre din oplevelse.{" "}
          <a href="/cookies" className="cookie-banner-link">Læs mere</a>
        </p>
        <div className="cookie-banner-actions">
          <button className="cookie-btn cookie-btn-accept" onClick={accept}>Acceptér</button>
          <button className="cookie-btn cookie-btn-decline" onClick={decline}>Afvis</button>
        </div>
      </div>
    </div>
  );
}
