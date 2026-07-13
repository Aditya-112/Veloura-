import dotenv from "dotenv";

dotenv.config();
console.log(process.env);

import fs from "fs";
import { analyzeClothing } from "./services/gemini.service";

async function main(){
  const imagePath = "./test-images/tshirt.jpg";

  const imageBuffer = fs.readFileSync(imagePath);

  const result = await analyzeClothing(
    imageBuffer,
    "image/jpeg"
  );
  console.log(result);
}
main().catch(console.error);