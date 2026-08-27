"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, ArrowUpRight, MousePointer2 } from "lucide-react";
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
  return `radial-gradient(circle at 30% 25%, ${color}66, transparent 60%), linear-gradient(160deg, #452B1B, #120A06)`;
}

type CarouselProject = { slug: string; title: string; category: string; image: string; href: string };

// Homepage teaser list — placeholders pending the real, ordered client
// roster (the whole portfolio is fictional case studies for now; see the
// TODO at the top of data/projects.ts). `image` holds a generated
// placeholder gradient standing in for real photography — swap for a
// `background-image: url(...)` once real photos exist, nothing else here
// needs to change. Every slug below matches a real entry in
// data/projects.ts, so every card opens the real project modal on click
// (see `activate`) — `href` only ever serves as a fallback if a slug here
// and in data/projects.ts ever drift apart.
const CAROUSEL_PROJECTS: CarouselProject[] = [
  { slug: "north-atlas", title: "North Atlas", category: "Branding", image: placeholderArt("#E85002"), href: "/work" },
  { slug: "fielder", title: "Fielder", category: "Web & App", image: placeholderArt("#FF6001"), href: "/work" },
  { slug: "marrow", title: "Marrow", category: "Media & Activations", image: placeholderArt("#C13001"), href: "/work" },
  { slug: "harbor-co", title: "Harbor & Co.", category: "Digital Marketing", image: placeholderArt("#9C3F0B"), href: "/work" },
];

// Visual state — just active / inactive, a flatter binary tier than a
// active/adjacent/further-out split: a short teaser row doesn't need the
// extra depth cue. `blur`/`border`/`glow` are fixed values per tier, only
// ever changed by a discrete index update (never a per-frame loop); the
// 700ms CSS transition (globals.css: .explore-card) is what animates the
// move between them. The active card's `glow` combines two shadows — an
// inset top light edge plus the outer bloom — box-shadow happily takes a
// comma-separated list of both.
function cardState(distance: number) {
  if (distance === 0) {
    return {
      scale: 1,
      opacity: 1,
      blur: 0,
      z: 30,
      border: "rgba(255,255,255,0.14)",
      glow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 0 70px rgba(255,90,26,0.16)",
    };
  }
  return {
    scale: 0.88,
    opacity: 0.42,
    blur: 2.5,
    z: Math.max(1, 10 - Math.abs(distance)),
    border: "transparent",
    glow: "none",
  };
}

const WORK_HINT_SESSION_KEY = "arcone-work-hint";
const WORK_HINT_APPEAR_DELAY_MS = 1100;
const WORK_HINT_AUTO_DISMISS_MS = 7000;
// How long the hint lingers on one card before sliding to the next —
// "click the next rectangle" as a guided sequence, not a single static
// point. Two stops fit comfortably inside the auto-dismiss window with
// room to actually register each one.
const WORK_HINT_STOP_MS = 2600;
// Percentage positions within the track, tuned to the current (400px)
// card width/spacing — the immediate right-hand neighbour, then the one
// past it, so the hint visibly "walks" toward the edge of the row.
const WORK_HINT_STOPS = [
  { left: "74%", top: "50%" },
  { left: "92%", top: "50%" },
];

/**
 * One-time "click to explore" affordance: nobody discovers the drag on
 * their own, so this walks the pointer across the first couple of
 * adjacent cards the first time the carousel scrolls into view, then
 * gets out of the way for good — a short guided sequence ("here's one
 * you can click, and another") rather than a single static point.
 * Gated on sessionStorage (shows once per session, set the moment it
 * actually appears — not merely when it's scheduled, so a visitor who
 * scrolls past without lingering still sees it next time) and on
 * `enabled`, which the caller ties to reduced-motion/touch — see
 * `hintEnabled` in ExploreWork.
 */
function useWorkHint(enabled: boolean) {
  const [visible, setVisible] = useState(false);
  const [stopIndex, setStopIndex] = useState(0);
  const hasScheduledRef = useRef(false);
  const showTimerRef = useRef<number | undefined>(undefined);
  const stepTimerRef = useRef<number | undefined>(undefined);
  const dismissTimerRef = useRef<number | undefined>(undefined);

  const dismiss = useCallback(() => {
    setVisible(false);
    window.clearTimeout(showTimerRef.current);
    window.clearTimeout(stepTimerRef.current);
    window.clearTimeout(dismissTimerRef.current);
  }, []);

  const onFirstView = useCallback(() => {
    if (!enabled || hasScheduledRef.current) return;
    if (sessionStorage.getItem(WORK_HINT_SESSION_KEY)) return;
    hasScheduledRef.current = true;
    showTimerRef.current = window.setTimeout(() => {
      setVisible(true);
      setStopIndex(0);
      sessionStorage.setItem(WORK_HINT_SESSION_KEY, "1");
      // Walk to the next stop partway through, then auto-dismiss at the
      // usual total — consumeJustDragged/hintDismiss (from any real
      // interaction) always wins over both of these regardless of which
      // stop it's currently on.
      stepTimerRef.current = window.setTimeout(() => setStopIndex(1), WORK_HINT_STOP_MS);
      dismissTimerRef.current = window.setTimeout(dismiss, WORK_HINT_AUTO_DISMISS_MS);
    }, WORK_HINT_APPEAR_DELAY_MS);
  }, [enabled, dismiss]);

  // Unmounting mid-delay (a fast scroll-past-then-away) shouldn't fire a
  // setState after the component's gone.
  useEffect(() => {
    return () => {
      window.clearTimeout(showTimerRef.current);
      window.clearTimeout(stepTimerRef.current);
      window.clearTimeout(dismissTimerRef.current);
    };
  }, []);

  return { visible, stopIndex, onFirstView, dismiss };
}

