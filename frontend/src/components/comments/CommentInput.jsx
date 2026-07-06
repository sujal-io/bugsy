import { useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import AttachmentFilePreview from "../attachments/AttachmentFilePreview.jsx";

const ACCEPTED = ".png,.jpg,.jpeg,.pdf,.txt,.log";
const MAX_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_FILES = 20;

// Comment input with optional file attachments.
//
// Props:
//   value        — controlled text value
//   onChange     — text onChange handler
//   onSubmit     — called when user sends (button click or Enter)
//   stagedFiles  — File[] controlled by parent (CommentSection)
//   onAddFiles   — (newFiles: File[]) => void
//   onRemoveFile — (index: number) => void
//   disabled     — disables all inputs
export function CommentInput({
  value,
  onChange,
  onSubmit,
  stagedFiles = [],
  onAddFiles,
  onRemoveFile,
  disabled = false,
}) {
  const fileInputRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  const handleFileChange = (e) => {
    const picked = Array.from(e.target.files);
    if (!picked.length) return;

    const slotsLeft = MAX_FILES - stagedFiles.length;
    const toAdd = picked.slice(0, slotsLeft).filter(
      (f) => f.size <= MAX_SIZE_BYTES
    );

    if (toAdd.length) onAddFiles(toAdd);
    // Reset input so the same file can be re-picked if removed
    e.target.value = "";
  };

  const slotsLeft = MAX_FILES - stagedFiles.length;
  const canSend = !disabled && (value.trim().length > 0 || stagedFiles.length > 0);

  return (
    <div className="space-y-2">
      {/* Staged file chips */}
      <AttachmentFilePreview files={stagedFiles} onRemove={onRemoveFile} />

      {/* Input row */}
      <div className="flex gap-2 items-end">
        {/* File picker button */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED}
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={disabled || slotsLeft === 0}
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || slotsLeft === 0}
          title={slotsLeft === 0 ? "Max 20 files per comment" : "Attach files"}
          className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl
            bg-background-secondary border border-border
            text-content-muted hover:text-content-primary hover:border-border-strong
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        {/* Textarea */}
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

        {/* Send button */}
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSend}
          aria-label="Send comment"
          className="shrink-0 flex items-center justify-center h-10 w-10 rounded-xl
            bg-primary hover:bg-primary-hover text-white
            disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Hint */}
      {stagedFiles.length > 0 && (
        <p className="text-[11px] text-content-muted pl-12">
          {stagedFiles.length} file{stagedFiles.length > 1 ? "s" : ""} attached
          {slotsLeft > 0 && ` · ${slotsLeft} slot${slotsLeft > 1 ? "s" : ""} left`}
        </p>
      )}
    </div>
  );
}
