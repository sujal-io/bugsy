import { X, Download } from "lucide-react";

// Full-screen lightbox for image attachments.
// Clicking the backdrop or the X button closes it.
function ImagePreviewModal({ url, filename, onClose }) {
  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full flex flex-col gap-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar */}
        <div className="flex items-center justify-between px-1">
          <span className="text-sm text-white/70 truncate max-w-[80%]">{filename}</span>
          <div className="flex items-center gap-2">
            <a
              href={url}
              download={filename}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              aria-label="Close preview"
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image */}
        <img
          src={url}
          alt={filename}
          className="rounded-xl object-contain max-h-[80vh] w-full"
        />
      </div>
    </div>
  );
}

export default ImagePreviewModal;
