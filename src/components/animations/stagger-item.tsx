"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { staggerItemVariants } from "@/animations/reveal";

// See stagger-group.tsx for why this is a module-level map rather than
// calling motion.create(Tag) inside the component body.
const tags = {
  div: motion.create("div"),
  li: motion.create("li"),
  span: motion.create("span"),
};

/** A single entry inside <StaggerGroup> — inherits its trigger and timing
 * from the parent's variant propagation, no independent scroll trigger. */
export function StaggerItem({
  children,
  as = "div",
  y = 24,
  className,
}: {
  children: ReactNode;
  as?: keyof typeof tags;
  y?: number;
  className?: string;
}) {
  const MotionTag = tags[as];
  return (
    <MotionTag className={className} variants={staggerItemVariants(y)}>
      {children}
    </MotionTag>
  );
}
