/* Procedural car builder.
   The car is assembled from "panels" – thin boxes whose single visible face
   carries its own dirt mask, so UV painting cleans exactly (and only) the
   spot the water hits. Proportions come from BODIES per level. */

import * as THREE from "three";
import { BODIES } from "./levels";
import { DirtSystem } from "./dirt";

const T = 0.024; // panel thickness

function mesh(geo, mat, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  return m;
}
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);

export function buildCar(level) {
  const B = BODIES[level.key];
  const { L, W, bodyH, cabH, cabL, cabOff, wheelR, ride, wing } = B;
  const yTop = ride + bodyH;
  const Lc = cabL * L, xc = cabOff * L;
  const cabFront = xc + Lc / 2, cabBack = xc - Lc / 2;
  const nose = L / 2, tail = -L / 2;

  const wsAng = (38 * Math.PI) / 180, rgAng = (44 * Math.PI) / 180;
  const wsRun = cabH / Math.tan(wsAng), wsLen = cabH / Math.sin(wsAng);
  const rgRun = cabH / Math.tan(rgAng), rgLen = cabH / Math.sin(rgAng);
  const hoodX0 = cabFront + wsRun, hoodX1 = nose * 0.97;
  const hoodLen = Math.max(0.3, hoodX1 - hoodX0);
  const trunkX0 = cabBack - rgRun, trunkX1 = tail * 0.97;
  const trunkLen = Math.max(0.25, trunkX0 - trunkX1);

  /* ---- materials ---- */
  const paintCol = new THREE.Color(level.paint);
  const paint = new THREE.MeshPhysicalMaterial({
    color: paintCol, metalness: 0.85, roughness: 0.42,
    clearcoat: 0.05, clearcoatRoughness: 0.35, envMapIntensity: 1.15,
  });
  const shellPaint = paint.clone();
  shellPaint.color = paintCol.clone().multiplyScalar(0.82);
  const darkGlass = new THREE.MeshStandardMaterial({ color: "#0d1512", metalness: 0.6, roughness: 0.32 });
  const glass = new THREE.MeshPhysicalMaterial({
    color: "#9cc2d4", metalness: 0.1, roughness: 0.08, transparent: true, opacity: 0.35, envMapIntensity: 1.5,
  });
  const trim = new THREE.MeshStandardMaterial({ color: "#101214", metalness: 0.55, roughness: 0.6 });
  const chrome = new THREE.MeshStandardMaterial({
    color: level.key === "elite" ? "#d9b956" : "#cfd6dc", metalness: 1, roughness: 0.55,
  });
  const tireMat = new THREE.MeshStandardMaterial({ color: "#141414", roughness: 0.96 });
  const headMat = new THREE.MeshStandardMaterial({ color: "#dff2ff", emissive: "#bfe4ff", emissiveIntensity: 1.6 });
  const tailMat = new THREE.MeshStandardMaterial({ color: "#5a0c12", emissive: "#e0263a", emissiveIntensity: 1.4 });

  /* ---- panel specs (cleanables) ---- */
  const specs = [];
  const add = (key, kind, geoDims, pos, rot, uDim, vDim) =>
    specs.push({ key, kind, geoDims, pos, rot, uDim, vDim, area: uDim * vDim });

  add("hood", "top", [hoodLen, T, W * 0.9], [(hoodX0 + hoodX1) / 2, yTop + T / 2 - 0.002, 0], null, hoodLen, W * 0.9);
  add("trunk", "top", [trunkLen, T, W * 0.9], [(trunkX0 + trunkX1) / 2, yTop + T / 2 - 0.002, 0], null, trunkLen, W * 0.9);
  add("roof", "top", [Lc * 0.92, T, W * 0.78], [xc, yTop + cabH + T / 2 - 0.002, 0], null, Lc * 0.92, W * 0.78);
  add("sideL", "side", [L * 0.98, bodyH * 0.96, T], [0, ride + bodyH / 2, W / 2 + T / 2 - 0.004], null, L * 0.98, bodyH * 0.96);
  add("sideR", "side", [L * 0.98, bodyH * 0.96, T], [0, ride + bodyH / 2, -(W / 2 + T / 2 - 0.004)], null, L * 0.98, bodyH * 0.96);
  add("front", "fascia", [T, bodyH * 0.94, W * 0.94], [nose + T / 2 - 0.004, ride + bodyH / 2, 0], null, W * 0.94, bodyH * 0.94);
  add("rear", "fascia", [T, bodyH * 0.94, W * 0.94], [tail - T / 2 + 0.004, ride + bodyH / 2, 0], null, W * 0.94, bodyH * 0.94);
  add("windshield", "glass", [wsLen, T, W * 0.82],
    [cabFront + wsRun / 2, yTop + cabH / 2, 0], null, wsLen, W * 0.82);
  add("rearGlass", "glass", [rgLen, T, W * 0.82],
    [cabBack - rgRun / 2, yTop + cabH / 2, 0], null, rgLen, W * 0.82);
  add("winL", "glass", [Lc * 0.84, cabH * 0.62, T], [xc, yTop + cabH * 0.52, W * 0.86 / 2 + T / 2 - 0.002], null, Lc * 0.84, cabH * 0.62);
  add("winR", "glass", [Lc * 0.84, cabH * 0.62, T], [xc, yTop + cabH * 0.52, -(W * 0.86 / 2 + T / 2 - 0.002)], null, Lc * 0.84, cabH * 0.62);

  const axF = L * 0.33, axR = -L * 0.33, wz = W / 2 - 0.08;
  for (const [key, x, z] of [["wheelFL", axF, wz], ["wheelFR", axF, -wz], ["wheelRL", axR, wz], ["wheelRR", axR, -wz]]) {
    add(key, "tire", null, [x, wheelR, z], null, wheelR * 2, wheelR * 2);
  }

  /* ---- dirt system from specs ---- */
  const dirt = new DirtSystem(specs.map(({ key, kind, uDim, vDim, area }) => ({ key, kind, uDim, vDim, area })), level, 42);

  /* ---- build meshes ---- */
  const group = new THREE.Group();
  const panels = [];

  // body shell + cabin + underside
  const shell = mesh(box(L, bodyH, W), shellPaint, 0, ride + bodyH / 2, 0);
  shell.receiveShadow = true;
  const cabin = mesh(box(Lc, cabH, W * 0.86), darkGlass, xc, yTop + cabH / 2, 0);
  const under = mesh(box(L * 0.96, 0.08, W * 0.9), trim, 0, ride - 0.02, 0);
  group.add(shell, cabin, under);

  // trims & lights
  group.add(mesh(box(0.16, 0.12, W * 0.98), trim, nose - 0.05, ride + 0.09, 0));
  group.add(mesh(box(0.16, 0.12, W * 0.98), trim, tail + 0.05, ride + 0.09, 0));
  group.add(mesh(box(0.02, 0.12, W * 0.36), trim, nose + T + 0.004, ride + bodyH * 0.42, 0)); // grille
  for (const s of [1, -1]) {
    group.add(mesh(box(0.03, 0.09, 0.3), headMat, nose + T + 0.004, yTop - 0.14, s * W * 0.3));
    group.add(mesh(box(0.03, 0.08, 0.34), tailMat, tail - T - 0.004, yTop - 0.14, s * W * 0.3));
    group.add(mesh(box(L * 0.66, 0.06, 0.03), trim, 0, ride + 0.05, s * (W / 2 + 0.012))); // skirts
    for (const hx of [xc + Lc * 0.18, xc - Lc * 0.22]) {
      group.add(mesh(box(0.16, 0.03, 0.02), chrome, hx, yTop - 0.16, s * (W / 2 + T + 0.006))); // handles
    }
  }
  if (wing) {
    const wY = yTop + 0.16;
    group.add(mesh(box(0.34, 0.035, W * 0.8), trim, tail + 0.32, wY, 0));
    for (const s of [1, -1]) group.add(mesh(box(0.05, 0.14, 0.05), trim, tail + 0.32, wY - 0.08, s * W * 0.3));
  }

  // cleanable panels + dirt overlays
  const overlays = new Map();
  for (const s of specs) {
    let geo;
    if (s.kind === "tire") {
      geo = new THREE.CylinderGeometry(B.wheelR, B.wheelR, 0.27, 26);
      geo.rotateX(Math.PI / 2);
    } else {
      geo = box(...s.geoDims);
    }
    const baseMat = s.kind === "glass" ? glass : s.kind === "tire" ? tireMat : paint;
    const m = mesh(geo, baseMat, ...s.pos);
    m.userData.panelKey = s.key;
    const pd = dirt.panels.get(s.key);
    const om = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({
      map: pd.dirtTex, alphaMap: pd.maskTex, transparent: true,
      roughness: 0.95, metalness: 0.04,
      polygonOffset: true, polygonOffsetFactor: -1.5, polygonOffsetUnits: -2,
      depthWrite: false,
    }));
    om.renderOrder = 2;
    om.castShadow = false;
    m.add(om); // overlay inherits transforms
    overlays.set(s.key, om);
    group.add(m);
    panels.push({ ...s, mesh: m, overlay: om });
  }

  // orient the angled glass
  const wsMesh = panels.find((p) => p.key === "windshield").mesh;
  wsMesh.rotation.z = -(wsAng);
  const rgMesh = panels.find((p) => p.key === "rearGlass").mesh;
  rgMesh.rotation.z = rgAng;

  // wheels: rims + spokes on top of cleanable tires
  const rims = [];
  for (const p of panels.filter((x) => x.kind === "tire")) {
    const g = new THREE.Group();
    g.position.set(...p.pos);
    const rimGeo = new THREE.CylinderGeometry(B.wheelR * 0.56, B.wheelR * 0.56, 0.285, 20);
    rimGeo.rotateX(Math.PI / 2);
    const rimMat = chrome.clone();
    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.castShadow = true;
    g.add(rim);
    for (let i = 0; i < 3; i++) {
      const sp = new THREE.Mesh(box(B.wheelR * 1.02, 0.055, 0.29), rimMat);
      sp.rotation.z = (i * Math.PI) / 3;
      g.add(sp);
    }
    const cap = new THREE.Mesh(new THREE.CylinderGeometry(B.wheelR * 0.14, B.wheelR * 0.14, 0.3, 12).rotateX(Math.PI / 2),
      new THREE.MeshStandardMaterial({ color: level.key === "elite" ? "#d4af37" : "#e8eef2", metalness: 1, roughness: 0.3 }));
    g.add(cap);
    rims.push(rimMat);
    group.add(g);
  }

  group.traverse((o) => { if (o.isMesh && o !== shell) o.receiveShadow = false; });

  const mats = { paint, shellPaint, glass, rims, chrome };
  return { group, dirt, panels, overlays, mats, bounds: { L, W, H: yTop + cabH } };
}

/* Progress-driven shine: called every frame with 0..1 cleaned. */
export function applyShine(mats, t) {
  mats.paint.roughness = 0.42 - 0.3 * t;
  mats.paint.clearcoat = 0.05 + 0.95 * t;
  mats.paint.clearcoatRoughness = 0.35 - 0.25 * t;
  mats.shellPaint.roughness = 0.5 - 0.3 * t;
  mats.glass.opacity = 0.35 - 0.08 * t;
  for (const r of mats.rims) r.roughness = 0.55 - 0.42 * t;
}

export function disposeCar(car) {
  car.dirt.dispose();
  car.group.traverse((o) => {
    if (o.isMesh) {
      o.geometry.dispose();
      if (o.material && !o.material.__shared) o.material.dispose();
    }
  });
}
