import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { ChatLog } from "../models/ChatLog.js";

dotenv.config();

export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await User.findOne({ email, role: "admin" });
        if (!admin) return res.status(401).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, admin.passwordHash);
        if (!match) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { userId: admin._id, role: admin.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            admin: {
                id: admin._id,
                email: admin.email,
                name: admin.name
            }
        });
    } catch (err) {
        console.error("Admin login error", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getUsers = async (req, res) => {
    try {
        const { ageGroup, language } = req.query;
        const query = { role: "user" };
        if (ageGroup) query.ageGroup = ageGroup;
        if (language) query.language = language;

        const users = await User.find(query).select("-passwordHash");
        res.json({ users });
    } catch (err) {
        console.error("Admin users error", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getChatLogs = async (req, res) => {
    try {
        const logs = await ChatLog.find().populate("userId", "email name");
        res.json({ logs });
    } catch (err) {
        console.error("Admin chat logs error", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const getAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments({ role: "user" });
        const logs = await ChatLog.find();
        const totalSessions = logs.length;
        let totalTime = 0;
        const questionCounts = {};

        logs.forEach((log) => {
            if (typeof log.totalSessionTime === "number") {
                totalTime += log.totalSessionTime;
            }
            log.messages
                .filter((m) => m.role === "user")
                .forEach((m) => {
                    const key = (m.text || "").trim().toLowerCase();
                    if (!key) return;
                    questionCounts[key] = (questionCounts[key] || 0) + 1;
                });
        });

        const avgSessionTime = totalSessions ? totalTime / totalSessions : 0;
        const topQuestions = Object.entries(questionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([question, count]) => ({ question, count }));

        res.json({
            totalUsers,
            avgSessionTime,
            topQuestions
        });
    } catch (err) {
        console.error("Admin analytics error", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const exportUsersCsv = async (req, res) => {
    try {
        const users = await User.find({ role: "user" }).select("-passwordHash");
        const header = "name,email,ageGroup,language,createdAt\n";
        const rows = users.map((u) =>
            [
                u.name,
                u.email,
                u.ageGroup,
                u.language,
                u.createdAt.toISOString()
            ]
                .map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`)
                .join(",")
        );
        const csv = header + rows.join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", 'attachment; filename="users.csv"');
        res.send(csv);
    } catch (err) {
        console.error("Export users error", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const exportChatsCsv = async (req, res) => {
    try {
        const logs = await ChatLog.find().populate("userId", "email");
        const header = "userEmail,role,text,timestamp,sessionId\n";
        const rows = [];
        logs.forEach((log) => {
            log.messages.forEach((m) => {
                rows.push(
                    [
                        log.userId?.email || "",
                        m.role,
                        m.text,
                        m.timestamp.toISOString(),
                        log._id.toString()
                    ]
                        .map((v) => `"${(v || "").toString().replace(/"/g, '""')}"`)
                        .join(",")
                );
            });
        });
        const csv = header + rows.join("\n");
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", 'attachment; filename="chats.csv"');
        res.send(csv);
    } catch (err) {
        console.error("Export chats error", err);
        res.status(500).json({ message: "Server error" });
    }
};
