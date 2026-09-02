import type { ClothingItem, Occasion } from "../../types/wardrobe";
import { parseWeather } from "./weather";
import { getItemFormality, OCCASION_FORMALITY } from "./occasion";

export function validateWearableOutfit(
  items: ClothingItem[],
  occasion: Occasion,
  weatherStr: string
): boolean {
  if (!items || items.length === 0) return false;

  const tops = items.filter((i) => i.category === "Tops" || i.category === "Top");
  const bottoms = items.filter((i) => i.category === "Bottoms" || i.category === "Bottom");
  const dresses = items.filter((i) => i.category === "Dresses");
  const outerwear = items.filter((i) => i.category === "Outerwear");

  // 1. Structure check: Must be (1 Top + 1 Bottom) OR (1 Dress)
  const hasTopBottom = tops.length === 1 && bottoms.length === 1 && dresses.length === 0;
  const hasDress = dresses.length === 1 && tops.length === 0 && bottoms.length === 0;

  if (!hasTopBottom && !hasDress) return false;
  if (outerwear.length > 1) return false;

  const weather = parseWeather(weatherStr);

  // 2. Weather & Layering Rules:
  if (weather.isWarm) {
    // REJECT heavy outerwear or heavy sweaters in warm summer weather
    if (outerwear.length > 0) {
      const outName = (outerwear[0].name + " " + outerwear[0].subcategory).toLowerCase();
      if (
        outName.includes("puffer") ||
        outName.includes("parka") ||
        outName.includes("trench") ||
        outName.includes("wool") ||
        outName.includes("heavy")
      ) {
        return false;
      }
    }
  } else if (weather.isCold) {
    const topItem = tops[0] || dresses[0];
    const topName = (
      topItem?.name +
      " " +
      topItem?.subcategory +
      " " +
      (Array.isArray(topItem?.sleeveType) ? topItem?.sleeveType.join(" ") : topItem?.sleeveType || "")
    ).toLowerCase();

    const isShortSleeve =
      topName.includes("t-shirt") ||
      topName.includes("tee") ||
      topName.includes("tank") ||
      topName.includes("short sleeve") ||
      topName.includes("sleeveless");

    const hasOuterwearOrSweater =
      outerwear.length > 0 ||
      topName.includes("sweater") ||
      topName.includes("knit") ||
      topName.includes("cardigan") ||
      topName.includes("hoodie");

    // REJECT short-sleeve T-shirt alone without coat/jacket/sweater in cold/freezing weather
    if (isShortSleeve && !hasOuterwearOrSweater) {
      return false;
    }

    // Freezing winter REQUIRES outerwear or heavy sweater
    if (weather.category === "FREEZING_WINTER" && !hasOuterwearOrSweater) {
      return false;
    }
  }

  // 3. Formality Alignment across the WHOLE OUTFIT
  const itemFormalities = items.map(getItemFormality);
  const maxFormality = Math.max(...itemFormalities);
  const minFormality = Math.min(...itemFormalities);

  // Severe clash: Ultra-formal / blazer paired with gym shorts / sweatpants / flip-flops
  const hasUltraFormal = maxFormality >= 4.5;
  const hasGymCasual = minFormality <= 1.5;
  if (hasUltraFormal && hasGymCasual) {
    return false;
  }

  // General formality spread check (allows smart-casual contrast up to 2.0 spread if not clashing)
  if (maxFormality - minFormality > 2.2) {
    return false;
  }

  // Target Occasion Formality Floor Check
  const targetFormality = OCCASION_FORMALITY[occasion] || 3;
  if (targetFormality >= 4.5 && minFormality < 2.5) {
    return false; // Reject casual pieces in ultra formal / wedding settings
  }

  return true;
}
