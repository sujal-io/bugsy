import { useState, useEffect } from "react";
import { apiRequest } from "../../lib/apiClient";
import { socket } from "../../lib/socket";
import { Clock } from "lucide-react";

// Format relative time.

function formatRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const seconds = Math.floor((now - then) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;

  return then.toLocaleDateString();
}

// Get action colors.

function getActionColor(action) {
  switch (action) {
    case "created bug":
      return "bg-blue-500/20 text-blue-300";
    case "assigned bug":
      return "bg-purple-500/20 text-purple-300";
    case "changed status":
      return "bg-yellow-500/20 text-yellow-300";
    case "added solution":
      return "bg-green-500/20 text-green-300";
    case "commented on bug":
      return "bg-orange-500/20 text-orange-300";
    case "edited bug":
      return "bg-indigo-500/20 text-indigo-300";
    default:
      return "bg-gray-500/20 text-gray-300";
  }
}

// Get the icon for an action.
function getActionIcon(action) {
  switch (action) {
    case "created bug":
      return "📝";
    case "assigned bug":
      return "👤";
    case "changed status":
      return "🔄";
    case "added solution":
      return "✅";
    case "commented on bug":
      return "💬";
    case "edited bug":
      return "✏️";
    default:
      return "•";
  }
}

export default function ActivityTimeline({ bugId }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchActivities();
  }, [bugId]);

  useEffect(() => {
    socket.on("activityAdded", (newActivity) => {
      if (newActivity.bug === bugId) {
        console.log("Realtime activity:", newActivity);
  
        setActivities((prev) => [newActivity, ...prev]);
      }
    });
  
    return () => {
      socket.off("activityAdded");
    };
  }, [bugId]);

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

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <div className="text-sm text-content-muted">Loading timeline...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-400 py-4 text-center">
        {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-sm text-content-muted py-4 text-center">
        No activity yet
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {activities.map((activity) => (
        <div key={activity._id} className="flex gap-3 items-start">
          {/* Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${getActionColor(activity.action)}`}>
            {getActionIcon(activity.action)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline justify-between gap-2">
              <p className="text-sm">
                <span className="font-semibold text-content-primary">
                  {activity.user?.username || "Unknown User"}
                </span>
                <span className="text-content-secondary ml-2">
                  {activity.action}
                </span>
              </p>
              <span className="text-xs text-content-muted whitespace-nowrap flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {formatRelativeTime(activity.createdAt)}
              </span>
            </div>

            {/* Details (if any) */}
            {activity.details && (
              <p className="text-xs text-content-muted mt-1">
                {activity.details}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
