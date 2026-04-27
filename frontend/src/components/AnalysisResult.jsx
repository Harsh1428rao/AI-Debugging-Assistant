import { useState } from "react";
import { AlertTriangle, Bug, Code2, Lightbulb, ChevronDown, ChevronRight, Layers, Copy, Check } from "lucide-react";

const severityConfig = {
  critical: { label: "CRITICAL", cls: "severity-critical", icon: "🔴" },
  high: { label: "HIGH", cls: "severity-high", icon: "🟠" },
  medium: { label: "MEDIUM", cls: "severity-medium", icon: "🟡" },
  low: { label: "LOW", cls: "severity-low", icon: "🟢" },
};

function CodeBlock({ code, language }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded border border-terminal-border bg-black/40 overflow-hidden">
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/30 border-b border-terminal-border">
        <span className="text-xs font-mono text-terminal-muted">{language || "code"}</span>
        <button onClick={copy} className="text-terminal-muted hover:text-terminal-green transition-colors">
          {copied ? <Check size={12} /> : <Copy size={12} />}
        </button>
      </div>
      <pre className="p-3 text-xs font-mono text-terminal-text overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
        {code}
      </pre>
    </div>
  );
}

function Section({ title, icon: Icon, color, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-terminal-border rounded-lg overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-4 py-3 bg-terminal-surface hover:bg-white/5 transition-colors"
      >
        <Icon size={14} className={color} />
        <span className="text-xs font-mono font-bold text-terminal-text flex-1 text-left">{title}</span>
        {open ? <ChevronDown size={12} className="text-terminal-muted" /> : <ChevronRight size={12} className="text-terminal-muted" />}
      </button>
      {open && <div className="px-4 py-3 border-t border-terminal-border bg-black/20">{children}</div>}
    </div>
  );
}

export default function AnalysisResult({ analysis }) {
  const sev = severityConfig[analysis.severity] || severityConfig.medium;

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="rounded-lg border border-terminal-border bg-terminal-surface p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="text-sm font-mono font-bold text-terminal-text">{analysis.summary}</div>
          <span className={`text-xs font-mono px-2 py-0.5 rounded border flex-shrink-0 ${sev.cls}`}>
            {sev.icon} {sev.label}
          </span>
        </div>
        {analysis.affectedComponents?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {analysis.affectedComponents.map((c) => (
              <span key={c} className="text-xs font-mono px-2 py-0.5 rounded bg-terminal-border/50 text-terminal-muted">
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Root Cause */}
      <Section title="Root Cause" icon={Bug} color="text-terminal-red" defaultOpen>
        <div className="text-xs font-mono font-bold text-terminal-text mb-1">{analysis.rootCause?.title}</div>
        <div className="text-xs text-terminal-muted leading-relaxed">{analysis.rootCause?.description}</div>
      </Section>

      {/* Error Patterns */}
      {analysis.errorPatterns?.length > 0 && (
        <Section title={`Error Patterns (${analysis.errorPatterns.length})`} icon={Layers} color="text-terminal-amber" defaultOpen>
          <div className="space-y-3">
            {analysis.errorPatterns.map((p, i) => (
              <div key={i} className="border-l-2 border-terminal-amber/40 pl-3">
                <div className="text-xs font-mono font-bold text-terminal-text">{p.pattern}</div>
                <div className="text-xs text-terminal-muted mt-0.5">{p.description}</div>
                {p.occurrences > 0 && (
                  <div className="text-xs font-mono text-terminal-amber mt-0.5">×{p.occurrences} occurrences</div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Fixes */}
      {analysis.fixes?.length > 0 && (
        <Section title={`Suggested Fixes (${analysis.fixes.length})`} icon={Code2} color="text-terminal-green" defaultOpen>
          <div className="space-y-4">
            {analysis.fixes.map((fix, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className={`text-xs font-mono mt-0.5 priority-${fix.priority} flex-shrink-0`}>
                    [{fix.priority?.toUpperCase()}]
                  </span>
                  <div>
                    <div className="text-xs font-mono font-bold text-terminal-text">{fix.title}</div>
                    <div className="text-xs text-terminal-muted mt-0.5 leading-relaxed">{fix.description}</div>
                  </div>
                </div>
                {fix.codeSnippet?.after && (
                  <div>
                    {fix.codeSnippet.before && (
                      <div className="mb-1">
                        <div className="text-xs font-mono text-terminal-red/70 mb-1">— Before</div>
                        <CodeBlock code={fix.codeSnippet.before} language={fix.codeSnippet.language} />
                      </div>
                    )}
                    <div className="text-xs font-mono text-terminal-green/70 mb-1">+ After</div>
                    <CodeBlock code={fix.codeSnippet.after} language={fix.codeSnippet.language} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Recommendations */}
      {analysis.additionalRecommendations?.length > 0 && (
        <Section title="Additional Recommendations" icon={Lightbulb} color="text-terminal-cyan">
          <ul className="space-y-1.5">
            {analysis.additionalRecommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-terminal-muted">
                <span className="text-terminal-cyan flex-shrink-0 mt-0.5">›</span>
                {rec}
              </li>
            ))}
          </ul>
        </Section>
      )}
    </div>
  );
}
