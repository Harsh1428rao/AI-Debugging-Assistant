import { Link } from "react-router-dom";
import { Search, Zap, Bug, MessageSquare, History, ChevronRight, Shield, Code2 } from "lucide-react";

const features = [
  { icon: Bug, title: "Root Cause Analysis", desc: "AI identifies the exact source of your error with deep log parsing.", color: "text-terminal-red" },
  { icon: Code2, title: "Code Fix Suggestions", desc: "Get ready-to-paste code snippets that directly solve the issue.", color: "text-terminal-green" },
  { icon: MessageSquare, title: "Follow-up Chat", desc: "Ask follow-up questions and dive deeper into any aspect of the bug.", color: "text-terminal-cyan" },
  { icon: History, title: "Debug History", desc: "All your sessions saved. Revisit, compare, and learn from past bugs.", color: "text-terminal-purple" },
  { icon: Shield, title: "Pattern Detection", desc: "Spot recurring error patterns across your codebase.", color: "text-terminal-amber" },
  { icon: Zap, title: "Instant Analysis", desc: "Powered by Kabir for fast, accurate, and comprehensive debugging.", color: "text-terminal-green" },
];

const exampleErrors = [
  "NullPointerException in UserService.java:45",
  "SIGABRT - EXC_BAD_ACCESS (SIGSEGV)",
  "FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed",
  "ORA-00904: invalid identifier",
];

export default function HomePage() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in-up">
      {/* Hero */}
      <div className="text-center pt-8">
        <div className="inline-flex items-center gap-2 bg-terminal-green/10 border border-terminal-green/20 rounded-full px-4 py-1.5 mb-6">
          <div className="w-1.5 h-1.5 rounded-full bg-terminal-green animate-pulse" />
          <span className="text-xs font-mono text-terminal-green tracking-wider">AI-POWERED DEBUGGING</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 leading-tight">
          <span className="text-terminal-text">Debug Faster.</span>
          <br />
          <span className="text-terminal-green text-glow-green">Ship Confidently.</span>
        </h1>

        <p className="text-terminal-muted font-body max-w-xl mx-auto text-lg mb-8">
          Paste your error logs, crash dumps, or stack traces. Get instant AI-powered root cause analysis, 
          fix suggestions, and code patches.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/analyze"
            className="inline-flex items-center gap-2 bg-terminal-green text-terminal-bg px-6 py-3 rounded font-mono font-bold text-sm hover:bg-terminal-green/90 transition-all glow-green"
          >
            <Search size={16} />
            Analyze a Log
            <ChevronRight size={14} />
          </Link>
          <Link
            to="/sessions"
            className="inline-flex items-center gap-2 border border-terminal-border text-terminal-text px-6 py-3 rounded font-mono text-sm hover:border-terminal-cyan/40 hover:text-terminal-cyan transition-all"
          >
            <History size={16} />
            View History
          </Link>
        </div>
      </div>

      {/* Terminal demo */}
      <div className="rounded-lg border border-terminal-border bg-terminal-surface overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-3 bg-black/30 border-b border-terminal-border">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-terminal-red/70" />
            <div className="w-3 h-3 rounded-full bg-terminal-amber/70" />
            <div className="w-3 h-3 rounded-full bg-terminal-green/70" />
          </div>
          <span className="text-xs font-mono text-terminal-muted ml-2">debug-ai — bash</span>
        </div>
        <div className="p-5 space-y-2 font-mono text-sm">
          <div className="text-terminal-green">$ debug-ai analyze --input error.log</div>
          <div className="text-terminal-muted">Parsing log file... ████████████ 100%</div>
          <div className="text-terminal-cyan">✓ Root cause identified: Database connection pool exhausted</div>
          <div className="text-terminal-cyan">✓ 3 error patterns detected</div>
          <div className="text-terminal-green">✓ 2 fixes generated with code snippets</div>
          <div className="text-terminal-muted mt-2">Analysis complete in 1.2s</div>
          <div className="text-terminal-text/50 cursor">_</div>
        </div>
      </div>

      {/* Features */}
      <div>
        <h2 className="text-xl font-display font-bold text-terminal-text mb-6">
          <span className="text-terminal-cyan text-glow-cyan">//</span> Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="p-5 rounded-lg border border-terminal-border bg-terminal-surface hover:border-terminal-border/80 transition-all group"
            >
              <div className={`${color} mb-3`}>
                <Icon size={20} />
              </div>
              <div className="font-mono font-bold text-terminal-text text-sm mb-1">{title}</div>
              <div className="text-terminal-muted text-xs leading-relaxed">{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Supported errors */}
      <div className="rounded-lg border border-terminal-border bg-terminal-surface p-5">
        <div className="text-xs font-mono text-terminal-muted mb-3 uppercase tracking-wider">Handles errors like</div>
        <div className="space-y-2">
          {exampleErrors.map((err) => (
            <div key={err} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-terminal-red flex-shrink-0" />
              <code className="text-xs text-terminal-red/80 font-mono">{err}</code>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
