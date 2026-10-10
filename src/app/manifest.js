/* Web app manifest. Lets "Add to home screen" use the real name, icon and
   dark theme instead of a screenshot and the page title. */
export default function manifest() {
  return {
    name: "Elite Vask – mobil bil dampvask",
    short_name: "Elite Vask",
    description: "Mobil bil dampvask på Sjælland. Book online – vi kører til dig.",
    start_url: "/",
    display: "standalone",
    background_color: "#0b1310",
    theme_color: "#0b1310",
    lang: "da-DK",
    icons: [
      { src: "/logo-192.png", sizes: "192x192", type: "image/png" },
      { src: "/logo-96.png", sizes: "96x96", type: "image/png" },
    ],
  };
}
