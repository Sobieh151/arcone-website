import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  // No `output: "export"`: /work/[slug]-style dynamic routes (and /start's
  // Formspree-backed form) run fine under static export too, but the site
  // now targets a real Next.js server instead of a static host.

  images: {
    // No remote images yet — once real photography/CMS-hosted assets
    // arrive, list their hostnames here (e.g. a CMS's asset domain) so
    // next/image can optimize them. Local files under public/ never
    // need an entry.
    remotePatterns: [],
  },
};

export default nextConfig;
