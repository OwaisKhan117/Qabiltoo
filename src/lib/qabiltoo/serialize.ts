/**
 * Serialize a Prisma Profile row for API responses.
 * - Parses the JSON-string `photos` column into an array.
 */
export function serializeProfile<T extends { photos?: unknown; image?: string | null }>(
  p: T
): Omit<T, "photos"> & { photos: string[] } {
  let photos: string[] = [];
  if (Array.isArray(p.photos)) {
    photos = p.photos as string[];
  } else if (typeof p.photos === "string") {
    try {
      const parsed = JSON.parse(p.photos);
      if (Array.isArray(parsed)) photos = parsed.filter((x) => typeof x === "string");
    } catch {
      photos = [];
    }
  }
  if (!photos.length && p.image) photos = [p.image];
  const { photos: _raw, ...rest } = p as Record<string, unknown>;
  return { ...(rest as T), photos } as Omit<T, "photos"> & { photos: string[] };
}

export function parseJsonArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.filter((x) => typeof x === "string") as string[];
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      if (Array.isArray(parsed)) return parsed.filter((x) => typeof x === "string");
    } catch {
      /* noop */
    }
  }
  return [];
}
