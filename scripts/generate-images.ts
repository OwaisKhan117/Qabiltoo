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
  // ============ HERO ============
  {
    name: 'hero-couple.png',
    size: '864x1152',
    prompt:
      'Breathtaking elegant Indian Muslim wedding couple portrait, beautiful bride wearing emerald green and gold embroidered lehenga with delicate dupatta draped gracefully over her hair, handsome groom wearing ivory cream sherwani with gold buttons, both smiling warmly at each other, luxurious Mughal palace garden background with soft bokeh, warm golden hour lighting, professional wedding photography, cinematic, high quality, detailed',
  },
  // ============ SUCCESS STORY COUPLES ============
  {
    name: 'success-couple-1.png',
    size: '864x1152',
    prompt:
      'Joyful young Indian Muslim newlywed couple, bride wearing maroon and gold hijab with elegant embroidered dress, groom in navy bandhgala suit, holding hands and laughing together, warm autumn park background with soft light, professional engagement photography, high quality, detailed',
  },
  {
    name: 'success-couple-2.png',
    size: '864x1152',
    prompt:
      'Happy Indian Muslim couple at their nikah ceremony, bride in pastel pink and silver hijab with graceful embroidery, groom in white kurta with beige waistcoat, exchanging loving smiles, decorated wedding stage with flowers and fairy lights in background, professional photography, warm tones, high quality',
  },
  {
    name: 'success-couple-3.png',
    size: '864x1152',
    prompt:
      'Sweet Indian Muslim couple standing together on rooftop terrace at dusk, woman wearing sage green modern hijab and modest maxi dress, man in light grey suit, city lights bokeh behind them, romantic warm atmosphere, professional lifestyle photography, high quality, detailed',
  },
  // ============ FEMALE PROFILES ============
  {
    name: 'profile-f1.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a beautiful young Indian Muslim woman wearing an elegant emerald green hijab, warm friendly smile, modest embroidered kurti, soft studio lighting, clean warm beige background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-f2.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a graceful young Indian Muslim woman wearing a dusty rose hijab, gentle confident smile, cream modest attire, soft studio lighting, clean ivory background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-f3.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a smart young Indian Muslim woman wearing a navy blue hijab, bright warm smile, elegant modest blazer, soft studio lighting, clean light grey background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-f4.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a lovely young Indian Muslim woman wearing a soft lavender hijab, kind serene smile, modest pastel attire, soft studio lighting, clean warm cream background, professional matrimonial profile photo, high quality, detailed',
  },
  // ============ MALE PROFILES ============
  {
    name: 'profile-m1.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a handsome young Indian Muslim man with neat trimmed beard wearing an ivory kurta with brown waistcoat, warm confident smile, soft studio lighting, clean warm beige background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-m2.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a charming young Indian Muslim man with light beard wearing a charcoal grey suit with white shirt, friendly smile, soft studio lighting, clean light grey background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-m3.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a pleasant young Indian Muslim man with neat beard wearing a teal kurta, gentle warm smile, soft studio lighting, clean ivory background, professional matrimonial profile photo, high quality, detailed',
  },
  {
    name: 'profile-m4.png',
    size: '864x1152',
    prompt:
      'Professional portrait photograph of a cheerful young Indian Muslim man wearing a navy blazer over white kurta with tidy beard, bright genuine smile, soft studio lighting, clean warm cream background, professional matrimonial profile photo, high quality, detailed',
  },
  // ============ SECTION IMAGERY ============
  {
    name: 'mosque-golden.png',
    size: '1344x768',
    prompt:
      'Majestic Indian Mughal mosque architecture at golden sunset, grand white domes and elegant minarets, warm amber sky with soft clouds, reflection in calm water, serene peaceful atmosphere, professional architectural photography, high quality, detailed',
  },
  {
    name: 'couple-hands.png',
    size: '1344x768',
    prompt:
      'Close-up of Indian Muslim wedding couple hands, bride with intricate mehndi henna designs and gold bangles gently holding groom hand, elegant rings visible, soft warm bokeh background, professional wedding photography, emotional warm tones, high quality, detailed',
  },
];

async function run() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const zai = await ZAI.create();
  const CONCURRENCY = 2;
  let index = 0;

  async function worker(wid: number) {
    while (index < tasks.length) {
      const task = tasks[index++];
      const out = path.join(OUT_DIR, task.name);
      if (fs.existsSync(out)) {
        console.log(`[w${wid}] skip (exists): ${task.name}`);
        continue;
      }
      let ok = false;
      for (let attempt = 1; attempt <= 3 && !ok; attempt++) {
        try {
          console.log(`[w${wid}] generating ${task.name} (${task.size}) attempt ${attempt}...`);
          const resp = await zai.images.generations.create({
            prompt: task.prompt,
            size: task.size,
          });
          const b64 = resp?.data?.[0]?.base64;
          if (!b64) throw new Error('no base64 in response');
          fs.writeFileSync(out, Buffer.from(b64, 'base64'));
          console.log(`[w${wid}] DONE: ${task.name} (${Math.round(b64.length / 1024)}KB b64)`);
          ok = true;
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e);
          console.error(`[w${wid}] attempt ${attempt} failed for ${task.name}: ${msg}`);
          if (attempt < 3) await new Promise((r) => setTimeout(r, 2500 * attempt));
        }
      }
      if (!ok) console.error(`[w${wid}] FAILED PERMANENTLY: ${task.name}`);
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, (_, i) => worker(i)));
  console.log('ALL IMAGE TASKS FINISHED');
}

run().catch((e) => {
  console.error('FATAL', e);
  process.exit(1);
});
