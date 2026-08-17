// Services offered. Adding a new service is just a new object here — it
// automatically appears in the homepage teaser and the /services page.

export type Service = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  deliverables: string[];
};

export const services: Service[] = [
  {
    slug: "brand-strategy-identity",
    name: "Brand Strategy & Identity",
    shortName: "Brand",
    description:
      "Positioning, naming and visual identity systems built on a single idea, not a mood board. The work that decides what the company stands for before anyone designs a logo.",
    deliverables: [
      "Brand strategy & positioning",
      "Naming",
      "Visual identity systems",
      "Brand guidelines",
    ],
  },
  {
    slug: "website-product-design",
    name: "Website & Product Design",
    shortName: "Website & Product",
    description:
      "Marketing sites and product interfaces designed to convert, not just impress. Built and shipped, not just handed off as files.",
    deliverables: [
      "Marketing websites",
      "Product & UI/UX design",
      "Design systems",
      "Web development",
    ],
  },
  {
    slug: "social-performance-creative",
    name: "Social & Performance Creative",
    shortName: "Social & Performance",
    description:
      "Ongoing content and campaign creative for brands that need to show up consistently — built to perform, not just to look good in a feed.",
    deliverables: [
      "Social content production",
      "Campaign creative",
      "Performance ad creative",
      "Content systems",
    ],
  },
];
