"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRight } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/animations/reveal";
import { Magnetic } from "@/components/buttons/magnetic";
import { Button } from "@/components/buttons/button";
import { contactCta } from "@/content/shared";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

const ARC_PATH_D = "M160 110 Q470 4 700 46";
// The drawing line's full length (dasharray) — see globals.css's
// .cta-arc-draw comment for how the hover glow layers on top of this.
// 620 fully hides the line (dashoffset === dasharray, no overlap with the
// path at all); 0 fully reveals it. "Roughly 15% drawn on entry" is
// 620 * (1 - 0.15).
const ARC_LENGTH = 620;
const ARC_ENTRY_OFFSET = ARC_LENGTH * 0.85;

const arrow = (
  <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-0.5" />
);

export function ContactCta() {
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const drawPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (reducedMotion || !sectionRef.current || !drawPathRef.current) return;

    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      // Tied to scroll position (scrub), not a timer — the arc draws as
      // the user arrives at the section rather than playing on its own
      // clock. `start`/`end` are what put "~15% drawn on entry, fully
      // closed once centred" at the two ends of the scrubbed range: the
      // path's own initial stroke-dashoffset (set below, in the JSX) is
      // already the 15%-drawn value, so this only has to animate the
      // remaining stretch to 0.
      gsap.to(drawPathRef.current, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "center center",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  return (
    // isolate: gives this section its own stacking-context root, same
    // reasoning as the hero — without it, absolutely positioned children
    // go looking for the nearest ancestor that establishes one.
    <section
      ref={sectionRef}
      className="contact-cta relative isolate overflow-hidden border-t border-line px-6 pb-8 pt-11 sm:px-10"
    >
      {/* Decorative — the real content is the headline/buttons below it,
          which is why this is aria-hidden rather than carrying any text
          of its own. */}
      <svg
        viewBox="0 0 700 110"
        preserveAspectRatio="none"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <path d={ARC_PATH_D} fill="none" stroke="var(--arc)" strokeWidth="1.5" strokeOpacity="0.2" />
        <path
          ref={drawPathRef}
          d={ARC_PATH_D}
          fill="none"
          stroke="#FF7A3D"
          strokeWidth="2.5"
          strokeDasharray={ARC_LENGTH}
          // Reduced motion: fully drawn at rest, no scroll-scrub at all
          // (the effect above never runs). Otherwise this is just the
          // ~15%-drawn starting point GSAP animates on from.
          strokeDashoffset={reducedMotion ? 0 : ARC_ENTRY_OFFSET}
          className="cta-arc-draw"
        />
      </svg>

      {/* `relative` (not the section's default static flow) is what makes
          this compete in the same positioned-stacking layer as the
          absolute SVG above and win by DOM order — see globals.css. */}
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <h2 className="font-heading text-[44px] font-extrabold uppercase leading-[0.88] tracking-[-0.045em]">
            {contactCta.headline.map((line, i) => (
              <span key={i} className="block text-paper">
                {line.text}
                {line.accent && <span className="text-[#FF7A2E]">{line.accent}</span>}
              </span>
            ))}
          </h2>

          <div className="mt-6 flex flex-wrap items-center gap-[11px]">
            <Magnetic strength={0.3} className="inline-flex">
              <Button
                href={contactCta.primary.href}
                icon={arrow}
                className="cta-wipe cta-primary-trigger relative uppercase tracking-wide"
              >
                {contactCta.primary.label}
              </Button>
            </Magnetic>
            <Magnetic strength={0.3} className="inline-flex">
              <Button
                href={contactCta.secondary.href}
                variant="secondary"
                icon={arrow}
                className="cta-wipe relative border-[#4A4A4A] uppercase tracking-wide"
              >
                {contactCta.secondary.label}
              </Button>
            </Magnetic>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
