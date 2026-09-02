import express from "express";
import upload from "../middleware/upload.middleware";
import {uploadClothes,
  getMyWardrobe,
  deleteClothing,
  updateClothing,
  toggleFavorite,
  getFavoriteClothes,
  wearClothingItems} from "../controllers/clothes.controller";


import authMiddleware from "../middleware/auth.middleware";

import validate from "../middleware/validate";
import { updateClothingSchema } from "../validations/clothes.validation";
const router = express.Router();


router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  uploadClothes
);

router.get("/", authMiddleware, getMyWardrobe);

router.get("/favorites",authMiddleware,getFavoriteClothes);

router.post("/wear", authMiddleware, wearClothingItems);

router.delete("/:id",authMiddleware,deleteClothing);

router.put("/:id",authMiddleware,validate(updateClothingSchema),updateClothing);

router.patch("/:id/favorite",authMiddleware,toggleFavorite);

export default router;