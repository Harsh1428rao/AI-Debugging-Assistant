const express = require("express");
const multer = require("multer");
const OpenAI = require("openai");
const { v4: uuidv4 } = require("uuid");
const { saveSession, getSession } = require("../middleware/sessionStore");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are an expert debugging assistant with deep knowledge of software systems, programming languages, and common error patterns.

When analyzing logs, errors, or crash dumps, you MUST respond in the following JSON format ONLY:
{
  "summary": "One-sentence summary of the issue",
  "severity": "critical|high|medium|low",
  "rootCause": {
    "title": "Root cause title",
    "description": "Detailed explanation of what caused this error"
  },
  "errorPatterns": [
    {
      "pattern": "Pattern name",
      "description": "What this pattern indicates",
      "occurrences": number
    }
  ],
  "fixes": [
    {
      "title": "Fix title",
      "description": "Detailed fix description",
      "priority": "immediate|short-term|long-term",
      "codeSnippet": {
        "language": "language name",
        "before": "problematic code (if applicable, else null)",
        "after": "fixed code"
      }
    }
  ],
  "additionalRecommendations": ["recommendation 1", "recommendation 2"],
  "affectedComponents": ["component1", "component2"]
}

Analyze deeply and provide actionable, specific advice. Always include at least one code snippet when applicable.`;

router.post("/", upload.single("logFile"), async (req, res) => {
  try {
    let logContent = req.body.logText || "";

    if (req.file) {
      logContent = req.file.buffer.toString("utf-8");
    }

    if (!logContent.trim()) {
      return res.status(400).json({ error: "No log content provided" });
    }

    const message = await client.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 4096,
     messages: [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: `Analyze this log:\n\n${logContent}` }
       ],
      });
     const responseText = message.choices[0].message.content;

    
    let analysis;

    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseErr) {
      analysis = {
        summary: "Analysis completed",
        severity: "medium",
        rootCause: { title: "See details", description: responseText },
        errorPatterns: [],
        fixes: [],
        additionalRecommendations: [],
        affectedComponents: [],
      };
    }

    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      logContent: logContent.substring(0, 500) + (logContent.length > 500 ? "..." : ""),
      analysis,
      chatHistory: [],
    };

    saveSession(sessionId, session);

    res.json({ sessionId, analysis });
  } catch (err) {
    console.error("Analyze error:", err);
    res.status(500).json({ error: "Failed to analyze logs", message: err.message });
  }
});

module.exports = router;
