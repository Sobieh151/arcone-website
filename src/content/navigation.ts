// Site navigation + social links. Edit here — nothing else references
// hardcoded nav items, so adding/removing/renaming a page is a one-line
// change in this file.

export type NavLink = {
  href: string;
  label: string;
};

// Logo covers "/" — the pill's text links are just these three.
export const mainNav: NavLink[] = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
];

export const footerNav: NavLink[] = [
  { href: "/work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
  { href: "/start", label: "Start a Project" },
];

export type SocialLink = {
  label: string;
  href: string;
};

// Add Behance / LinkedIn / Dribbble / Vimeo / YouTube here once you have
// them — every place that renders socials (footer, JSON-LD sameAs) reads
// from this one array.
export const socialLinks: SocialLink[] = [
  { label: "Instagram", href: "https://instagram.com/arcone.eg" },
];
