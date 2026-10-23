import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

const sendSchema = z.object({
  phone: z
    .string()
    .min(8, "Please enter a valid phone number")
    .max(16)
    .regex(/^[+0-9\s-]+$/, "Digits only, optionally starting with +"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = sendSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid phone" },
        { status: 400 }
      );
    }
    const phone = parsed.data.phone.replace(/[\s-]/g, "");

    const existing = await db.profile.findUnique({ where: { phone } });

    // Demo mode: fixed, predictable code. Production would send via SMS gateway.
    const code = "1234";
    await db.otpCode.create({
      data: {
        phone,
        code,
        expiresAt: new Date(Date.now() + 5 * 60 * 1000),
      },
    });

    return NextResponse.json({
      sent: true,
      devCode: code,
      isNew: !existing,
    });
  } catch (error) {
    console.error("POST /api/auth/otp/send error:", error);
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
