import request from "supertest";
import mongoose from "mongoose";
import app from "../app.js";
import { connectDB } from "../config/db.js";
import { User } from "../models/User.js";

describe("Auth API", () => {
    beforeAll(async () => {
        process.env.MONGO_URI =
            process.env.MONGO_URI || "mongodb://localhost:27017/wellbot_test";
        await connectDB();
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    test("registers a user", async () => {
        const res = await request(app).post("/api/auth/register").send({
            name: "Test User",
            ageGroup: "Young Adult (18-35)",
            language: "en",
            email: "testuser@example.com",
            password: "User@1234"
        });
        expect(res.statusCode).toBe(201);
        expect(res.body.user.email).toBe("testuser@example.com");
        expect(res.body.token).toBeDefined();
    });

    test("prevents duplicate registration", async () => {
        const res = await request(app).post("/api/auth/register").send({
            name: "Test User 2",
            ageGroup: "Young Adult (18-35)",
            language: "en",
            email: "testuser@example.com",
            password: "User@1234"
        });
        expect(res.statusCode).toBe(409);
    });

    test("logs in a user", async () => {
        const res = await request(app).post("/api/auth/login").send({
            email: "testuser@example.com",
            password: "User@1234"
        });
        expect(res.statusCode).toBe(200);
        expect(res.body.token).toBeDefined();
    });
});
