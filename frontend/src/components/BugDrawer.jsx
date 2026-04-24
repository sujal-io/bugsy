import ActivityTimeline from "./ActivityTimeline.jsx";
import CommentSection from "./CommentSection.jsx";

function BugDrawer({ bug, onClose }) {
  if (!bug) return null;

  return (
    <div className="fixed inset-0 z-50 flex">

      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="ml-auto w-[400px] h-full bg-[#1e293b] p-5 overflow-y-auto shadow-xl relative">

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold mb-2">{bug.title}</h2>
        <p className="text-gray-300 mb-4">{bug.description}</p>

        {/* Status */}
        <div className="mb-4">
          <p className="text-sm text-gray-400">Status</p>
          <p>{bug.status}</p>
        </div>

        {/* Assigned */}
        <div className="mb-4">
          <p className="text-sm text-gray-400">Assigned To</p>
          <p>{bug.assignedTo?.username || "Unassigned"}</p>
        </div>

        {/* Solution */}
        {bug.solution && (
          <div className="mb-4">
            <p className="text-green-300 text-sm">Solution</p>
            <p>{bug.solution}</p>
          </div>
        )}

        {/* Comments */}
        <CommentSection bugId={bug._id} />

        {/* Timeline */}
        <div className="mt-4">
          <ActivityTimeline bugId={bug._id} />
        </div>
      </div>
    </div>
  );
}

export default BugDrawer;

