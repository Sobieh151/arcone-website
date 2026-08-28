import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { services } from "@/content/services";
import { clients } from "@/data/clients";
import { ClientImageGrid } from "@/components/services/client-image-grid";
import { ContactCta } from "@/components/sections/contact-cta";

// One entry per (service, client) pair a client actually belongs to —
// a client listed under two services gets two real static pages, one
// per department, each linking back to that specific department. With
// clients.ts shipping empty this returns an empty array, which is a
// normal, successful build (zero pages for this route, not an error) —
// see that file's own comment for why it stays empty until there's a
// real client to add.
export async function generateStaticParams() {
  return clients.flatMap((client) =>
    client.services.map((serviceSlug) => ({ slug: serviceSlug, clientSlug: client.slug }))
  );
}

export async function generateMetadata({
  params,
}: PageProps<"/services/[slug]/[clientSlug]">): Promise<Metadata> {
  const { slug, clientSlug } = await params;
  const service = services.find((s) => s.slug === slug);
  const client = clients.find((c) => c.slug === clientSlug);
  if (!service || !client) return {};
  return {
    title: `${client.name} — ${service.name}`,
    description: client.intro,
  };
}

/**
 * Level 2 of the client-grid flow (see /services/[slug]/page.tsx for
 * Level 1): a client's actual work, almost nothing else. Back link,
 * name, one short line of context, then every image as a masonry grid
 * that opens into a lightbox (ClientImageGrid) — no challenge/approach/
 * results write-up, that's not what this page is for.
 */
export default async function ClientPreviewPage({ params }: PageProps<"/services/[slug]/[clientSlug]">) {
  const { slug, clientSlug } = await params;
  const service = services.find((s) => s.slug === slug);
  const client = clients.find((c) => c.slug === clientSlug);
  // Both have to exist, AND the client has to actually be listed under
  // this specific service — otherwise /services/branding/some-web-app-
  // only-client would silently render under the wrong department.
  if (!service || !client || !client.services.includes(service.slug)) notFound();

  const otherClients = clients.filter(
    (c) => c.slug !== client.slug && c.services.includes(service.slug)
  );

  return (
    <>
      <div className="mx-auto max-w-6xl px-6 pb-10 pt-32 sm:px-10">
        <Link
          href={`/services/${service.slug}`}
          data-cursor-hover
          className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-paper"
        >
          <ArrowLeft size={15} />
          {service.name}
        </Link>

        <div className="mt-8 max-w-2xl">
          <h1 className="font-heading text-4xl font-extrabold uppercase leading-none tracking-[-0.03em] text-paper sm:text-5xl">
            {client.name}
          </h1>
          <p className="mt-4 text-lg text-mute">{client.intro}</p>
        </div>

        <div className="mt-12">
          {client.images.length === 0 ? (
            <p className="text-sm text-mute">Images for this client are being added.</p>
          ) : (
            <ClientImageGrid images={client.images} />
          )}
        </div>

        {otherClients.length > 0 && (
          <section className="mt-16 border-t border-line pt-10">
            <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-orange">
              Other {service.name} clients
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {otherClients.map((other) => (
                <Link
                  key={other.slug}
                  href={`/services/${service.slug}/${other.slug}`}
                  data-cursor-hover
                  className="rounded-full border border-line px-5 py-2.5 text-sm text-mute transition-colors hover:border-orange/60 hover:text-paper"
                >
                  {other.name}
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <ContactCta />
    </>
  );
}
