import fs from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";

/**
 * Runtime database resolution — makes the demo work everywhere with zero config:
 *
 * - Local / sandbox: uses DATABASE_URL or the committed demo db (db/custom.db).
 * - Serverless (Vercel): /var/task is read-only and /tmp starts empty.
 *   The seeded demo database ships inside the deployment bundle, so on first
 *   use we copy it to a writable location (/tmp). Every instance gets a fresh,
 *   fully-seeded demo database — writes work and data resets on cold starts.
 */

const BUNDLED_DB = path.join(process.cwd(), "db", "custom.db");
const MIN_SEEDED_SIZE = 4096; // an initialised SQLite file is always larger than one page

function isSeeded(file: string): boolean {
  try {
    return fs.statSync(file).size > MIN_SEEDED_SIZE;
  } catch {
    return false;
  }
}

function isWritable(target: string): boolean {
  try {
    if (fs.existsSync(target)) {
      fs.accessSync(target, fs.constants.W_OK);
      return true;
    }
    const dir = path.dirname(target);
    fs.mkdirSync(dir, { recursive: true });
    fs.accessSync(dir, fs.constants.W_OK);
    return true;
  } catch {
    return false;
  }
}

/** Copy the bundled demo database into place (atomic via temp file + rename). */
function seedFromBundle(destination: string): void {
  fs.mkdirSync(path.dirname(destination), { recursive: true });
  const tmp = `${destination}.seed-${process.pid}-${Date.now()}`;
  fs.copyFileSync(BUNDLED_DB, tmp);
  fs.renameSync(tmp, destination);
}

function resolveDbFile(): string {
  const configured = process.env.DATABASE_URL?.replace(/^file:/, "").trim();
  const bundledAvailable = isSeeded(BUNDLED_DB);

  const candidates: string[] = [];
  if (configured) candidates.push(configured);
  candidates.push(BUNDLED_DB, "/tmp/qabiltoo-demo.db");

  // 1) Any candidate that is already seeded AND writable wins.
  for (const candidate of candidates) {
    if (isSeeded(candidate) && isWritable(candidate)) return candidate;
  }

  // 2) Seed the first writable candidate from the bundled database.
  for (const candidate of candidates) {
    if (isWritable(candidate)) {
      if (bundledAvailable) seedFromBundle(candidate);
      return candidate;
    }
  }

  // 3) Last resort — bundled file (may be read-only: reads still work).
  return bundledAvailable ? BUNDLED_DB : (configured ?? BUNDLED_DB);
}

const dbFile = resolveDbFile();
const datasourceUrl = `file:${dbFile}`;

if (process.env.NODE_ENV !== "test") {
  console.log(`[qabiltoo] database → ${dbFile}`);
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl,
    log: process.env.NODE_ENV === "production" ? ["error"] : ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
