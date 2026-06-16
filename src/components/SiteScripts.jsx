"use client";
import { useEffect } from "react";
import { initSite } from "@/lib/siteInit";

export default function SiteScripts() {
  useEffect(() => {
    try { initSite(); } catch (e) { console.error("[siteInit]", e); }
  }, []);
  return null;
}
