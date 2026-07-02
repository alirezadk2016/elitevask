"use client";
/* Shared CPU particle pool (points + soft sprite) used by the washer FX. */

import { forwardRef, useEffect, useMemo, useImperativeHandle } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

let _sprite = null;
export function spriteTex() {
  if (_sprite) return _sprite;
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  gr.addColorStop(0, "rgba(255,255,255,1)");
  gr.addColorStop(0.55, "rgba(255,255,255,.55)");
  gr.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = gr;
  g.fillRect(0, 0, 64, 64);
  _sprite = new THREE.CanvasTexture(c);
  return _sprite;
}

export const FX = forwardRef(function FX(
  { count = 300, color = "#ffffff", blending = "normal", gravity = -9.8, drag = 0.985, grow = 0, opacity = 1, streak = false },
  ref
) {
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
    for (let i = 0; i < count; i++) pos[i * 3 + 1] = -999;
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    geo.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
    if (streak) geo.setAttribute("aVel", new THREE.BufferAttribute(vel, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 1, 0), 60);

    /* particle sizes are WORLD METERS projected properly (uProj =
       drawingBufferHeight / 2·tan(fov/2)), capped so near-camera particles
       can never bloat into screen-filling fog */
    const streakVert = `attribute float aSize; attribute float aAlpha; attribute vec3 aVel;
      varying float vA; varying vec2 vDir; uniform float uProj;
      void main(){
        vA=aAlpha;
        vec4 mv=modelViewMatrix*vec4(position,1.0);
        vec4 mv2=modelViewMatrix*vec4(position+aVel*0.02,1.0);
        vec2 d=mv2.xy-mv.xy;
        float l=length(d);
        vDir=l>1e-5?d/l:vec2(0.0,1.0);
        vA*=smoothstep(0.35,1.15,-mv.z); // fade out near the camera
        gl_PointSize=min(aSize*uProj/max(0.2,-mv.z),190.0);
        gl_Position=projectionMatrix*mv;
      }`;
    const streakFrag = `uniform vec3 uColor; uniform float uOpacity; varying float vA; varying vec2 vDir;
      void main(){
        vec2 c=gl_PointCoord-0.5; c.y=-c.y;
        vec2 r=vec2(c.x*vDir.x+c.y*vDir.y, -c.x*vDir.y+c.y*vDir.x);
        float a=(1.0-smoothstep(0.04,0.5,abs(r.y)*2.8))*(1.0-smoothstep(0.3,0.5,abs(r.x)));
        a*=vA*uOpacity;
        if(a<0.012) discard;
        gl_FragColor=vec4(uColor,a);
      }`;
    const dotVert = `attribute float aSize; attribute float aAlpha; varying float vA; uniform float uProj;
      void main(){ vA=aAlpha; vec4 mv=modelViewMatrix*vec4(position,1.0);
      vA*=smoothstep(0.35,1.15,-mv.z); // fade out near the camera
      gl_PointSize=min(aSize*uProj/max(0.2,-mv.z),190.0); gl_Position=projectionMatrix*mv; }`;
    const dotFrag = `uniform sampler2D uMap; uniform vec3 uColor; uniform float uOpacity; varying float vA;
      void main(){ float a=texture2D(uMap,gl_PointCoord).a*vA*uOpacity; if(a<0.012) discard; gl_FragColor=vec4(uColor,a); }`;

    const mat = new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      blending: blending === "add" ? THREE.AdditiveBlending : THREE.NormalBlending,
      uniforms: {
        uMap: { value: spriteTex() },
        uColor: { value: new THREE.Color(color) },
        uOpacity: { value: opacity },
        uProj: { value: 1000 },
      },
      vertexShader: streak ? streakVert : dotVert,
      fragmentShader: streak ? streakFrag : dotFrag,
    });
    return { pos, vel, life, maxLife, size, size0, alpha, alpha0, geo, mat, head: 0, streak };
  }, [count, color, blending, opacity, gl, streak]);

  useEffect(() => () => { S.geo.dispose(); S.mat.dispose(); }, [S]);

  useImperativeHandle(ref, () => ({
    spawn(px, py, pz, vx, vy, vz, life, size, alpha) {
      const i = S.head; S.head = (S.head + 1) % count;
      S.pos[i * 3] = px; S.pos[i * 3 + 1] = py; S.pos[i * 3 + 2] = pz;
      S.vel[i * 3] = vx; S.vel[i * 3 + 1] = vy; S.vel[i * 3 + 2] = vz;
      S.life[i] = life; S.maxLife[i] = life;
      S.size0[i] = size; S.alpha0[i] = alpha;
    },
    clear() {
      S.life.fill(0);
      S.alpha.fill(0);
      for (let i = 0; i < count; i++) S.pos[i * 3 + 1] = -999;
      S.geo.attributes.position.needsUpdate = true;
      S.geo.attributes.aAlpha.needsUpdate = true;
    },
  }), [S, count]);

  useFrame((state, dt) => {
    S.mat.uniforms.uProj.value =
      state.gl.drawingBufferHeight / (2 * Math.tan((state.camera.fov * Math.PI) / 360));
    const d = Math.min(dt, 0.05);        // physics step (stability)
    const lifeD = Math.min(dt, 0.25);    // life decays in real time so slow
    const { pos, vel, life, maxLife, size, size0, alpha, alpha0 } = S; // frames don't accumulate particles
    for (let i = 0; i < count; i++) {
      if (life[i] <= 0) { alpha[i] = 0; continue; }
      life[i] -= lifeD;
      const t = 1 - life[i] / maxLife[i];
      vel[i * 3 + 1] += gravity * d;
      vel[i * 3] *= drag; vel[i * 3 + 1] *= drag; vel[i * 3 + 2] *= drag;
      pos[i * 3] += vel[i * 3] * d; pos[i * 3 + 1] += vel[i * 3 + 1] * d; pos[i * 3 + 2] += vel[i * 3 + 2] * d;
      if (pos[i * 3 + 1] < 0.015 && vel[i * 3 + 1] < 0) {
        pos[i * 3 + 1] = 0.015; vel[i * 3 + 1] *= -0.25; vel[i * 3] *= 0.7; vel[i * 3 + 2] *= 0.7;
      }
      size[i] = size0[i] * (1 + grow * t);
      alpha[i] = alpha0[i] * (t < 0.12 ? t / 0.12 : 1 - (t - 0.12) / 0.88);
    }
    S.geo.attributes.position.needsUpdate = true;
    S.geo.attributes.aSize.needsUpdate = true;
    S.geo.attributes.aAlpha.needsUpdate = true;
    if (S.streak) S.geo.attributes.aVel.needsUpdate = true;
  });

  return <points geometry={S.geo} material={S.mat} frustumCulled={false} renderOrder={5} />;
});
