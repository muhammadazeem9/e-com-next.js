import { Schema, model, models, type Model } from "mongoose";

export const CATEGORIES = [
  "outerwear",
  "tops",
  "bottoms",
  "dresses",
  "accessories",
] as const;

const variantSchema = new Schema(
  {
    sku: { type: String, required: true },
    size: { type: String, required: true },
    color: { type: String, required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false },
);

const productSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 }, // cents
    compareAtPrice: { type: Number, min: 0 }, // for sale pricing
    category: { type: String, required: true, enum: CATEGORIES, index: true },
    collectionName: { type: String, index: true }, // "collection" is reserved by Mongoose
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: "" },
        _id: false,
      },
    ],
    colors: [{ name: String, hex: String, _id: false }],
    variants: [variantSchema],
    featured: { type: Boolean, default: false, index: true },
    isNewArrival: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const ProductModel: Model<any> =
  models.Product || model("Product", productSchema);
