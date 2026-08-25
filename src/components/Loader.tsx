"use client";
import { useEffect, useState } from "react";
export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const start = Date.now();
    const MIN = 1400;
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
        const next = p + (target - p) * 0.08;
        if (next > 99.5 && document.readyState === "complete") {
          setTimeout(() => setDone(true), 400);
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
