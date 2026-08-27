import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/content/services";
import { StaggerGroup } from "@/components/animations/stagger-group";
import { StaggerItem } from "@/components/animations/stagger-item";

export function ServicesList() {
  return (
    <section className="relative bg-bg py-8 sm:py-16">
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <StaggerGroup as="div" className="flex flex-col" staggerChildren={0.1}>
          {services.map((service, i) => (
            <StaggerItem key={service.slug} className="border-t border-border last:border-b">
              {/* `contents` drops this Link out of the box model so its
                  children land as direct grid items below, keeping the
                  exact column layout the row had before this whole area
                  became one clickable link to /services/[slug]. */}
              <Link
                href={`/services/${service.slug}`}
                data-cursor-hover
                className="group grid grid-cols-1 gap-6 py-12 md:grid-cols-12 md:items-start"
              >
                <span className="hidden font-mono text-sm text-gray-medium md:col-span-1 md:block">
                  0{i + 1}
                </span>
                <h2 className="text-3xl font-semibold tracking-tight text-white transition-colors group-hover:text-orange-highlight md:col-span-4 sm:text-4xl">
                  {service.name}
                </h2>
                <p className="text-base leading-relaxed text-gray-light md:col-span-4">
                  {service.description}
                </p>
                <ul className="flex flex-col gap-2 md:col-span-2">
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
                <span className="flex items-center gap-2 text-sm text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 md:col-span-1 md:justify-self-end">
                  <ArrowUpRight size={18} />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
}
