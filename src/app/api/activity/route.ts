import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { displayName } from "@/lib/qabiltoo/types";

export const dynamic = "force-dynamic";

const JOIN_TEMPLATES = [
  "Ahmed from Dubai just joined Qabiltoo",
  "Fatima from Hyderabad created her profile",
  "Bilal from Lucknow just joined",
  "Mariam from London is now verified",
  "Ibrahim from Bengaluru just joined",
  "Khadija from Chennai created her profile",
];
const PROPOSAL_TEMPLATES = [
  "3 new proposals sent in the last hour",
  "A proposal was just sent to a bride in Mumbai",
  "2 families in Delhi started matchmaking today",
  "A wakeel from Pune just sent a proposal",
];
const MATCH_TEMPLATES = [
  "Zaid & Ayesha accepted each other — MashaAllah",
  "A couple in Bengaluru just matched",
  "Two families in Kolkata agreed to a match",
];

/**
 * GET /api/activity — live ticker feed.
 * Blends REAL recent platform events with clearly-sampled placeholders
 * to keep the ticker alive on a fresh demo database.
 */
export async function GET(_req: NextRequest) {
  try {
    const [recentInterests, recentAccepted, recentProfiles] = await Promise.all([
      db.interest.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        include: { from: { select: { fullName: true, city: true, state: true, gender: true } } },
      }),
      db.interest.findMany({
        where: { status: "accepted" },
        orderBy: { createdAt: "desc" },
        take: 3,
        include: {
          from: { select: { fullName: true, city: true, state: true, gender: true } },
          to: { select: { fullName: true, city: true, state: true, gender: true } },
        },
      }),
      db.profile.findMany({
        orderBy: { createdAt: "desc" },
        take: 4,
        select: { fullName: true, city: true, state: true, country: true, createdAt: true },
      }),
    ]);

    const items: {
      id: string;
      text: string;
      type: "join" | "proposal" | "match" | "verification" | "success";
      createdAt: string;
      sample: boolean;
    }[] = [];

    recentProfiles.forEach((p, i) => {
      items.push({
        id: `join-${p.fullName}-${i}`,
        text: `${displayName(p.fullName)} from ${p.city}, ${p.country === "India" ? p.state : p.country} just joined Qabiltoo`,
        type: "join",
        createdAt: p.createdAt.toISOString(),
        sample: false,
      });
    });
    recentInterests.forEach((i2, idx) => {
      items.push({
        id: `proposal-${i2.id}`,
        text: `${displayName(i2.from.fullName)} from ${i2.from.city} sent a respectful proposal`,
        type: "proposal",
        createdAt: i2.createdAt.toISOString(),
        sample: false,
      });
      void idx;
    });
    recentAccepted.forEach((i3) => {
      items.push({
        id: `match-${i3.id}`,
        text: `${displayName(i3.from.fullName)} & ${displayName(i3.to.fullName)} accepted each other — MashaAllah`,
        type: "match",
        createdAt: i3.createdAt.toISOString(),
        sample: false,
      });
    });

    // Simulated sample items (clearly marked) to keep the ticker lively
    const nowId = Date.now();
    JOIN_TEMPLATES.forEach((t, i) =>
      items.push({
        id: `sample-join-${nowId}-${i}`,
        text: t,
        type: "join",
        createdAt: new Date(nowId - (i + 1) * 9 * 60_000).toISOString(),
        sample: true,
      })
    );
    PROPOSAL_TEMPLATES.forEach((t, i) =>
      items.push({
        id: `sample-proposal-${nowId}-${i}`,
        text: t,
        type: "proposal",
        createdAt: new Date(nowId - (i + 2) * 14 * 60_000).toISOString(),
        sample: true,
      })
    );
    MATCH_TEMPLATES.forEach((t, i) =>
      items.push({
        id: `sample-match-${nowId}-${i}`,
        text: t,
        type: "match",
        createdAt: new Date(nowId - (i + 3) * 21 * 60_000).toISOString(),
        sample: true,
      })
    );

    // Deduplicate by text and take the most recent 12
    const seen = new Set<string>();
    const feed = items
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .filter((i4) => {
        if (seen.has(i4.text)) return false;
        seen.add(i4.text);
        return true;
      })
      .slice(0, 12);

    return NextResponse.json({ items: feed });
  } catch (error) {
    console.error("GET /api/activity error:", error);
    return NextResponse.json({ error: "Failed to fetch activity" }, { status: 500 });
  }
}
