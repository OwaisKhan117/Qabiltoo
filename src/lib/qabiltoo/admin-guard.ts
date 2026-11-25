import { NextRequest } from "next/server";
import { db } from "@/lib/db";

/**
 * Backend guard for admin API routes.
 *
 * The caller must identify itself with the signed-in profile id —
 * `x-admin-id` header (preferred) or `adminId` query param — and that
 * profile must carry the admin role. Returns the verified profile id
 * when authorized, otherwise null (callers respond 403).
 */
export async function requireAdminId(req: NextRequest): Promise<string | null> {
  const id =
    req.headers.get("x-admin-id") ?? new URL(req.url).searchParams.get("adminId");
  if (!id) return null;
  try {
    const profile = await db.profile.findUnique({
      where: { id },
      select: { role: true },
    });
    return profile?.role === "admin" ? id : null;
  } catch {
    return null;
  }
}
