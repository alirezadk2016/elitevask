/* Procedural WebAudio for the game – no audio files needed.
   Everything is synthesized: pressure-washer hiss, chimes, ticks. */

let ctx = null;
let master = null;
let sprayGain = null;
let sprayFilter = null;
let sprayLp = null;
let muted = false;

function ensureCtx() {
  if (ctx) return ctx;
  const AC = window.AudioContext || window.webkitAudioContext;
  if (!AC) return null;
  ctx = new AC();
  master = ctx.createGain();
  master.gain.value = muted ? 0 : 0.9;
  master.connect(ctx.destination);

  // Looping white-noise source shaped into a pressure-washer hiss
  const len = ctx.sampleRate * 2;
  const buf = ctx.createBuffer(1, len, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
  const src = ctx.createBufferSource();
  src.buffer = buf; src.loop = true;
  sprayFilter = ctx.createBiquadFilter();
  sprayFilter.type = "bandpass"; sprayFilter.frequency.value = 1600; sprayFilter.Q.value = 0.7;
  sprayLp = ctx.createBiquadFilter();
  sprayLp.type = "lowpass"; sprayLp.frequency.value = 2400;
  sprayGain = ctx.createGain(); sprayGain.gain.value = 0;
  src.connect(sprayFilter); sprayFilter.connect(sprayLp); sprayLp.connect(sprayGain); sprayGain.connect(master);
  src.start();

  // quiet garage ambience: low hum + air rumble
  const hum = ctx.createOscillator();
  hum.type = "sine"; hum.frequency.value = 55;
  const humGain = ctx.createGain(); humGain.gain.value = 0.012;
  hum.connect(humGain); humGain.connect(master);
  hum.start();
  const airSrc = ctx.createBufferSource();
  airSrc.buffer = buf; airSrc.loop = true; airSrc.playbackRate.value = 0.5;
  const airLp = ctx.createBiquadFilter();
  airLp.type = "lowpass"; airLp.frequency.value = 220;
  const airGain = ctx.createGain(); airGain.gain.value = 0.03;
  airSrc.connect(airLp); airLp.connect(airGain); airGain.connect(master);
  airSrc.start();
  return ctx;
}

export function initAudio() { const c = ensureCtx(); if (c && c.state === "suspended") c.resume(); }

export function setMuted(m) {
  muted = m;
  if (master && ctx) master.gain.setTargetAtTime(m ? 0 : 0.9, ctx.currentTime, 0.05);
}

export function setSpray(on, dist = 2) {
  if (!ctx || !sprayGain) return;
  const t = ctx.currentTime;
  sprayGain.gain.setTargetAtTime(on ? 0.16 : 0, t, on ? 0.04 : 0.12);
  if (on) {
    const norm = Math.min(1, Math.max(0, (dist - 1) / 6));
    sprayLp.frequency.setTargetAtTime(2600 - norm * 1400, t, 0.1);
  }
}

function tone(freq, t0, dur, type = "sine", vol = 0.2, dest = null) {
  if (!ctx) return;
  const o = ctx.createOscillator(); const g = ctx.createGain();
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(dest || master);
  o.start(t0); o.stop(t0 + dur + 0.05);
}

export function sndClick() { ensureCtx(); if (!ctx) return; tone(660, ctx.currentTime, 0.07, "triangle", 0.12); }

export function sndGold() {
  ensureCtx(); if (!ctx) return;
  const t = ctx.currentTime;
  tone(880, t, 0.18, "sine", 0.18); tone(1320, t + 0.09, 0.22, "sine", 0.16);
}

export function sndStar(i) {
  ensureCtx(); if (!ctx) return;
  tone(620 + i * 180, ctx.currentTime, 0.3, "triangle", 0.2);
}

export function sndCombo(level) {
  ensureCtx(); if (!ctx) return;
  const t = ctx.currentTime;
  tone(440 + level * 110, t, 0.09, "square", 0.07);
  tone(660 + level * 110, t + 0.06, 0.12, "square", 0.06);
}

export function sndFail() {
  ensureCtx(); if (!ctx) return;
  const t = ctx.currentTime;
  tone(392, t, 0.35, "triangle", 0.2);
  tone(311, t + 0.28, 0.5, "triangle", 0.2);
  tone(233, t + 0.6, 0.8, "triangle", 0.18);
}

export function sndComplete() {
  ensureCtx(); if (!ctx) return;
  const t = ctx.currentTime;
  [523, 659, 784, 1046].forEach((f, i) => tone(f, t + i * 0.12, 0.5, "triangle", 0.2));
  tone(1568, t + 0.5, 0.8, "sine", 0.12);
}
