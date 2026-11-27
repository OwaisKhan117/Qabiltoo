import { db } from "@/lib/db";
import { serializeProfile } from "@/lib/qabiltoo/serialize";
import type { ProfilesResponse } from "@/lib/qabiltoo/types";

/**
 * Server-side landing data — mirrors exactly what the public API endpoints
 * return (`/api/profiles?verificationTier=gold&limit=3` and
 * `/api/profiles?limit=8&sort=trust`) so the hero and featured grids are
 * server-rendered with real content instead of skeletons. The client-side
 * React Query hooks keep the same query keys and refresh behavior.
 *
 * Any failure resolves to `undefined` and the page falls back to the
 * client-side fetch — never blocks rendering.
 */

async function fetchHeroGoldProfiles(): Promise<ProfilesResponse | undefined> {
  try {
    const rows = await db.profile.findMany({
      where: { role: { not: "admin" }, verificationTier: "gold" },
      orderBy: { createdAt: "desc" },
      take: 3,
    });
    return {
      profiles: rows.map(serializeProfile),
      total: rows.length,
      page: 1,
      totalPages: 1,
    };
  } catch {
    return undefined;
  }
}

async function fetchFeaturedProfiles(): Promise<ProfilesResponse | undefined> {
  try {
    const rows = await db.profile.findMany({
      where: { role: { not: "admin" } },
      orderBy: { trustScore: "desc" },
      take: 200,
    });
    const serialized = rows.map(serializeProfile);
    /* Interleave brides & grooms for a balanced, respectful showcase
       (identical logic to the client-side fetchFeatured fallback). */
    const brides = serialized.filter((p) => p.gender === "female");
    const grooms = serialized.filter((p) => p.gender === "male");
    const mixed = [];
    for (let i = 0; mixed.length < 8 && i < Math.max(brides.length, grooms.length); i++) {
      if (brides[i]) mixed.push(brides[i]);
      if (grooms[i]) mixed.push(grooms[i]);
    }
    const profiles = mixed.slice(0, 8);
    return { profiles, total: profiles.length, page: 1, totalPages: 1 };
  } catch {
    return undefined;
  }
}

export interface LandingInitialData {
  heroProfiles?: ProfilesResponse;
  featuredProfiles?: ProfilesResponse;
}

export async function getLandingInitialData(): Promise<LandingInitialData> {
  const [heroProfiles, featuredProfiles] = await Promise.all([
    fetchHeroGoldProfiles(),
    fetchFeaturedProfiles(),
  ]);
  return { heroProfiles, featuredProfiles };
}
