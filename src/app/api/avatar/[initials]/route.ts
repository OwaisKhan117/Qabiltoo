import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** Elegant initials avatar with emerald→gold gradient and star motif. */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ initials: string }> }
) {
  const { initials } = await params;
  const text = decodeURIComponent(initials || "QT")
    .replace(/[^a-zA-Z]/g, "")
    .slice(0, 2)
    .toUpperCase();

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="0 0 256 256">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b5345"/>
      <stop offset="100%" stop-color="#14654f"/>
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="24" fill="url(#g)"/>
  <g fill="none" stroke="#d4af37" stroke-width="2.5" opacity="0.5" transform="translate(128 128)">
    <rect x="-26" y="-26" width="52" height="52"/>
    <rect x="-26" y="-26" width="52" height="52" transform="rotate(45)"/>
  </g>
  <text x="128" y="152" font-family="Georgia, serif" font-size="84" font-weight="600" fill="#f7efd2" text-anchor="middle">${text}</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
