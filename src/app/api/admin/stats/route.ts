import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [
      totalProfiles,
      femaleCount,
      pendingVerifications,
      openReports,
      acceptedProposals,
      totalProposals,
      messagesCount,
      goldMembers,
    ] = await Promise.all([
      db.profile.count(),
      db.profile.count({ where: { gender: "female" } }),
      db.verificationRequest.count({ where: { status: "pending" } }),
      db.report.count({ where: { status: "open" } }),
      db.interest.count({ where: { status: "accepted" } }),
      db.interest.count(),
      db.message.count(),
      db.profile.count({ where: { tier: { in: ["Gold", "Platinum"] } } }),
    ]);

    const allProfiles = await db.profile.findMany({
      select: { createdAt: true, country: true, idVerified: true },
    });

    // Signups per day, last 7 days
    const days: { date: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 3600 * 1000);
      const key = d.toISOString().slice(0, 10);
      const next = new Date(d.getTime() + 24 * 3600 * 1000);
      const count = allProfiles.filter(
        (p) => p.createdAt >= d && p.createdAt < next
      ).length;
      days.push({ date: key, count });
    }

    const countries = new Set(allProfiles.map((p) => p.country)).size;
    const verified = allProfiles.filter((p) => p.idVerified).length;
    const newSignupsToday = days[days.length - 1]?.count ?? 0;

    return NextResponse.json({
      totalProfiles,
      newSignupsToday,
      newSignups7d: days,
      pendingVerifications,
      openReports,
      acceptedProposals,
      totalProposals,
      messagesCount,
      goldMembers,
      countries,
      genderSplit: { male: totalProfiles - femaleCount, female: femaleCount },
      verifiedShare: totalProfiles ? Math.round((verified / totalProfiles) * 100) : 0,
    });
  } catch (error) {
    console.error("GET /api/admin/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
