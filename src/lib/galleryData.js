// Built-in (default) gallery content. Admin-added items (from KV) are merged on top.
// Keep these as the curated baseline so the site always has content even with empty KV.

export const DEFAULT_BEFORE_AFTER = [
  { id: "def-ba-1", before: "/gallery/img01.jpg", after: "/gallery/img02.jpg", caption: "Motorrens · Peugeot" },
  { id: "def-ba-2", before: "/gallery/seat-before.jpg", after: "/gallery/seat-after.jpg", caption: "Sæderens · stofsæder" },
  { id: "def-ba-3", before: "/gallery/interior-before.jpg", after: "/gallery/interior-after.jpg", caption: "Interiør · kabine" },
  { id: "def-ba-4", before: "/gallery/floor-before.jpg", after: "/gallery/floor-after.jpg", caption: "Fodrum · måtter" },
  { id: "def-ba-5", before: "/gallery/roof-before.jpg", after: "/gallery/roof-after.jpg", caption: "Tagkant · algerens" },
];

export const DEFAULT_ALBUM = [
  { id: "def-g-1", url: "/gallery/steam-bmw.jpg", caption: "Dampvask · BMW" },
  { id: "def-g-2", url: "/gallery/steam-hood.jpg", caption: "Motorhjelm · damp" },
  { id: "def-g-3", url: "/gallery/aerial-wash.jpg", caption: "Mobil dampvask · på stedet" },
];

// Homepage shows at most this many before/after sliders; the rest live on /galleri.
export const HOME_BA_LIMIT = 6;
export const HOME_ALBUM_LIMIT = 6;