export function ExploreWork() {
  const reducedMotion = usePrefersReducedMotion();
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const length = CAROUSEL_PROJECTS.length;
  const carouselRef = useRef<HTMLDivElement>(null);

  const { project: modalProject, open: openModal, close: closeModal } = useProjectModal();

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(query.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsTouchDevice(!query.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouchDevice(!e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  // Redundant with the branch this only ever renders in (reducedMotion and
  // isMobile both gate the native-scroll fallback below), but spelled out
  // explicitly here anyway per the hint's own rule: never under reduced
  // motion, never on a touch device.
  const hintEnabled = !reducedMotion && !isTouchDevice;
  // Destructured, not kept as a `hint.X` object — same reasoning as
  // `useCarouselDrag`'s call site below: a fresh object every render
  // would otherwise churn the effect/callback dependency arrays below.
  const {
    visible: hintVisible,
    stopIndex: hintStopIndex,
    onFirstView: hintOnFirstView,
    dismiss: hintDismiss,
  } = useWorkHint(hintEnabled);

  useEffect(() => {
    if (!hintEnabled) return;
    const el = carouselRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hintOnFirstView();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hintEnabled, hintOnFirstView]);

  const advance = (step: number) => {
    hintDismiss();
    setActiveIndex((i) => wrapIndex(i + step, length));
  };

  const jumpTo = (index: number) => {
    hintDismiss();
    setActiveIndex(index);
  };

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
    hintDismiss();
    if (consumeJustDragged()) return;
    if (index !== activeIndex) {
      setActiveIndex(index);
      return;
    }
    const entry = CAROUSEL_PROJECTS[index];
    const match = caseStudies.find((p) => p.slug === entry.slug);
    if (match) {
      openModal(match, trigger);
    } else {
      router.push(entry.href);
    }
  };

  const useNativeScroll = reducedMotion || isMobile;

  return (
    <section className="explore-work-row relative overflow-hidden border-t border-line bg-ink py-20">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[220px_1fr]">
          {/* Left column — dims when the carousel is being hovered/focused
              (see .explore-work-row:has(...) in globals.css), so whichever
              one you're actually paying attention to reads as the focus
              and the other recedes rather than competing with it. */}
          <div className="explore-text-block">
            <Reveal>
              <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-arc">
                Explore Our Work
                <ArrowUpRight size={14} />
              </span>
            </Reveal>
            <MaskReveal
              as="p"
              delay={0.06}
              className="mt-5 text-balance text-base leading-relaxed text-paper/65"
            >
              [[ Explore Our Work — one to two sentence supporting line ]]
            </MaskReveal>
            <Reveal delay={0.12}>
              <Magnetic strength={0.3} className="mt-6 inline-flex">
                <Button href="/work" variant="secondary" icon={<ArrowUpRight size={15} className="text-arc" />}>
                  View All Work
                </Button>
              </Magnetic>
            </Reveal>
          </div>

          {/* Carousel — the hero of this section, so it gets almost all
              the row's width; the text column above is deliberately
              narrow, not a competing half. */}
          <div ref={carouselRef} className="explore-carousel-block relative">
            {useNativeScroll ? (
              <MobileRow
                reducedMotion={reducedMotion}
                onActivate={(index, trigger) => {
                  const entry = CAROUSEL_PROJECTS[index];
                  const match = caseStudies.find((p) => p.slug === entry.slug);
                  if (match) openModal(match, trigger);
                  else router.push(entry.href);
                }}
              />
            ) : (
              <>
                <div className="flex items-center gap-[14px]">
                  <button
                    type="button"
                    data-cursor-hover
                    aria-label="Previous project"
                    onClick={() => advance(-1)}
                    className="grid h-10 w-10 flex-none place-items-center rounded-full border border-[#4A4A4A] text-arc transition-colors hover:border-arc hover:bg-[rgba(255,90,26,0.12)]"
                  >
                    <ArrowLeft size={16} />
                  </button>

                  <div
                    ref={trackRef}
                    role="region"
                    aria-roledescription="carousel"
                    aria-label="Selected work"
                    tabIndex={0}
                    onPointerDown={(e) => {
                      hintDismiss();
                      onPointerDown(e);
                    }}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerCancel={onPointerCancel}
                    onKeyDown={onKeyDown}
                    className={cn(
                      "explore-track relative h-[270px] w-full min-w-0 touch-pan-y select-none overflow-hidden",
                      isDragging && "is-dragging"
                    )}
                    style={{ "--card-spacing": "350px" } as CSSProperties}
                  >
                    {CAROUSEL_PROJECTS.map((entry, index) => {
                      const distance = circularDistance(index, activeIndex, length);
                      const isActive = distance === 0;
                      const state = cardState(distance);
                      return (
                        <button
                          key={entry.slug}
                          type="button"
                          data-cursor-hover
                          aria-label={`${entry.title} — ${entry.category}`}
                          aria-current={isActive ? "true" : undefined}
                          tabIndex={Math.abs(distance) > 1 ? -1 : 0}
                          onClick={(e) => activate(index, e.currentTarget)}
                          className="explore-card explore-card--desktop group w-[400px] overflow-hidden rounded-[16px] border text-left"
                          style={
                            {
                              "--card-distance": distance,
                              "--card-scale": state.scale,
                              "--card-opacity": state.opacity,
                              "--card-blur": `${state.blur}px`,
                              "--card-z": state.z,
                              "--card-border": state.border,
                              "--card-glow": state.glow,
                            } as CSSProperties
                          }
                        >
                          <div className="relative aspect-[16/10] w-full">
                            <div className="absolute inset-0" style={{ background: entry.image }} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
                            <div className="absolute inset-x-0 bottom-0 p-4">
                              <h3 className="font-heading text-[16px] font-bold text-paper">{entry.title}</h3>
                              {isActive && (
                                <p className="mt-1 text-[10.5px] uppercase tracking-[0.1em] text-[#B0ACA6]">
                                  {entry.category}
                                </p>
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}

                    {/* First-visit guided hint — walks from the immediate
                        neighbour to the one past it, then gone the instant
                        the carousel's actually touched. */}
                    <AnimatePresence>
                      {hintVisible && (
                        <motion.div
                          key="work-hint"
                          aria-hidden="true"
                          className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2"
                          initial={{ opacity: 0, scale: 0.9, ...WORK_HINT_STOPS[0] }}
                          animate={{ opacity: 1, scale: 1, ...WORK_HINT_STOPS[hintStopIndex] }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <div key={hintStopIndex} className="work-hint-nudge flex items-center gap-2">
                            <MousePointer2 size={18} className="text-arc" />
                            <span className="whitespace-nowrap rounded-full border border-line bg-ink/85 px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-paper backdrop-blur-sm">
                              Click to explore
                            </span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <button
                    type="button"
                    data-cursor-hover
                    aria-label="Next project"
                    onClick={() => advance(1)}
                    className="grid h-10 w-10 flex-none place-items-center rounded-full border border-[#4A4A4A] text-arc transition-colors hover:border-arc hover:bg-[rgba(255,90,26,0.12)]"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>

                {/* Dot indicators — one per project, active dot stretched
                    and lit; each is its own jump-to-index button. */}
                <div className="mt-[18px] flex items-center justify-center gap-2">
                  {CAROUSEL_PROJECTS.map((entry, index) => {
                    const isActive = index === activeIndex;
                    return (
                      <button
                        key={entry.slug}
                        type="button"
                        data-cursor-hover
                        aria-label={`Go to ${entry.title}`}
                        aria-current={isActive ? "true" : undefined}
                        onClick={() => jumpTo(index)}
                        className="h-[7px] rounded-full"
                        style={{
                          width: isActive ? "22px" : "7px",
                          backgroundColor: isActive ? "var(--arc)" : "#565656",
                          transition: "width 400ms var(--ease-smooth), background-color 400ms var(--ease-smooth)",
                        }}
                      />
                    );
                  })}
                </div>
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
    <div ref={rowRef} className="explore-scroll-row flex gap-5 px-[calc(50%-150px)] py-4">
      {CAROUSEL_PROJECTS.map((entry, index) => {
        const distance = reducedMotion ? 0 : circularDistance(index, activeIndex, CAROUSEL_PROJECTS.length);
        const isActive = distance === 0;
        const state = reducedMotion
          ? { scale: 1, opacity: 1, blur: 0, z: 1, border: "rgba(255,255,255,0.14)", glow: "none" }
          : cardState(distance);
        return (
          <button
            key={entry.slug}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            data-index={index}
            type="button"
            data-cursor-hover
            aria-label={`${entry.title} — ${entry.category}`}
            aria-current={isActive && !reducedMotion ? "true" : undefined}
            onClick={(e) => onActivate(index, e.currentTarget)}
            className="explore-card explore-card--mobile w-[300px] shrink-0 overflow-hidden rounded-[16px] border text-left"
            style={
              {
                "--card-scale": state.scale,
                "--card-opacity": state.opacity,
                "--card-blur": `${state.blur}px`,
                "--card-border": state.border,
                "--card-glow": state.glow,
              } as CSSProperties
            }
          >
            <div className="relative aspect-[16/10] w-full">
              <div className="absolute inset-0" style={{ background: entry.image }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <h3 className="font-heading text-[16px] font-bold text-paper">{entry.title}</h3>
                {(isActive || reducedMotion) && (
                  <p className="mt-1 text-[10.5px] uppercase tracking-[0.1em] text-[#B0ACA6]">{entry.category}</p>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
