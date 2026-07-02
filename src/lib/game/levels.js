/* Level definitions for the Elite Vask car wash game.
   dirt = coverage density 0..1, time3/time2 = star time thresholds (seconds). */
export const LEVELS = [
  { id: 1, key: "sedan",  name: { da: "Sedan",         en: "Sedan" },        paint: "#b9c2cb", dirt: 0.55, time3: 80,  time2: 135 },
  { id: 2, key: "suv",    name: { da: "SUV",           en: "SUV" },          paint: "#33566e", dirt: 0.65, time3: 95,  time2: 155 },
  { id: 3, key: "luxury", name: { da: "Luksusbil",     en: "Luxury car" },   paint: "#121317", dirt: 0.72, time3: 110, time2: 170 },
  { id: 4, key: "sports", name: { da: "Sportsvogn",    en: "Sports car" },   paint: "#8e1f2c", dirt: 0.80, time3: 120, time2: 185 },
  { id: 5, key: "elite",  name: { da: "Elite Special", en: "Elite Special" }, paint: "#b8912f", dirt: 0.88, dirtTint: "goldcar", time3: 135, time2: 205 },
];

/* Body proportions per level (meters). Length along X, width along Z. */
export const BODIES = {
  sedan:  { L: 4.5, W: 1.82, bodyH: 0.60, cabH: 0.50, cabL: 0.50, cabOff: -0.05, wheelR: 0.34, ride: 0.30, wing: false },
  suv:    { L: 4.6, W: 1.90, bodyH: 0.76, cabH: 0.56, cabL: 0.56, cabOff: -0.02, wheelR: 0.40, ride: 0.40, wing: false },
  luxury: { L: 5.05, W: 1.90, bodyH: 0.60, cabH: 0.48, cabL: 0.50, cabOff: -0.09, wheelR: 0.36, ride: 0.29, wing: false },
  sports: { L: 4.4, W: 1.96, bodyH: 0.48, cabH: 0.40, cabL: 0.44, cabOff: -0.12, wheelR: 0.35, ride: 0.24, wing: true },
  elite:  { L: 4.8, W: 1.88, bodyH: 0.62, cabH: 0.50, cabL: 0.52, cabOff: -0.06, wheelR: 0.36, ride: 0.32, wing: false },
};

export const STORAGE_KEY = "ev_game_v1";

export function loadSave() {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (s && typeof s === "object") return { unlocked: s.unlocked || 1, best: s.best || {} };
  } catch {}
  return { unlocked: 1, best: {} };
}

export function storeSave(save) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(save)); } catch {}
}

export function starsFor(level, seconds) {
  if (seconds <= level.time3) return 3;
  if (seconds <= level.time2) return 2;
  return 1;
}

/* Tiny bilingual dictionary for the HUD (site language key: localStorage "lang"). */
export const T = {
  da: {
    title: "Car Wash Game", tagline: "Rens bilen – gør den skinnende!",
    hint_desktop: "Hold musen nede på bilen og bevæg den for at vaske. Træk i baggrunden for at dreje kameraet.",
    hint_mobile: "Hold fingeren på bilen og bevæg den for at vaske. Træk i baggrunden for at dreje.",
    start: "Start vask", locked: "Låst", best: "Bedste", progress: "FREMSKRIDT",
    water: "VAND", time: "TID", score: "POINT", combo: "COMBO",
    finish: "Afslut vask", restart: "Prøv igen", next: "Næste niveau",
    menu: "Niveauer", mute: "Lyd", resetCam: "Nulstil kamera", beforeAfter: "Før / efter",
    complete: "Flot arbejde!", completeSub: "Din rigtige bil fortjener samme behandling.",
    bookCta: "Book din bilvask", goldFound: "Guld-snavs fundet! +500",
    waterLow: "Vandtank genoplader…", chooseCar: "Vælg bil",
    levelDone: "Niveau gennemført", newBest: "Ny rekord!",
    loading: "Indlæser 3D-garage…",
  },
  en: {
    title: "Car Wash Game", tagline: "Clean the car – make it shine!",
    hint_desktop: "Hold the mouse on the car and move it to wash. Drag the background to rotate the camera.",
    hint_mobile: "Hold your finger on the car and move to wash. Drag the background to rotate.",
    start: "Start wash", locked: "Locked", best: "Best", progress: "PROGRESS",
    water: "WATER", time: "TIME", score: "SCORE", combo: "COMBO",
    finish: "Finish wash", restart: "Try again", next: "Next level",
    menu: "Levels", mute: "Sound", resetCam: "Reset camera", beforeAfter: "Before / after",
    complete: "Amazing work!", completeSub: "Your real car deserves the same treatment.",
    bookCta: "Book your car wash", goldFound: "Golden dirt found! +500",
    waterLow: "Water tank recharging…", chooseCar: "Choose car",
    levelDone: "Level complete", newBest: "New best!",
    loading: "Loading 3D garage…",
  },
};
