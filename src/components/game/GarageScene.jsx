"use client";
/* Elite Vask – Car Wash Game, PHASE 1: environment + car only.
   Ultra-modern detailing garage (matte black concrete, wet reflective floor,
   blue LED strips, illuminated Elite Vask logo, garage props, volumetric
   light, HDRI reflections, bloom/AO) around a realistic Ferrari glTF.
   No gameplay in this phase.

   Car model: "Ferrari 458 Italia" by vicent091036 (from the official
   three.js examples). Draco decoders served locally from /draco/gltf/. */

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, useProgress, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, N8AO, Vignette, SMAA } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const CAR_URL = "/game/ferrari.glb";
const DRACO = "/draco/gltf/";
const CAM_HOME = new THREE.Vector3(5.4, 1.7, 5.8);
const CAM_INTRO = new THREE.Vector3(9.5, 2.9, 10.5);
const TARGET = new THREE.Vector3(0, 0.65, 0);

/* ---------- the car ---------- */
function Car() {
  const { scene } = useGLTF(CAR_URL, DRACO);
  const ao = useTexture("/game/ferrari_ao.png");

  const car = useMemo(() => {
    const root = scene;
    const body = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#0e4d2c"), // Elite emerald
      metalness: 0.9, roughness: 0.28,
      clearcoat: 1.0, clearcoatRoughness: 0.04,
      envMapIntensity: 1.6,
    });
    const details = new THREE.MeshStandardMaterial({
      color: "#e8ecef", metalness: 1.0, roughness: 0.28, envMapIntensity: 1.4,
    });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#ffffff", metalness: 0.25, roughness: 0.14,
      transmission: 1.0, transparent: true, envMapIntensity: 0.45,
    });
    root.traverse((o) => {
      if (!o.isMesh) return;
      o.castShadow = true;
      if (o.name === "body") o.material = body;
      else if (["rim_fl", "rim_fr", "rim_rr", "rim_rl", "trim"].includes(o.name)) o.material = details;
      else if (o.name === "glass") o.material = glass;
      else if (o.material && o.material.color) {
        // tame the bright leather interior so the open cabin doesn't blow out
        o.material = o.material.clone();
        o.material.color.multiplyScalar(0.5);
        if (o.material.roughness !== undefined) o.material.roughness = Math.min(1, o.material.roughness + 0.25);
        o.material.envMapIntensity = 0.6;
      }
    });
    return root;
  }, [scene]);

  return (
    <group rotation-y={Math.PI * 0.62}>
      <primitive object={car} />
      {/* baked soft shadow under the chassis (from the official demo) */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.003, 0]} renderOrder={2}>
        <planeGeometry args={[4.6, 4.6]} />
        <meshBasicMaterial map={ao} blending={THREE.MultiplyBlending} premultipliedAlpha transparent opacity={0.8} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}
useGLTF.preload(CAR_URL, DRACO);

