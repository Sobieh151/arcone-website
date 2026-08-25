import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/seo";

// Cheap to precompute and doesn't need per-request freshness.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
