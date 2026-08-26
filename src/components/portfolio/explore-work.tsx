"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { MaskReveal } from "@/components/animations/mask-reveal";
import { Button } from "@/components/buttons/button";
import { Magnetic } from "@/components/buttons/magnetic";
import { ProjectModal } from "@/components/portfolio/project-modal";
import { useProjectModal } from "@/lib/use-project-modal";
import { useCarouselDrag, circularDistance, wrapIndex } from "@/lib/use-carousel-drag";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";
import { projects as caseStudies } from "@/data/projects";
import { cn } from "@/lib/utils";

function placeholderArt(color: string) {
  return `radial-gradient(circle at 30% 30%, ${color}55, transparent 65%), linear-gradient(160deg, #0d0d0d, #000)`;
}

type CarouselProject = { title: string; category: string; image: string; href: string };

// Homepage teaser list — placeholders pending the real, ordered client
// roster (the whole portfolio is fictional case studies for now; see the
// TODO at the top of data/projects.ts). `image` holds a generated
// placeholder gradient standing in for real photography — swap for a
// `background-image: url(...)` once real photos exist, nothing else
// here needs to change. The first four titles match data/projects.ts's
// case studies, so those cards open the real project modal on click; the
// fifth has no case study behind it yet and just links out to /work,
// same as the "View All Work" button.
const CAROUSEL_PROJECTS: CarouselProject[] = [
  { title: "North Atlas", category: "Branding", image: placeholderArt("#E85002"), href: "/work" },
  { title: "Fielder", category: "Web & App", image: placeholderArt("#FF6001"), href: "/work" },
  { title: "Marrow", category: "Media & Activations", image: placeholderArt("#C13001"), href: "/work" },
  { title: "Harbor & Co.", category: "Digital Marketing", image: placeholderArt("#9C3F0B"), href: "/work" },
  { title: "More Work Soon", category: "[[ Category ]]", image: placeholderArt("#6f6d6a"), href: "/work" },
];

// Visual state per ring — active / adjacent / further-out, exactly the
// three tiers in the brief. `blur`/`glow` are fixed values per tier, only
// ever changed by a discrete index update (never a per-frame loop); the
// 700ms CSS transition (globals.css: .explore-card) is what animates the
// move between them.
function cardState(distance: number) {
  const abs = Math.abs(distance);
  if (abs === 0) {
    return { scale: 1, opacity: 1, blur: 0, z: 30, glow: "0 0 50px rgba(255,74,13,0.14)" };
  }
  if (abs === 1) {
    return { scale: 0.86, opacity: 0.4, blur: 2, z: 20, glow: "none" };
  }
  return { scale: 0.8, opacity: 0.12, blur: 2, z: Math.max(1, 10 - abs), glow: "none" };
}

