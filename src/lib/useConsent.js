"use client";
import { useSyncExternalStore } from "react";

// Single source of truth for the cookie choice, read with useSyncExternalStore
// (the React 18+ way to subscribe to an external store). This replaces the
// old "read localStorage inside useEffect and setState" pattern in three
// components — that fired an extra render on every mount and let the three
// consumers drift out of sync.
//
// Value: "accepted" | "declined" | null (no choice made yet).

const KEY = "cookie_consent";
const EVENT = "cookie-consent-changed";

function subscribe(onChange) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange); // another tab changed it
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function getSnapshot() {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

// The server has no localStorage; render as "no choice yet" and let the
// client correct it on hydration.
function getServerSnapshot() {
  return null;
}

export function useConsent() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Persist a choice and notify every consumer in this tab.
export function setConsent(value) {
  try {
    localStorage.setItem(KEY, value);
  } catch {}
  try {
    window.dispatchEvent(new Event(EVENT));
  } catch {}
}
