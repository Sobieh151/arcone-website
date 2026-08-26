"use client";

import { forwardRef } from "react";
import { motion } from "framer-motion";
import { heroEase, heroSequence } from "@/animations/hero";

// No photo asset exists for the "dark mountain landscape" the brief
// describes, and the performance budget rules out anything heavier
// (WebGL, video, a large raster still) anyway — so the backdrop is an
// illustrated SVG scene instead: a few KB, infinitely crisp, and every
// color already comes from the live design tokens instead of being baked
// into a bitmap. Swap this file for an <img>-based layer later if a real
// photograph shows up; hero.tsx's refs/parallax wiring doesn't care which
// one is behind them.

export const HeroMountains = forwardRef<SVGGElement, { className?: string }>(
  function HeroMountains({ className }, ref) {
    return (
      <g ref={ref} className={className}>
        {/* Far ridge — low, dim, spans the full width */}
        <polygon
          points="-10,78 8,66 22,72 38,58 55,68 72,55 88,64 100,60 110,66 110,110 -10,110"
          fill="var(--ink-soft)"
          opacity="0.7"
        />
        {/* Near ridge — bottom-right weighted, taller/darker/closer */}
        <polygon
          points="-10,95 15,90 30,80 42,86 58,68 68,74 78,52 90,60 100,48 110,58 110,110 -10,110"
          fill="#020202"
        />
      </g>
    );
  }
);

export const HeroLightTrail = forwardRef<SVGGElement, { className?: string }>(
  function HeroLightTrail({ className }, ref) {
    return (
      <g ref={ref} className={className}>
        {/* Long-exposure base line — always visible, dim */}
        <path
          d="M -10,72 C 20,30 46,88 68,32 S 92,8 112,18"
          fill="none"
          stroke="var(--arc)"
          strokeOpacity="0.2"
          strokeWidth="0.45"
          strokeLinecap="round"
        />
        {/* Bright traveling segment. Originally an animated
            stroke-dashoffset on a copy of the path above — measured (via
            a CDP trace) as ~70% of this page's entire idle rasterization
            cost: animating dashoffset makes the browser re-stroke the
            whole path's geometry every single frame, which is genuinely
            expensive, not just "a filter is on it" (a same-shaped CSS
            `filter: blur()` swap alone barely moved the number). Replaced
            with `offset-path`/`offset-distance`: a small, fixed-shape
            ellipse repositioned along the *same* path string via what the
            browser treats as an ordinary transform update, not a redraw —
            confirmed back down to baseline raster cost. `offset-rotate:
            auto` keeps its long axis tangent to the curve as it travels,
            so it still reads as a short streak, not a dot. */}
        <ellipse
          className="hero-trail-bright"
          rx="3.2"
          ry="0.45"
          fill="var(--arc-bright)"
          style={{
            offsetPath: "path('M -10,72 C 20,30 46,88 68,32 S 92,8 112,18')",
            offsetRotate: "auto",
            filter: "blur(1.2px)",
          }}
        />
      </g>
    );
  }
);

