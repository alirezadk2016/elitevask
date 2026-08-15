"use client";
import { useSyncExternalStore } from "react";

/* Shared site language (da/en), stored where the homepage's own toggle has
 * always kept it: localStorage["lang"]. Until now only the homepage read it —
 * an English visitor who opened any subpage silently fell back to Danish.
 * Subpages subscribe through this hook so one choice follows the visitor
 * around the whole site (and across tabs, via the storage event). */

const listeners = new Set();

function read() {
  try {
    return localStorage.getItem("lang") === "en" ? "en" : "da";
  } catch {
    return "da";
  }
}

function subscribe(cb) {
  listeners.add(cb);
  const onStorage = (e) => { if (!e.key || e.key === "lang") cb(); };
  window.addEventListener("storage", onStorage);
  window.addEventListener("ev-lang", cb);
  return () => {
    listeners.delete(cb);
    window.removeEventListener("storage", onStorage);
    window.removeEventListener("ev-lang", cb);
  };
}

export function useLang() {
  // Server snapshot is "da": Danish is the site's canonical language, so
  // hydration always matches the server-rendered markup. English swaps in on
  // the client immediately after mount.
  return useSyncExternalStore(subscribe, read, () => "da");
}

export function setLang(value) {
  const v = value === "en" ? "en" : "da";
  try { localStorage.setItem("lang", v); } catch {}
  try { window.dispatchEvent(new Event("ev-lang")); } catch {}
}
