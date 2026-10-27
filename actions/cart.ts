"use server";

import { z } from "zod";
import { addLine, type CartResult } from "@/lib/cart";

const addSchema = z.object({
  sku: z.string().min(1).max(64),
  qty: z.number().int().min(1).max(10),
});

export async function addToCart(input: unknown): Promise<CartResult> {
  const parsed = addSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid request." };
  return addLine(parsed.data.sku, parsed.data.qty);
}
