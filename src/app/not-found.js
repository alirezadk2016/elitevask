import NotFoundClient from "./NotFoundClient";

/* A server component purely so the 404 can carry its own <title>. The page
   itself is a client component (it reads the visitor's language), and a client
   component cannot export metadata — so every 404 inherited the root layout's
   title and the browser tab read "Elite Vask | Mobil Bil Dampvask på Sjælland",
   exactly as if the page had loaded correctly. Next already sends noindex here,
   so this is about the visitor and about crawl reports, not about ranking.
   No robots field here: Next emits noindex for not-found on its own, and
   adding one produced two <meta name="robots"> tags on the same page. */
export const metadata = {
  title: "Siden findes ikke (404) – Elite Vask",
  description: "Siden her findes ikke længere. Gå tilbage til forsiden og book din mobile dampvask.",
};

export default function NotFound() {
  return <NotFoundClient />;
}
