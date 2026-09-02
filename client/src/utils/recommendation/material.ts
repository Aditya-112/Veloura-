import type { ClothingItem } from "../../types/wardrobe";

function normalizeList(val: string | string[] | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val.map((v) => v.toLowerCase().trim());
  return val
    .toLowerCase()
    .split(",")
    .map((v) => v.trim());
}

export function scoreMaterialSynergy(items: ClothingItem[]): number {
  if (!items || items.length === 0) return 80;

  const materials = items.flatMap((i) => normalizeList(i.material));

  const hasSilk = materials.some((m) => m.includes("silk"));
  const hasSyntheticGym = materials.some((m) => m.includes("spandex") || m.includes("polyester") || m.includes("nylon"));
  const hasLinen = materials.some((m) => m.includes("linen"));
  const hasCotton = materials.some((m) => m.includes("cotton"));
  const hasDenim = materials.some((m) => m.includes("denim"));
  const hasWool = materials.some((m) => m.includes("wool") || m.includes("cashmere"));

  // Incompatible material clash: Silk with synthetic gym activewear
  if (hasSilk && hasSyntheticGym) {
    return 30;
  }

  // Excellent material synergies
  if ((hasLinen && hasCotton) || (hasDenim && hasCotton) || (hasWool && hasCotton) || (hasSilk && hasWool)) {
    return 98;
  }

  return 85;
}
