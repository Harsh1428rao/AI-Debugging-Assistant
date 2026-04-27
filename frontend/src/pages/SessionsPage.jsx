import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { History, Trash2, ChevronRight, RefreshCw, MessageSquare, AlertCircle } from "lucide-react";
import { getSessions, deleteSession } from "../utils/api";

const severityColors = {
  critical: "severity-critical",
  high: "severity-high",
  medium: "severity-medium",
  low: "severity-low",
};

export default function SessionsPage() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getSessions();
      setSessions(data);
    } catch {
      setError("Could not load sessions. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleDelete = async (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    await deleteSession(id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-display font-bold text-terminal-text mb-1">
            <span className="text-terminal-cyan text-glow-cyan">$</span> Debug History
          </h1>
          <p className="text-terminal-muted text-sm font-mono">{sessions.length} session{sessions.length !== 1 ? "s" : ""} stored</p>
        </div>
        <button onClick={load} className="flex items-center gap-1.5 text-xs font-mono text-terminal-muted hover:text-terminal-green transition-colors">
          <RefreshCw size={13} />
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-16 text-terminal-muted font-mono text-sm">
          <div className="w-5 h-5 border-2 border-terminal-green/30 border-t-terminal-green rounded-full animate-spin mx-auto mb-3" />
          Loading sessions...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 bg-terminal-red/10 border border-terminal-red/20 rounded px-4 py-3">
          <AlertCircle size={14} className="text-terminal-red" />
          <span className="text-sm font-mono text-terminal-red">{error}</span>
        </div>
      )}

      {!loading && !error && sessions.length === 0 && (
        <div className="text-center py-16 border border-dashed border-terminal-border rounded-lg">
          <History size={32} className="mx-auto mb-3 text-terminal-muted/30" />
          <div className="text-terminal-muted font-mono text-sm">No sessions yet</div>
          <Link to="/analyze" className="inline-block mt-4 text-xs font-mono text-terminal-green hover:underline">
            → Start your first analysis
          </Link>
        </div>
      )}

      <div className="space-y-3">
        {sessions.map((s) => (
          <Link
            key={s.id}
            to={`/sessions/${s.id}`}
            className="block border border-terminal-border rounded-lg bg-terminal-surface hover:border-terminal-border/70 transition-all group"
          >
            <div className="flex items-start gap-4 p-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-mono px-1.5 py-0.5 rounded border ${severityColors[s.severity] || "severity-medium"}`}>
                    {s.severity?.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono text-terminal-muted">
                    {new Date(s.createdAt).toLocaleString()}
                  </span>
                  {s.chatCount > 0 && (
                    <span className="flex items-center gap-1 text-xs font-mono text-terminal-cyan">
                      <MessageSquare size={10} />
                      {s.chatCount}
                    </span>
                  )}
                </div>
                <div className="text-sm font-mono text-terminal-text truncate">{s.summary}</div>
                <div className="text-xs font-mono text-terminal-muted mt-1 truncate opacity-60">{s.logPreview}</div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={(e) => handleDelete(e, s.id)}
                  className="opacity-0 group-hover:opacity-100 text-terminal-muted hover:text-terminal-red transition-all p-1"
                >
                  <Trash2 size={13} />
                </button>
                <ChevronRight size={14} className="text-terminal-muted group-hover:text-terminal-green transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
