"use client";

import { forwardRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { heroEase, heroSequence } from "@/animations/hero";
import {
  ARC_MARK_BAR_OUTLINE,
  ARC_MARK_ROTATIONS,
  ARC_MARK_VIEWBOX,
} from "@/components/icons/arc-mark";

// Tiny 8x8 solid-tone PNG (ink fading toward a warm ember) used as the
// LCP image's blur-up placeholder while /public/hero.jpg downloads —
// hero.jpg is a remote/dynamic src as far as next/image is concerned (not
// a static import), so Next can't derive this automatically the way it
// would for an imported asset; see the next/image docs on blurDataURL.
const HERO_IMAGE_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAANElEQVR4nGNgxQEYuDnYsCIGAS4OrIhBjJcTK2KQ4efGihiUhHiwIgZ1ET4siEFXnB8rAgCO9QxBdmsGAQAAAABJRU5ErkJggg==";

export function HeroScene({
  backgroundRef,
  reducedMotion,
  reveal,
}: {
  backgroundRef: React.RefObject<HTMLDivElement | null>;
  reducedMotion: boolean;
  /** True once it's actually time to play the entrance — see
   * useAppReady (components/providers/app-ready.tsx). Gates `animate`
   * (not just whether a transition plays): until this flips, these stay
   * held at their `initial` values instead of animating in on their own
   * mount-relative clock, underneath the still-opaque Loader. */
  reveal: boolean;
}) {
  return (
    <>
      {/* Solid --ink sits behind the photo permanently (not part of the
          fade below) so nothing flashes while hero.jpg is still
          downloading, independent of whether the entrance has played. */}
      <div className="absolute inset-0 bg-ink" />

      {/* Beat 2 (t=0.5s) of the original load sequence — "background
          fades up from darkness" — now applied to the photo + its
          overlays instead of the old SVG haze/mountains layer. Same
          `key`-on-reducedMotion fix as everywhere else in this file: an
          `initial` object is only ever read once, at mount, and
          `reducedMotion` is `false` on the very first render by design
          (SSR-safe default), so without the key a reduced-motion user
          would still get the fade baked in from that stale first read. */}
      <motion.div
        key={`bg-${reducedMotion ? "reduced" : "motion"}`}
        className="absolute inset-0"
        initial={reducedMotion ? false : { opacity: 0 }}
        animate={{ opacity: reveal ? 1 : 0 }}
        transition={{
          delay: heroSequence.backgroundFadeUp.delay,
          duration: heroSequence.backgroundFadeUp.duration,
          ease: heroEase,
        }}
      >
        {/* The mouse-parallax "image" layer (1x, see use-parallax-layers.ts) —
            only the photo itself moves; the scrim/vignette below stay put
            so the text above them never loses contrast as the photo drifts. */}
        <div ref={backgroundRef} className="absolute inset-0">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            preload
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={HERO_IMAGE_BLUR_DATA_URL}
          />
        </div>

        {/* Left-to-right scrim — what makes the headline legible over a
            lit photograph instead of a flat dark illustration. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(5,5,5,0.95) 0%, rgba(5,5,5,0.70) 44%, rgba(5,5,5,0) 100%)",
          }}
        />

        {/* Vertical vignette — darkens the top (nav legibility) and the
            bottom (CTA row) while leaving the photo's midtones clearest. */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(5,5,5,0.50) 0%, rgba(5,5,5,0) 45%, rgba(5,5,5,0.82) 100%)",
          }}
        />
      </motion.div>
    </>
  );
}

export const ArcMark = forwardRef<
  HTMLDivElement,
  { className?: string; reducedMotion: boolean; reveal: boolean }
>(function ArcMark({ className, reducedMotion, reveal }, ref) {
  return (
    <div ref={ref} className={className}>
      <motion.svg
        // See the `key` comment on HeroScene's fade `motion.div` above — same
        // stale-`initial` pitfall, same fix: without this, a real
        // reduced-motion user still gets the full scale/opacity entrance
        // because `initial` is only ever read at mount, before
        // `reducedMotion` has flipped from its SSR-safe `false` default.
        key={reducedMotion ? "reduced" : "motion"}
        viewBox={ARC_MARK_VIEWBOX}
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
            {ARC_MARK_ROTATIONS.map((deg) => (
              <polygon
                key={deg}
                points={ARC_MARK_BAR_OUTLINE}
                transform={deg ? `rotate(${deg} 100 100)` : undefined}
              />
            ))}
          </clipPath>
          <linearGradient id="hero-mark-sweep-grad" x1="0" y1="0" x2="1" y2="0.3">
            <stop offset="0%" stopColor="var(--paper)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--paper)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--paper)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Soft glow, behind the mark, opacity-pulsing. CSS filter, not
            SVG <feGaussianBlur> — cheaper to keep composited under a
            running animation. Solid-fill silhouettes of the three bars,
            not the two-face bevel, since a blurred gradient buys nothing
            here. */}
        <g className="hero-mark-glow" style={{ filter: "blur(12px)" }}>
          {ARC_MARK_ROTATIONS.map((deg) => (
            <polygon
              key={deg}
              points={ARC_MARK_BAR_OUTLINE}
              transform={deg ? `rotate(${deg} 100 100)` : undefined}
              fill="var(--arc)"
            />
          ))}
        </g>

        {/* The mark itself — the one shared definition (components/icons/
            arc-mark.tsx), referenced here instead of redrawn. */}
        <use href="#arc-mark" />

        {/* Occasional light sweep, clipped to the mark's own silhouette */}
        <rect
          x="-115"
          y="-115"
          width="70"
          height="230"
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
        // Reduced from blur(60px) — the mark itself is smaller and sits
        // further off-centre now, so the same radius read as an oversized
        // halo competing with the headline.
        filter: "blur(40px)",
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
