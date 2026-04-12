import { useEffect, useState } from "react";
import { apiRequest } from "../lib/apiClient";
import { useToast } from "./ToastProvider.jsx";

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
      <h3 className="text-sm font-semibold mb-2">💬 Comments</h3>

      {/* Input */}
      <div className="flex gap-2 mb-3">
        <input
          className="flex-1 p-2 rounded bg-white/5"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
        />
        <button onClick={handleAdd} className="btn btn-sm btn-primary">
          Add
        </button>
      </div>

      {/* List */}
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {comments.map((c) => (
          <div key={c._id} className="bg-white/5 p-2 rounded">
            <p className="text-xs text-gray-400">{c.user.username}</p>
            <p className="text-sm">{c.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;