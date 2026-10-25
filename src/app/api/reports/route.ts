import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const reportSchema = z.object({
  reporterId: z.string().optional().nullable(),
  reporterName: z.string().min(2).max(80),
  profileId: z.string().min(1),
  reason: z.enum([
    "Inappropriate request",
    "Suspected inaccuracy",
    "Spam messages",
    "Harassment",
    "Fake profile",
    "Other",
  ]),
  details: z.string().max(1000).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = reportSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid report" },
        { status: 400 }
      );
    }
    const profile = await db.profile.findUnique({ where: { id: parsed.data.profileId } });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    const report = await db.report.create({ data: parsed.data });
    return NextResponse.json({ report }, { status: 201 });
  } catch (error) {
    console.error("POST /api/reports error:", error);
    return NextResponse.json({ error: "Failed to submit report" }, { status: 500 });
  }
}
