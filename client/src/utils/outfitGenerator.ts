// ----------------------------------------------------------------------
// VELOURA AI RECOMMENDATION ENGINE (FACADE)
// Re-exports modular recommendation pipeline for backward compatibility
// ----------------------------------------------------------------------

export { generateOutfitsAlgorithm } from "./recommendation/generator";
export { filterWardrobe } from "./recommendation/filter";
export { validateWearableOutfit as validateOutfit } from "./recommendation/validator";
export { scoreCompleteOutfit as scoreCompatibility } from "./recommendation/scorer";
export { rankOutfits } from "./recommendation/ranker";
export { filterNearDuplicates as filterDiversity } from "./recommendation/ranker";
export { parseWeather } from "./recommendation/weather";
