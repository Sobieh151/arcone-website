import Link from "next/link";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// The one place every CTA's visual treatment is defined. Previously this
// className string was independently re-typed in ~6 places (hero,
// contact CTA, nav, the form's submit button) with small drifting
// inconsistencies (px-7/px-8, py-3.5/py-4) — now there's exactly one
// source of truth, and every button on the site shares it.
const buttonStyles = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-colors disabled:pointer-events-none disabled:opacity-60",
  {
    variants: {
      variant: {
        primary: "bg-orange text-black hover:bg-orange-highlight",
        outline:
          "border border-orange text-orange-highlight hover:bg-orange hover:text-black",
        secondary: "border border-border text-white hover:border-white/30",
      },
      size: {
        sm: "px-5 py-2.5 text-sm",
        md: "px-7 py-3.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

type ButtonBaseProps = VariantProps<typeof buttonStyles> & {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
};

type ButtonAsLink = ButtonBaseProps & {
  href: string;
  onClick?: never;
  type?: never;
  disabled?: never;
};

type ButtonAsButton = ButtonBaseProps & {
  href?: undefined;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
};

export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { children, icon, variant, size, className } = props;
  const classes = cn(buttonStyles({ variant, size }), className);

  if (props.href) {
    return (
      <Link href={props.href} data-cursor-hover className={cn(classes, "group")}>
        {children}
        {icon}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      data-cursor-hover
      className={cn(classes, "group")}
    >
      {children}
      {icon}
    </button>
  );
}