/* ---------- illuminated logo ---------- */
function logoTexture() {
  const c = document.createElement("canvas");
  c.width = 2048; c.height = 512;
  const g = c.getContext("2d");
  g.textAlign = "center";
  g.shadowColor = "rgba(80,255,170,.95)"; g.shadowBlur = 46;
  g.fillStyle = "#f2fff8";
  g.font = "800 220px Manrope, Arial, sans-serif";
  g.fillText("ELITE VASK", 1024, 262);
  g.shadowColor = "rgba(212,175,55,.8)"; g.shadowBlur = 22;
  g.fillStyle = "rgba(226,196,110,.96)";
  g.font = "600 64px Manrope, Arial, sans-serif";
  g.fillText("P R E M I U M   D E T A I L I N G", 1024, 404);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/* ---------- garage props (props may be simple; the car may not) ---------- */
function Shelf({ position, rotation = 0 }) {
  const bottleCols = ["#2fae66", "#d4af37", "#3da8ff", "#e0e4e8", "#2fae66", "#8a5cd6"];
  return (
    <group position={position} rotation-y={rotation}>
      {[-1.1, 1.1].map((x) => [0.02, 0.02].map((_, i) => (
        <mesh key={x + "-" + i} position={[x, 1, i === 0 ? -0.32 : 0.32]} castShadow>
          <boxGeometry args={[0.06, 2, 0.06]} />
          <meshStandardMaterial color="#15181c" metalness={0.7} roughness={0.4} />
        </mesh>
      )))}
      {[0.45, 1.15, 1.85].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow>
          <boxGeometry args={[2.4, 0.05, 0.8]} />
          <meshStandardMaterial color="#1b1f24" metalness={0.6} roughness={0.5} />
        </mesh>
      ))}
      {bottleCols.map((col, i) => (
        <mesh key={i} position={[-0.95 + i * 0.38, (i % 2 ? 1.15 : 1.85) + 0.17, (i % 3 - 1) * 0.18]} castShadow>
          <cylinderGeometry args={[0.07, 0.08, 0.3, 10]} />
          <meshStandardMaterial color={col} roughness={0.35} metalness={0.15} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={"b" + i} position={[-0.7 + i * 0.7, 0.45 + 0.13, 0]} castShadow>
          <boxGeometry args={[0.42, 0.26, 0.5]} />
          <meshStandardMaterial color={i === 1 ? "#123322" : "#101418"} roughness={0.6} />
        </mesh>
      ))}
    </group>
  );
}

function HoseReel({ position, rotation = 0 }) {
  return (
    <group position={position} rotation-y={rotation}>
      <mesh position={[0, 0, -0.06]}><boxGeometry args={[0.7, 0.7, 0.08]} /><meshStandardMaterial color="#14171b" metalness={0.6} roughness={0.5} /></mesh>
      {[0, 0.09, 0.18].map((z, i) => (
        <mesh key={i} position={[0, 0, z + 0.06]} rotation-x={Math.PI / 2} castShadow>
          <torusGeometry args={[0.26 - i * 0.015, 0.035, 10, 28]} />
          <meshStandardMaterial color="#0c5f8e" roughness={0.55} />
        </mesh>
      ))}
      <mesh position={[0, -0.42, 0.2]} rotation-x={0.8}><cylinderGeometry args={[0.03, 0.03, 0.5, 8]} /><meshStandardMaterial color="#0c5f8e" roughness={0.55} /></mesh>
    </group>
  );
}

function SteamMachine({ position, rotation = 0 }) {
  return (
    <group position={position} rotation-y={rotation}>
      <mesh position={[0, 0.42, 0]} castShadow>
        <boxGeometry args={[0.78, 0.84, 0.56]} />
        <meshStandardMaterial color="#171a1f" metalness={0.55} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.26, 0.14, 14]} />
        <meshStandardMaterial color="#22262c" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 1.06, 0]}><cylinderGeometry args={[0.035, 0.035, 0.22, 8]} /><meshStandardMaterial color="#cfd6dc" metalness={1} roughness={0.25} /></mesh>
      {[-0.18, 0, 0.18].map((x, i) => (
        <mesh key={i} position={[x, 0.62, 0.285]}>
          <circleGeometry args={[0.028, 10]} />
          <meshStandardMaterial color={i === 1 ? "#3da8ff" : "#2fae66"} emissive={i === 1 ? "#3da8ff" : "#2fae66"} emissiveIntensity={2.4} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, 0.2, 0.31]}><boxGeometry args={[0.5, 0.05, 0.03]} /><meshStandardMaterial color="#d4af37" metalness={0.8} roughness={0.35} /></mesh>
      {[[-0.3, -0.2], [0.3, -0.2], [-0.3, 0.2], [0.3, 0.2]].map(([x, z], i) => (
        <mesh key={i} position={[x, 0.07, z]} rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.07, 0.07, 0.05, 10]} />
          <meshStandardMaterial color="#0a0c0e" roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

function Bucket({ position, color = "#123322" }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.19, 0.15, 0.34, 14, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0.17, 0]} rotation-x={Math.PI / 2}>
        <torusGeometry args={[0.19, 0.012, 8, 20]} />
        <meshStandardMaterial color="#cfd6dc" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>
  );
}

