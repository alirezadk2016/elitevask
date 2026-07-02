"use client";
/* Elite Vask – Car Wash Game
   R3F scene: premium garage, procedural car, REAL mask-based cleaning,
   pressure washer with particles, procedural audio, HUD. */

import { useEffect, useMemo, useRef, useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, ContactShadows, MeshReflectorMaterial } from "@react-three/drei";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { LEVELS, T, loadSave, storeSave, starsFor } from "@/lib/game/levels";
import { buildCar, applyShine, disposeCar } from "@/lib/game/car";
import { initAudio, setMuted, setSpray, sndClick, sndGold, sndComplete, sndStar } from "@/lib/game/audio";

const PLAY_POS = new THREE.Vector3(4.9, 2.35, 5.4);
const CAM_TARGET = new THREE.Vector3(0, 0.82, 0);

/* ---------- soft round sprite ---------- */
let _sprite = null;
function spriteTex() {
  if (_sprite) return _sprite;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.55, "rgba(255,255,255,.55)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr; g.fillRect(0, 0, 64, 64);
  _sprite = new THREE.CanvasTexture(c);
  return _sprite;
}

/* ---------- generic CPU particle pool ---------- */
const FX = forwardRef(function FX({ count = 300, color = "#ffffff", blending = "normal", gravity = -9.8, drag = 0.985, grow = 0, opacity = 1 }, ref) {
  const { gl } = useThree();
  const S = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    const life = new Float32Array(count);
    const maxLife = new Float32Array(count);
    const size = new Float32Array(count);
    const size0 = new Float32Array(count);
    const alpha = new Float32Array(count);
    const alpha0 = new Float32Array(count);
    pos.fill(0); for (let i = 0; i < count; i++) pos[i * 3 + 1] = -999;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 1, 0), 50);
    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      blending: blending === "add" ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: {
        uMap: { value: spriteTex() },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
        uDpr: { value: gl.getPixelRatio() },
      },
      vertexShader: `attribute float aSize; attribute float aAlpha; varying float vA; uniform float uDpr;
        void main(){ vA=aAlpha; vec4 mv=modelViewMatrix*vec4(position,1.0);
        gl_PointSize=aSize*uDpr*(120.0/max(0.1,-mv.z)); gl_Position=projectionMatrix*mv; }`,
      fragmentShader: `uniform sampler2D uMap; uniform vec3 uColor; uniform float uOpacity; varying float vA;
        void main(){ float a=texture2D(uMap,gl_PointCoord).a*vA*uOpacity; if(a<0.012) discard; gl_FragColor=vec4(uColor,a); }`,
    });
    return { pos, vel, life, maxLife, size, size0, alpha, alpha0, geo, mat, head: 0 };
  }, [count, color, blending, opacity, gl]);

  useEffect(() => () => { S.geo.dispose(); S.mat.dispose(); }, [S]);

  useImperativeHandle(ref, () => ({
    spawn(px, py, pz, vx, vy, vz, life, size, alpha) {
      const i = S.head; S.head = (S.head + 1) % count;
      S.pos[i * 3] = px; S.pos[i * 3 + 1] = py; S.pos[i * 3 + 2] = pz;
      S.vel[i * 3] = vx; S.vel[i * 3 + 1] = vy; S.vel[i * 3 + 2] = vz;
      S.life[i] = life; S.maxLife[i] = life;
      S.size0[i] = size; S.alpha0[i] = alpha;
    },
  }), [S, count]);

  useFrame((_, dt) => {
    const d = Math.min(dt, 0.05);
    const { pos, vel, life, maxLife, size, size0, alpha, alpha0 } = S;
    for (let i = 0; i < count; i++) {
      if (life[i] <= 0) { alpha[i] = 0; continue; }
      life[i] -= d;
      const t = 1 - life[i] / maxLife[i];
      vel[i * 3 + 1] += gravity * d;
      vel[i * 3] *= drag; vel[i * 3 + 1] *= drag; vel[i * 3 + 2] *= drag;
      pos[i * 3] += vel[i * 3] * d; pos[i * 3 + 1] += vel[i * 3 + 1] * d; pos[i * 3 + 2] += vel[i * 3 + 2] * d;
      if (pos[i * 3 + 1] < 0.015 && vel[i * 3 + 1] < 0) { pos[i * 3 + 1] = 0.015; vel[i * 3 + 1] *= -0.25; vel[i * 3] *= 0.7; vel[i * 3 + 2] *= 0.7; }
      size[i] = size0[i] * (1 + grow * t);
      alpha[i] = alpha0[i] * (t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88);
    }
    S.geo.attributes.position.needsUpdate = true;
    S.geo.attributes.aSize.needsUpdate = true;
    S.geo.attributes.aAlpha.needsUpdate = true;
  });

  return <points geometry={S.geo} material={S.mat} frustumCulled={false} renderOrder={5} />;
});

