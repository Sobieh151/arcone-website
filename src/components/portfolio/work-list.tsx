"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/animations/reveal";

export function WorkList() {
  return (
    <div className="flex flex-col">
      {projects.map((project, i) => (
        <Reveal key={project.slug} y={48}>
          <Link
            href={`/work/${project.slug}`}
            data-cursor-hover
            className="group relative isolate flex min-h-[70vh] items-end overflow-hidden border-b border-border px-6 py-16 sm:px-10 md:min-h-[85vh]"
          >
            <div
              className="absolute inset-0 -z-10 transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                background: `radial-gradient(circle at 75% 25%, ${project.color}40, transparent 55%), radial-gradient(circle at 15% 90%, ${project.color}25, transparent 50%), linear-gradient(180deg, #050505, #000)`,
              }}
            />
            <div className="absolute inset-0 -z-10 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <span className="absolute right-6 top-10 font-mono text-sm text-gray-medium sm:right-10">
              0{i + 1} / 0{projects.length}
            </span>

            <div className="flex w-full flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs uppercase tracking-widest text-orange-highlight">
                  {project.category} &middot; {project.year}
                </span>
                <h2 className="mt-4 text-[13vw] font-semibold leading-[0.9] tracking-tight text-white transition-colors duration-500 group-hover:text-orange-highlight sm:text-6xl md:text-7xl lg:text-8xl">
                  {project.name}
                </h2>
              </div>

              <div className="max-w-xs opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                <p className="text-sm leading-relaxed text-gray-light">
                  {project.summary}
                </p>
                <motion.span className="mt-4 inline-flex items-center gap-2 text-sm text-white">
                  View Case Study
                  <ArrowUpRight size={15} />
                </motion.span>
              </div>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}
