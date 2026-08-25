"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { services } from "@/content/services";
import { Reveal } from "@/components/animations/reveal";
import { ProjectModal } from "@/components/portfolio/project-modal";
import { useProjectModal } from "@/lib/use-project-modal";
import { cn } from "@/lib/utils";

// Filter categories are derived from the services list — the same 5
// capability names driving /services — so the two can't drift apart.
const categories = ["All", ...services.map((service) => service.name)];

export function WorkList() {
  const [active, setActive] = useState<string>("All");
  const { project, open, close } = useProjectModal();

  const filtered = useMemo(
    () => (active === "All" ? projects : projects.filter((p) => p.category === active)),
    [active]
  );

  return (
    <div>
      <div
        role="group"
        aria-label="Filter work by category"
        className="mx-auto flex max-w-7xl flex-wrap gap-3 px-6 pb-12 sm:px-10"
      >
        {categories.map((category) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              type="button"
              data-cursor-hover
              aria-pressed={isActive}
              onClick={() => setActive(category)}
              className={cn(
                "rounded-full border px-5 py-2 text-sm transition-colors",
                isActive
                  ? "border-orange bg-orange text-black"
                  : "border-border text-gray-light hover:border-white/30 hover:text-white"
              )}
            >
              {category}
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="border-t border-border px-6 py-24 text-center text-gray-light sm:px-10">
          No projects in this category yet.
        </p>
      ) : (
        <div className="flex flex-col">
          {filtered.map((item, i) => (
            <Reveal key={item.slug} y={48}>
              {/* A button, not a Link — individual case studies open as a
                  modal (project-modal.tsx) instead of navigating to a
                  `/work/[slug]` route, which no longer exists. */}
              <button
                type="button"
                data-cursor-hover
                onClick={(e) => open(item, e.currentTarget)}
                className="group relative isolate flex w-full min-h-[70vh] items-end overflow-hidden border-b border-border px-6 py-16 text-left sm:px-10 md:min-h-[85vh]"
              >
                <div
                  className="absolute inset-0 -z-10 transition-transform duration-700 ease-out group-hover:scale-105"
                  style={{
                    background: `radial-gradient(circle at 75% 25%, ${item.color}40, transparent 55%), radial-gradient(circle at 15% 90%, ${item.color}25, transparent 50%), linear-gradient(180deg, #050505, #000)`,
                  }}
                />
                <div className="absolute inset-0 -z-10 bg-black/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <span className="absolute right-6 top-10 font-mono text-sm text-gray-medium sm:right-10">
                  0{i + 1} / 0{filtered.length}
                </span>

                <div className="flex w-full flex-col justify-between gap-6 sm:flex-row sm:items-end">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-orange-highlight">
                      {item.category} &middot; {item.year}
                    </span>
                    <h2 className="mt-4 text-[13vw] font-semibold leading-[0.9] tracking-tight text-white transition-colors duration-500 group-hover:text-orange-highlight sm:text-6xl md:text-7xl lg:text-8xl">
                      {item.name}
                    </h2>
                  </div>

                  <div className="max-w-xs opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <p className="text-sm leading-relaxed text-gray-light">{item.summary}</p>
                    <motion.span className="mt-4 inline-flex items-center gap-2 text-sm text-white">
                      View Case Study
                      <ArrowUpRight size={15} />
                    </motion.span>
                  </div>
                </div>
              </button>
            </Reveal>
          ))}
        </div>
      )}

      <AnimatePresence>
        {project && <ProjectModal project={project} onClose={close} />}
      </AnimatePresence>
    </div>
  );
}
