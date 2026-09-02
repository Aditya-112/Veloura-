export type ClothingCategory =
  | 'Tops'
  | 'Bottoms'
  | 'Outerwear'
  | 'Dresses'
  | 'Footwear'
  | 'Accessories'
  | 'Top'
  | 'Bottom'
  | 'Shoes';

export type Season = 'Spring' | 'Summer' | 'Fall' | 'Winter' | 'All Season';

export type Occasion =
  | 'Office'
  | 'College'
  | 'Casual'
  | 'Party'
  | 'Wedding'
  | 'Gym'
  | 'Travel'
  | 'Date Night'
  | 'Formal'
  | 'Business Casual';

export interface ClothingItem {
  id: string;
  name: string;
  category: ClothingCategory;
  subcategory: string;
  color: string;
  secondaryColor?: string;
  colorHex: string;
  pattern: string | string[];
  material: string | string[];
  fit?: string;
  sleeveType?: string;
  neckType?: string;
  formalityGrade?: number;
  styleProfile?: string;
  breathability?: string;
  warmthRating?: number;
  season: Season | Season[] | string[];
  occasion: Occasion | Occasion[] | string[];
  confidence?: number;
  isFavorite: boolean;
  timesUsed?: number;
  imageUrl: string;
  publicId?: string;
  createdAt: string;
}

export interface WardrobeStats {
  totalClothes: number;
  favorites: number;
  outfitsGenerated: number;
  outfitsGeneratedThisWeek?: number;
  addedThisMonth: number;
}

export interface WardrobeInsights {
  dominantColor: string;
  dominantColorHex: string;
  mostOwnedCategory: ClothingCategory;
  bestSeason: string;
  mostCommonOccasion: string;
  favoritePercentage: number;
}

export interface CategoryBreakdown {
  category: ClothingCategory;
  count: number;
  percentage: number;
  color: string;
}

export interface AIAnalysisResult {
  category: ClothingCategory;
  subcategory: string;
  primaryColor: string;
  secondaryColor?: string;
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

export interface OutfitExplanations {
  whyChosen: string;
  occasionMatch: string;
  weatherSuitability: string;
  styleExplanation: string;
}

export interface OutfitRecommendation {
  id: string;
  optionTitle?: string;
  name: string;
  title: string;
  occasion: Occasion;
  weather: string;
  items: ClothingItem[];
  compatibilityScore: number;
  occasionMatch: number;
  weatherMatch: number;
  colorHarmony: number;
  styleCompatibility: number;
  materialCompatibility: number;
  seasonMatch: number;
  diversityScore: number;
  explanation: string;
  bulletPoints?: string[];
  stylistNotes?: string;
  detailedExplanations?: OutfitExplanations;
  createdAt: string;
}