/* ---------- environment (PMREM room, no network) ---------- */
function Env() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const rt = pm.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = rt.texture;
    scene.environmentIntensity = 0.5;
    pm.dispose();
    return () => { scene.environment = null; rt.texture.dispose(); };
  }, [gl, scene]);
  return null;
}

/* ---------- garage ---------- */
function signTexture() {
  const c = document.createElement("canvas");
  c.width = 1024; c.height = 300;
  const g = c.getContext("2d");
  g.textAlign = "center";
  g.shadowColor = "rgba(64,224,140,.9)"; g.shadowBlur = 28;
  g.fillStyle = "#eafff3";
  g.font = "800 118px Manrope, Arial, sans-serif";
  g.fillText("ELITE VASK", 512, 138);
  g.shadowBlur = 12;
  g.fillStyle = "rgba(212,175,55,.95)";
  g.font = "600 38px Manrope, Arial, sans-serif";
  g.fillText("M O B I L   B I L   D A M P V A S K", 512, 224);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function Garage({ G, isMobile }) {
  const sign = useMemo(() => signTexture(), []);
  useEffect(() => () => sign.dispose(), [sign]);
  const ledRefs = useRef([]);
  useEffect(() => { G.leds = ledRefs.current.filter(Boolean); });

  const ledX = [-6.2, -2.1, 2.1, 6.2];
  return (
    <group>
      {/* floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[26, 24]} />
        {isMobile ? (
          <meshStandardMaterial color="#0b0e0c" metalness={0.55} roughness={0.3} envMapIntensity={0.7} />
        ) : (
          <MeshReflectorMaterial
            blur={[300, 90]} resolution={768} mixBlur={0.9} mixStrength={0.6}
            depthScale={0.4} minDepthThreshold={0.55} maxDepthThreshold={1.2}
            color="#0a0d0b" metalness={0.5} roughness={0.32} mirror={0.55}
          />
        )}
      </mesh>
      {/* wet patch under the car grows with progress */}
      <Puddle G={G} />

      {/* walls + ceiling */}
      <mesh position={[0, 2.9, -8]}><boxGeometry args={[26, 6, 0.3]} /><meshStandardMaterial color="#10130f" roughness={0.9} /></mesh>
      <mesh position={[-10, 2.9, 0]}><boxGeometry args={[0.3, 6, 24]} /><meshStandardMaterial color="#0e110e" roughness={0.9} /></mesh>
      <mesh position={[10, 2.9, 0]}><boxGeometry args={[0.3, 6, 24]} /><meshStandardMaterial color="#0e110e" roughness={0.9} /></mesh>
      <mesh position={[0, 5.9, 0]} rotation-x={Math.PI / 2}><planeGeometry args={[26, 24]} /><meshStandardMaterial color="#070907" roughness={1} /></mesh>

      {/* neon sign */}
      <mesh position={[0, 3.7, -7.82]}>
        <planeGeometry args={[6.4, 1.85]} />
        <meshBasicMaterial map={sign} transparent toneMapped={false} />
      </mesh>

      {/* vertical LED bars */}
      {ledX.map((x, i) => (
        <group key={i} position={[x, 2.2, -7.8]}>
          <mesh ref={(el) => { if (el) ledRefs.current[i] = el; }}>
            <boxGeometry args={[0.09, 3.4, 0.09]} />
            <meshStandardMaterial color="#dfffef" emissive="#c8ffe0" emissiveIntensity={2.1} toneMapped={false} />
          </mesh>
          <pointLight color="#7dffb0" intensity={4.5} distance={6} decay={2} />
        </group>
      ))}

      {/* ceiling light bars + fake volumetric cones */}
      {[-1.9, 1.9].map((x, i) => (
        <group key={i}>
          <mesh position={[x, 5.55, 0.4]}><boxGeometry args={[3.2, 0.07, 0.5]} /><meshStandardMaterial color="#fff" emissive="#f2fff8" emissiveIntensity={1.6} toneMapped={false} /></mesh>
          <mesh position={[x, 3.4, 0.4]}>
            <coneGeometry args={[2.1, 4.4, 24, 1, true]} />
            <meshBasicMaterial color="#bfffd9" transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      ))}

      {/* props */}
      {[[-8.2, -6.4], [-7.4, -6.6], [-7.8, -5.6]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.42, z]} castShadow>
          <cylinderGeometry args={[0.34, 0.34, 0.84, 16]} />
          <meshStandardMaterial color={i === 1 ? "#173523" : "#12271b"} metalness={0.4} roughness={0.5} />
        </mesh>
      ))}
      <mesh position={[8.4, 1.05, -6.9]} castShadow><boxGeometry args={[1.8, 2.1, 0.7]} /><meshStandardMaterial color="#131712" metalness={0.5} roughness={0.55} /></mesh>

      {/* lights */}
      <ambientLight intensity={0.32} />
      <hemisphereLight args={["#20291f", "#0a0d0a", 0.5]} />
      <spotLight position={[3.4, 5.2, 3.2]} angle={0.8} penumbra={0.6} intensity={300} decay={1.7} color="#f4fff8" castShadow={!isMobile} shadow-mapSize={[1024, 1024]} shadow-bias={-0.0002} />
      <spotLight position={[-4.2, 4.6, -2.6]} angle={0.9} penumbra={0.7} intensity={130} decay={1.7} color="#cfe8dd" />
    </group>
  );
}

