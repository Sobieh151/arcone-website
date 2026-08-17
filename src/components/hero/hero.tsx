"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/buttons/magnetic";
import { Button } from "@/components/buttons/button";
import { hero } from "@/content/home";
import { heroLineVariants, heroFadeIn } from "@/animations/hero";
import { heroParallax } from "@/animations/scroll-parallax";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const GradientScene = dynamic(
  () => import("@/components/backgrounds/gradient-scene").then((m) => m.GradientScene),
  { ssr: false }
);

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();

  // Scroll-linked (not viewport-entry) motion: as the hero scrolls past,
  // its background drifts, scales up and dims — a depth cue rather than
  // a static backdrop. Real ScrollTrigger usage, not just registered and
  // left idle.
  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !bgRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
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
    // bg — body is already the same black.
    <section
      ref={sectionRef}
      className="relative isolate flex min-h-screen w-full flex-col items-center justify-center overflow-hidden"
    >
      <div ref={bgRef} className="absolute inset-0 -z-10">
        <GradientScene className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black" />
      </div>

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-white/5 px-4 py-1.5 text-xs uppercase tracking-widest text-gray-light backdrop-blur-sm"
        >
          {hero.eyebrow}
        </motion.span>

        <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl">
          {hero.headlineLines.map((text, i) => (
            <span key={text} className="block overflow-hidden pb-1">
              <motion.span
                custom={i}
                initial="hidden"
                animate="visible"
                variants={heroLineVariants}
                className="block"
              >
                {text}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.p
          {...heroFadeIn(0.9)}
          className="mt-8 max-w-xl text-balance text-lg text-gray-light md:text-xl"
        >
          {hero.subhead}
        </motion.p>

        <motion.div
          {...heroFadeIn(1.1)}
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row"
        >
          <Magnetic>
            <Button
              href={hero.primaryCta.href}
              icon={
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              }
            >
              {hero.primaryCta.label}
            </Button>
          </Magnetic>
          <Magnetic>
            <Button href={hero.secondaryCta.href} variant="secondary">
              {hero.secondaryCta.label}
            </Button>
          </Magnetic>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-10 flex flex-col items-center gap-2 text-gray-medium"
      >
        <span className="text-[11px] uppercase tracking-widest">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} />
        </motion.div>
      </motion.div>
    </section>
  );
}
