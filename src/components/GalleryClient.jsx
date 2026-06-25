"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { DEFAULT_BEFORE_AFTER, DEFAULT_ALBUM } from "@/lib/galleryData";

function Compare({ before, after, caption }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);
  const move = useCallback((clientX) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let p = ((clientX - r.left) / r.width) * 100;
    p = Math.max(0, Math.min(100, p));
    setPos(p);
  }, []);
  useEffect(() => {
    const up = () => { dragging.current = false; };
    const mm = (e) => { if (dragging.current) move(e.clientX); };
    const tm = (e) => { if (dragging.current) move(e.touches[0].clientX); };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", tm, { passive: true });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", up);
    };
  }, [move]);
  return (
    <figure className="ba-card">
      <div
        className="ba-slider"
        ref={ref}
        onMouseDown={(e) => { dragging.current = true; move(e.clientX); e.preventDefault(); }}
        onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX); }}
      >
        <img className="ba-before" src={before} alt={`${caption} – før`} loading="lazy" />
        <img className="ba-after" src={after} alt={`${caption} – efter`} loading="lazy" style={{ clipPath: `inset(0 0 0 ${pos}%)` }} />
        <span className="ba-lab l">Før</span>
        <span className="ba-lab r">Efter</span>
        <div className="ba-handle" style={{ left: `${pos}%` }}>
          <div className="ba-knob">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6M9 18l6-6-6-6" /></svg>
          </div>
        </div>
      </div>
      <figcaption>{caption}</figcaption>
    </figure>
  );
}

export default function GalleryClient() {
  const [ba, setBa] = useState(DEFAULT_BEFORE_AFTER);
  const [album, setAlbum] = useState(DEFAULT_ALBUM);
  const [lb, setLb] = useState(-1);

  useEffect(() => {
    fetch("/api/content/beforeafter").then((r) => r.json()).then((d) => {
      if (d.items && d.items.length) setBa([...DEFAULT_BEFORE_AFTER, ...d.items]);
    }).catch(() => {});
    fetch("/api/content/gallery").then((r) => r.json()).then((d) => {
      if (d.items && d.items.length) setAlbum([...DEFAULT_ALBUM, ...d.items]);
    }).catch(() => {});
  }, []);

  const close = useCallback(() => setLb(-1), []);
  const prev = useCallback(() => setLb((i) => (i <= 0 ? album.length - 1 : i - 1)), [album.length]);
  const next = useCallback(() => setLb((i) => (i >= album.length - 1 ? 0 : i + 1)), [album.length]);
  useEffect(() => {
    if (lb < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lb, close, prev, next]);

  return (
    <div className="gal-page">
      <header className="gal-topbar">
        <a href="/" className="gal-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          <span>Forside</span>
        </a>
        <a href="/" className="gal-brand"><span className="gal-brand-mark" />Elite Vask</a>
        <a href="/#vaelg" className="gal-book">Book nu</a>
      </header>

      <section className="gal-hero">
        <div className="eyebrow">Galleri</div>
        <h1 className="gal-hero-title">Vores arbejde — før &amp; efter</h1>
        <p className="gal-hero-sub">Ægte resultater fra professionel mobil bilpleje på Sjælland. Træk i slideren og se forskellen, eller udforsk hele galleriet.</p>
      </section>

      <section className="gal-section" id="foer-efter">
        <div className="gal-section-head">
          <h2 className="sec-title">Før &amp; efter</h2>
          <span className="gal-count">{ba.length}</span>
        </div>
        <div className="ba-gallery">
          {ba.map((it) => (
            <Compare key={it.id} before={it.before} after={it.after} caption={it.caption || ""} />
          ))}
        </div>
      </section>

      <section className="gal-section" id="galleri">
        <div className="gal-section-head">
          <h2 className="sec-title">Galleri</h2>
          <span className="gal-count">{album.length}</span>
        </div>
        <div className="gallery">
          {album.map((it, i) => (
            <figure key={it.id} className="gitem" onClick={() => setLb(i)}>
              <img src={it.url} alt={it.caption || "Galleri"} loading="lazy" />
              {it.caption ? <figcaption>{it.caption}</figcaption> : null}
            </figure>
          ))}
        </div>
      </section>

      <div className="gal-foot-cta">
        <a href="/#vaelg" className="btn btn-green btn-lg">Find pris &amp; book din vask</a>
      </div>

      {lb >= 0 && album[lb] && (
        <div className="gal-lb open" onClick={(e) => { if (e.target === e.currentTarget) close(); }}>
          <button className="gal-lb-close" onClick={close} aria-label="Luk"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12" /></svg></button>
          <button className="gal-lb-nav l" onClick={prev} aria-label="Forrige"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg></button>
          <figure className="gal-lb-fig">
            <img src={album[lb].url} alt={album[lb].caption || "Galleri"} />
            {album[lb].caption ? <figcaption>{album[lb].caption}</figcaption> : null}
          </figure>
          <button className="gal-lb-nav r" onClick={next} aria-label="Næste"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg></button>
        </div>
      )}
    </div>
  );
}
