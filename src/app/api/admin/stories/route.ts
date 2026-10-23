import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export const dynamic = "force-dynamic";

/** All stories (including unapproved) for admin content management */
export async function GET() {
  try {
    const stories = await db.successStory.findMany({
      orderBy: [{ createdAt: "desc" }],
    });
    return NextResponse.json({ stories });
  } catch (error) {
    console.error("GET /api/admin/stories error:", error);
    return NextResponse.json({ error: "Failed to fetch stories" }, { status: 500 });
  }
}

const createSchema = z.object({
  coupleNames: z.string().min(2).max(80),
  title: z.string().min(4).max(140),
  quote: z.string().min(10).max(280),
  story: z.string().min(30).max(4000),
  image: z.string().min(2).max(300),
  city: z.string().min(2).max(60),
  country: z.string().max(60).optional(),
  marriedAt: z.string().min(2).max(40),
  featured: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = createSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid story" },
        { status: 400 }
      );
    }
    const story = await db.successStory.create({
      data: { ...parsed.data, country: parsed.data.country ?? "India", approved: true },
    });
    return NextResponse.json({ story }, { status: 201 });
  } catch (error) {
    console.error("POST /api/admin/stories error:", error);
    return NextResponse.json({ error: "Failed to create story" }, { status: 500 });
  }
}
