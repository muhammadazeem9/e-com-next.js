import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { ProductModel } from "@/models/Product";

const SIZES = ["XS", "S", "M", "L", "XL"];

function makeVariants(
  prefix: string,
  colors: string[],
  sizes: string[],
  stock = 10,
) {
  return colors.flatMap((color) =>
    sizes.map((size) => ({
      sku: `${prefix}-${color.slice(0, 3).toUpperCase()}-${size}`,
      size,
      color,
      stock,
    })),
  );
}

const swatch = {
  Black: "#111111",
  Ivory: "#F4F0E8",
  Sand: "#CDBBA0",
  Olive: "#5B6240",
  Navy: "#1F2A44",
};

function colorsOf(names: (keyof typeof swatch)[]) {
  return names.map((name) => ({ name, hex: swatch[name] }));
}

const products = [
  {
    name: "Heavyweight Boxy Tee",
    slug: "heavyweight-boxy-tee",
    description: "Dense 240gsm cotton jersey with a relaxed, boxy cut.",
    price: 4800,
    category: "tops",
    collectionName: "Essentials",
    featured: true,
    colors: colorsOf(["Black", "Ivory", "Sand"]),
    variants: makeVariants("HBT", ["Black", "Ivory", "Sand"], SIZES),
  },
  {
    name: "Wool Overshirt",
    slug: "wool-overshirt",
    description: "Brushed wool blend overshirt with a structured collar.",
    price: 14500,
    category: "outerwear",
    collectionName: "Autumn 26",
    featured: true,
    colors: colorsOf(["Olive", "Black"]),
    variants: makeVariants("WOS", ["Olive", "Black"], SIZES, 6),
  },
  {
    name: "Tailored Pleated Trouser",
    slug: "tailored-pleated-trouser",
    description: "Wide-leg trouser with a high rise and double pleats.",
    price: 11000,
    compareAtPrice: 13500,
    category: "bottoms",
    collectionName: "Autumn 26",
    featured: true,
    colors: colorsOf(["Sand", "Navy"]),
    variants: makeVariants("TPT", ["Sand", "Navy"], SIZES, 8),
  },
  {
    name: "Longline Trench Coat",
    slug: "longline-trench-coat",
    description: "Water-resistant cotton twill, belted, mid-calf length.",
    price: 26000,
    category: "outerwear",
    collectionName: "Autumn 26",
    featured: true,
    colors: colorsOf(["Sand"]),
    variants: makeVariants("LTC", ["Sand"], SIZES, 4),
  },
  {
    name: "Slip Midi Dress",
    slug: "slip-midi-dress",
    description: "Bias-cut satin slip dress with adjustable straps.",
    price: 12500,
    category: "dresses",
    collectionName: "Evening",
    colors: colorsOf(["Black", "Ivory"]),
    variants: makeVariants("SMD", ["Black", "Ivory"], SIZES, 7),
  },
  {
    name: "Ribbed Knit Polo",
    slug: "ribbed-knit-polo",
    description: "Fine-gauge ribbed knit with a slim fit.",
    price: 8900,
    category: "tops",
    collectionName: "Essentials",
    isNewArrival: true,
    colors: colorsOf(["Navy", "Ivory"]),
    variants: makeVariants("RKP", ["Navy", "Ivory"], SIZES, 9),
  },
  {
    name: "Leather Card Holder",
    slug: "leather-card-holder",
    description: "Vegetable-tanned leather, four card slots.",
    price: 5500,
    category: "accessories",
    collectionName: "Essentials",
    colors: colorsOf(["Black"]),
    variants: makeVariants("LCH", ["Black"], ["OS"], 25),
  },
  {
    name: "Utility Cargo Pant",
    slug: "utility-cargo-pant",
    description: "Cotton ripstop cargo with adjustable hems.",
    price: 9800,
    category: "bottoms",
    collectionName: "Autumn 26",
    isNewArrival: true,
    colors: colorsOf(["Olive", "Black"]),
    variants: makeVariants("UCP", ["Olive", "Black"], SIZES, 8),
  },
];

const IMAGES_PER_PRODUCT = 2;

function imagesFor(slug: string, name: string) {
  return Array.from({ length: IMAGES_PER_PRODUCT }, (_, i) => ({
    url: `/images/products/${slug}-${i + 1}.jpg`,
    alt: `${name}, view ${i + 1}`,
  }));
}

async function main() {
  await connectDB();
  await ProductModel.deleteMany({}); // dev only: wipes the collection
  const withImages = products.map((p) => ({
    ...p,
    images: imagesFor(p.slug, p.name),
  }));
  const created = await ProductModel.insertMany(withImages);
  console.log(`Seeded ${created.length} products`);
  await mongoose.disconnect();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
