import { useState } from "react";
import { FileText, Download, Trash2, Eye } from "lucide-react";
import ImagePreviewModal from "./ImagePreviewModal.jsx";

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

export function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Renders one uploaded attachment — image thumbnail or document icon,
// filename, size, uploader, download link, optional delete button.
// Used inside CommentCard for per-comment attachments.
function AttachmentCard({ attachment, canDelete, onDelete, deleting }) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const isImage = IMAGE_TYPES.includes(attachment.mimetype);

  return (
    <>
      <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl
        bg-background-secondary/60 border border-border
        hover:border-border-strong transition-colors"
      >
        {/* Thumbnail or file icon */}
        {isImage ? (
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="shrink-0 h-10 w-10 rounded-lg overflow-hidden border border-border
              hover:border-primary transition-colors"
            title="Preview"
          >
            <img
              src={attachment.url}
              alt={attachment.filename}
              className="h-full w-full object-cover"
            />
          </button>
        ) : (
          <div className="shrink-0 h-10 w-10 rounded-lg bg-primary/10 border border-primary/20
            flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
        )}

        {/* Name + meta */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-content-primary truncate">
            {attachment.filename}
          </p>
          <p className="text-[11px] text-content-muted">
            {formatBytes(attachment.size)}
            {attachment.uploadedBy?.username && (
              <span className="ml-1.5">· {attachment.uploadedBy.username}</span>
            )}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 shrink-0">
          {isImage && (
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="p-1.5 rounded-lg text-content-muted hover:text-content-primary
                hover:bg-white/[0.06] transition-colors"
              title="Preview"
            >
              <Eye className="w-4 h-4" />
            </button>
          )}

          <a
            href={attachment.url}
            download={attachment.filename}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 rounded-lg text-content-muted hover:text-content-primary
              hover:bg-white/[0.06] transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </a>

          {canDelete && (
            <button
              type="button"
              onClick={() => onDelete(attachment._id)}
              disabled={deleting === attachment._id}
              className="p-1.5 rounded-lg text-content-muted hover:text-red-400
                hover:bg-red-500/10 transition-colors disabled:opacity-50"
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {previewOpen && (
        <ImagePreviewModal
          url={attachment.url}
          filename={attachment.filename}
          onClose={() => setPreviewOpen(false)}
        />
      )}
    </>
  );
}

export default AttachmentCard;
