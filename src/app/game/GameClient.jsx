"use client";
import dynamic from "next/dynamic";

const CarWashGame = dynamic(() => import("@/components/game/CarWashGame"), {
  ssr: false,
  loading: () => (
    <div className="gp-loading">
      <span className="gp-spinner" aria-hidden="true" />
      Indlæser 3D-garage…
    </div>
  ),
});

export default function GameClient() {
  return (
    <div className="gp-root">
      <header className="gp-bar">
        <a href="/" className="gp-back" aria-label="Tilbage til forsiden">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          <span className="gp-bar-logo">ELITE <em>VASK</em></span>
        </a>
        <span className="gp-bar-title">Car Wash Game</span>
        <a href="/#vaelg" className="btn btn-green gp-bar-book">Book nu</a>
      </header>
      <div className="gp-stage">
        <CarWashGame />
      </div>
    </div>
  );
}
