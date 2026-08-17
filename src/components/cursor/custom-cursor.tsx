"use client";

import { useEffect, useRef, useState } from "react";
import { cursorRingEase, cursorSize, cursorGlow } from "@/animations/cursor";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // matchMedia is only available client-side, so capability detection has
    // to happen post-mount rather than in a lazy useState initializer (which
    // would desync from the SSR-rendered markup and cause a hydration error).
    const supportsFinePointer = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(supportsFinePointer);
    if (!supportsFinePointer) return;

    // Set a custom CSS cursor if a static image exists in `public/`.
    // Prefer `/cursor.png` (user-provided); fall back to `/cursor.svg`.
    const originalCursor = document.documentElement.style.cursor;
    const tryCursor = (path: string) => {
      try {
        document.documentElement.style.cursor = `url('${path}') 32 32, auto`;
      } catch (e) {
        // ignore – some browsers may throw on invalid cursor values
      }
    };
    // Try PNG first, then SVG placeholder.
    tryCursor('/cursor.png');
    // If PNG not present or unsupported, the browser will ignore it and
    // we set a visible SVG fallback.
    setTimeout(() => tryCursor('/cursor.svg'), 50);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let mouseX = ringX;
    let mouseY = ringY;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    // Full lag-behind trailing effect when motion is welcome; snaps
    // straight to the pointer (ease = 1) when reduced motion is preferred.
    const ease = reducedMotion ? 1 : cursorRingEase;
    let raf = 0;
    const tick = () => {
      ringX += (mouseX - ringX) * ease;
      ringY += (mouseY - ringY) * ease;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor-hover]")) setHovering(true);
    };
    const onOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor-hover]")) setHovering(false);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);

    return () => {
      // restore previous cursor
      try {
        document.documentElement.style.cursor = originalCursor || '';
      } catch {}
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, [reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-orange-highlight"
        style={{ willChange: "transform" }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border transition-[width,height,opacity] duration-300 ease-out"
        style={{
          willChange: "transform",
          width: hovering ? cursorSize.hover : cursorSize.base,
          height: hovering ? cursorSize.hover : cursorSize.base,
          borderColor: "var(--color-orange)",
          boxShadow: hovering ? cursorGlow.hover : cursorGlow.base,
          background: hovering ? "rgba(232, 80, 2, 0.08)" : "transparent",
        }}
      />
    </>
  );
}
