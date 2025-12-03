import React, { useState } from "react";

const ChatMessage = ({
    index,
    sessionId,
    role,
    text,
    timestamp,
    feedback,
    onFeedback,
}) => {
    const isUser = role === "user";

    const time =
        timestamp && typeof timestamp === "string"
            ? new Date(timestamp)
            : timestamp
                ? new Date(timestamp)
                : null;
    const timeStr = time ? time.toLocaleTimeString() : "";

    const [showCommentBox, setShowCommentBox] = useState(false);
    const [commentText, setCommentText] = useState(
        feedback?.comment || ""
    );

    const currentRating = feedback?.rating || null;

    const handleRate = (rating) => {
        if (!onFeedback) return;

        // toggle if same rating clicked again
        const newRating = currentRating === rating ? null : rating;
        onFeedback(newRating, commentText);
    };

    const handleSubmitComment = (e) => {
        e.preventDefault();
        if (!onFeedback) return;
        onFeedback(currentRating, commentText);
        setShowCommentBox(false);
    };

    return (
        <div
            className={`chat-message ${isUser ? "chat-message-user" : "chat-message-bot"
                }`}
        >
            {/* inner wrapper to stack bubble + feedback vertically */}
            <div className="chat-message-inner">
                <div className="chat-bubble">
                    <p>{text}</p>
                    {timeStr && <span className="chat-time">{timeStr}</span>}
                </div>

                {/* Feedback only for bot messages */}
                {!isUser && sessionId && (
                    <div className="chat-feedback-row">
                        <span className="chat-feedback-label">Was this helpful?</span>

                        <button
                            type="button"
                            className={`chat-feedback-btn ${currentRating === "like" ? "active-like" : ""
                                }`}
                            onClick={() => handleRate("like")}
                        >
                            👍
                        </button>

                        <button
                            type="button"
                            className={`chat-feedback-btn ${currentRating === "dislike" ? "active-dislike" : ""
                                }`}
                            onClick={() => handleRate("dislike")}
                        >
                            👎
                        </button>

                        <button
                            type="button"
                            className="chat-feedback-comment-link"
                            onClick={() => setShowCommentBox((v) => !v)}
                        >
                            {showCommentBox ? "Close comment" : "Add comment"}
                        </button>

                        {showCommentBox && (
                            <form
                                className="chat-feedback-comment-form"
                                onSubmit={handleSubmitComment}
                            >
                                <textarea
                                    rows="2"
                                    placeholder="Share a short comment…"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                />
                                <button type="submit" className="btn-primary btn-small">
                                    Save
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatMessage;
