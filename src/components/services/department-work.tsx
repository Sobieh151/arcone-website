"use client";

import { useCallback, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { services, type Service } from "@/content/services";
import { capabilityIcons } from "@/components/icons/capability-icons";
import { projects, type Project } from "@/data/projects";
import { Reveal } from "@/components/animations/reveal";
import { IconButton } from "@/components/buttons/icon-button";
import { ProjectGallery } from "@/components/portfolio/project-gallery";
import { useCarouselDrag, circularDistance, wrapIndex } from "@/lib/use-carousel-drag";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Same 760x430 orbit geometry services-teaser.tsx used — unchanged, this
// is still the ARCone mark with five departments around it, just no
// longer a dead end that navigates away. See that file's history for why
// these specific numbers.
const ORBIT_VIEWBOX_WIDTH = 760;
const ORBIT_VIEWBOX_HEIGHT = 430;
const ORBIT_CX = 380;
const ORBIT_CY = 215;
const ORBIT_RX = 268;
const ORBIT_RY = 132;
const CENTRE_MARK_SIZE = 136;
const ORBIT_HALO_RX = ORBIT_RX + 20;
const ORBIT_HALO_RY = ORBIT_RY + 18;
const ORBIT_PATH_D = `M ${ORBIT_CX + ORBIT_RX} ${ORBIT_CY} A ${ORBIT_RX} ${ORBIT_RY} 0 1 1 ${ORBIT_CX - ORBIT_RX} ${ORBIT_CY} A ${ORBIT_RX} ${ORBIT_RY} 0 1 1 ${ORBIT_CX + ORBIT_RX} ${ORBIT_CY}`;

function nodePosition(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = ORBIT_CX + ORBIT_RX * Math.cos(rad);
  const y = ORBIT_CY + ORBIT_RY * Math.sin(rad);
  return { left: `${(x / ORBIT_VIEWBOX_WIDTH) * 100}%`, top: `${(y / ORBIT_VIEWBOX_HEIGHT) * 100}%` };
}

function shortestBarRotation(targetDeg: number, currentDeg: number) {
  let target = targetDeg;
  while (target - currentDeg > 30) target -= 60;
  while (target - currentDeg < -30) target += 60;
  return target;
}

// Same tiered visual state the old carousel used — active card sharp and
// forward, everything else receded but still legibly "more work is here".
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
  return { scale: 0.88, opacity: 0.42, blur: 2.5, z: Math.max(1, 10 - Math.abs(distance)), border: "transparent", glow: "none" };
}

function placeholderArt(color: string) {
  return `radial-gradient(circle at 30% 25%, ${color}66, transparent 60%), linear-gradient(160deg, #452B1B, #120A06)`;
}

/**
 * The homepage's department + work experience — one continuous flow,
 * not three separate pages:
 *
 *   Stage 1 (select) — the orbit. Mark centred, five departments around
 *   it, nothing else. This is the ONLY thing visible until a department
 *   is chosen — no portfolio, no cards, no descriptions.
 *
 *   Stage 2 (rail) — choosing a department swaps the orbit for a large
 *   draggable rail of that department's real work (data/projects.ts,
 *   filtered by category === department name), one active project
 *   forward and its neighbours partially visible either side.
 *
 *   Stage 3 (gallery) — clicking the active project expands it into
 *   ProjectGallery via a shared layoutId, not a route change.
 *
 * /services/[slug] and /work/[slug] still exist as real, deep-linkable
 * pages (SEO, sharing) — they're just no longer part of this in-page
 * flow, which is what "no department page -> portfolio page -> project
 * page" actually means here.
 */
