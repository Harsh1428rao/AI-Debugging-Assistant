import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { getSession } from "../utils/api";
import AnalysisResult from "../components/AnalysisResult";
import ChatPanel from "../components/ChatPanel";

export default function SessionDetailPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getSession(id);
        setSession(data);
      } catch {
        setError("Session not found or has expired.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-terminal-green" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-2 bg-terminal-red/10 border border-terminal-red/20 rounded px-4 py-3 mb-4">
          <AlertCircle size={14} className="text-terminal-red" />
          <span className="font-mono text-sm text-terminal-red">{error}</span>
        </div>
        <Link to="/sessions" className="text-xs font-mono text-terminal-muted hover:text-terminal-green transition-colors">
          ← Back to History
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Link to="/sessions" className="text-terminal-muted hover:text-terminal-green transition-colors">
          <ArrowLeft size={16} />
        </Link>
        <div>
          <h1 className="text-xl font-display font-bold text-terminal-text">Session Detail</h1>
          <div className="text-xs font-mono text-terminal-muted">
            {new Date(session.createdAt).toLocaleString()} · ID: {id.slice(0, 8)}...
          </div>
        </div>
      </div>

      {/* Original Log Preview */}
      <div className="mb-6 rounded-lg border border-terminal-border bg-terminal-surface overflow-hidden">
        <div className="px-4 py-2 bg-black/20 border-b border-terminal-border">
          <span className="text-xs font-mono text-terminal-muted">Original Log (preview)</span>
        </div>
        <pre className="p-4 text-xs font-mono text-terminal-muted/70 overflow-x-auto whitespace-pre-wrap max-h-24 overflow-y-auto">
          {session.logContent}
        </pre>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalysisResult analysis={session.analysis} />
        <ChatPanel sessionId={id} />
      </div>
    </div>
  );
}
