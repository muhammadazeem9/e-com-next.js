import sharp from "sharp";
import { readdir } from "node:fs/promises";
import path from "node:path";

const RAW_DIR = path.join(process.cwd(), "raw-images");
const OUT_DIR = path.join(process.cwd(), "public/images/products");

const slugs = [
  "heavyweight-boxy-tee",
  "wool-overshirt",
  "ribbed-knit-polo",
  "tailored-pleated-trouser",
  "longline-trench-coat",
  "slip-midi-dress",
  "leather-card-holder",
  "utility-cargo-pant",
];

async function main() {
  const files = (await readdir(RAW_DIR))
    .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
    .sort();

  if (files.length === 0) {
    console.log("No images found in raw-images/");
    return;
  }

  for (const [index, file] of files.entries()) {
    const slug = slugs[Math.floor(index / 2)];
    if (!slug) {
      console.log(`Skipping ${file}: more than 16 images`);
      continue;
    }
    const view = (index % 2) + 1;
    const out = path.join(OUT_DIR, `${slug}-${view}.jpg`);

    await sharp(path.join(RAW_DIR, file))
      .rotate() // respects phone orientation
      .resize(1200, 1600, { fit: "cover", position: "attention" })
      .jpeg({ quality: 85 })
      .toFile(out);

    console.log(`${file} -> ${slug}-${view}.jpg`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