/* ---------- LED strip helper ---------- */
function Led({ position, size, color = "#3da8ff", intensity = 4, rotation = [0, 0, 0] }) {
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
    </mesh>
  );
}

/* ---------- garage ---------- */
function Garage({ isMobile }) {
  const logo = useMemo(() => logoTexture(), []);
  useEffect(() => () => logo.dispose(), [logo]);
  const wallMat = <meshStandardMaterial color="#0b0c0e" roughness={0.94} metalness={0.05} />;

  return (
    <group>
      {/* wet reflective floor (kept inside the walls) */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[22, 26]} />
        {isMobile ? (
          <meshStandardMaterial color="#0a0c0e" metalness={0.6} roughness={0.22} envMapIntensity={0.9} />
        ) : (
          <MeshReflectorMaterial
            blur={[320, 90]} resolution={1024} mixBlur={0.8} mixStrength={1.1}
            depthScale={0.5} minDepthThreshold={0.5} maxDepthThreshold={1.4}
            color="#06080a" metalness={0.55} roughness={0.18} mirror={0.8} envMapIntensity={0.06}
          />
        )}
      </mesh>

      {/* walls + ceiling (matte black concrete) */}
      <mesh position={[0, 3.2, -9]}><boxGeometry args={[30, 6.4, 0.4]} />{wallMat}</mesh>
      <mesh position={[-11, 3.2, 0]}><boxGeometry args={[0.4, 6.4, 26]} />{wallMat}</mesh>
      <mesh position={[11, 3.2, 0]}><boxGeometry args={[0.4, 6.4, 26]} />{wallMat}</mesh>
      <mesh position={[0, 6.4, 0]} rotation-x={Math.PI / 2}><planeGeometry args={[30, 26]} /><meshStandardMaterial color="#060708" roughness={1} /></mesh>
      {/* concrete wall ribs */}
      {[-8, -4, 4, 8].map((x) => (
        <mesh key={"r" + x} position={[x, 3.2, -8.78]}><boxGeometry args={[0.18, 6.4, 0.06]} /><meshStandardMaterial color="#101216" roughness={0.85} /></mesh>
      ))}
      {[-6, -1, 4].map((z) => (
        <group key={"sr" + z}>
          <mesh position={[-10.78, 3.2, z]}><boxGeometry args={[0.06, 6.4, 0.18]} /><meshStandardMaterial color="#101216" roughness={0.85} /></mesh>
          <mesh position={[10.78, 3.2, z]}><boxGeometry args={[0.06, 6.4, 0.18]} /><meshStandardMaterial color="#101216" roughness={0.85} /></mesh>
        </group>
      ))}

      {/* illuminated Elite Vask logo */}
      <mesh position={[0, 3.55, -8.78]}>
        <planeGeometry args={[8.4, 2.1]} />
        <meshBasicMaterial map={logo} transparent toneMapped={false} />
      </mesh>
      <pointLight position={[0, 3.6, -7.6]} color="#57e69b" intensity={9} distance={9} decay={2} />

      {/* blue LED strips – back wall verticals */}
      {[-5.6, -4.9, 4.9, 5.6].map((x) => (
        <Led key={"v" + x} position={[x, 2.9, -8.76]} size={[0.06, 4.6, 0.06]} intensity={5} />
      ))}
      {/* side wall horizontal twin lines */}
      {[1.0, 3.3].map((y) => (
        <group key={"h" + y}>
          <Led position={[-10.76, y, -1]} size={[0.05, 0.05, 15.5]} intensity={4.2} />
          <Led position={[10.76, y, -1]} size={[0.05, 0.05, 15.5]} intensity={4.2} />
        </group>
      ))}
      {/* floor-edge glow */}
      <Led position={[0, 0.05, -8.72]} size={[29.4, 0.04, 0.04]} intensity={3.2} />
      <Led position={[-10.72, 0.05, 0]} size={[0.04, 0.04, 25.4]} intensity={3.2} />
      <Led position={[10.72, 0.05, 0]} size={[0.04, 0.04, 25.4]} intensity={3.2} />
      {/* cool ceiling fixtures */}
      {[-2.4, 2.4].map((x) => (
        <Led key={"c" + x} position={[x, 6.32, 0.6]} size={[0.16, 0.05, 7]} color="#dfeafc" intensity={2.4} />
      ))}

      {/* blue wall wash lights */}
      <pointLight position={[-10, 2.9, -4]} color="#2f7fd4" intensity={10} distance={11} decay={2} />
      <pointLight position={[10, 2.9, -4]} color="#2f7fd4" intensity={10} distance={11} decay={2} />
      <pointLight position={[0, 1.4, -8]} color="#2f7fd4" intensity={8} distance={9} decay={2} />

      {/* props */}
      <Shelf position={[-10.2, 0, -5.2]} rotation={Math.PI / 2} />
      <Shelf position={[10.2, 0, -3]} rotation={-Math.PI / 2} />
      <HoseReel position={[-10.74, 1.9, 1.6]} rotation={Math.PI / 2} />
      <HoseReel position={[10.74, 1.7, 3.4]} rotation={-Math.PI / 2} />
      <SteamMachine position={[-8.6, 0, -7.4]} rotation={0.5} />
      <SteamMachine position={[8.9, 0, -7.2]} rotation={-0.4} />
      <Bucket position={[-7.6, 0.17, -7.9]} />
      <Bucket position={[-7.15, 0.17, -7.55]} color="#0c5f8e" />
      <Bucket position={[7.7, 0.17, -7.8]} color="#3a3f45" />

      {/* core lighting */}
      <ambientLight intensity={0.16} />
      <hemisphereLight args={["#1c2430", "#07080a", 0.4]} />
      <spotLight
        position={[3.2, 6, 2.6]} angle={0.72} penumbra={0.55} intensity={265} decay={1.8}
        color="#f2f7ff" castShadow={!isMobile} shadow-mapSize={[2048, 2048]} shadow-bias={-0.00018}
      />
      <spotLight position={[-4.6, 5.4, -1.8]} angle={0.8} penumbra={0.7} intensity={120} decay={1.8} color="#cfe0f4" />
      {/* blue rim light from behind the car */}
      <spotLight position={[0, 2.4, -6.4]} angle={0.9} penumbra={0.9} intensity={90} decay={1.8} color="#3da8ff" />
    </group>
  );
}

