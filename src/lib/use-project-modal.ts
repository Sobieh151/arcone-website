"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Project } from "@/data/projects";
import { useLenis } from "@/components/providers/smooth-scroll";

/**
 * Shared "open a case study as a modal" state, used by both the /work grid
 * (work-list.tsx) and the homepage preview rows (work-preview.tsx) so the
 * two don't duplicate the open/close/scroll-lock/focus-restore logic.
 *
 * Scroll position: since opening never navigates (no route change, no
 * `/work/[slug]`), the page's scroll position is never touched — the only
 * thing that needs handling is pausing Lenis (same lock/unlock pattern as
 * the mobile nav menu) so a background scroll gesture can't scroll the
 * page out from under the open modal.
 *
 * Focus restore: `open` captures the exact element that triggered it
 * (the clicked tile) — when the modal closes, focus returns there, not
 * just "somewhere on the page".
 */
export function useProjectModal() {
  const [project, setProject] = useState<Project | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const lenis = useLenis();

  const open = useCallback((next: Project, trigger: HTMLElement) => {
    triggerRef.current = trigger;
    setProject(next);
  }, []);

  const close = useCallback(() => setProject(null), []);

  useEffect(() => {
    if (project) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
      triggerRef.current?.focus();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [project, lenis]);

  return { project, open, close };
}
