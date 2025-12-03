// server/controllers/chatController.js
import { ChatLog } from "../models/ChatLog.js";

/**
 * Simple rule-based reply engine for WellBot – Wellness Guide
 * Language: "en" or "te"
 */
function getBotReply(message, language) {
  const text = (message || "").toLowerCase();

  // If actual Telugu script is present, force Telugu language
  const hasTeluguChars = /[\u0c00-\u0c7f]/.test(message || "");
  if (hasTeluguChars) {
    language = "te";
  }

  // ---------- HEADACHE / THALA NOPPI ----------
  const hasHeadache =
    text.includes("headache") ||
    text.includes("head ache") ||
    text.includes("thala noppi") ||
    text.includes("tala noppi") ||
    text.includes("thalanoppi") ||
    text.includes("talanoppi") ||
    text.includes("noppi ga undhi") ||
    text.includes("noppi ga undi") ||
    text.includes("talanuppi") ||
    text.includes("thalanuppi");

  if (hasHeadache) {
    if (language === "te") {
      return (
        "మీకు తలనొప్పి (తల నొప్పి) ఉంటే, తగినంత విశ్రాంతి తీసుకోండి, నీరు ఎక్కువగా తాగండి " +
        "మరియు మొబైల్ / టీవీ వినియోగాన్ని తగ్గించండి. నొప్పి అకస్మాత్తుగా ఎక్కువగా ఉంటే, " +
        "తరచుగా వస్తే లేదా వాంతులు, చూపు సమస్యలతో ఉంటే వెంటనే నిపుణుడైన వైద్యుడిని సంప్రదించండి. " +
        "గమనిక: ఇది విద్యాపరమైన సమాచారం మాత్రమే, వైద్య నిర్ధారణ కాదు."
      );
    }
    return (
      "For a mild headache, rest, drink enough water and reduce screen time. " +
      "If the pain is sudden, very severe, or associated with vomiting or vision problems, " +
      "please consult a qualified doctor immediately. This information is educational only."
    );
  }

  // ---------- BODY PAIN ----------
  if (
    text.includes("body pain") ||
    text.includes("body pains") ||
    text.includes("body ache")
  ) {
    if (language === "te") {
      return (
        "శరీర నొప్పి ఉంటే, తగినంత విశ్రాంతి తీసుకోండి, గోరువెచ్చని నీటితో స్నానం చేయండి " +
        "మరియు తేలికపాటి స్ట్రెచింగ్ చేయండి. నొప్పి తగ్గకపోతే, జ్వరం లేదా వాపు ఉంటే " +
        "వైద్యుడిని సంప్రదించండి."
      );
    }
    return (
      "For body pains, take rest, try a warm bath and gentle stretching. " +
      "If pain persists, or if there is swelling or fever, please consult a doctor."
    );
  }

  // ---------- FEVER ----------
  if (text.includes("fever") || text.includes("temperature")) {
    if (language === "te") {
      return (
        "జ్వరముంటే, నీరు ఎక్కువగా తాగండి, విశ్రాంతి తీసుకోండి. రెండు రోజుల కంటే ఎక్కువ కొనసాగితే, " +
        "శ్వాసలో ఇబ్బంది, ఛాతి నొప్పి, గందరగోళం వంటి లక్షణాలు ఉంటే వెంటనే డాక్టర్‌ను సంప్రదించండి. " +
        "వైద్యుడి సలహా లేకుండా మందులు అధికంగా వాడకండి."
      );
    }
    return (
      "For fever, drink plenty of fluids and take rest. If it lasts more than two days, " +
      "or you have trouble breathing, chest pain or confusion, contact a doctor immediately. " +
      "Avoid self-medication without medical advice."
    );
  }

  // ---------- WEIGHT LOSS / DIET ----------
  const hasWeightLoss =
    text.includes("weight loss") ||
    text.includes("lose weight") ||
    text.includes("reduce weight") ||
    // Telugu transliteration phrases
    text.includes("baruvu taggali") ||
    text.includes("baruvu thaggali") ||
    text.includes("baruvu thaggali antey") ||
    text.includes("baruvu taggali antey") ||
    text.includes("baruvu thaggali ante em cheyali") ||
    text.includes("baruvu taggali ante em cheyali");

  if (hasWeightLoss) {
    if (language === "te") {
      return (
        "బరువు తగ్గాలంటే: చక్కెర, జంక్ ఫుడ్, దీపంలో వేసిన వంటకాలు తగ్గించండి. రోజూ కూరగాయలు, " +
        "పండ్లు, సంపూర్ణ ధాన్యాలు, పప్పుదినుసులు తీసుకోండి. వారంలో కనీసం 5 రోజులు, రోజుకు 30 నిమిషాలు " +
        "చురుకైన నడక లేదా వ్యాయామం చేయండి. మీ ఆరోగ్య స్థితికి తగ్గ ప్రత్యేక ప్లాన్ కోసం " +
        "డాక్టర్ లేదా డైటీషియన్‌ను సంప్రదించండి."
      );
    }
    return (
      "For weight loss: reduce sugar, junk food and deep-fried items. Eat more vegetables, fruits, " +
      "whole grains and pulses. Do at least 30 minutes of brisk activity on most days of the week. " +
      "For a personalised plan, consult a doctor or dietitian."
    );
  }

  if (
    text.includes("diet") ||
    text.includes("healthy food") ||
    text.includes("food tips")
  ) {
    if (language === "te") {
      return (
        "ఆరోగ్యకరమైన ఆహారం కోసం: రోజూ పచ్చి కూరగాయలు, పండ్లు, సంపూర్ణ ధాన్యాలు, " +
        "పప్పులు, ప్రోటీన్ ఉన్న ఆహారం (పప్పు, గుడ్లు, పెరుగు మొదలైనవి) తీసుకోండి. " +
        "అధిక ఉప్పు, చక్కెర, నూనె ఉన్న పదార్థాలు తగ్గించండి. ప్యాకెజ్డ్ ఆహారం తక్కువగా వాడండి."
      );
    }
    return (
      "For a healthy diet: include vegetables, fruits, whole grains, pulses and protein-rich foods. " +
      "Limit high-salt, high-sugar and high-fat processed foods. Drink enough water throughout the day."
    );
  }

  // ---------- STRESS ----------
  if (
    text.includes("stress") ||
    text.includes("anxiety") ||
    text.includes("tension")
  ) {
    if (language === "te") {
      return (
        "స్ట్రెస్ తగ్గించాలంటే: లోతైన శ్వాసాభ్యాసం చేయండి, కాస్త నడకకు వెళ్లండి, " +
        "స్క్రీన్ టైమ్ తగ్గించండి మరియు ప్రతిరోజూ సరిపడ నిద్ర తీసుకోండి. మీకు చాలా ఆందోళన " +
        "లేక నిరాశగా ఉంటే, కౌన్సిలర్ లేదా మానసిక వైద్యుడిని సంప్రదించండి."
      );
    }
    return (
      "To reduce stress: try deep breathing, short walks, limiting screen time and maintaining " +
      "regular sleep. If you feel very anxious or low for many days, please talk to a counsellor or doctor."
    );
  }

  // ---------- SLEEP ----------
  if (text.includes("sleep") || text.includes("insomnia")) {
    if (language === "te") {
      return (
        "నిద్ర సమస్య ఉంటే: పడుకునే ముందు మొబైల్, టీవీ వాడకాన్ని తగ్గించండి, " +
        "కాఫీ/టీ వంటి కాఫీన్ పానీయాలు సాయంత్రం తర్వాత తగ్గించండి. ప్రతిరోజూ ఒకే సమయానికి " +
        "నిద్రపోవడానికి ప్రయత్నించండి."
      );
    }
    return (
      "For sleep problems: avoid screens just before bed, reduce caffeine in the evening, and " +
      "try to sleep and wake at the same time every day. Keep your bedroom dark and quiet."
    );
  }

  // ---------- DEFAULT FALLBACK ----------
  if (language === "te") {
    return (
      "క్షమించండి, నేను పూర్తి వైద్య నిర్ధారణ చేయలేను. మీ లక్షణాలను మరింత స్పష్టంగా వివరించండి, " +
      "మరియు సమస్య తీవ్రమైతే లేదా ఎక్కువ రోజులు కొనసాగితే, తప్పనిసరిగా నిపుణుడైన వైద్యుడిని సంప్రదించండి. " +
      "ఇది విద్యాపరమైన సమాచారం మాత్రమే."
    );
  }

  return (
    "Sorry, I cannot provide a full medical diagnosis. Please describe your symptoms more clearly " +
    "and consult a qualified doctor if you are worried. This information is only educational."
  );
}

