import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 60000,
});

// Analyze logs
export async function analyzeLogs(logText, file) {
  const formData = new FormData();
  if (file) formData.append("logFile", file);
  if (logText) formData.append("logText", logText);

  const response = await api.post("/analyze", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
}

// Send chat message
export async function sendChatMessage(sessionId, message) {
  const response = await api.post("/chat", { sessionId, message });
  return response.data;
}

// Get all sessions
export async function getSessions() {
  const response = await api.get("/sessions");
  return response.data;
}

// Get single session
export async function getSession(id) {
  const response = await api.get(`/sessions/${id}`);
  return response.data;
}

// Delete session
export async function deleteSession(id) {
  const response = await api.delete(`/sessions/${id}`);
  return response.data;
}
