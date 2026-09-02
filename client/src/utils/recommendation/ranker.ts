import type { ClothingItem } from "../../types/wardrobe";
import type { ScoreBreakdown } from "./scorer";

export const STYLIST_CONFIDENCE_THRESHOLD = 70;

export function rankOutfits(scoredCandidates: ScoreBreakdown[]): ScoreBreakdown[] {
  return [...scoredCandidates]
    .filter((cand) => cand.overallScore >= STYLIST_CONFIDENCE_THRESHOLD)
    .sort((a, b) => {
      // Primary: Score dominance
      const scoreDiff = b.overallScore - a.overallScore;
      if (Math.abs(scoreDiff) >= 1.0) {
        return scoreDiff;
      }
      // Secondary: Diversity & Novelty tie-breaker for similarly high-scoring outfits
      return b.diversityScore - a.diversityScore;
    });
}

export function isNearDuplicateOutfit(outfitA: ClothingItem[], outfitB: ClothingItem[]): boolean {
  const idsA = new Set(outfitA.map((i) => i.id));
  const idsB = new Set(outfitB.map((i) => i.id));

  let sharedCount = 0;
  for (const id of idsA) {
    if (idsB.has(id)) sharedCount++;
  }

  const minSize = Math.min(idsA.size, idsB.size);

  // If 2 outfits share >= 50% of the same items, consider them near-duplicates
  if (sharedCount / minSize >= 0.5) return true;

  // If both share the EXACT same Top AND Bottom, reject as near-duplicate
  const topA = outfitA.find((i) => i.category === "Tops" || i.category === "Top" || i.category === "Dresses")?.id;
  const topB = outfitB.find((i) => i.category === "Tops" || i.category === "Top" || i.category === "Dresses")?.id;
  const botA = outfitA.find((i) => i.category === "Bottoms" || i.category === "Bottom")?.id;
  const botB = outfitB.find((i) => i.category === "Bottoms" || i.category === "Bottom")?.id;

  if (topA && topB && topA === topB && botA && botB && botA === botB) {
    return true;
  }

  return false;
}

export function filterNearDuplicates(
  rankedCandidates: ScoreBreakdown[],
  maxResults: number = 5
): ScoreBreakdown[] {
  if (!rankedCandidates || rankedCandidates.length === 0) return [];

  const selected: ScoreBreakdown[] = [];

  for (const candidate of rankedCandidates) {
    if (selected.length >= maxResults) break;

    const isDuplicate = selected.some((alreadySelected) =>
      isNearDuplicateOutfit(candidate.items, alreadySelected.items)
    );

    if (!isDuplicate) {
      selected.push(candidate);
    }
  }

  return selected;
}
