// Render the comment input form.

import { Send } from "lucide-react";

export function CommentInput({ value, onChange, onSubmit, disabled = false }) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex gap-2 items-end">
      <textarea
        rows={2}
        className="flex-1 px-3.5 py-2.5 rounded-xl bg-background-secondary border border-border
          text-content-primary placeholder:text-content-muted text-sm
          focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30
          resize-none transition-colors leading-relaxed"
        placeholder="Write a comment… (Enter to send)"
        value={value}
        onChange={onChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        aria-label="Send comment"
        className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl
          bg-primary hover:bg-primary-hover text-white
          disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <Send className="w-4 h-4" />
      </button>
    </div>
  );
}
