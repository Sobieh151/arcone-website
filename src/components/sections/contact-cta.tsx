import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/animations/reveal";
import { MaskReveal } from "@/components/animations/mask-reveal";
import { Button } from "@/components/buttons/button";
import { contactCta } from "@/content/shared";

export function ContactCta() {
  return (
    // isolate, not bg-bg: makes this section its own stacking-context root
    // so the -z-10 glow paints behind its content instead of behind
    // <body>'s opaque background (body is already the same black).
    <section className="relative isolate overflow-hidden py-40">
      <div
        className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[900px] -translate-x-1/2 rounded-full opacity-40 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,80,2,0.55), transparent 65%)",
        }}
      />
      <div className="mx-auto max-w-4xl px-6 text-center sm:px-10">
        <MaskReveal
          as="h2"
          className="text-balance text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-6xl"
        >
          {contactCta.heading}
        </MaskReveal>
        <Reveal delay={0.1}>
          <p className="mx-auto mt-6 max-w-md text-lg text-gray-light">
            {contactCta.body}
          </p>
        </Reveal>
        <Reveal delay={0.2}>
          <Button
            href={contactCta.cta.href}
            className="mt-10"
            icon={
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            }
          >
            {contactCta.cta.label}
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
