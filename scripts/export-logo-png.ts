/* One-off script: rasterize the Qabiltoo SVG logos into PNG fallbacks. */
import sharp from "sharp";
import { readFile } from "fs/promises";

async function svgToPng(svgPath: string, pngPath: string, width: number, height: number, density?: number) {
  const svg = await readFile(svgPath);
  const pipeline = sharp(svg, { density: density ?? 72 }).resize(width, height, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  await pipeline.png().toFile(pngPath);
  console.log(`✓ ${pngPath}`);
}

async function main() {
  // Favicon-sized mark + high-res mark
  await svgToPng("public/logo.svg", "public/logo-mark-64.png", 64, 64);
  await svgToPng("public/logo.svg", "public/logo-mark.png", 512, 512);
  // Wordmark versions (light & dark backgrounds)
  await svgToPng("public/logo-light.svg", "public/logo-light.png", 1280, 320);
  await svgToPng("public/logo-dark.svg", "public/logo-dark.png", 1280, 320);
  console.log("PNG fallbacks done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
