"use client";

import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects, type Project } from "@/data/projects";
import { Reveal } from "@/components/animations/reveal";
import { MaskReveal } from "@/components/animations/mask-reveal";
import { StaggerGroup } from "@/components/animations/stagger-group";
import { StaggerItem } from "@/components/animations/stagger-item";
import { Magnetic } from "@/components/buttons/magnetic";
import { Button } from "@/components/buttons/button";
import { ProjectModal } from "@/components/portfolio/project-modal";
import { workPreview } from "@/content/home";
import { useTilt } from "@/lib/use-tilt";
import { useProjectModal } from "@/lib/use-project-modal";

// Module scope — see the matching note in services-teaser.tsx. A button,
// not a Link: these rows open the same case-study modal as /work
// (project-modal.tsx) instead of navigating to a `/work/[slug]` route,
// which no longer exists.
const MotionButton = motion.create("button");

function WorkRow({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project, trigger: HTMLElement) => void;
}) {
  // tilt: false — these are full-width rows, not squarish tiles; a 3D
  // tilt would fight with reading the row rather than read as depth. The
  // cursor-tracking shine (glass-shine) still runs, just without rotation.
  const { ref, onMouseMove, onMouseLeave, style } = useTilt<HTMLButtonElement>({
    tilt: false,
  });

  return (
    <MotionButton
      ref={ref}
      type="button"
      data-cursor-hover
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={(e) => onOpen(project, e.currentTarget)}
      style={style}
      className="glass-on-hover glass-shine group relative grid w-full grid-cols-1 items-center gap-6 rounded-2xl border-t border-border py-10 text-left last:border-b md:grid-cols-12"
    >
      <span className="hidden font-mono text-sm text-gray-medium md:col-span-1 md:block">
        0{index + 1}
      </span>

      <div className="md:col-span-5">
        <h3 className="text-3xl font-semibold tracking-tight text-white transition-colors group-hover:text-orange-highlight sm:text-4xl">
          {project.name}
        </h3>
        <p className="mt-2 text-sm text-gray-light">
          {project.category} &middot; {project.year}
        </p>
      </div>

      <p className="text-sm leading-relaxed text-gray-light md:col-span-4">
        {project.summary}
      </p>

      <div className="flex items-center justify-between md:col-span-2 md:justify-end">
        <div
          className="h-16 w-24 overflow-hidden rounded-xl opacity-70 transition-all duration-500 group-hover:w-32 group-hover:opacity-100 sm:h-20 sm:w-28"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${project.color}55, transparent 70%), linear-gradient(135deg, #0a0a0a, #000)`,
            border: "1px solid var(--color-border)",
          }}
        />
        <span className="ml-4 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-white transition-all duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:border-orange group-hover:text-orange-highlight">
          <ArrowUpRight size={16} />
        </span>
      </div>
    </MotionButton>
  );
}

export function WorkPreview() {
  const { project, open, close } = useProjectModal();

  return (
    <section className="relative bg-bg py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Reveal>
              <span className="text-xs uppercase tracking-widest text-orange-highlight">
                {workPreview.eyebrow}
              </span>
            </Reveal>
            <MaskReveal
              as="h2"
              delay={0.06}
              className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              {workPreview.heading}
            </MaskReveal>
          </div>
          <Reveal delay={0.1}>
            <Magnetic strength={0.3}>
              <Button
                href={workPreview.cta.href}
                variant="secondary"
                size="sm"
                className="shrink-0"
                icon={<ArrowUpRight size={15} />}
              >
                {workPreview.cta.label}
              </Button>
            </Magnetic>
          </Reveal>
        </div>

        <StaggerGroup as="div" className="mt-16 flex flex-col" staggerChildren={0.06}>
          {projects.map((item, i) => (
            <StaggerItem key={item.slug}>
              <WorkRow project={item} index={i} onOpen={open} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>

      <AnimatePresence>
        {project && <ProjectModal project={project} onClose={close} />}
      </AnimatePresence>
    </section>
  );
}
