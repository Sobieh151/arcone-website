import type { ReactNode } from "react";
import { Reveal } from "@/components/animations/reveal";
import { MaskReveal } from "@/components/animations/mask-reveal";

export function PageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: string;
}) {
  return (
    <section className="relative isolate overflow-hidden pb-20 pt-40 sm:pt-48">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[420px] w-[720px] -translate-x-1/2 rounded-full opacity-30 blur-[110px]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,80,2,0.5), transparent 65%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-orange-highlight">
            {eyebrow}
          </span>
        </Reveal>
        <MaskReveal
          as="h1"
          delay={0.08}
          className="mt-6 text-balance text-5xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl"
        >
          {title}
        </MaskReveal>
        {description && (
          <Reveal delay={0.16}>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg text-gray-light">
              {description}
            </p>
          </Reveal>
        )}
      </div>
    </section>
  );
}
