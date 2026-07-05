/**
 * BugMeta — pure presentation component.
 * Renders reporter + assignee avatars with initials and labels.
 * No business logic.
 */

function Avatar({ name, muted = false }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <span
      className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-semibold shrink-0
        ${muted
          ? "bg-border/60 text-content-muted"
          : "bg-primary/20 text-primary"
        }`}
    >
      {initial}
    </span>
  );
}

export function BugMeta({ reporterName, assigneeName }) {
  return (
    <div className="flex items-center justify-between text-[11px] text-content-muted">
      {/* Reporter */}
      <span className="flex items-center gap-1.5 min-w-0">
        <Avatar name={reporterName} />
        <span className="truncate max-w-[80px]">{reporterName ?? "Unknown"}</span>
      </span>

      {/* Assignee */}
      <span className="flex items-center gap-1.5 min-w-0">
        <Avatar name={assigneeName} muted={!assigneeName} />
        <span className="truncate max-w-[80px]">
          {assigneeName ?? "Unassigned"}
        </span>
      </span>
    </div>
  );
}
