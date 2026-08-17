import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Reveal } from "@/components/animations/reveal";
import { privacyLastUpdated, privacySections } from "@/content/legal";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ARCone collects, uses and protects your information.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHeader eyebrow="Legal" title="Privacy Policy" />
      <section className="mx-auto max-w-2xl px-6 pb-32 sm:px-10">
        <Reveal>
          <p className="text-sm text-gray-medium">
            Last updated: {privacyLastUpdated}. This is a general-purpose
            template — have it reviewed by counsel before relying on it as
            your live policy.
          </p>
        </Reveal>
        <div className="mt-12 flex flex-col gap-10">
          {privacySections.map((section, i) => (
            <Reveal key={section.heading} delay={i * 0.04}>
              <h2 className="text-xl font-semibold text-white">
                {section.heading}
              </h2>
              <p className="mt-3 leading-relaxed text-gray-light">
                {section.body}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
