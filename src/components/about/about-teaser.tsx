import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { aboutTeaser } from "@/content/home";

export function AboutTeaser() {
  return (
    <section className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 pb-[26px] pt-[34px]">
        <div className="grid grid-cols-1 items-start gap-[26px] md:grid-cols-[1fr_1.35fr]">
          {/* Left column */}
          <Reveal>
            <span className="block text-[12px] uppercase tracking-[0.2em] text-[#FF7A2E]">
              {aboutTeaser.kicker}
            </span>
            <h2 className="mt-2 font-heading text-[32px] font-extrabold uppercase leading-none tracking-[-0.04em] text-paper">
              {aboutTeaser.title}
            </h2>

            <p className="mt-[14px] text-[15px] leading-[1.6] text-paper/85">
              {aboutTeaser.statement.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </p>

            <ul className="mt-[18px] list-none text-[13px] leading-[2] text-paper/72">
              {aboutTeaser.bullets.map((bullet) => (
                <li key={bullet} className="about-bullet flex items-center">
                  {bullet}
                </li>
              ))}
            </ul>

            <Link
              href={aboutTeaser.cta.href}
              data-cursor-hover
              className="mt-[22px] inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-mute transition-colors hover:text-paper"
            >
              {aboutTeaser.cta.label}
              <ArrowUpRight size={14} />
            </Link>
          </Reveal>

          {/* Right column — a "moving photograph." Decorative for now (a
              gradient placeholder), so it's aria-hidden with no alt text.
              TODO: once real photography lands, swap the inner div below
              for a `next/image fill` with a real, descriptive `alt` — the
              pan (globals.css: .about-photo-pan) lives on the wrapper it
              sits inside, not on the image itself, so nothing else here
              needs to change. */}
          <Reveal delay={0.1}>
            <div
              aria-hidden="true"
              className="relative h-[150px] w-full overflow-hidden border border-[#241C17]"
            >
              <div
                className="about-photo-pan relative"
                style={{
                  background: "radial-gradient(ellipse at 50% 60%, #452B1B 0%, #0D0806 65%)",
                }}
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
