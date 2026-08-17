"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  loaderConfig,
  loaderExitTransition,
  logoRevealTransition,
  sweepTransition,
} from "@/animations/loader";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useLenis } from "@/components/providers/smooth-scroll";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const reducedMotion = usePrefersReducedMotion();
  const lenis = useLenis();

  // Lock scroll for the (brief) duration the loading screen covers the page.
  useEffect(() => {
    if (loading) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
  }, [loading, lenis]);

  useEffect(() => {
    // sessionStorage only exists client-side, so this has to be an effect
    // (not a lazy useState initializer) to keep SSR and first-paint markup
    // identical and avoid a hydration mismatch.
    if (sessionStorage.getItem("arcone-loaded")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    // Respect reduced-motion by cutting the loading sequence down to a
    // near-instant fade instead of the full sweep-and-count-up — the point
    // isn't to skip loading state, just the extended motion around it.
    const duration = reducedMotion ? 200 : loaderConfig.durationMs;
    const exitDelay = reducedMotion ? 0 : loaderConfig.exitDelayMs;

    const start = Date.now();
    let raf = 0;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, Math.round((elapsed / duration) * 100));
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        sessionStorage.setItem("arcone-loaded", "1");
        setTimeout(() => setLoading(false), exitDelay);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [reducedMotion]);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          data-testid="loading-screen"
          className="fixed inset-0 z-[90] flex flex-col items-center justify-center bg-bg"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(8px)" }}
          transition={loaderExitTransition}
        >
          <div className="relative overflow-hidden">
            <motion.h1
              className="text-4xl font-semibold tracking-tight text-white sm:text-5xl"
              initial={{ opacity: 0.15 }}
              animate={{ opacity: 1 }}
              transition={logoRevealTransition}
            >
              ARC<span className="text-orange-highlight">one</span>
            </motion.h1>
            <motion.div
              className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-orange-highlight/60 to-transparent"
              animate={{ x: ["0%", "400%"] }}
              transition={sweepTransition}
              style={{ mixBlendMode: "overlay" }}
            />
          </div>
          <div className="mt-8 h-px w-40 overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-orange"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="mt-3 font-mono text-xs text-gray-medium">
            {progress}%
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
