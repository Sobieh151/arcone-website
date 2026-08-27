import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { aboutTeaser } from "@/content/home";

export function AboutTeaser() {
  return (
    <section className="relative min-h-[420px] overflow-hidden border-t border-line">
      {/* Full-bleed background — decorative for now (a gradient
          placeholder), so it's aria-hidden with no alt text. TODO: once
          real photography lands, drop /public/about.jpg in here as
          `<Image src="/about.jpg" alt="…" fill className="object-cover" />`
          in place of the gradient div below, with a real, descriptive
          alt (and this frame stops being aria-hidden at that point) — the
          pan (globals.css: .about-photo-pan) lives on the wrapper it
          sits inside, not on the image itself, so nothing else here
          needs to change. */}
      <div aria-hidden="true" className="absolute inset-0">
        <div
          className="about-photo-pan relative h-full"
          style={{
            background: "radial-gradient(ellipse at 50% 60%, #452B1B 0%, #0D0806 65%)",
          }}
        />
      </div>

      {/* Scrim so the left-column text stays legible over the image:
          solid from the left edge through roughly where the 520px text
          column ends, then fading toward the image on the right. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(to right, #050505 62%, rgba(5,5,5,0.5) 92%, rgba(5,5,5,0.35) 100%)",
        }}
      />

      <div className="relative mx-auto flex min-h-[420px] max-w-7xl items-center px-6 py-16">
        <Reveal className="max-w-[520px] text-left">
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
      </div>
    </section>
  );
}
