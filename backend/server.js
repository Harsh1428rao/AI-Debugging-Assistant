require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");

const analyzeRoutes = require("./routes/analyze");
const chatRoutes = require("./routes/chat");
const sessionsRoutes = require("./routes/sessions");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:3000",
  methods: ["GET", "POST", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Routes
app.use("/api/analyze", analyzeRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionsRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({
    error: "Internal server error",
    message: err.message || "Something went wrong",
  });
});
console.log("API KEY loaded:", process.env.OPENAI_API_KEY ? "YES ✅" : "NO ❌");
app.listen(PORT, () => {
  console.log(`🚀 AI Debug Assistant backend running on port ${PORT}`);
});
