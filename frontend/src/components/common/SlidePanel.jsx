import { X } from 'lucide-react';
import { BugStatusBadge } from '../bugs/BugStatusBadge';
import { BugPriorityBadge } from '../bugs/BugPriorityBadge';

// Render a slide-out panel with optional status and priority badges.
function SlidePanel({ isOpen, onClose, children, title, status, priority }) {
  if (!isOpen) return null;

  return (
    <>
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      />

      <div className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l border-border z-50 shadow-2xl flex flex-col">
        <div className="shrink-0 sticky top-0 z-10 flex flex-col gap-2 px-6 py-4 border-b border-border bg-surface/80 backdrop-blur-xl">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-base font-semibold text-content-primary leading-snug line-clamp-2 flex-1">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close panel"
              className="shrink-0 p-1.5 rounded-lg hover:bg-white/[0.06] text-content-muted hover:text-content-primary transition-colors mt-0.5"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {(status || priority) && (
            <div className="flex items-center gap-2">
              {status && <BugStatusBadge status={status} size="sm" />}
              {priority && <BugPriorityBadge priority={priority} size="sm" />}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {children}
        </div>
      </div>
    </>
  );
}

export default SlidePanel;
