"use client";

import { useState, useTransition } from "react";
import { addToCart } from "@/actions/cart";
import type { Product } from "@/lib/products";

type AddToBagProps = {
  colors: Product["colors"];
  variants: Product["variants"];
};

export default function AddToBag({ colors, variants }: AddToBagProps) {
  const [color, setColor] = useState(colors[0]?.name ?? "");
  const [size, setSize] = useState<string | null>(null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(
    null,
  );
  const [pending, startTransition] = useTransition();

  const variantsForColor = variants.filter((v) => v.color === color);
  const selected = variantsForColor.find((v) => v.size === size);

  function handleAdd() {
    if (!selected) return;
    startTransition(async () => {
      const result = await addToCart({ sku: selected.sku, qty: 1 });
      setMessage({ ok: result.ok, text: result.message });
    });
  }

  return (
    <div className="mt-8 space-y-6">
      <div>
        <p className="text-sm text-ash">
          Color: <span className="text-ink">{color}</span>
        </p>
        <div className="mt-2 flex gap-2">
          {colors.map((c) => (
            <button
              key={c.name}
              type="button"
              aria-label={c.name}
              aria-pressed={color === c.name}
              onClick={() => {
                setColor(c.name);
                setSize(null);
                setMessage(null);
              }}
              className={`h-8 w-8 rounded-full border ${
                color === c.name
                  ? "ring-2 ring-ink ring-offset-2"
                  : "border-ash/40"
              }`}
              style={{ backgroundColor: c.hex }}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm text-ash">Size</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {variantsForColor.map((v) => {
            const soldOut = v.stock === 0;
            return (
              <button
                key={v.sku}
                type="button"
                disabled={soldOut}
                aria-pressed={size === v.size}
                onClick={() => {
                  setSize(v.size);
                  setMessage(null);
                }}
                className={`min-w-12 border px-3 py-2 text-sm ${
                  size === v.size
                    ? "border-ink bg-ink text-paper"
                    : "border-ink/30"
                } ${soldOut ? "cursor-not-allowed text-ash line-through opacity-50" : "hover:border-ink"}`}
              >
                {v.size}
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!selected || pending}
        className="w-full bg-ink py-4 text-sm font-medium text-paper disabled:opacity-40"
      >
        {!selected ? "Select a size" : pending ? "Adding…" : "Add to bag"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={`min-h-5 text-sm ${message && !message.ok ? "text-cobalt" : "text-ash"}`}
      >
        {message?.text}
      </p>
    </div>
  );
}
