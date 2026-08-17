import type { MetadataRoute } from "next";
import { siteConfig } from "@/content/seo";

// Ensure this route is treated as static for `output: 'export'` builds.
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
