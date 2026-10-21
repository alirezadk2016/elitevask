"use client";
import { useEffect } from "react";
import { applySettings, DEFAULT_SETTINGS } from "@/lib/settings";

/* Site-wide display swap of the company contact details.
 *
 * Much of the markup (legacy HTML strings, the chat answers, legal text) was
 * written with the original phone/e-mail hard-coded. When the manager changes
 * them under admin → Indstillinger, this replaces those literal values in the
 * rendered page — text, href, title, aria-label — including anything rendered
 * later (chat replies, booking-form messages). Display only: no request or
 * form value is touched. With the default settings it returns immediately. */
const ATTRS = ["href", "title", "aria-label"];

export default function SettingsSync({ settings }) {
  useEffect(() => {
    const S = settings, D = DEFAULT_SETTINGS;
    if (!S || (S.phone === D.phone && S.email === D.email && S.instagram === D.instagram && S.facebook === D.facebook)) return;
    const fixEl = (el) => ATTRS.forEach((a) => {
      const v = el.getAttribute && el.getAttribute(a);
      if (v) { const n = applySettings(v, S); if (n !== v) el.setAttribute(a, n); }
    });
    const fixText = (t) => { const n = applySettings(t.nodeValue, S); if (n !== t.nodeValue) t.nodeValue = n; };
    const fix = (node) => {
      try {
        if (node.nodeType === 3) return fixText(node);
        if (node.nodeType !== 1 || node.closest?.("input,textarea,select,[contenteditable]")) return;
        fixEl(node);
        const w = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
        let c;
        while ((c = w.nextNode())) {
          if (c.nodeType === 3) { if (!c.parentElement?.closest("input,textarea,select,script,style")) fixText(c); }
          else fixEl(c);
        }
      } catch {}
    };
    fix(document.body);
    const mo = new MutationObserver((ms) => ms.forEach((m) => {
      if (m.type === "characterData") fix(m.target); else m.addedNodes.forEach(fix);
    }));
    mo.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => mo.disconnect();
  }, [settings]);
  return null;
}
