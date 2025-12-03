import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { chatRateLimiter } from "../middleware/rateLimit.js";
import {
  handleChatMessage,
  saveFeedback,
} from "../controllers/chatController.js";

const router = express.Router();

// send message
router.post("/message", authMiddleware, chatRateLimiter, handleChatMessage);

// NEW: like / dislike / comment
router.post("/feedback", authMiddleware, saveFeedback);

export default router;
