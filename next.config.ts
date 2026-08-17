import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Don't advertise the framework in response headers.
  poweredByHeader: false,
  // Export a fully static site (replaces deprecated `next export`).
  // See: https://nextjs.org/docs/app/building-your-application/deploying/static-exports
  output: "export",

  images: {
    // No remote images yet — once real photography/CMS-hosted assets
    // arrive, list their hostnames here (e.g. a CMS's asset domain) so
    // next/image can optimize them. Local files under public/ never
    // need an entry.
    remotePatterns: [],
  },
};

export default nextConfig;
