import type { Project } from "@/data/projects";
import { WorkSlider } from "@/components/portfolio/work-slider";

/**
 * The actual case-study body — hero visual, summary, client/industry/
 * services, challenge/approach/what-we-did, the visual-work slider, and
 * results — shared between ProjectModal (the existing overlay, still
 * used by Explore Work's cards and the /work grid) and the new
 * /work/[slug] page (linked from Trusted By). One content component, two
 * different chrome around it, so neither has to duplicate the other's
 * JSX. `headingId` lets each caller wire its own aria-labelledby target
 * without this component hardcoding one specific to the modal.
 */
export function ProjectContent({ project, headingId }: { project: Project; headingId?: string }) {
  return (
    <>
      {/* Hero visual */}
      <div
        className="aspect-[16/9] w-full rounded-2xl border border-border"
        style={{
          background: `radial-gradient(circle at 25% 25%, ${project.color}55, transparent 55%), radial-gradient(circle at 80% 80%, ${project.color}33, transparent 50%), linear-gradient(160deg, #0b0b0b, #000)`,
        }}
      />

      <span className="mt-8 block text-xs uppercase tracking-widest text-orange-highlight">
        {project.category} &middot; {project.year}
      </span>
      <h2 id={headingId} className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        {project.name}
      </h2>
      <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-light">{project.summary}</p>

      {/* Client / Industry / Services */}
      <dl className="mt-8 grid grid-cols-2 gap-6 border-y border-border py-6 sm:grid-cols-4">
        <div>
          <dt className="text-xs uppercase tracking-widest text-gray-medium">Client</dt>
          <dd className="mt-2 text-sm text-white">{project.name}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-gray-medium">Industry</dt>
          <dd className="mt-2 text-sm text-white">{project.industry}</dd>
        </div>
        <div className="col-span-2">
          <dt className="text-xs uppercase tracking-widest text-gray-medium">Services</dt>
          <dd className="mt-2 flex flex-wrap gap-2">
            {project.services.map((service) => (
              <span key={service} className="rounded-full border border-border px-3 py-1 text-xs text-gray-light">
                {service}
              </span>
            ))}
          </dd>
        </div>
      </dl>

      {/* Challenge / Approach / What We Did */}
      <div className="mt-10 grid grid-cols-1 gap-10 sm:grid-cols-3">
        {[
          { label: "Challenge", text: project.challenge },
          { label: "Approach", text: project.strategy },
          { label: "What We Did", text: project.execution },
        ].map((block) => (
          <div key={block.label}>
            <span className="text-xs uppercase tracking-widest text-orange-highlight">{block.label}</span>
            <p className="mt-3 text-sm leading-relaxed text-gray-light">{block.text}</p>
          </div>
        ))}
      </div>

      {/* Visual work — a real prev/next slider (components/portfolio/
          work-slider.tsx), not static tiles, so the same "preview slider
          for our work" experience shows up here and via ProjectModal. */}
      <div className="mt-12">
        <span className="text-xs uppercase tracking-widest text-orange-highlight">Visual Work</span>
        <div className="mt-4">
          <WorkSlider project={project} />
        </div>
      </div>

      {/* Results */}
      <div className="mt-12 border-t border-border pt-10">
        <span className="text-xs uppercase tracking-widest text-orange-highlight">Results</span>
        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-3">
          {project.results.map((result) => (
            <div key={result.label}>
              <p className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">{result.value}</p>
              <p className="mt-2 text-sm text-gray-light">{result.label}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
