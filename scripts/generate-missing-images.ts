/**
 * Generate the missing profile/couple images referenced by the demo database
 * (they previously 404'd on the live site), then encode them as WebP to
 * match the rest of the optimized image set.
 */
import { writeFileSync, unlinkSync, existsSync } from "fs";
import path from "path";
import sharp from "sharp";
import ZAI from "z-ai-web-dev-sdk";

const dir = path.join(process.cwd(), "public", "images");

const STYLE =
  "professional portrait photography, soft warm studio lighting, plain warm beige studio background, gentle smile, modest, dignified, high quality, photorealistic";

const JOBS: { file: string; prompt: string }[] = [
  { file: "profile-f6.webp", prompt: `Portrait of a cheerful 23-year-old South Asian Muslim woman wearing a sage green hijab and ivory kurta, ${STYLE}` },
  { file: "profile-f8.webp", prompt: `Portrait of a warm 24-year-old South Asian Muslim woman wearing a dusty rose hijab and cream embroidered suit, ${STYLE}` },
  { file: "profile-f9.webp", prompt: `Portrait of a confident 26-year-old South Asian Muslim woman wearing an emerald green hijab and gold-beige kurta, ${STYLE}` },
  { file: "profile-f10.webp", prompt: `Portrait of a graceful 31-year-old South Asian Muslim woman wearing an ivory hijab and taupe formal blazer, ${STYLE}` },
  { file: "profile-m5.webp", prompt: `Portrait of a distinguished 32-year-old South Asian Muslim man with a neat beard wearing a charcoal sherwani, ${STYLE}` },
  { file: "profile-m6.webp", prompt: `Portrait of a friendly 29-year-old South Asian Muslim man with a trimmed beard wearing a beige kurta, ${STYLE}` },
  { file: "profile-m7.webp", prompt: `Portrait of a cheerful 25-year-old South Asian Muslim man with a short beard wearing a white kurta and olive waistcoat, ${STYLE}` },
  { file: "profile-m8.webp", prompt: `Portrait of a calm 31-year-old South Asian Muslim man with a full beard wearing a deep green kurta, ${STYLE}` },
  { file: "profile-m9.webp", prompt: `Portrait of a kind 33-year-old South Asian Muslim man with a neat beard wearing a sand-colored formal suit, ${STYLE}` },
  { file: "profile-m10.webp", prompt: `Portrait of a bright 27-year-old South Asian Muslim man with a light beard wearing a warm grey blazer over a white kurta, ${STYLE}` },
  { file: "success-couple-4.webp", prompt: `Happy newlywed South Asian Muslim couple, bride in ivory hijab and groom in cream sherwani, holding hands warmly, ${STYLE}` },
  { file: "success-couple-5.webp", prompt: `Joyful newlywed South Asian Muslim couple, bride in blush pink hijab and groom in emerald sherwani, smiling together, ${STYLE}` },
];

async function main() {
  const zai = await ZAI.create();
  for (const job of JOBS) {
    const dest = path.join(dir, job.file);
    if (existsSync(dest)) {
      console.log(`skip (exists): ${job.file}`);
      continue;
    }
    let ok = false;
    for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
      try {
        const res = await zai.images.generations.create({ prompt: job.prompt, size: "864x1152" });
        const b64 = res.data?.[0]?.base64;
        if (!b64) throw new Error("no image data");
        const tmp = `/tmp/${job.file}.png`;
        writeFileSync(tmp, Buffer.from(b64, "base64"));
        await sharp(tmp).webp({ quality: 82, effort: 6 }).toFile(dest);
        unlinkSync(tmp);
        ok = true;
        console.log(`generated: ${job.file}`);
      } catch (err) {
        console.error(`attempt ${attempt} failed for ${job.file}:`, err instanceof Error ? err.message : err);
        if (attempt < 3) await new Promise((r) => setTimeout(r, 1500));
      }
    }
    if (!ok) console.error(`FAILED permanently: ${job.file}`);
  }
  console.log("done");
}

main();