function Puddle({ G }) {
  const ref = useRef();
  useFrame(() => {
    if (!ref.current) return;
    const s = 1.4 + G.progress * 2.6;
    ref.current.scale.set(s, s, 1);
    ref.current.material.opacity = 0.05 + G.progress * 0.22;
  });
  return (
    <mesh ref={ref} rotation-x={-Math.PI / 2} position={[0, 0.006, 0]}>
      <circleGeometry args={[1.6, 40]} />
      <meshStandardMaterial color="#03110b" transparent opacity={0.05} roughness={0.05} metalness={0.6} />
    </mesh>
  );
}

/* ---------- car ---------- */
function CarRig({ G, levelIdx, attempt }) {
  const level = LEVELS[levelIdx];
  const car = useMemo(() => buildCar(level), [level, attempt]);
  useEffect(() => {
    G.car = car; G.progress = 0;
    G.carMeshes = car.panels.map((p) => p.mesh);
    return () => { if (G.car === car) { G.car = null; G.carMeshes = []; } disposeCar(car); };
  }, [car, G]);
  useFrame(() => applyShine(car.mats, G.progress));
  return <primitive object={car.group} />;
}

/* ---------- camera rig ----------
   OrbitControls listens on the R3F wrapper div (canvas parent), so the spray
   handler on the canvas itself can stopPropagation() when the press lands on
   the car – washing wins, dragging the background orbits. */
