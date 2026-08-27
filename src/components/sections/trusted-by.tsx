import { Fragment } from "react";
import { trustedByClients } from "@/content/home";

// One lap's worth of names, middot-separated. Rendered twice inside
// .marquee-track (see globals.css) so the container can translate
// exactly -50% of its own width — precisely one lap — and loop with no
// seam: the second copy is already sitting where the first one started.
// `hidden` marks the duplicate `aria-hidden` so screen readers only ever
// hear the client list once.
function ClientRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-[28px]" aria-hidden={hidden || undefined}>
      {trustedByClients.map((name, i) => (
        <Fragment key={i}>
          <span
            className="whitespace-nowrap text-[14px] font-semibold tracking-[0.08em] text-paper/85"
          >
            {name}
          </span>
          <span aria-hidden="true" className="text-[12px] text-[#6A6864]">
            &middot;
          </span>
        </Fragment>
      ))}
    </div>
  );
}

export function TrustedBy() {
  return (
    <section className="w-full overflow-hidden border-y border-line bg-ink py-[18px]">
      <div className="marquee-row flex items-center gap-[22px]">
        {/* `relative` + `shrink-0` gives .trusted-aura (absolute, sized
            off this box) something to anchor to and size against — see
            globals.css for why it's a separate div behind the text
            rather than a text-shadow/filter on the label itself. Left
            padding here (not on the section) is what insets the fixed
            label from the viewport edge — the scrolling marquee to its
            right bleeds all the way to the edge on purpose, since
            .marquee-mask's own fade already handles that transition. */}
        <div className="relative shrink-0 pl-[24px]">
          <div aria-hidden="true" className="trusted-aura pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2" />
          <span className="trusted-label relative font-mono text-[12px] font-semibold uppercase tracking-[0.18em]">
            Trusted By
          </span>
        </div>

        {/* The mask lives on the clipping viewport, not the track itself,
            so it fades the edges of what's visible rather than the
            (much wider) scrolling content underneath it. */}
        <div className="marquee-mask relative min-w-0 flex-1 overflow-hidden">
          <div className="marquee-track flex w-fit gap-[28px]">
            <ClientRow />
            <ClientRow hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
