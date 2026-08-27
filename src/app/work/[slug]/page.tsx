import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { projects } from "@/data/projects";
import { ProjectContent } from "@/components/portfolio/project-content";
import { ContactCta } from "@/components/sections/contact-cta";

// Every slug in data/projects.ts gets a real page at build time — add a
// project there and this route picks it up automatically, nothing to
// touch here.
export async function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  return {
    title: project.name,
    description: project.summary,
  };
}

/**
 * The client-preview / case-study page — a real URL (not the
 * ProjectModal overlay used elsewhere on the site) so Trusted By's
 * client icons, and anyone sharing a direct link, land somewhere
 * bookmarkable. Same body as the modal (ProjectContent), different
 * chrome: a back link instead of a close button, no backdrop/focus trap.
 */
export default async function ClientPreviewPage({ params }: PageProps<"/work/[slug]">) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  return (
    <>
      <div className="mx-auto max-w-4xl px-6 pb-10 pt-32 sm:px-10">
        <Link
          href="/work"
          data-cursor-hover
          className="inline-flex items-center gap-2 text-sm text-mute transition-colors hover:text-paper"
        >
          <ArrowLeft size={15} />
          Back to Work
        </Link>

        <div className="mt-8">
          <ProjectContent project={project} headingId="client-preview-title" />
        </div>
      </div>

      <ContactCta />
    </>
  );
}
