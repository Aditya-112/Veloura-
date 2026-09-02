import type { Occasion, OutfitRecommendation } from "../../types/wardrobe";
import type { ScoreBreakdown } from "./scorer";
import { getOutfitStyleProfile } from "./occasion";

export function formatRecommendations(
  selectedCandidates: ScoreBreakdown[],
  occasion: Occasion,
  weatherStr: string
): OutfitRecommendation[] {
  return selectedCandidates.map((cand, idx) => {
    const top = cand.items.find((i) => i.category === "Tops" || i.category === "Top" || i.category === "Dresses");
    const bottom = cand.items.find((i) => i.category === "Bottoms" || i.category === "Bottom");
    const outerwear = cand.items.find((i) => i.category === "Outerwear");
    const footwear = cand.items.find((i) => i.category === "Footwear" || i.category === "Shoes");
    const accessory = cand.items.find((i) => i.category === "Accessories");

    const stylePersona = getOutfitStyleProfile(cand.items, occasion);

    // Dynamic Option Styling Title
    let optionTitle = idx === 0 ? "Option 1 • Stylist's Pick" : `Option ${idx + 1} • ${stylePersona}`;
    if (idx === 1 && outerwear) optionTitle = "Option 2 • Smart Layered";

    const primaryColor = top ? top.color : cand.items[0]?.color || "Indigo";
    const subcat = top ? (top.subcategory || top.name) : cand.items[0]?.subcategory || "Ensemble";
    const outfitName = `${primaryColor} ${subcat} ${occasion} Fit`;

    // Extract fabric or default
    const topMat = top?.material ? (Array.isArray(top.material) ? top.material[0] : top.material) : "";
    const fabricStr = topMat && topMat !== "N/A" && topMat !== "Fabric" ? `${topMat.toLowerCase()} ` : "";

    const topDesc = top ? `${top.color.toLowerCase()} ${fabricStr}${top.subcategory || top.name}` : "garment selection";
    const bottomDesc = bottom ? `${bottom.color.toLowerCase()} ${bottom.subcategory || bottom.name}` : "";

    let weatherReason = `keeps you comfortable in today's climate`;
    if (outerwear) {
      weatherReason = `layering with ${outerwear.name} provides thermal comfort`;
    } else if (weatherStr.toLowerCase().includes("rain")) {
      weatherReason = `provides breathable protection for damp conditions`;
    } else if (weatherStr.toLowerCase().includes("sunny") || weatherStr.toLowerCase().includes("warm") || weatherStr.toLowerCase().includes("hot")) {
      weatherReason = `keeps you cool and comfortable`;
    }

    // 1. Natural Stylist Notes (Concise, authentic, 2-3 sentences max)
    let stylistNotes = `This ${topDesc} ${weatherReason} while maintaining a refined ${occasion.toLowerCase()} aesthetic.`;
    if (bottom) {
      stylistNotes += ` The ${bottomDesc} balances the outfit proportions cleanly without visual clutter.`;
    }
    if (footwear) {
      stylistNotes += ` Finished with ${footwear.color.toLowerCase()} ${footwear.subcategory || footwear.name} for effortless all-day wear.`;
    }

    // 2. Dynamic "Why this outfit?" Bullet Points
    const bulletPoints: string[] = [
      `Formality & style alignment tailored for ${occasion}.`,
      outerwear
        ? `Layered with ${outerwear.name} for ${weatherStr.toLowerCase()} conditions.`
        : `Selected for breathable comfort in ${weatherStr.toLowerCase()} weather.`,
    ];

    if (bottom && top) {
      bulletPoints.push(
        `${bottom.color} ${bottom.subcategory || bottom.name} complements the ${top.color.toLowerCase()} ${top.subcategory || top.name}.`
      );
    } else if (top?.category === "Dresses") {
      bulletPoints.push(
        `The ${top.color.toLowerCase()} ${top.name} creates an elegantly proportioned silhouette.`
      );
    }

    if (footwear) {
      bulletPoints.push(
        `${footwear.color} ${footwear.subcategory || footwear.name} anchors the ensemble.`
      );
    }

    if (accessory) {
      bulletPoints.push(
        `Accessorized with ${accessory.name} for a subtle, elevated finish.`
      );
    }

    const occasionMatchExp = `Formality and style alignment tailored strictly for ${occasion}.`;
    const weatherSuitabilityExp = `Thermal comfort and layering curated specifically for ${weatherStr.toLowerCase()} climate.`;
    const styleExplanationExp = `Color combination featuring ${cand.items.map((i) => i.color).filter(Boolean).slice(0, 3).join(", ")} tones.`;

    return {
      id: `outfit-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 6)}`,
      optionTitle,
      name: outfitName,
      title: outfitName,
      occasion,
      weather: weatherStr,
      items: cand.items,
      compatibilityScore: cand.overallScore,
      occasionMatch: cand.occasionScore,
      weatherMatch: cand.weatherScore,
      colorHarmony: cand.colorScore,
      styleCompatibility: cand.styleScore,
      materialCompatibility: cand.materialScore,
      seasonMatch: cand.weatherScore,
      diversityScore: cand.diversityScore,
      explanation: stylistNotes,
      bulletPoints,
      stylistNotes,
      detailedExplanations: {
        whyChosen: stylistNotes,
        occasionMatch: occasionMatchExp,
        weatherSuitability: weatherSuitabilityExp,
        styleExplanation: styleExplanationExp,
      },
      createdAt: new Date().toISOString(),
    };
  });
}
