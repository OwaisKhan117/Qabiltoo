import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProfile } from "@/lib/qabiltoo/serialize";

export const dynamic = "force-dynamic";

/**
 * GET /api/views?profileId=X
 * Returns viewers of a profile, most recent first.
 * `locked` = viewer identity hidden behind premium paywall.
 * Rule: Free/Silver members see 1 teaser unlocked; Gold/Assisted/Unlimited see all.
 * The viewer's tier is resolved from the database — never trusted from the client.
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const profileId = sp.get("profileId");
    if (!profileId) {
      return NextResponse.json({ error: "profileId required" }, { status: 400 });
    }

    // Tier comes from the DB (query param accepted for compatibility but not trusted)
    const owner = await db.profile.findUnique({
      where: { id: profileId },
      select: { tier: true },
    });
    if (!owner) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }
    const tier = owner.tier;

    const views = await db.profileView.findMany({
      where: { profileId },
      orderBy: { createdAt: "desc" },
      take: 40,
      include: {
        viewer: {
          select: {
            id: true,
            fullName: true,
            age: true,
            city: true,
            state: true,
            country: true,
            profession: true,
            image: true,
            gender: true,
            verificationTier: true,
            trustScore: true,
            about: true,
          },
        },
      },
    });

    const premium = tier === "Gold" || tier === "Assisted" || tier === "Unlimited";

    const viewers = views.map((v, i) => ({
      viewer: serializeProfile(v.viewer),
      viewedAt: v.createdAt.toISOString(),
      // First view is a free teaser; the rest are premium-locked
      locked: !premium && i > 0,
    }));

    return NextResponse.json({ viewers, total: views.length });
  } catch (error) {
    console.error("GET /api/views error:", error);
    return NextResponse.json({ error: "Failed to fetch views" }, { status: 500 });
  }
}
