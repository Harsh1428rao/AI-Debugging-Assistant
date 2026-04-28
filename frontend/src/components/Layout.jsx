import { Link, useLocation } from "react-router-dom";
import { Bug, Search, History, Home, Terminal, Zap } from "lucide-react";

const navItems = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/analyze", icon: Search, label: "Analyze" },
  { path: "/sessions", icon: History, label: "History" },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-terminal-bg font-body">
      {/* Sidebar */}
      <aside className="w-64 border-r border-terminal-border flex flex-col bg-terminal-surface">
        {/* Logo */}
        <div className="p-5 border-b border-terminal-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-terminal-green/10 border border-terminal-green/30 flex items-center justify-center glow-green">
              <Bug size={18} className="text-terminal-green" />
            </div>
            <div>
              <div className="font-display font-bold text-terminal-green text-sm tracking-wider text-glow-green">
                DEBUG<span className="text-terminal-cyan">AI</span>
              </div>
              <div className="text-terminal-muted text-xs font-mono">v1.0.0</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ path, icon: Icon, label }) => {
            const active = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded text-sm font-mono transition-all ${
                  active
                    ? "bg-terminal-green/10 text-terminal-green border border-terminal-green/20 glow-green"
                    : "text-terminal-muted hover:text-terminal-text hover:bg-white/5"
                }`}
              >
                <Icon size={15} />
                {active && <span className="text-terminal-green opacity-50">{">"}</span>}
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-terminal-border">
          <div className="flex items-center gap-2 text-xs font-mono text-terminal-muted">
            <div className="w-2 h-2 rounded-full bg-terminal-green animate-pulse" />
            <span>System Online</span>
          </div>
          <div className="mt-2 text-xs font-mono text-terminal-muted/60">
            Powered by Kabir Chat
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {/* Top bar */}
        <div className="border-b border-terminal-border bg-terminal-surface px-6 py-3 flex items-center gap-3">
          <Terminal size={14} className="text-terminal-green" />
          <span className="text-xs font-mono text-terminal-muted">
            {location.pathname === "/" && "~/debug-ai $ home"}
            {location.pathname === "/analyze" && "~/debug-ai $ analyze --log"}
            {location.pathname === "/sessions" && "~/debug-ai $ history --all"}
            {location.pathname.startsWith("/sessions/") && "~/debug-ai $ session --view"}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <Zap size={12} className="text-terminal-amber" />
            <span className="text-xs font-mono text-terminal-amber">AI Ready</span>
          </div>
        </div>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
