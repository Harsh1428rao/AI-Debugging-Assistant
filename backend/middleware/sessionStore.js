// In-memory session store (for production, use Redis or a database)
const sessions = new Map();

function saveSession(id, data) {
  sessions.set(id, data);
}

function getSession(id) {
  return sessions.get(id) || null;
}

function getAllSessions() {
  return Array.from(sessions.values());
}

function deleteSession(id) {
  if (!sessions.has(id)) return false;
  sessions.delete(id);
  return true;
}

module.exports = { saveSession, getSession, getAllSessions, deleteSession };
