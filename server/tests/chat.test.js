import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";

describe("Chat API", () => {
    let token;

    beforeAll(async () => {
        process.env.MONGO_URI =
            process.env.MONGO_URI || "mongodb://localhost:27017/wellbot_test";
        await connectDB();
        await User.deleteMany({});

        const passwordHash = await bcrypt.hash("User@1234", 10);
        await User.create({
            name: "Chat User",
            ageGroup: "Young Adult (18-35)",
            language: "en",
            email: "chatuser@example.com",
            passwordHash,
            role: "user"
        });

        const res = await request(app).post("/api/auth/login").send({
            email: "chatuser@example.com",
            password: "User@1234"
        });
        token = res.body.token;
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("responds to chat message", async () => {
        const res = await request(app)
            .post("/api/chat/message")
            .set("Authorization", `Bearer ${token}`)
            .send({ message: "I have a headache", language: "en" });

        expect(res.statusCode).toBe(200);
        expect(res.body.messages).toBeDefined();
        expect(res.body.messages.length).toBeGreaterThan(0);
    });
});
