import { z } from "zod";

export const updateClothingSchema = z.object({
  category: z.enum([
    "Top",
    "Bottom",
    "Shoes",
    "Outerwear",
    "Accessories",
  ]),
  subcategory: z.string().min(1),

  primaryColor: z.string().min(1),

  secondaryColor: z.string(),

  pattern: z.array(z.string()),

  material: z.array(z.string()),

  season: z.array(z.string()),

  occasion: z.array(z.string()),

  favorite: z.boolean(),
});