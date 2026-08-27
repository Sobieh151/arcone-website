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
  }, []);

  useEffect(() => {
    // `enabled` starts false, so the very first render (before this effect
    // has even run once) returns null — no dot/ring in the DOM yet. This
    // effect has to depend on `enabled` and bail out until it's true,
    // otherwise it captures dotRef.current/ringRef.current as null on that
    // first pass, exits via the guard below, and — since nothing here ever
    // changes `enabled` itself — never runs again. That left the listeners
    // and rAF loop permanently unattached: the dot and ring did mount once
    // `enabled` flipped true, but frozen at their unstyled default position
    // (fixed left:0 top:0, i.e. pinned in the corner) since nothing was
    // ever there to move them.
    if (!enabled) return;

    // Note: globals.css already sets `body { cursor: none }` on capable
    // devices, so the native OS cursor is hidden site-wide and this dot +
    // ring pair *is* the cursor. (An earlier version of this effect also
    // tried to layer a native `cursor: url(/cursor.png) …` image on top —
    // that never had any visible effect, since body's own `cursor: none`
    // always wins over an inherited value from a html-level inline style,
    // and cursor.png's actual dimensions (1254×1254) are far past what
    // browsers treat as a usable cursor image anyway. Removed rather than
    // fixed: a second, static cursor stacked on this animated one would
    // just be visual noise.)

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let ringX = window.innerWidth / 2;
    let ringY = window.innerHeight / 2;
    let mouseX = ringX;
    let mouseY = ringY;
    // Paint both elements at their starting position immediately (rather
    // than sitting pinned at the dot's default (0,0) markup position)
    // so they're already where the pointer roughly is once revealed —
    // but stay hidden (opacity: 0 in the JSX below) until that first
    // real mousemove actually arrives. Without that gate this "start at
    // centre" position is itself what was visible: a real user's mouse
    // is essentially always somewhere on screen already at page load, so
    // this only ever painted for a handful of frames for them — but
    // anything that never fires a mousemove at all (a headless browser
    // driving the page programmatically, a screenshot tool) left it
    // sitting there indefinitely, looking like a small stray ring+dot
    // fixed near the middle of every page.
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;

    let revealed = false;
    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      if (!revealed) {
        revealed = true;
        dot.style.opacity = "1";
        ring.style.opacity = "1";
      }
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
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
    };
  }, [enabled, reducedMotion]);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-orange-highlight"
        // opacity: 0 here (a plain, constant JSX value the "hovering"
        // re-renders below never touch) is what keeps this invisible
        // until onMove's one-time reveal writes "1" straight onto the
        // DOM node — see the comment above onMove for why.
        style={{ willChange: "transform", opacity: 0 }}
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[100] rounded-full border transition-[width,height,opacity] duration-300 ease-out"
        style={{
          willChange: "transform",
          opacity: 0,
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
