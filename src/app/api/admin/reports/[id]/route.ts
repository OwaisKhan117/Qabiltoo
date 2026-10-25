import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  action: z.enum(["warn", "suspend", "ban", "dismiss"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const parsed = patchSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
    const { action } = parsed.data;

    const report = await db.report.findUnique({ where: { id } });
    if (!report) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const updated = await db.report.update({
      where: { id },
      data: {
        status: "resolved",
        action: action === "dismiss" ? "none" : action,
        resolvedAt: new Date(),
      },
    });

    if (action === "warn" || action === "suspend" || action === "ban") {
      await db.notification.create({
        data: {
          profileId: report.profileId,
          type: "system",
          title:
            action === "warn"
              ? "Community guidelines reminder"
              : action === "suspend"
                ? "Your account has been suspended"
                : "Your account has been banned",
          body:
            action === "warn"
              ? "A report was reviewed. Please review our Islamic etiquette guidelines and communicate with dignity."
              : "Our moderation team has taken action following a review. Contact support@qabiltoo.in to appeal.",
        },
      });
    }

    return NextResponse.json({ report: updated });
  } catch (error) {
    console.error("PATCH /api/admin/reports/[id] error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
