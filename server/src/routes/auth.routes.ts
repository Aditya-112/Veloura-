import express from "express";
import authMiddleware from "../middleware/auth.middleware";
import { signup, login, getProfile, logout } from "../controllers/auth.controller";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.get("/me", authMiddleware, getProfile);

export default router;  