import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    ageGroup: {
        type: String,
        enum: ["< 18", "18 - 30", "30 - 40", "40 - 50", "> 50"],
        required: true
    },

    language: {
        type: String,
        enum: ["en", "te"],
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    passwordHash: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

export const User = mongoose.model("User", userSchema);