export function DepartmentWork() {
  const reducedMotion = usePrefersReducedMotion();
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
  const [markRotation, setMarkRotation] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const [galleryProject, setGalleryProject] = useState<Project | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  const selectedService = services.find((s) => s.slug === selectedSlug) ?? null;
  const departmentProjects = selectedService ? projects.filter((p) => p.category === selectedService.name) : [];
  const length = departmentProjects.length;

  const focusNode = useCallback(
    (service: Service) => {
      setHoveredSlug(service.slug);
      if (reducedMotion) return;
      setMarkRotation((current) => shortestBarRotation(service.angle + 90, current));
    },
    [reducedMotion]
  );

  const clearNode = useCallback(() => {
    setHoveredSlug(null);
    if (reducedMotion) return;
    setMarkRotation(0);
  }, [reducedMotion]);

  const selectDepartment = useCallback((service: Service) => {
    setSelectedSlug(service.slug);
    setActiveIndex(0);
  }, []);

  const backToDepartments = useCallback(() => {
    setSelectedSlug(null);
    setHoveredSlug(null);
    setMarkRotation(0);
  }, []);

  const onOrbitPointerMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const el = orbitRef.current;
      const svg = svgRef.current;
      if (!el || !svg) return;
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      svg.style.transform = `translate(${px * 14}px, ${py * 10}px)`;
    },
    [reducedMotion]
  );

  const onOrbitPointerLeave = useCallback(() => {
    if (svgRef.current) svgRef.current.style.transform = "translate(0px, 0px)";
  }, []);

  const advance = (step: number) => setActiveIndex((i) => wrapIndex(i + step, length));
  const jumpTo = (index: number) => setActiveIndex(index);

  const {
    trackRef,
    isDragging,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    onPointerCancel,
    onWheel,
    onKeyDown,
    consumeJustDragged,
  } = useCarouselDrag({ disabled: reducedMotion || length <= 1, onAdvance: advance });

  const activate = (index: number, project: Project) => {
    if (consumeJustDragged()) return;
    if (index !== activeIndex) {
      setActiveIndex(index);
      return;
    }
    setGalleryProject(project);
  };

  return (
    <section
      className="relative overflow-hidden border-t border-line px-6 py-16"
      style={{ background: "radial-gradient(circle at 50% 46%, rgba(255,90,26,0.09), transparent 26%), linear-gradient(#030303, #050505 70%, #020202)" }}
    >
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <span className="block text-xs uppercase tracking-[0.2em] text-[#FF7A2E]">What We Do</span>
          <h2 className="mt-2 font-heading text-[38px] font-extrabold uppercase leading-none tracking-[-0.05em] text-paper">
            Pick your move.
          </h2>
        </Reveal>

        <AnimatePresence mode="wait" initial={false}>
          {!selectedService ? (
            <motion.div
              key="select"
              initial={reducedMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Mobile — a plain tappable list, no orbit geometry to fit
                  into a narrow width. */}
              <ul className="mt-[22px] divide-y divide-line border-t border-line md:hidden">
                {services.map((service) => {
                  const Icon = capabilityIcons[service.slug];
                  return (
                    <li key={service.slug}>
                      <button
                        type="button"
                        data-cursor-hover
                        onClick={() => selectDepartment(service)}
                        className="flex w-full items-center gap-4 py-4 text-left"
                      >
                        <span
                          className="grid h-12 w-12 flex-none place-items-center rounded-full border"
                          style={{ borderColor: "rgba(255,90,26,0.6)", background: "rgba(5,5,5,0.96)" }}
                        >
                          <Icon aria-hidden="true" className="h-[21px] w-[21px]" style={{ color: "var(--mute)" }} />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[12.5px] font-bold uppercase tracking-[-0.015em] text-paper">
                            {service.name}
                          </span>
                          <span className="mt-1 block text-[9.5px] uppercase tracking-[0.1em] text-[#9C9892]">
                            {service.microLabel}
                          </span>
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* Desktop — the orbit. */}
              <div
                ref={orbitRef}
                onPointerMove={onOrbitPointerMove}
                onPointerLeave={onOrbitPointerLeave}
                className="relative mx-auto mt-[22px] hidden max-w-[760px] md:block"
                style={{ aspectRatio: `${ORBIT_VIEWBOX_WIDTH} / ${ORBIT_VIEWBOX_HEIGHT}` }}
              >
                <div className="capabilities-floor-grid absolute inset-0" aria-hidden="true" />
                <svg
                  ref={svgRef}
                  viewBox={`0 0 ${ORBIT_VIEWBOX_WIDTH} ${ORBIT_VIEWBOX_HEIGHT}`}
                  className="capabilities-orbit-svg absolute inset-0 h-full w-full"
                  aria-hidden="true"
                >
                  <ellipse cx={ORBIT_CX} cy={ORBIT_CY} rx={ORBIT_RX} ry={ORBIT_RY} stroke="#2E2E2E" strokeWidth="1" fill="none" />
                  <ellipse cx={ORBIT_CX} cy={ORBIT_CY} rx={ORBIT_HALO_RX} ry={ORBIT_HALO_RY} stroke="var(--arc)" strokeOpacity="0.13" strokeWidth="1" fill="none" />
                  {!reducedMotion && (
                    <ellipse
                      className="capabilities-orbit-light"
                      rx="13"
                      ry="1.8"
                      fill="#FFA870"
                      style={{ offsetPath: `path('${ORBIT_PATH_D}')`, offsetRotate: "auto" }}
                    />
                  )}
                  <g
                    className="capabilities-centre-mark"
                    style={{ "--mark-rotate": `${markRotation}deg`, filter: "drop-shadow(0 0 24px rgba(255,90,26,0.4))" } as CSSProperties}
                  >
                    <use href="#arc-mark" x={ORBIT_CX - CENTRE_MARK_SIZE / 2} y={ORBIT_CY - CENTRE_MARK_SIZE / 2} width={CENTRE_MARK_SIZE} height={CENTRE_MARK_SIZE} />
                  </g>
                </svg>

                {services.map((service) => {
                  const isActive = service.slug === hoveredSlug;
                  const pos = nodePosition(service.angle);
                  const Icon = capabilityIcons[service.slug];
                  return (
                    <button
                      key={service.slug}
                      type="button"
                      data-cursor-hover
                      aria-label={`${service.name} — ${service.microLabel}`}
                      onMouseEnter={() => focusNode(service)}
                      onFocus={() => focusNode(service)}
                      onMouseLeave={clearNode}
                      onBlur={clearNode}
                      onClick={() => selectDepartment(service)}
                      className="capabilities-node absolute flex w-[124px] -translate-x-1/2 -translate-y-1/2 cursor-pointer flex-col items-center text-center"
                      style={{ left: pos.left, top: pos.top, "--node-opacity": hoveredSlug && !isActive ? 0.32 : 1 } as CSSProperties}
                    >
                      <span className="relative grid h-12 w-12 place-items-center">
                        <span
                          aria-hidden="true"
                          className="capabilities-node-bloom pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                          style={{ "--node-bloom-opacity": isActive ? 0.9 : 0 } as CSSProperties}
                        />
                        <span
                          className="capabilities-node-icon relative grid h-12 w-12 place-items-center rounded-full border"
                          style={
                            {
                              "--node-scale": isActive ? 1.14 : 1,
                              "--node-border": isActive ? "var(--arc)" : "rgba(255,90,26,0.6)",
                              "--node-bg": isActive ? "rgba(255,90,26,0.14)" : "rgba(5,5,5,0.96)",
                              "--node-glow": isActive
                                ? "0 0 0 1px rgba(255,90,26,0.5), 0 0 18px rgba(255,90,26,0.45), 0 0 44px rgba(255,90,26,0.28)"
                                : "none",
                            } as CSSProperties
                          }
                        >
                          <Icon aria-hidden="true" className="capabilities-node-icon-mark h-[21px] w-[21px]" style={{ "--node-icon-color": isActive ? "var(--arc)" : "var(--mute)" } as CSSProperties} />
                        </span>
                      </span>
                      <span className="capabilities-node-name mt-2 text-[12.5px] font-bold uppercase tracking-[-0.015em]" style={{ "--node-name-color": isActive ? "#FF7A2E" : "var(--paper)" } as CSSProperties}>
                        {service.name}
                      </span>
                      <span className="mt-1 text-[9.5px] uppercase tracking-[0.1em] text-[#9C9892]">{service.microLabel}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="rail"
              initial={reducedMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reducedMotion ? undefined : { opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="mt-[22px]"
            >
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  data-cursor-hover
                  onClick={backToDepartments}
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-mute transition-colors hover:text-paper"
                >
                  <ArrowLeft size={14} />
                  All departments
                </button>
              </div>

              <h3 className="mt-4 font-heading text-[28px] font-extrabold uppercase leading-none tracking-[-0.03em] text-paper sm:text-[34px]">
                {selectedService.name}
              </h3>

              {departmentProjects.length === 0 ? (
                <p className="mt-8 text-sm text-mute">Work in this department is being added.</p>
              ) : (
                <>
                  {/* Mobile — native scroll-snap row, touch-first. */}
                  <div className="mt-6 flex gap-5 overflow-x-auto px-[calc(50%-150px)] py-4 [scroll-snap-type:x_mandatory] md:hidden">
                    {departmentProjects.map((project) => (
                      <button
                        key={project.slug}
                        type="button"
                        data-cursor-hover
                        onClick={() => setGalleryProject(project)}
                        className="explore-card explore-card--mobile w-[300px] shrink-0 overflow-hidden rounded-[16px] border text-left [scroll-snap-align:center]"
                        style={{ "--card-scale": 1, "--card-opacity": 1, "--card-blur": "0px", "--card-border": "rgba(255,255,255,0.14)", "--card-glow": "none" } as CSSProperties}
                      >
                        <ProjectCardFace project={project} showCategory />
                      </button>
                    ))}
                  </div>

                  {/* Desktop — the drag/wheel/keyboard rail. */}
                  <div className="mt-6 hidden items-center gap-[14px] md:flex">
                    {length > 1 && <IconButton aria-label="Previous project" onClick={() => advance(-1)} icon={<ArrowLeft size={16} />} />}

                    <div
                      ref={trackRef}
                      role="region"
                      aria-roledescription="carousel"
                      aria-label={`${selectedService.name} work`}
                      tabIndex={0}
                      onPointerDown={onPointerDown}
                      onPointerMove={onPointerMove}
                      onPointerUp={onPointerUp}
                      onPointerCancel={onPointerCancel}
                      onWheel={onWheel}
                      onKeyDown={onKeyDown}
                      className={`explore-track relative h-[360px] w-full min-w-0 touch-pan-y select-none overflow-hidden ${isDragging ? "is-dragging" : ""}`}
                      style={{ "--card-spacing": "480px" } as CSSProperties}
                    >
                      {departmentProjects.map((project, index) => {
                        const distance = circularDistance(index, activeIndex, length);
                        const isActive = distance === 0;
                        const state = cardState(distance);
                        return (
                          <button
                            key={project.slug}
                            type="button"
                            data-cursor-hover
                            aria-label={`${project.name} — ${project.category}`}
                            aria-current={isActive ? "true" : undefined}
                            tabIndex={Math.abs(distance) > 1 ? -1 : 0}
                            onClick={() => activate(index, project)}
                            className="explore-card explore-card--desktop group w-[560px] overflow-hidden rounded-[16px] border text-left"
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
                            <ProjectCardFace project={project} showCategory={isActive} />
                          </button>
                        );
                      })}
                    </div>

                    {length > 1 && <IconButton aria-label="Next project" onClick={() => advance(1)} icon={<ArrowRight size={16} />} />}
                  </div>

                  {length > 1 && (
                    <div className="mt-4 hidden items-center justify-center gap-2 md:flex">
                      {departmentProjects.map((project, index) => {
                        const isActive = index === activeIndex;
                        return (
                          <button
                            key={project.slug}
                            type="button"
                            data-cursor-hover
                            aria-label={`Go to ${project.name}`}
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
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {galleryProject && <ProjectGallery project={galleryProject} onClose={() => setGalleryProject(null)} />}
      </AnimatePresence>
    </section>
  );
}

// Image + name/category caption — the same face for both the desktop
// card (real photo eventually) and the mobile one. Deliberately not a
// shared layoutId with the gallery's hero image: the desktop rail and
// the mobile row are both mounted at once (CSS decides which paints,
// same reasoning as department-work.tsx's stage split — no
// server/client viewport mismatch), so a layoutId shared across both
// meant two elements were carrying the identical id simultaneously
// regardless of which was visible, and Framer Motion resolves that by
// treating one as a stale duplicate and hiding it — confirmed live: the
// mobile card was rendering at opacity 0. ProjectGallery's own
// scale/fade entrance covers the "grows into the gallery" feel instead.
function ProjectCardFace({ project, showCategory }: { project: Project; showCategory: boolean }) {
  return (
    <div className="relative aspect-[16/9] w-full">
      <div className="absolute inset-0" style={{ background: placeholderArt(project.color) }} />
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.55) 28%, transparent 65%)" }}
      />
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3 className="font-heading text-[16px] font-bold text-paper">{project.name}</h3>
        {showCategory && <p className="mt-1 text-[10.5px] uppercase tracking-[0.1em] text-paper/70">{project.category}</p>}
      </div>
    </div>
  );
}
