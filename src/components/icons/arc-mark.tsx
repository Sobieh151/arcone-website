import type { CSSProperties } from "react";

// The ARCone mark: three crossing bars at 60deg intervals, each bar lit as
// two gradient faces for a 3D bevel, with a dark wedge where they overlap
// at the centre. Geometry and gradients are defined ONCE here as an SVG
// <symbol> and referenced everywhere else via <use href="#arc-mark"> —
// the hero (hero-background.tsx), the nav (layout/nav.tsx), and (as its
// own self-contained copy, since favicons are fetched as separate
// documents that can't reference this page's DOM) public/icon.svg and
// public/apple-icon.svg.
//
// <ArcMarkSprite /> mounts the <symbol> itself — render it once, high in
// the tree (see app/layout.tsx), before anything tries to <use> it.
// <ArcMarkGlyph /> is the plain, non-animated glyph for places (like the
// nav) that just need the mark rendered, no glow/sweep/entrance motion.

export const ARC_MARK_VIEWBOX = "0 0 200 200";

// One bar = two trapezoidal faces sharing the vertical spine
// (100,15)-(100,185). BAR_OUTLINE is the outer silhouette of a bar (the
// union of both faces) — used wherever a single flat shape is needed
// instead of the two-face bevel: the hero's glow halo and the sweep's
// clip mask.
const BAR_LEFT = "86,22 100,15 100,185 86,192";
const BAR_RIGHT = "100,15 114,8 114,178 100,185";
export const ARC_MARK_BAR_OUTLINE = "86,22 100,15 114,8 114,178 100,185 86,192";
const CENTER_WEDGE = "100,86 114,79 114,121 100,128 86,121 86,79";

// Draw order: the two rotated side bars first, the dark centre wedge
// where they overlap, then the unrotated bar last so it sits on top.
export const ARC_MARK_ROTATIONS = [60, 120, 0] as const;

function barTransform(deg: number) {
  return deg ? `rotate(${deg} 100 100)` : undefined;
}

function ArcMarkBarFaces({ rotation }: { rotation: number }) {
  return (
    <g transform={barTransform(rotation)}>
      <polygon points={BAR_LEFT} fill="url(#arc-mark-fL)" />
      <polygon points={BAR_RIGHT} fill="url(#arc-mark-fR)" />
    </g>
  );
}

export function ArcMarkSymbol() {
  return (
    <symbol id="arc-mark" viewBox={ARC_MARK_VIEWBOX}>
      <defs>
        <linearGradient id="arc-mark-fL" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFC421" />
          <stop offset="55%" stopColor="#FF8A0A" />
          <stop offset="100%" stopColor="#FF6A00" />
        </linearGradient>
        <linearGradient id="arc-mark-fR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FF6E00" />
          <stop offset="60%" stopColor="#F04A00" />
          <stop offset="100%" stopColor="#D93400" />
        </linearGradient>
      </defs>
      <ArcMarkBarFaces rotation={60} />
      <ArcMarkBarFaces rotation={120} />
      <polygon points={CENTER_WEDGE} fill="#5E1D02" />
      <ArcMarkBarFaces rotation={0} />
    </symbol>
  );
}

// Zero-size, visually hidden — its only job is to make #arc-mark
// resolvable to every <use> on the page. Mount exactly once (app/layout.tsx).
export function ArcMarkSprite() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <ArcMarkSymbol />
    </svg>
  );
}

export function ArcMarkGlyph({
  className,
  style,
  "aria-hidden": ariaHidden,
}: {
  className?: string;
  style?: CSSProperties;
  /** Pass `true` when this glyph sits inside an element that already has
   * its own accessible name (e.g. a labelled button) — otherwise this
   * mark's own "ARCone" name gets announced a second time on top of it. */
  "aria-hidden"?: boolean;
}) {
  return (
    <svg
      viewBox={ARC_MARK_VIEWBOX}
      className={className}
      style={style}
      role={ariaHidden ? undefined : "img"}
      aria-label={ariaHidden ? undefined : "ARCone"}
      aria-hidden={ariaHidden}
    >
      <use href="#arc-mark" />
    </svg>
  );
}
