import Link from "next/link";
import type { ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// The one place every CTA's visual treatment is defined. Previously this
// className string was independently re-typed in ~6 places (hero,
// contact CTA, nav, the form's submit button) with small drifting
// inconsistencies (px-7/px-8, py-3.5/py-4, some carrying the .cta-wipe
// hover class and some not) — now there's exactly one source of truth,
// and every button on the site shares it.
//
// Three variants (see globals.css's "Button system" section for the
// actual hover mechanics — each one needs a ::before wipe layer or a
// multi-layer box-shadow that's impractical as Tailwind utility classes):
//   primary — filled --arc, brightens with a gradient wipe on hover.
//   glass   — translucent, blurred backdrop; for CTAs sitting on imagery
//             (the hero) or anywhere a solid fill would fight the scene
//             behind it.
//   ghost   — outline only, --paper fills in on hover.
// `.btn` (shared by all three) is what the hover icon-nudge in globals.css
// targets — one rule, not one per variant, since every variant nudges its
// icon identically.
const buttonStyles = cva(
  "btn group relative inline-flex items-center justify-center gap-[10px] rounded-full text-[12.5px] font-bold uppercase tracking-[0.1em] outline-none transition-[background-color,border-color,box-shadow,color] duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--arc-bright)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "btn-primary text-white",
        glass: "btn-glass",
        ghost: "btn-ghost",
      },
      size: {
        // The nav CTA (sitting inside the nav pill) is the one caller
        // that needs the tighter padding — everything else uses the
        // default. See the nav pill's own spec for why: it has to leave
        // breathing room against the pill's 6px inner padding.
        sm: "px-6 py-[13px]",
        md: "px-7 py-[14px]",
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
  // The icon is wrapped here (not left to each call site) so the hover
  // nudge — 5px right, 5px up, see .btn:hover .btn-icon in globals.css —
  // is automatic for every button regardless of variant, instead of every
  // caller having to remember to add the same transition/translate
  // classes to its own icon element.
  const wrappedIcon = icon && <span className="btn-icon">{icon}</span>;

  if (props.href) {
    return (
      <Link href={props.href} data-cursor-hover className={classes}>
        {children}
        {wrappedIcon}
      </Link>
    );
  }

  return (
    <button
      type={props.type ?? "button"}
      onClick={props.onClick}
      disabled={props.disabled}
      data-cursor-hover
      className={classes}
    >
      {children}
      {wrappedIcon}
    </button>
  );
}
