import type { ClothingItem, Occasion } from "../../types/wardrobe";
import { parseWeather, scoreWeatherSuitability } from "./weather";
import { scoreSeasonCompatibility } from "./season";
import { scoreOccasionCompatibility, scoreStyleProfileSynergy } from "./occasion";
import { scoreColorHarmony } from "./color";
import { scoreMaterialSynergy } from "./material";

export interface ScoreBreakdown {
  items: ClothingItem[];
  occasionScore: number;       // 30%
  weatherScore: number;        // 25%
  colorScore: number;          // 15%
  styleScore: number;          // 15%
  materialScore: number;       // 5%
  favoriteScore: number;       // 5%
  diversityScore: number;      // 5%
  overallScore: number;        // 0-100 (Uncompressed!)
}

export function scoreCompleteOutfit(
  items: ClothingItem[],
  occasion: Occasion,
  weatherStr: string,
  usageCounts: Record<string, number> = {}
): ScoreBreakdown {
  const weather = parseWeather(weatherStr);

  const occasionScore = scoreOccasionCompatibility(items, occasion);
  const weatherSuitability = scoreWeatherSuitability(items, weather);
  const seasonMatch = scoreSeasonCompatibility(items, weather);
  const weatherScore = Math.round((weatherSuitability + seasonMatch) / 2);

  const colorScore = scoreColorHarmony(items);
  const styleScore = scoreStyleProfileSynergy(items);
  const materialScore = scoreMaterialSynergy(items);

  // Favorite score
  const favoriteCount = items.filter((i) => i.isFavorite).length;
  const favoriteScore = favoriteCount > 0 ? Math.min(100, 75 + favoriteCount * 15) : 70;

  // Diversity / Usage score
  let totalUsage = 0;
  for (const item of items) {
    totalUsage += usageCounts[item.id] || 0;
  }
  const diversityScore = Math.max(30, 100 - totalUsage * 20);

  // Weighted Uncompressed Score Calculation
  // Occasion: 30%, Weather: 25%, Color: 15%, Style: 15%, Material: 5%, Favorite: 5%, Diversity: 5%
  const rawScore =
    occasionScore * 0.30 +
    weatherScore * 0.25 +
    colorScore * 0.15 +
    styleScore * 0.15 +
    materialScore * 0.05 +
    favoriteScore * 0.05 +
    diversityScore * 0.05;

  // Uncompressed final score (allows bad outfits to be low score 30-55, good to be 85-98)
  const overallScore = Math.max(25, Math.min(99, Math.round(rawScore)));

  return {
    items,
    occasionScore,
    weatherScore,
    colorScore,
    styleScore,
    materialScore,
    favoriteScore,
    diversityScore,
    overallScore,
  };
}
