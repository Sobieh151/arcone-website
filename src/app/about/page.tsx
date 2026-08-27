import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/animations/reveal";
import { Values } from "@/components/about/values";
import { Stats } from "@/components/about/stats";
import { ContactCta } from "@/components/sections/contact-cta";
import { aboutHeader, statement } from "@/content/about";

export const metadata: Metadata = {
  title: "About",
  description:
    "ARCone is a creative partner for ambitious brands that understand design is more than aesthetics. It's leverage.",
};

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow={aboutHeader.eyebrow} title={aboutHeader.title} />

      <section className="mx-auto max-w-4xl px-6 pb-28 sm:px-10">
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
