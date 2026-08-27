import type { ComponentType, SVGProps } from "react";

// One icon per capability (content/services.ts), replacing the ARCone
// mark that used to sit in every orbit node and every /services/[slug]
// header — five identical marks told the user nothing about which
// capability they were looking at.
//
// All five share one visual system: 24x24 viewBox, stroke-only (fill
// none, stroke currentColor), stroke-width 1.5, round caps/joins.
// currentColor is what lets the same glyph go --mute at rest and --arc
// on hover/focus just by the parent setting `color` (see
// .capabilities-node-icon-mark in globals.css) — no per-state icon swap.
// Geometric and reduced on purpose: at their smallest render size (21px
// inside a 48px orbit node) any detail under ~2px of separation
// disappears, so there's nothing finer than that here.

type IconProps = SVGProps<SVGSVGElement>;

const baseProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
} as const;

/** Digital Marketing — an upward trend line across a baseline, small
 * arrowhead at its high end. */
export function DigitalMarketingIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <line x1="3" y1="19" x2="21" y2="19" />
      <polyline points="4 16 9 12.5 13 14.5 20 6" />
      <polyline points="14 6 20 6 20 12" />
    </svg>
  );
}

/** Media Production — a camera aperture: a circle with three angled
 * blades. */
export function MediaProductionIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="9" />
      <polyline points="12 9 13.7 6.8 16.3 5.9" />
      <polyline points="14.6 13.5 15.7 16.1 15.2 18.8" />
      <polyline points="9.4 13.5 6.6 13.1 4.5 11.4" />
    </svg>
  );
}

/** Branding — two overlapping diamonds, one offset, suggesting an
 * identity system. */
export function BrandingIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <polygon points="9 5 15 11 9 17 3 11" />
      <polygon points="15 7 21 13 15 19 9 13" />
    </svg>
  );
}

/** Web & App — a browser window outline with a small device rectangle
 * overlapping its lower right corner. */
export function WebAppIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <rect x="3" y="4" width="14" height="11" rx="1.5" />
      <line x1="3" y1="7.5" x2="17" y2="7.5" />
      <rect x="13" y="11" width="8" height="11" rx="1.5" />
    </svg>
  );
}

/** Media & Activations — a centre dot with two arcs radiating from it. */
export function MediaActivationsIcon(props: IconProps) {
  return (
    <svg {...baseProps} {...props}>
      <circle cx="12" cy="12" r="1.4" />
      <path d="M17.36 7.5 A7 7 0 0 1 17.36 16.5" />
      <path d="M6.64 16.5 A7 7 0 0 1 6.64 7.5" />
    </svg>
  );
}

// Keyed by Service["slug"] (content/services.ts) — look up a capability's
// icon with `capabilityIcons[service.slug]` instead of a parallel
// switch/if-chain wherever a node needs to render one.
export const capabilityIcons: Record<string, ComponentType<IconProps>> = {
  "digital-marketing": DigitalMarketingIcon,
  "media-production": MediaProductionIcon,
  branding: BrandingIcon,
  "web-app": WebAppIcon,
  "media-activations": MediaActivationsIcon,
};
