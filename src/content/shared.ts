// Copy for sections reused across multiple pages (the Contact CTA closes
// almost every page). One edit here updates every page it appears on —
// nothing duplicated.

import type { HeroHeadlineLine } from "@/content/home";
import { contactInfo } from "@/content/contact";

// The single primary action every page should drive toward (per the
// site's conversion goal). Nav, hero, contact CTA and the form's submit
// button all read from this one value — change it here, not per-component.
export const primaryCta = { label: "Start a Project", href: "/start" };

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
