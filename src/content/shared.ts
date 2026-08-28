// Copy for sections reused across multiple pages (the Contact CTA closes
// almost every page). One edit here updates every page it appears on —
// nothing duplicated.

import type { HeroHeadlineLine } from "@/content/home";

// The single primary action every page should drive toward (per the
// site's conversion goal). The hero and the form's submit button read
// from this one value directly; the closing CTA below reuses its href
// under a different label — change the destination here, not per-component.
export const primaryCta = { label: "Start a Project", href: "/start" };

// Closing CTA (components/sections/contact-cta.tsx). One button — "Book a
// Meeting," same /start destination as the hero's "Start a Project," just
// framed as a close rather than an opener. WhatsApp used to sit here as a
// second button; it stays in the footer instead now, so it isn't
// competing with the one CTA this section actually wants you to take.
// Explicit annotation, not `satisfies` — neither line here actually
// uses `accent`, and without at least one element that does,
// `satisfies` infers the narrower `{ text: string }[]` rather than the
// full optional-`accent` shape, which then breaks `line.accent` in
// contact-cta.tsx's render loop.
const contactCtaHeadline: HeroHeadlineLine[] = [{ text: "Got something" }, { text: "big in mind?" }];

export const contactCta = {
  headline: contactCtaHeadline,
  supporting: "Let's make it real.",
  primary: { label: "Book a Meeting", href: primaryCta.href },
};
