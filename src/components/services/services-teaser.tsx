"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties, type PointerEvent } from "react";
import { services, type Service } from "@/content/services";
import { capabilityIcons } from "@/components/icons/capability-icons";
import { Reveal } from "@/components/animations/reveal";
import { usePrefersReducedMotion } from "@/lib/use-reduced-motion";

// Every position below is computed against this one 760x430 viewBox —
// same coordinate space the SVG itself uses, so a node's `angle` maps to
// the exact same point the ring/mark are drawn against.
const ORBIT_VIEWBOX_WIDTH = 760;
const ORBIT_VIEWBOX_HEIGHT = 430;
const ORBIT_CX = 380;
const ORBIT_CY = 215;
const ORBIT_RX = 268;
const ORBIT_RY = 132;
const CENTRE_MARK_SIZE = 176;
// The outer halo ellipse's radii — kept at the same +20/+18 offset past
// the main ring (ORBIT_RX/RY) it always had, so it still reads as a
// close outer halo rather than sitting inside the now-wider ring.
const ORBIT_HALO_RX = ORBIT_RX + 20;
const ORBIT_HALO_RY = ORBIT_RY + 18;

// A full loop around the ring, as two 180deg arcs — used as an
// `offset-path` for the travelling light (see capabilities-orbit-light
// below) instead of animating stroke-dashoffset on a dashed stroke. This
// is the same fix already applied once in this codebase to the hero's
// original light trail: a small fixed-shape mark repositioned along a
// static path via offset-distance is an ordinary transform update to the
// browser, not a re-stroke of the path geometry every frame. It also
// sidesteps the old dasharray/dashoffset totals (1118, "88 1030") going
// stale the way they did when this orbit was widened — offset-distance is
// percentage-based, so it doesn't care what the path's actual length is.
const ORBIT_PATH_D = `M ${ORBIT_CX + ORBIT_RX} ${ORBIT_CY} A ${ORBIT_RX} ${ORBIT_RY} 0 1 1 ${ORBIT_CX - ORBIT_RX} ${ORBIT_CY} A ${ORBIT_RX} ${ORBIT_RY} 0 1 1 ${ORBIT_CX + ORBIT_RX} ${ORBIT_CY}`;

// Standard ellipse parametric equations, angle in degrees. SVG's y-axis
// grows downward, so this sweeps clockwise from the positive x-axis: 0deg
// = right, 90deg = bottom-centre (where Web & App anchors), 180deg =
// left, 270deg = top. Returned as percentages of the viewBox so the node
// buttons (plain HTML, positioned via left/top) track the SVG's own
// scaling regardless of the container's actual rendered width.
function nodePosition(angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const x = ORBIT_CX + ORBIT_RX * Math.cos(rad);
  const y = ORBIT_CY + ORBIT_RY * Math.sin(rad);
  return {
    left: `${(x / ORBIT_VIEWBOX_WIDTH) * 100}%`,
    top: `${(y / ORBIT_VIEWBOX_HEIGHT) * 100}%`,
  };
}

// Shortest-path rotation for the centre mark: step `target` by one
// bar-spacing (60deg — the mark's own rotational symmetry) until it's
// within 30deg of wherever the mark currently sits, then stop. Because
// this steps from the mark's actual current rotation (never from 0), and
// the mark's own 60deg symmetry means every reachable multiple of 60 puts
// a bar on `target` regardless of how many full turns it takes to get
// there, hovering repeatedly accumulates rotation across hovers instead
// of snapping back through 0 each time.
function shortestBarRotation(targetDeg: number, currentDeg: number) {
  let target = targetDeg;
  while (target - currentDeg > 30) target -= 60;
  while (target - currentDeg < -30) target += 60;
  return target;
}

