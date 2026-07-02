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
    if (s && typeof s === "object") {
      return { unlocked: s.unlocked || 1, best: s.best || {}, ach: s.ach || [], daily: s.daily || null };
    }
  } catch {}
  return { unlocked: 1, best: {}, ach: [], daily: null };
}

/* ---- achievements ---- */
export const ACH = [
  { id: "first",   icon: "🫧", name: { da: "Første vask",   en: "First wash" },     desc: { da: "Gennemfør din første mission", en: "Complete your first mission" } },
  { id: "perfect", icon: "✨", name: { da: "Perfektionist", en: "Perfectionist" },  desc: { da: "Afslut med 100% ren bil", en: "Finish with the car 100% clean" } },
  { id: "gold",    icon: "🏅", name: { da: "Guldjæger",     en: "Gold hunter" },    desc: { da: "Find alt guld-snavs i én mission", en: "Find all golden dirt in one mission" } },
  { id: "combo",   icon: "⚡", name: { da: "Kombo-konge",   en: "Combo king" },     desc: { da: "Nå ×5 combo", en: "Reach a ×5 combo" } },
  { id: "fast",    icon: "⏱", name: { da: "Lynhurtig",     en: "Lightning fast" }, desc: { da: "Få 3 stjerner i en mission", en: "Earn 3 stars in a mission" } },
  { id: "elite",   icon: "👑", name: { da: "Elite-mester",  en: "Elite master" },   desc: { da: "Gennemfør Elite Special", en: "Complete Elite Special" } },
];

/* ---- daily challenge (deterministic per local date) ---- */
const DAILY_PAINTS = ["#4b2a78", "#0d5c66", "#7a2f5e", "#274e13", "#6e4a10", "#22303c", "#5c1f2f"];

export function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function hash(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function dailyMission(dateStr) {
  let a = hash(dateStr);
  const rnd = () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const time3 = Math.round(85 + rnd() * 40);
  return {
    id: "daily", daily: true, date: dateStr,
    name: { da: "Dagens udfordring", en: "Daily challenge" },
    paint: DAILY_PAINTS[(rnd() * DAILY_PAINTS.length) | 0],
    metal: 0.92,
    scrub: 0.5 + rnd() * 0.3,
    time3, time2: time3 + 55,
    golds: 4,
  };
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
    daily: "Dagens udfordring", dailyNew: "Ny udfordring om", achievements: "Præstationer",
    photo: "Foto", download: "Gem billede", share: "Del", close: "Luk", achPrefix: "Præstation",
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
    daily: "Daily challenge", dailyNew: "New challenge in", achievements: "Achievements",
    photo: "Photo", download: "Save image", share: "Share", close: "Close", achPrefix: "Achievement",
  },
};
