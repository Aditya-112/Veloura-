import { Router } from "express";

import { getDashboardStats, recordOutfitGeneration } from "../controllers/dashboard.controller";
import authMiddleware from "../middleware/auth.middleware";

const router = Router();

router.get("/stats", authMiddleware, getDashboardStats);
router.post("/record-outfit", authMiddleware, recordOutfitGeneration);

export default router;