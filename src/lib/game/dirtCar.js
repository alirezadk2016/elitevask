/* Phase 2 – REAL per-pixel cleaning on the glTF car.
   Each cleanable mesh gets:
   - a shared procedural grunge texture (color + alpha)
   - its own runtime-painted MASK canvas (white = dirty, black = cleaned)
   The mesh's PBR material is patched (onBeforeCompile) so dirt tints the
   albedo, raises roughness and kills metalness exactly where the mask is
   white. Spraying paints black blobs into the mask at the raycast UV, so
   dirt disappears precisely where the water hits.
   Brush size in mask pixels is derived from a per-mesh texel-density
   estimate (uv area vs world area), so one world-space brush radius feels
   identical on every panel. */

import * as THREE from "three";

let _grunge = null;
export function grungeTexture() {
  if (_grunge) return _grunge;
  const c = document.createElement("canvas");
  c.width = c.height = 1024;
  const g = c.getContext("2d");
  g.clearRect(0, 0, 1024, 1024);
  // base film so every panel carries washable grime
  g.fillStyle = "rgba(104,92,74,0.52)";
  g.fillRect(0, 0, 1024, 1024);
  const MUD = ["#6b5a44", "#75634b", "#5c4d3a"];
  for (let i = 0; i < 130; i++) {
    const x = Math.random() * 1024, y = Math.random() * 1024;
    const r = 20 + Math.random() * 130;
    const col = MUD[i % 3];
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, col + Math.floor(90 + Math.random() * 120).toString(16));
    gr.addColorStop(1, col + "00");
    g.fillStyle = gr;
    g.beginPath();
    g.ellipse(x, y, r, r * (0.45 + Math.random() * 0.7), Math.random() * Math.PI, 0, Math.PI * 2);
    g.fill();
  }
  // speckles + dust streaks
  for (let i = 0; i < 2600; i++) {
    g.fillStyle = `rgba(${90 + Math.random() * 60 | 0},${80 + Math.random() * 50 | 0},${60 + Math.random() * 40 | 0},${0.25 + Math.random() * 0.5})`;
    const s = 1 + Math.random() * 3;
    g.fillRect(Math.random() * 1024, Math.random() * 1024, s, s);
  }
  for (let i = 0; i < 46; i++) {
    const x = Math.random() * 1024, y = Math.random() * 1024, len = 40 + Math.random() * 150, w = 2 + Math.random() * 6;
    const gr = g.createLinearGradient(x, y, x, y + len);
    gr.addColorStop(0, "rgba(205,208,204,0.4)");
    gr.addColorStop(1, "rgba(205,208,204,0)");
    g.fillStyle = gr;
    g.fillRect(x, y, w, len);
  }
  _grunge = new THREE.CanvasTexture(c);
  _grunge.colorSpace = THREE.SRGBColorSpace;
  _grunge.wrapS = _grunge.wrapT = THREE.RepeatWrapping;
  _grunge.anisotropy = 4;
  return _grunge;
}

/* Realistic body dirt drawn straight into the box-unwrap ATLAS (repeat=1):
   the atlas v-axis maps to local height on the side cells, so mud can pool
   on the lower panels, salt streaks run downward, splatter sits low, and
   the top surfaces only get light dust + water spots – like a real car. */
