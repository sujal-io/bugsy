const STATUS_STYLES = {
  "Open":        "bg-blue-400/15 text-blue-300 border border-blue-400/25",
  "In Progress": "bg-violet-400/15 text-violet-300 border border-violet-400/25",
  "Fixed":       "bg-emerald-400/15 text-emerald-300 border border-emerald-400/25",
};

const STATUS_DOT = {
  "Open":        "bg-blue-400",
  "In Progress": "bg-violet-400",
  "Fixed":       "bg-emerald-400",
};

export function BugStatusBadge({ status, size = "sm" }) {
  const style = STATUS_STYLES[status] ?? "bg-border/40 text-content-muted border border-border";
  const dot   = STATUS_DOT[status]   ?? "bg-content-muted";
  const text  = size === "md" ? "text-xs font-semibold px-3 py-1.5" : "text-[11px] font-medium px-2.5 py-1";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full ${text} ${style}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}
