import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { Reveal } from "@/components/animations/reveal";
import { ContactCta } from "@/components/sections/contact-cta";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const index = blogPosts.findIndex((p) => p.slug === slug);
  const next = blogPosts[(index + 1) % blogPosts.length];

  return (
    <>
      <article className="relative isolate overflow-hidden pb-24 pt-40 sm:pt-48">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] opacity-30 blur-[110px]"
          style={{
            background:
              "radial-gradient(circle at 50% 10%, rgba(232,80,2,0.5), transparent 65%)",
          }}
        />
        <div className="mx-auto max-w-2xl px-6 sm:px-10">
          <Reveal>
            <Link
              href="/blog"
              data-cursor-hover
              className="inline-flex items-center gap-2 text-sm text-gray-light transition-colors hover:text-white"
            >
              <ArrowLeft size={15} />
              The Journal
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="mt-10 flex items-center gap-3 text-xs uppercase tracking-widest text-gray-medium">
              <span className="text-orange-highlight">{post.category}</span>
              <span>&middot;</span>
              <span>{formatDate(post.date)}</span>
              <span>&middot;</span>
              <span>{post.readTime} read</span>
            </div>
          </Reveal>

          <Reveal delay={0.14}>
            <h1 className="mt-6 text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              {post.title}
            </h1>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mt-6 text-balance text-xl leading-relaxed text-gray-light">
              {post.excerpt}
            </p>
          </Reveal>

          <div className="mt-16 flex flex-col gap-12">
            {post.body.map((section, i) => (
              <Reveal key={section.heading ?? i} delay={0.05 * i}>
                {section.heading && (
                  <h2 className="text-2xl font-semibold tracking-tight text-white">
                    {section.heading}
                  </h2>
                )}
                <div className={section.heading ? "mt-4 flex flex-col gap-4" : "flex flex-col gap-4"}>
                  {section.paragraphs.map((p, pi) => (
                    <p key={pi} className="text-lg leading-relaxed text-gray-light">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </article>

      <section className="border-t border-border">
        <Link
          href={`/blog/${next.slug}`}
          data-cursor-hover
          className="group flex items-center justify-between px-6 py-16 sm:px-10"
        >
          <div>
            <span className="text-xs uppercase tracking-widest text-gray-medium">
              Next Up
            </span>
            <h3 className="mt-3 max-w-xl text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-orange-highlight sm:text-4xl">
              {next.title}
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
