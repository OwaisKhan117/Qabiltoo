/**
 * Convert all content PNG images in public/images to WebP.
 * - Same pixel dimensions (864×1152 sources serve all display sizes incl. retina)
 * - Quality 82 → visually identical, ~60-75% smaller
 */
import { readdirSync, unlinkSync } from "fs";
import path from "path";
import sharp from "sharp";

const dir = path.join(process.cwd(), "public", "images");

async function main() {
  const files = readdirSync(dir).filter((f) => f.endsWith(".png"));
  for (const file of files) {
    const src = path.join(dir, file);
    const dest = path.join(dir, file.replace(/\.png$/, ".webp"));
    await sharp(src).webp({ quality: 82, effort: 6 }).toFile(dest);
    console.log(`converted ${file} → ${path.basename(dest)}`);
  }
  console.log("done");
}

main();
