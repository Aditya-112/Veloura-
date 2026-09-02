import type { ClothingItem } from "../../types/wardrobe";
import type { WeatherProfile } from "./weather";

function normalizeList(val: string | string[] | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => v.toLowerCase().trim());
  return val
    .toLowerCase()
    .split(",")
    .map((v) => v.trim());
}

export function isItemSeasonCompatible(item: ClothingItem, weather: WeatherProfile): boolean {
  const seasons = normalizeList(item.season);

  // If item is marked All Season, it is always compatible
  if (seasons.includes("all season") || seasons.includes("all") || seasons.length === 0) {
    return true;
  }

  // WARM / SUNNY WEATHER:
  if (weather.isWarm) {
    // If item season is strictly Winter (and not Summer/All Season), REJECT IT!
    const isStrictlyWinter = seasons.includes("winter") && !seasons.includes("summer") && !seasons.includes("spring");
    if (isStrictlyWinter) return false;
  }

  // FREEZING WINTER WEATHER:
  if (weather.category === "FREEZING_WINTER") {
    // If item season is strictly Summer (and not Winter/Fall), REJECT IT!
    const isStrictlySummer = seasons.includes("summer") && !seasons.includes("winter") && !seasons.includes("fall");
    if (isStrictlySummer) return false;
  }

  return true;
}

export function scoreSeasonCompatibility(items: ClothingItem[], weather: WeatherProfile): number {
  let totalScore = 0;

  for (const item of items) {
    const seasons = normalizeList(item.season);

    if (seasons.includes("all season") || seasons.includes("all") || seasons.length === 0) {
      totalScore += 95;
      continue;
    }

    if (weather.isWarm) {
      if (seasons.includes("summer") || seasons.includes("spring")) {
        totalScore += 98;
      } else if (seasons.includes("fall")) {
        totalScore += 80;
      } else {
        totalScore += 30; // Winter in summer
      }
    } else if (weather.isCold) {
      if (seasons.includes("winter") || seasons.includes("fall")) {
        totalScore += 98;
      } else if (seasons.includes("spring")) {
        totalScore += 75;
      } else {
        totalScore += 25; // Summer in winter
      }
    } else {
      totalScore += 85;
    }
  }

  return Math.round(totalScore / items.length);
}
