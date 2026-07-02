/* Phase 3 – campaign config: 5 missions on the Ferrari with different paint
   finishes and increasingly stubborn dirt (lower brush efficiency + tighter
   star times). Local best scores + unlock chain in localStorage. */

export const MISSIONS = [
  { id: 1, name: { da: "Hverdagssnavs",    en: "Daily dirt" },    paint: "#0e4d2c", metal: 0.9,  scrub: 1.0,  time3: 75,  time2: 125 },
  { id: 2, name: { da: "Efter regnvejr",   en: "After the rain" }, paint: "#15171c", metal: 0.9,  scrub: 0.78, time3: 90,  time2: 145 },
  { id: 3, name: { da: "Grusvej",          en: "Gravel road" },    paint: "#8b95a0", metal: 0.95, scrub: 0.62, time3: 105, time2: 165 },
  { id: 4, name: { da: "Vinter & vejsalt", en: "Winter salt" },    paint: "#7d1620", metal: 0.9,  scrub: 0.52, time3: 120, time2: 185 },
  { id: 5, name: { da: "Elite Special",    en: "Elite Special" },  paint: "#b8912f", metal: 1.0,  scrub: 0.45, time3: 135, time2: 210 },
];

export const SAVE_KEY = "ev_game_v2";

export function loadSave() {
  try {
    const s = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    if (s && typeof s === "object") return { unlocked: s.unlocked || 1, best: s.best || {} };
  } catch {}
  return { unlocked: 1, best: {} };
}

export function storeSave(save) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(save)); } catch {}
}

export function starsFor(mission, seconds) {
  if (seconds <= mission.time3) return 3;
  if (seconds <= mission.time2) return 2;
  return 1;
}

export const T3 = {
  da: {
    title: "Car Wash Game", tagline: "Vælg mission – og gør bilen skinnende ren!",
    start: "Start", locked: "Låst", newTag: "NY", best: "Bedste",
    clean: "REN", water: "VAND", time: "TID", score: "POINT", combo: "COMBO", mission: "MISSION",
    finish: "Afslut vask", again: "Vask igen", next: "Næste mission", menu: "Missioner",
    resetCam: "Nulstil kamera", beforeAfter: "Før / efter (hold)", sound: "Lyd",
    done: "Skinnende ren!", doneSub: "Din rigtige bil fortjener samme behandling.",
    book: "Book din bilvask", timeBonus: "Tidsbonus", newBest: "Ny rekord!",
    gold: "Guld-snavs fundet! +500", waterLow: "Vandtank genoplader…",
    hintDesktop: "Hold musen nede på bilen og bevæg den for at vaske · Træk i baggrunden for at dreje",
    hintMobile: "Hold fingeren på bilen og bevæg den for at vaske · Træk i baggrunden for at dreje",
  },
  en: {
    title: "Car Wash Game", tagline: "Pick a mission – and make the car shine!",
    start: "Start", locked: "Locked", newTag: "NEW", best: "Best",
    clean: "CLEAN", water: "WATER", time: "TIME", score: "SCORE", combo: "COMBO", mission: "MISSION",
    finish: "Finish wash", again: "Wash again", next: "Next mission", menu: "Missions",
    resetCam: "Reset camera", beforeAfter: "Before / after (hold)", sound: "Sound",
    done: "Sparkling clean!", doneSub: "Your real car deserves the same treatment.",
    book: "Book your car wash", timeBonus: "Time bonus", newBest: "New best!",
    gold: "Golden dirt found! +500", waterLow: "Water tank recharging…",
    hintDesktop: "Hold the mouse on the car and move it to wash · Drag the background to rotate",
    hintMobile: "Hold your finger on the car and move to wash · Drag the background to rotate",
  },
};
