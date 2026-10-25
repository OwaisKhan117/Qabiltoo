import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const gender = sp.get("gender") ?? undefined;
    const minAge = sp.get("minAge") ? Number(sp.get("minAge")) : undefined;
    const maxAge = sp.get("maxAge") ? Number(sp.get("maxAge")) : undefined;
    const city = sp.get("city")?.trim();
    const maritalStatus = sp.get("maritalStatus") ?? undefined;
    const sect = sp.get("sect") ?? undefined;
    const page = Math.max(1, Number(sp.get("page") ?? 1));
    const limit = Math.min(48, Math.max(1, Number(sp.get("limit") ?? 12)));

    const where: Record<string, unknown> = {};
    if (gender === "male" || gender === "female") where.gender = gender;
    if (maritalStatus) where.maritalStatus = maritalStatus;
    if (sect) where.sect = sect;
    if (city) where.city = { contains: city };
    if (minAge !== undefined && !Number.isNaN(minAge) || maxAge !== undefined && !Number.isNaN(maxAge)) {
      const ageFilter: Record<string, number> = {};
      if (minAge !== undefined && !Number.isNaN(minAge)) ageFilter.gte = minAge;
      if (maxAge !== undefined && !Number.isNaN(maxAge)) ageFilter.lte = maxAge;
      where.age = ageFilter;
    }
    if (q) {
      where.OR = [
        { fullName: { contains: q } },
        { city: { contains: q } },
        { profession: { contains: q } },
        { education: { contains: q } },
      ];
    }

    const [profiles, total] = await Promise.all([
      db.profile.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.profile.count({ where }),
    ]);

    return NextResponse.json({
      profiles,
      total,
      page,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    });
  } catch (error) {
    console.error("GET /api/profiles error:", error);
    return NextResponse.json({ error: "Failed to fetch profiles" }, { status: 500 });
  }
}

const createProfileSchema = z.object({
  fullName: z.string().min(2, "Name is too short").max(80),
  gender: z.enum(["male", "female"]),
  age: z.coerce.number().int().min(18, "Must be at least 18").max(80),
  height: z.string().min(3).max(20),
  city: z.string().min(2).max(60),
  state: z.string().min(2).max(60),
  education: z.string().min(2).max(120),
  profession: z.string().min(2).max(120),
  income: z.string().max(60).optional().nullable(),
  maritalStatus: z.string().min(2).max(40),
  sect: z.string().max(40).optional().nullable(),
  religiousLevel: z.string().max(40).optional().nullable(),
  namaz: z.string().max(40).optional().nullable(),
  about: z.string().min(30, "Please write at least 30 characters").max(2000),
  partnerPreference: z.string().max(2000).optional().nullable(),
  image: z.string().min(1).max(300),
  email: z.string().email("Please enter a valid email").max(120),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid data" },
        { status: 400 }
      );
    }

    const existing = await db.profile.findUnique({ where: { email: parsed.data.email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists. Please sign in instead." },
        { status: 409 }
      );
    }

    const profile = await db.profile.create({ data: parsed.data });
    return NextResponse.json({ profile }, { status: 201 });
  } catch (error) {
    console.error("POST /api/profiles error:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