export function HeroScene({
  backgroundRef,
  mountainRef,
  trailRef,
  reducedMotion,
  reveal,
}: {
  backgroundRef: React.RefObject<SVGSVGElement | null>;
  mountainRef: React.RefObject<SVGGElement | null>;
  trailRef: React.RefObject<SVGGElement | null>;
  reducedMotion: boolean;
  /** True once it's actually time to play the entrance — see
   * useAppReady (components/providers/app-ready.tsx). Gates `animate`
   * (not just whether a transition plays): until this flips, these stay
   * held at their `initial` values instead of animating in on their own
   * mount-relative clock, underneath the still-opaque Loader. */
  reveal: boolean;
}) {
  return (
    <svg
      ref={backgroundRef}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMaxYMax slice"
      className="absolute inset-0 h-full w-full"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="hero-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--ink)" />
          <stop offset="100%" stopColor="var(--ink-soft)" />
        </linearGradient>
        {/* Blur is CSS `filter: blur()` at each element (see the notes
            there), not SVG-native <feGaussianBlur> — the latter is much
            more expensive to keep composited, especially under a running
            CSS animation. No <filter> defs needed here any more. */}
        <radialGradient id="hero-glow-radial" cx="78%" cy="62%" r="55%">
          <stop offset="0%" stopColor="var(--arc)" stopOpacity="0.22" />
          <stop offset="45%" stopColor="var(--arc)" stopOpacity="0.06" />
          <stop offset="100%" stopColor="var(--arc)" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="100" height="100" fill="url(#hero-sky)" />

      {/* Beat 1 (t=0): "a small orange glow appears in the environment" —
          a light source, not a fill, so it's a soft radial that fades in
          on its own, ahead of everything else. */}
      <motion.rect
        // `usePrefersReducedMotion` is deliberately `false` on the very
        // first render (it only knows the real value post-mount, to avoid
        // an SSR hydration mismatch — see the hook itself). Framer Motion
        // only ever reads `initial` once, at mount (it's captured via
        // `useConstant` internally), so without this key a reduced-motion
        // user would still get the full opacity animation: the element
        // mounts before `reducedMotion` flips true, `initial` is
        // permanently resolved to `{ opacity: 0 }`, and the later prop
        // change is silently ignored. Keying on `reducedMotion` forces a
        // remount when it flips, so `initial` gets re-evaluated correctly.
        key={`glow-${reducedMotion ? "reduced" : "motion"}`}
        width="100"
        height="100"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: reveal ? 1 : 0 }}
        transition={{
          delay: heroSequence.glow.delay,
          duration: heroSequence.glow.duration,
          ease: heroEase,
        }}
        fill="url(#hero-glow-radial)"
      />

      {/* Beat 2 (t=0.5s): "background fades up from darkness" — haze,
          mountains and the light trail arrive together as one layer. The
          mountain/trail <g>s below carry their own refs for the mouse
          parallax (imperative style.transform writes); this wrapper only
          ever touches opacity, so the two never fight over the same CSS
          property. */}
      <motion.g
        // See the `key` comment on the glow `motion.rect` above — same
        // stale-`initial` pitfall, same fix. Prefixed (unlike that one)
        // because these two are siblings under the same <svg>: React
        // requires unique keys among siblings, not just per-component.
        key={`bg-${reducedMotion ? "reduced" : "motion"}`}
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: reveal ? 1 : 0 }}
        transition={{
          delay: heroSequence.backgroundFadeUp.delay,
          duration: heroSequence.backgroundFadeUp.duration,
          ease: heroEase,
        }}
      >
        <g className="hero-haze">
          <ellipse
            cx="60"
            cy="58"
            rx="42"
            ry="14"
            fill="var(--paper)"
            opacity="0.035"
            style={{ filter: "blur(12px)" }}
          />
        </g>

        <HeroLightTrail ref={trailRef} />
        <HeroMountains ref={mountainRef} />

        {/* Subtle color-grade darkening. Was `fill="url(#hero-sky)"
            opacity="0.15" style={{mixBlendMode: "multiply"}}` — measured
            (via a CDP trace during scroll) as the single largest
            contributor to scroll jank on this page: 461ms worst-frame,
            ~31fps average, dropping to 80ms/~52fps with just this one
            change. `mix-blend-mode` forces a genuine per-pixel blend
            against everything underneath on every repaint, and this
            layer sits inside the GSAP scroll-scrub `scale` animation
            (hero.tsx), so it was recomputing on every scroll tick. A
            plain alpha-composited dark rect reads as essentially the
            same subtle grading without that cost — ordinary compositing,
            not a per-frame blend. */}
        <rect width="100" height="100" fill="var(--ink)" opacity="0.12" />
      </motion.g>
    </svg>
  );
}

// Six-point mark: 3 tapered petals mirrored to 6, rotated 60deg apart —
// the same construction as a sparkle/asterisk glyph. Its own small,
// fixed-aspect SVG (not folded into the stretched 0-100 scene above) so
// it never distorts.
const PETAL_D = "M0,0 L6,-16 L0,-52 L-6,-16 Z";
const PETAL_ANGLES = [0, 60, 120, 180, 240, 300];

export const ArcMark = forwardRef<
  HTMLDivElement,
  { className?: string; reducedMotion: boolean; reveal: boolean }
