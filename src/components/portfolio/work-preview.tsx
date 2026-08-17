"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/animations/reveal";
import { MaskReveal } from "@/components/animations/mask-reveal";
import { StaggerGroup } from "@/components/animations/stagger-group";
import { StaggerItem } from "@/components/animations/stagger-item";
import { Button } from "@/components/buttons/button";
import { workPreview } from "@/content/home";

export function WorkPreview() {
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
            <Button
              href={workPreview.cta.href}
              variant="secondary"
              size="sm"
              className="shrink-0"
              icon={<ArrowUpRight size={15} />}
            >
              {workPreview.cta.label}
            </Button>
          </Reveal>
        </div>

        <StaggerGroup as="div" className="mt-16 flex flex-col" staggerChildren={0.06}>
          {projects.map((project, i) => (
            <StaggerItem key={project.slug}>
              <Link
                href={`/work/${project.slug}`}
                data-cursor-hover
                className="group relative grid grid-cols-1 items-center gap-6 border-t border-border py-10 last:border-b md:grid-cols-12"
              >
                <span className="hidden font-mono text-sm text-gray-medium md:col-span-1 md:block">
                  0{i + 1}
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
                  <motion.span className="ml-4 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-border text-white transition-colors group-hover:border-orange group-hover:text-orange-highlight">
                    <ArrowUpRight size={16} />
                  </motion.span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
