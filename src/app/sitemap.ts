import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/seo";

const siteUrl = siteConfig.url;

// Cheap to precompute and doesn't need per-request freshness.
export const dynamic = "force-static";

// No per-project routes: individual case studies are a modal overlay on
// /work now (project-modal.tsx), not their own `/work/[slug]` URL, so
// there's nothing beyond /work itself to list here.
export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/services", "/work", "/about", "/start", "/privacy"].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.8,
  }));
}
