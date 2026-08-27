// Copy for sections reused across multiple pages (Process appears on
// Home + About; the Contact CTA closes almost every page). One edit here
// updates every page it appears on — nothing duplicated.

import type { HeroHeadlineLine } from "@/content/home";
import { contactInfo } from "@/content/contact";

// The single primary action every page should drive toward (per the
// site's conversion goal). Nav, hero, contact CTA and the form's submit
// button all read from this one value — change it here, not per-component.
export const primaryCta = { label: "Start a Project", href: "/start" };

export type ProcessStep = {
  n: string;
  title: string;
  text: string;
};

// Step titles (Discover/Design/Build/Scale) are structural, not marketing
// copy, so they stay real; the body text per step is a [[ placeholder ]]
// pending the copy pass.
export const process = {
  eyebrow: "[[ Process eyebrow ]]",
  heading: "[[ Process heading ]]",
  steps: [
    {
      n: "01",
      title: "Discover",
      text: "[[ Discover — one to two sentences ]]",
    },
    {
      n: "02",
      title: "Design",
      text: "[[ Design — one to two sentences ]]",
    },
    {
      n: "03",
      title: "Build",
      text: "[[ Build — one to two sentences ]]",
    },
    {
      n: "04",
      title: "Scale",
      text: "[[ Scale — one to two sentences ]]",
    },
  ] satisfies ProcessStep[],
};

// Closing CTA (components/sections/contact-cta.tsx) — the arc that opens
// in the hero completes here, so `headline` uses the exact same
// {text, accent?} shape as hero.headline (content/home.ts): "arc?" is the
// one word that isn't --paper, same as "ARC." in the hero.
export const contactCta = {
  headline: [
    { text: "Ready to find" },
    { text: "your ", accent: "arc?" },
  ] satisfies HeroHeadlineLine[],
  primary: primaryCta,
  secondary: { label: "Chat on WhatsApp", href: contactInfo.whatsapp },
};
