import { useEffect, useState } from "react";
import { apiRequest } from "../lib/apiClient";
import { useToast } from "./ToastProvider.jsx";
import { Send, MessageSquare } from "lucide-react";

function CommentSection({ bugId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const toast = useToast();

  const fetchComments = async () => {
    try {
      const data = await apiRequest(`/api/comments/${bugId}`);
      setComments(data);
    } catch {
      toast.error("Failed to load comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, [bugId]);

  useEffect(() => {
    const handleRealtimeComment = (event) => {
      const newComment = event.detail;
  
      if (newComment.bug === bugId) {
        setComments((prev) => [...prev, newComment]);
      }
    };
  
    window.addEventListener("new-comment", handleRealtimeComment);
  
    return () => {
      window.removeEventListener(
        "new-comment",
        handleRealtimeComment
      );
    };
  }, [bugId]);

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

  return (
    <div className="mt-4">
      <h3 className="text-sm font-semibold text-content-primary mb-3 flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Comments
      </h3>

      {/* Input */}
      <div className="flex gap-2 mb-4">
        <input
          className="flex-1 p-3 rounded-xl bg-background-secondary border border-border text-content-primary placeholder:text-content-muted focus:outline-none focus:border-primary text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAdd} className="px-4 py-3rounded-xl bg-primary hover:bg-primary-hover text-white rounded-xl transition-colors flex items-center gap-2">
          <Send className="w-4 h-4" />
          Add
        </button>
      </div>

      {/* List */}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {comments.map((c) => (
          <div key={c._id} className="bg-background-secondary/50 border border-border p-3 rounded-xl">
            <p className="text-xs text-content-muted mb-1">{c.user.username}</p>
            <p className="text-sm text-content-secondary">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;