>(function ArcMark({ className, reducedMotion, reveal }, ref) {
  return (
    <div ref={ref} className={className}>
      <motion.svg
        // See the `key` comment on HeroScene's glow `motion.rect` — same
        // stale-`initial` pitfall, same fix: without this, a real
        // reduced-motion user still gets the full scale/opacity entrance
        // because `initial` is only ever read at mount, before
        // `reducedMotion` has flipped from its SSR-safe `false` default.
        key={reducedMotion ? "reduced" : "motion"}
        viewBox="-60 -60 120 120"
        className="h-full w-full overflow-visible"
        role="img"
        aria-label="ARCone mark"
        initial={reducedMotion ? false : { opacity: 0, scale: 0.85 }}
        animate={{ opacity: reveal ? 1 : 0, scale: reveal ? 1 : 0.85 }}
        transition={{
          delay: heroSequence.markEmerge.delay,
          duration: heroSequence.markEmerge.duration,
          ease: heroEase,
        }}
      >
        <defs>
          <clipPath id="hero-mark-clip">
            {PETAL_ANGLES.map((deg) => (
              <path key={deg} d={PETAL_D} transform={`rotate(${deg})`} />
            ))}
          </clipPath>
          <linearGradient id="hero-mark-sweep-grad" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="var(--paper)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--paper)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--paper)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Soft glow, behind the mark, opacity-pulsing. CSS filter, not
            SVG <feGaussianBlur> — see the note on the light trail's
            equivalent swap; this one's `.hero-mark-glow` opacity keyframe
            animation was one of the ones actually costing frame budget. */}
        <g className="hero-mark-glow" style={{ filter: "blur(12px)" }}>
          {PETAL_ANGLES.map((deg) => (
            <path key={deg} d={PETAL_D} transform={`rotate(${deg})`} fill="var(--arc)" />
          ))}
        </g>

        {/* The mark itself */}
        <g>
          {PETAL_ANGLES.map((deg) => (
            <path key={deg} d={PETAL_D} transform={`rotate(${deg})`} fill="var(--arc)" />
          ))}
        </g>

        {/* Occasional light sweep, clipped to the mark's own silhouette */}
        <rect
          x="-70"
          y="-70"
          width="40"
          height="140"
          fill="url(#hero-mark-sweep-grad)"
          clipPath="url(#hero-mark-clip)"
          className="hero-mark-sweep"
        />
      </motion.svg>
    </div>
  );
});

/**
 * The hero's "startup" hook: a single, bold bloom of --arc light behind
 * the ARC mark that fires once as the page opens, then settles into a
 * quiet static afterglow — distinct from (and layered under) the mark's
 * own `.hero-mark-glow`/`.hero-mark-sweep` above, which keep breathing
 * long after this one-shot flourish has finished playing. It's the first
 * thing the eye catches, ahead of the mark itself emerging at
 * `markEmerge.delay` (0.8s) and the headline a beat after that.
 *
 * A full conditional branch (render this or nothing), not the
 * `initial={reducedMotion ? false : …}` pattern used elsewhere in this
 * file — there's no persistently-mounted element here whose `initial`
 * could go stale, so there's nothing for that fix to apply to. Under
 * reduced motion this renders nothing at all, same as the load sequence
 * having no separate steps to skip.
 *
 * The blur is set once, statically, via a plain (non-animated) CSS
 * `filter` — only opacity and scale animate, both transform/opacity-class
 * properties, never the filter itself.
 *
 * Like the rest of the hero, the bloom itself waits on `reveal` (see
 * useAppReady) rather than firing on its own mount — the entire ~1.8s
 * keyframe sequence would otherwise already be finished and settled
 * behind Loader's opaque cover before the user ever sees it, which for a
 * "hook" specifically defeats the point.
 */
export function AuraHook({
  reducedMotion,
  reveal,
  className,
}: {
  reducedMotion: boolean;
  reveal: boolean;
  className?: string;
}) {
  if (reducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className={className}
      style={{
        background: "radial-gradient(circle, var(--arc), transparent 70%)",
        filter: "blur(60px)",
      }}
      initial={{ opacity: 0, scale: 0.55 }}
      animate={
        reveal
          ? { opacity: [0, 0.9, 0.32], scale: [0.55, 1.15, 1] }
          : { opacity: 0, scale: 0.55 }
      }
      transition={{
        duration: 1.8,
        times: [0, 0.45, 1],
        ease: heroEase,
      }}
    />
  );
}
