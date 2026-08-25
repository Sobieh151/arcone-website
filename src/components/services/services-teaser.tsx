"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { services, type Service } from "@/content/services";
import { Reveal } from "@/components/animations/reveal";
import { MaskReveal } from "@/components/animations/mask-reveal";
import { StaggerGroup } from "@/components/animations/stagger-group";
import { StaggerItem } from "@/components/animations/stagger-item";
import { Magnetic } from "@/components/buttons/magnetic";
import { Button } from "@/components/buttons/button";
import { useTilt } from "@/lib/use-tilt";

// Module scope, not inside the component: motion.create(Link) inside the
// render body would mint a fresh component type — and a fresh ref/effect
// cycle — on every render (same reasoning as the tags maps in
// stagger-group.tsx / mask-reveal.tsx).
const MotionLink = motion.create(Link);

function ServiceCard({ service, index }: { service: Service; index: number }) {
  const { ref, onMouseMove, onMouseLeave, style } = useTilt<HTMLAnchorElement>();

  return (
    <MotionLink
      ref={ref}
      href="/services"
      data-cursor-hover
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={style}
      className="glass glass-shine relative group flex h-full flex-col rounded-3xl p-8"
    >
      <span className="font-mono text-sm text-gray-medium">0{index + 1}</span>
      <h3 className="mt-4 text-xl font-semibold text-white transition-colors group-hover:text-orange-highlight">
        {service.shortName}
      </h3>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-light">
        {service.description}
      </p>
    </MotionLink>
  );
}

export function ServicesTeaser() {
  return (
    <section className="relative border-t border-border bg-bg-secondary py-32">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <Reveal>
              <span className="text-xs uppercase tracking-widest text-orange-highlight">
                [[ Capabilities eyebrow ]]
              </span>
            </Reveal>
            <MaskReveal
              as="h2"
              delay={0.06}
              className="mt-4 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl"
            >
              [[ Capabilities heading ]]
            </MaskReveal>
          </div>
          <Reveal delay={0.1}>
            <Magnetic strength={0.3}>
              <Button
                href="/services"
                variant="secondary"
                size="sm"
                className="shrink-0"
                icon={<ArrowUpRight size={15} />}
              >
                All Services
              </Button>
            </Magnetic>
          </Reveal>
        </div>

        {/* 5 capabilities: 1 col on mobile, 2 on tablet, 3 on desktop
            (3 + 2, rather than forcing a 5-wide row). */}
        <StaggerGroup
          as="div"
          className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => (
            <StaggerItem key={service.slug}>
              <ServiceCard service={service} index={i} />
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
