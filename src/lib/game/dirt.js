/* Real cleaning system.
   Each cleanable panel owns:
   - a dirt COLOR canvas (what the grime looks like)
   - a MASK canvas used as alphaMap (white = dirt visible, black = cleaned)
   Spraying paints soft black blobs into the mask exactly where the water
   ray hits (via the intersection UV), so the player can clean every
   centimeter for real. Progress is measured by sampling the masks weighted
   by how much dirt each pixel actually had. */

import * as THREE from "three";

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const MUD = ["#6b5a44", "#75634b", "#5c4d3a", "#7d6c55"];
const DUST = ["#8a877e", "#96938a", "#7e7b72"];
const SALT = ["#cdd0cc", "#dadcd8"];

function drawDirt(cv, kind, density, rng, gold) {
  const g = cv.getContext("2d");
  const W = cv.width, H = cv.height;
  g.clearRect(0, 0, W, H);

  // base film so every sprayed line reveals contrast
  g.fillStyle = kind === "glass" ? "rgba(140,142,136,0.42)" : "rgba(112,98,78,0.34)";
  g.fillRect(0, 0, W, H);

  const blotches = Math.round(26 * density * (kind === "tire" ? 1.6 : 1));
  for (let i = 0; i < blotches; i++) {
    const x = rng() * W, y = rng() * H;
    const r = (0.04 + rng() * 0.16) * W;
    const col = kind === "glass"
      ? DUST[(rng() * DUST.length) | 0]
      : (rng() < 0.72 ? MUD : DUST)[(rng() * 4) | 0] || MUD[0];
    const grad = g.createRadialGradient(x, y, 0, x, y, r);
    const a = 0.35 + rng() * 0.45;
    grad.addColorStop(0, hexA(col, a));
    grad.addColorStop(1, hexA(col, 0));
    g.fillStyle = grad;
    g.beginPath(); g.ellipse(x, y, r, r * (0.5 + rng() * 0.8), rng() * Math.PI, 0, Math.PI * 2); g.fill();
  }

  // road-salt streaks running down vertical panels
  if (kind === "side" || kind === "fascia") {
    const streaks = Math.round(14 * density);
    for (let i = 0; i < streaks; i++) {
      const x = rng() * W, y0 = H * (0.15 + rng() * 0.3);
      const len = H * (0.25 + rng() * 0.5), w = 2 + rng() * 5;
      const grad = g.createLinearGradient(x, y0, x, y0 + len);
      grad.addColorStop(0, hexA(SALT[i % 2], 0.5));
      grad.addColorStop(1, hexA(SALT[i % 2], 0));
      g.fillStyle = grad;
      g.fillRect(x - w / 2, y0, w, len);
    }
  }

  // speckles
  const specks = Math.round(W * 1.4 * density);
  for (let i = 0; i < specks; i++) {
    g.fillStyle = hexA(MUD[(rng() * MUD.length) | 0], 0.25 + rng() * 0.5);
    const s = 1 + rng() * 2.6;
    g.fillRect(rng() * W, rng() * H, s, s);
  }

  if (kind === "tire") {
    g.fillStyle = "rgba(92,77,58,0.5)";
    g.fillRect(0, 0, W, H * 0.5); // heavy arch grime
  }

  // hidden golden dirt spot
  if (gold) {
    const x = gold.u * W, y = (1 - gold.v) * H, r = gold.rPx;
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, "rgba(236,196,92,0.98)");
    gr.addColorStop(0.55, "rgba(212,175,55,0.9)");
    gr.addColorStop(1, "rgba(212,175,55,0)");
    g.fillStyle = gr;
    g.beginPath(); g.arc(x, y, r, 0, Math.PI * 2); g.fill();
    g.fillStyle = "rgba(255,240,200,0.9)";
    for (let i = 0; i < 5; i++) {
      const a = rng() * Math.PI * 2, rr = rng() * r * 0.5;
      g.fillRect(x + Math.cos(a) * rr, y + Math.sin(a) * rr, 2, 2);
    }
  }
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
}

