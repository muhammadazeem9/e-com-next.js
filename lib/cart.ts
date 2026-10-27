import "server-only";
import { cookies } from "next/headers";
import { z } from "zod";
import { getVariantBySku } from "@/lib/products";

const CART_COOKIE = "cart";
const MAX_LINES = 20;
const MAX_QTY = 10;

const lineSchema = z.object({
  sku: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(MAX_QTY),
});
const cartSchema = z.array(lineSchema).max(MAX_LINES);

export type CartLine = z.infer<typeof lineSchema>;
export type CartResult = { ok: boolean; message: string };

export async function readCart(): Promise<CartLine[]> {
  const store = await cookies();
  const raw = store.get(CART_COOKIE)?.value;
  if (!raw) return [];
  try {
    const parsed = cartSchema.safeParse(JSON.parse(raw));
    return parsed.success ? parsed.data : []; // tampered cookie -> empty cart
  } catch {
    return [];
  }
}

async function writeCart(lines: CartLine[]) {
  const store = await cookies();
  store.set(CART_COOKIE, JSON.stringify(lines), {
    httpOnly: true, // JavaScript in the browser can't read it
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
}

export async function addLine(sku: string, qty: number): Promise<CartResult> {
  const variant = await getVariantBySku(sku);
  if (!variant)
    return { ok: false, message: "That item is no longer available." };

  const lines = await readCart();
  const existing = lines.find((line) => line.sku === sku);
  const nextQty = (existing?.qty ?? 0) + qty;

  if (variant.stock === 0) return { ok: false, message: "Sold out." };
  if (nextQty > variant.stock) {
    return { ok: false, message: `Only ${variant.stock} left in this size.` };
  }
  if (nextQty > MAX_QTY) {
    return { ok: false, message: `Maximum ${MAX_QTY} per item.` };
  }
  if (!existing && lines.length >= MAX_LINES) {
    return { ok: false, message: "Your bag is full." };
  }

  const next = existing
    ? lines.map((line) => (line.sku === sku ? { ...line, qty: nextQty } : line))
    : [...lines, { sku, qty }];

  await writeCart(next);
  return { ok: true, message: "Added to bag." };
}
