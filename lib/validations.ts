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

export const credentialsSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    email: z.string().email("Invalid email").transform((v) => v.trim()),
    newPassword: z
      .string()
      .max(100, "Password is too long")
      .optional()
      .or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (d) => !d.newPassword || d.newPassword.length >= 8,
    { message: "New password must be at least 8 characters", path: ["newPassword"] }
  )
  .refine(
    (d) => !d.newPassword || d.newPassword === d.confirmPassword,
    { message: "Passwords do not match", path: ["confirmPassword"] }
  );
