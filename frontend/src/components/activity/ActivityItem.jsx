/**
 * ActivityItem — pure presentation component for one timeline entry.
 * No business logic. Receives a single activity object as a prop.
 */

import {
  Bug,
  UserPlus,
  RefreshCw,
  CheckCircle2,
  MessageSquare,
  Pencil,
  Activity,
} from "lucide-react";

const ACTION_CONFIG = {
  "created bug":     { Icon: Bug,          color: "text-blue-400",    bg: "bg-blue-400/15 border-blue-400/25",    label: "created bug"     },
  "assigned bug":    { Icon: UserPlus,      color: "text-violet-400",  bg: "bg-violet-400/15 border-violet-400/25", label: "assigned bug"    },
  "changed status":  { Icon: RefreshCw,     color: "text-amber-400",   bg: "bg-amber-400/15 border-amber-400/25",  label: "changed status"  },
  "added solution":  { Icon: CheckCircle2,  color: "text-emerald-400", bg: "bg-emerald-400/15 border-emerald-400/25", label: "added solution" },
  "commented on bug":{ Icon: MessageSquare, color: "text-orange-400",  bg: "bg-orange-400/15 border-orange-400/25", label: "commented"      },
  "edited bug":      { Icon: Pencil,        color: "text-indigo-400",  bg: "bg-indigo-400/15 border-indigo-400/25", label: "edited bug"     },
};

const FALLBACK = { Icon: Activity, color: "text-content-muted", bg: "bg-border/40 border-border", label: "activity" };

function formatRelativeTime(date) {
  const seconds = Math.floor((Date.now() - new Date(date)) / 1000);
  if (seconds < 60)   return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400)return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return new Date(date).toLocaleDateString();
}

function UserInitial({ name }) {
  return (
    <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-primary text-[10px] font-bold shrink-0">
      {name ? name.charAt(0).toUpperCase() : "?"}
    </span>
  );
}

export function ActivityItem({ activity, isLast = false }) {
  const { Icon, color, bg, label } = ACTION_CONFIG[activity.action] ?? FALLBACK;
  const username = activity.user?.username || "Unknown";

  return (
    <div className="flex gap-3">
      {/* Left: icon + connector line */}
      <div className="flex flex-col items-center">
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${bg}`}>
          <Icon className={`h-3.5 w-3.5 ${color}`} />
        </div>
        {!isLast && <div className="w-px flex-1 bg-border/60 mt-1" />}
      </div>

      {/* Right: content */}
      <div className={`flex-1 min-w-0 ${isLast ? "pb-0" : "pb-4"}`}>
        <div className="flex items-start justify-between gap-2">
          {/* Actor + action */}
          <p className="text-sm leading-snug flex items-center gap-1.5 flex-wrap">
            <UserInitial name={username} />
            <span className="font-medium text-content-primary">{username}</span>
            <span className="text-content-secondary">{label}</span>
          </p>
          {/* Timestamp */}
          <span className="text-[11px] text-content-muted whitespace-nowrap shrink-0 mt-0.5">
            {formatRelativeTime(activity.createdAt)}
          </span>
        </div>

        {/* Optional details */}
        {activity.details && (
          <p className="mt-1 text-xs text-content-muted leading-relaxed bg-background-secondary/50 rounded-lg px-2.5 py-1.5 border border-border/60">
            {activity.details}
          </p>
        )}
      </div>
    </div>
  );
}
