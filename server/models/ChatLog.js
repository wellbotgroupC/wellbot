import mongoose from "mongoose";

/* =========================
   Message Schema
========================= */
const messageSchema = new mongoose.Schema(
    {
        role: {
            type: String,
            enum: ["user", "bot"],
            required: true,
        },

        text: {
            type: String,
            required: true,
        },

        timestamp: {
            type: Date,
            default: Date.now,
        },

        /* =========================
           NEW: Feedback for BOT messages
        ========================= */
        feedback: {
            rating: {
                type: String,
                enum: ["like", "dislike", null],
                default: null,
            },
            comment: {
                type: String,
                default: "",
            },
        },
    },
    { _id: false }
);

/* =========================
   Chat Log Schema
========================= */
const chatLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    messages: [messageSchema],

    sessionStart: {
        type: Date,
        default: Date.now,
    },

    sessionEnd: {
        type: Date,
    },

    totalSessionTime: {
        type: Number, // in milliseconds
    },
});

/* =========================
   Export Model
========================= */
export const ChatLog = mongoose.model("ChatLog", chatLogSchema);
