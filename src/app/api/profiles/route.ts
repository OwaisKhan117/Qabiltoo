import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";
import { serializeProfile } from "@/lib/qabiltoo/serialize";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const q = sp.get("q")?.trim();
    const gender = sp.get("gender") ?? undefined;
    const minAge = sp.get("minAge") ? Number(sp.get("minAge")) : undefined;
    const maxAge = sp.get("maxAge") ? Number(sp.get("maxAge")) : undefined;
    const city = sp.get("city")?.trim();
    const country = sp.get("country")?.trim();
    const maritalStatus = sp.get("maritalStatus") ?? undefined;
    const sect = sp.get("sect") ?? undefined;
    const education = sp.get("education")?.trim();
    const profession = sp.get("profession")?.trim();
    const income = sp.get("income") ?? undefined;
    const relocate = sp.get("relocate");
    const verificationTier = sp.get("verificationTier") ?? undefined;
    const sort = sp.get("sort") ?? "recent";
    const page = Math.max(1, Number(sp.get("page") ?? 1));
    const limit = Math.min(48, Math.max(1, Number(sp.get("limit") ?? 12)));

    const where: Record<string, unknown> = {};
    if (gender === "male" || gender === "female") where.gender = gender;
    if (maritalStatus) where.maritalStatus = maritalStatus;
    if (sect) where.sect = sect;
    if (city) where.city = { contains: city };
    if (country) where.country = country;
    if (education) where.education = { contains: education };
    if (profession) where.profession = { contains: profession };
    if (income) where.income = { contains: income };
    if (verificationTier) where.verificationTier = verificationTier;
    if (relocate === "true") where.relocate = true;
    if (relocate === "false") where.relocate = false;
    if (
      (minAge !== undefined && !Number.isNaN(minAge)) ||
      (maxAge !== undefined && !Number.isNaN(maxAge))
    ) {
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

    const orderBy =
      sort === "trust"
        ? { trustScore: "desc" as const }
        : sort === "active"
          ? { lastActive: "desc" as const }
          : { createdAt: "desc" as const };

    const [rows, total] = await Promise.all([
      db.profile.findMany({
        where,
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      db.profile.count({ where }),
    ]);

    return NextResponse.json({
      profiles: rows.map(serializeProfile),
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
  height: z.string().max(20).optional().nullable(),
  city: z.string().max(60).optional().nullable(),
  state: z.string().max(60).optional().nullable(),
  country: z.string().max(60).optional().nullable(),
  education: z.string().max(120).optional().nullable(),
  profession: z.string().max(120).optional().nullable(),
  income: z.string().max(60).optional().nullable(),
  maritalStatus: z.string().max(40).optional().nullable(),
  sect: z.string().max(40).optional().nullable(),
  religiousLevel: z.string().max(40).optional().nullable(),
  namaz: z.string().max(40).optional().nullable(),
  quranLevel: z.string().max(40).optional().nullable(),
  hijabBeard: z.string().max(40).optional().nullable(),
  about: z.string().min(10, "Please tell us a little about yourself").max(2000),
  partnerPreference: z.string().max(2000).optional().nullable(),
  familyInfo: z.string().max(2000).optional().nullable(),
  image: z.string().max(300).optional().nullable(),
  photos: z.array(z.string().max(300)).max(6).optional(),
  email: z.string().email("Please enter a valid email").max(120).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
  onBehalfOf: z.enum(["self", "family"]).optional(),
  waliName: z.string().max(80).optional().nullable(),
  waliPhone: z.string().max(30).optional().nullable(),
  waliRelation: z.string().max(40).optional().nullable(),
  relocate: z.boolean().optional(),
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
    const d = parsed.data;

    if (d.email) {
      const existing = await db.profile.findUnique({ where: { email: d.email } });
      if (existing) {
        return NextResponse.json(
          { error: "An account with this email already exists. Please sign in instead." },
          { status: 409 }
        );
      }
    }
    if (d.phone) {
      const existingPhone = await db.profile.findUnique({ where: { phone: d.phone } });
      if (existingPhone) {
        return NextResponse.json(
          { error: "An account with this phone already exists. Please sign in instead." },
          { status: 409 }
        );
      }
    }
    if (!d.email && !d.phone) {
      return NextResponse.json(
        { error: "Either an email or phone number is required." },
        { status: 400 }
      );
    }

    const initials = d.fullName
      .split(" ")
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const profile = await db.profile.create({
      data: {
        ...d,
        height: d.height ?? "",
        city: d.city ?? "",
        state: d.state ?? "",
        education: d.education ?? "",
        profession: d.profession ?? "",
        maritalStatus: d.maritalStatus ?? "Never Married",
        about: d.about,
        image: d.image || `/api/avatar/${initials || "QT"}`,
        photos: JSON.stringify(d.photos?.length ? d.photos : d.image ? [d.image] : []),
        verificationStatus: "none",
        trustScore: 45,
        tier: "Free",
        verificationTier: "blue",
      },
    });
    return NextResponse.json({ profile: serializeProfile(profile) }, { status: 201 });
  } catch (error) {
    console.error("POST /api/profiles error:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}
