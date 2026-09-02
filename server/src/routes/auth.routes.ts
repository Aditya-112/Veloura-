import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import upload from "../middleware/upload.middleware";
import { getProfile, updateProfile, uploadAvatar } from "../controllers/auth.controller";

const router = express.Router();

router.get("/me", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.post("/avatar", authMiddleware, upload.single("image"), uploadAvatar);

export default router;