// =============== MAIN CONTROLLER ===============

export const handleChatMessage = async (req, res) => {
  try {
    const { message, sessionId, language = "en" } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    const userId = req.user?.userId || null;
    const now = new Date();

    const botReply = getBotReply(message, language);

    let chat;
    if (sessionId) {
      chat = await ChatLog.findById(sessionId);
    }

    if (!chat) {
      chat = new ChatLog({
        userId,
        messages: [],
        sessionStart: now,
      });
    }

    // feedback object is created by schema with default values
    chat.messages.push(
      { role: "user", text: message, timestamp: now },
      { role: "bot", text: botReply, timestamp: new Date() }
    );

    chat.sessionEnd = new Date();
    chat.totalSessionTime = chat.sessionEnd - chat.sessionStart;

    await chat.save();

    return res.json({
      sessionId: chat._id,
      messages: chat.messages,
    });
  } catch (err) {
    console.error("Chat error:", err);
    return res.status(500).json({ message: "Chat system error" });
  }
};

/**
 * Save like / dislike + optional comment for a specific bot message
 */
export const saveFeedback = async (req, res) => {
  try {
    const { chatId, messageIndex, rating, comment } = req.body;

    if (!chatId || messageIndex === undefined || rating == null) {
      return res
        .status(400)
        .json({ message: "chatId, messageIndex and rating are required" });
    }

    if (rating !== "like" && rating !== "dislike" && rating !== null) {
      return res.status(400).json({ message: "Invalid rating" });
    }

    const chat = await ChatLog.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat session not found" });
    }

    const msg = chat.messages[messageIndex];
    if (!msg) {
      return res.status(400).json({ message: "Invalid message index" });
    }

    if (msg.role !== "bot") {
      return res
        .status(400)
        .json({ message: "Feedback can only be set for bot messages" });
    }

    msg.feedback = msg.feedback || {};
    msg.feedback.rating = rating;
    msg.feedback.comment = comment || "";

    await chat.save();

    return res.json({
      message: "Feedback saved",
      updatedMessage: msg,
    });
  } catch (err) {
    console.error("Feedback error:", err);
    return res.status(500).json({ message: "Failed to save feedback" });
  }
};
