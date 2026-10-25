import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status");
    const requests = await db.verificationRequest.findMany({
      where: status ? { status } : undefined,
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        profile: {
          select: {
            id: true,
            fullName: true,
            image: true,
            city: true,
            state: true,
            verificationTier: true,
            trustScore: true,
          },
        },
      },
    });
    return NextResponse.json({ requests });
  } catch (error) {
    console.error("GET /api/admin/verifications error:", error);
    return NextResponse.json({ error: "Failed to fetch verifications" }, { status: 500 });
  }
}
