import { useState, useEffect, useRef } from "react";
import { useToast } from "../common/ToastProvider.jsx";
import { apiRequest } from "../../lib/apiClient";
import { socket } from "../../lib/socket";
import { BugStatusBadge } from "./BugStatusBadge";
import { BugPriorityBadge } from "./BugPriorityBadge";
import { BugMeta } from "./BugMeta";
import { BugDetailPanel } from "./BugDetailPanel";
import { ChevronRight } from "lucide-react";

function BugCard({
  bug,
  deleteBug,
  updateBug,
  teamMembers = [],
  currentUserId,
  isTeamAdmin,
}) {
  const toast = useToast();
  const commentRef = useRef(null);

  // ── State ────────────────────────────────────────────────────────────
  const [solution, setSolution]       = useState("");
  const [status, setStatus]           = useState(bug.status);
  const [assignedUser, setAssignedUser] = useState(bug.assignedTo?._id || "");
  const [showComments, setShowComments] = useState(false);
  const [showDetails, setShowDetails]   = useState(false);
  const [showTimeline, setShowTimeline] = useState(false);
  const [isPanelOpen, setIsPanelOpen]   = useState(false);
  const [aiResult, setAiResult]         = useState("");
  const [showAI, setShowAI]             = useState(false);
  const [loadingAI, setLoadingAI]       = useState(false);

  // ── Permissions ──────────────────────────────────────────────────────
  const isBugCreator   = String(bug.user?._id) === String(currentUserId);
  const isAssignedUser = bug.assignedTo && String(bug.assignedTo._id) === String(currentUserId);
  const canChangeAssignment = isBugCreator || isTeamAdmin;
  const canChangeStatus     = isAssignedUser || isBugCreator;
  const canFixBug           = isAssignedUser;

  // ── Effects ──────────────────────────────────────────────────────────
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
      commentRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showComments]);

  useEffect(() => {
    socket.on("commentAdded", (newComment) => {
      if (newComment.bug === bug._id) {
        window.dispatchEvent(new CustomEvent("new-comment", { detail: newComment }));
      }
    });
    return () => socket.off("commentAdded");
  }, [bug._id]);

  // ── Handlers ─────────────────────────────────────────────────────────
  const handleToggleComments = () => setShowComments((prev) => !prev);

  const handleUpdateAssignment = () =>
    updateBug(bug._id, undefined, undefined, assignedUser || undefined);

  const handleUpdateStatus = () =>
    updateBug(bug._id, status, undefined, undefined);

  const handleSubmitSolution = () => {
    if (!solution || solution.trim() === "") {
      toast.error("Please enter a solution");
      return;
    }
    updateBug(bug._id, "Fixed", solution, undefined);
    setSolution("");
  };

  const getAISolution = async () => {
    if (aiResult) { setShowAI(true); return; }
    setLoadingAI(true);
    try {
      const data = await apiRequest("/api/ai/explain", {
        method: "POST",
        body: { title: bug.title, description: bug.description },
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
      fixes: fixPart.split("-").map((f) => f.trim()).filter(Boolean),
    };
  };

  const formatted = aiResult ? formatAI(aiResult) : null;

  // ── Card ─────────────────────────────────────────────────────────────
  return (
    <>
      <div
        onClick={() => setIsPanelOpen(true)}
        className="group relative flex flex-col bg-surface/80 backdrop-blur-xl
          border border-border rounded-2xl p-4 sm:p-5 cursor-pointer
          shadow-sm hover:shadow-lg hover:border-border-strong hover:-translate-y-0.5
          transition-all duration-200"
      >
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <h2 className="text-sm font-semibold text-content-primary leading-snug
            group-hover:text-primary transition-colors line-clamp-2">
            {bug.title}
          </h2>
          <ChevronRight className="w-4 h-4 text-content-muted group-hover:text-primary
            transition-colors shrink-0 mt-0.5" />
        </div>

        {/* Description */}
        <p className="text-xs text-content-secondary leading-relaxed line-clamp-2 mb-4 flex-1">
          {bug.description}
        </p>

        {/* Assigned-to-me pill */}
        {isAssignedUser && (
          <span className="inline-flex items-center self-start gap-1 bg-primary/10
            border border-primary/20 text-primary text-[11px] font-medium
            px-2.5 py-0.5 rounded-full mb-3">
            Assigned to you
          </span>
        )}

        {/* Badges row */}
        <div className="flex items-center gap-2 mb-3">
          <BugStatusBadge status={bug.status} />
          <BugPriorityBadge priority={bug.priority} />
        </div>

        {/* Divider */}
        <div className="border-t border-border/60 mb-3" />

        {/* Meta: reporter ↔ assignee */}
        <BugMeta
          reporterName={bug.user?.username}
          assigneeName={bug.assignedTo?.username}
        />
      </div>

      {/* Detail panel */}
      <BugDetailPanel
        bug={bug}
        isOpen={isPanelOpen}
        onClose={() => setIsPanelOpen(false)}
        // state
        status={status}
        setStatus={setStatus}
        assignedUser={assignedUser}
        setAssignedUser={setAssignedUser}
        solution={solution}
        setSolution={setSolution}
        showAI={showAI}
        loadingAI={loadingAI}
        formatted={formatted}
        showComments={showComments}
        showTimeline={showTimeline}
        // handlers
        handleUpdateAssignment={handleUpdateAssignment}
        handleUpdateStatus={handleUpdateStatus}
        handleSubmitSolution={handleSubmitSolution}
        getAISolution={getAISolution}
        handleToggleComments={handleToggleComments}
        setShowTimeline={setShowTimeline}
        deleteBug={deleteBug}
        setIsPanelOpen={setIsPanelOpen}
        // permissions
        canChangeAssignment={canChangeAssignment}
        canChangeStatus={canChangeStatus}
        canFixBug={canFixBug}
        isBugCreator={isBugCreator}
        // data
        teamMembers={teamMembers}
        commentRef={commentRef}
      />
    </>
  );
}

export default BugCard;
