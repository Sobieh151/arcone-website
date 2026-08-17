"use client";

import { useEffect, useState } from "react";

/**
 * Framer Motion's `MotionConfig reducedMotion="user"` (set once, at the
 * root layout) handles every Framer-driven animation automatically. This
 * hook covers the handful of things on the site that AREN'T Framer Motion
 * and so don't get that for free: the loading screen's rAF progress loop,
 * the custom cursor's follow loop, and the WebGL shader's time uniform.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Reading a media query's initial value has to happen post-mount (see
    // the matching note in custom-cursor.tsx) to avoid an SSR hydration
    // mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReduced(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return reduced;
}
