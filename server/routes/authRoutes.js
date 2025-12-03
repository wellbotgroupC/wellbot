import express from "express";
import {
    register,
    login,
    getProfile,
    deleteAccount
} from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/profile", authMiddleware, getProfile);
router.delete("/delete", authMiddleware, deleteAccount);

export default router;
