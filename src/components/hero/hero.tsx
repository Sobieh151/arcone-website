"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "lucide-react";
import { Magnetic } from "@/components/buttons/magnetic";
import { Button } from "@/components/buttons/button";
import { hero } from "@/content/home";
import { heroEase, heroFadeIn, heroHeadlineVariants, heroSequence } from "@/animations/hero";
import { heroParallax } from "@/animations/scroll-parallax";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { useParallaxLayers } from "@/lib/use-parallax-layers";
import { useAppReady } from "@/components/providers/app-ready";
import { HeroScene, ArcMark, AuraHook } from "@/components/hero/hero-background";

const arrow = <ArrowUpRight size={16} className="transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-0.5" />;

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  // The whole scene (SVG background + ARC mark) scales/dims together as
  // the section scrolls past — the one piece of scroll-linked (not
  // viewport-entry) motion here, a depth cue rather than a static backdrop.
  const sceneWrapRef = useRef<HTMLDivElement>(null);

  const backgroundRef = useRef<SVGSVGElement>(null);
  const mountainRef = useRef<SVGGElement>(null);
  const trailRef = useRef<SVGGElement>(null);
  const markRef = useRef<HTMLDivElement>(null);

  const reducedMotion = usePrefersReducedMotion();
  const appReady = useAppReady();
  // Reduced-motion users get the final state immediately regardless of
  // Loader (their `initial={false}` branches below never animate in the
  // first place); everyone else's entrance waits for Loader to actually
  // finish. See app-ready.tsx.
  const reveal = reducedMotion || appReady;

  useParallaxLayers(
    { background: backgroundRef, mountain: mountainRef, lightTrail: trailRef, mark: markRef },
    !reducedMotion
  );

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !sceneWrapRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(sceneWrapRef.current, {
        scale: heroParallax.scaleTo,
        yPercent: heroParallax.yPercentTo,
        opacity: heroParallax.opacityTo,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    // `isolate` (not `bg-bg`) makes this section its own stacking-context
    // root: without it, `-z-10` children go looking for the nearest
    // ancestor that establishes one, land behind <body>'s own opaque
    // background instead, and never paint at all. No need for a section
    // bg — body is already --ink.
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-screen w-full flex-col justify-center overflow-hidden bg-ink"
    >
      {/* ArcMark lives inside this wrapper (not as a sibling) specifically
          so the GSAP scroll effect below — which targets sceneWrapRef —
          scales/dims it along with the SVG background, per "the whole
          scene (SVG background + ARC mark) scales/dims together" above.
          It still paints above the background/gradient (last in source
          order) and below the z-10 content below (this whole wrapper is
          -z-10), so visual stacking is unchanged from a flat sibling
          layout — only the scroll-linked motion is added. */}
      <div ref={sceneWrapRef} className="absolute inset-0 -z-10">
        <HeroScene
          backgroundRef={backgroundRef}
          mountainRef={mountainRef}
          trailRef={trailRef}
          reducedMotion={reducedMotion}
          reveal={reveal}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-ink/80" />

        {/* ARC mark + its startup aura hook — large, right side, vertically
            centered on desktop; upper-right and smaller on mobile, per the
            mobile spec. Both are sized off this one shared, responsively
            positioned wrapper, rather than each carrying its own copy of
            the same breakpoints — the aura just blooms bigger (190%,
            centered) within it. */}
        <div className="pointer-events-none absolute right-6 top-28 z-0 h-20 w-20 sm:right-10 sm:top-32 sm:h-28 sm:w-28 md:right-[6vw] md:top-1/2 md:h-[26vw] md:max-h-[420px] md:w-[26vw] md:max-w-[420px] md:-translate-y-1/2">
          <AuraHook
            reducedMotion={reducedMotion}
            reveal={reveal}
            className="absolute left-1/2 top-1/2 -z-10 h-[190%] w-[190%] -translate-x-1/2 -translate-y-1/2"
          />
          <ArcMark
            ref={markRef}
            reducedMotion={reducedMotion}
            reveal={reveal}
            className="absolute inset-0"
          />
        </div>
      </div>

      <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-32 sm:px-10 lg:px-16">
        {reducedMotion ? (
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-arc">
            {hero.eyebrow}
          </span>
        ) : (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: reveal ? 1 : 0, y: reveal ? 0 : 8 }}
            transition={{
              delay: heroSequence.eyebrow.delay,
              duration: heroSequence.eyebrow.duration,
              ease: heroEase,
            }}
            className="font-mono text-xs uppercase tracking-[0.2em] text-arc"
          >
            {hero.eyebrow}
          </motion.span>
        )}

        <h1 className="mt-6 max-w-3xl font-heading text-[clamp(2.75rem,9vw,5.5rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em] text-paper">
          {hero.headline.map((line, i) => (
            <span key={line.text} className="block overflow-hidden pb-1">
              {reducedMotion ? (
                <span className="block">
                  {line.text}
                  {line.accent && <span className="text-arc">{line.accent}</span>}
                </span>
              ) : (
                <motion.span
                  custom={i}
                  initial="hidden"
                  animate={reveal ? "visible" : "hidden"}
                  variants={heroHeadlineVariants}
                  className="block"
                >
                  {line.text}
                  {line.accent && <span className="text-arc">{line.accent}</span>}
                </motion.span>
              )}
            </span>
          ))}
        </h1>

        {reducedMotion ? (
          <p className="mt-8 max-w-[28ch] text-base text-paper/65 sm:text-lg">{hero.subhead}</p>
        ) : (
          <motion.p
            {...heroFadeIn(heroSequence.subhead, reveal)}
            className="mt-8 max-w-[28ch] text-base text-paper/65 sm:text-lg"
          >
            {hero.subhead}
          </motion.p>
        )}

        {reducedMotion ? (
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <CtaButtons />
          </div>
        ) : (
          <motion.div
            {...heroFadeIn(heroSequence.ctas, reveal)}
            className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <CtaButtons />
          </motion.div>
        )}
      </div>
    </section>
  );
}

function CtaButtons() {
  return (
    <>
      <Magnetic className="w-full sm:w-auto">
        <Button
          href={hero.primaryCta.href}
          icon={arrow}
          className="cta-wipe relative w-full uppercase tracking-wide sm:w-auto"
        >
          {hero.primaryCta.label}
        </Button>
      </Magnetic>
      <Magnetic className="w-full sm:w-auto">
        <Button
          href={hero.secondaryCta.href}
          variant="secondary"
          icon={arrow}
          className="cta-wipe relative w-full uppercase tracking-wide sm:w-auto"
        >
          {hero.secondaryCta.label}
        </Button>
      </Magnetic>
    </>
  );
}