export function bodyAtlasTexture() {
  const W = 1024;
  const c = document.createElement("canvas");
  c.width = c.height = W;
  const g = c.getContext("2d");
  g.clearRect(0, 0, W, W);
  const X = (u) => u * W, Y = (v) => (1 - v) * W;
  const MUD = ["#3a2d1f", "#4a3a28", "#5b4936"];
  const CRUST = "#7d6e55";
  const rnd = Math.random;

  const cells = [];
  for (let axis = 0; axis < 3; axis++) for (let sign = 0; sign < 2; sign++) {
    cells.push({ axis, sign, u0: axis / 3, u1: (axis + 1) / 3, v0: sign * 0.5, v1: sign * 0.5 + 0.5 });
  }

  for (const cell of cells) {
    const x0 = X(cell.u0), x1 = X(cell.u1);
    const yTop = Y(cell.v1), yBot = Y(cell.v0);
    const h = yBot - yTop, w = x1 - x0;
    const isTop = cell.axis === 1 && cell.sign === 0;
    const isUnder = cell.axis === 1 && cell.sign === 1;

    if (isUnder) {
      g.fillStyle = "rgba(52,42,30,0.85)";
      g.fillRect(x0, yTop, w, h);
      continue;
    }
    if (isTop) {
      // light dust film + water spots
      g.fillStyle = "rgba(122,116,104,0.16)";
      g.fillRect(x0, yTop, w, h);
      for (let i = 0; i < 26; i++) {
        const cx = x0 + rnd() * w, cy = yTop + rnd() * h, r = 4 + rnd() * 13;
        g.strokeStyle = `rgba(196,198,190,${0.1 + rnd() * 0.14})`;
        g.lineWidth = 1.5 + rnd() * 2;
        g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
      }
      for (let i = 0; i < 420; i++) {
        g.fillStyle = `rgba(120,112,98,${0.08 + rnd() * 0.2})`;
        const s = 1 + rnd() * 2;
        g.fillRect(x0 + rnd() * w, yTop + rnd() * h, s, s);
      }
      continue;
    }

    // vertical panels: mud pools low, fades up
    const grad = g.createLinearGradient(0, yBot, 0, yTop);
    grad.addColorStop(0, "rgba(66,52,36,0.82)");
    grad.addColorStop(0.32, "rgba(84,68,48,0.42)");
    grad.addColorStop(0.62, "rgba(104,90,70,0.18)");
    grad.addColorStop(1, "rgba(116,104,86,0.1)");
    g.fillStyle = grad;
    g.fillRect(x0, yTop, w, h);

    // break the film's uniformity: soft cloudy variation + washed-thin gaps
    for (let i = 0; i < 10; i++) {
      const cx2 = x0 + rnd() * w, cy2 = yBot - rnd() * h * 0.8, cr = 30 + rnd() * 70;
      const cgr = g.createRadialGradient(cx2, cy2, 0, cx2, cy2, cr);
      cgr.addColorStop(0, `rgba(70,56,40,${0.12 + rnd() * 0.16})`);
      cgr.addColorStop(1, "rgba(70,56,40,0)");
      g.fillStyle = cgr;
      g.beginPath(); g.arc(cx2, cy2, cr, 0, Math.PI * 2); g.fill();
    }
    g.save();
    g.globalCompositeOperation = "destination-out";
    for (let i = 0; i < 7; i++) {
      const cx2 = x0 + rnd() * w, cy2 = yTop + rnd() * h * 0.7, cr = 24 + rnd() * 55;
      const cgr = g.createRadialGradient(cx2, cy2, 0, cx2, cy2, cr);
      cgr.addColorStop(0, `rgba(0,0,0,${0.14 + rnd() * 0.18})`);
      cgr.addColorStop(1, "rgba(0,0,0,0)");
      g.fillStyle = cgr;
      g.beginPath(); g.arc(cx2, cy2, cr, 0, Math.PI * 2); g.fill();
    }
    g.restore();

    // organic mud blobs: 3–5 overlapping lobes + crust halo + drips + spray halo
    for (let i = 0; i < 34; i++) {
      const bx = x0 + rnd() * w;
      const by = yBot - Math.pow(rnd(), 2.1) * h * 0.72;
      const r = 7 + rnd() * 24;
      const col = rnd() < 0.12 ? "#241b12" /* oily spot */ : MUD[(rnd() * MUD.length) | 0];
      if (rnd() < 0.5) { // dried crust halo behind the blob
        const cg = g.createRadialGradient(bx, by, r * 0.5, bx, by, r * 1.45);
        cg.addColorStop(0, CRUST + "00");
        cg.addColorStop(0.55, CRUST + "59");
        cg.addColorStop(1, CRUST + "00");
        g.fillStyle = cg;
        g.beginPath(); g.arc(bx, by, r * 1.45, 0, Math.PI * 2); g.fill();
      }
      const lobes = 3 + (rnd() * 3 | 0);
      for (let k = 0; k < lobes; k++) {
        const lx = bx + (rnd() - 0.5) * r * 1.3;
        const ly = by + (rnd() - 0.5) * r * 0.9;
        const lr = r * (0.35 + rnd() * 0.55);
        const rg = g.createRadialGradient(lx, ly, 0, lx, ly, lr);
        rg.addColorStop(0, col + "c4");
        rg.addColorStop(0.65, col + "7d");
        rg.addColorStop(1, col + "00");
        g.fillStyle = rg;
        g.beginPath();
        g.ellipse(lx, ly, lr, lr * (0.55 + rnd() * 0.5), rnd() * Math.PI, 0, Math.PI * 2);
        g.fill();
      }
      // spray halo of fine specks around the blob
      for (let k = 0; k < 14; k++) {
        const a = rnd() * Math.PI * 2, rr = r * (1.1 + rnd() * 0.9);
        g.fillStyle = col + Math.floor(40 + rnd() * 90).toString(16).padStart(2, "0");
        const s = 0.8 + rnd() * 2;
        g.fillRect(bx + Math.cos(a) * rr, by + Math.sin(a) * rr * 0.7, s, s);
      }
      if (rnd() < 0.42) { // drip trail below
        const dl = 10 + rnd() * 36, dw = 1.6 + rnd() * 3;
        const lg = g.createLinearGradient(0, by, 0, by + dl);
        lg.addColorStop(0, col + "8c");
        lg.addColorStop(1, col + "00");
        g.fillStyle = lg;
        const wob = (rnd() - 0.5) * 3;
        g.fillRect(bx - dw / 2 + wob, by, dw, dl * 0.6);
        g.fillRect(bx - dw / 2 + wob * 1.6, by + dl * 0.5, dw * 0.7, dl * 0.5);
      }
    }
    // wheel-arch splatter (wheels sit around 20% / 80% of length):
    // fine specks + horizontal wind-smeared streaks thrown backwards
    const clusters = cell.axis === 2 ? [0.2, 0.8] : [0.5];
    for (const cu of clusters) {
      const cxp = x0 + cu * w;
      for (let i = 0; i < 300; i++) {
        const sx = cxp + (rnd() - 0.5) * w * 0.26;
        const sy = yBot - Math.pow(rnd(), 2.4) * h * 0.55;
        g.fillStyle = `rgba(${52 + rnd() * 36 | 0},${42 + rnd() * 28 | 0},${28 + rnd() * 22 | 0},${0.35 + rnd() * 0.5})`;
        const s = 1 + rnd() * 3;
        g.fillRect(sx, sy, s, s * (1 + rnd()));
      }
      for (let i = 0; i < 26; i++) { // driving smears
        const sx = cxp + (rnd() - 0.5) * w * 0.2;
        const sy = yBot - Math.pow(rnd(), 1.9) * h * 0.45;
        const len = 8 + rnd() * 30, sh = 1.2 + rnd() * 2.4;
        const dirn = rnd() < 0.5 ? -1 : 1;
        const lg = g.createLinearGradient(sx, 0, sx + len * dirn, 0);
        lg.addColorStop(0, `rgba(58,45,31,${0.4 + rnd() * 0.3})`);
        lg.addColorStop(1, "rgba(58,45,31,0)");
        g.fillStyle = lg;
        g.fillRect(dirn > 0 ? sx : sx - len, sy, len, sh);
      }
    }
    // general specks
    for (let i = 0; i < 420; i++) {
      const sy = yBot - Math.pow(rnd(), 2) * h * 0.8;
      g.fillStyle = `rgba(${64 + rnd() * 40 | 0},${52 + rnd() * 34 | 0},${36 + rnd() * 26 | 0},${0.25 + rnd() * 0.4})`;
      const s = 1 + rnd() * 2.4;
      g.fillRect(x0 + rnd() * w, sy, s, s);
    }
    // salt streaks running down
    for (let i = 0; i < 16; i++) {
      const sx = x0 + rnd() * w;
      const sy = yTop + h * (0.18 + rnd() * 0.3);
      const len = h * (0.2 + rnd() * 0.4), lw = 2 + rnd() * 4;
      const lg = g.createLinearGradient(0, sy, 0, sy + len);
      lg.addColorStop(0, "rgba(214,216,210,0.34)");
      lg.addColorStop(1, "rgba(214,216,210,0)");
      g.fillStyle = lg;
      g.fillRect(sx, sy, lw, len);
    }
  }

  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const FRAG_COMMON = `
uniform sampler2D uDirtMap;
uniform sampler2D uDirtMask;
uniform float uDirtAmt;
uniform float uDirtRepeat;
float dirtFactor(vec2 uvv){
  float m = texture2D(uDirtMask, uvv).g;
  float a = texture2D(uDirtMap, uvv * uDirtRepeat).a;
  return a * m * uDirtAmt;
}`;

function patchMaterial(mat, dirtTex, maskTex, repeat, amount) {
  mat.defines = Object.assign({}, mat.defines, { USE_UV: "" });
  mat.onBeforeCompile = (shader) => {
    shader.uniforms.uDirtMap = { value: dirtTex };
    shader.uniforms.uDirtMask = { value: maskTex };
    shader.uniforms.uDirtAmt = { value: amount };
    shader.uniforms.uDirtRepeat = { value: repeat };
    mat.userData.shader = shader;
    shader.fragmentShader = shader.fragmentShader
      .replace("#include <common>", "#include <common>\n" + FRAG_COMMON)
      .replace("#include <map_fragment>", `#include <map_fragment>
{
  float dF = dirtFactor(vUv);
  vec3 dCol = texture2D(uDirtMap, vUv * uDirtRepeat).rgb;
  diffuseColor.rgb = mix(diffuseColor.rgb, dCol, dF);
}`)
      .replace("#include <roughnessmap_fragment>", `#include <roughnessmap_fragment>
{
  float dF = dirtFactor(vUv);
  /* washed areas get a WET sheen – glossier than the paint ever was dry */
  roughnessFactor = mix(roughnessFactor * 0.42, 0.95, dF);
}`)
      .replace("#include <metalnessmap_fragment>", `#include <metalnessmap_fragment>
{
  float dF = dirtFactor(vUv);
  metalnessFactor *= (1.0 - 0.78 * dF);
}`);
  };
  mat.needsUpdate = true;
}

/* The Ferrari glb ships degenerate UVs on most meshes (the official demo
   never textures them), so we generate our own: a 6-way box unwrap.
   Each triangle projects along its dominant normal axis into an atlas cell
   (3 columns = X/Y/Z axis, 2 rows = normal sign), so left/right panels get
   DISTINCT uv space – no mirror-cleaning. The raycaster reads the same uv
   attribute, so painting and shading stay perfectly aligned. */
const PAD = 0.012;
export function boxUnwrap(srcGeo) {
  const geo = srcGeo.index ? srcGeo.toNonIndexed() : srcGeo.clone();
  const pos = geo.attributes.position;
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const size = new THREE.Vector3().subVectors(bb.max, bb.min);
  size.x = Math.max(size.x, 1e-4); size.y = Math.max(size.y, 1e-4); size.z = Math.max(size.z, 1e-4);
  const uv = new Float32Array(pos.count * 2);
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  const ab = new THREE.Vector3(), ac = new THREE.Vector3(), n = new THREE.Vector3();
  const cellW = 1 / 3, cellH = 1 / 2;
  for (let t = 0; t < pos.count; t += 3) {
    a.fromBufferAttribute(pos, t); b.fromBufferAttribute(pos, t + 1); c.fromBufferAttribute(pos, t + 2);
    n.crossVectors(ab.subVectors(b, a), ac.subVectors(c, a));
    const ax = Math.abs(n.x), ay = Math.abs(n.y), az = Math.abs(n.z);
    let axis, sign;
    if (ax >= ay && ax >= az) { axis = 0; sign = n.x >= 0 ? 0 : 1; }
    else if (ay >= az) { axis = 1; sign = n.y >= 0 ? 0 : 1; }
    else { axis = 2; sign = n.z >= 0 ? 0 : 1; }
    for (let k = 0; k < 3; k++) {
      const p = k === 0 ? a : k === 1 ? b : c;
      let u, v;
      if (axis === 0) { u = (p.z - bb.min.z) / size.z; v = (p.y - bb.min.y) / size.y; }
      else if (axis === 1) { u = (p.x - bb.min.x) / size.x; v = (p.z - bb.min.z) / size.z; }
      else { u = (p.x - bb.min.x) / size.x; v = (p.y - bb.min.y) / size.y; }
      u = PAD + u * (cellW - 2 * PAD) + axis * cellW;
      v = PAD + v * (cellH - 2 * PAD) + sign * cellH;
      uv[(t + k) * 2] = u;
      uv[(t + k) * 2 + 1] = v;
    }
  }
  geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return geo;
}

/* uv-area vs world-area → mask texels per meter (median over sampled tris) */
function texelsPerMeter(mesh, maskRes) {
  const geo = mesh.geometry;
  const pos = geo.attributes.position, uv = geo.attributes.uv, idx = geo.index;
  if (!pos || !uv) return null;
  const triCount = idx ? idx.count / 3 : pos.count / 3;
  const samples = Math.min(240, triCount);
  const step = Math.max(1, Math.floor(triCount / samples));
  const pA = new THREE.Vector3(), pB = new THREE.Vector3(), pC = new THREE.Vector3();
  const s = new THREE.Vector3();
  mesh.getWorldScale(s);
  const scl = (Math.abs(s.x) + Math.abs(s.y) + Math.abs(s.z)) / 3;
  const ratios = [];
  for (let t = 0; t < triCount; t += step) {
    const i0 = idx ? idx.getX(t * 3) : t * 3;
    const i1 = idx ? idx.getX(t * 3 + 1) : t * 3 + 1;
    const i2 = idx ? idx.getX(t * 3 + 2) : t * 3 + 2;
    pA.fromBufferAttribute(pos, i0); pB.fromBufferAttribute(pos, i1); pC.fromBufferAttribute(pos, i2);
    const wArea = pB.sub(pA).cross(pC.sub(pA)).length() * 0.5 * scl * scl;
    const au = uv.getX(i0), av = uv.getY(i0);
    const bu = uv.getX(i1), bv = uv.getY(i1);
    const cu = uv.getX(i2), cv = uv.getY(i2);
    const uvArea = Math.abs((bu - au) * (cv - av) - (cu - au) * (bv - av)) * 0.5;
    if (wArea > 1e-8 && uvArea > 1e-10) ratios.push(Math.sqrt(uvArea / wArea));
  }
  if (!ratios.length) return null;
  ratios.sort((a, b) => a - b);
  return ratios[(ratios.length / 2) | 0] * maskRes;
}

export class CarDirt {
  constructor() {
    this.items = new Map(); // mesh.uuid -> item
    this._smp = document.createElement("canvas");
    this._smp.width = this._smp.height = 48;
    this._smpCtx = this._smp.getContext("2d", { willReadFrequently: true });
    this.progress = 0;
    this.whiteTex = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    this.whiteTex.needsUpdate = true;
  }

  /* hold-to-compare: temporarily show the fully dirty car */
  setBefore(on) {
    for (const it of this.items.values()) {
      const sh = it.mesh.material.userData.shader;
      if (sh) sh.uniforms.uDirtMask.value = on ? this.whiteTex : it.maskTex;
    }
  }

  /* how cleaned is the mask at this uv? 0 = dirty, 1 = cleaned */
  cleanedAt(key, uv) {
    const it = this.items.get(key);
    if (!it) return 0;
    const x = Math.max(0, Math.min(it.maskCv.width - 1, Math.round(uv.x * it.maskCv.width)));
    const y = Math.max(0, Math.min(it.maskCv.height - 1, Math.round((1 - uv.y) * it.maskCv.height)));
    try {
      const px = it.ctx.getImageData(x, y, 1, 1).data;
      return 1 - px[1] / 255;
    } catch { return 0; }
  }

  add(mesh, { maskRes = 512, repeat = 2, amount = 1, weight = 1, texture = null } = {}) {
    if (!mesh.geometry?.attributes?.position) return false;
    mesh.geometry = boxUnwrap(mesh.geometry); // own uv atlas, no mirroring
    const tpm = texelsPerMeter(mesh, maskRes);
    if (!tpm) return false;
    const maskCv = document.createElement("canvas");
    maskCv.width = maskCv.height = maskRes;
    const ctx = maskCv.getContext("2d");
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, maskRes, maskRes);
    const maskTex = new THREE.CanvasTexture(maskCv);
    maskTex.generateMipmaps = false;
    maskTex.minFilter = THREE.LinearFilter;
    const dirtTex = texture || grungeTexture();
    const rep = texture ? 1 : repeat;
    mesh.material = mesh.material.clone();
    patchMaterial(mesh.material, dirtTex, maskTex, rep, amount);
    mesh.userData.dirtKey = mesh.uuid;

    /* per-texel dirt weights (atlas textures aren't uniform, so progress
       must count dirt where it actually is – no hunting invisible spots) */
    let weights = null, wSum = 0;
    if (texture && texture.image) {
      this._smpCtx.clearRect(0, 0, 48, 48);
      this._smpCtx.drawImage(texture.image, 0, 0, 48, 48);
      const img = this._smpCtx.getImageData(0, 0, 48, 48).data;
      weights = new Float32Array(48 * 48);
      for (let i = 0; i < 48 * 48; i++) { weights[i] = img[i * 4 + 3] / 255; wSum += weights[i]; }
      if (wSum < 1) { weights = null; wSum = 0; }
    }

    // world-area weight for fair progress
    const box = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3());
    const area = Math.max(0.05, (size.x * size.y + size.y * size.z + size.x * size.z) * 0.5) * weight;
    this.items.set(mesh.uuid, { mesh, maskCv, ctx, maskTex, tpm, area, clean: 0, changed: true, weights, wSum });
    return true;
  }

  paint(key, uv, worldR, strength = 1) {
    const it = this.items.get(key);
    if (!it) return;
    const res = it.maskCv.width;
    const r = Math.min(res / 2.5, Math.max(2.5, worldR * it.tpm));
    const x = uv.x * res, y = (1 - uv.y) * res;
    const c = it.ctx;
    const grad = c.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, `rgba(0,0,0,${0.6 * strength})`);
    grad.addColorStop(0.65, `rgba(0,0,0,${0.3 * strength})`);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    c.fillStyle = grad;
    c.beginPath();
    c.arc(x, y, r, 0, Math.PI * 2);
    c.fill();
    it.maskTex.needsUpdate = true;
    it.changed = true;
  }

  sample() {
    for (const it of this.items.values()) {
      if (!it.changed) continue;
      it.changed = false;
      this._smpCtx.clearRect(0, 0, 48, 48);
      this._smpCtx.drawImage(it.maskCv, 0, 0, 48, 48);
      const img = this._smpCtx.getImageData(0, 0, 48, 48).data;
      let acc = 0;
      if (it.weights) {
        for (let i = 0; i < 48 * 48; i++) acc += (1 - img[i * 4 + 1] / 255) * it.weights[i];
        it.clean = acc / it.wSum;
      } else {
        for (let i = 0; i < 48 * 48; i++) acc += 1 - img[i * 4 + 1] / 255;
        it.clean = acc / (48 * 48);
      }
    }
    let sum = 0, w = 0;
    for (const it of this.items.values()) { sum += it.clean * it.area; w += it.area; }
    // fully-painted masks plateau ~0.95 (soft brush edges) → normalise
    this.progress = w ? Math.min(1, (sum / w) / 0.94) : 0;
    return this.progress;
  }

  reset() {
    for (const it of this.items.values()) {
      it.ctx.fillStyle = "#fff";
      it.ctx.fillRect(0, 0, it.maskCv.width, it.maskCv.height);
      it.maskTex.needsUpdate = true;
      it.changed = true;
      it.clean = 0;
    }
    this.progress = 0;
  }

  dispose() {
    for (const it of this.items.values()) it.maskTex.dispose();
    this.whiteTex.dispose();
    this.items.clear();
  }
}
