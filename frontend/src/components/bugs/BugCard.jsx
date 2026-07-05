
import { useState, useEffect, useRef } from "react";
import { useToast } from "../common/ToastProvider.jsx";
import { apiRequest } from "../../lib/apiClient";
import CommentSection from "../comments/CommentSection.jsx";
import ActivityTimeline from "../activity/ActivityTimeline.jsx";
import SlidePanel from "../common/SlidePanel.jsx";
import { socket } from "../../lib/socket";
import { ChevronRight, Bug, User, Clock } from "lucide-react";

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
  const [showDetails, setShowDetails] = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const [aiResult, setAiResult] = useState("");
  const [showAI, setShowAI] = useState(false);
  const [loadingAI, setLoadingAI] = useState(false);

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
    setShowDetails(false);
    setShowTimeline(false);
  }, [bug._id]);

  useEffect(() => {
    if (showComments && commentRef.current) {
      commentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [showComments]);

  useEffect(() => {
    socket.on("commentAdded", (newComment) => {
      if (newComment.bug === bug._id) {
        console.log("Realtime comment:", newComment);
  
        window.dispatchEvent(
          new CustomEvent("new-comment", {
            detail: newComment,
          })
        );
      }
    });
  
    return () => {
      socket.off("commentAdded");
    };
  }, [bug._id]);

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
    <>
      {/* Compact Card */}
      <div
        onClick={() => setIsPanelOpen(true)}
        className="bg-surface/80 backdrop-blur-xl border border-border
        rounded-2xl p-4 sm:p-5 shadow-lg hover:shadow-xl hover:border-border-strong
        transition-all cursor-pointer group"
      >
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-base sm:text-lg font-semibold text-content-primary group-hover:text-primary transition-colors">
            {bug.title}
          </h2>
          <ChevronRight className="w-5 h-5 text-content-muted group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
        </div>

        {/* Description (truncated) */}
        <p className="text-content-secondary text-sm mb-4 line-clamp-2">
          {bug.description}
        </p>

        {/* Assigned badge */}
        {isAssignedUser && (
          <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs px-2.5 py-1 rounded-full mb-3">
            <User className="w-3 h-3" />
            Assigned to you
          </span>
        )}

        {/* Users */}
        <div className="flex items-center justify-between text-xs text-content-muted mb-4">
          <span className="flex items-center gap-1.5">
            <Bug className="w-3.5 h-3.5" />
            {bug.user?.username}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            {bug.assignedTo?.username || "Unassigned"}
          </span>
        </div>

        {/* Status + Priority */}
        <div className="flex items-center justify-between">
          <span className={`${getStatusColor(bug.status)} px-3 py-1.5 rounded-full text-xs font-medium`}>
            {bug.status}
          </span>

          <span className={`${getPriorityColor(bug.priority)} px-3 py-1.5 rounded-full text-xs font-medium`}>
            {bug.priority}
          </span>
        </div>
      </div>

      {/* Slide-out Panel */}
      <SlidePanel 
        isOpen={isPanelOpen} 
        onClose={() => setIsPanelOpen(false)}
        title={bug.title}
      >
        <div className="space-y-6">
          {/* Description */}
          <div>
            <h3 className="text-sm font-medium text-content-primary mb-2">Description</h3>
            <p className="text-content-secondary text-sm">{bug.description}</p>
          </div>

          {/* Metadata */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-content-muted text-xs mb-1">
                <Bug className="w-4 h-4" />
                Created by
              </div>
              <p className="text-content-primary text-sm font-medium">{bug.user?.username}</p>
            </div>
            <div className="bg-background-secondary/50 rounded-xl p-4">
              <div className="flex items-center gap-2 text-content-muted text-xs mb-1">
                <User className="w-4 h-4" />
                Assigned to
              </div>
              <p className="text-content-primary text-sm font-medium">{bug.assignedTo?.username || "Unassigned"}</p>
            </div>
          </div>

          {/* Status & Priority */}
          <div className="flex items-center gap-3">
            <span className={`${getStatusColor(bug.status)} px-4 py-2 rounded-full text-sm font-medium`}>
              {bug.status}
            </span>
            <span className={`${getPriorityColor(bug.priority)} px-4 py-2 rounded-full text-sm font-medium`}>
              {bug.priority}
            </span>
          </div>

          {/* Solution */}
          {bug.solution && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
              <h3 className="text-sm font-medium text-green-400 mb-2">Solution</h3>
              <p className="text-content-secondary text-sm">{bug.solution}</p>
            </div>
          )}

          {/* Assignment */}
          {canChangeAssignment && (
            <div>
              <label className="text-sm font-medium text-content-primary mb-2 block">Assign to</label>
              <select
                className="w-full p-3 rounded-xl bg-background-secondary border border-border text-content-primary text-sm focus:outline-none focus:border-primary"
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
              >
                <option value="">Unassigned</option>
                {teamMembers?.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.username}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleUpdateAssignment} 
                className="mt-2 w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-colors"
              >
                Update Assignment
              </button>
            </div>
          )}

          {/* Status */}
          {canChangeStatus && (
            <div>
              <label className="text-sm font-medium text-content-primary mb-2 block">Status</label>
              <select
                className="w-full p-3 rounded-xl bg-background-secondary border border-border text-content-primary text-sm focus:outline-none focus:border-primary"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Fixed</option>
              </select>
              <button 
                onClick={handleUpdateStatus} 
                className="mt-2 w-full py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium transition-colors"
              >
                Update Status
              </button>
            </div>
          )}

          {/* Solution Input */}
          {canFixBug && (status === "Fixed" || bug.status === "Fixed") && (
            <div>
              <label className="text-sm font-medium text-content-primary mb-2 block">Solution</label>
              <textarea
                placeholder="Explain the fix..."
                rows="4"
                className="w-full p-3 rounded-xl bg-background-secondary border border-border text-content-primary text-sm focus:outline-none focus:border-primary resize-none"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />
              <button
                onClick={handleSubmitSolution}
                className="mt-2 w-full py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-medium transition-colors"
              >
                Submit Solution
              </button>
            </div>
          )}

          {/* AI Help */}
          <button
            disabled={loadingAI}
            onClick={getAISolution}
            className="w-full py-2.5 bg-purple-500/20 border border-purple-500/30 hover:bg-purple-500/30 text-purple-300 rounded-xl text-sm font-medium transition-colors"
          >
            {loadingAI ? "Thinking..." : "✨ Get AI Suggestions"}
          </button>

          {/* AI Result */}
          {formatted && showAI && (
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4">
              <h3 className="text-sm font-semibold text-purple-300 mb-3">🤖 AI Suggestion</h3>
              <div className="mb-3">
                <p className="text-blue-300 text-xs font-medium mb-1">Cause</p>
                <p className="text-content-secondary text-sm">{formatted.cause}</p>
              </div>
              <div>
                <p className="text-green-300 text-xs font-medium mb-1">Fix</p>
                <ul className="list-disc ml-5 text-content-secondary text-sm space-y-1">
                  {formatted.fixes.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Comments */}
          <div>
            <button
              onClick={handleToggleComments}
              className="w-full py-2.5 bg-background-secondary border border-border hover:border-border-strong text-content-primary rounded-xl text-sm font-medium transition-colors mb-4"
            >
              💬 Comments {showComments ? "▲" : "▼"}
            </button>
            {showComments && (
              <div ref={commentRef}>
                <CommentSection bugId={bug._id} />
              </div>
            )}
          </div>

          {/* Activity Timeline */}
          <div>
            <button
              onClick={() => setShowTimeline(prev => !prev)}
              className="w-full py-2.5 bg-background-secondary border border-border hover:border-border-strong text-content-primary rounded-xl text-sm font-medium transition-colors mb-4"
            >
              <Clock className="w-4 h-4 inline mr-2" />
              Activity {showTimeline ? "▲" : "▼"}
            </button>
            {showTimeline && (
              <div className="max-h-60 overflow-y-auto">
                <ActivityTimeline bugId={bug._id} />
              </div>
            )}
          </div>

          {/* Delete */}
          {isBugCreator && (
            <button
              onClick={() => {
                deleteBug(bug._id);
                setIsPanelOpen(false);
              }}
              className="w-full py-2.5 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 rounded-xl text-sm font-medium transition-colors"
            >
              Delete Bug
            </button>
          )}
        </div>
      </SlidePanel>
    </>
  );
}

export default BugCard;

