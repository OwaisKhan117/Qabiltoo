import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { serializeProfile } from "@/lib/qabiltoo/serialize";

export const dynamic = "force-dynamic";

const loginSchema = z.object({
  email: z.string().min(1, "Please enter your email"),
  password: z.string().optional(),
});

/** The canonical demo account email (Ayesha Siddiqui). */
const DEMO_EMAIL = "ayesha@demo.qabiltoo.in";

/** The admin demo account (Operations). Password-protected. */
const ADMIN_EMAIL = "admin@demo.qabiltoo.in";
const ADMIN_PASSWORD = "admin123";

/**
 * Flexible demo-handle matcher.
 * Lets reviewers type "ayesha", "Ayesha Siddiqui", "demo", "ayesha@demo", etc.
 * and still land on the demo account — no password is needed in the demo build.
 * "admin" resolves to the admin (Operations) demo account, which requires its
 * demo password ("admin123") — enforced below and never accepted without it.
 */
function resolveDemoHandle(input: string): string | null {
  const value = input.trim().toLowerCase();
  if (!value) return null;

  // Strip a domain if present: "ayesha@demo.qabiltoo.in" → "ayesha"
  const localPart = value.includes("@") ? value.split("@")[0] : value;

  // Admin handles must be checked first — the admin email itself contains "demo"
  if (localPart === "admin" || localPart === "operations" || value === ADMIN_EMAIL) {
    return ADMIN_EMAIL;
  }

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
    const password = parsed.data.password?.trim() ?? "";

    // 1) Exact email match (registered users)
    let profile = await db.profile.findUnique({ where: { email } });

    // 2) Friendly demo handles → demo / admin account
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

    // 3) Admin accounts require the admin password — never sign in without it
    if (profile.role === "admin") {
      if (!password) {
        return NextResponse.json(
          { error: "This is an admin account. Please enter the admin password." },
          { status: 401 }
        );
      }
      if (password !== ADMIN_PASSWORD) {
        return NextResponse.json(
          { error: "Incorrect admin password. For the demo, the password is \"admin123\"." },
          { status: 401 }
        );
      }
    }

    return NextResponse.json({ profile: serializeProfile(profile) });
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
