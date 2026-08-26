// Hero "opening title sequence" (components/hero/hero.tsx,
// components/hero/hero-background.tsx) — an ~2.5s cinematic reveal, plus
// the ambient-motion and mouse-parallax constants that keep running after
// it. Every delay below is relative to the Hero's own mount, which is
// also Loader's t=0 (components/Loader.tsx): Loader holds its opaque
// cover for roughly this same span, so by the time it dissolves the scene
// underneath is already mid-reveal rather than just appearing — change
// either one, check the other still lands somewhere sane.

export const heroEase = [0.16, 1, 0.3, 1] as const;

export const heroSequence = {
  glow: { delay: 0, duration: 1.3 },
  backgroundFadeUp: { delay: 0.5, duration: 1.4 },
  markEmerge: { delay: 0.8, duration: 1 },
  eyebrow: { delay: 1.0, duration: 0.8 },
  headlineStart: 1.2,
  headlineStagger: 0.15,
  headlineDuration: 1,
  subhead: { delay: 1.8, duration: 0.9 },
  ctas: { delay: 2.0, duration: 0.9 },
  nav: { delay: 2.2, duration: 0.8 },
};

// Vertical-mask line reveal for the headline: overflow-hidden box,
// translateY 110% -> 0%, 150ms apart per line.
export const heroHeadlineVariants = {
  hidden: { y: "110%" },
  visible: (i: number) => ({
    y: "0%",
    transition: {
      duration: heroSequence.headlineDuration,
      delay: heroSequence.headlineStart + heroSequence.headlineStagger * i,
      ease: heroEase,
    },
  }),
};

// `reveal` gates the target, not just whether a transition plays: until
// it's true the element sits at its `initial` values (held there via an
// explicit, matching `animate`, not just an un-set prop), so Framer has
// nothing to animate toward yet. The `delay` below only starts counting
// once `reveal` flips and `animate` actually changes — see useAppReady
// (components/providers/app-ready.tsx) for why that's tied to Loader
// finishing rather than to this component's own mount.
export function heroFadeIn(
  { delay, duration }: { delay: number; duration: number },
  reveal: boolean
) {
  return {
    initial: { opacity: 0, y: 16 },
    animate: reveal ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { delay, duration, ease: heroEase },
  };
}

// Ambient motion — continuous, barely-perceptible, after the load
// sequence settles. Implemented as CSS keyframe animations (globals.css:
// .hero-haze / .hero-trail-bright / .hero-mark-glow / .hero-mark-sweep)
// rather than driven from JS, so these durations are documentation for
// the CSS, not values consumed here.
export const ambientMotion = {
  hazeDriftSeconds: 34,
  lightTrailPulseSeconds: 8,
  markGlowSeconds: 6,
  markSweepSeconds: 9,
};

// Mouse parallax (desktop only, see lib/use-parallax-layers.ts): each
// layer multiplies the same lerped pointer offset by its own speed, the
// result is clamped to maxDisplacementPx regardless of speed.
export const parallaxLayers = {
  background: 1,
  mountain: 1.05,
  lightTrail: 1.1,
  mark: 1.15,
};

export const parallaxMaxDisplacementPx = 12;
// Lerp factor toward the target per animation frame — small enough that
// the layers visibly lag behind the cursor with some weight, not track it
// 1:1.
export const parallaxLerp = 0.06;