export function ServicesTeaser() {
  const reducedMotion = usePrefersReducedMotion();
  const [isMobile, setIsMobile] = useState(false);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [markRotation, setMarkRotation] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMobile(query.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const activeService = services.find((s) => s.slug === activeSlug) ?? null;

  // Hover AND focus both funnel through this one pair — a mouse click
  // firing onFocus too just re-applies the same state onMouseEnter
  // already set, which is harmless, and it's what gets keyboard users
  // (:focus-visible in spirit) the identical highlight without a second,
  // parallel CSS-only implementation of every dynamic value below.
  const focusNode = useCallback(
    (service: Service) => {
      setActiveSlug(service.slug);
      if (reducedMotion) return;
      setMarkRotation((current) => shortestBarRotation(service.angle + 90, current));
    },
    [reducedMotion]
  );

  const clearNode = useCallback(() => {
    setActiveSlug(null);
    if (reducedMotion) return;
    setMarkRotation(0);
  }, [reducedMotion]);

  // Parallax — a plain imperative style write on pointermove, not React
  // state (this fires on every pointermove; a state update would
  // re-render the whole section that often for nothing, same reasoning
  // as use-parallax-layers.ts / use-tilt.ts elsewhere in this codebase).
  // No lerp loop needed here unlike the hero's version: this is a
  // discrete "snap toward target," and .capabilities-orbit-svg's own
  // 600ms transition (globals.css) is what smooths each write. Only the
  // SVG moves — the floor grid and the node buttons stay put.
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
    const svg = svgRef.current;
    if (svg) svg.style.transform = "translate(0px, 0px)";
  }, []);

  return (
    <section
      className="relative overflow-hidden border-t border-line px-6 py-[34px]"
      style={{
        background:
          "radial-gradient(circle at 50% 46%, rgba(255,90,26,0.09), transparent 26%), linear-gradient(#030303, #050505 70%, #020202)",
      }}
    >
      <div className="relative mx-auto max-w-7xl">
        <Reveal>
          <span className="block text-xs uppercase tracking-[0.2em] text-[#FF7A2E]">
            Capabilities
          </span>
          <h2 className="mt-2 font-heading text-[38px] font-extrabold uppercase leading-none tracking-[-0.05em] text-paper">
            What We Do
          </h2>
        </Reveal>

        {isMobile ? (
          <CapabilitiesList
            activeSlug={activeSlug}
            onToggle={(service) =>
              setActiveSlug((current) => (current === service.slug ? null : service.slug))
            }
          />
        ) : (
          <>
            <div
              ref={orbitRef}
              onPointerMove={onOrbitPointerMove}
              onPointerLeave={onOrbitPointerLeave}
              className="relative mx-auto mt-12 max-w-[760px]"
              style={{ aspectRatio: `${ORBIT_VIEWBOX_WIDTH} / ${ORBIT_VIEWBOX_HEIGHT}` }}
            >
              <div className="capabilities-floor-grid absolute inset-0" aria-hidden="true" />

              {/* Purely decorative — the real accessible content lives on
                  the node buttons below, each with its own aria-label. */}
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
                  <use
                    href="#arc-mark"
                    x={ORBIT_CX - CENTRE_MARK_SIZE / 2}
                    y={ORBIT_CY - CENTRE_MARK_SIZE / 2}
                    width={CENTRE_MARK_SIZE}
                    height={CENTRE_MARK_SIZE}
                  />
                </g>
              </svg>

              {services.map((service) => {
                const isActive = service.slug === activeSlug;
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
                    className="capabilities-node absolute flex w-[124px] -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
                    style={
                      {
                        left: pos.left,
                        top: pos.top,
                        "--node-opacity": activeSlug && !isActive ? 0.32 : 1,
                      } as CSSProperties
                    }
                  >
                    <span className="relative grid h-12 w-12 place-items-center">
                      {/* Radial bloom behind the icon — 180% of the icon's
                          own size, blur set once (static), only opacity
                          ever animates. Separate element (not the icon's
                          own box-shadow) since it needs to bleed past the
                          icon's own rounded edge in every direction. */}
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
                        <Icon
                          aria-hidden="true"
                          className="capabilities-node-icon-mark h-[21px] w-[21px]"
                          style={{ "--node-icon-color": isActive ? "var(--arc)" : "var(--mute)" } as CSSProperties}
                        />
                      </span>
                    </span>
                    <span
                      className="capabilities-node-name mt-2 text-[12.5px] font-bold uppercase tracking-[-0.015em]"
                      style={{ "--node-name-color": isActive ? "#FF7A2E" : "var(--paper)" } as CSSProperties}
                    >
                      {service.name}
                    </span>
                    <span className="mt-1 text-[9.5px] uppercase tracking-[0.1em] text-[#9C9892]">
                      {service.microLabel}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Deliberately a normal block below the orbit container, not
                absolutely positioned inside it — inside, it collides with
                the bottom-centre node at narrow widths. */}
            <div
              className="mx-auto mt-[22px] max-w-[520px] rounded-full px-[26px] py-[14px] text-center"
              style={{ border: "1px solid #4A4A4A", background: "rgba(5,5,5,0.92)" }}
            >
              <p className="font-heading text-[12.5px] font-bold uppercase text-paper">
                {activeService ? activeService.name : "Explore a capability"}
              </p>
              <p className="mt-1 text-[11.5px]" style={{ color: "#A8A49E" }}>
                {activeService ? activeService.description : "Hover any capability above"}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

/**
 * <768px: the orbit's radial layout doesn't work at narrow widths, so
 * this replaces it entirely — a plain vertical list, tap a row to expand
 * its description inline. No rotation, no parallax, nothing per-frame;
 * `activeSlug` (shared with the orbit's hover/focus state, just repurposed
 * as a tap-toggle here) is the only state involved.
 */
function CapabilitiesList({
  activeSlug,
  onToggle,
}: {
  activeSlug: string | null;
  onToggle: (service: Service) => void;
}) {
  return (
    <ul className="mt-8 divide-y divide-line border-t border-line">
      {services.map((service) => {
        const isOpen = service.slug === activeSlug;
        const Icon = capabilityIcons[service.slug];
        return (
          <li key={service.slug}>
            <button
              type="button"
              data-cursor-hover
              aria-expanded={isOpen}
              onClick={() => onToggle(service)}
              className="flex w-full items-center gap-4 py-4 text-left"
            >
              <span
                className="grid h-12 w-12 flex-none place-items-center rounded-full border"
                style={{ borderColor: "rgba(255,90,26,0.6)", background: "rgba(5,5,5,0.96)" }}
              >
                <Icon
                  aria-hidden="true"
                  className="h-[21px] w-[21px] transition-colors duration-500"
                  style={{ color: isOpen ? "var(--arc)" : "var(--mute)" }}
                />
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
            {isOpen && (
              <p className="pb-4 pl-16 pr-2 text-[11.5px]" style={{ color: "#A8A49E" }}>
                {service.description}
              </p>
            )}
          </li>
        );
      })}
    </ul>
  );
}
