import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { services, type Service } from "@/content/services";
import { clients } from "@/data/clients";
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
  const serviceClients = clients.filter((client) => client.services.includes(service.slug));
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

        {/* Clients — a grid, not a list. Each tile links straight to
            that client's own preview page (/services/[slug]/[clientSlug]);
            there's no intermediate "selected work" summary any more. */}
        <section className="mt-16 border-t border-line pt-10">
          <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-orange">
            Clients
          </h2>
          {serviceClients.length === 0 ? (
            <p className="mt-6 text-sm text-mute">Work in this capability is being added.</p>
          ) : (
            // The 2px gap sits on a --line background, so the gap itself
            // reads as a hairline between tiles instead of empty space —
            // each tile needs its own opaque bg so only the gap shows it.
            <div className="mt-6 grid grid-cols-1 gap-[2px] bg-line sm:grid-cols-2 lg:grid-cols-3">
              {serviceClients.map((client) => (
                <Link
                  key={client.slug}
                  href={`/services/${service.slug}/${client.slug}`}
                  data-cursor-hover
                  className="group relative isolate block aspect-[4/3] overflow-hidden bg-ink transition-shadow duration-300 hover:shadow-[0_0_0_1px_rgba(255,90,26,0.4)]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- real client-supplied asset under public/clients/, not swappable via next/image's own optimizer config here */}
                  <img
                    src={client.cover}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 35%, transparent 65%)" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <p className="font-heading text-[16px] font-bold text-paper/75 transition-colors duration-300 group-hover:text-paper">
                      {client.name}
                    </p>
                    <p className="mt-1 text-[10.5px] uppercase tracking-[0.1em] text-mute">
                      {client.images.length} {client.images.length === 1 ? "project" : "projects"}
                    </p>
                  </div>
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
