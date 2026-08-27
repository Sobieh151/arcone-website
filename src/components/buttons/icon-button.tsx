import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

// Circular, icon-only, 44px — the nav's menu toggle and every carousel
// prev/next arrow (Explore Work, the case-study slider, testimonials)
// share this one component now instead of each hand-rolling its own
// h-10/h-11 button with slightly different border/hover colors. See
// .icon-btn in globals.css for the actual visual treatment.
export function IconButton({
  icon,
  className,
  ...props
}: {
  icon: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      data-cursor-hover
      className={cn("icon-btn grid h-11 w-11 flex-none place-items-center rounded-full", className)}
      {...props}
    >
      {icon}
    </button>
  );
}
