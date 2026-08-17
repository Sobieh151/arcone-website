// Site navigation + social links. Edit here — nothing else references
// hardcoded nav items, so adding/removing/renaming a page is a one-line
// change in this file.

export type NavLink = {
  href: string;
  label: string;
};

export const mainNav: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
];

export const footerNav: NavLink[] = [
  { href: "/services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Journal" },
  { href: "/contact", label: "Contact" },
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
