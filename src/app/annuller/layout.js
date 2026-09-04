/* Cancellation links carry a one-time booking token in the query string. The
   page must never be indexed — an indexed URL would leak the token into search
   results and into any referrer that follows it. */
export const metadata = {
  title: "Annuller booking – Elite Vask",
  robots: { index: false, follow: false, nocache: true,
            googleBot: { index: false, follow: false } },
  /* "same-origin", NOT "no-referrer": the page POSTs the token to
     /api/cancel, and no-referrer serializes the Origin header as "null",
     which that route's same-origin check rejects — it would break customer
     cancellation outright. same-origin already stops the token reaching any
     other origin, which is the whole point here. */
  referrer: "same-origin",
};

export default function CancelLayout({ children }) {
  return children;
}
