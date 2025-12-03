import mongoose from "mongoose";

const deletionLogSchema = new mongoose.Schema({
    userEmail: { type: String, required: true },
    reason: { type: String, default: "user_self_deleted" },
    deletedAt: { type: Date, default: Date.now }
});

export const DeletionLog = mongoose.model("DeletionLog", deletionLogSchema);