export function ExploreWork() {
  const reducedMotion = usePrefersReducedMotion();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const length = CAROUSEL_PROJECTS.length;

  const { project: modalProject, open: openModal, close: closeModal } = useProjectModal();

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(query.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const advance = (step: number) => setActiveIndex((i) => wrapIndex(i + step, length));

  // Destructured, not kept as a `drag.X` object — eslint's
  // react-hooks/refs rule flags property access into an object carrying
  // a ref (trackRef here), same reasoning as useTilt's call sites.
  const {
    trackRef,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onKeyDown,
    consumeJustDragged,
  } = useCarouselDrag({
    disabled: reducedMotion || isMobile,
    onAdvance: advance,
  });

  const activate = (index: number, trigger: HTMLElement) => {
    if (consumeJustDragged()) return;
    if (index !== activeIndex) {
      setActiveIndex(index);
      return;
    }
    const entry = CAROUSEL_PROJECTS[index];
    const match = caseStudies.find((p) => p.name === entry.title);
    if (match) {
      openModal(match, trigger);
    } else {
      router.push(entry.href);
    }
  };

  const useNativeScroll = reducedMotion || isMobile;

  return (
    <section className="relative overflow-hidden border-t border-line bg-ink py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[minmax(0,280px)_1fr] lg:items-center lg:gap-8">
          {/* Left column */}
          <div>
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-arc">
                Explore Our Work
                <ArrowUpRight size={14} />
              </span>
            </Reveal>
            <MaskReveal
              as="p"
              delay={0.06}
              className="mt-5 max-w-xs text-balance text-base leading-relaxed text-paper/65"
            >
              [[ Explore Our Work — one to two sentence supporting line ]]
            </MaskReveal>
            <Reveal delay={0.12}>
              <Magnetic strength={0.3} className="mt-8 inline-flex">
                <Button href="/work" variant="secondary" icon={<ArrowUpRight size={15} className="text-arc" />}>
                  View All Work
                </Button>
              </Magnetic>
            </Reveal>
          </div>

          {/* Carousel */}
          <div className="relative">
            {useNativeScroll ? (
              <MobileRow
                reducedMotion={reducedMotion}
                onActivate={(index, trigger) => {
                  const entry = CAROUSEL_PROJECTS[index];
                  const match = caseStudies.find((p) => p.name === entry.title);
                  if (match) openModal(match, trigger);
                  else router.push(entry.href);
                }}
              />
            ) : (
              <>
                <div className="flex items-center justify-center gap-5">
                  <button
                    type="button"
                    data-cursor-hover
                    aria-label="Previous project"
                    onClick={() => advance(-1)}
                    className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border border-line text-arc transition-colors hover:border-arc"
                  >
                    <ArrowLeft size={14} />
                  </button>

                  <div
                    ref={trackRef}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Selected work"
                    tabIndex={0}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerCancel}
                    onKeyDown={onKeyDown}
                    className={cn(
                      "explore-track relative h-[380px] w-full max-w-xl touch-pan-y select-none overflow-hidden sm:h-[420px]",
                      isDragging && "is-dragging"
                    )}
                    style={{ "--card-spacing": "230px" } as CSSProperties}
                  >
                    {CAROUSEL_PROJECTS.map((entry, index) => {
                      const distance = circularDistance(index, activeIndex, length);
                      const isActive = distance === 0;
                      const state = cardState(distance);
                      return (
                        <button
                          key={entry.title}
                          type="button"
                          data-cursor-hover
                          aria-label={`${entry.title} — ${entry.category}`}
                          aria-current={isActive ? "true" : undefined}
                          tabIndex={Math.abs(distance) > 2 ? -1 : 0}
                          onClick={(e) => activate(index, e.currentTarget)}
                          className="explore-card explore-card--desktop group w-64 overflow-hidden rounded-3xl border border-line text-left sm:w-72"
                          style={
                            {
                              "--card-distance": distance,
                              "--card-scale": state.scale,
                              "--card-opacity": state.opacity,
                              "--card-blur": `${state.blur}px`,
                              "--card-z": state.z,
                              "--card-glow": state.glow,
                            } as CSSProperties
                          }
                        >
                          <div className="relative aspect-[4/5] w-full">
                            <div className="absolute inset-0" style={{ background: entry.image }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-5">
                              <h3 className="text-lg font-semibold text-paper">{entry.title}</h3>
                              {isActive && (
                                <p className="mt-1 text-xs uppercase tracking-widest text-mute">
                                  {entry.category}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    data-cursor-hover
                    aria-label="Next project"
                    onClick={() => advance(1)}
                    className="grid h-[30px] w-[30px] shrink-0 place-items-center rounded-full border border-line text-arc transition-colors hover:border-arc"
                  >
                    <ArrowRight size={14} />
                  </button>
                </div>

                <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.16em] text-mute">
                  Drag to Explore
                </p>
              </>
            )}

            {/* The hero's light trail, picked back up: same stroke, same
                opacity family, echoing down the page as the floor the
                work carousel sits on. Purely decorative, static. */}
            <svg
              viewBox="0 0 100 20"
              preserveAspectRatio="none"
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-10 left-0 h-16 w-full"
            >
              <path
                d="M -5,4 C 20,18 45,-4 70,10 S 95,18 105,6"
                fill="none"
                stroke="var(--arc)"
                strokeOpacity="0.4"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {modalProject && <ProjectModal project={modalProject} onClose={closeModal} />}
      </AnimatePresence>
    </section>
  );
}

/**
 * <768px and prefers-reduced-motion: a native horizontal scroll strip
 * instead of the drag-transform carousel — scroll-snap handles the
 * physics the browser already does well on touch, and there's nothing
 * left to reimplement. Under reduced motion specifically, every card
 * renders identically (no active/adjacent tiers, no transitions) — the
 * IntersectionObserver below is skipped entirely rather than just having
 * nothing to show for its output.
 */
function MobileRow({
  reducedMotion,
  onActivate,
}: {
  reducedMotion: boolean;
  onActivate: (index: number, trigger: HTMLElement) => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const root = rowRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        let best = { ratio: 0, index: -1 };
        for (const entry of entries) {
          const idx = Number((entry.target as HTMLElement).dataset.index);
          if (entry.intersectionRatio > best.ratio) best = { ratio: entry.intersectionRatio, index: idx };
        }
        if (best.index >= 0) setActiveIndex(best.index);
      },
      { root, threshold: [0, 0.25, 0.5, 0.75, 1] }
    );
    cardRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [reducedMotion]);

  return (
    <div ref={rowRef} className="explore-scroll-row flex gap-5 px-[calc(50%-8rem)] py-4">
      {CAROUSEL_PROJECTS.map((entry, index) => {
        const distance = reducedMotion ? 0 : circularDistance(index, activeIndex, CAROUSEL_PROJECTS.length);
        const isActive = distance === 0;
        const state = reducedMotion
          ? { scale: 1, opacity: 1, blur: 0, z: 1, glow: "none" }
          : cardState(distance);
        return (
          <button
            key={entry.title}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            data-index={index}
            type="button"
            data-cursor-hover
            aria-label={`${entry.title} — ${entry.category}`}
            aria-current={isActive && !reducedMotion ? "true" : undefined}
            onClick={(e) => onActivate(index, e.currentTarget)}
            className="explore-card explore-card--mobile w-64 shrink-0 overflow-hidden rounded-3xl border border-line text-left"
            style={
              {
                "--card-scale": state.scale,
                "--card-opacity": state.opacity,
                "--card-blur": `${state.blur}px`,
                "--card-glow": state.glow,
              } as CSSProperties
            }
          >
            <div className="relative aspect-[4/5] w-full">
              <div className="absolute inset-0" style={{ background: entry.image }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="text-lg font-semibold text-paper">{entry.title}</h3>
                {(isActive || reducedMotion) && (
                  <p className="mt-1 text-xs uppercase tracking-widest text-mute">{entry.category}</p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
