"use client";

import { useEffect } from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@/components/buttons/button";
import { contactInfo } from "@/content/contact";

// Route-level error boundary. Without this, an unhandled render error
// anywhere on the site fell through to Next's default unstyled error
// screen — a jarring break from a site this deliberately art-directed.
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="relative isolate flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,80,2,0.55), transparent 65%)",
        }}
      />
      <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        Something broke.
      </h1>
      <p className="mt-4 max-w-sm text-gray-light">
        That&apos;s on us. Try again, or reach us directly at{" "}
        <a
          href={`mailto:${contactInfo.email}`}
          data-cursor-hover
          className="text-orange-highlight hover:underline"
        >
          {contactInfo.email}
        </a>
        .
      </p>
      <Button
        onClick={() => reset()}
        className="mt-10"
        icon={<RotateCcw size={16} />}
      >
        Try Again
      </Button>
    </section>
  );
}
