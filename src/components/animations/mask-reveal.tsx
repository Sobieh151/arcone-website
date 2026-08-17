"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { maskRevealTransition, maskRevealVariants } from "@/animations/mask";
import { revealViewport } from "@/animations/reveal";

// Pre-created once at module scope — see stagger-group.tsx for why (motion
// .create(Tag) inside the component body would mint a new component type,
// and thus a fresh IntersectionObserver, on every render).
const tags = {
  h1: motion.create("h1"),
  h2: motion.create("h2"),
  h3: motion.create("h3"),
  p: motion.create("p"),
  span: motion.create("span"),
  div: motion.create("div"),
};

// A no-op state carrier: the outer element doesn't animate itself, it just
// needs to be a motion component so the inner span can inherit its
// hidden/visible state via variant propagation (see the note below on why
// the trigger can't live on the span directly).
const containerVariants = { hidden: {}, visible: {} };

/**
 * Slides content up out of a clipped box, instead of the fade+translateY
 * every other reveal on the site uses. Reserved for headlines — the
 * moments that should read as a deliberate entrance, not a generic fade.
 *
 * The scroll trigger (whileInView) has to live on this OUTER, untransformed
 * element, not on the inner masked span. IntersectionObserver accounts for
 * ancestor clipping — while the span sits translated down at y:110%
 * (clipped away by this wrapper's overflow:hidden), it never reports as
 * intersecting, so a trigger placed on the span itself deadlocks: revealing
 * requires intersection, but the pre-reveal position is geometrically
 * unobservable. Watching the stable outer box and propagating the state
 * down avoids that entirely.
 */
export function MaskReveal({
  children,
  as = "span",
  delay = 0,
  className,
}: {
  children: ReactNode;
  as?: keyof typeof tags;
  delay?: number;
  className?: string;
}) {
  const Tag = tags[as];
  return (
    <Tag
      className={className}
      style={{ display: "block", overflow: "hidden" }}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      <motion.span
        variants={maskRevealVariants}
        transition={{ ...maskRevealTransition, delay }}
        style={{ display: "block" }}
      >
        {children}
      </motion.span>
    </Tag>
  );
}
