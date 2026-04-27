const express = require("express");
const Anthropic = require("@anthropic-ai/sdk");
const { getSession, saveSession } = require("../middleware/sessionStore");

const router = express.Router();
const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const CHAT_SYSTEM_PROMPT = `You are an expert debugging assistant. You have previously analyzed an error/log and are now answering follow-up questions.
Be concise, technical, and helpful. When providing code examples, use proper markdown code blocks with language identifiers.
Focus on practical, actionable answers. If the user asks about something unrelated to the current debugging session, politely redirect them.`;

router.post("/", async (req, res) => {
  try {
    const { sessionId, message } = req.body;

    if (!sessionId || !message) {
      return res.status(400).json({ error: "sessionId and message are required" });
    }

    const session = getSession(sessionId);
    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    const contextMessage = `Context - Original log analyzed:\n${session.logContent}\n\nInitial Analysis Summary: ${session.analysis.summary}\nRoot Cause: ${session.analysis.rootCause?.description || "N/A"}`;

    const messages = [
      { role: "user", content: contextMessage },
      { role: "assistant", content: "I've reviewed the log and analysis. How can I help you further?" },
      ...session.chatHistory,
      { role: "user", content: message },
    ];

    const response = await client.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2048,
      system: CHAT_SYSTEM_PROMPT,
      messages,
    });

    const assistantMessage = response.content[0].text;

    session.chatHistory.push(
      { role: "user", content: message },
      { role: "assistant", content: assistantMessage }
    );
    saveSession(sessionId, session);

    res.json({ message: assistantMessage });
  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({ error: "Failed to process chat message", message: err.message });
  }
});

module.exports = router;
