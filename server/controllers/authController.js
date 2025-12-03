import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { User } from "../models/User.js";
import { ChatLog } from "../models/ChatLog.js";
import { DeletionLog } from "../models/DeletionLog.js";

dotenv.config();

// Simple email check
const isValidEmail = (email) => /^\S+@\S+\.\S+$/.test(email);

// (optional) simple password rule – NOT very strict (just length >= 6)
const isStrongPassword = (password) => password && password.length >= 6;

// =================== REGISTER ===================
export const register = async (req, res) => {
    try {
        const { name, ageGroup, language, email, password } = req.body;

        console.log("Register request body:", req.body); // debug log

        // 1. Basic required fields check
        if (!name || !ageGroup || !language || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // 2. Email format
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        // 3. Password simple check
        if (!isStrongPassword(password)) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // 4. Check duplicate email
        const existing = await User.findOne({ email });
        if (existing) {
            return res.status(409).json({ message: "Email already registered" });
        }

        // 5. Hash password and create user
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            ageGroup,   // "< 18", "18 - 30", etc. – must match model enum
            language,   // "en" or "te"
            email,
            passwordHash,
            role: "user"
        });

        // 6. Issue JWT
        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                ageGroup: user.ageGroup,
                language: user.language,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Register error:", err);
        return res.status(500).json({ message: "Server error during registration" });
    }
};

// =================== LOGIN ===================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email });
        if (!user)
            return res.status(401).json({ message: "Invalid credentials" });

        const match = await bcrypt.compare(password, user.passwordHash);
        if (!match)
            return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                ageGroup: user.ageGroup,
                language: user.language,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ message: "Server error during login" });
    }
};

// =================== PROFILE ===================
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select("-passwordHash");
        if (!user) return res.status(404).json({ message: "User not found" });
        return res.json({ user });
    } catch (err) {
        console.error("Profile error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};

// =================== DELETE ACCOUNT ===================
export const deleteAccount = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) return res.status(404).json({ message: "User not found" });

        const userEmail = user.email;

        // delete chat logs for this user
        await ChatLog.deleteMany({ userId: user._id });

        // log deletion
        await DeletionLog.create({
            userEmail,
            reason: "user_self_deleted"
        });

        // delete user
        await User.deleteOne({ _id: user._id });

        return res.json({ message: "User account and chat logs deleted" });
    } catch (err) {
        console.error("Delete account error:", err);
        return res.status(500).json({ message: "Server error while deleting" });
    }
};
