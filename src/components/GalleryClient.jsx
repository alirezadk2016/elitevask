"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { DEFAULT_BEFORE_AFTER, DEFAULT_ALBUM } from "@/lib/galleryData";

/* ─── Interactive BA slider ──────────────────────────────────────────────── */
function BaSlider({ item }) {
  const ref = useRef(null);
  const dragging = useRef(false);
  const [pos, setPos] = useState(50);

  /* reset position when item changes */
  useEffect(() => {
    setPos(50);
    dragging.current = false;
  }, [item.id]);

  const move = useCallback((clientX) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos(Math.max(0, Math.min(100, ((clientX - r.left) / r.width) * 100)));
  }, []);

  useEffect(() => {
    const up = () => { dragging.current = false; };
    const mm = (e) => { if (dragging.current) move(e.clientX); };
    const tm = (e) => { if (dragging.current) { move(e.touches[0].clientX); e.preventDefault(); } };
    window.addEventListener("mousemove", mm);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", tm, { passive: false });
    window.addEventListener("touchend", up);
    return () => {
      window.removeEventListener("mousemove", mm);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", tm);
      window.removeEventListener("touchend", up);
    };
  }, [move]);

  return (
    <div
      className="ba-slider"
      ref={ref}
      onMouseDown={(e) => { dragging.current = true; move(e.clientX); e.preventDefault(); }}
      onTouchStart={(e) => { dragging.current = true; move(e.touches[0].clientX); }}
    >
      <img className="ba-before" src={item.before} alt={`${item.caption} – før`} />
      <img className="ba-after"  src={item.after}  alt={`${item.caption} – efter`}
        style={{ clipPath: `inset(0 0 0 ${pos}%)` }} />
      <span className="ba-lab l" data-i18n="ba_before">Før</span>
      <span className="ba-lab r" data-i18n="ba_after">Efter</span>
      <div className="ba-handle" style={{ left: `${pos}%` }}>
        <div className="ba-knob">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="m15 18-6-6 6-6M9 18l6-6-6-6" />
          </svg>
        </div>
      </div>
    </div>
  );
}

/* ─── Thumbnail card (split preview) ────────────────────────────────────── */
function BaThumb({ item, onClick }) {
  return (
    <button type="button" className="ba-thumb" onClick={onClick} aria-label={`Åbn ${item.caption}`}>
      <div className="ba-thumb-split">
        <img src={item.before} alt={`${item.caption} – før`}   loading="lazy" />
        <img src={item.after}  alt={`${item.caption} – efter`} loading="lazy" />
        <div className="ba-thumb-rule" />
        <span className="ba-thumb-tag l">Før</span>
        <span className="ba-thumb-tag r">Efter</span>
      </div>
      <div className="ba-thumb-hover">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="1.8" strokeLinecap="round">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
        </svg>
        <span>Se sammenligning</span>
      </div>
      {item.caption && <p className="ba-thumb-cap">{item.caption}</p>}
    </button>
  );
}

