import { Reveal } from "@/components/animations/reveal";
import { StaggerGroup } from "@/components/animations/stagger-group";
import { StaggerItem } from "@/components/animations/stagger-item";
import { idealClients, industries } from "@/content/positioning";

export function WhoWeWorkWith() {
  return (
    <section className="border-t border-border bg-bg-secondary py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          <div>
            <Reveal>
              <span className="text-xs uppercase tracking-widest text-orange-highlight">
                Who We Work With
              </span>
            </Reveal>
            <StaggerGroup className="mt-8 flex flex-wrap gap-3" staggerChildren={0.04}>
              {idealClients.map((client) => (
                <StaggerItem key={client} y={16}>
                  <span className="inline-block rounded-full border border-border px-5 py-2.5 text-sm text-gray-light transition-colors hover:border-orange hover:text-white">
                    {client}
                  </span>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
          <div>
            <Reveal>
              <span className="text-xs uppercase tracking-widest text-orange-highlight">
                Industries
              </span>
            </Reveal>
            <StaggerGroup className="mt-8 flex flex-wrap gap-3" staggerChildren={0.04}>
              {industries.map((industry) => (
                <StaggerItem key={industry} y={16}>
                  <span className="inline-block rounded-full border border-border px-5 py-2.5 text-sm text-gray-light transition-colors hover:border-orange hover:text-white">
                    {industry}
                  </span>
                </StaggerItem>
              ))}
            </StaggerGroup>
          </div>
        </div>
      </div>
    </section>
  );
}
