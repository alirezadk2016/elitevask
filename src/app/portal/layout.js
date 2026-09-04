/* Customer portal: private by definition. Kept out of the index for the same
   reason as /admin — a disallow in robots.txt is not a deindex. */
export const metadata = {
  title: "Min side – Elite Vask",
  robots: { index: false, follow: false, nocache: true,
            googleBot: { index: false, follow: false } },
  /* /portal/verify carries the single-use login token in its query string, so
     the Referer must never cross origins. "same-origin" and not
     "no-referrer": no-referrer serializes Origin as "null" on the page's own
     POST to /api/auth/verify, which that route's same-origin check rejects —
     login would stop working. (/portal/verify sets the same value itself; this
     covers the rest of the portal too.) */
  referrer: "same-origin",
};

export default function PortalLayout({ children }) {
  return children;
}
