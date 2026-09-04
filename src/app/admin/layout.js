/* robots.txt only asks crawlers not to FETCH /admin — a link from anywhere can
   still put the URL in the index with no snippet. The noindex header/meta is
   what actually keeps it out, and it has to live in a layout because the admin
   pages themselves are client components. */
export const metadata = {
  title: "Admin – Elite Vask",
  robots: { index: false, follow: false, nocache: true,
            googleBot: { index: false, follow: false } },
};

export default function AdminLayout({ children }) {
  return children;
}
