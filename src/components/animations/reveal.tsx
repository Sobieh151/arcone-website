"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { revealTransition, revealViewport } from "@/animations/reveal";

export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "span";
}) {
  const Comp = motion[as];
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={revealViewport}
      transition={{ ...revealTransition, delay }}
      className={className}
    >
      {children}
    </Comp>
  );
}
