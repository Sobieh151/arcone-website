import Link from "next/link";
import { Fragment } from "react";
import { trustedByClients } from "@/content/home";
import { ClientIcon } from "@/components/portfolio/client-icon";

// One lap's worth of clients. Rendered twice inside .marquee-track (see
// globals.css) so the container can translate exactly -50% of its own
// width — precisely one lap — and loop with no seam: the second copy is
// already sitting where the first one started. `hidden` marks the
// duplicate `aria-hidden` (and every link in it non-tabbable) so
// keyboard/screen-reader users only ever encounter the client list once.
function ClientRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-10" aria-hidden={hidden || undefined}>
      {trustedByClients.map((client) => (
        <Fragment key={client.slug}>
          <Link
            href={`/work/${client.slug}`}
            data-cursor-hover
            aria-label={`View ${client.name}'s work`}
            tabIndex={hidden ? -1 : undefined}
            className="trusted-client shrink-0"
          >
            <ClientIcon client={client} />
          </Link>
        </Fragment>
      ))}
    </div>
  );
}

/**
 * The bottom edge of the Hero, not a standalone section — see hero.tsx,
 * which renders this as the last thing inside its own <section> rather
 * than page.tsx rendering it as a sibling. Every client is icon-only
 * (monochrome until hovered/focused/tapped — .trusted-client-icon in
 * globals.css) and links straight to its /work/[slug] case-study page.
 * Hovering or focusing *any* icon pauses the whole track in place
 * (`.marquee-row:hover .marquee-track` — animation-play-state, not a
 * duration change, so resuming continues from the exact frame it paused
 * on with no snap); leaving the row resumes it smoothly.
 *
 * `trustedByClients` (content/home.ts) ships empty until real, confirmed
 * clients are added — this renders nothing at all while it's empty
 * rather than filling the space with placeholder logos. An empty strip
 * beats a fake one.
 */
export function TrustedBy() {
  if (trustedByClients.length === 0) return null;

  return (
    <div className="trusted-by-footer relative w-full overflow-hidden border-t border-line/60 bg-ink/60 backdrop-blur-sm">
      <div className="marquee-row flex items-center gap-[22px] py-4 sm:py-5">
        {/* `relative` + `shrink-0` gives .trusted-aura (absolute, sized
            off this box) something to anchor to and size against — see
            globals.css for why it's a separate div behind the text
            rather than a text-shadow/filter on the label itself. Left
            padding here (not on the row) is what insets the fixed label
            from the viewport edge — the scrolling marquee to its right
            bleeds all the way to the edge on purpose, since
            .marquee-mask's own fade already handles that transition. */}
        <div className="relative hidden shrink-0 pl-6 sm:block">
          <div aria-hidden="true" className="trusted-aura pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2" />
          <span className="trusted-label relative font-mono text-[11px] font-semibold uppercase tracking-[0.18em]">
            Trusted By
          </span>
        </div>

        {/* The mask lives on the clipping viewport, not the track itself,
            so it fades the edges of what's visible rather than the
            (much wider) scrolling content underneath it. */}
        <div className="marquee-mask relative min-w-0 flex-1 overflow-hidden pl-6 sm:pl-0">
          <div className="marquee-track flex w-fit items-center gap-10">
            <ClientRow />
            <ClientRow hidden />
          </div>
        </div>
      </div>
    </div>
  );
}
