import { Reveal } from "@/components/animations/reveal";
import { GlassCard } from "@/components/animations/glass-card";
import { stats } from "@/content/about";

export function Stats() {
  return (
    <section className="border-t border-border py-24">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-6 sm:gap-6 sm:px-10 md:grid-cols-4">
        {stats.map((stat, i) => (
          <Reveal key={stat.label} delay={i * 0.06}>
            <GlassCard className="h-full rounded-2xl px-6 py-8">
              <p className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {stat.value}
              </p>
              <p className="mt-2 text-sm text-gray-light">{stat.label}</p>
            </GlassCard>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
