"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
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

        <div className="mt-10 min-h-[220px] sm:min-h-[160px]">
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
        </div>

        <div className="mt-10 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={prev}
            data-cursor-hover
            aria-label="Previous testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-white transition-colors hover:border-orange hover:text-orange-highlight"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex items-center gap-2">
            {quotes.map((q, i) => (
              <button
                key={q.name}
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
          <button
            type="button"
            onClick={next}
            data-cursor-hover
            aria-label="Next testimonial"
            className="grid h-11 w-11 place-items-center rounded-full border border-border text-white transition-colors hover:border-orange hover:text-orange-highlight"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}
