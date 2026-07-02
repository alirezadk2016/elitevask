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
  roughnessFactor = mix(roughnessFactor, 0.93, dF);
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

  add(mesh, { maskRes = 512, repeat = 2, amount = 1, weight = 1 } = {}) {
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
    mesh.material = mesh.material.clone();
    patchMaterial(mesh.material, grungeTexture(), maskTex, repeat, amount);
    mesh.userData.dirtKey = mesh.uuid;
    // world-area weight for fair progress
    const box = new THREE.Box3().setFromObject(mesh);
    const size = box.getSize(new THREE.Vector3());
    const area = Math.max(0.05, (size.x * size.y + size.y * size.z + size.x * size.z) * 0.5) * weight;
    this.items.set(mesh.uuid, { mesh, maskCv, ctx, maskTex, tpm, area, clean: 0, changed: true });
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
      for (let i = 0; i < 48 * 48; i++) acc += 1 - img[i * 4 + 1] / 255;
      it.clean = acc / (48 * 48);
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
