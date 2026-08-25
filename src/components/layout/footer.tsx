import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { footerNav } from "@/content/navigation";
import { contactInfo } from "@/content/contact";
import { siteConfig } from "@/content/seo";

export function Footer() {
  return (
    <footer className="relative border-t border-border bg-bg-secondary">
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(232,80,2,0.4), transparent)",
        }}
      />
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-10">
        <div className="flex flex-col justify-between gap-12 md:flex-row">
          <Link
            href="/"
            data-cursor-hover
            className="text-2xl font-semibold tracking-tight text-white"
          >
            ARC<span className="text-orange-highlight">one</span>
          </Link>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-medium">
                Navigate
              </p>
              <ul className="mt-4 space-y-3">
                {footerNav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      data-cursor-hover
                      className="text-sm text-gray-light transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-medium">
                Connect
              </p>
              <ul className="mt-4 space-y-3">
                <li>
                  <a
                    href={contactInfo.whatsapp}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-hover
                    className="inline-flex items-center gap-1 text-sm text-gray-light transition-colors hover:text-white"
                  >
                    WhatsApp
                    <ArrowUpRight size={12} />
                  </a>
                </li>
                <li>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    data-cursor-hover
                    className="text-sm text-gray-light transition-colors hover:text-white"
                  >
                    {contactInfo.email}
                  </a>
                </li>
                <li>
                  <a
                    href={contactInfo.instagram}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor-hover
                    className="inline-flex items-center gap-1 text-sm text-gray-light transition-colors hover:text-white"
                  >
                    Instagram
                    <ArrowUpRight size={12} />
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-gray-medium">
                Studio
              </p>
              <p className="mt-4 text-sm text-gray-light">{contactInfo.location}</p>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-8 text-xs text-gray-medium sm:flex-row sm:items-center">
          <span>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </span>
          <Link href="/privacy" data-cursor-hover className="hover:text-white">
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
