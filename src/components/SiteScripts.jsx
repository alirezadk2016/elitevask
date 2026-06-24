"use client";
import { useEffect } from "react";
import { initSite } from "@/lib/siteInit";

export default function SiteScripts() {
  useEffect(() => {
    async function run() {
      let overrides = {};
      try {
        const r = await fetch('/api/site-content');
        if (r.ok) overrides = await r.json();
      } catch {}
      try { initSite(overrides); } catch (e) { console.error("[siteInit]", e); }
    }
    run();
  }, []);
  return null;
}
