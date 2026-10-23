import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

/** Record a profile view (deduped per viewer+profile within 24h). */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const viewerId: string | undefined = body?.viewerId;
    const profileId: string | undefined = body?.profileId;
    if (!viewerId || !profileId || viewerId === profileId) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const since = new Date(Date.now() - 24 * 3600 * 1000);
    const recent = await db.profileView.findFirst({
      where: { viewerId, profileId, createdAt: { gt: since } },
    });
    if (recent) return NextResponse.json({ ok: true, deduped: true });

    await db.profileView.create({ data: { viewerId, profileId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/profiles/[id]/view error:", error);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
