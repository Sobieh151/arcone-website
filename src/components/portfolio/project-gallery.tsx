"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import type { Project } from "@/data/projects";
import { IconButton } from "@/components/buttons/icon-button";
import { useFocusTrap } from "@/lib/use-focus-trap";

function placeholderSlide(color: string, i: number) {
  return `radial-gradient(circle at ${30 + i * 18}% ${30 + i * 14}%, ${color}55, transparent 60%), linear-gradient(160deg, #0b0b0b, #000)`;
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

/**
 * Stage 3 — the project "expands" into this. Image-first on purpose:
 * one large hero image, a thin meta strip (Project / Type / Scope), a
 * counter, prev/next. No case-study prose — that's what /work/[slug]
 * is for; this is the fast, visual continuation of the rail, not a
 * second reading experience.
 *
 * The hero image scales up from 0.94 while fading in (not a shared
 * layoutId morph from the rail card) — the rail renders both a desktop
 * and a mobile card for every project at once (CSS decides which
 * paints), so a layoutId shared between either of those and this image
 * meant two elements briefly carried the same id regardless of which
 * was visible; Framer Motion resolves that by hiding one outright,
 * which silently blanked the mobile card. This still reads as the
 * project growing into view, just without that failure mode.
 */
export function ProjectGallery({ project, onClose }: { project: Project; onClose: () => void }) {
  const slides = project.previewImages?.length
    ? project.previewImages
    : [0, 1, 2, 3].map((i) => placeholderSlide(project.color, i));
  const isPlaceholder = !project.previewImages?.length;
  const [index, setIndex] = useState(0);
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, true, onClose);

  const next = () => setIndex((i) => (i + 1) % slides.length);
  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);

  return (
    <motion.div
      data-lenis-prevent
      className="fixed inset-0 z-[100] bg-ink"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={`${project.name} — image gallery`}
        className="relative flex h-full w-full flex-col outline-none"
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") next();
          else if (e.key === "ArrowLeft") prev();
        }}
      >
        {/* Chrome kept to the minimum the brief asks for: a way back, and
            a "01/08" position — nothing else competes with the image. */}
        <div className="flex items-center justify-between px-6 pt-6 sm:px-10 sm:pt-8">
          <button
            type="button"
            onClick={onClose}
            data-cursor-hover
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-mute transition-colors hover:text-paper"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          {slides.length > 1 && (
            <span className="font-mono text-xs tabular-nums text-mute">
              {pad(index + 1)} / {pad(slides.length)}
            </span>
          )}
          <IconButton aria-label="Close" onClick={onClose} icon={<X size={18} />} />
        </div>

        {/* Hero image — the layoutId is what makes this feel like the
            card grew into this, not a new element replacing it. */}
        <div className="relative min-h-0 flex-1 px-6 py-6 sm:px-10 sm:py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-full w-full overflow-hidden rounded-2xl"
          >
            {isPlaceholder ? (
              <div className="absolute inset-0 transition-[background] duration-500" style={{ background: slides[index] }} />
            ) : (
              // eslint-disable-next-line @next/next/no-img-element -- placeholder path until real assets exist; swap for next/image then.
              <img src={slides[index]} alt={`${project.name} — visual work`} className="absolute inset-0 h-full w-full object-cover" />
            )}
          </motion.div>

          {slides.length > 1 && (
            <>
              <IconButton
                aria-label="Previous image"
                onClick={prev}
                icon={<ArrowLeft size={18} />}
                className="absolute left-9 top-1/2 -translate-y-1/2 sm:left-14"
              />
              <IconButton
                aria-label="Next image"
                onClick={next}
                icon={<ArrowRight size={18} />}
                className="absolute right-9 top-1/2 -translate-y-1/2 sm:right-14"
              />
            </>
          )}
        </div>

        {/* Meta strip — exactly the three fields the brief calls out,
            nothing else. `services` doubles as "scope": it's already
            the closest thing this data model has to one. */}
        <div className="grid grid-cols-3 gap-6 border-t border-line px-6 py-6 sm:px-10">
          <div>
            <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">Project</span>
            <p className="mt-1 text-sm text-paper sm:text-base">{project.name}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">Type</span>
            <p className="mt-1 text-sm text-paper sm:text-base">{project.category}</p>
          </div>
          <div>
            <span className="block text-[10px] uppercase tracking-[0.16em] text-mute">Scope</span>
            <p className="mt-1 truncate text-sm text-paper sm:text-base">{project.services.join(" / ")}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
