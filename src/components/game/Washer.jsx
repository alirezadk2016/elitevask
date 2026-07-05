"use client";
/* Pressure washer + game loop.
   The jet is built from stretched water-filament particles (no glowing
   beams): droplets leave the nozzle at ~15 m/s in a narrow cone, arc
   slightly under gravity and die at the impact point, where fine mist,
   bouncing droplets, quick suds and water running down the panel take
   over. Press & hold ON THE CAR to spray; painting happens at the raycast
   UV so cleaning stays perfectly accurate. */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FX } from "./fx";
import { initAudio, setSpray, sndGold, sndCombo } from "@/lib/game/audio";
import { TIME_LIMIT } from "@/lib/game/campaign";

const buzz = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };
const WORLD_UP = new THREE.Vector3(0, 1, 0);
const JET_SPEED = 15;
const isWheel = (m) => /^(rim_|tire|wheel)/.test(m.name);
const isBody = (m) => !isWheel(m);

export default function Washer({ G, isMobile }) {
  const { gl, camera } = useThree();
  const nozzle = useRef();
  const fxJet = useRef();
  const fxRun = useRef();
  const fxSplash = useRef();
  const fxMist = useRef();
  const fxFoam = useRef();
  const fxSteam = useRef();
  const fxSpark = useRef();
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const tmp = useMemo(() => ({
    v1: new THREE.Vector3(), v2: new THREE.Vector3(), v3: new THREE.Vector3(),
    side: new THREE.Vector3(), up2: new THREE.Vector3(), acc: 0,
  }), []);

  useEffect(() => {
    const el = gl.domElement;
    const ndc = (e) => {
      const r = el.getBoundingClientRect();
      G.pointer.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    };
    const down = (e) => {
      if (e.button !== undefined && e.button !== 0) return;
      ndc(e);
      initAudio();
      if (G.phase !== "playing" || G.done || G.introLock || !G.carMeshes.length) return;
      ray.setFromCamera(G.pointer, camera);
      if (ray.intersectObjects(G.carMeshes, false).length) {
        G.spraying = true;
        G.hasSprayed = true;
        G.fovKick = 1;
        buzz(12);
        e.stopPropagation(); // OrbitControls (on the wrapper) never sees it
      }
    };
    const move = (e) => ndc(e);
    const up = () => { G.spraying = false; };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [gl, camera, ray, G]);

  useFrame((_, rawDt) => {
    const dt = Math.min(rawDt, 0.05);
    const playing = G.phase === "playing" && !G.done;

    /* wipe leftover particles when a new mission starts */
    if (G.clearFx) {
      G.clearFx = false;
      for (const f of [fxJet, fxRun, fxSplash, fxMist, fxFoam, fxSteam, fxSpark]) f.current && f.current.clear();
    }

    /* mission timer runs from the first spray – 3 minutes, then game over */
    if (playing && G.hasSprayed) {
      G.time += Math.min(rawDt, 0.25);
      if (G.time >= TIME_LIMIT && !G.done) {
        G.done = true;
        G.spraying = false;
        G.fail && G.fail();
        return;
      }
    }

    /* current detailing stage decides the tool behaviour */
    const st = G.stageType || "wash";
    const usesWater = st === "wash" || st === "rinse" || st === "wheels";
    const isCoat = st === "foam" || st === "polish" || st === "wax";

    /* water tank (only the water stages drain it) */
    const wantsSpray = G.spraying && playing;
    let spraying = wantsSpray && (!usesWater || (G.water > 0.5 && !G.tankLock));
    if (usesWater) {
      if (wantsSpray && G.water <= 0.5) G.tankLock = true;
      if (G.tankLock && G.water > 18) G.tankLock = false;
    }
    G.water = Math.max(0, Math.min(100, G.water + (spraying && usesWater ? -11 : 22) * dt));

    /* aim */
    ray.setFromCamera(G.pointer, camera);
    let hit = null;
    if (spraying && G.carMeshes.length) {
      const hits = ray.intersectObjects(G.carMeshes, false);
      if (hits.length) hit = hits[0];
    }

    /* nozzle anchored to the camera like an FPS tool */
    const noz = nozzle.current;
    if (noz) {
      noz.visible = G.phase === "playing";
      tmp.v1.set(0.5, -0.42, -1.05).applyMatrix4(camera.matrixWorld);
      noz.position.copy(tmp.v1);
      noz.lookAt(hit ? hit.point : ray.ray.at(7, tmp.v2));
      noz.updateMatrixWorld();
    }

    /* spray-start FOV punch */
    if (G.fovKick > 0.002) {
      camera.fov = 40 + G.fovKick * 1.6;
      camera.updateProjectionMatrix();
      G.fovKick *= Math.pow(0.0001, dt);
    } else if (camera.fov !== 40) {
      camera.fov = 40;
      camera.updateProjectionMatrix();
      G.fovKick = 0;
    }

    const tip = tmp.v1;
    if (noz) noz.localToWorld(tip.set(0, 0, 0.44));

    if (spraying) {
      const target = hit ? hit.point : ray.ray.at(9, tmp.v2);
      const dir = tmp.v3.copy(target).sub(tip);
      const dist = Math.max(0.3, dir.length());
      dir.normalize();
      setSpray(true, dist);

      /* the jet: filaments seeded along the WHOLE stream every frame, so it
         reads as one continuous water line at any frame rate; the spread
         cone widens with distance like a real high-pressure jet */
      const jt = fxJet.current;
      if (jt && usesWater) {
        tmp.side.crossVectors(dir, WORLD_UP);
        if (tmp.side.lengthSq() < 1e-4) tmp.side.set(1, 0, 0); else tmp.side.normalize();
        tmp.up2.crossVectors(tmp.side, dir);
        const n = isMobile ? 16 : 30;
        const flight = dist / JET_SPEED;
        for (let i = 0; i < n; i++) {
          const t = Math.random(); // position along the beam
          const w = 0.15 + t * 0.85; // cone widens downstream
          const s1 = (Math.random() - 0.5) * 0.7 * w;
          const s2 = (Math.random() - 0.5) * 0.7 * w;
          const ox = tmp.side.x * s1 * 0.04 + tmp.up2.x * s2 * 0.04;
          const oy = tmp.side.y * s1 * 0.04 + tmp.up2.y * s2 * 0.04;
          const oz = tmp.side.z * s1 * 0.04 + tmp.up2.z * s2 * 0.04;
          jt.spawn(
            tip.x + dir.x * dist * t + ox, tip.y + dir.y * dist * t + oy, tip.z + dir.z * dist * t + oz,
            dir.x * JET_SPEED + tmp.side.x * s1 + tmp.up2.x * s2,
            dir.y * JET_SPEED + tmp.side.y * s1 + tmp.up2.y * s2,
            dir.z * JET_SPEED + tmp.side.z * s1 + tmp.up2.z * s2,
            Math.max(0.03, (1 - t) * flight * (0.85 + Math.random() * 0.25)),
            0.04 + Math.random() * 0.04,
            0.14 + Math.random() * 0.16);
        }
      }

      if (hit) {
        const key = hit.object.userData.dirtKey;
        const n = hit.face
          ? tmp.v2.copy(hit.face.normal).transformDirection(hit.object.matrixWorld)
          : tmp.v2.set(0, 1, 0);
        const p = hit.point;
        const sp = fxSplash.current, mi = fxMist.current, fo = fxFoam.current, stm = fxSteam.current, rd = fxRun.current, sk = fxSpark.current;

        if (isCoat && key && hit.uv && G.dirt) {
          /* foam / polish / wax: paint the coat mask */
          const brush = st === "foam" ? 0.14 : 0.1;
          G.dirt.paintCoat(key, hit.uv, brush, 1);
          if (st === "foam") {
            /* thick expanding foam blobs */
            for (let i = 0, N = isMobile ? 3 : 6; i < N && fo; i++) {
              fo.spawn(
                p.x + (Math.random() - 0.5) * 0.22 + n.x * 0.03,
                p.y + (Math.random() - 0.5) * 0.22 + n.y * 0.03,
                p.z + (Math.random() - 0.5) * 0.22 + n.z * 0.03,
                (Math.random() - 0.5) * 0.25, 0.05 + Math.random() * 0.2, (Math.random() - 0.5) * 0.25,
                1.2 + Math.random() * 0.8, 0.05 + Math.random() * 0.05, 0.85);
            }
          } else {
            /* polish / wax: glossy sparkles */
            for (let i = 0; i < 4 && sk; i++) {
              sk.spawn(
                p.x + n.x * 0.03 + (Math.random() - 0.5) * 0.1,
                p.y + n.y * 0.03 + (Math.random() - 0.5) * 0.1,
                p.z + n.z * 0.03 + (Math.random() - 0.5) * 0.1,
                (Math.random() - 0.5) * 0.25, 0.15 + Math.random() * 0.25, (Math.random() - 0.5) * 0.25,
                0.3 + Math.random() * 0.2, 0.012 + Math.random() * 0.016, 0.75);
            }
          }
        } else if (usesWater && key && hit.uv && G.dirt) {
          /* pre-wash / rinse / wheels: erode the dirt mask */
          const brush = 0.09 + dist * 0.014;
          const strength = Math.max(0.28, Math.min(1, 1.15 - dist * 0.09)) * (G.scrub || 1);
          G.dirt.paint(key, hit.uv, brush, strength);
          if (st === "rinse") G.dirt.paintCoat(key, hit.uv, brush * 1.2, 1, true); // rinse foam off
          if (sk && Math.random() < 0.3) {
            sk.spawn(
              p.x + n.x * 0.04, p.y + n.y * 0.04, p.z + n.z * 0.04,
              n.x * 0.1, 0.12 + Math.random() * 0.15, n.z * 0.1,
              0.3 + Math.random() * 0.15, 0.012 + Math.random() * 0.014, 0.6);
          }
        }

        if (usesWater) {
          for (let i = 0, N = isMobile ? 3 : 5; i < N && sp; i++) {
            sp.spawn(
              p.x + n.x * 0.02, p.y + n.y * 0.02, p.z + n.z * 0.02,
              n.x * (0.8 + Math.random() * 1.4) + (Math.random() - 0.5) * 1.6,
              n.y * (0.8 + Math.random() * 1.2) + Math.random() * 1.1,
              n.z * (0.8 + Math.random() * 1.4) + (Math.random() - 0.5) * 1.6,
              0.28 + Math.random() * 0.14, 0.02 + Math.random() * 0.02, 0.5);
          }
          if (mi && Math.random() < 0.6) {
            mi.spawn(p.x, p.y + 0.03, p.z,
              (Math.random() - 0.5) * 0.35, 0.2 + Math.random() * 0.25, (Math.random() - 0.5) * 0.35,
              0.4 + Math.random() * 0.25, 0.14 + Math.random() * 0.1, 0.05);
          }
          if (rd) {
            for (let i = 0, N = isMobile ? 1 : 2; i < N; i++) {
              rd.spawn(
                p.x + (Math.random() - 0.5) * 0.14 + n.x * 0.012,
                p.y + (Math.random() - 0.5) * 0.08,
                p.z + (Math.random() - 0.5) * 0.14 + n.z * 0.012,
                (Math.random() - 0.5) * 0.05, -0.3 - Math.random() * 0.25, (Math.random() - 0.5) * 0.05,
                0.7 + Math.random() * 0.5, 0.035 + Math.random() * 0.03, 0.42);
            }
          }
          if (stm && Math.random() < 0.18) {
            stm.spawn(p.x + (Math.random() - 0.5) * 0.1, p.y + 0.05, p.z + (Math.random() - 0.5) * 0.1,
              (Math.random() - 0.5) * 0.15, 0.5 + Math.random() * 0.35, (Math.random() - 0.5) * 0.15,
              1.0 + Math.random() * 0.5, 0.16 + Math.random() * 0.12, 0.06);
          }
        }
      }
    } else {
      setSpray(false);
    }

    /* per-stage progress sampling + scoring */
    tmp.acc += dt;
    if (tmp.acc > 0.3 && G.dirt && playing) {
      tmp.acc = 0;
      const before = G.progress;
      // always keep the raw clean value current (drives paint shine reveal)
      G.dirt.sample();
      let p;
      if (st === "foam") { G.dirt.sampleCoat(); p = G.dirt.subsetCoat(isBody); }
      else if (st === "polish" || st === "wax") { G.dirt.sampleCoat(); p = G.dirt.subsetCoat(isBody); }
      else if (st === "wheels") p = G.dirt.subsetClean(isWheel);
      else p = G.dirt.progress; // wash / rinse
      G.progress = p;

      const delta = p - before;
      const comboWas = Math.floor(G.combo);
      if (delta > 0.0004) {
        G.combo = Math.min(5, G.combo + delta * 26);
        const gained = Math.round(delta * 9000 * G.combo);
        G.score += gained;
        G.lastGain = gained;
        G.gainSeq = (G.gainSeq || 0) + 1;
      } else {
        G.combo = Math.max(1, G.combo - 0.22);
      }
      G.comboMax = Math.max(G.comboMax || 1, G.combo);
      if (Math.floor(G.combo) > comboWas) { sndCombo(Math.floor(G.combo)); buzz(8); }

      // golden dirt only during the water-wash stages
      if (G.gold && usesWater) {
        for (const s of G.gold) {
          if (!s.found && G.dirt.cleanedAt(s.key, s.uv) > 0.55) {
            s.found = true;
            G.score += 500;
            G.toast = { msg: G.tr.gold, t: 2.4 };
            sndGold();
            buzz(30);
          }
        }
      }

      if (p >= (G.stageGoal || 0.99)) G.advanceStage && G.advanceStage();
    }

    /* completion celebration: water fountain + LED pulse */
    if (G.celebrateT > 0) {
      G.celebrateT -= dt;
      G.ledsHot = true;
      const sp = fxSplash.current;
      for (let i = 0; i < (isMobile ? 4 : 7) && sp; i++) {
        sp.spawn((Math.random() - 0.5) * 3.6, 1.6 + Math.random() * 0.4, (Math.random() - 0.5) * 1.8,
          (Math.random() - 0.5) * 2.6, 2.6 + Math.random() * 2.6, (Math.random() - 0.5) * 2.6,
          0.8 + Math.random() * 0.5, 0.025 + Math.random() * 0.02, 0.55);
      }
      if (G.leds) G.leds.forEach((l, i) => {
        if (l) l.material.emissiveIntensity = 5 + Math.sin(performance.now() / 90 + i * 1.7) * 3.4;
      });
    } else if (G.ledsHot) {
      G.leds && G.leds.forEach((l) => { if (l) l.material.emissiveIntensity = 5; });
      G.ledsHot = false;
    }

    /* toast timer */
    if (G.toast && (G.toast.t -= dt) <= 0) G.toast = null;
  });

  return (
    <group>
      {/* professional washer gun: lance + gold accents + grip + trigger + hose */}
      <group ref={nozzle} visible={false}>
        <mesh position={[0, 0, 0.18]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.011, 0.014, 0.5, 12]} />
          <meshStandardMaterial color="#23282d" metalness={0.9} roughness={0.28} />
        </mesh>
        <mesh position={[0, 0, 0.41]} rotation-x={Math.PI / 2}>
          <coneGeometry args={[0.017, 0.07, 12]} />
          <meshStandardMaterial color="#d5dbe0" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[0, 0, 0.36]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.018, 0.005, 8, 18]} />
          <meshStandardMaterial color="#d4af37" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.012, -0.1]} rotation-x={Math.PI / 2}>
          <capsuleGeometry args={[0.03, 0.14, 6, 12]} />
          <meshStandardMaterial color="#111418" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.012, -0.02]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.033, 0.006, 8, 18]} />
          <meshStandardMaterial color="#d4af37" metalness={0.85} roughness={0.35} />
        </mesh>
        <mesh position={[0, -0.1, -0.15]} rotation-x={0.42}>
          <boxGeometry args={[0.042, 0.15, 0.05]} />
          <meshStandardMaterial color="#0c0e10" metalness={0.5} roughness={0.5} />
        </mesh>
        <mesh position={[0, -0.065, -0.085]} rotation-x={0.3}>
          <boxGeometry args={[0.022, 0.06, 0.015]} />
          <meshStandardMaterial color="#cfd6dc" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.2, -0.22]} rotation-x={1.15}>
          <cylinderGeometry args={[0.014, 0.014, 0.18, 8]} />
          <meshStandardMaterial color="#0a0c0e" roughness={0.85} />
        </mesh>
      </group>

      {/* water: jet filaments, run-down, droplets, mist, suds, steam */}
      <FX ref={fxJet} streak count={isMobile ? 280 : 640} color="#e6f1f8" gravity={-4.5} drag={0.999} opacity={0.85} />
      <FX ref={fxRun} streak count={isMobile ? 110 : 200} color="#dfe9ee" gravity={-1.5} drag={0.965} opacity={0.6} />
      <FX ref={fxSplash} count={isMobile ? 180 : 340} color="#d5e6f2" gravity={-8.5} drag={0.985} opacity={0.8} />
      <FX ref={fxMist} count={isMobile ? 44 : 80} color="#c9d4da" blending="add" gravity={0.25} drag={0.96} grow={1.4} opacity={0.3} />
      <FX ref={fxFoam} count={isMobile ? 120 : 220} color="#f4f9fd" gravity={-0.2} drag={0.9} grow={0.7} opacity={0.7} />
      <FX ref={fxSteam} count={isMobile ? 30 : 54} color="#dfe9f2" blending="add" gravity={0.22} drag={0.97} grow={2.2} opacity={0.35} />
      <FX ref={fxSpark} count={isMobile ? 50 : 90} color="#ffe9b0" blending="add" gravity={0.1} drag={0.95} opacity={0.9} />
    </group>
  );
}
