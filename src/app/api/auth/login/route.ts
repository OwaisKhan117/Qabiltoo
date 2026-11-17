import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { serializeProfile } from "@/lib/qabiltoo/serialize";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().min(1, "Please enter your email"),
});

/** The canonical demo account email (Ayesha Siddiqui). */
const DEMO_EMAIL = "ayesha@demo.qabiltoo.in";

/**
 * Flexible demo-handle matcher.
 * Lets reviewers type "ayesha", "Ayesha Siddiqui", "demo", "ayesha@demo", etc.
 * and still land on the demo account — no password is needed in the demo build.
 */
function resolveDemoHandle(input: string): string | null {
  const value = input.trim().toLowerCase();
  if (!value) return null;

  // Strip a domain if present: "ayesha@demo.qabiltoo.in" → "ayesha"
  const localPart = value.includes("@") ? value.split("@")[0] : value;

  if (
    value.includes("demo") ||
    localPart.includes("ayesha") ||
    localPart.includes("siddiqui")
  ) {
    return DEMO_EMAIL;
  }
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const parsed = loginSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();

    // 1) Exact email match (registered users)
    let profile = await db.profile.findUnique({ where: { email } });

    // 2) Friendly demo handles → demo account
    if (!profile) {
      const demoEmail = resolveDemoHandle(email);
      if (demoEmail) {
        profile = await db.profile.findUnique({ where: { email: demoEmail } });
      }
    }

    if (!profile) {
      return NextResponse.json(
        {
          error:
            "No profile found with this email. For the demo, just type \"ayesha\" or tap the demo button below.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile: serializeProfile(profile) });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
