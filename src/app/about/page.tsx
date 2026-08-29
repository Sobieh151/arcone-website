import type { Metadata } from "next";
import { AboutHero } from "@/components/about/about-hero";
import { Reveal } from "@/components/animations/reveal";
import { Values } from "@/components/about/values";
import { Stats } from "@/components/about/stats";
import { ContactCta } from "@/components/sections/contact-cta";
import { statement } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "ARCone is a creative partner for ambitious brands that understand design is more than aesthetics. It's leverage.",
};

export default function AboutPage() {
  return (
    <>
      <AboutHero />

      <section className="mx-auto max-w-4xl px-6 pb-28 pt-16 sm:px-10">
        {statement.map((paragraph, i) => (
          <Reveal key={paragraph} delay={i * 0.1}>
            <p className="mt-8 text-balance text-2xl leading-relaxed text-gray-light first:mt-0 sm:text-3xl">
              {paragraph}
            </p>
          </Reveal>
        ))}
      </section>

      <Stats />
      <Values />
      <ContactCta />
    </>
  );
}
