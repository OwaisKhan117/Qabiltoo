import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const OUT_DIR = '/home/z/my-project/public/images';

interface ImgTask {
  name: string;
  prompt: string;
  size: string;
}

const tasks: ImgTask[] = [
  // ============ FEMALE PROFILES (f5–f10) ============
  {
    name: 'profile-f5.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a graceful young Indian Muslim woman wearing a soft sage green hijab, warm gentle smile, modest beige abaya with subtle embroidery, soft studio lighting, clean warm cream background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-f6.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of an elegant young Indian Muslim woman wearing a deep maroon hijab with gold pins, kind confident expression, modest teal kurti, soft studio lighting, clean ivory background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-f7.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a cheerful young Indian Muslim woman wearing a light lavender hijab, bright warm smile, modest charcoal grey blazer over cream top, soft studio lighting, clean warm beige background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-f8.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a poised young Indian Muslim woman wearing a blush pink hijab, serene gentle smile, modest olive green dress, soft studio lighting, clean light grey background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-f9.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a warm young Indian Muslim woman wearing a white cream hijab, friendly genuine smile, modest mustard yellow kurti with delicate patterns, soft studio lighting, clean ivory background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-f10.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a refined young Indian Muslim woman wearing a teal blue hijab, calm confident smile, modest burgundy embroidered dress, soft studio lighting, clean warm beige background, professional matrimonial profile photo, high quality, detailed',
  },
  // ============ MALE PROFILES (m5–m10) ============
  {
    name: 'profile-m5.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a handsome young Indian Muslim man with a neat trimmed beard, wearing a classic white kurta with beige waistcoat, warm friendly smile, soft studio lighting, clean warm cream background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-m6.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a confident young Indian Muslim man with a full well-groomed beard, wearing a navy blue formal suit with white shirt, gentle warm smile, soft studio lighting, clean light grey background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-m7.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a kind young Indian Muslim man with a short beard, wearing an olive green casual shirt, sincere friendly expression, soft studio lighting, clean ivory background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-m8.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a cheerful young Indian Muslim man with a trimmed beard and glasses, wearing a charcoal grey blazer over white shirt, warm smile, soft studio lighting, clean warm beige background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-m9.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a dignified young Indian Muslim man with a neat beard, wearing an ivory cream sherwani with subtle gold embroidery, gentle confident smile, soft studio lighting, clean light grey background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-m10.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a thoughtful young Indian Muslim man with a light stubble beard, wearing a teal casual kurta, relaxed warm smile, soft studio lighting, clean ivory background, professional matrimonial profile photo, high quality, detailed',
  },
  // ============ SUCCESS STORY COUPLES (4–5) ============
  {
    name: 'success-couple-4.png',
    size: '864x1152',
    prompt:
      'Radiant Indian Muslim newlywed couple in a beautiful garden, bride wearing emerald green and gold hijab lehenga with delicate jewelry, groom in matching ivory sherwani, both laughing joyfully holding hands, lush green garden with marigold flowers, warm afternoon light, professional wedding photography, high quality, detailed',
  },
  {
    name: 'success-couple-5.png',
    size: '864x1152',
    prompt:
      'Tender Indian Muslim couple portrait at their walima reception, bride wearing dusty rose and silver hijab gown with elegant embroidery, groom in black bandhgala with pocket square, gazing at each other lovingly, elegant banquet hall with warm fairy lights bokeh background, professional photography, high quality, detailed',
  },
];

async function main() {
  const zai = await ZAI.create();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  for (const task of tasks) {
    const outPath = path.join(OUT_DIR, task.name);
    if (fs.existsSync(outPath)) {
      console.log(`⏭️  Skip (exists): ${task.name}`);
      continue;
    }
    console.log(`🎨 Generating: ${task.name} (${task.size})`);
    try {
      const response = await zai.images.generations.create({
        prompt: task.prompt,
        size: task.size as any,
      });
      const b64 = response?.data?.[0]?.base64;
      if (!b64) throw new Error('No image data returned');
      fs.writeFileSync(outPath, Buffer.from(b64, 'base64'));
      console.log(`✅ Saved: ${task.name} (${Math.round(b64.length * 0.75 / 1024)} KB)`);
    } catch (err) {
      console.error(`❌ Failed: ${task.name}`, err);
    }
  }
  console.log('All done.');
}

main();
