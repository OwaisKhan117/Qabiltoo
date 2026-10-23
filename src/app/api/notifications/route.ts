import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const profileId = req.nextUrl.searchParams.get("profileId");
    if (!profileId) {
      return NextResponse.json({ error: "profileId required" }, { status: 400 });
    }
    const notifications = await db.notification.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      take: 30,
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

/** Mark all notifications read for a profile */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const profileId: string | undefined = body?.profileId;
    if (!profileId) {
      return NextResponse.json({ error: "profileId required" }, { status: 400 });
    }
    await db.notification.updateMany({
      where: { profileId, read: false },
      data: { read: true },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to mark read" }, { status: 500 });
  }
}
