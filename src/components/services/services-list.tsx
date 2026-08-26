import { services } from "@/content/services";
import { StaggerGroup } from "@/components/animations/stagger-group";
import { StaggerItem } from "@/components/animations/stagger-item";

export function ServicesList() {
  return (
    <section className="relative bg-bg py-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <StaggerGroup as="div" className="flex flex-col" staggerChildren={0.1}>
          {services.map((service, i) => (
            <StaggerItem
              key={service.slug}
              className="grid grid-cols-1 gap-6 border-t border-border py-12 last:border-b md:grid-cols-12 md:items-start"
            >
              <span className="hidden font-mono text-sm text-gray-medium md:col-span-1 md:block">
                0{i + 1}
              </span>
              <h2 className="text-3xl font-semibold tracking-tight text-white md:col-span-4 sm:text-4xl">
                {service.name}
              </h2>
              <p className="text-base leading-relaxed text-gray-light md:col-span-4">
                {service.description}
              </p>
              <ul className="flex flex-col gap-2 md:col-span-3">
                {service.deliverables.map((item, j) => (
                  <li
                    // Index, not the item text: every deliverable is
                    // currently the same "[[ Deliverable ]]" placeholder,
                    // which made `key={item}` collide.
                    key={j}
                    className="text-sm text-gray-light before:mr-2 before:text-orange-highlight before:content-['—']"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
