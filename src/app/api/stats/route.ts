import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [totalProfiles, maleCount, femaleCount, cityRows] = await Promise.all([
      db.profile.count(),
      db.profile.count({ where: { gender: "male" } }),
      db.profile.count({ where: { gender: "female" } }),
      db.profile.findMany({ select: { city: true }, distinct: ["city"], orderBy: { city: "asc" } }),
    ]);

    return NextResponse.json({
      totalProfiles,
      maleCount,
      femaleCount,
      cities: cityRows.length,
      cityNames: cityRows.map((c) => c.city),
    });
  } catch (error) {
    console.error("GET /api/stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
