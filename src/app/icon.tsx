import { NextResponse } from "next/server";

export const dynamic = "force-static";

export default function Icon() {
  return NextResponse.redirect("/icon.svg");
}
