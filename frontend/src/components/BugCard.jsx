import { useState, useEffect, useRef } from "react";
import { useToast } from "./ToastProvider.jsx";
import { apiRequest } from "../lib/apiClient";
import CommentSection from "./CommentSection.jsx";

function BugCard({ 
  bug, 
  deleteBug, 
  updateBug, 
  teamMembers = [],
  currentUserId,
  isTeamAdmin 
}) {
  const toast = useToast();
  const commentRef = useRef(null);

  const [solution, setSolution] = useState("");
  const [status, setStatus] = useState(bug.status);
  const [assignedUser, setAssignedUser] = useState(
    bug.assignedTo?._id || ""
  );

  const [showComments, setShowComments] = useState(false);
  const [aiResult, setAiResult] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

  const isCommentsOpen = showComments;

  // Permissions
  const isBugCreator = String(bug.user?._id) === String(currentUserId);
  const isAssignedUser =
    bug.assignedTo && String(bug.assignedTo._id) === String(currentUserId);

  const canChangeAssignment = isBugCreator || isTeamAdmin;
  const canChangeStatus = isAssignedUser || isBugCreator;
  const canFixBug = isAssignedUser;

  useEffect(() => {
    setSolution("");
    setStatus(bug.status);
    setAssignedUser(bug.assignedTo?._id || "");
    setAiResult("");
    setShowAI(false);
  }, [bug._id]);

  useEffect(() => {
    if (isCommentsOpen && commentRef.current) {
      commentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isCommentsOpen]);

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleUpdateAssignment = () => {
    updateBug(bug._id, undefined, undefined, assignedUser || undefined);
  };

  const handleUpdateStatus = () => {
    updateBug(bug._id, status, undefined, undefined);
  };

  const handleSubmitSolution = () => {
    if (!solution || solution.trim() === "") {
      toast.error("Please enter a solution");
      return;
    }

    updateBug(bug._id, "Fixed", solution, undefined);
    setSolution("");
  };

  const getAISolution = async () => {
    if (aiResult) {
      setShowAI(true);
      return;
    }

    setLoadingAI(true);

    try {
      const data = await apiRequest("/api/ai/explain", {
        method: "POST",
        body: {
          title: bug.title,
          description: bug.description,
        },
      });

      if (!data || !data.result) throw new Error("Invalid AI response");

      setAiResult(data.result);
      setShowAI(true);
    } catch {
      toast.error("AI failed");
    } finally {
      setLoadingAI(false);
    }
  };

  const formatAI = (text = "") => {
    const [causePart = "", fixPart = ""] = text.split("Fix:");

    return {
      cause: causePart.replace("Cause:", "").trim(),
      fixes: fixPart
        .split("-")
        .map((f) => f.trim())
        .filter(Boolean),
    };
  };

  const formatted = aiResult ? formatAI(aiResult) : null;

  const getPriorityColor = (priority) => {
    if (priority === "High") return "bg-orange-400/20 text-orange-300";
    if (priority === "Medium") return "bg-yellow-400/20 text-yellow-300";
    return "bg-green-400/20 text-green-300";
  };

  const getStatusColor = (status) => {
    if (status === "Open") return "bg-blue-400/20 text-blue-300";
    if (status === "In Progress") return "bg-purple-400/20 text-purple-300";
    return "bg-green-400/20 text-green-300";
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all">

      {/* Title */}
      <h2 className="text-lg font-semibold mb-1">{bug.title}</h2>
      <p className="text-gray-300 text-sm mb-4">{bug.description}</p>

      {/* Assigned to you badge */}
      {isAssignedUser && (
        <div className="mb-3">
          <span className="inline-block bg-purple-500/30 border border-purple-400/50 text-purple-200 text-xs px-2 py-1 rounded">
            ✓ Assigned to you
          </span>
        </div>
      )}

      {/* Creator + Assigned */}
      <div className="flex justify-between text-xs text-gray-400 mb-3">
        <span>👤 {bug.user?.username}</span>
        <span>🎯 {bug.assignedTo?.username || "Unassigned"}</span>
      </div>

      {/* Status + Priority */}
      <div className="flex justify-between items-center mb-4">
        <span className={`${getStatusColor(bug.status)} px-3 py-1 rounded-full text-xs`}>
          {bug.status}
        </span>

        <span className={`${getPriorityColor(bug.priority)} px-3 py-1 rounded-full text-xs`}>
          {bug.priority}
        </span>
      </div>

      {/* Solution */}
      {bug.solution && (
        <div className="bg-green-400/10 border border-green-400/20 p-3 rounded-lg mb-4">
          <p className="text-green-300 text-xs font-semibold mb-1">Solution</p>
          <p className="text-sm">{bug.solution}</p>
        </div>
      )}

      {/* Assignment */}
      {canChangeAssignment && (
        <div className="border-t border-white/10 pt-3 pb-3 mb-3">
          <label className="text-xs text-gray-400 block mb-1">Assign to:</label>
          <select
            className="w-full p-2 rounded bg-white/5 border border-white/20 text-white mb-2"
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
          >
            <option className="text-black" value="">
              Unassigned
            </option>
            {teamMembers?.map((m) => (
              <option key={m._id} value={m._id} className="text-black">
                {m.username}
              </option>
            ))}
          </select>

          <button 
            onClick={handleUpdateAssignment} 
            className="w-full bg-blue-500/90 hover:bg-blue-600 p-2 rounded-lg text-sm font-medium transition"
          >
            Update Assignment
          </button>
        </div>
      )}

      {/* Status */}
      {canChangeStatus && (
        <div className="border-t border-white/10 pt-3 pb-3 mb-3">
          <label className="text-xs text-gray-400 block mb-1">Status:</label>
          <select
            className="w-full p-2 rounded bg-white/5 border border-white/20 text-white mb-2"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            {isBugCreator && <option className="text-black">Open</option>}
            {(isAssignedUser || isBugCreator) && (
              <option className="text-black">In Progress</option>
            )}
            {isAssignedUser && <option className="text-black">Fixed</option>}
          </select>

          <button 
            onClick={handleUpdateStatus} 
            className="w-full bg-blue-500/90 hover:bg-blue-600 p-2 rounded-lg text-sm font-medium transition"
          >
            Update Status
          </button>
        </div>
      )}

      {/* Solution Input */}
      {canFixBug && (status === "Fixed" || bug.status === "Fixed") && (
        <div className="border-t border-white/10 pt-3 pb-3 mb-3">
          <label className="text-xs text-gray-400 block mb-2">
            {bug.status === "Fixed" ? "Edit Solution:" : "Submit Solution:"}
          </label>

          <textarea
            placeholder="Explain the fix..."
            rows="3"
            className="w-full p-2 rounded bg-white/5 border border-white/20 text-white resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
            value={solution}
            onChange={(e) => setSolution(e.target.value)}
          />

          <button
            onClick={handleSubmitSolution}
            className="w-full mt-2 bg-green-500/90 hover:bg-green-600 p-2 rounded-lg text-sm font-medium transition"
          >
            Submit Solution
          </button>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-3 mt-3">
        {isBugCreator && (
          <button
            onClick={() => deleteBug(bug._id)}
            className="flex-1 bg-red-500/90 hover:bg-red-600 p-2 rounded-lg text-sm font-medium transition"
          >
            Delete
          </button>
        )}

        <button
          disabled={loadingAI}
          onClick={getAISolution}
          className="flex-1 bg-purple-500/90 hover:bg-purple-600 p-2 rounded-lg text-sm font-medium transition disabled:opacity-50"
        >
          {loadingAI ? "Thinking..." : "✨ AI Help"}
        </button>
      </div>

      {/* Comments */}
      <button
        onClick={handleToggleComments}
        className="w-full mt-3 bg-white/5 hover:bg-white/10 p-2 rounded-lg text-sm transition"
      >
        💬 Comments {isCommentsOpen ? "▲" : "▼"}
      </button>

      {isCommentsOpen && (
        <div ref={commentRef} className="mt-2">
          <CommentSection bugId={bug._id} />
        </div>
      )}

      {/* AI Result */}
      {formatted && showAI && (
        <div className="mt-3 p-4 bg-white/10 rounded relative">
          <button
            onClick={() => setShowAI(false)}
            className="absolute right-2 top-2"
          >
            ✖
          </button>

          <p className="text-purple-300 font-semibold mb-2">
            🤖 AI Suggestion
          </p>

          <p className="text-blue-300">Cause</p>
          <p>{formatted.cause}</p>

          <p className="text-green-300 mt-2">Fix</p>
          <ul className="list-disc ml-5">
            {formatted.fixes.map((f, i) => (
              <li key={i}>{f}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default BugCard;