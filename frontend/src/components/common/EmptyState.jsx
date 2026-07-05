import { Plus, Bug, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EmptyState({ type = "no-bugs" }) {
  const navigate = useNavigate();

  const emptyStates = {
    "no-bugs": {
      icon: Bug,
      title: "No bugs reported yet",
      description: "Everything looks good! When you find an issue, you can report it here.",
      action: {
        label: "Create Your First Bug",
        onClick: () => navigate("/dashboard/create-bug"),
      },
    },
    "my-bugs": {
      icon: Bug,
      title: "You haven't reported any bugs",
      description: "Start by creating a bug report to help your team track issues.",
      action: {
        label: "Report a Bug",
        onClick: () => navigate("/dashboard/create-bug"),
      },
    },
    "team-bugs": {
      icon: AlertCircle,
      title: "No team bugs found",
      description: "No issues match your current filters. Try adjusting them.",
      action: null,
    },
    "assigned-bugs": {
      icon: AlertCircle,
      title: "Nothing assigned to you",
      description: "You're all caught up! Check back later for new assignments.",
      action: null,
    },
  };

  const state = emptyStates[type] || emptyStates["no-bugs"];
  const Icon = state.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 sm:py-24">
      <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
        <Icon className="h-8 w-8 text-primary" />
      </div>

      <h3 className="text-lg sm:text-xl font-semibold text-content-primary mb-2 text-center">
        {state.title}
      </h3>

      <p className="text-sm sm:text-base text-content-secondary text-center max-w-md mb-6">
        {state.description}
      </p>

      {state.action && (
        <button
          onClick={state.action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover text-white font-medium shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-primary/35"
        >
          <Plus className="h-4 w-4" />
          {state.action.label}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
