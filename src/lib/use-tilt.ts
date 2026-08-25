"use client";

import { useRef, useCallback, type MouseEvent, type RefObject } from "react";
import { useSpring } from "framer-motion";
import {
  tiltMaxDeg,
  tiltPerspective,
  tiltSpring,
  tiltHoverScale,
} from "@/animations/tilt-card";

/**
 * Drives a glass card's cursor-reactive tilt + shine: rotateX/rotateY/scale
 * springs (spread onto a `motion.*` element's `style`, same pattern as
 * Magnetic's spring x/y) plus a pair of `--mx`/`--my` CSS custom properties
 * written straight to the DOM node — not React state — for the
 * `.glass-shine` radial highlight (globals.css) to read. Direct writes
 * because this fires on every mousemove; a state update would re-render
 * the card that often (same reasoning as CustomCursor's imperative style
 * mutation).
 *
 * `tilt: false` keeps the shine but drops the rotation/scale — for wide,
 * text-heavy cards (the testimonial panel, work-preview rows, the hero
 * badge) where a 3D tilt would fight with reading the content.
 *
 * Springs simply never move on touch (no mousemove event) and settle to
 * rest on mouseleave; MotionConfig's `reducedMotion="user"` (root layout)
 * collapses them for prefers-reduced-motion the same way it already does
 * for Magnetic.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>({
  tilt = true,
}: { tilt?: boolean } = {}) {
  const ref = useRef<T>(null) as RefObject<T | null>;
  const rotateX = useSpring(0, tiltSpring);
  const rotateY = useSpring(0, tiltSpring);
  const scale = useSpring(1, tiltSpring);

  const onMouseMove = useCallback(
    (e: MouseEvent<T>) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      el.style.setProperty("--mx", `${px * 100}%`);
      el.style.setProperty("--my", `${py * 100}%`);
      if (!tilt) return;
      rotateY.set((px - 0.5) * tiltMaxDeg * 2);
      rotateX.set((0.5 - py) * tiltMaxDeg * 2);
      scale.set(tiltHoverScale);
    },
    [tilt, rotateX, rotateY, scale]
  );

  const onMouseLeave = useCallback(() => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);
  }, [rotateX, rotateY, scale]);

  return {
    ref,
    onMouseMove,
    onMouseLeave,
    style: { rotateX, rotateY, scale, transformPerspective: tiltPerspective },
  };
}
