import type { ClothingItem, Occasion } from "../../types/wardrobe";
import { parseWeather, isItemWeatherCompatible } from "./weather";
import { isItemSeasonCompatible } from "./season";
import { isItemOccasionCompatible } from "./occasion";

export function filterWardrobe(
  wardrobeItems: ClothingItem[],
  occasion: Occasion,
  weatherStr: string
): ClothingItem[] {
  if (!wardrobeItems || wardrobeItems.length === 0) return [];

  const weatherProfile = parseWeather(weatherStr);

  return wardrobeItems.filter((item) => {
    // 1. Weather Hard Filter
    if (!isItemWeatherCompatible(item, weatherProfile)) {
      return false;
    }

    // 2. Season Metadata Hard Filter
    if (!isItemSeasonCompatible(item, weatherProfile)) {
      return false;
    }

    // 3. Occasion Hard Filter
    if (!isItemOccasionCompatible(item, occasion)) {
      return false;
    }

    return true;
  });
}
