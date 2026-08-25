// Copy for Home-page-only sections. Shared sections (used on more than
// one page, like Process or the closing Contact CTA) live in shared.ts
// instead, so editing them updates every page at once.
//
// Every string below is a [[ placeholder ]] pending the copy pass — see
// the project plan for the rule. CTA labels/hrefs are the exception:
// they're structural, not prose, so they stay real (from shared.ts).

import { primaryCta } from "@/content/shared";

export const hero = {
  eyebrow: "[[ Hero eyebrow ]]",
  headlineLines: ["[[ Hero headline line one ]]", "[[ Hero headline line two ]]"],
  subhead: "[[ Hero subhead — one to two sentences ]]",
  primaryCta,
  secondaryCta: { label: "View Our Work", href: "/work" },
};

export const workPreview = {
  eyebrow: "[[ Work preview eyebrow ]]",
  heading: "[[ Work preview heading ]]",
  cta: { label: "All Work", href: "/work" },
};

export const aboutTeaser = {
  eyebrow: "[[ About teaser eyebrow ]]",
  heading: "[[ About teaser heading ]]",
  body: "[[ About teaser body — one to two sentences ]]",
  cta: { label: "More About Us", href: "/about" },
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
};

// TODO: replace with real client quotes once available.
export const testimonials: Testimonial[] = [
  { quote: "[[ Client testimonial quote ]]", name: "[[ Client name ]]", role: "[[ Role, Company ]]" },
  { quote: "[[ Client testimonial quote ]]", name: "[[ Client name ]]", role: "[[ Role, Company ]]" },
  { quote: "[[ Client testimonial quote ]]", name: "[[ Client name ]]", role: "[[ Role, Company ]]" },
];
