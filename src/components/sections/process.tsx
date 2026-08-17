import { Reveal } from "@/components/animations/reveal";
import { MaskReveal } from "@/components/animations/mask-reveal";
import { StaggerGroup } from "@/components/animations/stagger-group";
import { StaggerItem } from "@/components/animations/stagger-item";
import { process } from "@/content/shared";

export function Process() {
  return (
    <section className="relative bg-bg py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-orange-highlight">
            {process.eyebrow}
          </span>
        </Reveal>
        <MaskReveal
          as="h2"
          delay={0.06}
          className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl"
        >
          {process.heading}
        </MaskReveal>

        <StaggerGroup
          as="div"
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-3xl border border-border bg-border md:grid-cols-2"
        >
          {process.steps.map((step) => (
            <StaggerItem
              key={step.n}
              className="group relative bg-bg-secondary p-10 transition-colors duration-500 hover:bg-card sm:p-14"
            >
              <span
                className="text-6xl font-semibold tracking-tight text-transparent sm:text-7xl"
                style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}
              >
                {step.n}
              </span>
              <h3 className="mt-6 text-2xl font-semibold text-white transition-colors group-hover:text-orange-highlight sm:text-3xl">
                {step.title}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-gray-light">
                {step.text}
              </p>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
