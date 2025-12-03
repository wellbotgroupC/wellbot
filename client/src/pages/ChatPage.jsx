import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import api from "../services/api.js";
import { useAuth } from "../contexts/AuthContext.jsx";
import ChatMessage from "../components/ChatMessage.jsx";

const ChatPage = () => {
    const { t, i18n } = useTranslation();
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState(null);
    const [input, setInput] = useState("");
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to bottom on new message
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, sending]);

    // 🔹 Save like / dislike / comment for a bot message
    const handleFeedback = async (messageIndex, rating, comment) => {
        if (!sessionId) return; // no session yet = nothing to save

        try {
            const res = await api.post("/chat/feedback", {
                chatId: sessionId,
                messageIndex,
                rating, // "like" | "dislike" | null
                comment,
            });

            const updated = res.data.updatedMessage;

            // update corresponding message in local state
            setMessages((prev) =>
                prev.map((m, idx) =>
                    idx === messageIndex ? { ...m, feedback: updated.feedback } : m
                )
            );
        } catch (err) {
            console.error("Feedback error", err);
            // (optional) show toast or error text
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const tempUserMsg = {
            role: "user",
            text: input,
            timestamp: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, tempUserMsg]);
        setInput("");
        setSending(true);

        // 🟣 IMPORTANT: decide language based on CURRENT UI, not stored profile
        const currentLang =
            (i18n.language || "").toLowerCase().startsWith("te") ? "te" : "en";

        try {
            const res = await api.post("/chat/message", {
                message: tempUserMsg.text,
                language: currentLang,
                sessionId,
            });

            setSessionId(res.data.sessionId);
            setMessages(res.data.messages);
        } catch (err) {
            console.error("Chat error", err);
            setMessages((prev) => [
                ...prev,
                {
                    role: "bot",
                    text: t("chat.error"),
                    timestamp: new Date().toISOString(),
                },
            ]);
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="chat-page">
            <div className="chat-container">
                <div className="chat-header">
                    <h1>{t("chat.title")}</h1>
                    <p className="chat-subtitle">{t("chat.subtitle")}</p>
                </div>

                <div className="chat-window">
                    {messages.map((m, i) => (
                        <ChatMessage
                            key={i}
                            index={i}
                            sessionId={sessionId}
                            role={m.role}
                            text={m.text}
                            timestamp={m.timestamp}
                            feedback={m.feedback}
                            onFeedback={(rating, comment) =>
                                handleFeedback(i, rating, comment)
                            }
                        />
                    ))}

                    {sending && (
                        <div className="chat-message chat-message-bot">
                            <div className="chat-bubble typing-indicator">
                                <span className="dot" />
                                <span className="dot" />
                                <span className="dot" />
                            </div>
                        </div>
                    )}

                    <div ref={messagesEndRef} />
                </div>

                <form className="chat-input-row" onSubmit={sendMessage}>
                    <input
                        className="chat-input"
                        type="text"
                        placeholder={t("chat.placeholder")}
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button className="btn-primary" type="submit" disabled={sending}>
                        {t("chat.send")}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatPage;
