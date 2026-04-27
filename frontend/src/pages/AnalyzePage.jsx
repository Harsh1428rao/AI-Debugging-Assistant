import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Search, X, FileText, AlertCircle, Loader2 } from "lucide-react";
import { analyzeLogs } from "../utils/api";
import AnalysisResult from "../components/AnalysisResult";
import ChatPanel from "../components/ChatPanel";

const SAMPLE_LOG = `ERROR 2024-01-15 14:23:45 [main] com.app.service.UserService - Failed to fetch user data
java.lang.NullPointerException: Cannot invoke method getId() on null object
    at com.app.service.UserService.getUserById(UserService.java:45)
    at com.app.controller.UserController.getUser(UserController.java:67)
    at sun.reflect.NativeMethodAccessorImpl.invoke0(Native Method)
Caused by: com.app.exception.DatabaseException: Connection timeout after 30000ms
    at com.app.db.ConnectionPool.getConnection(ConnectionPool.java:112)
WARN  2024-01-15 14:23:46 [main] - Retry attempt 1/3 failed
WARN  2024-01-15 14:23:47 [main] - Retry attempt 2/3 failed  
ERROR 2024-01-15 14:23:48 [main] - All retry attempts exhausted`;

export default function AnalyzePage() {
  const navigate = useNavigate();
  const fileInputRef = useRef();
  const [logText, setLogText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [sessionId, setSessionId] = useState(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setLogText(ev.target.result);
      reader.readAsText(f);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) {
      setFile(f);
      const reader = new FileReader();
      reader.onload = (ev) => setLogText(ev.target.result);
      reader.readAsText(f);
    }
  };

  const clearFile = () => {
    setFile(null);
    setLogText("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAnalyze = async () => {
    if (!logText.trim() && !file) {
      setError("Please paste a log or upload a file.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    try {
      const data = await analyzeLogs(logText, file);
      setResult(data.analysis);
      setSessionId(data.sessionId);
    } catch (err) {
      setError(err.response?.data?.message || "Analysis failed. Check your backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold text-terminal-text mb-1">
          <span className="text-terminal-green text-glow-green">$</span> Analyze Log
        </h1>
        <p className="text-terminal-muted text-sm font-mono">Paste your error log, stack trace, or upload a file</p>
      </div>

      <div className={`grid gap-6 ${result ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1"}`}>
        {/* Input Panel */}
        <div className="space-y-4">
          {/* Drop zone */}
          {!file && (
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-terminal-border rounded-lg p-4 text-center cursor-pointer hover:border-terminal-green/40 transition-all group"
            >
              <Upload size={20} className="mx-auto mb-2 text-terminal-muted group-hover:text-terminal-green transition-colors" />
              <div className="text-xs font-mono text-terminal-muted">Drop log file here or click to upload</div>
              <div className="text-xs font-mono text-terminal-muted/50 mt-1">.log .txt .json (max 5MB)</div>
              <input ref={fileInputRef} type="file" accept=".log,.txt,.json" className="hidden" onChange={handleFileChange} />
            </div>
          )}

          {file && (
            <div className="flex items-center gap-3 bg-terminal-green/10 border border-terminal-green/20 rounded px-3 py-2">
              <FileText size={14} className="text-terminal-green flex-shrink-0" />
              <span className="text-xs font-mono text-terminal-green flex-1 truncate">{file.name}</span>
              <button onClick={clearFile} className="text-terminal-muted hover:text-terminal-red transition-colors">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Text area */}
          <div className="relative">
            <textarea
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              placeholder="Paste your error log, stack trace, or crash dump here..."
              rows={14}
              className="w-full bg-terminal-surface border border-terminal-border rounded-lg p-4 text-xs font-mono text-terminal-text placeholder-terminal-muted/40 resize-none focus:outline-none focus:border-terminal-green/40 transition-all"
            />
            {!logText && (
              <button
                onClick={() => setLogText(SAMPLE_LOG)}
                className="absolute bottom-3 right-3 text-xs font-mono text-terminal-muted hover:text-terminal-cyan transition-colors"
              >
                try sample →
              </button>
            )}
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-terminal-red/10 border border-terminal-red/20 rounded px-3 py-2">
              <AlertCircle size={14} className="text-terminal-red flex-shrink-0" />
              <span className="text-xs font-mono text-terminal-red">{error}</span>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={loading || (!logText.trim() && !file)}
            className="w-full flex items-center justify-center gap-2 bg-terminal-green text-terminal-bg py-3 rounded font-mono font-bold text-sm hover:bg-terminal-green/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all glow-green"
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing with AI...
              </>
            ) : (
              <>
                <Search size={16} />
                Analyze Log
              </>
            )}
          </button>
        </div>

        {/* Results Panel */}
        {result && (
          <div className="space-y-4 animate-fade-in-up">
            <AnalysisResult analysis={result} />
            {sessionId && <ChatPanel sessionId={sessionId} />}
          </div>
        )}
      </div>
    </div>
  );
}
