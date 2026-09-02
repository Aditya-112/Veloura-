import type { ClothingItem } from "../../types/wardrobe";

const NEUTRAL_COLORS = [
  "black",
  "obsidian",
  "white",
  "ivory",
  "grey",
  "gray",
  "charcoal",
  "navy",
  "beige",
  "cream",
  "tan",
  "denim",
  "nude",
  "brown",
  "khaki",
];

const CLASHING_COLOR_PAIRS: [string, string][] = [
  ["neon green", "purple"],
  ["neon green", "orange"],
  ["hot pink", "lime green"],
  ["bright yellow", "purple"],
  ["magenta", "chartreuse"],
];

const CLASSIC_STYLIST_COMBOS = [
  ["white", "beige", "navy"],
  ["black", "olive"],
  ["denim", "white"],
  ["cream", "khaki", "brown"],
  ["charcoal", "light blue"],
  ["navy", "white", "tan"],
  ["grey", "white", "black"],
];

function isNeutral(colorStr: string): boolean {
  const c = (colorStr || "").toLowerCase();
  return NEUTRAL_COLORS.some((n) => c.includes(n));
}

export function scoreColorHarmony(items: ClothingItem[]): number {
  if (!items || items.length === 0) return 70;

  const colors = items.map((i) => (i.color || "").toLowerCase().trim());
  const accentColors = colors.filter((c) => !isNeutral(c));

  // Check for explicit clashing pairs
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      for (const [clash1, clash2] of CLASHING_COLOR_PAIRS) {
        if (
          (colors[i].includes(clash1) && colors[j].includes(clash2)) ||
          (colors[i].includes(clash2) && colors[j].includes(clash1))
        ) {
          return 25; // Extremely low score for clashing colors
        }
      }
    }
  }

  // Check for Classic Stylist Combinations
  for (const combo of CLASSIC_STYLIST_COMBOS) {
    const isComboMatch = combo.every((c) => colors.some((col) => col.includes(c)));
    if (isComboMatch) {
      return 98; // Premium stylist combination score
    }
  }

  // All Neutral Palette (Sleek, minimalist)
  if (accentColors.length === 0) {
    return 96;
  }

  // Single Accent + Neutrals (Classic pop of color)
  if (accentColors.length === 1) {
    return 94;
  }

  // Multiple Accents: check if accents are similar family
  if (accentColors.length === 2) {
    const a1 = accentColors[0].split(" ")[0];
    const a2 = accentColors[1].split(" ")[0];
    return a1 === a2 ? 90 : 75;
  }

  // 3+ Different Accents (Risk of visual clutter)
  return 55;
}
