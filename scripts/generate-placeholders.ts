import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "public/images/products");
const WIDTH = 1200;
const HEIGHT = 1600; // 3:4

// [slug, name, view 1 color, view 2 color, text color]
const items = [
  [
    "heavyweight-boxy-tee",
    "Heavyweight Boxy Tee",
    "#CDBBA0",
    "#B9A786",
    "#111111",
  ],
  ["wool-overshirt", "Wool Overshirt", "#5B6240", "#4A5133", "#F4F0E8"],
  [
    "tailored-pleated-trouser",
    "Tailored Pleated Trouser",
    "#1F2A44",
    "#2B3858",
    "#F4F0E8",
  ],
  [
    "longline-trench-coat",
    "Longline Trench Coat",
    "#D8C9AE",
    "#C4B391",
    "#111111",
  ],
  ["slip-midi-dress", "Slip Midi Dress", "#111111", "#262626", "#F4F0E8"],
  ["ribbed-knit-polo", "Ribbed Knit Polo", "#F4F0E8", "#E6DFD0", "#111111"],
  [
    "leather-card-holder",
    "Leather Card Holder",
    "#3B2A20",
    "#4D392C",
    "#F4F0E8",
  ],
  ["utility-cargo-pant", "Utility Cargo Pant", "#6B7350", "#59613F", "#F4F0E8"],
] as const;

function buildSvg(name: string, view: number, bg: string, fg: string) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}">
  <rect width="100%" height="100%" fill="${bg}"/>
  <text x="80" y="${HEIGHT - 190}" font-family="sans-serif" font-size="30"
        letter-spacing="8" fill="${fg}" opacity="0.6">VIEW ${view}</text>
  <text x="80" y="${HEIGHT - 110}" font-family="sans-serif" font-size="72"
        font-weight="600" fill="${fg}">${name}</text>
</svg>`;
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });

  for (const [slug, name, c1, c2, fg] of items) {
    for (const [index, bg] of [c1, c2].entries()) {
      const file = path.join(OUT_DIR, `${slug}-${index + 1}.jpg`);
      await sharp(Buffer.from(buildSvg(name, index + 1, bg, fg)))
        .jpeg({ quality: 85 })
        .toFile(file);
    }
  }
  console.log(`Generated ${items.length * 2} placeholder images in ${OUT_DIR}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
