"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerContainer, revealViewport } from "@/animations/reveal";

// Pre-created once at module scope, not per-render: motion.create(Tag)
// inside the component body would mint a new component type on every
// render, resetting state and breaking the reveal each time a parent
// re-renders.
const tags = {
  div: motion.create("div"),
  ul: motion.create("ul"),
  section: motion.create("section"),
};

/**
 * Wrap a grid/list in this, use <StaggerItem> for each entry. The group
 * triggers once on scroll and cascades its children in sequence — for
 * places where every item currently gets an independently-computed
 * `delay={i * 0.06}` (Values, Services, Work lists), which
 * produces the same visual but as N copies of identical logic instead of
 * one orchestrated group.
 */
export function StaggerGroup({
  children,
  as = "div",
  className,
  staggerChildren,
}: {
  children: ReactNode;
  as?: keyof typeof tags;
  className?: string;
  staggerChildren?: number;
}) {
  const MotionTag = tags[as];
  return (
    <MotionTag
      className={className}
      variants={staggerContainer(staggerChildren)}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </MotionTag>
  );
}
