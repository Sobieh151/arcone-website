// Services offered. Adding a new service is just a new object here — it
// automatically appears in the homepage teaser and the /services page.
//
// Restructured around ARCone's five capabilities. Names are final; every
// description/deliverable below is a [[ placeholder ]] for the copy pass —
// see the project plan for the placeholder-copy rule.
//
// Array order here is display order (services-list.tsx, the mobile
// CapabilitiesList) — it doesn't affect the orbit, which positions each
// node independently via its own `angle` regardless of array order.
//
// `angle` and `microLabel` feed the homepage orbit layout
// (components/services/services-teaser.tsx): `angle` places the node on
// the orbit ellipse (0deg = right, sweeping clockwise since SVG's y-axis
// grows downward — 90deg lands at bottom-centre, which is why Web & App
// anchors there), `microLabel` is the short line under each node's name.

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  // One-line tagline for the /services/[slug] header — shorter and more
  // declarative than `description` (the paragraph below it).
  positioning: string;
  deliverables: string[];
  // "How we work" on /services/[slug] — 3-4 numbered steps.
  process: string[];
  angle: number;
  microLabel: string;
};

export const services: Service[] = [
  {
    slug: "branding",
    name: "Branding",
    shortName: "Branding",
    description: "[[ Branding — one-paragraph description ]]",
    positioning: "[[ Branding — one-line positioning statement ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    process: [
      "[[ Branding — process step 1 ]]",
      "[[ Branding — process step 2 ]]",
      "[[ Branding — process step 3 ]]",
      "[[ Branding — process step 4 ]]",
    ],
    angle: 306,
    microLabel: "Identity / Systems",
  },
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    shortName: "Digital Marketing",
    description: "[[ Digital Marketing — one-paragraph description ]]",
    positioning: "[[ Digital Marketing — one-line positioning statement ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    process: [
      "[[ Digital Marketing — process step 1 ]]",
      "[[ Digital Marketing — process step 2 ]]",
      "[[ Digital Marketing — process step 3 ]]",
      "[[ Digital Marketing — process step 4 ]]",
    ],
    angle: 162,
    microLabel: "Strategy / Growth",
  },
  {
    slug: "media-production",
    name: "Media Production",
    shortName: "Media Production",
    description: "[[ Media Production — one-paragraph description ]]",
    positioning: "[[ Media Production — one-line positioning statement ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    process: [
      "[[ Media Production — process step 1 ]]",
      "[[ Media Production — process step 2 ]]",
      "[[ Media Production — process step 3 ]]",
      "[[ Media Production — process step 4 ]]",
    ],
    angle: 234,
    microLabel: "Film / Content",
  },
  {
    // Slug kept as media-activations (not renamed to match the new
    // display name) — it's already built as a static route
    // (/services/media-activations) and linked from Trusted By-adjacent
    // places; renaming it would break those URLs for a display-only
    // change. Only `name`/`shortName` change.
    slug: "media-activations",
    name: "Activations",
    shortName: "Activations",
    description: "[[ Activations — one-paragraph description ]]",
    positioning: "[[ Activations — one-line positioning statement ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    process: [
      "[[ Activations — process step 1 ]]",
      "[[ Activations — process step 2 ]]",
      "[[ Activations — process step 3 ]]",
      "[[ Activations — process step 4 ]]",
    ],
    angle: 18,
    microLabel: "Experiences",
  },
  {
    slug: "web-app",
    name: "Web & App",
    shortName: "Web & App",
    description: "[[ Web & App — one-paragraph description ]]",
    positioning: "[[ Web & App — one-line positioning statement ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    process: [
      "[[ Web & App — process step 1 ]]",
      "[[ Web & App — process step 2 ]]",
      "[[ Web & App — process step 3 ]]",
      "[[ Web & App — process step 4 ]]",
    ],
    angle: 90,
    microLabel: "Digital Experience",
  },
];
