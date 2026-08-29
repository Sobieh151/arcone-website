import Image from "next/image";
import { Reveal } from "@/components/animations/reveal";
import { MaskReveal } from "@/components/animations/mask-reveal";
import { aboutHeader } from "@/content/about";

// Tiny blur-up placeholder for /public/about/about-hero.jpg while it
// downloads — same technique as hero-background.tsx's own blurDataURL:
// it's a public/ asset (not a static import), so next/image can't derive
// one automatically. See that file's comment for the full explanation.
const ABOUT_HERO_BLUR_DATA_URL =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAIAAABLbSncAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAACKADAAQAAAABAAAACAAAAACVhHtSAAABzWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDxleGlmOkNvbG9yU3BhY2U+MTwvZXhpZjpDb2xvclNwYWNlPgogICAgICAgICA8ZXhpZjpQaXhlbFhEaW1lbnNpb24+MTUzNjwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj4yMDQ4PC9leGlmOlBpeGVsWURpbWVuc2lvbj4KICAgICAgPC9yZGY6RGVzY3JpcHRpb24+CiAgIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CpQy4lMAAAClSURBVAgdVY65CsJQFETv9mLMUgRcGiFWYiXYWikWlv6Hv+ovWFlZKSrEbO9eX6nTzXA4DDrn4D8GQAb0O/YGBpiKtIBCRGagZoi4G+f7cVor3OqPBIYQNqNcgRlDgzLRw2QgQVWmCXN0eVWP1p+Ww20RPCCEWCleq/bedLOhW2Uax4zMLMyf3r+73qs1iosE1tPIHLOTQfCGO4TUeDw/9TiXIpMvwJI6bPBgo3kAAAAASUVORK5CYII=";

// One line's worth of headline styling — pulled out since `above` and
// `below` (content/about.ts) both render the same clamp()'d, condensed
// uppercase treatment, just at different points in the stack.
const headlineLineClass =
  "block overflow-hidden pb-1 font-heading text-[clamp(2.5rem,9vw,6rem)] font-extrabold uppercase leading-[0.86] tracking-[-0.045em] text-paper";
const headlineTextShadow = { textShadow: "0 2px 24px rgba(0,0,0,0.85)" };

/**
 * The About page's editorial opener: one oversized headline that a large
 * photo visually cuts through, per the "About / Services Transition
 * Direction" brief. There's exactly one real <h1> (sr-only, the full
 * sentence) for accessibility/SEO — everything below it is a decorative,
 * aria-hidden re-presentation of the same words, split so the effect can
 * be genuinely layered rather than faked with a clip-path/mask:
 *
 *   `above` — normal flow, z-0.
 *   image   — pulled up over `above`'s bottom edge with a negative
 *             margin, painted at z-10, so it visually covers/"cuts into"
 *             `above` where they meet (`above` reads as behind it).
 *   `below` — pulled up over the image's own bottom edge the same way,
 *             painted at z-20 (above the image), so it reads as sitting
 *             back in front of it.
 *
 * Same single image, two real text blocks, no shared-element/mask
 * trickery — just stacking order and negative margins.
 */
export function AboutHero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink pb-16 pt-40 sm:pb-20 sm:pt-48">
      <h1 className="sr-only">{aboutHeader.title.full}</h1>

      <div className="mx-auto max-w-6xl px-6 sm:px-10">
        <Reveal>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-arc">
            {aboutHeader.eyebrow}
          </span>
        </Reveal>
      </div>

      <div aria-hidden="true" className="relative mt-6">
        <div className="relative z-0 mx-auto max-w-6xl px-6 sm:px-10">
          {aboutHeader.title.above.map((line, i) => (
            <MaskReveal key={line} as="span" delay={0.08 + i * 0.05} className={headlineLineClass}>
              <span style={headlineTextShadow}>{line}</span>
            </MaskReveal>
          ))}
        </div>

        <Reveal
          delay={0.16}
          y={0}
          className="relative z-10 mx-auto -mt-[clamp(0.25rem,1.2vw,0.9rem)] h-[clamp(320px,52vw,680px)] w-full max-w-6xl overflow-hidden"
        >
          <Image
            src="/about/about-hero.jpg"
            alt="" /* decorative — this whole block sits under an aria-hidden ancestor */
            fill
            sizes="100vw"
            className="object-cover"
            placeholder="blur"
            blurDataURL={ABOUT_HERO_BLUR_DATA_URL}
          />
          {/* Darkens the image's own bottom edge a little further, so
              `below` (painted on top of it right here) keeps enough
              contrast regardless of what's underneath at that point. */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-[45%]"
            style={{ background: "linear-gradient(to top, rgba(5,5,5,0.65), transparent)" }}
          />
        </Reveal>

        <div className="relative z-20 mx-auto -mt-[clamp(0.25rem,1.2vw,0.9rem)] max-w-6xl px-6 sm:px-10">
          {aboutHeader.title.below.map((line, i) => (
            <MaskReveal
              key={line}
              as="span"
              delay={0.3 + i * 0.05}
              className={headlineLineClass}
            >
              <span style={headlineTextShadow}>{line}</span>
            </MaskReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
