"use client";
/* Pressure washer + game loop.
   Press & hold ON THE CAR to spray (the press never reaches OrbitControls,
   which listens on the canvas wrapper). The jet paints the dirt masks at the
   raycast UV and drives particles, audio, the water tank, the mission timer,
   score/combo, golden-dirt pickup and the completion celebration. */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { FX } from "./fx";
import { initAudio, setSpray, sndGold, sndCombo } from "@/lib/game/audio";

const buzz = (p) => { try { navigator.vibrate && navigator.vibrate(p); } catch {} };

export default function Washer({ G, isMobile }) {
  const { gl, camera } = useThree();
  const nozzle = useRef();
  const beamCore = useRef();
  const beamCone = useRef();
  const glow = useRef();
  const fxSplash = useRef();
  const fxMist = useRef();
  const fxFoam = useRef();
  const fxSteam = useRef();
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const tmp = useMemo(() => ({
    v1: new THREE.Vector3(), v2: new THREE.Vector3(), v3: new THREE.Vector3(),
    q: new THREE.Quaternion(), down: new THREE.Vector3(0, -1, 0), acc: 0,
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
      if (G.phase !== "playing" || G.done || !G.carMeshes.length) return;
      ray.setFromCamera(G.pointer, camera);
      if (ray.intersectObjects(G.carMeshes, false).length) {
        G.spraying = true;
        G.hasSprayed = true;
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
      for (const f of [fxSplash, fxMist, fxFoam, fxSteam]) f.current && f.current.clear();
    }

    /* mission timer runs from the first spray */
    if (playing && G.hasSprayed) G.time += Math.min(rawDt, 0.25);

    /* water tank */
    const wantsSpray = G.spraying && playing;
    let spraying = wantsSpray && G.water > 0.5 && !G.tankLock;
    if (wantsSpray && G.water <= 0.5) G.tankLock = true;
    if (G.tankLock && G.water > 18) G.tankLock = false;
    G.water = Math.max(0, Math.min(100, G.water + (spraying ? -11 : 22) * dt));

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

    const tip = tmp.v1;
    if (noz) noz.localToWorld(tip.set(0, 0, 0.3));
    if (beamCore.current) beamCore.current.visible = spraying;
    if (beamCone.current) beamCone.current.visible = spraying;
    if (glow.current) glow.current.visible = !!(spraying && hit);

    if (spraying) {
      const target = hit ? hit.point : ray.ray.at(9, tmp.v2);
      const dir = tmp.v3.copy(target).sub(tip);
      const dist = Math.max(0.3, dir.length());
      dir.normalize();
      tmp.q.setFromUnitVectors(tmp.down, dir);
      for (const b of [beamCore.current, beamCone.current]) {
        if (!b) continue;
        b.position.copy(tip);
        b.quaternion.copy(tmp.q);
        b.scale.set(1, dist, 1);
      }
      setSpray(true, dist);

      if (hit) {
        const key = hit.object.userData.dirtKey;
        if (key && hit.uv && G.dirt) {
          const brush = 0.09 + dist * 0.014;
          const strength = Math.max(0.28, Math.min(1, 1.15 - dist * 0.09)) * (G.scrub || 1);
          G.dirt.paint(key, hit.uv, brush, strength);
        }
        if (glow.current) {
          glow.current.position.copy(hit.point).addScaledVector(hit.face ? hit.face.normal : tmp.down, 0.03);
          const s = 0.08 + Math.random() * 0.03;
          glow.current.scale.set(s, s, s);
        }
        const n = hit.face
          ? tmp.v2.copy(hit.face.normal).transformDirection(hit.object.matrixWorld)
          : tmp.v2.set(0, 1, 0);
        const p = hit.point;
        const sp = fxSplash.current, mi = fxMist.current, fo = fxFoam.current, stm = fxSteam.current;
        for (let i = 0, N = isMobile ? 3 : 5; i < N && sp; i++) {
          sp.spawn(
            p.x + n.x * 0.02, p.y + n.y * 0.02, p.z + n.z * 0.02,
            n.x * (1 + Math.random() * 1.6) + (Math.random() - 0.5) * 1.8,
            n.y * (1 + Math.random() * 1.4) + Math.random() * 1.2,
            n.z * (1 + Math.random() * 1.6) + (Math.random() - 0.5) * 1.8,
            0.3 + Math.random() * 0.15, 6 + Math.random() * 6, 0.55);
        }
        if (mi && Math.random() < 0.5) {
          mi.spawn(p.x, p.y + 0.04, p.z,
            (Math.random() - 0.5) * 0.4, 0.25 + Math.random() * 0.3, (Math.random() - 0.5) * 0.4,
            0.45 + Math.random() * 0.25, 13 + Math.random() * 9, 0.05);
        }
        for (let i = 0, N = isMobile ? 1 : 2; i < N && fo; i++) {
          fo.spawn(
            p.x + (Math.random() - 0.5) * 0.15 + n.x * 0.02,
            p.y + (Math.random() - 0.5) * 0.15 + n.y * 0.02,
            p.z + (Math.random() - 0.5) * 0.15 + n.z * 0.02,
            0, -0.05, 0, 1.0 + Math.random() * 0.5, 5 + Math.random() * 6, 0.42);
        }
        // steam wisps off freshly washed panels
        if (stm && Math.random() < 0.22) {
          stm.spawn(p.x + (Math.random() - 0.5) * 0.1, p.y + 0.05, p.z + (Math.random() - 0.5) * 0.1,
            (Math.random() - 0.5) * 0.15, 0.5 + Math.random() * 0.35, (Math.random() - 0.5) * 0.15,
            1.0 + Math.random() * 0.5, 16 + Math.random() * 10, 0.07);
        }
      }
    } else {
      setSpray(false);
    }

    /* progress sampling + scoring + golden dirt */
    tmp.acc += dt;
    if (tmp.acc > 0.3 && G.dirt && playing) {
      tmp.acc = 0;
      const before = G.progress;
      const p = G.dirt.sample();
      G.progress = p;
      const delta = p - before;
      const comboWas = Math.floor(G.combo);
      if (delta > 0.0004) {
        G.combo = Math.min(5, G.combo + delta * 26);
        G.score += Math.round(delta * 9000 * G.combo);
      } else {
        G.combo = Math.max(1, G.combo - 0.22);
      }
      G.comboMax = Math.max(G.comboMax || 1, G.combo);
      if (Math.floor(G.combo) > comboWas) { sndCombo(Math.floor(G.combo)); buzz(8); }
      if (G.gold) {
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
      if (p >= 0.99) G.finish && G.finish();
    }

    /* completion celebration: water fountain + LED pulse */
    if (G.celebrateT > 0) {
      G.celebrateT -= dt;
      G.ledsHot = true;
      const sp = fxSplash.current;
      for (let i = 0; i < (isMobile ? 4 : 7) && sp; i++) {
        sp.spawn((Math.random() - 0.5) * 3.6, 1.6 + Math.random() * 0.4, (Math.random() - 0.5) * 1.8,
          (Math.random() - 0.5) * 2.6, 2.6 + Math.random() * 2.6, (Math.random() - 0.5) * 2.6,
          0.8 + Math.random() * 0.5, 5 + Math.random() * 5, 0.55);
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
      <group ref={nozzle} visible={false}>
        <mesh position={[0, 0, 0.12]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.02, 0.026, 0.3, 12]} />
          <meshStandardMaterial color="#15181b" metalness={0.8} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, 0.29]} rotation-x={Math.PI / 2}>
          <coneGeometry args={[0.013, 0.06, 10]} />
          <meshStandardMaterial color="#cfd6dc" metalness={1} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.07, -0.05]} rotation-x={0.5}>
          <boxGeometry args={[0.034, 0.12, 0.045]} />
          <meshStandardMaterial color="#0f1113" metalness={0.6} roughness={0.5} />
        </mesh>
      </group>

      <group ref={beamCore} visible={false}>
        <mesh position={[0, -0.5, 0]} frustumCulled={false} renderOrder={4}>
          <cylinderGeometry args={[0.009, 0.022, 1, 8, 1, true]} />
          <meshBasicMaterial color="#eaf7ff" transparent opacity={0.85} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      <group ref={beamCone} visible={false}>
        <mesh position={[0, -0.5, 0]} frustumCulled={false} renderOrder={4}>
          <cylinderGeometry args={[0.014, 0.06, 1, 10, 1, true]} />
          <meshBasicMaterial color="#8fd0ff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      </group>
      <mesh ref={glow} visible={false} frustumCulled={false} renderOrder={5}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshBasicMaterial color="#cfeaff" transparent opacity={0.26} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <FX ref={fxSplash} count={isMobile ? 200 : 400} color="#bfe2f8" gravity={-8.5} drag={0.985} opacity={0.9} />
      <FX ref={fxMist} count={isMobile ? 44 : 80} color="#9fcdea" blending="add" gravity={0.3} drag={0.96} grow={1.3} opacity={0.35} />
      <FX ref={fxFoam} count={isMobile ? 150 : 280} color="#f6fbff" gravity={-0.22} drag={0.9} grow={0.6} opacity={0.85} />
      <FX ref={fxSteam} count={isMobile ? 30 : 54} color="#dfe9f2" blending="add" gravity={0.22} drag={0.97} grow={2.2} opacity={0.4} />
    </group>
  );
}
