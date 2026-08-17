"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const LenisContext = createContext<Lenis | null>(null);

/** Lets any component start/stop the smooth-scroll instance — used to
 * lock background scroll behind the mobile menu and the loading screen. */
export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const reducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    // Reduced motion: skip Lenis entirely and fall back to native scroll —
    // no inertia, no smoothing, nothing to override the user's preference.
    // `lenis` is already null here, either from initial state or from the
    // previous effect run's own cleanup (below), so there's nothing to do.
    if (reducedMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    const instance = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    // Lenis is a third-party imperative library that has to be constructed
    // client-side, post-mount — there's no render-phase equivalent to
    // "create it during render" here. Storing the instance in state is the
    // standard way to expose an external system's handle to consumers
    // (useLenis) via context.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLenis(instance);

    instance.on("scroll", ScrollTrigger.update);

    const onTick = (time: number) => {
      instance.raf(time * 1000);
    };
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      instance.destroy();
      gsap.ticker.remove(onTick);
      setLenis(null);
    };
  }, [reducedMotion]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
