import { NextResponse } from "next/server";

export const dynamic = "force-static";

export default function AppleIcon() {
  return NextResponse.redirect("/apple-icon.svg");
}
