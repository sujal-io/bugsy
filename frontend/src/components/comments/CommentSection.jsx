import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiClient.js";
import { useToast } from "../common/ToastProvider.jsx";
import { MessageSquare } from "lucide-react";
import { CommentCard } from "./CommentCard";
import { CommentInput } from "./CommentInput";

// ── Loading skeleton ───────────────────────────────────────────────────────
function CommentSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="h-7 w-7 rounded-full bg-background-secondary animate-pulse shrink-0" />
          <div className="flex-1 rounded-xl bg-background-secondary/60 border border-border px-3.5 py-3 space-y-2">
            <div className="h-2.5 w-1/4 rounded bg-background-secondary animate-pulse" />
            <div className="h-3 w-3/4 rounded bg-background-secondary animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────
function CommentsEmpty() {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-border/40">
        <MessageSquare className="h-4 w-4 text-content-muted" />
      </div>
      <p className="text-sm font-medium text-content-primary">
        No comments yet
      </p>
      <p className="text-xs text-content-muted">
        Be the first to leave a comment.
      </p>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
// bugId      — MongoDB _id of the bug
// canUpload  — whether the current user is a team member (may attach files)
function CommentSection({ bugId, canUpload = true }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [stagedFiles, setStagedFiles] = useState([]); // File[] not yet uploaded
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const toast = useToast();

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchComments = async () => {
    try {
      setLoading(true);
      const data = await apiRequest(`/api/comments/${bugId}`);
      setComments(data);
    } catch {
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [bugId]);

  // ── Realtime ─────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleRealtimeComment = (event) => {
      const newComment = event.detail;
      if (newComment.bug === bugId) {
        setComments((prev) => [...prev, newComment]);
      }
    };
    window.addEventListener("new-comment", handleRealtimeComment);
    return () =>
      window.removeEventListener("new-comment", handleRealtimeComment);
  }, [bugId]);

  // ── Staged file helpers ───────────────────────────────────────────────────
  const handleAddFiles = (newFiles) => {
    setStagedFiles((prev) => {
      const combined = [...prev, ...newFiles];
      return combined.slice(0, 20); // never exceed 20
    });
  };

  const handleRemoveFile = (index) => {
    setStagedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // ── Send comment (+ optional attachments) ────────────────────────────────
  const handleSend = async () => {
    const hasText = text.trim().length > 0;
    const hasFiles = stagedFiles.length > 0;
    if (!hasText && !hasFiles) return;

    setSending(true);
    try {
      
      // Send comment + attachments in ONE request
      const formData = new FormData();

      formData.append("bugId", bugId);
      formData.append("text", text.trim());

      for (const file of stagedFiles) {
        formData.append("attachments", file);
      }

      const newComment = await apiRequest("/api/comments", {
        method: "POST",
        body: formData,
      });

      setComments((prev) => {
        const index = prev.findIndex((c) => c._id === newComment._id);

        if (index !== -1) {
          const updated = [...prev];
          updated[index] = newComment;
          return updated;
        }

        return [...prev, newComment];
      });
      // 4. Clear inputs
      setText("");
      setStagedFiles([]);
    } catch (err) {
      toast.error(err?.message || "Failed to send");
    } finally {
      setSending(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Input — only shown when user is a team member */}
      {canUpload && (
        <CommentInput
          value={text}
          onChange={(e) => setText(e.target.value)}
          onSubmit={handleSend}
          stagedFiles={stagedFiles}
          onAddFiles={handleAddFiles}
          onRemoveFile={handleRemoveFile}
          disabled={sending}
        />
      )}

      {/* Comment list */}
      {loading ? (
        <CommentSkeleton />
      ) : comments.length === 0 ? (
        <CommentsEmpty />
      ) : (
        <div className="space-y-3">
          {comments.map((c) => {
            return <CommentCard key={c._id} comment={c} />;
          })}
        </div>
      )}
    </div>
  );
}

export default CommentSection;
