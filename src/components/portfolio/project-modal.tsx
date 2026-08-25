"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import type { Project } from "@/data/projects";
import { Button } from "@/components/buttons/button";
import { primaryCta } from "@/content/shared";
import { useFocusTrap } from "@/lib/use-focus-trap";

/**
 * Case-study content as a modal overlay instead of a `/work/[slug]` route
 * (replaced entirely — see work-list.tsx / work-preview.tsx). Mount inside
 * an `AnimatePresence` so the exit animation runs on close.
 *
 * Close paths: Escape and the focus trap (useFocusTrap), backdrop click
 * (the outer layer's onClick, stopped from the panel so inner clicks don't
 * bubble up and self-close it), and the explicit close button.
 */
export function ProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const panelRef = useRef<HTMLDivElement>(null);
  useFocusTrap(panelRef, true, onClose);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto p-4 py-10 sm:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 bg-black/75 backdrop-blur-sm"
      />

      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.98 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="glass relative my-auto w-full max-w-4xl rounded-3xl p-6 sm:p-10"
      >
        <button
          type="button"
          onClick={onClose}
          data-cursor-hover
          aria-label="Close case study"
          className="absolute right-5 top-5 z-10 grid h-10 w-10 place-items-center rounded-full border border-border bg-bg text-white transition-colors hover:border-orange hover:text-orange-highlight"
        >
          <X size={18} />
        </button>

        {/* Hero visual */}
        <div
          className="aspect-[16/9] w-full rounded-2xl border border-border"
          style={{
            background: `radial-gradient(circle at 25% 25%, ${project.color}55, transparent 55%), radial-gradient(circle at 80% 80%, ${project.color}33, transparent 50%), linear-gradient(160deg, #0b0b0b, #000)`,
          }}
        />

        <span className="mt-8 block text-xs uppercase tracking-widest text-orange-highlight">
          {project.category} &middot; {project.year}
        </span>
        <h2
          id="project-modal-title"
          className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl"
        >
          {project.name}
        </h2>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-light">
          {project.summary}
        </p>

        {/* Client / Industry / Services */}
        <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-4">
          <div>
            <dt className="text-xs uppercase tracking-widest text-gray-medium">Client</dt>
            <dd className="mt-2 text-sm text-white">{project.name}</dd>
          </div>
          <div>
            <dt className="text-xs uppercase tracking-widest text-gray-medium">Industry</dt>
            <dd className="mt-2 text-sm text-white">{project.industry}</dd>
          </div>
          <div className="col-span-2">
            <dt className="text-xs uppercase tracking-widest text-gray-medium">Services</dt>
            <dd className="mt-2 flex flex-wrap gap-2">
              {project.services.map((service) => (
                <span
                  key={service}
                  className="rounded-full border border-border px-3 py-1 text-xs text-gray-light"
                >
                  {service}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        {/* Challenge / Approach / What We Did */}
        <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {[
            { label: "Challenge", text: project.challenge },
            { label: "Approach", text: project.strategy },
            { label: "What We Did", text: project.execution },
          ].map((block) => (
            <div key={block.label}>
              <span className="text-xs uppercase tracking-widest text-orange-highlight">
                {block.label}
              </span>
              <p className="mt-3 text-sm leading-relaxed text-gray-light">{block.text}</p>
            </div>
          ))}
        </div>

        {/* Visual work — placeholder tiles, no real photography yet
            (matches the gradient-swatch treatment used everywhere else
            on the site in place of imagery). */}
        <div className="mt-12">
          <span className="text-xs uppercase tracking-widest text-orange-highlight">
            Visual Work
          </span>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="aspect-square rounded-xl border border-border"
                style={{
                  background: `radial-gradient(circle at ${30 + i * 20}% ${30 + i * 15}%, ${project.color}40, transparent 60%), linear-gradient(160deg, #0b0b0b, #000)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Results */}
        <div className="mt-12 border-t border-border pt-10">
          <span className="text-xs uppercase tracking-widest text-orange-highlight">
            Results
          </span>
          <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
            {project.results.map((result) => (
              <div key={result.label}>
                <p className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                  {result.value}
                </p>
                <p className="mt-2 text-sm text-gray-light">{result.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 flex flex-col items-start gap-4 border-t border-border pt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-lg text-white">[[ CTA — start a project like this one ]]</p>
          <Button
            href={primaryCta.href}
            icon={
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            }
          >
            {primaryCta.label}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
