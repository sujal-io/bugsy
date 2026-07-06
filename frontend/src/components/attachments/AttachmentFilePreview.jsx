import { useState } from "react";
import { FileText, X } from "lucide-react";
import { formatBytes } from "./AttachmentCard.jsx";
import ImagePreviewModal from "./ImagePreviewModal.jsx";

const IMAGE_TYPES = ["image/png", "image/jpeg", "image/jpg"];

// Shows a row of locally-staged File objects before they are uploaded.
// Used in CommentInput (files attached to a comment) and CreateBugPage
// (files to be uploaded after the bug is created).
//
// Props:
//   files    — array of browser File objects
//   onRemove — (index: number) => void   removes a file from the staged list
function AttachmentFilePreview({ files, onRemove }) {
  const [preview, setPreview] = useState(null); // { url, filename }

  if (!files || files.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-2 mt-2">
        {files.map((file, idx) => {
          const isImage = IMAGE_TYPES.includes(file.type);
          const objectUrl = isImage ? URL.createObjectURL(file) : null;

          return (
            <div
              key={idx}
              className="group relative flex items-center gap-2 pl-2 pr-7 py-1.5
                rounded-xl bg-background-secondary border border-border
                hover:border-border-strong transition-colors max-w-[200px]"
            >
              {/* Thumbnail or icon */}
              {isImage ? (
                <button
                  type="button"
                  onClick={() => setPreview({ url: objectUrl, filename: file.name })}
                  className="shrink-0 h-7 w-7 rounded-lg overflow-hidden border border-border
                    hover:border-primary transition-colors"
                  title="Preview"
                >
                  <img
                    src={objectUrl}
                    alt={file.name}
                    className="h-full w-full object-cover"
                  />
                </button>
              ) : (
                <div className="shrink-0 h-7 w-7 rounded-lg bg-primary/10 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5 text-primary" />
                </div>
              )}

              {/* Name + size */}
              <div className="min-w-0">
                <p className="text-xs font-medium text-content-primary truncate max-w-[100px]">
                  {file.name}
                </p>
                <p className="text-[10px] text-content-muted">{formatBytes(file.size)}</p>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={() => onRemove(idx)}
                className="absolute right-1.5 top-1/2 -translate-y-1/2
                  p-0.5 rounded-md text-content-muted hover:text-red-400
                  hover:bg-red-500/10 transition-colors"
                title="Remove"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Lightbox for staged images */}
      {preview && (
        <ImagePreviewModal
          url={preview.url}
          filename={preview.filename}
          onClose={() => setPreview(null)}
        />
      )}
    </>
  );
}

export default AttachmentFilePreview;
