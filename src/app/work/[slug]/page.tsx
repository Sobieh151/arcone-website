import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { projects } from "@/data/projects";
import { Reveal } from "@/components/animations/reveal";
import { MaskReveal } from "@/components/animations/mask-reveal";
import { ContactCta } from "@/components/sections/contact-cta";

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
  };
}

export default async function CaseStudyPage({
  params,
}: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];

  return (
    <>
      <section className="relative isolate overflow-hidden pb-20 pt-40 sm:pt-48">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] opacity-40 blur-[100px]"
          style={{
            background: `radial-gradient(circle at 50% 10%, ${project.color}66, transparent 65%)`,
          }}
        />
        <div className="mx-auto max-w-5xl px-6 sm:px-10">
          <Reveal>
            <Link
              href="/work"
              data-cursor-hover
              className="inline-flex items-center gap-2 text-sm text-gray-light transition-colors hover:text-white"
            >
              <ArrowLeft size={15} />
              All Work
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <span className="mt-10 block text-xs uppercase tracking-widest text-orange-highlight">
              {project.category} &middot; {project.year}
            </span>
          </Reveal>
          <MaskReveal
            as="h1"
            delay={0.12}
            className="mt-4 text-5xl font-semibold tracking-tight text-white sm:text-6xl md:text-7xl"
          >
            {project.name}
          </MaskReveal>
          <Reveal delay={0.18}>
            <p className="mt-6 max-w-xl text-lg text-gray-light">
              {project.summary}
            </p>
          </Reveal>
          <Reveal delay={0.22}>
            <ul className="mt-8 flex flex-wrap gap-2">
              {project.services.map((service) => (
                <li
                  key={service}
                  className="rounded-full border border-border px-4 py-1.5 text-xs text-gray-light"
                >
                  {service}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Reveal className="mx-auto max-w-5xl px-6 sm:px-10">
        <div
          className="aspect-[16/9] w-full rounded-3xl border border-border"
          style={{
            background: `radial-gradient(circle at 25% 25%, ${project.color}55, transparent 55%), radial-gradient(circle at 80% 80%, ${project.color}33, transparent 50%), linear-gradient(160deg, #0b0b0b, #000)`,
          }}
        />
      </Reveal>

      <section className="mx-auto max-w-5xl px-6 py-28 sm:px-10">
        <div className="grid grid-cols-1 gap-16 md:grid-cols-3">
          {[
            { label: "Challenge", text: project.challenge },
            { label: "Strategy", text: project.strategy },
            { label: "Execution", text: project.execution },
          ].map((block, i) => (
            <Reveal key={block.label} delay={i * 0.08}>
              <span className="text-xs uppercase tracking-widest text-orange-highlight">
                {block.label}
              </span>
              <p className="mt-4 text-base leading-relaxed text-gray-light">
                {block.text}
              </p>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1} className="mt-24 border-t border-border pt-16">
          <span className="text-xs uppercase tracking-widest text-orange-highlight">
            Results
          </span>
          <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-3">
            {project.results.map((result) => (
              <div key={result.label}>
                <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                  {result.value}
                </p>
                <p className="mt-2 text-sm text-gray-light">{result.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      <section className="border-t border-border">
        <Link
          href={`/work/${next.slug}`}
          data-cursor-hover
          className="group flex items-center justify-between px-6 py-16 sm:px-10"
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-gray-medium">
              Next Project
            </span>
            <h3 className="mt-3 text-3xl font-semibold tracking-tight text-white transition-colors group-hover:text-orange-highlight sm:text-5xl">
              {next.name}
            </h3>
          </div>
          <ArrowUpRight
            size={28}
            className="shrink-0 text-white transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      </section>

      <ContactCta />
    </>
  );
}
