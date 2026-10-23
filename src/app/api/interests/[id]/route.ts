import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  status: z.enum(["pending", "accepted", "declined"]),
  profileId: z.string().min(1),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const interest = await db.interest.findUnique({ where: { id } });
    if (!interest) {
      return NextResponse.json({ error: "Interest not found" }, { status: 404 });
    }
    if (interest.toId !== parsed.data.profileId) {
      return NextResponse.json(
        { error: "Only the recipient can respond to an interest" },
        { status: 403 }
      );
    }

    const updated = await db.interest.update({
      where: { id },
      data: { status: parsed.data.status },
      include: { from: true, to: true },
    });
    return NextResponse.json({ interest: updated });
  } catch (error) {
    console.error("PATCH /api/interests/[id] error:", error);
    return NextResponse.json({ error: "Failed to update interest" }, { status: 500 });
  }
}
