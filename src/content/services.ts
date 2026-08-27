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
  deliverables: string[];
  angle: number;
  microLabel: string;
};

export const services: Service[] = [
  {
    slug: "digital-marketing",
    name: "Digital Marketing",
    shortName: "Digital Marketing",
    description: "[[ Digital Marketing — one-paragraph description ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    angle: 162,
    microLabel: "Strategy / Growth",
  },
  {
    slug: "media-production",
    name: "Media Production",
    shortName: "Media Production",
    description: "[[ Media Production — one-paragraph description ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    angle: 234,
    microLabel: "Film / Content",
  },
  {
    slug: "branding",
    name: "Branding",
    shortName: "Branding",
    description: "[[ Branding — one-paragraph description ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    angle: 306,
    microLabel: "Identity / Systems",
  },
  {
    slug: "web-app",
    name: "Web & App",
    shortName: "Web & App",
    description: "[[ Web & App — one-paragraph description ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    angle: 90,
    microLabel: "Digital Experience",
  },
  {
    slug: "media-activations",
    name: "Media & Activations",
    shortName: "Media & Activations",
    description: "[[ Media & Activations — one-paragraph description ]]",
    deliverables: [
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
      "[[ Deliverable ]]",
    ],
    angle: 18,
    microLabel: "Experiences",
  },
];
