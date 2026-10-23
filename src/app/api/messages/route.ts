import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { serializeProfile } from "@/lib/qabiltoo/serialize";
import { z } from "zod";

export const dynamic = "force-dynamic";

/**
 * GET /api/messages?me=X&with=Y      → full thread (marks incoming read)
 * GET /api/messages?me=X&threads=1   → thread summaries for chat inbox
 */
export async function GET(req: NextRequest) {
  try {
    const sp = req.nextUrl.searchParams;
    const me = sp.get("me");
    const withId = sp.get("with");
    const wantThreads = sp.get("threads") === "1";

    if (!me) {
      return NextResponse.json({ error: "me required" }, { status: 400 });
    }

    if (withId) {
      const threadKey = [me, withId].sort().join(":");
      const messages = await db.message.findMany({
        where: { threadKey },
        orderBy: { createdAt: "asc" },
        take: 300,
      });

      // Mark incoming messages as read
      await db.message.updateMany({
        where: { threadKey, toId: me, readAt: null },
        data: { readAt: new Date() },
      });

      return NextResponse.json({ messages });
    }

    if (wantThreads) {
      const mine = await db.message.findMany({
        where: { OR: [{ fromId: me }, { toId: me }] },
        orderBy: { createdAt: "desc" },
        take: 400,
      });

      const byThread = new Map<string, { last: (typeof mine)[0]; unread: number }>();
      for (const m of mine) {
        const existing = byThread.get(m.threadKey);
        if (!existing) byThread.set(m.threadKey, { last: m, unread: 0 });
        if (m.toId === me && !m.readAt) {
          const entry = byThread.get(m.threadKey)!;
          entry.unread += 1;
        }
      }

      const counterpartIds = [...byThread.values()].map((t) =>
        t.last.fromId === me ? t.last.toId : t.last.fromId
      );
      const profiles = await db.profile.findMany({
        where: { id: { in: counterpartIds } },
      });
      const profileMap = new Map(profiles.map((p) => [p.id, p]));

      const threads = [...byThread.values()]
        .map((t) => {
          const otherId = t.last.fromId === me ? t.last.toId : t.last.fromId;
          const profile = profileMap.get(otherId);
          if (!profile) return null;
          return {
            profile: serializeProfile(profile),
            lastMessage: t.last,
            unread: t.unread,
          };
        })
        .filter(Boolean)
        .sort(
          (a, b) =>
            new Date((b as any).lastMessage.createdAt).getTime() -
            new Date((a as any).lastMessage.createdAt).getTime()
        );

      return NextResponse.json({ threads });
    }

    return NextResponse.json({ error: "with or threads param required" }, { status: 400 });
  } catch (error) {
    console.error("GET /api/messages error:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

const sendSchema = z.object({
  fromId: z.string().min(1),
  toId: z.string().min(1),
  body: z.string().min(1, "Message cannot be empty").max(2000),
});

export async function POST(req: NextRequest) {
  try {
    const parsed = sendSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid message" },
        { status: 400 }
      );
    }
    const { fromId, toId, body } = parsed.data;
    if (fromId === toId) {
      return NextResponse.json({ error: "Cannot message yourself" }, { status: 400 });
    }

    const [from, to] = await Promise.all([
      db.profile.findUnique({ where: { id: fromId } }),
      db.profile.findUnique({ where: { id: toId } }),
    ]);
    if (!from || !to) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Only mutual-accepted pairs may chat (guardian of halal interaction)
    const mutual = await db.interest.findFirst({
      where: { fromId: fromId, toId: toId, status: "accepted" },
    });
    const reverse = await db.interest.findFirst({
      where: { fromId: toId, toId: fromId, status: "accepted" },
    });
    if (!mutual || !reverse) {
      return NextResponse.json(
        { error: "Chat unlocks after both sides accept each other's proposals." },
        { status: 403 }
      );
    }

    const message = await db.message.create({
      data: {
        threadKey: [fromId, toId].sort().join(":"),
        fromId,
        toId,
        body,
      },
    });

    await db.notification.create({
      data: {
        profileId: toId,
        type: "message",
        title: `${from.fullName.split(" ")[0]} sent you a message`,
        body: body.slice(0, 80),
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch (error) {
    console.error("POST /api/messages error:", error);
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}
