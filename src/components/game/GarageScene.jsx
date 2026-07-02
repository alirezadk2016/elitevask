"use client";
/* Elite Vask – Car Wash Game.
   Phase 1: cinematic detailing garage + realistic Ferrari glTF.
   Phase 2: pressure washer with REAL per-pixel cleaning – every cleanable
   mesh carries a runtime-painted dirt mask (see lib/game/dirtCar.js); the
   jet erases dirt exactly where the water hits, with splash/mist/foam
   particles, procedural audio, a water tank and a minimal HUD.

   Car model: "Ferrari 458 Italia" by vicent091036 (from the official
   three.js examples). Draco decoders served locally from /draco/gltf/. */

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF, useTexture, useProgress, MeshReflectorMaterial } from "@react-three/drei";
import { EffectComposer, Bloom, N8AO, Vignette, SMAA } from "@react-three/postprocessing";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import Washer from "./Washer";
import { CarDirt } from "@/lib/game/dirtCar";
import { initAudio, setMuted, sndClick, sndComplete, sndStar } from "@/lib/game/audio";
import { MISSIONS, T3, ACH, loadSave, storeSave, starsFor, dailyMission, todayStr } from "@/lib/game/campaign";

/* ---------- photo mode helpers ---------- */
function SnapshotBridge({ G }) {
  const { gl } = useThree();
  useEffect(() => {
    // copy the (preserved) GL buffer into a capped-size 2d canvas – much
    // cheaper to encode than a full-res toDataURL on the GL canvas
    G.snap = () => {
      const src = gl.domElement;
      const scale = Math.min(1, 1600 / src.width);
      const c = document.createElement("canvas");
      c.width = Math.max(2, Math.round(src.width * scale));
      c.height = Math.max(2, Math.round(src.height * scale));
      c.getContext("2d").drawImage(src, 0, 0, c.width, c.height);
      return c;
    };
    return () => { G.snap = null; };
  }, [gl, G]);
  return null;
}

function addWatermark(c) {
  const g = c.getContext("2d");
  const h = Math.max(70, Math.round(c.height * 0.16));
  const grad = g.createLinearGradient(0, c.height - h, 0, c.height);
  grad.addColorStop(0, "rgba(4,6,5,0)");
  grad.addColorStop(1, "rgba(4,6,5,.78)");
  g.fillStyle = grad;
  g.fillRect(0, c.height - h, c.width, h);
  const pad = Math.round(c.width * 0.03);
  g.textAlign = "left";
  g.font = `800 ${Math.round(c.width * 0.03)}px Manrope, Arial, sans-serif`;
  g.fillStyle = "#ffffff";
  g.fillText("ELITE ", pad, c.height - pad);
  const w1 = g.measureText("ELITE ").width;
  g.fillStyle = "#37d278";
  g.fillText("VASK", pad + w1, c.height - pad);
  g.font = `600 ${Math.round(c.width * 0.017)}px Manrope, Arial, sans-serif`;
  g.fillStyle = "rgba(255,255,255,.78)";
  g.textAlign = "right";
  g.fillText("elite-vask.dk · Car Wash Game", c.width - pad, c.height - pad);
  return c.toDataURL("image/jpeg", 0.9);
}

const CAR_URL = "/game/ferrari.glb";
const DRACO = "/draco/gltf/";
const CAM_HOME = new THREE.Vector3(5.4, 1.7, 5.8);
const CAM_INTRO = new THREE.Vector3(9.5, 2.9, 10.5);
const TARGET = new THREE.Vector3(0, 0.65, 0);

