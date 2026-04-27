import { useState, useRef, useEffect } from "react";
import { Send, MessageSquare, Loader2, Bot, User } from "lucide-react";
import { sendChatMessage } from "../utils/api";
import ReactMarkdown from "react-markdown";

function ChatMessage({ role, content }) {
  const isAssistant = role === "assistant";
  return (
    <div className={`flex gap-3 ${isAssistant ? "" : "flex-row-reverse"}`}>
      <div
        className={`w-7 h-7 rounded flex-shrink-0 flex items-center justify-center ${
          isAssistant ? "bg-terminal-green/10 border border-terminal-green/20" : "bg-terminal-cyan/10 border border-terminal-cyan/20"
        }`}
      >
        {isAssistant ? <Bot size={14} className="text-terminal-green" /> : <User size={14} className="text-terminal-cyan" />}
      </div>
      <div
        className={`flex-1 rounded-lg px-3 py-2 text-xs font-mono leading-relaxed max-w-[85%] ${
          isAssistant
            ? "bg-terminal-surface border border-terminal-border text-terminal-text"
            : "bg-terminal-cyan/10 border border-terminal-cyan/20 text-terminal-text"
        }`}
      >
        {isAssistant ? (
          <ReactMarkdown
            components={{
              code: ({ inline, children }) =>
                inline ? (
                  <code className="bg-black/40 px-1 rounded text-terminal-green">{children}</code>
                ) : (
                  <pre className="bg-black/40 rounded p-2 overflow-x-auto mt-1 mb-1">
                    <code className="text-terminal-green">{children}</code>
                  </pre>
                ),
              p: ({ children }) => <p className="mb-1 last:mb-0">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-4 space-y-0.5">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-4 space-y-0.5">{children}</ol>,
            }}
          >
            {content}
          </ReactMarkdown>
        ) : (
          content
        )}
      </div>
    </div>
  );
}

const SUGGESTIONS = [
  "How can I prevent this in the future?",
  "Show me a complete fixed version",
  "What monitoring should I add?",
  "Are there any security implications?",
];

export default function ChatPanel({ sessionId }) {
  const [messages, setMessages] = useState([
    { role: "assistant", content: "I've analyzed your log. Ask me anything — about the error, fixes, or how to improve your code." },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async (text) => {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: msg }]);
    setLoading(true);
    try {
      const { message } = await sendChatMessage(sessionId, msg);
      setMessages((prev) => [...prev, { role: "assistant", content: message }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "⚠️ Failed to get response. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-terminal-border bg-terminal-surface overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3 border-b border-terminal-border bg-black/20">
        <MessageSquare size={14} className="text-terminal-cyan" />
        <span className="text-xs font-mono font-bold text-terminal-text">Follow-up Chat</span>
      </div>

      {/* Messages */}
      <div className="h-64 overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <ChatMessage key={i} role={m.role} content={m.content} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded flex-shrink-0 flex items-center justify-center bg-terminal-green/10 border border-terminal-green/20">
              <Bot size={14} className="text-terminal-green" />
            </div>
            <div className="flex items-center gap-2 bg-terminal-surface border border-terminal-border rounded-lg px-3 py-2">
              <Loader2 size={12} className="animate-spin text-terminal-green" />
              <span className="text-xs font-mono text-terminal-muted">Thinking...</span>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Suggestions */}
      {messages.length <= 1 && (
        <div className="px-4 pb-2 flex flex-wrap gap-1.5">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => send(s)}
              className="text-xs font-mono px-2 py-1 rounded border border-terminal-border text-terminal-muted hover:border-terminal-cyan/40 hover:text-terminal-cyan transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-terminal-border p-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send()}
          placeholder="Ask a follow-up question..."
          className="flex-1 bg-black/30 border border-terminal-border rounded px-3 py-2 text-xs font-mono text-terminal-text placeholder-terminal-muted/40 focus:outline-none focus:border-terminal-cyan/40 transition-all"
          disabled={loading}
        />
        <button
          onClick={() => send()}
          disabled={loading || !input.trim()}
          className="flex items-center justify-center w-8 h-8 rounded bg-terminal-cyan/20 border border-terminal-cyan/30 text-terminal-cyan hover:bg-terminal-cyan/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          <Send size={13} />
        </button>
      </div>
    </div>
  );
}
