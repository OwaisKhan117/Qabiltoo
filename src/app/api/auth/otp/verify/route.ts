import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { serializeProfile } from "@/lib/qabiltoo/serialize";

export const dynamic = "force-dynamic";

const verifySchema = z.object({
  phone: z.string().min(8).max(16),
  code: z.string().min(4).max(6),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = verifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const phone = parsed.data.phone.replace(/[\s-]/g, "");

    const otp = await db.otpCode.findFirst({
      where: {
        phone,
        code: parsed.data.code,
        consumed: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return NextResponse.json(
        { ok: false, error: "Invalid or expired code. For this demo the code is 1234." },
        { status: 401 }
      );
    }

    await db.otpCode.update({ where: { id: otp.id }, data: { consumed: true } });

    const profile = await db.profile.findUnique({ where: { phone } });
    if (profile) {
      return NextResponse.json({ ok: true, profile: serializeProfile(profile), isNew: false });
    }

    // No account yet — onboarding continues client-side; profile is created
    // via POST /api/profiles with this phone at the end of the flow.
    return NextResponse.json({ ok: true, isNew: true, phone });
  } catch (error) {
    console.error("POST /api/auth/otp/verify error:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
