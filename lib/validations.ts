import { z } from "zod";

export const productSchema = z.object({
  serialNumber: z
    .string()
    .min(1, "Serial number is required")
    .max(100, "Serial number is too long")
    .transform((v) => v.trim()),
  productName: z
    .string()
    .min(1, "Product name is required")
    .max(200, "Product name is too long")
    .transform((v) => v.trim()),
  category: z
    .string()
    .min(1, "Category is required")
    .max(100, "Category is too long"),
});

export const searchSchema = z.object({
  serialNumber: z
    .string()
    .min(1, "Serial number is required")
    .transform((v) => v.trim()),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return "Only JPG, JPEG, PNG, and WebP images are allowed";
  }
  if (file.size > MAX_IMAGE_SIZE) {
    return "Image must be less than 5MB";
  }
  return null;
}

export type ProductFormData = z.infer<typeof productSchema>;

export const CATEGORIES = [
  "Bed",
  "Sofa",
  "Dining Table",
  "Dining Chair",
  "Coffee Table",
  "Center Table",
  "Console Table",
  "Side Table",
  "Wardrobe",
  "Dresser",
  "Dressing Table",
  "Nightstand",
  "Cabinet",
  "Sideboard",
  "Bookshelf",
  "TV Unit",
  "Study Table",
  "Office Chair",
  "Bench",
  "Stool",
  "Shoe Rack",
  "Outdoor Furniture",
  "Kids Furniture",
  "Other",
];