/* ---------- the car (+ per-mesh dirt registration) ---------- */
function Car({ G, isMobile }) {
  const { scene } = useGLTF(CAR_URL, DRACO);
  const ao = useTexture("/game/ferrari_ao.png");

  const built = useMemo(() => {
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

    /* real cleaning: register washable meshes with their own dirt masks.
       (dirtCar clones+patches the material, so do this AFTER assignment) */
    const dirt = new CarDirt();
    const mr = (n) => (isMobile ? Math.max(192, Math.round(n * 0.6)) : n);
    const cleanables = [];
    const SPEC = [
      { match: (o) => o.name === "body", opt: { maskRes: mr(1024), repeat: 2.2, weight: 1.6 } },
      { match: (o) => o.name === "glass", opt: { maskRes: mr(512), repeat: 1.6, amount: 0.85 } },
      { match: (o) => o.name === "trim", opt: { maskRes: mr(384), repeat: 1.6 } },
      { match: (o) => o.name === "chrome", opt: { maskRes: mr(256), repeat: 1.4 } },
      { match: (o) => o.name.startsWith("rim_"), opt: { maskRes: mr(256), repeat: 1.3 } },
      { match: (o) => o.name.startsWith("tire"), opt: { maskRes: mr(384), repeat: 1.7, weight: 0.7 } },
      { match: (o) => o.name.startsWith("wheel"), opt: { maskRes: mr(256), repeat: 1.3, weight: 0.5 } },
      { match: (o) => o.name === "grills", opt: { maskRes: mr(256), repeat: 1.5, weight: 0.5 } },
    ];
    root.updateMatrixWorld(true);
    root.traverse((o) => {
      if (!o.isMesh) return;
      const spec = SPEC.find((s) => s.match(o));
      if (spec && dirt.add(o, spec.opt)) cleanables.push(o);
    });
    return { root, dirt, cleanables };
  }, [scene, isMobile]);

  useEffect(() => {
    G.dirt = built.dirt;
    G.carMeshes = built.cleanables;
    const bodyMesh = built.cleanables.find((m) => m.name === "body");
    G.bodyMat = bodyMesh ? bodyMesh.material : null;
    return () => {
      if (G.dirt === built.dirt) { G.dirt = null; G.carMeshes = []; G.bodyMat = null; }
      built.dirt.dispose();
    };
  }, [built, G]);

  return (
    <group rotation-y={Math.PI * 0.62}>
      <primitive object={built.root} />
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
function Led({ position, size, color = "#3da8ff", intensity = 4, rotation = [0, 0, 0], innerRef }) {
  return (
    <mesh ref={innerRef} position={position} rotation={rotation}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={intensity} toneMapped={false} />
    </mesh>
  );
}

/* ---------- garage ---------- */
function Garage({ G, isMobile }) {
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

      {/* blue LED strips – back wall verticals (pulse on celebration) */}
      {[-5.6, -4.9, 4.9, 5.6].map((x, i) => (
        <Led key={"v" + x} position={[x, 2.9, -8.76]} size={[0.06, 4.6, 0.06]} intensity={5}
          innerRef={(el) => { if (G) G.leds[i] = el; }} />
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

/* ---------- hidden golden dirt: 3 sprites raycast onto the body ---------- */
let _goldTex = null;
function goldTex() {
  if (_goldTex) return _goldTex;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 30);
  gr.addColorStop(0, "rgba(255,236,170,1)");
  gr.addColorStop(0.45, "rgba(236,196,92,.95)");
  gr.addColorStop(1, "rgba(212,175,55,0)");
  g.fillStyle = gr;
  g.beginPath(); g.arc(32, 32, 30, 0, Math.PI * 2); g.fill();
  _goldTex = new THREE.CanvasTexture(c);
  return _goldTex;
}

function GoldSpots({ G, attempt }) {
  const group = useRef();
  const tex = useMemo(() => goldTex(), []);
  const [spots, setSpots] = useState([]);

  useEffect(() => {
    const body = G.carMeshes.find((m) => m.name === "body");
    if (!body) { G.gold = []; setSpots([]); return; }
    body.updateWorldMatrix(true, false);
    const rayc = new THREE.Raycaster();
    const out = [];
    const N = G.goldCount || 3;
    let guard = 0;
    while (out.length < N && guard++ < 90) {
      const az = Math.random() * Math.PI * 2;
      const o = new THREE.Vector3(Math.cos(az) * 4.5, 0.45 + Math.random() * 0.8, Math.sin(az) * 4.5);
      rayc.set(o, new THREE.Vector3(0, 0.6, 0).sub(o).normalize());
      const h = rayc.intersectObject(body, false)[0];
      if (h && h.uv && h.face) {
        const n = h.face.normal.clone().transformDirection(body.matrixWorld);
        // keep spots apart
        const pos = h.point.clone().addScaledVector(n, 0.035);
        if (out.every((s) => s.pos.distanceTo(pos) > 0.75)) {
          out.push({ key: body.uuid, uv: h.uv.clone(), pos, found: false });
        }
      }
    }
    G.gold = out;
    setSpots(out);
  }, [G, attempt]);

  useFrame((st) => {
    const g = group.current;
    if (!g) return;
    g.children.forEach((s, i) => {
      const d = G.gold && G.gold[i];
      if (!d) { s.visible = false; return; }
      s.visible = !d.found && G.phase === "playing";
      const k = 1 + Math.sin(st.clock.elapsedTime * 4 + i * 2) * 0.18;
      s.scale.setScalar(0.09 * k);
    });
  });

  return (
    <group ref={group}>
      {spots.map((s, i) => (
        <sprite key={attempt + "-" + i} position={[s.pos.x, s.pos.y, s.pos.z]}>
          <spriteMaterial map={tex} color="#ffd766" transparent depthWrite={false} toneMapped={false} />
        </sprite>
      ))}
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

/* ---------- cinematic camera rig ----------
   OrbitControls listens on the R3F wrapper div (canvas parent), so the spray
   handler on the canvas itself can stopPropagation() when the press lands on
   the car – washing wins, dragging the background orbits. */
function Rig({ G, resetSignal }) {
  const controls = useRef();
  const { camera, gl } = useThree();
  const wrapper = gl.domElement.parentNode || gl.domElement;
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
    // slow cinematic orbit in the menu and on the post-completion shine lap
    const idle = performance.now() - s.lastTouch > 4200;
    const cinematic = G.phase !== "playing";
    c.autoRotate = !s.resetting && !G.spraying && cinematic && (s.intro || idle);
    c.autoRotateSpeed = s.intro ? 0.9 : 0.55;
    c.update();
  });

  return (
    <OrbitControls
      ref={controls} makeDefault domElement={wrapper} enableDamping dampingFactor={0.06} enablePan={false}
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
  const lang = useMemo(() => {
    try { return localStorage.getItem("lang") === "en" ? "en" : "da"; } catch { return "da"; }
  }, []);
  const tr = T3[lang];

  const [phase, setPhase] = useState("menu"); // menu | playing | done
  const [missionIdx, setMissionIdx] = useState(0);
  const [dailyActive, setDailyActive] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [save, setSave] = useState(() => (typeof window !== "undefined" ? loadSave() : { unlocked: 1, best: {}, ach: [], daily: null }));
  const [muted, setMutedState] = useState(() => { try { return localStorage.getItem("ev_game_mute") === "1"; } catch { return false; } });
  const [result, setResult] = useState(null);
  const [resetSignal, setResetSignal] = useState(0);
  const [photo, setPhoto] = useState(null);
  const [hud, setHud] = useState({ progress: 0, water: 100, tankLock: false, hasSprayed: false, time: 0, score: 0, combo: 1, toast: null });

  const daily = useMemo(() => (typeof window !== "undefined" ? dailyMission(todayStr()) : null), []);
  const canShare = useMemo(() => typeof navigator !== "undefined" && !!navigator.share, []);

  const G = useRef(null);
  if (!G.current) {
    G.current = {
      pointer: new THREE.Vector2(), spraying: false, hasSprayed: false,
      water: 100, tankLock: false, progress: 0, done: false, phase: "menu",
      time: 0, score: 0, combo: 1, scrub: 1, toast: null, celebrateT: 0, ledsHot: false,
      dirt: null, carMeshes: [], bodyMat: null, gold: [], leds: [], tr: T3.da, finish: null,
    };
  }
  const g = G.current;
  g.phase = phase;
  g.tr = tr;
  if (typeof window !== "undefined") window.__evg = g;

  useEffect(() => { setMuted(muted); }, [muted]);

  /* finish → score breakdown, achievements, save, celebration */
  useEffect(() => {
    g.finish = () => {
      if (g.phase !== "playing" || g.done) return;
      g.done = true;
      g.spraying = false;
      const mission = dailyActive ? daily : MISSIONS[missionIdx];
      const secs = Math.round(g.time);
      const stars = starsFor(mission, secs);
      const bonus = Math.max(0, Math.round((mission.time2 * 1.2 - secs) * 9));
      g.score += bonus + 1500;
      g.celebrateT = 3.2;
      const sc = Math.round(g.score);

      /* achievements */
      const newAch = [];
      const has = (id) => save.ach.includes(id) || newAch.includes(id);
      if (!has("first")) newAch.push("first");
      if (g.progress >= 0.999 && !has("perfect")) newAch.push("perfect");
      if (g.gold && g.gold.length > 0 && g.gold.every((s) => s.found) && !has("gold")) newAch.push("gold");
      if ((g.comboMax || 1) >= 5 && !has("combo")) newAch.push("combo");
      if (stars === 3 && !has("fast")) newAch.push("fast");
      if (!dailyActive && mission.id === 5 && !has("elite")) newAch.push("elite");

      let nextSave;
      let newBest;
      if (dailyActive) {
        const prev = save.daily && save.daily.date === mission.date ? save.daily : null;
        newBest = !prev || sc > prev.score;
        nextSave = {
          ...save,
          ach: [...save.ach, ...newAch],
          daily: newBest ? { date: mission.date, score: sc, stars: Math.max(stars, prev?.stars || 0) } : save.daily,
        };
      } else {
        const prevBest = save.best[mission.id];
        newBest = !prevBest || sc > prevBest.score;
        nextSave = {
          ...save,
          unlocked: Math.max(save.unlocked, Math.min(MISSIONS.length, mission.id + 1)),
          ach: [...save.ach, ...newAch],
          best: {
            ...save.best,
            [mission.id]: newBest
              ? { score: sc, stars: Math.max(stars, prevBest?.stars || 0), time: secs }
              : prevBest,
          },
        };
      }
      setSave(nextSave); storeSave(nextSave);
      setResult({ stars, score: sc, time: secs, bonus, newBest, hasNext: !dailyActive && mission.id < MISSIONS.length });
      setPhase("done");
      sndComplete();
      try { navigator.vibrate && navigator.vibrate([40, 60, 40]); } catch {}
      let i = 0;
      const int = setInterval(() => { sndStar(i); if (++i >= stars) clearInterval(int); }, 420);
      newAch.forEach((id, k) => {
        const a = ACH.find((x) => x.id === id);
        setTimeout(() => { g.toast = { msg: `${a.icon} ${g.tr.achPrefix}: ${a.name[lang]}`, t: 2.6 }; }, 900 + k * 1600);
      });
    };
  }, [missionIdx, dailyActive, daily, save, g, lang]);

  /* HUD sync */
  useEffect(() => {
    const id = setInterval(() => {
      setHud({
        progress: g.progress, water: g.water, tankLock: g.tankLock, hasSprayed: g.hasSprayed,
        time: g.time, score: Math.round(g.score), combo: g.combo, toast: g.toast ? g.toast.msg : null,
      });
    }, 170);
    return () => clearInterval(id);
  }, [g]);

  const launch = useCallback((m, idx, isDaily) => {
    sndClick(); initAudio();
    if (g.dirt) g.dirt.reset();
    if (g.bodyMat) { g.bodyMat.color.set(m.paint); g.bodyMat.metalness = m.metal; }
    g.scrub = m.scrub;
    g.goldCount = m.golds || 3;
    g.progress = 0; g.water = 100; g.tankLock = false; g.done = false; g.hasSprayed = false;
    g.time = 0; g.score = 0; g.combo = 1; g.comboMax = 1; g.toast = null; g.celebrateT = 0; g.clearFx = true;
    setMissionIdx(idx >= 0 ? idx : 0);
    setDailyActive(isDaily);
    setAttempt((a) => a + 1); setResult(null); setPhoto(null);
    setResetSignal((n) => n + 1);
    setPhase("playing");
  }, [g]);

  const startMission = useCallback((i) => launch(MISSIONS[i], i, false), [launch]);
  const startDaily = useCallback(() => daily && launch(daily, -1, true), [launch, daily]);

  const toMenu = useCallback(() => { sndClick(); g.spraying = false; setPhase("menu"); setResult(null); setPhoto(null); }, [g]);

  const takePhoto = useCallback(() => {
    sndClick();
    // defer so the click finishes before the (potentially slow) GL readback
    setTimeout(() => {
      if (!g.snap) return;
      try { setPhoto(addWatermark(g.snap())); } catch {}
    }, 30);
  }, [g]);

  const sharePhoto = useCallback(async () => {
    if (!photo) return;
    try {
      const blob = await (await fetch(photo)).blob();
      const file = new File([blob], "elite-vask-carwash.jpg", { type: "image/jpeg" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: "Elite Vask Car Wash Game" });
      } else if (navigator.share) {
        await navigator.share({ title: "Elite Vask Car Wash Game", url: "https://www.elite-vask.dk/game" });
      }
    } catch {}
  }, [photo]);

  const mission = dailyActive && daily ? daily : MISSIONS[missionIdx];
  const dailyBest = daily && save.daily && save.daily.date === daily.date ? save.daily : null;
  const hoursToNext = useMemo(() => {
    const now = new Date();
    const end = new Date(now); end.setHours(24, 0, 0, 0);
    return Math.max(1, Math.ceil((end - now) / 3600000));
  }, [phase]);
  const pct = Math.min(100, Math.round(hud.progress * 100 + 0.2));
  const canFinish = phase === "playing" && hud.progress >= 0.97;
  const paceStars = phase === "playing" ? (hud.time <= mission.time3 ? 3 : hud.time <= mission.time2 ? 2 : 1) : 0;
  const mm = Math.floor(hud.time / 60);
  const ss = String(Math.floor(hud.time % 60)).padStart(2, "0");

  return (
    <div className="gp-wrap">
      <Canvas
        dpr={[1, isMobile ? 1.5 : 1.75]}
        shadows={!isMobile}
        camera={{ position: [CAM_INTRO.x, CAM_INTRO.y, CAM_INTRO.z], fov: 40 }}
        gl={{ antialias: isMobile, powerPreference: "high-performance", preserveDrawingBuffer: true }}
        onCreated={({ gl }) => { gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.12; }}
      >
        <color attach="background" args={["#040507"]} />
        <fogExp2 attach="fog" args={["#05070a", 0.02]} />
        <Suspense fallback={null}>
          <EnvTune />
          <Garage G={g} isMobile={isMobile} />
          <VolumetricCones />
          <Car G={g} isMobile={isMobile} />
          <GoldSpots G={g} attempt={attempt} />
          <Washer G={g} isMobile={isMobile} />
          <SnapshotBridge G={g} />
          {!isMobile && (
            <EffectComposer multisampling={0}>
              <N8AO intensity={3.4} aoRadius={0.5} distanceFalloff={0.7} quality="performance" />
              <Bloom mipmapBlur intensity={0.7} luminanceThreshold={1.55} luminanceSmoothing={0.3} />
              <Vignette darkness={0.55} offset={0.22} />
              <SMAA />
            </EffectComposer>
          )}
        </Suspense>
        <Rig G={g} resetSignal={resetSignal} />
      </Canvas>

      <Loader />

      {/* ---------- in-game HUD ---------- */}
      {phase === "playing" && (
        <>
          <div className="gp-hud gp-topleft">
            <div className="gp-label">{tr.clean} · {mission.name[lang].toUpperCase()}</div>
            <div className="gp-progress-row">
              <span className="gp-pct">{pct}%</span>
              <span className="gp-stars">{[1, 2, 3].map((i) => (
                <svg key={i} viewBox="0 0 24 24" className={i <= paceStars ? "on" : ""} width="17" height="17"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="currentColor" /></svg>
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

          {(hud.toast || hud.tankLock) && <div className="gp-toast">{hud.toast || tr.waterLow}</div>}

          {!hud.hasSprayed && (
            <div className="gp-hint">{isMobile ? tr.hintMobile : tr.hintDesktop}</div>
          )}

          {canFinish && (
            <button className="gp-finish" onClick={() => { sndClick(); g.finish && g.finish(); }}>
              ✦ {tr.finish}
            </button>
          )}

          <div className="gp-tools">
            <button className="gp-tool" aria-label={tr.menu} title={tr.menu} onClick={toMenu}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></svg>
            </button>
            <button className="gp-tool" aria-label={tr.photo} title={tr.photo} onClick={takePhoto}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></svg>
            </button>
            <button className="gp-tool" aria-label={tr.resetCam} title={tr.resetCam} onClick={() => { sndClick(); setResetSignal((n) => n + 1); }}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
            </button>
            <button className="gp-tool" aria-label={tr.beforeAfter} title={tr.beforeAfter}
              onPointerDown={() => g.dirt && g.dirt.setBefore(true)}
              onPointerUp={() => g.dirt && g.dirt.setBefore(false)}
              onPointerLeave={() => g.dirt && g.dirt.setBefore(false)}>
              <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18" /><path d="M5 8c3 0 4 2 7 2M5 16c3 0 4-2 7-2" opacity=".6" /><circle cx="18" cy="12" r="3" /></svg>
            </button>
            <button className="gp-tool" aria-label={tr.sound} title={tr.sound}
              onClick={() => { const m = !muted; setMutedState(m); try { localStorage.setItem("ev_game_mute", m ? "1" : "0"); } catch {} sndClick(); }}>
              {muted ? (
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" /></svg>
              ) : (
                <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M11 5 6 9H2v6h4l5 4V5Z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14" /></svg>
              )}
            </button>
          </div>
        </>
      )}

      {/* ---------- mission select ---------- */}
      {phase === "menu" && (
        <div className="gp-overlay">
          <div className="gp-panel">
            <div className="gp-eyebrow">Elite Vask</div>
            <h1 className="gp-title">{tr.title}</h1>
            <p className="gp-sub">{tr.tagline}</p>
            {daily && (
              <button className="gp-level gp-daily" onClick={startDaily}>
                <span className="gp-lv-num gp-daily-num">✦</span>
                <span className="gp-lv-name">{tr.daily}
                  <span className="gp-daily-sub">{tr.dailyNew} {hoursToNext}t</span>
                </span>
                <span className="gp-lv-meta">
                  {dailyBest ? (
                    <>
                      <span className="gp-lv-stars">{"★".repeat(dailyBest.stars)}{"☆".repeat(3 - dailyBest.stars)}</span>
                      <span className="gp-lv-best">{dailyBest.score.toLocaleString("da-DK")}</span>
                    </>
                  ) : (
                    <span className="gp-lv-new">{tr.newTag}</span>
                  )}
                </span>
              </button>
            )}
            <div className="gp-levels">
              {MISSIONS.map((m, i) => {
                const locked = m.id > save.unlocked;
                const best = save.best[m.id];
                return (
                  <button key={m.id} className={`gp-level${locked ? " locked" : ""}`} disabled={locked}
                    onClick={() => startMission(i)}>
                    <span className="gp-lv-num" style={{ background: locked ? undefined : m.paint }}>{m.id}</span>
                    <span className="gp-lv-name">{m.name[lang]}</span>
                    <span className="gp-lv-meta">
                      {locked ? (
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></svg>
                      ) : best ? (
                        <>
                          <span className="gp-lv-stars">{"★".repeat(best.stars)}{"☆".repeat(3 - best.stars)}</span>
                          <span className="gp-lv-best">{best.score.toLocaleString("da-DK")}</span>
                        </>
                      ) : (
                        <span className="gp-lv-new">{tr.newTag}</span>
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="gp-achrow" aria-label={tr.achievements}>
              {ACH.map((a) => {
                const got = save.ach.includes(a.id);
                return (
                  <span key={a.id} className={`gp-ach${got ? "" : " locked"}`} title={`${a.name[lang]} – ${a.desc[lang]}`}>
                    {a.icon}
                  </span>
                );
              })}
            </div>
            <p className="gp-note">{isMobile ? tr.hintMobile : tr.hintDesktop}</p>
          </div>
        </div>
      )}

      {/* ---------- success ---------- */}
      {phase === "done" && result && (
        <div className="gp-overlay gp-complete">
          <div className="gp-panel">
            <div className="gp-big-stars">
              {[1, 2, 3].map((i) => (
                <svg key={i} viewBox="0 0 24 24" className={i <= result.stars ? "on" : ""} style={{ animationDelay: `${0.35 + i * 0.42}s` }} width="52" height="52"><path d="M12 2 15 9l7 .5-5.5 4.5L18 21l-6-3.8L6 21l1.5-7L2 9.5 9 9Z" fill="currentColor" /></svg>
              ))}
            </div>
            <h2 className="gp-title">{tr.done}</h2>
            <p className="gp-sub">{tr.doneSub}</p>
            <div className="gp-result">
              <div><span>{tr.score}</span><strong>{result.score.toLocaleString("da-DK")}</strong></div>
              <div><span>{tr.time}</span><strong>{Math.floor(result.time / 60)}:{String(result.time % 60).padStart(2, "0")}</strong></div>
              <div><span>{tr.timeBonus}</span><strong>+{result.bonus.toLocaleString("da-DK")}</strong></div>
              {result.newBest && <div className="gp-newbest">{tr.newBest}</div>}
            </div>
            <div className="gp-actions">
              <a href="/#vaelg" className="btn btn-green btn-lg gp-book">{tr.book}</a>
              <div className="gp-actions-row">
                <button className="btn gp-ghost" onClick={() => (dailyActive ? startDaily() : startMission(missionIdx))}>{tr.again}</button>
                {result.hasNext && MISSIONS[missionIdx + 1].id <= save.unlocked && (
                  <button className="btn gp-ghost" onClick={() => startMission(missionIdx + 1)}>{tr.next}</button>
                )}
                <button className="btn gp-ghost" onClick={takePhoto}>📸 {tr.photo}</button>
                <button className="btn gp-ghost" onClick={toMenu}>{tr.menu}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- photo mode ---------- */}
      {photo && (
        <div className="gp-overlay gp-photo">
          <div className="gp-panel gp-photo-panel">
            <img src={photo} alt="Elite Vask Car Wash Game" className="gp-photo-img" />
            <div className="gp-actions-row" style={{ marginTop: 14 }}>
              <a href={photo} download="elite-vask-carwash.jpg" className="btn btn-green">{tr.download}</a>
              {canShare && <button className="btn gp-ghost" onClick={sharePhoto}>{tr.share}</button>}
              <button className="btn gp-ghost" onClick={() => { sndClick(); setPhoto(null); }}>{tr.close}</button>
            </div>
          </div>
        </div>
      )}

      {phase !== "playing" && (
        <button className="gp-tool gp-camreset" aria-label={tr.resetCam} title={tr.resetCam}
          onClick={() => { sndClick(); setResetSignal((n) => n + 1); }}>
          <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
        </button>
      )}
      <div className="gp-credit">3D-model: Ferrari 458 Italia · vicent091036</div>
    </div>
  );
}
