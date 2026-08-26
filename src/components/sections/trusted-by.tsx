import { Fragment } from "react";

// Text names, not logo files — swap/reorder here when real client logos
// are ready. Defined at the top of the component (not content/*) per the
// brief, since this is the one place anyone touching this ticker will
// look for it.
const CLIENTS = [
  "SERA",
  "UBR",
  "SERAC",
  "TMG",
  "SENSI",
  "NILE",
  "CITY EDGE",
  "VOX",
  "ELSEWEDY",
  "ORASCOM",
];

// One lap's worth of names, middot-separated. Rendered twice inside
// .marquee-track (see globals.css) so the container can translate
// exactly -50% of its own width — precisely one lap — and loop with no
// seam: the second copy is already sitting where the first one started.
// `hidden` marks the duplicate `aria-hidden` so screen readers only ever
// hear the client list once.
function ClientRow({ hidden }: { hidden?: boolean }) {
  return (
    <div className="flex shrink-0 items-center gap-6" aria-hidden={hidden || undefined}>
      {CLIENTS.map((name, i) => (
        <Fragment key={i}>
          <span className="whitespace-nowrap text-sm tracking-[0.02em] text-paper/55">
            {name}
          </span>
          <span aria-hidden="true" className="text-mute/40">
            &middot;
          </span>
        </Fragment>
      ))}
    </div>
  );
}

export function TrustedBy() {
  return (
    <section className="w-full overflow-hidden border-y border-line bg-ink px-6 py-6 sm:px-10">
      <div className="marquee-row flex items-center gap-8">
        {/* `relative` + `shrink-0` gives .trusted-aura (absolute, sized
            off this box) something to anchor to and size against — see
            globals.css for why it's a separate div behind the text
            rather than a text-shadow/filter on the label itself. */}
        <div className="relative shrink-0">
          <div aria-hidden="true" className="trusted-aura pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2" />
          <span className="trusted-label relative font-mono text-[11px] uppercase tracking-[0.18em]">
            Trusted By
          </span>
        </div>

        {/* The mask lives on the clipping viewport, not the track itself,
            so it fades the edges of what's visible rather than the
            (much wider) scrolling content underneath it. */}
        <div className="marquee-mask relative min-w-0 flex-1 overflow-hidden">
          <div className="marquee-track flex w-fit gap-6">
            <ClientRow />
            <ClientRow hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
