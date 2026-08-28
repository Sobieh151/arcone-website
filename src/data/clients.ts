// Real clients, shown as a grid on their service page(s) and a preview
// page of their actual work. Unlike data/projects.ts (which still holds
// fictional placeholder case studies alongside a few real, unconfirmed-
// copy ones), this file ships EMPTY on purpose and stays that way until
// there's a real, confirmed client to add — the four existing
// placeholder case studies do not belong here.
//
// Adding a client is one object here plus a folder of real images —
// nothing else needs to change; both /services/[slug] (the client grid)
// and /services/[slug]/[clientSlug] (the preview page) read straight
// from this array, and generateStaticParams for the preview route is
// built from it too.
//
// Where the image files go: see /public/clients/README.md. Shape:
//
//   {
//     slug: "acme",
//     name: "Acme Co.",
//     intro: "One or two sentences of context for someone who's never heard of them.",
//     services: ["branding", "web-app"], // content/services.ts slugs — a
//                                        // client can appear under more
//                                        // than one department
//     cover: "/clients/acme/cover.jpg",
//     images: [
//       { src: "/clients/acme/01.jpg", alt: "Acme — brand identity, primary lockup" },
//       { src: "/clients/acme/02.jpg", alt: "Acme — packaging system" },
//     ],
//   }

export type Client = {
  slug: string;
  name: string;
  intro: string;
  services: string[];
  cover: string;
  images: { src: string; alt: string }[];
};

export const clients: Client[] = [];
