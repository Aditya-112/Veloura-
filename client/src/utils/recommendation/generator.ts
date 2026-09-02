import type { ClothingItem, Occasion, OutfitRecommendation } from "../../types/wardrobe";
import { filterWardrobe } from "./filter";
import { validateWearableOutfit } from "./validator";
import { scoreCompleteOutfit } from "./scorer";
import { rankOutfits, filterNearDuplicates } from "./ranker";
import { formatRecommendations } from "./formatter";
import { parseWeather } from "./weather";

export function generateOutfitCombinations(
  filteredItems: ClothingItem[],
  occasion: Occasion,
  weatherStr: string
): ClothingItem[][] {
  const tops = filteredItems.filter((i) => i.category === "Tops" || i.category === "Top");
  const bottoms = filteredItems.filter((i) => i.category === "Bottoms" || i.category === "Bottom");
  const dresses = filteredItems.filter((i) => i.category === "Dresses");
  const outerwear = filteredItems.filter((i) => i.category === "Outerwear");
  const shoes = filteredItems.filter((i) => i.category === "Footwear" || i.category === "Shoes");
  const accessories = filteredItems.filter((i) => i.category === "Accessories");

  const outfits: ClothingItem[][] = [];
  const weather = parseWeather(weatherStr);

  // Accessories are strictly OPTIONAL: only evaluate null or at most 1 matching accessory
  const availableAcc = accessories.length > 0 ? [null, accessories[0]] : [null];

  // Footwear: Every complete outfit MUST include shoes if available in filtered items
  const availableShoes = shoes.length > 0 ? shoes : [null];

  const availableOuterwear =
    (weather.isCold || occasion === "Office" || occasion === "Business Casual" || occasion === "Formal") &&
    outerwear.length > 0
      ? [null, ...outerwear]
      : [null];

  const MAX_CANDIDATE_LIMIT = 120;

  // Top + Bottom outfits (COMPLETE OUTFITS)
  for (const t of tops) {
    if (outfits.length >= MAX_CANDIDATE_LIMIT) break;
    for (const b of bottoms) {
      if (outfits.length >= MAX_CANDIDATE_LIMIT) break;
      const base = [t, b];
      for (const s of availableShoes) {
        for (const o of availableOuterwear) {
          for (const a of availableAcc) {
            const combo = [...base];
            if (o) combo.push(o);
            if (s) combo.push(s);
            if (a) combo.push(a);

            if (validateWearableOutfit(combo, occasion, weatherStr)) {
              outfits.push(combo);
              if (outfits.length >= MAX_CANDIDATE_LIMIT) break;
            }
          }
        }
      }
    }
  }

  // Dress outfits (COMPLETE OUTFITS)
  for (const d of dresses) {
    if (outfits.length >= MAX_CANDIDATE_LIMIT) break;
    const base = [d];
    for (const s of availableShoes) {
      for (const o of availableOuterwear) {
        for (const a of availableAcc) {
          const combo = [...base];
          if (o) combo.push(o);
          if (s) combo.push(s);
          if (a) combo.push(a);

          if (validateWearableOutfit(combo, occasion, weatherStr)) {
            outfits.push(combo);
            if (outfits.length >= MAX_CANDIDATE_LIMIT) break;
          }
        }
      }
    }
  }

  return outfits;
}

export function generateOutfitsAlgorithm(
  wardrobeItems: ClothingItem[],
  occasion: Occasion,
  weatherStr: string
): OutfitRecommendation[] {
  if (!wardrobeItems || wardrobeItems.length === 0) return [];

  // Step 1: Hard Wardrobe Filtering
  const filtered = filterWardrobe(wardrobeItems, occasion, weatherStr);
  if (filtered.length === 0) return [];

  // Step 2 & 3: Combination Generation & Validation
  const combos = generateOutfitCombinations(filtered, occasion, weatherStr);
  if (combos.length === 0) return [];

  // Step 4: True Uncompressed Outfit Scoring with Real Persisted Usage Counts
  const usageCounts: Record<string, number> = {};
  wardrobeItems.forEach((item) => {
    usageCounts[item.id] = item.timesUsed || 0;
  });

  const scored = combos.map((combo) => scoreCompleteOutfit(combo, occasion, weatherStr, usageCounts));

  // Step 5: Outfit Ranking
  const ranked = rankOutfits(scored);

  // Step 6: Diversity & Near-Duplicate Filtering (Max 4 options)
  const uniqueOutfits = filterNearDuplicates(ranked, 4);

  // Step 7: Formatter into Human Stylist Output
  return formatRecommendations(uniqueOutfits, occasion, weatherStr);
}
