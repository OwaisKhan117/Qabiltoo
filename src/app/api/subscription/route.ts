import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { serializeProfile } from "@/lib/qabiltoo/serialize";
import { findPlan } from "@/components/qabiltoo/pricing/plans";

export const dynamic = "force-dynamic";

/**
 * POST /api/subscription
 * Demo checkout: activates a membership plan on a profile.
 * The real gateway (Razorpay / Stripe) will confirm payment here later —
 * the response shape will stay the same.
 */
const activationSchema = z.object({
  profileId: z.string().min(1, "profileId is required"),
  planId: z.string().min(1, "planId is required"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = activationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 }
      );
    }
    const { profileId, planId } = parsed.data;

    const plan = findPlan(planId);
    if (!plan) {
      return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
    }

    const profile = await db.profile.findUnique({ where: { id: profileId } });
    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Plan activation + member notification are independent writes → parallel
    const [updated] = await Promise.all([
      db.profile.update({
        where: { id: profile.id },
        data: { tier: plan.tier },
      }),
      db.notification.create({
        data: {
          profileId: profile.id,
          type: "system",
          title: `${plan.name} activated`,
          body:
            plan.durationMonths === null
              ? "Your Unlimited membership is active until you find your match — chat is now unlocked. Barakallahu feek."
              : `Your ${plan.duration} membership is active — chat is now unlocked. Barakallahu feek.`,
        },
      }),
    ]);

    return NextResponse.json({ profile: serializeProfile(updated) });
  } catch (error) {
    console.error("POST /api/subscription error:", error);
    return NextResponse.json({ error: "Failed to activate plan" }, { status: 500 });
  }
}
