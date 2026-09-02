export type ClothingCategory =
  | "Tops"
  | "Bottoms"
  | "Outerwear"
  | "Dresses"
  | "Footwear"
  | "Accessories"
  | "Top"
  | "Bottom"
  | "Shoes";

export interface ClothingMetadata {
  category: ClothingCategory;
  subcategory: string;
  primaryColor: string;
  secondaryColor: string;
  colorHex: string;
  pattern: string[];
  material: string[];
  fit?: string;
  sleeveType?: string;
  neckType?: string;
  formalityGrade?: number;
  styleProfile?: string;
  breathability?: string;
  warmthRating?: number;
  season: string[];
  occasion: string[];
  confidence: number;
}