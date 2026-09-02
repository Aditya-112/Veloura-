import type { ClothingItem, Occasion } from "../../types/wardrobe";

export const OCCASION_FORMALITY: Record<Occasion, number> = {
  Gym: 1,
  Casual: 2,
  College: 2.2,
  Travel: 2.5,
  Party: 3.0,
  "Business Casual": 3.5,
  "Date Night": 3.5,
  Office: 4.0,
  Wedding: 5.0,
  Formal: 5.0,
};

export function getItemFormality(item: ClothingItem): number {
  if (typeof item.formalityGrade === "number" && item.formalityGrade > 0) {
    return item.formalityGrade;
  }

  const nameLower = (
    item.name +
    " " +
    item.subcategory +
    " " +
    (Array.isArray(item.material) ? item.material.join(" ") : item.material || "")
  ).toLowerCase();

  if (
    nameLower.includes("tuxedo") ||
    nameLower.includes("evening gown") ||
    nameLower.includes("sherwani") ||
    nameLower.includes("silk dress") ||
    nameLower.includes("formal suit")
  )
    return 5;
  if (
    nameLower.includes("blazer") ||
    nameLower.includes("suit") ||
    nameLower.includes("oxford") ||
    nameLower.includes("trouser") ||
    nameLower.includes("loafer") ||
    nameLower.includes("chelsea")
  )
    return 4;
  if (
    nameLower.includes("chino") ||
    nameLower.includes("polo") ||
    nameLower.includes("knit") ||
    nameLower.includes("cardigan") ||
    nameLower.includes("button")
  )
    return 3.5;
  if (
    nameLower.includes("jean") ||
    nameLower.includes("t-shirt") ||
    nameLower.includes("tee") ||
    nameLower.includes("sneaker")
  )
    return 2;
  if (
    nameLower.includes("hoodie") ||
    nameLower.includes("sweatpant") ||
    nameLower.includes("jogger") ||
    nameLower.includes("gym") ||
    nameLower.includes("athletic") ||
    nameLower.includes("short") ||
    nameLower.includes("trainer") ||
    nameLower.includes("running")
  )
    return 1;

  return 3;
}

export function getOutfitStyleProfile(items: ClothingItem[], occasion: Occasion): string {
  const customProfile = items.find((i) => i.styleProfile)?.styleProfile;
  if (customProfile) return customProfile;

  const itemFormalities = items.map(getItemFormality);
  const avgFormality = itemFormalities.reduce((a, b) => a + b, 0) / (items.length || 1);
  const hasOuterwear = items.some((i) => i.category === "Outerwear");
  const isGym = occasion === "Gym" || avgFormality <= 1.5;

  if (isGym) return "Athleisure";
  if (avgFormality >= 4.5) return "Professional";
  if (avgFormality >= 3.5) return hasOuterwear ? "Smart Layered" : "Smart Casual";
  if (items.length <= 3 && avgFormality <= 2.5) return "Minimal";
  if (avgFormality >= 2.5) return "Classic";
  return "Relaxed";
}

export function scoreStyleProfileSynergy(items: ClothingItem[]): number {
  if (!items || items.length === 0) return 85;

  const profiles = items.map((i) => (i.styleProfile || "").toLowerCase().trim()).filter(Boolean);
  if (profiles.length <= 1) return 90;

  const hasAthleisure = profiles.some((p) => p.includes("athleisure") || p.includes("streetwear"));
  const hasProfessional = profiles.some((p) => p.includes("professional") || p.includes("formal") || p.includes("elevated"));

  // Clashing style profiles: Athleisure/Streetwear mixed with Professional/Formal
  if (hasAthleisure && hasProfessional) {
    return 40;
  }

  // Same style profile across garments
  const allSame = profiles.every((p) => p === profiles[0]);
  if (allSame) return 98;

  // Harmonious style profiles
  return 88;
}

function normalizeList(val: string | string[] | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => v.toLowerCase().trim());
  return val
    .toLowerCase()
    .split(",")
    .map((v) => v.trim());
}

export function isItemOccasionCompatible(item: ClothingItem, occasion: Occasion): boolean {
  const formality = getItemFormality(item);
  const nameLower = (item.name + " " + item.subcategory + " " + (item.styleProfile || "")).toLowerCase();

  // 1. COLLEGE OCCASION:
  if (occasion === "College") {
    // REJECT Wedding Gowns, Tuxedos, Sherwanis, Heavy Formal Suits (Formality 4.5+)
    const isUltraFormal =
      formality >= 4.5 ||
      nameLower.includes("tuxedo") ||
      nameLower.includes("sherwani") ||
      nameLower.includes("evening gown") ||
      nameLower.includes("formal suit");

    if (isUltraFormal) return false;
  }

  // 2. GYM OCCASION:
  if (occasion === "Gym") {
    // REJECT Formal Shirts, Blazers, Dress Trousers, Chinos, Jeans, Loafers, Oxfords, Sherwanis
    const isNonGym =
      formality >= 3.0 ||
      nameLower.includes("blazer") ||
      nameLower.includes("trouser") ||
      nameLower.includes("chino") ||
      nameLower.includes("jean") ||
      nameLower.includes("oxford") ||
      nameLower.includes("button") ||
      nameLower.includes("loafer") ||
      nameLower.includes("sherwani") ||
      nameLower.includes("suit");

    if (isNonGym) return false;
  }

  // 3. OFFICE & BUSINESS CASUAL:
  if (occasion === "Office" || occasion === "Business Casual") {
    // REJECT Gym shorts, athletic sweatpants, tank tops, flip-flops
    const isAthleticGym =
      formality <= 1.5 ||
      nameLower.includes("sweatpant") ||
      nameLower.includes("gym short") ||
      nameLower.includes("tank top") ||
      nameLower.includes("flip flop");

    if (isAthleticGym) return false;
  }

  // 4. WEDDING & FORMAL:
  if (occasion === "Wedding" || occasion === "Formal") {
    // REJECT Gym Shorts, Sweatpants, Hoodies, Graphic Tees, Casual Flip Flops
    const isCasualOrGym =
      formality <= 2.2 ||
      nameLower.includes("short") ||
      nameLower.includes("sweatpant") ||
      nameLower.includes("hoodie");

    if (isCasualOrGym) return false;
  }

  return true;
}

export function scoreOccasionCompatibility(items: ClothingItem[], occasion: Occasion): number {
  const targetFormality = OCCASION_FORMALITY[occasion] || 3;
  const itemFormalities = items.map(getItemFormality);
  const avgFormality = itemFormalities.reduce((a, b) => a + b, 0) / itemFormalities.length;
  const formalityDiff = Math.abs(avgFormality - targetFormality);

  let score = Math.max(20, 100 - formalityDiff * 22);

  const occLower = occasion.toLowerCase();
  const directTagMatches = items.filter((i) => {
    const list = normalizeList(i.occasion);
    return list.some((o) => o.includes(occLower) || occLower.includes(o));
  }).length;

  if (directTagMatches > 0) {
    score = Math.min(100, score + (directTagMatches / items.length) * 15);
  }

  return Math.round(score);
}
