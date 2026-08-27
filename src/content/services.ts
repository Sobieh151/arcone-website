// Services offered. Adding a new service is just a new object here — it
// automatically appears in the homepage teaser and the /services page.
//
// Restructured around ARCone's five capabilities. Names are final; every
// description/deliverable below is a [[ placeholder ]] for the copy pass —
// see the project plan for the placeholder-copy rule.
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
  {
    slug: "media-activations",
    name: "Media & Activations",
    shortName: "Media & Activations",
    description: "[[ Media & Activations — one-paragraph description ]]",
    positioning: "[[ Media & Activations — one-line positioning statement ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    process: [
      "[[ Media & Activations — process step 1 ]]",
      "[[ Media & Activations — process step 2 ]]",
      "[[ Media & Activations — process step 3 ]]",
      "[[ Media & Activations — process step 4 ]]",
    ],
    angle: 18,
    microLabel: "Experiences",
  },
];
