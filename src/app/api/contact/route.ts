import { NextResponse } from "next/server";
import { contactInfo } from "@/content/contact";

// Contact form submission handler. Ready to send through Resend's HTTP
// API — no SDK dependency needed, just a fetch call — once environment
// variables are set:
//
//   RESEND_API_KEY     required — from resend.com
//   CONTACT_TO_EMAIL    optional — defaults to content/contact.ts's email
//   CONTACT_FROM_EMAIL   optional — must be a domain verified in Resend;
//                          defaults to their sandbox sender
//
// Until RESEND_API_KEY is set, this responds with `not_configured` so the
// frontend can fail gracefully (falling back to a mailto: link) instead
// of silently losing the message.

type ContactPayload = {
  name?: string;
  email?: string;
  company?: string;
  message?: string;
};

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as ContactPayload | null;

  if (!body) {
    return NextResponse.json({ ok: false, error: "invalid_body" }, { status: 400 });
  }

  const { name, email, company, message } = body;
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return NextResponse.json(
      { ok: false, error: "missing_required_fields" },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.warn(
      "[/api/contact] RESEND_API_KEY is not set — message was not emailed. " +
        "Add it to .env.local to enable delivery (see .env.example)."
    );
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 501 });
  }

  const toEmail = process.env.CONTACT_TO_EMAIL || contactInfo.email;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "ARCone Website <onboarding@resend.dev>";

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: toEmail,
        reply_to: email,
        subject: `New project inquiry from ${name}`,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          company ? `Company: ${company}` : null,
          company ? `Company: ${company}` : null,
          "",
          message,
        ]
          .filter(Boolean)
          .join("\n"),
      }),
    });

    if (!res.ok) {
      console.error("[/api/contact] Resend API error:", await res.text());
      return NextResponse.json({ ok: false, error: "send_failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[/api/contact] Unexpected error:", err);
    return NextResponse.json({ ok: false, error: "send_failed" }, { status: 500 });
  }
}
