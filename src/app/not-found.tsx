import { ArrowRight } from "lucide-react";
import { Button } from "@/components/buttons/button";

export default function NotFound() {
  return (
    <section className="relative isolate flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-[120px]"
        style={{
          background:
            "radial-gradient(circle, rgba(232,80,2,0.55), transparent 65%)",
        }}
      />
      <span
        className="text-[28vw] font-semibold leading-none tracking-tight text-transparent sm:text-[18rem]"
        style={{ WebkitTextStroke: "1px rgba(255,255,255,0.15)" }}
      >
        404
      </span>
      <h1 className="-mt-6 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
        This page didn&apos;t make the cut.
      </h1>
      <p className="mt-4 max-w-sm text-gray-light">
        Even we edit ruthlessly. Let&apos;s get you back to something worth
        seeing.
      </p>
      <Button href="/" className="mt-10" icon={<ArrowRight size={16} />}>
        Back to Home
      </Button>
    </section>
  );
}