export class DirtSystem {
  /* panels: [{ key, kind, uDim, vDim, area }] */
  constructor(panels, level, seed = 1) {
    this.rng = mulberry32(seed + level.id * 7919);
    this.level = level;
    this.panels = new Map();
    this.goldSpots = [];
    this.whiteTex = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    this.whiteTex.needsUpdate = true;
    this._smp = document.createElement("canvas");
    this._smp.width = 48; this._smp.height = 48;
    this._smpCtx = this._smp.getContext("2d", { willReadFrequently: true });

    // choose 3 gold spots on paint panels
    const paintKeys = panels.filter((p) => p.kind === "side" || p.kind === "top").map((p) => p.key);
    const chosen = new Set();
    while (chosen.size < Math.min(3, paintKeys.length)) {
      chosen.add(paintKeys[(this.rng() * paintKeys.length) | 0]);
    }

    for (const p of panels) {
      const dirtRes = p.kind === "tire" ? 256 : 512;
      const maskRes = p.kind === "tire" ? 128 : 256;
      const dirtCv = document.createElement("canvas");
      dirtCv.width = dirtRes; dirtCv.height = dirtRes;
      let gold = null;
      if (chosen.has(p.key)) {
        gold = { u: 0.2 + this.rng() * 0.6, v: 0.2 + this.rng() * 0.6, rPx: dirtRes * 0.045 };
        this.goldSpots.push({ panel: p.key, u: gold.u, v: gold.v, rUV: 0.06, found: false });
        chosen.delete(p.key);
      }
      drawDirt(dirtCv, p.kind, level.dirt, this.rng, gold);

      const maskCv = document.createElement("canvas");
      maskCv.width = maskRes; maskCv.height = maskRes;
      const mctx = maskCv.getContext("2d");
      mctx.fillStyle = "#fff"; mctx.fillRect(0, 0, maskRes, maskRes);

      const dirtTex = new THREE.CanvasTexture(dirtCv);
      dirtTex.colorSpace = THREE.SRGBColorSpace;
      dirtTex.anisotropy = 4;
      const maskTex = new THREE.CanvasTexture(maskCv);
      maskTex.generateMipmaps = false;
      maskTex.minFilter = THREE.LinearFilter;

      // per-pixel dirt weight at sampler resolution (alpha of the dirt map)
      this._smpCtx.clearRect(0, 0, 48, 48);
      this._smpCtx.drawImage(dirtCv, 0, 0, 48, 48);
      const img = this._smpCtx.getImageData(0, 0, 48, 48).data;
      const weights = new Float32Array(48 * 48);
      let wSum = 0;
      for (let i = 0; i < 48 * 48; i++) { weights[i] = img[i * 4 + 3] / 255; wSum += weights[i]; }

      this.panels.set(p.key, {
        ...p, dirtCv, maskCv, mctx, dirtTex, maskTex,
        weights, wSum: Math.max(wSum, 1), clean: 0, changed: true,
      });
    }
    this.progress = 0;
  }

  /* Paint a soft "clean" blob at uv. worldR in meters; strength 0..1 */
  paint(key, uv, worldR, strength) {
    const p = this.panels.get(key);
    if (!p) return;
    const W = p.maskCv.width, H = p.maskCv.height;
    const rx = Math.max(2.5, (worldR / p.uDim) * W);
    const ry = Math.max(2.5, (worldR / p.vDim) * H);
    const x = uv.x * W, y = (1 - uv.y) * H;
    const c = p.mctx;
    const grad = c.createRadialGradient(0, 0, 0, 0, 0, 1);
    grad.addColorStop(0, `rgba(0,0,0,${0.55 * strength})`);
    grad.addColorStop(0.7, `rgba(0,0,0,${0.28 * strength})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    c.save();
    c.translate(x, y); c.scale(rx, ry);
    c.fillStyle = grad;
    c.beginPath(); c.arc(0, 0, 1, 0, Math.PI * 2); c.fill();
    c.restore();
    p.maskTex.needsUpdate = true;
    p.changed = true;
  }

  /* Recompute overall progress; returns { progress, gold: [spots found now] } */
  sample() {
    let foundNow = [];
    for (const p of this.panels.values()) {
      if (!p.changed) continue;
      p.changed = false;
      this._smpCtx.clearRect(0, 0, 48, 48);
      this._smpCtx.drawImage(p.maskCv, 0, 0, 48, 48);
      const img = this._smpCtx.getImageData(0, 0, 48, 48).data;
      let acc = 0;
      for (let i = 0; i < 48 * 48; i++) {
        acc += (1 - img[i * 4 + 1] / 255) * p.weights[i];
      }
      p.clean = acc / p.wSum;

      for (const s of this.goldSpots) {
        if (s.found || s.panel !== p.key) continue;
        const sx = Math.round(s.u * 48), sy = Math.round((1 - s.v) * 48);
        let tot = 0, n = 0;
        for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
          const xx = sx + dx, yy = sy + dy;
          if (xx < 0 || yy < 0 || xx > 47 || yy > 47) continue;
          tot += img[(yy * 48 + xx) * 4 + 1] / 255; n++;
        }
        if (n && tot / n < 0.35) { s.found = true; foundNow.push(s); }
      }
    }
    let sum = 0, wsum = 0;
    for (const p of this.panels.values()) {
      const w = p.area * (0.35 + 0.65 * Math.min(1, p.wSum / (48 * 48 * 0.5)));
      sum += p.clean * w; wsum += w;
    }
    this.progress = wsum ? sum / wsum : 0;
    return { progress: this.progress, gold: foundNow };
  }

  setBeforeView(on, overlays) {
    for (const [key, mesh] of overlays) {
      const p = this.panels.get(key);
      if (!p || !mesh) continue;
      mesh.material.alphaMap = on ? this.whiteTex : p.maskTex;
      mesh.material.needsUpdate = true;
    }
  }

  dispose() {
    for (const p of this.panels.values()) { p.dirtTex.dispose(); p.maskTex.dispose(); }
    this.whiteTex.dispose();
    this.panels.clear();
  }
}
