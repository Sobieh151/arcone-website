// Copy for sections reused across multiple pages (Process appears on
// Home + About; the Contact CTA closes almost every page). One edit here
// updates every page it appears on — nothing duplicated.

// The single primary action every page should drive toward (per the
// site's conversion goal). Nav, hero, contact CTA and the form's submit
// button all read from this one value — change it here, not per-component.
export const primaryCta = { label: "Request a Proposal", href: "/contact" };

export type ProcessStep = {
  n: string;
  title: string;
  text: string;
};

export const process = {
  eyebrow: "How We Work",
  heading: "Four stages. No shortcuts.",
  steps: [
    {
      n: "01",
      title: "Discover",
      text: "We start with the business, not the brief. Positioning, audience, and the real reason you're losing deals today.",
    },
    {
      n: "02",
      title: "Design",
      text: "Strategy becomes form. Identity, interface, and message built around a single idea, executed without compromise.",
    },
    {
      n: "03",
      title: "Build",
      text: "Production at a craftsmanship level most agencies skip. Every pixel, every line of copy, every millisecond of motion.",
    },
    {
      n: "04",
      title: "Scale",
      text: "Launch is the beginning. We stay close, measure what matters, and compound what's working.",
    },
  ] satisfies ProcessStep[],
};

export const contactCta = {
  heading: "Let's Build Something Worth Remembering.",
  body: "Tell us where the business is today, and where it needs to be. We'll take it from there.",
  cta: primaryCta,
};
