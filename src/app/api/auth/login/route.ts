import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { serializeProfile } from "@/lib/qabiltoo/serialize";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = loginSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const profile = await db.profile.findUnique({
      where: { email: parsed.data.email.toLowerCase() },
    });
    if (!profile) {
      return NextResponse.json(
        { error: "No profile found with this email. Please join Qabiltoo first." },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile: serializeProfile(profile) });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
