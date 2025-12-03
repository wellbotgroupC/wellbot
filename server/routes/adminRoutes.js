import express from "express";
import {
    adminLogin,
    getUsers,
    getChatLogs,
    getAnalytics,
    exportUsersCsv,
    exportChatsCsv
} from "../controllers/adminController.js";
import {
    authMiddleware,
    requireAdmin
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", adminLogin);
router.get("/users", authMiddleware, requireAdmin, getUsers);
router.get("/chat-logs", authMiddleware, requireAdmin, getChatLogs);
router.get("/analytics", authMiddleware, requireAdmin, getAnalytics);
router.get("/export/users", authMiddleware, requireAdmin, exportUsersCsv);
router.get("/export/chats", authMiddleware, requireAdmin, exportChatsCsv);

export default router;
