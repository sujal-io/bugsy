import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { BugStatusBadge } from '../bugs/BugStatusBadge';
import { BugPriorityBadge } from '../bugs/BugPriorityBadge';

/**
 * SlidePanel — generic right-side drawer.
 * Accepts optional `status` and `priority` to render badges in the sticky header.
 */
function SlidePanel({ isOpen, onClose, children, title, status, priority }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 h-full w-full max-w-2xl bg-background border-l border-border z-50 shadow-2xl flex flex-col"
          >
            {/* ── Sticky header ─────────────────────────────────────── */}
            <div className="shrink-0 sticky top-0 z-10 flex flex-col gap-2
              px-6 py-4 border-b border-border bg-surface/80 backdrop-blur-xl">

              {/* Top row: title + close */}
              <div className="flex items-start justify-between gap-3">
                <h2 className="text-base font-semibold text-content-primary leading-snug line-clamp-2 flex-1">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  aria-label="Close panel"
                  className="shrink-0 p-1.5 rounded-lg hover:bg-white/[0.06]
                    text-content-muted hover:text-content-primary transition-colors mt-0.5"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Bottom row: badges (only when provided) */}
              {(status || priority) && (
                <div className="flex items-center gap-2">
                  {status   && <BugStatusBadge   status={status}   size="sm" />}
                  {priority && <BugPriorityBadge priority={priority} size="sm" />}
                </div>
              )}
            </div>

            {/* ── Scrollable content ─────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SlidePanel;
