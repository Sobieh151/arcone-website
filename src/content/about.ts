// Copy for the About page. Values/stats below are still [[ placeholders ]]
// pending the copy pass — see the project plan for the rule — but the
// header and statement are real, confirmed copy (the editorial headline
// direction, approved in the "About / Services Transition Direction" brief).

export const aboutHeader = {
  eyebrow: "About ARCone",
  // Split for the layered hero (components/about/about-hero.tsx): `above`
  // sits above the centerpiece image, `below` sits below/over it, with
  // the image overlapping into both — see that component for how. Each
  // is its own short line (same convention as content/home.ts's hero
  // headline) rather than one long wrapped line, so it stays legible at
  // the hero's large clamp() sizes down to mobile widths. `full` is the
  // complete sentence, used for the one real, accessible <h1>.
  title: {
    above: ["WE MAKE", "BRANDS"],
    below: ["IMPOSSIBLE", "TO IGNORE."],
    full: "We make brands impossible to ignore.",
  },
};

export const statement = [
  "ARCone is built for brands that refuse to blend in. We turn strategy, design, and bold ideas into work that earns attention — and knows what to do with it.",
];

export const values: string[] = [
  "[[ Value ]]",
  "[[ Value ]]",
  "[[ Value ]]",
  "[[ Value ]]",
  "[[ Value ]]",
  "[[ Value ]]",
  "[[ Value ]]",
  "[[ Value ]]",
  "[[ Value ]]",
  "[[ Value ]]",
];

export type Stat = { value: string; label: string };

// TODO: replace with real numbers once ARCone has a project/client history
// to report.
export const stats: Stat[] = [
  { value: "[[ ## ]]", label: "[[ Stat label ]]" },
  { value: "[[ ## ]]", label: "[[ Stat label ]]" },
  { value: "[[ ## ]]", label: "[[ Stat label ]]" },
  { value: "[[ ## ]]", label: "[[ Stat label ]]" },
];
