import express from "express";
import upload from "../middleware/upload.middleware";
import {uploadClothes,getMyWardrobe,} from "../controllers/clothes.controller";
import authMiddleware from "../middleware/auth.middleware";
const router = express.Router();

router.get("/", authMiddleware, getMyWardrobe);

router.post(
  "/upload",
  authMiddleware,
  upload.single("image"),
  uploadClothes
);

export default router;