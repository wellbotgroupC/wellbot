// server/scripts/seed.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import { User } from "../models/User.js";
import { ChatLog } from "../models/ChatLog.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/wellbot";

async function run() {
    try {
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected");

        const adminEmail = process.env.ADMIN_SEED_EMAIL || "admin@wellbot.local";
        const adminPassword =
            process.env.ADMIN_SEED_PASSWORD || "Admin@123";

        // 🔹 Make sure password is hashed
        const passwordHash = await bcrypt.hash(adminPassword, 10);

        // 🔹 Upsert (create or update) admin user
        let admin = await User.findOne({ email: adminEmail });

        if (!admin) {
            admin = await User.create({
                name: "WellBot Admin",
                ageGroup: "30 - 40", // ✅ must match the enum in User.js
                language: "en",
                email: adminEmail,
                passwordHash,
                role: "admin"
            });
            console.log("Admin created:", admin.email);
        } else {
            admin.passwordHash = passwordHash;
            admin.role = "admin";
            admin.ageGroup = "30 - 40";
            admin.language = admin.language || "en";
            await admin.save();
            console.log("Admin already exists, updated password for:", admin.email);
        }

        // 🔹 Optional: seed a sample normal user
        let demoUser = await User.findOne({ email: "demo@user.com" });
        if (!demoUser) {
            const demoHash = await bcrypt.hash("Demo123", 10);
            demoUser = await User.create({
                name: "Demo User",
                ageGroup: "18 - 30",
                language: "en",
                email: "demo@user.com",
                passwordHash: demoHash,
                role: "user"
            });
            console.log("Demo user created:", demoUser.email);
        }

        // 🔹 Optional: sample chat log
        const existingLog = await ChatLog.findOne({ userId: demoUser._id });
        if (!existingLog) {
            await ChatLog.create({
                userId: demoUser._id,
                messages: [
                    {
                        role: "user",
                        text: "I feel tired very often, what can I do?",
                        timestamp: new Date(Date.now() - 1000 * 60 * 10)
                    },
                    {
                        role: "bot",
                        text:
                            "Make sure you sleep 7–8 hours, drink enough water, and include iron-rich foods. If it continues, consult a doctor.",
                        timestamp: new Date(Date.now() - 1000 * 60 * 9)
                    }
                ],
                totalSessionTime: 9 * 60 * 1000,
                sessionStart: new Date(Date.now() - 1000 * 60 * 10),
                sessionEnd: new Date(Date.now() - 1000 * 60 * 1)
            });
            console.log("Sample chat log created for demo user");
        }

        console.log("Seeding complete");
        await mongoose.disconnect();
        process.exit(0);
    } catch (err) {
        console.error("Seeding error", err);
        await mongoose.disconnect();
        process.exit(1);
    }
}

run();
