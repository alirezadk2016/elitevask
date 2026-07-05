/* Phase 3 – campaign config: 5 missions on the Ferrari with different paint
   finishes and increasingly stubborn dirt (lower brush efficiency + tighter
   star times). Local best scores + unlock chain in localStorage. */

/* Hard limit for the FULL detailing pipeline (6 stages), then game over. */
export const TIME_LIMIT = 300;

/* The Elite Vask detailing pipeline – played in order, auto-advancing. */
export const STAGES = [
  { id: "forvask",  icon: "💦", type: "wash",   goal: 0.5,   name: { da: "Forvask",       en: "Pre-wash" }, hint: { da: "Spul det værste mudder af", en: "Blast off the heavy mud" } },
  { id: "skum",     icon: "🫧", type: "foam",   goal: 0.86,  name: { da: "Skum",          en: "Foam" },     hint: { da: "Dæk hele bilen i skum", en: "Cover the whole car in foam" } },
  { id: "skyl",     icon: "🚿", type: "rinse",  goal: 0.995, name: { da: "Højtryksskyl",  en: "Rinse" },    hint: { da: "Skyl skum og snavs helt af", en: "Rinse all foam and dirt off" } },
  { id: "faelge",   icon: "🛞", type: "wheels", goal: 0.94,  name: { da: "Fælge",         en: "Rims" },     hint: { da: "Skrub fælge og dæk rene", en: "Scrub rims and tires clean" } },
  { id: "polering", icon: "✨", type: "polish", goal: 0.84,  name: { da: "Polering",      en: "Polish" },   hint: { da: "Polér lakken – hold og bevæg", en: "Buff the paint – hold and move" } },
  { id: "voks",     icon: "🌟", type: "wax",    goal: 0.84,  name: { da: "Voks",          en: "Wax" },      hint: { da: "Læg beskyttende voks på", en: "Apply protective wax" } },
];

export const DISCOUNT_CODE = "GAME10";

export const MISSIONS = [
  { id: 1, name: { da: "Hverdagssnavs",    en: "Daily dirt" },    paint: "#0e4d2c", metal: 0.9,  scrub: 1.0,  time3: 150, time2: 215 },
  { id: 2, name: { da: "Efter regnvejr",   en: "After the rain" }, paint: "#15171c", metal: 0.9,  scrub: 0.82, time3: 165, time2: 230 },
  { id: 3, name: { da: "Grusvej",          en: "Gravel road" },    paint: "#8b95a0", metal: 0.95, scrub: 0.7,  time3: 180, time2: 245 },
  { id: 4, name: { da: "Vinter & vejsalt", en: "Winter salt" },    paint: "#7d1620", metal: 0.9,  scrub: 0.6,  time3: 195, time2: 260 },
  { id: 5, name: { da: "Elite Special",    en: "Elite Special" },  paint: "#b8912f", metal: 1.0,  scrub: 0.54, time3: 210, time2: 275 },
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
  const time3 = Math.round(160 + rnd() * 40);
  return {
    id: "daily", daily: true, date: dateStr,
    name: { da: "Dagens udfordring", en: "Daily challenge" },
    paint: DAILY_PAINTS[(rnd() * DAILY_PAINTS.length) | 0],
    metal: 0.92,
    scrub: 0.55 + rnd() * 0.3,
    time3, time2: time3 + 60,
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
    timeUp: "Tiden er udløbet!", timeUpSub: "Bilen nåede ikke at blive helt ren – prøv igen!",
    wax: "Voks fælgene", waxHint: "Sigt på fælgene og hold for at vokse", waxDone: "Fælg vokset! +250 ✨",
    stage: "TRIN", stageDone: "klaret", discount: "Din belønning: 10% rabat på en rigtig bilvask",
    discountNote: "Nævn koden når du booker", finaleSub: "Forestil dig, hvad Elite Vask kan gøre for din rigtige bil.",
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
    timeUp: "Time's up!", timeUpSub: "The car didn't get fully clean – try again!",
    wax: "Wax the rims", waxHint: "Aim at the rims and hold to wax", waxDone: "Rim waxed! +250 ✨",
    stage: "STAGE", stageDone: "done", discount: "Your reward: 10% off a real car wash",
    discountNote: "Mention the code when you book", finaleSub: "Imagine what Elite Vask can do for your real car.",
  },
};
