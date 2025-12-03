import rateLimit from "express-rate-limit";

export const chatRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: { message: "Too many requests, please slow down." }
});
