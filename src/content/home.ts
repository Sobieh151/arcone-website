// Copy for Home-page-only sections. Shared sections (used on more than
// one page, like Process or the closing Contact CTA) live in shared.ts
// instead, so editing them updates every page at once.
//
// Every string below is a [[ placeholder ]] pending the copy pass — see
// the project plan for the rule. CTA labels/hrefs are the exception:
// they're structural, not prose, so they stay real (from shared.ts).

import { primaryCta } from "@/content/shared";

export type HeroHeadlineLine = { text: string; accent?: string };

// Hero copy (components/hero/hero.tsx). Eyebrow, headline and CTA labels
// are the brief's literal, final copy — not placeholders like the rest of
// the site's page-shell prose. `accent` on a headline line renders in
// --arc instead of --paper (see the hero spec: "ARC." is the one word
// that isn't --paper). The subhead's actual wording wasn't specified
// (only its width: ~28ch), so it stays a placeholder like everything else
// on the site pending the real copy pass.
export const hero = {
  eyebrow: "CREATIVE AGENCY",
  headline: [
    { text: "WHERE" },
    { text: "BRANDS" },
    { text: "FIND THEIR" },
    { text: "FIRST ", accent: "ARC." },
  ] satisfies HeroHeadlineLine[],
  subhead: "[[ Hero subhead — one short line, ~28 characters wide ]]",
  // primaryCta already reads "Start a Project" / "/start" from shared.ts.
  primaryCta,
  secondaryCta: { label: "Explore Our Work", href: "/work" },
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
