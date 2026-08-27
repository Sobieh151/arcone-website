// Copy for Home-page-only sections. Shared sections (used on more than
// one page, like Process or the closing Contact CTA) live in shared.ts
// instead, so editing them updates every page at once.
//
// Every string below is a [[ placeholder ]] pending the copy pass — see
// the project plan for the rule. CTA labels/hrefs are the exception:
// they're structural, not prose, so they stay real (from shared.ts).

import { primaryCta } from "@/content/shared";

export type HeroHeadlineLine = { text: string; accent?: string };

// Hero copy (components/hero/hero.tsx). Eyebrow, headline, subhead and CTA
// labels are the brief's literal, final copy — not placeholders like the
// rest of the site's page-shell prose. `accent` on a headline line renders
// in --arc instead of --paper (see the hero spec: "ARC." is the one word
// that isn't --paper).
export const hero = {
  eyebrow: "CREATIVE AGENCY",
  headline: [
    { text: "WHERE" },
    { text: "BRANDS" },
    { text: "FIND THEIR" },
    { text: "FIRST ", accent: "ARC." },
  ] satisfies HeroHeadlineLine[],
  subhead:
    "We build brands, campaigns and digital experiences that create impact — and drive real results.",
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

export type ResultStat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  durationMs: number;
};

// PLACEHOLDER — these figures are not sourced. Replace with real campaign
// data before launch. Do not publish invented performance numbers.
// Flip this to `false` the moment resultsStats below holds real numbers —
// components/sections/real-results.tsx renders its "placeholder figures"
// notice off this one flag and nothing else.
export const resultsStatsArePlaceholder = true;

// Render order is left to right. durationMs is also what makes the count
// animation land in that same left-to-right sequence (see
// useSequentialCountUp in real-results.tsx): every stat starts counting on
// the same frame, but the shortest duration (rightmost, Campaigns) settles
// first and the longest (leftmost, ROAS) settles last.
export const resultsStats: ResultStat[] = [
  { value: 240, decimals: 0, suffix: "%", label: "Average ROAS", durationMs: 2100 },
  { value: 12.4, decimals: 1, suffix: "M", label: "Total Reach", durationMs: 1700 },
  { value: 68, decimals: 0, suffix: "%", label: "Lead Growth", durationMs: 1300 },
  { value: 120, decimals: 0, suffix: "+", label: "Campaigns Launched", durationMs: 900 },
];

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
