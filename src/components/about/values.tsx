import { Reveal } from "@/components/animations/reveal";
import { StaggerGroup } from "@/components/animations/stagger-group";
import { StaggerItem } from "@/components/animations/stagger-item";
import { values } from "@/content/about";

export function Values() {
  return (
    <section className="border-t border-border bg-bg-secondary py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <Reveal>
          <span className="text-xs uppercase tracking-widest text-orange-highlight">
            [[ Values — eyebrow ]]
          </span>
        </Reveal>
        <StaggerGroup className="mt-10 flex flex-wrap gap-4" staggerChildren={0.04}>
          {values.map((value) => (
            <StaggerItem key={value} y={16}>
              <span className="inline-block rounded-full border border-border px-6 py-3 text-base text-gray-light transition-colors hover:border-orange hover:text-white sm:text-lg">
                {value}
              </span>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
