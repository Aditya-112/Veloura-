import { z } from "zod";

export const updateClothingSchema = z.object({
  name: z.string().optional(),
  category: z
    .enum(["Tops", "Bottoms", "Outerwear", "Dresses", "Footwear", "Accessories", "Top", "Bottom", "Shoes"])
    .optional(),
  subcategory: z.string().optional(),
  color: z
    .union([
      z.string(),
      z.object({
        primary: z.string().optional(),
        secondary: z.string().optional(),
        hex: z.string().optional(),
      }),
    ])
    .optional(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  colorHex: z.string().optional(),
  pattern: z.union([z.string(), z.array(z.string())]).optional(),
  material: z.union([z.string(), z.array(z.string())]).optional(),
  fit: z.string().optional(),
  sleeveType: z.string().optional(),
  neckType: z.string().optional(),
  formalityGrade: z.number().min(1).max(5).optional(),
  styleProfile: z.string().optional(),
  breathability: z.string().optional(),
  warmthRating: z.number().min(1).max(5).optional(),
  season: z.union([z.string(), z.array(z.string())]).optional(),
  occasion: z.union([z.string(), z.array(z.string())]).optional(),
  favorite: z.boolean().optional(),
});