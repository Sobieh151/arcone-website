// Services offered. Adding a new service is just a new object here — it
// automatically appears in the homepage teaser and the /services page.
//
// Restructured around ARCone's five capabilities. Names are final; every
// description/deliverable below is a [[ placeholder ]] for the copy pass —
// see the project plan for the placeholder-copy rule.

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  deliverables: string[];
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
  },
];