/* ---------- soft volumetric cones (fake, cheap, bloom-friendly) ---------- */
function VolumetricCones() {
  return (
    <group>
      {[-2.4, 2.4].map((x) => (
        <mesh key={x} position={[x, 3.6, 0.6]}>
          <coneGeometry args={[2.1, 5.6, 26, 1, true]} />
          <meshBasicMaterial color="#9db9dd" transparent opacity={0.028} blending={THREE.AdditiveBlending} depthWrite={false} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

/* ---------- neutral studio IBL (RoomEnvironment – no hot sun, no network) ---------- */
function EnvTune() {
  const { gl, scene } = useThree();
  useEffect(() => {
    const pm = new THREE.PMREMGenerator(gl);
    const rt = pm.fromScene(new RoomEnvironment(), 0.04);
    scene.environment = rt.texture;
    scene.environmentIntensity = 0.55;
    pm.dispose();
    return () => { scene.environment = null; scene.environmentIntensity = 1; rt.texture.dispose(); };
  }, [gl, scene]);
  return null;
}

/* ---------- cinematic camera rig ---------- */
function Rig({ resetSignal }) {
  const controls = useRef();
  const { camera } = useThree();
  const S = useRef({ intro: true, t: 0, lastTouch: 0, resetting: false, lastReset: 0 });

  useEffect(() => {
    camera.position.copy(CAM_INTRO);
    camera.lookAt(TARGET);
  }, [camera]);

  useEffect(() => {
    if (resetSignal > 0) { S.current.resetting = true; S.current.intro = false; }
  }, [resetSignal]);

  useEffect(() => {
    const c = controls.current;
    if (!c) return;
    const onStart = () => { S.current.intro = false; S.current.resetting = false; S.current.lastTouch = performance.now(); };
    const onEnd = () => { S.current.lastTouch = performance.now(); };
    c.addEventListener("start", onStart);
    c.addEventListener("end", onEnd);
    return () => { c.removeEventListener("start", onStart); c.removeEventListener("end", onEnd); };
  }, []);

  useFrame((_, dt) => {
    const c = controls.current; if (!c) return;
    const s = S.current;
    if (s.intro) {
      s.t += dt;
      const k = 1 - Math.pow(0.0035, dt);
      camera.position.lerp(CAM_HOME, k);
      c.target.lerp(TARGET, k);
      if (s.t > 3.4) s.intro = false;
    }
    if (s.resetting) {
      const k = 1 - Math.pow(0.002, dt);
      camera.position.lerp(CAM_HOME, k);
      c.target.lerp(TARGET, k);
      if (camera.position.distanceTo(CAM_HOME) < 0.05) s.resetting = false;
    }
    // slow cinematic orbit, pausing while the user drives the camera
    const idle = performance.now() - s.lastTouch > 4200;
    c.autoRotate = !s.resetting && (s.intro || idle);
    c.autoRotateSpeed = s.intro ? 0.9 : 0.55;
    c.update();
  });

  return (
    <OrbitControls
      ref={controls} makeDefault enableDamping dampingFactor={0.06} enablePan={false}
      minDistance={3.4} maxDistance={9.5} maxPolarAngle={1.5} minPolarAngle={0.25}
      target={[TARGET.x, TARGET.y, TARGET.z]}
    />
  );
}

/* ---------- loading overlay ---------- */
function Loader() {
  const { progress, active } = useProgress();
  const [gone, setGone] = useState(false);
  useEffect(() => {
    if (!active && progress >= 100) { const t = setTimeout(() => setGone(true), 550); return () => clearTimeout(t); }
  }, [active, progress]);
  if (gone) return null;
  return (
    <div className={`gp-loadscreen${!active && progress >= 100 ? " out" : ""}`}>
      <div className="gp-loadlogo">ELITE <em>VASK</em></div>
      <div className="gp-loadbar"><i style={{ width: `${progress}%` }} /></div>
      <div className="gp-loadpct">{Math.round(progress)}%</div>
    </div>
  );
}

/* ================= main ================= */
export default function GarageScene() {
  const isMobile = useMemo(
    () => typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 820),
    []
  );
  const [resetSignal, setResetSignal] = useState(0);

  return (
    <div className="gp-wrap">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 1.75]}
        shadows={!isMobile}
        camera={{ position: [CAM_INTRO.x, CAM_INTRO.y, CAM_INTRO.z], fov: 40 }}
        gl={{ antialias: isMobile, powerPreference: "high-performance" }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.12; }}
      >
        <color attach="background" args={["#040507"]} />
        <fogExp2 attach="fog" args={["#05070a", 0.02]} />
        <Suspense fallback={null}>
          <EnvTune />
          <Garage isMobile={isMobile} />
          <VolumetricCones />
          <Car />
          {!isMobile && (
            <EffectComposer multisampling={0}>
              <N8AO intensity={3.4} aoRadius={0.5} distanceFalloff={0.7} quality="performance" />
              <Bloom mipmapBlur intensity={0.7} luminanceThreshold={1.55} luminanceSmoothing={0.3} />
              <Vignette darkness={0.55} offset={0.22} />
              <SMAA />
            </EffectComposer>
          )}
        </Suspense>
        <Rig resetSignal={resetSignal} />
      </Canvas>

      <Loader />

      <button className="gp-tool gp-camreset" aria-label="Nulstil kamera" title="Nulstil kamera"
        onClick={() => setResetSignal((n) => n + 1)}>
        <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
      </button>
      <div className="gp-credit">3D-model: Ferrari 458 Italia · vicent091036</div>
    </div>
  );
}
