// Copy for Home-page-only sections. Shared sections (used on more than
// one page, like Process or the closing Contact CTA) live in shared.ts
// instead, so editing them updates every page at once.
//
// Every string below is a [[ placeholder ]] pending the copy pass — see
// the project plan for the rule. CTA labels/hrefs are the exception:
// they're structural, not prose, so they stay real (from shared.ts).

import { primaryCta } from "@/content/shared";

export type HeroHeadlineLine = { text: string; accent?: string };

// Hero copy (components/hero/hero.tsx). One CTA only — no secondaryCta
// any more, per the site's "three CTAs, total, sitewide" rule (this one
// is "Start a Project"). `accent` on a headline line renders in --arc
// instead of --paper (see the hero spec: one word per headline gets it,
// never the whole line).
export const hero = {
  eyebrow: "CREATIVE AGENCY",
  headline: [
    { text: "WE MAKE" },
    { text: "BRANDS" },
    { text: "HARD TO ", accent: "FORGET." },
  ] satisfies HeroHeadlineLine[],
  subhead: "We build brands, campaigns and digital work that get attention, drive growth and stick.",
  // primaryCta already reads "Start a Project" / "/start" from shared.ts.
  primaryCta,
};

export type AboutTeaser = {
  kicker: string;
  title: string;
  statement: string;
  location: string;
};

export const aboutTeaser: AboutTeaser = {
  kicker: "ARCone",
  title: "Big Ideas. Real Movement.",
  statement: "We turn strategy into brands people notice, talk about and remember.",
  location: "Cairo → MENA",
};

export type ResultStat = {
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  durationMs: number;
};

// PLACEHOLDER — these figures are not sourced. Replace with real campaign
// data before launch. Do not publish invented performance numbers. No
// on-screen notice for this any more (a client-facing page isn't the
// place for it) — this comment is the only remaining warning, so don't
// remove it along with the numbers eventually being real.
//
// Render order is left to right. durationMs is also what makes the count
// animation land in that same left-to-right sequence (see
// useSequentialCountUp in real-results.tsx): every stat starts counting on
// the same frame, but the shortest duration (rightmost, Campaigns) settles
// first and the longest (leftmost, ROAS) settles last.
export const resultsStats: ResultStat[] = [
  { value: 240, decimals: 0, suffix: "%", label: "ROAS", durationMs: 2100 },
  { value: 12.4, decimals: 1, suffix: "M", label: "Reached", durationMs: 1700 },
  { value: 68, decimals: 0, suffix: "%", label: "More Qualified Leads", durationMs: 1300 },
  { value: 120, decimals: 0, suffix: "+", label: "Campaigns", durationMs: 900 },
];


export type TrustedByClient = {
  name: string;
  slug: string;
  /** Optional until the text-only trusted-by row gets approved logo assets. */
  src?: string;
};

// "Trusted By" (the Hero's own footer — components/sections/trusted-by.tsx).
// This used to hold a list of real but unconfirmed company names (SERA,
// UBR, SERAC, TMG, SENSI, NILE, CITY EDGE, VOX, ELSEWEDY, ORASCOM), then
// briefly pointed at the site's fictional placeholder case studies in
// data/projects.ts instead. Neither is acceptable here: naming an
// unconfirmed client is a legal/reputational risk, and a "client" logo
// that's actually a made-up case study is fake either way — this section
// makes an explicit claim of a real client relationship, so it must only
// ever show clients who are actually confirmed.
//
// Ships empty on purpose. Add a real, confirmed client here only once
// you have their name and an approved logo file:
//   { name: "Acme Co.", slug: "acme", src: "/logos/acme.svg" }
// Trusted By hides itself entirely while this is empty rather than
// rendering any placeholder — an empty strip beats a fake logo.
// Emptied again — SERA/UBR/SERAC/TMG/SENSI/NILE/CITY EDGE/VOX/ELSEWEDY/
// ORASCOM came from a design mockup, not a confirmed client list, and
// were deliberately removed once already for exactly that reason before
// finding their way back in. They stay out until there's an actual
// confirmed roster — see the comment above for what to add and when.
export const trustedByClients: TrustedByClient[] = [];
