import type { ClothingItem } from "../../types/wardrobe";

export type ClimateCategory = "WARM_SUMMER" | "MILD_SPRING" | "CHILLY_FALL" | "FREEZING_WINTER" | "RAINY";

export interface WeatherProfile {
  category: ClimateCategory;
  tempCelsius: number;
  condition: string;
  isCold: boolean;
  isWarm: boolean;
  isRainy: boolean;
}

export function parseWeather(weatherStr: string): WeatherProfile {
  const str = (weatherStr || "").toLowerCase();

  let category: ClimateCategory = "MILD_SPRING";
  let tempCelsius = 20;

  // Extract explicit numerical temperature if available in string e.g. "31°C" or "31°c" or "31deg"
  const tempMatch = str.match(/(-?\d+)\s*°?c/);
  if (tempMatch) {
    tempCelsius = parseInt(tempMatch[1], 10);
  }

  const isRainy = str.includes("rain") || str.includes("shower") || str.includes("drizzle") || str.includes("thunderstorm");

  if (tempMatch) {
    if (tempCelsius <= 10 || str.includes("snow") || str.includes("freezing")) {
      category = "FREEZING_WINTER";
    } else if (tempCelsius <= 18 || str.includes("chilly") || str.includes("fall")) {
      category = "CHILLY_FALL";
    } else if (tempCelsius >= 25 || str.includes("sunny") || str.includes("warm") || str.includes("hot")) {
      category = "WARM_SUMMER";
    } else if (isRainy) {
      category = "RAINY";
    } else {
      category = "MILD_SPRING";
    }
  } else {
    if (str.includes("winter") || str.includes("freezing") || str.includes("snow")) {
      category = "FREEZING_WINTER";
      tempCelsius = 2;
    } else if (str.includes("chilly") || str.includes("fall") || str.includes("autumn") || str.includes("cool")) {
      category = "CHILLY_FALL";
      tempCelsius = 14;
    } else if (isRainy) {
      category = "RAINY";
      tempCelsius = 16;
    } else if (str.includes("sunny") || str.includes("warm") || str.includes("summer") || str.includes("hot")) {
      category = "WARM_SUMMER";
      tempCelsius = 24;
    }
  }

  const isCold = category === "FREEZING_WINTER" || category === "CHILLY_FALL";
  const isWarm = category === "WARM_SUMMER" || tempCelsius >= 25;

  return {
    category,
    tempCelsius,
    condition: weatherStr,
    isCold,
    isWarm,
    isRainy,
  };
}

export function isItemWeatherCompatible(item: ClothingItem, weather: WeatherProfile): boolean {
  const nameLower = (
    item.name +
    " " +
    item.subcategory +
    " " +
    (Array.isArray(item.material) ? item.material.join(" ") : item.material || "")
  ).toLowerCase();

  const category = item.category;

  // WARM / SUNNY WEATHER RULES:
  if (weather.isWarm) {
    // REJECT heavy winter coats, puffers, parkas, thermal jackets
    if (category === "Outerwear") {
      const isHeavyCoat =
        nameLower.includes("trench") ||
        nameLower.includes("puffer") ||
        nameLower.includes("parka") ||
        nameLower.includes("overcoat") ||
        nameLower.includes("heavy") ||
        nameLower.includes("wool coat");

      if (isHeavyCoat) return false;
    }

    // REJECT heavy wool sweaters & knits in warm weather
    const isHeavyKnit =
      nameLower.includes("wool sweater") ||
      nameLower.includes("heavy knit") ||
      nameLower.includes("turtleneck") ||
      nameLower.includes("fleece hoodie");

    if (isHeavyKnit) return false;
  }

  // FREEZING WINTER WEATHER RULES:
  if (weather.category === "FREEZING_WINTER") {
    // REJECT shorts or flip-flops in freezing winter
    if (category === "Bottoms" && nameLower.includes("short") && !nameLower.includes("trouser")) {
      return false;
    }
  }

  return true;
}

export function scoreWeatherSuitability(items: ClothingItem[], weather: WeatherProfile): number {
  const hasOuterwear = items.some((i) => i.category === "Outerwear");
  const topOrDress = items.find((i) => i.category === "Tops" || i.category === "Top" || i.category === "Dresses");
  const topName = (topOrDress?.name + " " + topOrDress?.subcategory).toLowerCase();

  const isLayeredOrWarmTop =
    hasOuterwear ||
    topName.includes("sweater") ||
    topName.includes("knit") ||
    topName.includes("cardigan") ||
    topName.includes("hoodie") ||
    topName.includes("jacket");

  if (weather.category === "FREEZING_WINTER") {
    return isLayeredOrWarmTop ? 95 : 20;
  }

  if (weather.category === "CHILLY_FALL") {
    return isLayeredOrWarmTop ? 90 : 50;
  }

  if (weather.category === "WARM_SUMMER") {
    return !hasOuterwear ? 95 : topName.includes("blazer") ? 80 : 40;
  }

  if (weather.isRainy) {
    return hasOuterwear ? 95 : 70;
  }

  return 85;
}
