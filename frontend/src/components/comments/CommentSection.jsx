import { useEffect, useState } from "react";
import { apiRequest } from "../../lib/apiClient.js";
import { useToast } from "../common/ToastProvider.jsx";
import { MessageSquare } from "lucide-react";
import { CommentCard } from "./CommentCard";
import { CommentInput } from "./CommentInput";

// Loading skeleton.
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

// Empty state.
function CommentsEmpty() {
  return (
    <div className="flex flex-col items-center gap-2 py-6 text-center">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-border/40">
        <MessageSquare className="h-4 w-4 text-content-muted" />
      </div>
      <p className="text-sm font-medium text-content-primary">No comments yet</p>
      <p className="text-xs text-content-muted">Be the first to leave a comment.</p>
    </div>
  );
}

// Main component.
function CommentSection({ bugId }) {
  const [comments, setComments] = useState([]);
  const [text, setText]         = useState("");
  const [loading, setLoading]   = useState(true);
  const toast = useToast();

  // ── Fetch ──────────────────────────────────────────────────────────────
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

  useEffect(() => { fetchComments(); }, [bugId]);

  // ── Realtime ───────────────────────────────────────────────────────────
  useEffect(() => {
    const handleRealtimeComment = (event) => {
      const newComment = event.detail;
      if (newComment.bug === bugId) {
        setComments((prev) => [...prev, newComment]);
      }
    };
    window.addEventListener("new-comment", handleRealtimeComment);
    return () => window.removeEventListener("new-comment", handleRealtimeComment);
  }, [bugId]);

  // ── Add comment ────────────────────────────────────────────────────────
  const handleAdd = async () => {
    if (!text.trim()) return;
    try {
      const newComment = await apiRequest("/api/comments", {
        method: "POST",
        body: { bugId, text },
      });
      setComments([newComment, ...comments]);
      setText("");
    } catch {
      toast.error("Failed to add comment");
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      {/* Input */}
      <CommentInput
        value={text}
        onChange={(e) => setText(e.target.value)}
        onSubmit={handleAdd}
      />

      {/* List */}
      {loading ? (
        <CommentSkeleton />
      ) : comments.length === 0 ? (
        <CommentsEmpty />
      ) : (
        <div className="space-y-3">
          {comments.map((c) => (
            <CommentCard key={c._id} comment={c} />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentSection;
