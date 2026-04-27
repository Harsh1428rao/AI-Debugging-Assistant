const express = require("express");
const { getAllSessions, getSession, deleteSession } = require("../middleware/sessionStore");

const router = express.Router();

// Get all sessions (summary list)
router.get("/", (req, res) => {
  const sessions = getAllSessions();
  const summaries = sessions.map((s) => ({
    id: s.id,
    createdAt: s.createdAt,
    summary: s.analysis?.summary || "No summary",
    severity: s.analysis?.severity || "unknown",
    logPreview: s.logContent,
    chatCount: s.chatHistory?.length / 2 || 0,
  }));
  res.json(summaries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
});

// Get a specific session
router.get("/:id", (req, res) => {
  const session = getSession(req.params.id);
  if (!session) return res.status(404).json({ error: "Session not found" });
  res.json(session);
});

// Delete a session
router.delete("/:id", (req, res) => {
  const deleted = deleteSession(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Session not found" });
  res.json({ success: true });
});

module.exports = router;
