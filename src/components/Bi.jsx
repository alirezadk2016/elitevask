"use client";
import { useLang } from "@/lib/useLang";

/* Bilingual block for the long-form pages. The server (and so every search
 * engine) always renders the Danish version — Danish is the canonical
 * language and the URLs are Danish. A visitor who picked English sees the
 * English version right after hydration, instead of a "Danish only" notice. */
export default function Bi({ da, en }) {
  return useLang() === "en" ? en : da;
}
