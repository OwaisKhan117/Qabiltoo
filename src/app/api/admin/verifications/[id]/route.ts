import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const patchSchema = z.object({
  action: z.enum(["approve", "reject"]),
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

    const request = await db.verificationRequest.findUnique({ where: { id } });
    if (!request) {
      return NextResponse.json({ error: "Request not found" }, { status: 404 });
    }

    const approved = parsed.data.action === "approve";
    const updated = await db.verificationRequest.update({
      where: { id },
      data: {
        status: approved ? "approved" : "rejected",
        reviewedAt: new Date(),
      },
    });

    if (approved) {
      const profile = await db.profile.findUnique({ where: { id: request.profileId } });
      if (profile) {
        // Promote verification state: blue → green on approval, green stays, gold untouched
        const nextTier =
          profile.verificationTier === "gold"
            ? "gold"
            : profile.verificationTier === "green"
              ? "green"
              : "green";
        await db.profile.update({
          where: { id: request.profileId },
          data: {
            idVerified: true,
            verificationStatus: "approved",
            verificationTier: nextTier,
            trustScore: Math.min(100, profile.trustScore + 20),
          },
        });
        await db.notification.create({
          data: {
            profileId: request.profileId,
            type: "verification",
            title: "Your ID verification is approved",
            body: "Alhamdulillah! Your trust score has increased and your profile now displays a verified badge.",
          },
        });
      }
    } else {
      await db.profile.update({
        where: { id: request.profileId },
        data: { verificationStatus: "rejected" },
      });
      await db.notification.create({
        data: {
          profileId: request.profileId,
          type: "verification",
          title: "ID verification needs attention",
          body: "We could not verify your document. Please re-upload a clearer photo of your ID.",
        },
      });
    }

    return NextResponse.json({ request: updated });
  } catch (error) {
    console.error("PATCH /api/admin/verifications/[id] error:", error);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
