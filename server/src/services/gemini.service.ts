import { GoogleGenAI } from "@google/genai";
import { ClothingMetadata } from "../types/clothing.types";



const ANALYZE_CLOTHING_PROMPT = `
You are an AI fashion assistant.

Analyze the uploaded clothing image.

Return ONLY valid JSON.

Rules:

1. Category MUST be one of:
- Top
- Bottom
- Shoes
- Outerwear
- Accessories

2. Detect the most appropriate subcategory.

3. primaryColor should be the dominant color.

4. secondaryColor should be empty ("") if not applicable.

5. pattern, material, season and occasion MUST always be arrays.

6. If unsure, return the closest reasonable value.

Output Format:

{
  "category": "",
  "subcategory": "",
  "primaryColor": "",
  "secondaryColor": "",
  "pattern": [],
  "material": [],
  "season": [],
  "occasion": []
}

Return ONLY JSON.
`;

export const analyzeClothing = async (
  imageBuffer: Buffer,
  mimeType: string
): Promise<ClothingMetadata> => {

//   console.log("GEMINI KEY:", process.env.GEMINI_API_KEY);

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY!,
  });

  const response = await ai.models.generateContent({
   model: process.env.GEMINI_MODEL!,

    contents: [
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
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  return JSON.parse(cleaned) as ClothingMetadata;
};

  