import { useState, useEffect } from "react";
import { apiRequest } from "../../lib/apiClient";
import { socket } from "../../lib/socket";
import { ActivityItem } from "./ActivityItem";
import { Clock } from "lucide-react";

/* ─── Loading skeleton ──────────────────────────────────────────────────── */
function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-7 w-7 rounded-full bg-background-secondary animate-pulse shrink-0" />
          <div className="flex-1 space-y-1.5 pt-1">
            <div className="h-3 w-2/3 rounded bg-background-secondary animate-pulse" />
            <div className="h-2.5 w-1/3 rounded bg-background-secondary animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Empty state ───────────────────────────────────────────────────────── */
function TimelineEmpty() {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-border/40">
        <Clock className="h-5 w-5 text-content-muted" />
      </div>
      <p className="text-sm font-medium text-content-primary">No activity yet</p>
      <p className="text-xs text-content-muted">Actions on this bug will appear here.</p>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────────────────────── */
export default function ActivityTimeline({ bugId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);

  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchActivities = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiRequest(`/api/activity/${bugId}`);
      setActivities(data);
    } catch (err) {
      console.error("Error fetching activities:", err);
      setError("Failed to load activity timeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivities(); }, [bugId]);

  // ── Realtime ───────────────────────────────────────────────────────────
  useEffect(() => {
    socket.on("activityAdded", (newActivity) => {
      if (newActivity.bug === bugId) {
        console.log("Realtime activity:", newActivity);
        setActivities((prev) => [newActivity, ...prev]);
      }
    });
    return () => socket.off("activityAdded");
  }, [bugId]);

  // ── Render ─────────────────────────────────────────────────────────────
  if (loading) return <TimelineSkeleton />;

  if (error) {
    return (
      <div className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400 text-center">
        {error}
      </div>
    );
  }

  if (activities.length === 0) return <TimelineEmpty />;

  return (
    <div>
      {activities.map((activity, idx) => (
        <ActivityItem
          key={activity._id}
          activity={activity}
          isLast={idx === activities.length - 1}
        />
      ))}
    </div>
  );
}
