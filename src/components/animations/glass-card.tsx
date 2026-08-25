"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useTilt } from "@/lib/use-tilt";

/**
 * Frosted-glass tile that tilts toward the cursor and tracks it with a
 * soft radial shine (`.glass` / `.glass-shine` in globals.css, driven by
 * useTilt). Bring your own border-radius/padding via `className` — this
 * only supplies the glass surface + interaction.
 *
 * For a non-`<div>` host (e.g. next/link's `<a>`), call `useTilt` directly
 * against `motion.create(Link)` instead — see work-preview.tsx and
 * services-teaser.tsx.
 */
export function GlassCard({
  children,
  className,
  tilt = true,
}: {
  children: ReactNode;
  className?: string;
  tilt?: boolean;
}) {
  const { ref, onMouseMove, onMouseLeave, style } = useTilt<HTMLDivElement>({ tilt });

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
      className={cn("glass glass-shine relative", className)}
    >
      {children}
    </motion.div>
  );
}
