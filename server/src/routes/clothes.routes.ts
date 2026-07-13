import express from "express";
import upload from "../middleware/upload.middleware";
import {uploadClothes,getMyWardrobe,deleteClothing,updateClothing} from "../controllers/clothes.controller";
import authMiddleware from "../middleware/auth.middleware";
import { AudioResponseFormat } from "@google/genai";
const router = express.Router();

router.get("/", authMiddleware, getMyWardrobe);


router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  uploadClothes
);

router.delete("/:id",authMiddleware,deleteClothing);

router.put("/:id",authMiddleware,updateClothing);

export default router;