// Render a single comment card.

function formatRelativeTime(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60)    return "just now";
  if (seconds < 3600)  return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800)return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function UserAvatar({ name }) {
  return (
    <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
      {name ? name.charAt(0).toUpperCase() : "?"}
    </span>
  );
}

export function CommentCard({ comment }) {
  const username = comment.user?.username || "Unknown";

  return (
    <div className="flex gap-3">
      <UserAvatar name={username} />
      <div className="flex-1 min-w-0 bg-background-secondary/60 border border-border rounded-xl px-3.5 py-3">
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className="text-xs font-semibold text-content-primary">{username}</span>
          {comment.createdAt && (
            <span className="text-[11px] text-content-muted shrink-0">
              {formatRelativeTime(comment.createdAt)}
            </span>
          )}
        </div>
        <p className="text-sm text-content-secondary leading-relaxed">{comment.text}</p>
      </div>
    </div>
  );
}
