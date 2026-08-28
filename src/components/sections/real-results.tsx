"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/animations/reveal";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { resultsStats, type ResultStat } from "@/content/home";

// Spelled out for screen readers — "240 percent Average ROAS", not "240 %
// Average ROAS" — see `spokenPhrase` below.
const SUFFIX_WORDS: Record<string, string> = { "%": "percent", "+": "plus", M: "million" };

function formatStat(current: number, stat: ResultStat) {
  return `${current.toFixed(stat.decimals)}${stat.suffix}`;
}

function spokenPhrase(stat: ResultStat) {
  const word = SUFFIX_WORDS[stat.suffix] ?? stat.suffix;
  return `${stat.value.toFixed(stat.decimals)} ${word} ${stat.label}`;
}

/**
 * One shared rAF loop for all four stats, not four independent ones — that
 * single shared `start` timestamp is what actually guarantees "all four
 * begin on the same frame." Each stat computes its own progress against
 * its own `durationMs`, so despite starting together they land in
 * sequence: shortest duration first, longest last (see resultsStats'
 * doc comment in content/home.ts for why that reads left-to-right).
 *
 * `skip` (prefers-reduced-motion) jumps straight to final values with no
 * rAF loop at all, still gated on `active` so it only fires once the
 * section is actually in view, same trigger point either way.
 */
function useSequentialCountUp(active: boolean, skip: boolean) {
  const [values, setValues] = useState<number[]>(() => resultsStats.map(() => 0));

  useEffect(() => {
    if (!active) return;

    if (skip) {
      // Reduced motion: jump straight to final values, no rAF loop — this
      // still only fires once `active` flips (post-mount, from the
      // IntersectionObserver below), never synchronously at render time.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValues(resultsStats.map((stat) => stat.value));
      return;
    }

    let raf = 0;
    let start: number | null = null;

    const tick = (timestamp: number) => {
      if (start === null) start = timestamp;
      const elapsed = timestamp - start;

      let allDone = true;
      const next = resultsStats.map((stat) => {
        const progress = Math.min(1, elapsed / stat.durationMs);
        if (progress < 1) allDone = false;
        // Ease-out cubic: decelerates into the final value instead of
        // stopping dead.
        const eased = 1 - Math.pow(1 - progress, 3);
        return stat.value * eased;
      });
      setValues(next);

      if (!allDone) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, skip]);

  return values;
}

export function RealResults() {
  const reducedMotion = usePrefersReducedMotion();
  const statsRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    // threshold 0.2, not 0.4 — a stats row taller than 40% of a short
    // mobile viewport could cross the old threshold late or never; 0.2 is
    // reachable much sooner. rootMargin shrinks the effective viewport by
    // 10% off the bottom, so the count starts a little before the row is
    // fully in view rather than right at the literal edge.
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const values = useSequentialCountUp(active, reducedMotion);

  return (
    <section className="border-t border-line py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Reveal>
            <div>
              <span className="block text-xs uppercase tracking-[0.2em] text-[#FF7A2E]">
                Results
              </span>
              <h2 className="mt-2 font-heading text-[32px] font-extrabold uppercase leading-none tracking-[-0.04em] text-paper">
                Look at the numbers.
              </h2>
            </div>
          </Reveal>
        </div>

        <div ref={statsRef} className="mt-[22px] grid grid-cols-2 gap-[18px] md:grid-cols-4">
          {resultsStats.map((stat, i) => (
            <div key={stat.label} role="group" aria-label={spokenPhrase(stat)} className="min-w-0">
              <span
                aria-hidden="true"
                className="block font-heading font-extrabold leading-none tracking-[-0.04em] text-paper tabular-nums text-[42px]"
                style={{ minWidth: `${formatStat(stat.value, stat).length}ch` }}
              >
                {formatStat(values[i], stat)}
              </span>
              <span aria-hidden="true" className="mt-[10px] block text-[11.5px] uppercase tracking-[0.16em] text-mute">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
