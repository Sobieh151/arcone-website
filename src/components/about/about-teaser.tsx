import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { aboutTeaser } from "@/content/home";

export function AboutTeaser() {
  return (
    <section className="relative overflow-hidden bg-bg-secondary py-32">
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 px-6 sm:px-10 lg:grid-cols-2">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-orange-highlight">
            {aboutTeaser.eyebrow}
          </span>
          <h2 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            {aboutTeaser.heading}
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-gray-light">
            {aboutTeaser.body}
          </p>
          <Link
            href={aboutTeaser.cta.href}
            data-cursor-hover
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-border px-6 py-3 text-sm text-white transition-colors hover:border-white/30"
          >
            {aboutTeaser.cta.label}
            <ArrowUpRight size={15} />
          </Link>
        </Reveal>

        <Reveal delay={0.15} className="relative aspect-[4/5] w-full">
          <div
            className="h-full w-full rounded-3xl border border-border"
            style={{
              background:
                "radial-gradient(circle at 70% 20%, rgba(255,96,1,0.25), transparent 55%), radial-gradient(circle at 20% 85%, rgba(156,63,11,0.35), transparent 60%), linear-gradient(160deg, #0d0d0d, #000)",
            }}
          />
          <div className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_120px_rgba(0,0,0,0.6)]" />
        </Reveal>
      </div>
    </section>
  );
}
