import { trustedByClients } from "@/content/home";

// One lap's worth of client names. Rendered twice inside .marquee-track
// (see globals.css) so the container can translate exactly -50% of its own
// width and loop continuously. The duplicate is aria-hidden so assistive
// technology encounters the client list only once.
function ClientRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-10" aria-hidden={hidden || undefined}>
      {trustedByClients.map((client) => (
        <span
          key={client.slug}
          className="trusted-client shrink-0 font-heading text-sm font-bold uppercase tracking-[0.12em]"
        >
          {client.name}
        </span>
      ))}
    </div>
  );
}

/**
 * The bottom edge of the Hero, not a standalone section — see hero.tsx,
 * which renders this as the last thing inside its own <section> rather
 * than page.tsx rendering it as a sibling. The names are text-only until
 * approved logo assets are available. Hovering or focusing the row pauses
 * the marquee in place; leaving it resumes smoothly.
 *
 * Client names are intentionally rendered as text for now. Approved logo
 * assets can be introduced later without changing the marquee structure.
 */
export function TrustedBy() {
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
