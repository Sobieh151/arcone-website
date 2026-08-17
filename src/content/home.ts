// Copy for Home-page-only sections. Shared sections (used on more than
// one page, like Process or the closing Contact CTA) live in shared.ts
// instead, so editing them updates every page at once.

import { primaryCta } from "@/content/shared";

export const hero = {
  eyebrow: "Creative Agency",
  headlineLines: ["We Build Brands", "People Remember."],
  subhead:
    "Beautiful work gets attention. Strategic work builds businesses. We create both.",
  primaryCta,
  secondaryCta: { label: "View Our Work", href: "/work" },
};

export const workPreview = {
  eyebrow: "Selected Work",
  heading: "Brands we've made impossible to ignore.",
  cta: { label: "All Work", href: "/work" },
};

export const aboutTeaser = {
  eyebrow: "About ARCone",
  heading: "We don't make things look better. We make businesses impossible to ignore.",
  body: "ARCone is a creative partner for ambitious brands that understand design is more than aesthetics. It's leverage.",
  cta: { label: "More About Us", href: "/about" },
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// TODO: replace with real client quotes once available — these are
// placeholders that match the placeholder case studies in data/projects.ts.
export const testimonials: Testimonial[] = [
  {
    quote:
      "ARCone didn't just redesign our site. They rebuilt how the market perceives us. Capital that used to walk now stays for the pitch.",
    name: "Daniel Reyes",
    role: "Managing Partner, North Atlas",
  },
  {
    quote:
      "Every other agency wanted to talk about aesthetics. ARCone wanted to talk about our funnel. That's the difference.",
    name: "Priya Nair",
    role: "CEO, Fielder",
  },
  {
    quote:
      "We launched into the noisiest category imaginable and looked like we'd been the category leader for a decade.",
    name: "Sofia Marchetti",
    role: "Founder, Marrow",
  },
];
