import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { services, type Service } from "@/content/services";
import { projects } from "@/data/projects";
import { capabilityIcons } from "@/components/icons/capability-icons";
import { ContactCta } from "@/components/sections/contact-cta";

// Every slug in content/services.ts gets a real page at build time — add
// a capability there and this route picks it up automatically, nothing
// to touch here. Same pattern as /work/[slug]/page.tsx.
export async function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) return {};
  return {
    title: service.name,
    description: service.positioning,
  };
}

/**
 * A single capability's page — header, deliverables, process, selected
 * work filtered to this capability's category, a row of links to the
 * other four, and the closing CTA. /services (services-list.tsx) links
 * each row here instead of only listing capabilities inline.
 */
export default async function CapabilityPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = services.find((s) => s.slug === slug);
  if (!service) notFound();

  const Icon = capabilityIcons[service.slug];
  // Project.category (data/projects.ts) is written to match a Service
  // name exactly (see work-list.tsx's own category filter) — same
  // capability names driving both, so this can't silently drift.
  const relatedWork = projects.filter((project) => project.category === service.name);
  const otherServices = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      <div className="mx-auto max-w-4xl px-6 pb-10 pt-32 sm:px-10">
        <Link
          href="/services"
          data-cursor-hover
          className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-paper"
        >
          <ArrowLeft size={15} />
          Back to Services
        </Link>

        {/* Header */}
        <div className="mt-8">
          <span
            className="grid h-[40px] w-[40px] place-items-center rounded-full border"
            style={{ borderColor: "rgba(255,90,26,0.6)", background: "rgba(5,5,5,0.96)", color: "var(--arc)" }}
          >
            <Icon aria-hidden="true" className="h-[22px] w-[22px]" />
          </span>
          <h1 className="mt-5 font-heading text-4xl font-extrabold uppercase leading-none tracking-[-0.03em] text-paper sm:text-5xl">
            {service.name}
          </h1>
          <p className="mt-4 text-lg text-mute">{service.positioning}</p>
        </div>

        {/* What this covers */}
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-orange">
            What this covers
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-mute">{service.description}</p>
          <ul className="mt-8 grid grid-cols-1 gap-x-10 sm:grid-cols-2">
            {service.deliverables.map((item, i) => (
              <li
                key={i}
                className="border-t border-line py-4 text-sm text-paper first:border-t-0 sm:[&:nth-child(-n+2)]:border-t-0"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* How we work */}
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-orange">
            How we work
          </h2>
          <ol className="mt-8 flex flex-col gap-6">
            {service.process.map((step, i) => (
              <li key={i} className="flex gap-5">
                <span className="font-heading text-sm font-bold text-orange">
                  0{i + 1}
                </span>
                <span className="text-sm leading-relaxed text-mute">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* Selected work */}
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-orange">
            Selected work
          </h2>
          {relatedWork.length === 0 ? (
            <p className="mt-6 text-sm text-mute">Work in this capability is being added.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {relatedWork.map((project) => (
                <Link
                  key={project.slug}
                  href={`/work/${project.slug}`}
                  data-cursor-hover
                  className="group relative isolate overflow-hidden rounded-2xl border border-line p-6"
                >
                  <div
                    className="absolute inset-0 -z-10 transition-transform duration-700 ease-out group-hover:scale-105"
                    style={{
                      background: `radial-gradient(circle at 75% 25%, ${project.color}40, transparent 55%), linear-gradient(180deg, #050505, #000)`,
                    }}
                  />
                  <span className="text-xs uppercase tracking-widest text-orange">
                    {project.category} &middot; {project.year}
                  </span>
                  <h3 className="mt-3 font-heading text-2xl font-bold text-paper transition-colors group-hover:text-orange">
                    {project.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{project.summary}</p>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm text-paper">
                    View Case Study
                    <ArrowUpRight size={15} />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Other capabilities */}
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-orange">
            Other capabilities
          </h2>
          <div className="mt-6 flex flex-wrap gap-4">
            {otherServices.map((other) => (
              <OtherCapabilityLink key={other.slug} service={other} />
            ))}
          </div>
        </section>
      </div>

      <ContactCta />
    </>
  );
}

function OtherCapabilityLink({ service }: { service: Service }) {
  const Icon = capabilityIcons[service.slug];
  return (
    <Link
      href={`/services/${service.slug}`}
      data-cursor-hover
      aria-label={service.name}
      className="group flex items-center gap-3 rounded-full border border-line py-2 pl-2 pr-5 transition-colors hover:border-orange/60"
    >
      <span className="grid h-9 w-9 flex-none place-items-center rounded-full border border-line text-mute transition-colors group-hover:border-orange/60 group-hover:text-orange">
        <Icon aria-hidden="true" className="h-[18px] w-[18px]" />
      </span>
      <span className="text-sm text-paper">{service.name}</span>
    </Link>
  );
}
