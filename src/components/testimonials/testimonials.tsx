"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { GlassCard } from "@/components/animations/glass-card";
import { IconButton } from "@/components/buttons/icon-button";
import { testimonials as quotes } from "@/content/home";

export function Testimonials() {
  const [index, setIndex] = useState(0);
  const active = quotes[index];

  const next = () => setIndex((i) => (i + 1) % quotes.length);
  const prev = () => setIndex((i) => (i - 1 + quotes.length) % quotes.length);

  return (
    <section className="relative bg-bg-secondary py-32">
      <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
        <Reveal>
          <Quote className="mx-auto text-orange" size={32} strokeWidth={1.5} />
        </Reveal>

        <GlassCard
          tilt={false}
          className="mt-10 flex min-h-[220px] items-center justify-center rounded-3xl px-6 py-10 sm:min-h-[200px] sm:px-14 sm:py-12"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-balance text-2xl font-medium leading-relaxed text-white sm:text-3xl">
                &ldquo;{active.quote}&rdquo;
              </p>
              <p className="mt-8 text-sm text-gray-light">
                <span className="text-white">{active.name}</span> &mdash;{" "}
                {active.role}
              </p>
            </motion.div>
          </AnimatePresence>
        </GlassCard>

        <div className="mt-10 flex items-center justify-center gap-4">
          <IconButton aria-label="Previous testimonial" onClick={prev} icon={<ChevronLeft size={18} />} />
          <div className="flex items-center gap-2">
            {quotes.map((q, i) => (
              <button
                // Index, not q.name: the current placeholder testimonials
                // all share the literal name "[[ Client name ]]" until the
                // real copy pass, which made `key={q.name}` collide.
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === index ? 24 : 6,
                  background:
                    i === index ? "var(--color-orange-highlight)" : "var(--color-gray-dark)",
                }}
              />
            ))}
          </div>
          <IconButton aria-label="Next testimonial" onClick={next} icon={<ChevronRight size={18} />} />
        </div>
      </div>
    </section>
  );
}
