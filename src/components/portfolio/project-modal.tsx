"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import type { Project } from "@/data/projects";
import { useFocusTrap } from "@/lib/use-focus-trap";
import { ProjectContent } from "@/components/portfolio/project-content";
import { IconButton } from "@/components/buttons/icon-button";

/**
 * Case-study content as a modal overlay — still how Explore Work's cards
 * and the /work grid open a project. The body itself (hero visual,
 * summary, challenge/approach/results, the visual-work slider) lives in
 * ProjectContent, shared with the newer /work/[slug] page so neither
 * duplicates the other's JSX; this component is just the modal chrome
 * around it — backdrop, close button, focus trap, entrance/exit motion.
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
      // data-lenis-prevent: Lenis's global wheel/touch listener keeps
      // calling preventDefault() on every gesture site-wide even after
      // lenis.stop() (confirmed by reading its source and reproducing —
      // stop() pauses Lenis's own scroll animation, but its listener
      // still intercepts the event first rather than releasing it back to
      // native scrolling). Without this attribute, that swallowed every
      // wheel/touch gesture over this panel too, so overflow-y-auto below
      // never actually got a scroll event to act on. This tells Lenis to
      // skip its own handling for anything inside this subtree and let
      // the browser scroll it natively instead — see lenis/dist/lenis.mjs,
      // the composedPath().find(... data-lenis-prevent ...) check.
      data-lenis-prevent
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
        <IconButton
          aria-label="Close case study"
          onClick={onClose}
          icon={<X size={18} />}
          className="absolute right-5 top-5 z-10"
        />

        <ProjectContent project={project} headingId="project-modal-title" />
      </motion.div>
    </motion.div>
  );
}
