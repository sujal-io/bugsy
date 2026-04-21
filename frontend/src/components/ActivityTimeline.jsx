import { useState, useEffect } from "react";
import { apiRequest } from "../lib/apiClient";

/**
 * Formats a date to a relative time string (e.g., "2 mins ago")
 */
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

/**
 * Get icon color based on action type
 */
function getActionColor(action) {
  switch (action) {
    case "created bug":
      return "bg-blue-100 text-blue-600";
    case "assigned bug":
      return "bg-purple-100 text-purple-600";
    case "changed status":
      return "bg-yellow-100 text-yellow-600";
    case "added solution":
      return "bg-green-100 text-green-600";
    case "commented on bug":
      return "bg-orange-100 text-orange-600";
    case "edited bug":
      return "bg-indigo-100 text-indigo-600";
    default:
      return "bg-gray-100 text-gray-600";
  }
}

/**
 * Get icon symbol based on action type
 */
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
        <div className="text-sm text-gray-500">Loading timeline...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-red-500 py-4 text-center">
        {error}
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-sm text-gray-400 py-4 text-center">
        No activity yet
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">Activity Timeline</h3>
      
      <div className="max-h-64 overflow-y-auto space-y-3">
        {activities.map((activity) => (
          <div key={activity._id} className="flex gap-3">
            {/* Icon */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${getActionColor(activity.action)}`}>
              {getActionIcon(activity.action)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm">
                  <span className="font-semibold text-gray-900">
                    {activity.user?.username || "Unknown User"}
                  </span>
                  <span className="text-gray-600 ml-2">
                    {activity.action}
                  </span>
                </p>
                <span className="text-xs text-gray-400 whitespace-nowrap">
                  {formatRelativeTime(activity.createdAt)}
                </span>
              </div>

              {/* Details (if any) */}
              {activity.details && (
                <p className="text-xs text-gray-500 mt-1">
                  {activity.details}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
