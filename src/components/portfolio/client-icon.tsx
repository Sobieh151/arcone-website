import type { TrustedByClient } from "@/content/home";

/**
 * A single Trusted By client's logo badge. Renders inside
 * `.trusted-client-icon` (globals.css), which does the actual
 * grayscale-at-rest / full-color-on-hover-or-focus-or-tap treatment via a
 * single CSS `filter: grayscale()` toggle on the real logo file — no
 * separate monochrome asset needed, and nothing here to swap when a real
 * client is added: `trustedByClients` (content/home.ts) only ever holds
 * confirmed clients with a real `src` already set.
 */
export function ClientIcon({ client }: { client: TrustedByClient }) {
  return (
    <span className="trusted-client-icon relative grid h-11 w-11 place-items-center rounded-full border">
      {/* eslint-disable-next-line @next/next/no-img-element -- real logo path, arbitrary aspect ratios per client; swap for next/image once assets land if it's worth the optimization. */}
      <img src={client.src} alt="" className="h-6 w-6 object-contain" />
    </span>
  );
}
