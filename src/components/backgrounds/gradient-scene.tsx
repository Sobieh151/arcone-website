"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform vec2 uResolution;

  vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                         -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.55;
    for (int i = 0; i < 5; i++) {
      value += amplitude * snoise(p);
      p *= 2.02;
      amplitude *= 0.55;
    }
    return value;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 p = (uv - 0.5) * aspect;

    float t = uTime * 0.045;
    vec2 mouseInfluence = (uMouse - 0.5) * aspect * 0.4;

    float n1 = fbm(p * 1.4 + vec2(t, -t * 0.6) + mouseInfluence * 0.5);
    float n2 = fbm(p * 2.2 - vec2(t * 0.7, t * 0.3));
    float n = mix(n1, n2, 0.45);

    float dist = length(p - mouseInfluence * 0.6);
    float glow = smoothstep(0.9, 0.0, dist) * 0.5;

    float vign = smoothstep(1.1, 0.15, length(p));

    vec3 black = vec3(0.0);
    vec3 burnt = vec3(0.612, 0.247, 0.043);
    vec3 orange = vec3(0.910, 0.314, 0.008);
    vec3 highlight = vec3(1.0, 0.376, 0.004);

    float mixA = smoothstep(-0.2, 0.55, n) * vign;
    float mixB = smoothstep(0.25, 0.85, n) * vign;

    vec3 color = black;
    color = mix(color, burnt, mixA * 0.7);
    color = mix(color, orange, mixB * 0.55);
    color += highlight * glow * vign;

    float grain = fract(sin(dot(uv * uResolution.xy, vec2(12.9898, 78.233))) * 43758.5453);
    color += (grain - 0.5) * 0.02;

    gl_FragColor = vec4(color, 1.0);
  }
`;

function GradientPlane() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { size, viewport } = useThree();
  const mouse = useRef({ x: 0.5, y: 0.5 });
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const reducedMotion = usePrefersReducedMotion();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uResolution: { value: new THREE.Vector2(size.width, size.height) },
    }),
    [size.width, size.height]
  );

  useEffect(() => {
    if (reducedMotion) return;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX / window.innerWidth;
      mouse.current.y = 1 - e.clientY / window.innerHeight;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reducedMotion]);

  // Mutating `uniforms` directly here (instead of via setState) is the
  // standard react-three-fiber pattern: useFrame runs outside React's
  // render cycle at display refresh rate, and driving a shader uniform
  // through React state would re-render the component 60x/sec for no
  // benefit. See https://r3f.docs.pmnd.rs/api/hooks#useframe
  /* eslint-disable react-hooks/immutability -- see note above: mutating
     uniforms in-place is the intended, performant useFrame pattern */
  useFrame((_state, delta) => {
    // Reduced motion: freeze the ambient drift almost entirely (a faint
    // trickle keeps the shader from looking like a static screenshot) and
    // stop reacting to the pointer.
    uniforms.uTime.value += reducedMotion ? delta * 0.02 : delta;
    if (!reducedMotion) {
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.04;
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.04;
      uniforms.uMouse.value.set(smoothMouse.current.x, smoothMouse.current.y);
    }
  });
  /* eslint-enable react-hooks/immutability */

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  );
}

export function GradientScene({ className }: { className?: string }) {
  // Fades in once the first frame has actually rendered, instead of
  // popping in whenever the chunk + shader compile happen to finish.
  const [ready, setReady] = useState(false);

  return (
    <div
      className={className}
      style={{
        opacity: ready ? 1 : 0,
        transition: "opacity 900ms ease-out",
      }}
    >
      <Canvas
        orthographic
        camera={{ zoom: 1, position: [0, 0, 1] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        onCreated={() => setReady(true)}
      >
        <GradientPlane />
      </Canvas>
    </div>
  );
}
