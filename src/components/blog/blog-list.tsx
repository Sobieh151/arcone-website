import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { blogPosts } from "@/data/blog-posts";
import { StaggerGroup } from "@/components/animations/stagger-group";
import { StaggerItem } from "@/components/animations/stagger-item";

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function BlogList() {
  return (
    <div className="mx-auto max-w-5xl px-6 pb-32 sm:px-10">
      <StaggerGroup as="div" className="flex flex-col" staggerChildren={0.05}>
        {blogPosts.map((post) => (
          <StaggerItem key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              data-cursor-hover
              className="group flex flex-col gap-4 border-t border-border py-10 last:border-b sm:flex-row sm:items-center sm:justify-between sm:gap-10"
            >
              <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-medium sm:w-40 sm:shrink-0">
                <span className="text-orange-highlight">{post.category}</span>
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-semibold tracking-tight text-white transition-colors group-hover:text-orange-highlight sm:text-3xl">
                  {post.title}
                </h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-gray-light">
                  {post.excerpt}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-6">
                <div className="text-right text-xs text-gray-medium">
                  <div>{formatDate(post.date)}</div>
                  <div className="mt-1">{post.readTime} read</div>
                </div>
                <ArrowUpRight
                  size={18}
                  className="shrink-0 text-white opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100"
                />
              </div>
            </Link>
          </StaggerItem>
        ))}
      </StaggerGroup>
    </div>
  );
}
