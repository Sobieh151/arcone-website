"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";
import { contactInfo } from "@/content/contact";
import { primaryCta } from "@/content/shared";
import { Button } from "@/components/buttons/button";

type Status = "idle" | "submitting" | "sent" | "fallback" | "error";

// Formspree receives the POST directly from the browser — no Next.js API
// route needed. The site now runs on a Next.js server (not a static
// export), so a server route would work too, but Formspree is already
// wired up and working, so it stays. Sign up at https://formspree.io,
// create a form, and put its ID in NEXT_PUBLIC_FORMSPREE_FORM_ID (see
// .env.example) — this has no working default, so until it's set the
// form fails gracefully to a mailto: link instead of losing the message
// silently.
const formspreeId = process.env.NEXT_PUBLIC_FORMSPREE_FORM_ID;

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formspreeId) {
      setStatus("fallback");
      return;
    }

    setStatus("submitting");

    const form = new FormData(e.currentTarget);

    try {
      const res = await fetch(`https://formspree.io/f/${formspreeId}`, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: form,
      });

      setStatus(res.ok ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-surface p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-orange text-black">
          <Check size={20} />
        </span>
        <h3 className="text-2xl font-semibold text-white">
          Message received.
        </h3>
        <p className="text-gray-light">
          We read every message personally. Expect a reply within one
          business day.
        </p>
      </div>
    );
  }

  if (status === "fallback" || status === "error") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-3xl border border-border bg-surface p-10">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-orange-burnt text-white">
          <TriangleAlert size={20} />
        </span>
        <h3 className="text-2xl font-semibold text-white">
          {status === "fallback" ? "Almost there." : "Something went wrong."}
        </h3>
        <p className="text-gray-light">
          {status === "fallback"
            ? "Our inbox integration isn't finished yet, so this form can't send automatically. "
            : "The message didn't go through. "}
          Email us directly instead — we&apos;ll see it just as fast.
        </p>
        <Button href={`mailto:${contactInfo.email}`} size="sm">
          Email {contactInfo.email}
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        <Field label="Name" name="name" type="text" placeholder="Jane Cooper" required />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="jane@company.com"
          required
        />
      </div>
      <Field label="Company" name="company" type="text" placeholder="Company name" />



      <div>
        <label
          htmlFor="message"
          className="text-xs uppercase tracking-widest text-gray-medium"
        >
          Tell us about the project
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={4}
          placeholder="What are you building, and what does success look like?"
          className="mt-4 w-full resize-none border-b border-border bg-transparent pb-4 text-lg text-white placeholder:text-gray-medium focus:border-orange focus:outline-none"
        />
      </div>

      <Button
        type="submit"
        disabled={status === "submitting"}
        className="mt-4 w-fit"
        icon={
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        }
      >
        {status === "submitting" ? "Sending…" : primaryCta.label}
      </Button>
    </form>
  );
}

function Field({
  label,
  name,
  type,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type: string;
  placeholder: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="text-xs uppercase tracking-widest text-gray-medium"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="mt-4 w-full border-b border-border bg-transparent pb-4 text-lg text-white placeholder:text-gray-medium focus:border-orange focus:outline-none"
      />
    </div>
  );
}
