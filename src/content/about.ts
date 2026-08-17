// Copy for the About page. The founder-level "why we exist" manifesto
// (see the project memory / outstanding questions) should replace the
// `statement` paragraphs below once it's written.

export const aboutHeader = {
  eyebrow: "About ARCone",
  title: "Design is not decoration. It's business.",
};

export const statement = [
  "ARCone doesn't chase trends. We create them. Founded on the belief that most companies are one honest creative decision away from being impossible to ignore, we work with a small number of clients at a time — by design, not scarcity.",
  "We're not a design studio that does strategy, or a strategy firm that does design. Every engagement starts with the business question first: what has to be true for this company to win. The work follows from there.",
];

export const values: string[] = [
  "Confidence",
  "Precision",
  "Taste",
  "Growth",
  "Craftsmanship",
  "Performance",
  "Luxury",
  "Creativity",
  "Storytelling",
  "Strategy Before Design",
];

export type Stat = { value: string; label: string };

// TODO: replace with real numbers once ARCone has a project/client history
// to report.
export const stats: Stat[] = [
  { value: "40+", label: "Brands built" },
  { value: "12", label: "Countries served" },
  { value: "$180M+", label: "Client revenue influenced" },
  { value: "9", label: "Industry awards" },
];
