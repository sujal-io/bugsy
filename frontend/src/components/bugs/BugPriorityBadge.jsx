import { AlertTriangle, ArrowUp, Minus } from "lucide-react";

const PRIORITY_CONFIG = {
  "High":   { style: "bg-red-400/15 text-red-300 border border-red-400/25",      Icon: AlertTriangle },
  "Medium": { style: "bg-amber-400/15 text-amber-300 border border-amber-400/25", Icon: ArrowUp },
  "Low":    { style: "bg-slate-400/15 text-slate-400 border border-slate-400/25", Icon: Minus },
};

export function BugPriorityBadge({ priority, size = "sm" }) {
  const config = PRIORITY_CONFIG[priority] ?? PRIORITY_CONFIG["Low"];
  const { style, Icon } = config;
  const text = size === "md" ? "text-xs font-semibold px-3 py-1.5" : "text-[11px] font-medium px-2.5 py-1";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${text} ${style}`}>
      <Icon className="h-3 w-3" />
      {priority}
    </span>
  );
}