function Rig({ G }) {
  const ref = useRef();
  const { camera, gl } = useThree();
  const wrapper = gl.domElement.parentNode || gl.domElement;
  useEffect(() => { G.controls = ref.current; });
  useFrame((_, dt) => {
    const c = ref.current; if (!c) return;
    c.autoRotate = G.phase === "menu";
    c.autoRotateSpeed = 0.8;
    if (G.introT > 0 || G.camReset) {
      const k = 1 - Math.pow(0.002, dt);
      camera.position.lerp(PLAY_POS, k);
      c.target.lerp(CAM_TARGET, k);
      if (G.introT > 0) G.introT -= dt;
      if (G.camReset && camera.position.distanceTo(PLAY_POS) < 0.06) G.camReset = false;
    }
    c.update();
  });
  return (
    <OrbitControls ref={ref} makeDefault domElement={wrapper} enableDamping dampingFactor={0.09} enablePan={false}
      minDistance={2.7} maxDistance={8.2} maxPolarAngle={1.44} target={[0, 0.82, 0]} />
  );
}

/* ---------- washer: nozzle + jet + the whole game loop ---------- */
function Washer({ G, isMobile }) {
  const { gl, camera } = useThree();
  const nozzle = useRef();
  const beamCore = useRef();
  const beamCone = useRef();
  const glow = useRef();
  const fxSplash = useRef();
  const fxMist = useRef();
  const fxFoam = useRef();
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const tmp = useMemo(() => ({
    v1: new THREE.Vector3(), v2: new THREE.Vector3(), v3: new THREE.Vector3(),
    q: new THREE.Quaternion(), down: new THREE.Vector3(0, -1, 0), acc: 0,
  }), []);

  /* pointer input – capture phase so we beat OrbitControls to it */
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
      if (G.phase !== "playing" || G.introT > 0) return;
      ray.setFromCamera(G.pointer, camera);
      const hits = ray.intersectObjects(G.carMeshes || [], false);
      if (hits.length) {
        G.spraying = true;
        // keep the press away from OrbitControls (attached on the wrapper)
        e.stopPropagation();
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
    const playing = G.phase === "playing" && G.introT <= 0;
    if (playing) G.time += dt;

    /* water tank */
    const wantsSpray = G.spraying && playing && !G.before;
    let spraying = wantsSpray && G.water > 0.5 && !G.tankLock;
    if (wantsSpray && G.water <= 0.5) G.tankLock = true;
    if (G.tankLock && G.water > 20) G.tankLock = false;
    G.water = Math.max(0, Math.min(100, G.water + (spraying ? -13 : 20) * dt));

    /* aim – one raycast per frame */
    ray.setFromCamera(G.pointer, camera);
    let hit = null;
    if (spraying && G.car) {
      const hits = ray.intersectObjects(G.carMeshes || [], false);
      if (hits.length) hit = hits[0];
    }

    /* nozzle anchored to camera like an FPS tool */
    const noz = nozzle.current;
    if (noz) {
      noz.visible = G.phase !== "menu";
      tmp.v1.set(0.5, -0.42, -1.05).applyMatrix4(camera.matrixWorld);
      noz.position.copy(tmp.v1);
      noz.lookAt(hit ? hit.point : ray.ray.at(7, tmp.v2));
      noz.updateMatrixWorld();
    }

    /* jet visuals + painting + FX */
    const tip = tmp.v1;
    if (noz) noz.localToWorld(tip.set(0, 0, 0.3)); // nozzle tip world pos
    const showJet = spraying;
    if (beamCore.current) beamCore.current.visible = showJet;
    if (beamCone.current) beamCone.current.visible = showJet;
    if (glow.current) glow.current.visible = !!(showJet && hit);

    if (showJet) {
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
        const key = hit.object.userData.panelKey;
        if (key && hit.uv && G.car) {
          const brush = 0.1 + dist * 0.016;
          const strength = Math.max(0.35, Math.min(1, 1.15 - dist * 0.09));
          G.car.dirt.paint(key, hit.uv, brush, strength);
        }
        if (glow.current) {
          glow.current.position.copy(hit.point).addScaledVector(hit.face ? hit.face.normal : tmp.down, 0.03);
          const s = 0.16 + Math.random() * 0.05;
          glow.current.scale.set(s, s, s);
        }
        /* splash + mist + foam */
        const n = hit.face ? tmp.v2.copy(hit.face.normal).transformDirection(hit.object.matrixWorld) : tmp.v2.set(0, 1, 0);
        const p = hit.point;
        const sp = fxSplash.current, mi = fxMist.current, fo = fxFoam.current;
        const burst = isMobile ? 3 : 5;
        for (let i = 0; i < burst && sp; i++) {
          sp.spawn(
            p.x + n.x * 0.02, p.y + n.y * 0.02, p.z + n.z * 0.02,
            n.x * (1 + Math.random() * 1.6) + (Math.random() - 0.5) * 1.8,
            n.y * (1 + Math.random() * 1.4) + Math.random() * 1.2,
            n.z * (1 + Math.random() * 1.6) + (Math.random() - 0.5) * 1.8,
            0.3 + Math.random() * 0.15, 6 + Math.random() * 6, 0.55);
        }
        for (let i = 0; i < 2 && mi; i++) {
          mi.spawn(p.x, p.y + 0.04, p.z,
            (Math.random() - 0.5) * 0.5, 0.3 + Math.random() * 0.4, (Math.random() - 0.5) * 0.5,
            0.7 + Math.random() * 0.4, 26 + Math.random() * 22, 0.13);
        }
        for (let i = 0; i < (isMobile ? 2 : 3) && fo; i++) {
          fo.spawn(
            p.x + (Math.random() - 0.5) * 0.16 + n.x * 0.02,
            p.y + (Math.random() - 0.5) * 0.16 + n.y * 0.02,
            p.z + (Math.random() - 0.5) * 0.16 + n.z * 0.02,
            0, -0.05, 0, 1.3 + Math.random() * 0.7, 10 + Math.random() * 12, 0.8);
        }
      }
    } else {
      setSpray(false);
    }

    /* progress sampling / scoring */
    tmp.acc += dt;
    if (tmp.acc > 0.3 && G.car && playing) {
      tmp.acc = 0;
      const before = G.progress;
      const { progress, gold } = G.car.dirt.sample();
      G.progress = progress;
      const delta = progress - before;
      if (delta > 0.0004) {
        G.combo = Math.min(5, G.combo + delta * 26);
        G.score += Math.round(delta * 9000 * G.combo);
      } else {
        G.combo = Math.max(1, G.combo - 0.22);
      }
      for (const _ of gold) {
        G.score += 500;
        G.toast = { msg: G.tr.goldFound, t: 2.4 };
        sndGold();
      }
      if (progress >= 0.995) G.finish();
    }

    /* celebration fountain */
    if (G.celebrateT > 0) {
      G.celebrateT -= dt;
      const sp = fxSplash.current;
      const H = G.car ? G.car.bounds.H : 1.4;
      for (let i = 0; i < 10 && sp; i++) {
        sp.spawn((Math.random() - 0.5) * 3.4, H + 0.3, (Math.random() - 0.5) * 1.6,
          (Math.random() - 0.5) * 2.4, 2.6 + Math.random() * 2.6, (Math.random() - 0.5) * 2.4,
          0.9 + Math.random() * 0.6, 7 + Math.random() * 7, 0.7);
      }
      if (G.leds) G.leds.forEach((l, i) => {
        l.material.emissiveIntensity = 2.1 + Math.sin(performance.now() / 90 + i * 1.7) * 1.5;
      });
    } else if (G.ledsHot) {
      G.leds && G.leds.forEach((l) => { l.material.emissiveIntensity = 2.1; });
      G.ledsHot = false;
    }
    if (G.celebrateT > 0) G.ledsHot = true;

    /* toast timer */
    if (G.toast && (G.toast.t -= dt) <= 0) G.toast = null;
  });

  return (
    <group>
      {/* nozzle */}
      <group ref={nozzle} visible={false}>
        <mesh position={[0, 0, 0.12]} rotation-x={Math.PI / 2}><cylinderGeometry args={[0.02, 0.026, 0.3, 12]} /><meshStandardMaterial color="#15181b" metalness={0.8} roughness={0.35} /></mesh>
        <mesh position={[0, 0, 0.29]} rotation-x={Math.PI / 2}><coneGeometry args={[0.013, 0.06, 10]} /><meshStandardMaterial color="#cfd6dc" metalness={1} roughness={0.25} /></mesh>
        <mesh position={[0, -0.07, -0.05]} rotation-x={0.5}><boxGeometry args={[0.034, 0.12, 0.045]} /><meshStandardMaterial color="#0f1113" metalness={0.6} roughness={0.5} /></mesh>
      </group>

      {/* jet beams: tip at group origin, extending -Y, scaled per frame.
          Inner meshes sit at y=-0.5 so the unit cylinder hangs below the origin. */}
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
        <meshBasicMaterial color="#cfeaff" transparent opacity={0.5} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>

      <FX ref={fxSplash} count={isMobile ? 220 : 420} color="#bfe2f8" gravity={-8.5} drag={0.985} opacity={0.95} />
      <FX ref={fxMist} count={isMobile ? 90 : 160} color="#a8d8f5" blending="add" gravity={0.35} drag={0.96} grow={2.4} opacity={0.8} />
      <FX ref={fxFoam} count={isMobile ? 200 : 380} color="#f6fbff" gravity={-0.22} drag={0.9} grow={0.7} opacity={0.95} />
    </group>
  );
}

