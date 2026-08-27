"use client";
import { useEffect, useState } from "react";
import { useSetAppReady } from "@/components/providers/app-ready";
export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  const setAppReady = useSetAppReady();
  // Reports completion outward once — see app-ready.tsx for why anything
  // timed to "the page just loaded" (the hero's opening sequence, the
  // nav's entrance) needs to wait on this instead of its own mount time.
  // Doesn't change anything about Loader's own visuals/timing.
  useEffect(() => {
    if (done) setAppReady(true);
  }, [done, setAppReady]);
  useEffect(() => {
    const start = Date.now();
    // 60fps-audit note: this used to be 1400ms, but that's only the
    // point `target` locks at 100 — `progress` still has to *lerp* up to
    // it afterward (see LERP_RATE below), and at the old 0.08 rate that
    // lerp alone took ~60 extra frames (~1s at 60fps) to cross the 99.5%
    // completion check, plus the exit delay after that. Measured
    // end-to-end (nav start to the loader's pointer-events actually
    // going to "none", i.e. the page becoming interactive): ~3.2s — more
    // than double the 1.5s target, and MIN was less than half of that
    // total. Cut here; LERP_RATE and EXIT_DELAY_MS below are the other
    // two levers that mattered at least as much.
    const MIN = 350;
    // Higher = fewer frames to close the gap to `target`. At 0.08 the
    // 99.5% threshold took ~60 frames to cross; at 0.28 it's ~11.
    const LERP_RATE = 0.28;
    const EXIT_DELAY_MS = 120;
    let target = 0;
    let frame = 0;
    const bump = () => {
      const elapsed = Date.now() - start;
      const timeShare = Math.min(1, elapsed / MIN);
      const loadShare = document.readyState === "complete" ? 1 : 0.75;
      target = Math.min(timeShare, loadShare) * 100;
    };
    const loop = () => {
      bump();
      setProgress((p) => {
        const next = p + (target - p) * LERP_RATE;
        if (next > 99.5 && document.readyState === "complete") {
          setTimeout(() => setDone(true), EXIT_DELAY_MS);
          return 100;
        }
        return next;
      });
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, []);
  useEffect(() => {
    document.documentElement.style.overflow = done ? "" : "hidden";
  }, [done]);
  return (
    <div
      aria-hidden={done}
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-[#050505] transition-opacity duration-700"
      style={{
        opacity: done ? 0 : 1,
        pointerEvents: done ? "none" : "auto",
      }}
    >
      <svg
        viewBox="0 0 400 100"
        className="w-[70vw] max-w-[520px]"
        role="img"
        aria-label="Loading"
      >
        <defs>
          <clipPath id="fill-clip">
            <rect x="0" y={100 - progress} width="400" height="100" />
          </clipPath>
        </defs>
        <text
          x="200"
          y="72"
          textAnchor="middle"
          fill="none"
          stroke="#ebe8e3"
          strokeWidth="0.6"
          strokeOpacity="0.35"
          fontSize="76"
          fontFamily="var(--font-archivo, 'Archivo', system-ui, sans-serif)"
          fontWeight="800"
          letterSpacing="-3"
        >
          ARCONE
        </text>
        <g clipPath="url(#fill-clip)">
          <text
            x="200"
            y="72"
            textAnchor="middle"
            fill="#ebe8e3"
            fontSize="76"
            fontFamily="var(--font-archivo, 'Archivo', system-ui, sans-serif)"
            fontWeight="800"
            letterSpacing="-3"
          >
            ARCONE
          </text>
        </g>
      </svg>
    </div>
  );
}
