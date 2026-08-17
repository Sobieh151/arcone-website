import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import { Reveal } from "@/components/animations/reveal";
import { MaskReveal } from "@/components/animations/mask-reveal";
import { StaggerGroup } from "@/components/animations/stagger-group";
import { StaggerItem } from "@/components/animations/stagger-item";
import { Button } from "@/components/buttons/button";

export function ServicesTeaser() {
  return (
    <section className="relative border-t border-border bg-bg-secondary py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Reveal>
              <span className="text-xs uppercase tracking-widest text-orange-highlight">
                What We Do
              </span>
            </Reveal>
            <MaskReveal
              as="h2"
              delay={0.06}
              className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              Three disciplines. One outcome.
            </MaskReveal>
          </div>
          <Reveal delay={0.1}>
            <Button
              href="/services"
              variant="secondary"
              size="sm"
              className="shrink-0"
              icon={<ArrowUpRight size={15} />}
            >
              All Services
            </Button>
          </Reveal>
        </div>

        <StaggerGroup
          as="div"
          className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3"
        >
          {services.map((service, i) => (
            <StaggerItem key={service.slug}>
              <Link
                href="/services"
                data-cursor-hover
                className="group flex h-full flex-col rounded-3xl border border-border bg-card p-8 transition-colors duration-500 hover:border-orange/40"
              >
                <span className="font-mono text-sm text-gray-medium">0{i + 1}</span>
                <h3 className="mt-4 text-xl font-semibold text-white transition-colors group-hover:text-orange-highlight">
                  {service.shortName}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-light">
                  {service.description}
                </p>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