/* ─── BA lightbox (full-screen slider + nav) ─────────────────────────────── */
function BaLightbox({ items, index, onClose, onPrev, onNext }) {
  const item = items[index];
  const touchStart = useRef(null);
  const touchOnSlider = useRef(false);

  /* keyboard */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape")     onClose();
      if (e.key === "ArrowLeft")  onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose, onPrev, onNext]);

  /* swipe (only outside the slider) */
  const onTouchStart = (e) => {
    touchStart.current = e.touches[0].clientX;
    touchOnSlider.current = !!e.target.closest(".ba-slider");
  };
  const onTouchEnd = (e) => {
    if (touchStart.current === null || touchOnSlider.current) return;
    const dx = touchStart.current - e.changedTouches[0].clientX;
    if (Math.abs(dx) > 55) dx > 0 ? onNext() : onPrev();
    touchStart.current = null;
  };

  /* preload neighbours */
  useEffect(() => {
    [-1, 1].forEach((d) => {
      const it = items[index + d];
      if (!it) return;
      [it.before, it.after].forEach((src) => { new window.Image().src = src; });
    });
  }, [index, items]);

  return (
    <div
      className="ba-lb"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* close */}
      <button className="ba-lb-close" onClick={onClose} aria-label="Luk">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>

      {/* prev */}
      <button className="ba-lb-nav l" onClick={onPrev} aria-label="Forrige"
        style={{ opacity: items.length > 1 ? 1 : 0, pointerEvents: items.length > 1 ? "auto" : "none" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>

      {/* slider + caption */}
      <div className="ba-lb-content" key={`ba-${index}`}>
        <BaSlider key={`ba-slider-${item.id}`} item={item} />
        {item.caption && <p className="ba-lb-cap">{item.caption}</p>}
      </div>

      {/* next */}
      <button className="ba-lb-nav r" onClick={onNext} aria-label="Næste"
        style={{ opacity: items.length > 1 ? 1 : 0, pointerEvents: items.length > 1 ? "auto" : "none" }}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      {/* counter */}
      <div className="ba-lb-counter">{index + 1}&thinsp;/&thinsp;{items.length}</div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────────── */
export default function GalleryClient() {
  const [ba,    setBa]    = useState(DEFAULT_BEFORE_AFTER);
  const [album, setAlbum] = useState(DEFAULT_ALBUM);
  const [lb,    setLb]    = useState(-1);
  const [baLb,  setBaLb]  = useState(-1);

  useEffect(() => {
    fetch("/api/content/beforeafter")
      .then((r) => r.json())
      .then((d) => { if (d.items?.length) setBa([...DEFAULT_BEFORE_AFTER, ...d.items]); })
      .catch(() => {});
    fetch("/api/content/gallery")
      .then((r) => r.json())
      .then((d) => { if (d.items?.length) setAlbum([...DEFAULT_ALBUM, ...d.items]); })
      .catch(() => {});
  }, []);

  const closeBa   = useCallback(() => setBaLb(-1), []);
  const prevBa    = useCallback(() => setBaLb((i) => (i <= 0 ? ba.length - 1 : i - 1)),    [ba.length]);
  const nextBa    = useCallback(() => setBaLb((i) => (i >= ba.length - 1 ? 0 : i + 1)),    [ba.length]);

  const closeAlbum = useCallback(() => setLb(-1), []);
  const prevAlbum  = useCallback(() => setLb((i) => (i <= 0 ? album.length - 1 : i - 1)), [album.length]);
  const nextAlbum  = useCallback(() => setLb((i) => (i >= album.length - 1 ? 0 : i + 1)), [album.length]);

  useEffect(() => {
    if (lb < 0) return;
    const onKey = (e) => {
      if (e.key === "Escape")     closeAlbum();
      if (e.key === "ArrowLeft")  prevAlbum();
      if (e.key === "ArrowRight") nextAlbum();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [lb, closeAlbum, prevAlbum, nextAlbum]);

  return (
    <div className="gal-page">
      <header className="gal-topbar">
        <a href="/" className="gal-back">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
          <span>Forside</span>
        </a>
        <a href="/" className="gal-brand"><span className="gal-brand-mark" />Elite Vask</a>
        <a href="/#vaelg" className="gal-book">Book nu</a>
      </header>

      <section className="gal-hero">
        <div className="eyebrow">Galleri</div>
        <h1 className="gal-hero-title">Vores arbejde — før &amp; efter</h1>
        <p className="gal-hero-sub">Ægte resultater fra professionel mobil bilpleje på Sjælland. Klik på et billede for at åbne sammenligningen i fuld størrelse.</p>
      </section>

      <section className="gal-section" id="foer-efter">
        <div className="gal-section-head">
          <h2 className="sec-title">Før &amp; efter</h2>
          <span className="gal-count">{ba.length}</span>
        </div>
        <div className="ba-grid">
          {ba.map((it, i) => (
            <BaThumb key={it.id} item={it} onClick={() => setBaLb(i)} />
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

      {/* BA lightbox */}
      {baLb >= 0 && ba[baLb] && (
        <BaLightbox items={ba} index={baLb} onClose={closeBa} onPrev={prevBa} onNext={nextBa} />
      )}

      {/* Album lightbox */}
      {lb >= 0 && album[lb] && (
        <div className="gal-lb" onClick={(e) => { if (e.target === e.currentTarget) closeAlbum(); }}>
          <button className="gal-lb-close" onClick={closeAlbum} aria-label="Luk">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <button className="gal-lb-nav l" onClick={prevAlbum} aria-label="Forrige">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
          </button>
          <figure className="gal-lb-fig">
            <img src={album[lb].url} alt={album[lb].caption || "Galleri"} />
            {album[lb].caption ? <figcaption>{album[lb].caption}</figcaption> : null}
          </figure>
          <button className="gal-lb-nav r" onClick={nextAlbum} aria-label="Næste">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
          </button>
        </div>
      )}
    </div>
  );
}
