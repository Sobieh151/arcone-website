"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Project } from "@/data/projects";

function placeholderSlide(color: string, i: number) {
  return `radial-gradient(circle at ${30 + i * 18}% ${30 + i * 14}%, ${color}55, transparent 60%), linear-gradient(160deg, #0b0b0b, #000)`;
}

/**
 * The case-study preview slider — shared between the project modal and
 * the /work/[slug] page (see project-content.tsx), so it only needs to
 * exist once. Falls back to four generated placeholder gradients when
 * `project.previewImages` is empty; swapping in real photography later
 * is a one-field change in data/projects.ts, nothing here needs to move.
 * Deliberately simple click-driven prev/next + dots, not a drag carousel
 * — this is a linear "here's the work" viewer, not the homepage's
 * physical-feeling browsing carousel (use-carousel-drag.ts).
 */
export function WorkSlider({ project }: { project: Project }) {
  const slides = project.previewImages?.length
    ? project.previewImages
    : [0, 1, 2, 3].map((i) => placeholderSlide(project.color, i));
  const [index, setIndex] = useState(0);
  const isPlaceholder = !project.previewImages?.length;

  return (
    <div>
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-border">
        {isPlaceholder ? (
          <div className="absolute inset-0" style={{ background: slides[index] }} />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element -- placeholder path until real assets exist; swap for next/image then.
          <img src={slides[index]} alt={`${project.name} — visual work`} className="absolute inset-0 h-full w-full object-cover" />
        )}

        {slides.length > 1 && (
          <>
            <button
              type="button"
              data-cursor-hover
              aria-label="Previous visual"
              onClick={() => setIndex((i) => (i - 1 + slides.length) % slides.length)}
              className="absolute left-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#4A4A4A] bg-ink/70 text-arc backdrop-blur-sm transition-colors hover:border-arc hover:bg-[rgba(255,90,26,0.12)]"
            >
              <ArrowLeft size={16} />
            </button>
            <button
              type="button"
              data-cursor-hover
              aria-label="Next visual"
              onClick={() => setIndex((i) => (i + 1) % slides.length)}
              className="absolute right-3 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-[#4A4A4A] bg-ink/70 text-arc backdrop-blur-sm transition-colors hover:border-arc hover:bg-[rgba(255,90,26,0.12)]"
            >
              <ArrowRight size={16} />
            </button>
          </>
        )}
      </div>

      {slides.length > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={i}
              type="button"
              data-cursor-hover
              aria-label={`Go to visual ${i + 1}`}
              aria-current={i === index ? "true" : undefined}
              onClick={() => setIndex(i)}
              className="h-[7px] rounded-full"
              style={{
                width: i === index ? "22px" : "7px",
                backgroundColor: i === index ? "var(--arc)" : "#565656",
                transition: "width 400ms var(--ease-smooth), background-color 400ms var(--ease-smooth)",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