/* ================= main component ================= */
export default function CarWashGame() {
  const [lang] = useState(() => {
    try { return localStorage.getItem("lang") === "en" ? "en" : "da"; } catch { return "da"; }
  });
  const tr = T[lang];
  const isMobile = useMemo(() =>
    typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 820), []);

  const [phase, setPhase] = useState("menu");
  const [levelIdx, setLevelIdx] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [save, setSave] = useState(() => loadSave());
  const [muted, setMutedState] = useState(() => { try { return localStorage.getItem("ev_game_mute") === "1"; } catch { return false; } });
  const [result, setResult] = useState(null);
  const [hud, setHud] = useState({ progress: 0, water: 100, time: 0, score: 0, combo: 1, toast: null, tankLock: false });

  const G = useRef(null);
  if (!G.current) {
    G.current = {
      phase: "menu", introT: 0, camReset: false,
      pointer: new THREE.Vector2(), spraying: false, before: false,
      water: 100, tankLock: false, time: 0, score: 0, combo: 1, progress: 0,
      car: null, carMeshes: [], controls: null, leds: [], toast: null, celebrateT: 0,
      tr, finish: () => {},
    };
  }
  const g = G.current;
  g.phase = phase;
  g.tr = tr;

  /* finish handler */
  useEffect(() => {
    g.finish = () => {
      if (g.phase !== "playing") return;
      const level = LEVELS[levelIdx];
      const secs = Math.round(g.time);
      const stars = starsFor(level, secs);
      const bonus = Math.max(0, Math.round((level.time2 * 1.2 - secs) * 9));
      g.score += bonus + 1500;
      g.celebrateT = 3.2;
      g.spraying = false;
      const sc = Math.round(g.score);
      const prevBest = save.best[level.id];
      const newBest = !prevBest || sc > prevBest.score;
      const nextSave = {
        unlocked: Math.max(save.unlocked, Math.min(LEVELS.length, level.id + 1)),
        best: { ...save.best, [level.id]: newBest ? { score: sc, stars: Math.max(stars, prevBest?.stars || 0), time: secs } : prevBest },
      };
      setSave(nextSave); storeSave(nextSave);
      setResult({ stars, score: sc, time: secs, bonus, newBest, hasNext: level.id < LEVELS.length });
      setPhase("complete");
      sndComplete();
      let i = 0;
      const int = setInterval(() => { sndStar(i); if (++i >= stars) clearInterval(int); }, 420);
    };
  }, [levelIdx, save, g]);

  /* HUD sync loop */
  useEffect(() => {
    const id = setInterval(() => {
      setHud({
        progress: g.progress, water: g.water, time: g.time, score: Math.round(g.score),
        combo: g.combo, toast: g.toast ? g.toast.msg : null, tankLock: g.tankLock,
      });
    }, 160);
    return () => clearInterval(id);
  }, [g]);

  useEffect(() => { setMuted(muted); }, [muted]);

  const startLevel = useCallback((i) => {
    sndClick(); initAudio();
    g.water = 100; g.time = 0; g.score = 0; g.combo = 1; g.progress = 0;
    g.tankLock = false; g.toast = null; g.celebrateT = 0; g.introT = 1.6; g.spraying = false;
    setLevelIdx(i); setAttempt((a) => a + 1); setResult(null); setPhase("playing");
  }, [g]);

  const toMenu = useCallback(() => { sndClick(); setPhase("menu"); setResult(null); }, []);

  const level = LEVELS[levelIdx];
  const pct = Math.min(100, Math.round(hud.progress * 100 + 0.2));
  const canFinish = hud.progress >= 0.97 && phase === "playing";
  const timeStars = phase === "playing" ? (hud.time <= level.time3 ? 3 : hud.time <= level.time2 ? 2 : 1) : 0;
  const mm = String(Math.floor(hud.time / 60)).padStart(1, "0");
  const ss = String(Math.floor(hud.time % 60)).padStart(2, "0");

  return (
    <div className="gp-wrap">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 2]}
        shadows={!isMobile}
        camera={{ position: [6, 2.6, 6.4], fov: 42 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#050706"]} />
        <fogExp2 attach="fog" args={["#060907", 0.042]} />
        <Env />
        <Garage G={g} isMobile={isMobile} />
        <CarRig G={g} levelIdx={levelIdx} attempt={attempt} />
        <ContactShadows key={`${levelIdx}-${attempt}`} position={[0, 0.012, 0]} scale={10} blur={2.6} far={2.2} opacity={0.6} frames={1} />
        <Washer G={g} isMobile={isMobile} />
        <Rig G={g} />
      </Canvas>

      {/* ---------- HUD ---------- */}
      {phase === "playing" && (
        <>
          <div className="gp-hud gp-topleft">
            <div className="gp-label">{tr.progress}</div>
            <div className="gp-progress-row">
              <span className="gp-pct">{pct}%</span>
              <span className="gp-stars">{[1, 2, 3].map((i) => (
                <svg key={i} viewBox="0 0 24 24" className={i <= timeStars ? "on" : ""} width="17" height="17"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="currentColor" /></svg>
              ))}</span>
            </div>
            <div className="gp-pbar"><i style={{ width: `${pct}%` }} /></div>
          </div>

          <div className="gp-hud gp-topright">
            <div className="gp-stat"><span className="gp-k">{tr.water}</span>
              <span className="gp-water"><i style={{ width: `${Math.round(hud.water)}%` }} /></span>
            </div>
            <div className="gp-stat"><span className="gp-k">{tr.time}</span><span className="gp-v">{mm}:{ss}</span></div>
            <div className="gp-stat"><span className="gp-k">{tr.score}</span><span className="gp-v gp-score">{hud.score.toLocaleString("da-DK")}</span></div>
            <div className="gp-stat"><span className="gp-k">{tr.combo}</span><span className="gp-v gp-combo">×{hud.combo.toFixed(1)}</span></div>
          </div>

          {(hud.toast || hud.tankLock) && (
            <div className="gp-toast">{hud.toast || tr.waterLow}</div>
          )}

          <div className="gp-hint">{isMobile ? tr.hint_mobile : tr.hint_desktop}</div>

          {canFinish && (
            <button className="gp-finish" onClick={() => { sndClick(); g.finish(); }}>
              ✦ {tr.finish}
            </button>
          )}

          <div className="gp-tools">
            <button className="gp-tool" aria-label={tr.menu} title={tr.menu} onClick={toMenu}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
            </button>
            <button className="gp-tool" aria-label={tr.resetCam} title={tr.resetCam} onClick={() => { sndClick(); g.camReset = true; }}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
            </button>
            <button className="gp-tool" aria-label={tr.beforeAfter} title={tr.beforeAfter}
              onPointerDown={() => { g.before = true; if (g.car) g.car.dirt.setBeforeView(true, g.car.overlays); }}
              onPointerUp={() => { g.before = false; if (g.car) g.car.dirt.setBeforeView(false, g.car.overlays); }}
              onPointerLeave={() => { if (g.before) { g.before = false; if (g.car) g.car.dirt.setBeforeView(false, g.car.overlays); } }}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18" /><path d="M5 8c3 0 4 2 7 2M5 16c3 0 4-2 7-2" opacity=".6" /><circle cx="18" cy="12" r="3" /></svg>
            </button>
            <button className="gp-tool" aria-label={tr.mute} title={tr.mute} onClick={() => { const m = !muted; setMutedState(m); try { localStorage.setItem("ev_game_mute", m ? "1" : "0"); } catch {} sndClick(); }}>
              {muted ? (
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" /></svg>
              )}
            </button>
          </div>
        </>
      )}

      {/* ---------- level select ---------- */}
      {phase === "menu" && (
        <div className="gp-overlay">
          <div className="gp-panel">
            <div className="gp-eyebrow">Elite Vask</div>
            <h1 className="gp-title">{tr.title}</h1>
            <p className="gp-sub">{tr.tagline}</p>
            <div className="gp-levels">
              {LEVELS.map((lv, i) => {
                const locked = lv.id > save.unlocked;
                const best = save.best[lv.id];
                return (
                  <button key={lv.id} className={`gp-level${locked ? " locked" : ""}`} disabled={locked}
                    onClick={() => startLevel(i)}>
                    <span className="gp-lv-num">{lv.id}</span>
                    <span className="gp-lv-name">{lv.name[lang]}</span>
                    <span className="gp-lv-meta">
                      {locked ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                      ) : best ? (
                        <>
                          <span className="gp-lv-stars">{"★".repeat(best.stars)}{"☆".repeat(3 - best.stars)}</span>
                          <span className="gp-lv-best">{best.score.toLocaleString("da-DK")}</span>
                        </>
                      ) : (
                        <span className="gp-lv-new">NY</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="gp-note">{isMobile ? tr.hint_mobile : tr.hint_desktop}</p>
          </div>
        </div>
      )}

      {/* ---------- success ---------- */}
      {phase === "complete" && result && (
        <div className="gp-overlay gp-complete">
          <div className="gp-panel">
            <div className="gp-big-stars">
              {[1, 2, 3].map((i) => (
                <svg key={i} viewBox="0 0 24 24" className={i <= result.stars ? "on" : ""} style={{ animationDelay: `${0.35 + i * 0.42}s` }} width="52" height="52"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="currentColor" /></svg>
              ))}
            </div>
            <h2 className="gp-title">{tr.complete}</h2>
            <p className="gp-sub">{tr.completeSub}</p>
            <div className="gp-result">
              <div><span>{tr.score}</span><strong>{result.score.toLocaleString("da-DK")}</strong></div>
              <div><span>{tr.time}</span><strong>{Math.floor(result.time / 60)}:{String(result.time % 60).padStart(2, "0")}</strong></div>
              {result.newBest && <div className="gp-newbest">{tr.newBest}</div>}
            </div>
            <div className="gp-actions">
              <a href="/#vaelg" className="btn btn-green btn-lg gp-book">{tr.bookCta}</a>
              <div className="gp-actions-row">
                <button className="btn gp-ghost" onClick={() => startLevel(levelIdx)}>{tr.restart}</button>
                {result.hasNext && LEVELS[levelIdx + 1].id <= save.unlocked && (
                  <button className="btn gp-ghost" onClick={() => startLevel(levelIdx + 1)}>{tr.next}</button>
                )}
                <button className="btn gp-ghost" onClick={toMenu}>{tr.menu}</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
