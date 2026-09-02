import { GoogleGenAI } from "@google/genai";
import { ClothingMetadata } from "../types/clothing.types";



const ANALYZE_CLOTHING_PROMPT = `
You are Veloura Vision AI.

Your task is to identify ONE clothing item from the image.

Look carefully at the image before answering.

First internally determine:

- Garment category
- Exact garment type
- Primary color
- Secondary color
- Pattern
- Estimated material
- Fit
- Sleeve type
- Neck type
- Formality grade (1.0 = Gym/Loungewear, 2.0 = Casual, 3.0 = Smart Casual/College, 4.0 = Business/Formal, 5.0 = Ultra Formal/Wedding)
- Style profile (Minimal, Classic, Smart Casual, Athleisure, Streetwear, Professional, Elevated)
- Breathability (High, Medium, Low)
- Warmth rating (1 = Ultra Light/Summer, 2 = Light, 3 = Moderate, 4 = Heavy Warm, 5 = Extreme Arctic)
- Best seasons
- Suitable occasions

Do NOT guess if something cannot be confidently identified.

If a property cannot be determined from the image,
use:

"Unknown"

or

[]

instead of hallucinating.

IMPORTANT:

Never identify a sweater as a shirt.

Never identify knitwear as woven fabric.

Never invent collars.

Never invent sleeves that are not visible.

Never invent materials with high confidence.

Return ONLY valid JSON.

{
  "category": "",
  "subcategory": "",
  "primaryColor": "",
  "secondaryColor": "",
  "colorHex": "",
  "pattern": [],
  "material": [],
  "fit": "",
  "sleeveType": "",
  "neckType": "",
  "formalityGrade": 3.0,
  "styleProfile": "Casual",
  "breathability": "High",
  "warmthRating": 2,
  "season": [],
  "occasion": [],
  "confidence": 0.0
}

Allowed categories:

Tops
Bottoms
Outerwear
Dresses
Footwear
Accessories

Examples of valid subcategories:

Crewneck Knit Sweater
Cable Knit Sweater
Cardigan
Pullover Hoodie
Zip Hoodie
Oxford Shirt
Polo Shirt
Henley
Crewneck T-Shirt
Oversized T-Shirt
Tank Top
Bomber Jacket
Leather Jacket
Denim Jacket
Cargo Pants
Straight Jeans
Slim Jeans
Chinos
Joggers
Running Shoes
Sneakers
Chelsea Boots
Loafers

Choose the ACTUAL garment visible in the image.

Do NOT choose from the examples unless they match.
`;
export const analyzeClothing = async (
  imageBuffer: Buffer,
  mimeType: string
): Promise<ClothingMetadata> => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY missing from environment variables.");
    }

    const ai = new GoogleGenAI({ apiKey });
    const modelName = "gemini-2.5-flash-lite";

    const response = await ai.models.generateContent({
      model: modelName,
      contents: [
        {
          role: "user",
          parts: [
            {
              text: ANALYZE_CLOTHING_PROMPT,
            },
            {
              inlineData: {
                mimeType,
                data: imageBuffer.toString("base64"),
              },
            },
          ],
        },
      ],
    });

    const text = response.text;
    if (!text) {
      throw new Error(`Gemini API returned empty response text. FinishReason: ${response.candidates?.[0]?.finishReason}`);
    }

    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsed: any;
    try {
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("JSON Parse Error on Gemini output:", cleaned);
      throw err;
    }

    // Normalize category mapping
    let category = parsed.category || "Tops";
    if (category === "Top") category = "Tops";
    if (category === "Bottom" || category === "Pants" || category === "Jeans") category = "Bottoms";
    if (category === "Shoes" || category === "Footwear") category = "Footwear";
    if (category === "Jacket" || category === "Coat") category = "Outerwear";
    if (category === "Dress") category = "Dresses";

    return {
      category,
      subcategory: parsed.subcategory || "Garment",
      primaryColor: parsed.primaryColor || "Black",
      secondaryColor: parsed.secondaryColor || "",
      colorHex: parsed.colorHex || "#4f46e5",
      pattern: Array.isArray(parsed.pattern) && parsed.pattern.length > 0 ? parsed.pattern : ["Solid"],
      material: Array.isArray(parsed.material) && parsed.material.length > 0 ? parsed.material : ["Cotton"],
      fit: parsed.fit || "Regular Fit",
      sleeveType: parsed.sleeveType || "N/A",
      neckType: parsed.neckType || "N/A",
      formalityGrade: typeof parsed.formalityGrade === "number" ? parsed.formalityGrade : undefined,
      styleProfile: parsed.styleProfile || "Smart Casual",
      breathability: parsed.breathability || "High",
      warmthRating: typeof parsed.warmthRating === "number" ? parsed.warmthRating : undefined,
      season: Array.isArray(parsed.season) && parsed.season.length > 0 ? parsed.season : ["All Season"],
      occasion: Array.isArray(parsed.occasion) && parsed.occasion.length > 0 ? parsed.occasion : ["Casual"],
      confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0.95,
    };
  } catch (error) {
    console.error("Gemini Vision Analysis Error (Fatal):", error);
    throw error;
  }
};

const getFallbackMetadata = (): ClothingMetadata => ({
  category: "Tops",
  subcategory: "Unknown",
  primaryColor: "Unknown",
  secondaryColor: "",
  colorHex: "#808080",
  pattern: [],
  material: [],
  fit: "Regular Fit",
  sleeveType: "Unknown",
  neckType: "Unknown",
  formalityGrade: 2.5,
  styleProfile: "Casual",
  breathability: "High",
  warmthRating: 2,
  season: ["All Season"],
  occasion: ["Casual"],
  confidence: 0.4,
});