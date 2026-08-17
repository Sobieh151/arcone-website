"use client";

import { useState, type FormEvent } from "react";
import { ArrowRight, Check, TriangleAlert } from "lucide-react";
import { contactInfo } from "@/content/contact";
import { primaryCta } from "@/content/shared";
import { Button } from "@/components/buttons/button";

type Status = "idle" | "submitting" | "sent" | "fallback" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    const form = new FormData(e.currentTarget);
    const payload = {
      name: String(form.get("name") || ""),
      email: String(form.get("email") || ""),
      company: String(form.get("company") || ""),
      message: String(form.get("message") || ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await res.json().catch(() => null)) as
        | { ok: boolean; error?: string }
        | null;

      if (data?.ok) {
        setStatus("sent");
      } else if (data?.error === "not_configured") {
        // Email delivery isn't wired up yet (see .env.example). Don't
        // pretend the message went somewhere — offer a working fallback.
        setStatus("fallback");
      } else {
        setStatus("error");
      }
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
