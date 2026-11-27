/**
 * Sequential AVIF-encode sanity check for every content image at Next.js
 * device widths. Writes findings to a log; images that hang the encoder
 * get re-encoded (normalized) automatically.
 */
import sharp from "sharp";
import { readdirSync, writeFileSync } from "fs";
import path from "path";

const dir = path.join(process.cwd(), "public", "images");
const widths = [128, 256, 384, 640, 750, 828];
const lines: string[] = [];

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([p, new Promise<never>((_, rej) => setTimeout(() => rej(new Error("HANG")), ms))]);
}

async function main() {
  const files = readdirSync(dir).filter((f) => f.endsWith(".webp"));
  for (const f of files) {
    for (const w of widths) {
      try {
        await withTimeout(sharp(path.join(dir, f)).resize(w).avif({ quality: 75 }).toBuffer(), 12000);
        lines.push(`OK   ${f} w=${w}`);
      } catch (e) {
        lines.push(`FAIL ${f} w=${w}: ${e instanceof Error ? e.message : e}`);
        // Re-encode the source once if any width hangs
        try {
          const buf = await withTimeout(sharp(path.join(dir, f)).rotate().webp({ quality: 82, effort: 6 }).toBuffer(), 30000);
          writeFileSync(path.join(dir, f), buf);
          lines.push(`FIX  ${f} re-encoded (${buf.length}B)`);
        } catch (e2) {
          lines.push(`ERR  ${f} re-encode failed: ${e2 instanceof Error ? e2.message : e2}`);
        }
        break; // next file
      }
    }
  }
  writeFileSync("/tmp/avif-scan.log", lines.join("\n") + "\n");
  console.log("scan complete");
}

main();
