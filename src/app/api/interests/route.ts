import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const profileId = req.nextUrl.searchParams.get("profileId");
    if (!profileId) {
      return NextResponse.json({ error: "profileId is required" }, { status: 400 });
    }

    const [sent, received] = await Promise.all([
      db.interest.findMany({
        where: { fromId: profileId },
        include: { to: true },
        orderBy: { createdAt: "desc" },
      }),
      db.interest.findMany({
        where: { toId: profileId },
        include: { from: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return NextResponse.json({ sent, received });
  } catch (error) {
    console.error("GET /api/interests error:", error);
    return NextResponse.json({ error: "Failed to fetch interests" }, { status: 500 });
  }
}

const createInterestSchema = z.object({
  fromId: z.string().min(1),
  toId: z.string().min(1),
  message: z.string().max(600).optional().nullable(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = createInterestSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }
    const { fromId, toId, message } = parsed.data;
    if (fromId === toId) {
      return NextResponse.json({ error: "You cannot send interest to yourself" }, { status: 400 });
    }

    const [from, to] = await Promise.all([
      db.profile.findUnique({ where: { id: fromId } }),
      db.profile.findUnique({ where: { id: toId } }),
    ]);
    if (!from || !to) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const duplicate = await db.interest.findFirst({
      where: { fromId, toId, status: "pending" },
    });
    if (duplicate) {
      return NextResponse.json(
        { error: "You have already sent an interest to this profile" },
        { status: 409 }
      );
    }

    const interest = await db.interest.create({
      data: { fromId, toId, message: message || null },
      include: { from: true, to: true },
    });
    return NextResponse.json({ interest }, { status: 201 });
  } catch (error) {
    console.error("POST /api/interests error:", error);
    return NextResponse.json({ error: "Failed to send interest" }, { status: 500 });
  }
}
