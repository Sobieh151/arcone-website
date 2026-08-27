"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  parallaxLayers,
  parallaxLerp,
  parallaxMaxDisplacementPx,
} from "@/animations/hero";

type HeroLayerRefs = {
  background: RefObject<HTMLElement | null>;
  mark: RefObject<HTMLElement | null>;
};

function clamp(v: number) {
  return Math.max(-parallaxMaxDisplacementPx, Math.min(parallaxMaxDisplacementPx, v));
}

/**
 * Cursor-follow parallax for the hero's two layers, each drifting at its
 * own speed off one shared, lerped pointer offset — "image 1x, ARC mark
 * 1.15x" per the hero spec. Desktop only (fine pointer + hover-capable) and off entirely when
 * `enabled` is false (reduced motion, or mobile) — the goal is "something
 * about this feels 3D," not motion on every device.
 *
 * Writes `transform` straight to each DOM node every frame instead of
 * through React state — same reasoning as CustomCursor's rAF loop
 * (components/cursor/custom-cursor.tsx): this runs on every
 * pointermove-driven frame, and a state update would re-render the whole
 * hero that often for nothing.
 */
export function useParallaxLayers(refs: HeroLayerRefs, enabled: boolean) {
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;
    const supportsFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    if (!supportsFinePointer) return;

    const onMove = (e: PointerEvent) => {
      // -1..1 on each axis, centered on the viewport.
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    const layerEntries: [RefObject<HTMLElement | null>, number][] = [
      [refs.background, parallaxLayers.background],
      [refs.mark, parallaxLayers.mark],
    ];

    let raf = 0;
    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * parallaxLerp;
      current.current.y += (target.current.y - current.current.y) * parallaxLerp;

      for (const [ref, speed] of layerEntries) {
        const el = ref.current;
        if (!el) continue;
        const x = clamp(current.current.x * parallaxMaxDisplacementPx * speed);
        const y = clamp(current.current.y * parallaxMaxDisplacementPx * speed);
        el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
    // `refs` holds useRef objects handed in fresh by the caller every
    // render, but each individual ref's *identity* is stable across the
    // component's lifetime (that's what useRef guarantees) — this effect
    // only needs to (re)run when `enabled` changes, same as the mount-once
    // pattern in useTilt/CustomCursor.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled]);
}
