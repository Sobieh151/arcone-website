import { NextResponse } from "next/server";

// Use a static SVG placeholder for open-graph images so static export
// (`output: 'export'`) can succeed. The real OG image generator can be
// restored later if needed.
export const dynamic = "force-static";

export default function OpengraphImage() {
  return NextResponse.redirect("/opengraph.svg");
}
