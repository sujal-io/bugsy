/**
 * BugDetailPanel — presentation layer for the slide-out bug detail view.
 * All business logic (handlers, state, permissions) lives in BugCard.jsx.
 * This component only renders UI based on the props it receives.
 */

import { useRef } from "react";
import { Sparkles, MessageSquare, Clock, Trash2, UserCog, RefreshCw, CheckCircle2 } from "lucide-react";
import { BugStatusBadge } from "./BugStatusBadge";
import { BugPriorityBadge } from "./BugPriorityBadge";
import CommentSection from "../comments/CommentSection.jsx";
import ActivityTimeline from "../activity/ActivityTimeline.jsx";
import SlidePanel from "../common/SlidePanel.jsx";

/* ─── Small layout helpers ─────────────────────────────────────────────── */

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-content-muted mb-2">
      {children}
    </p>
  );
}

function Divider() {
  return <div className="border-t border-border" />;
}

function AvatarChip({ name, sub }) {
  const initial = name ? name.charAt(0).toUpperCase() : "?";
  return (
    <div className="flex items-center gap-2.5">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold shrink-0">
        {initial}
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-content-primary leading-none truncate">{name ?? "Unknown"}</p>
        {sub && <p className="text-[11px] text-content-muted mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function FieldRow({ label, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-xs text-content-muted shrink-0">{label}</span>
      <span className="flex items-center gap-2">{children}</span>
    </div>
  );
}

function PanelSelect({ label, value, onChange, children }) {
  return (
    <div className="space-y-1.5">
      <SectionLabel>{label}</SectionLabel>
      <select
        className="w-full px-3 py-2.5 rounded-xl bg-background-secondary border border-border
          text-content-primary text-sm focus:outline-none focus:border-primary
          transition-colors appearance-none"
        value={value}
        onChange={onChange}
      >
        {children}
      </select>
    </div>
  );
}

function PrimaryButton({ onClick, children, className = "" }) {
  return (
    <button
      onClick={onClick}
      className={`w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors ${className}`}
    >
      {children}
    </button>
  );
}

function CollapseToggle({ icon: Icon, label, isOpen, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl
        bg-background-secondary/60 border border-border hover:border-border-strong
        text-content-primary text-sm font-medium transition-colors group"
    >
      <span className="flex items-center gap-2">
        <Icon className="w-4 h-4 text-content-muted group-hover:text-content-primary transition-colors" />
        {label}
      </span>
      <span className="text-content-muted text-xs">{isOpen ? "▲" : "▼"}</span>
    </button>
  );
}

/* ─── Main export ───────────────────────────────────────────────────────── */

export function BugDetailPanel({
  bug,
  isOpen,
  onClose,
  // state
  status,
  setStatus,
  assignedUser,
  setAssignedUser,
  solution,
  setSolution,
  showAI,
  loadingAI,
  formatted,
  showComments,
  showTimeline,
  // handlers
  handleUpdateAssignment,
  handleUpdateStatus,
  handleSubmitSolution,
  getAISolution,
  handleToggleComments,
  setShowTimeline,
  deleteBug,
  setIsPanelOpen,
  // permissions
  canChangeAssignment,
  canChangeStatus,
  canFixBug,
  isBugCreator,
  // data
  teamMembers,
  commentRef,
}) {
  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title={bug.title} priority={bug.priority} status={bug.status}>
      <div className="space-y-5 pb-8">

        {/* ── Description ─────────────────────────────────────────── */}
        <section>
          <SectionLabel>Description</SectionLabel>
          <p className="text-sm text-content-secondary leading-relaxed bg-background-secondary/40 rounded-xl px-4 py-3 border border-border">
            {bug.description}
          </p>
        </section>

        <Divider />

        {/* ── People + Status row ──────────────────────────────────── */}
        <section className="space-y-3">
          <SectionLabel>Details</SectionLabel>

          <FieldRow label="Reporter">
            <AvatarChip name={bug.user?.username} sub="Reporter" />
          </FieldRow>

          <FieldRow label="Assignee">
            {bug.assignedTo?.username
              ? <AvatarChip name={bug.assignedTo.username} sub="Assignee" />
              : <span className="text-sm text-content-muted">Unassigned</span>
            }
          </FieldRow>

          <FieldRow label="Status">
            <BugStatusBadge status={bug.status} size="md" />
          </FieldRow>

          <FieldRow label="Priority">
            <BugPriorityBadge priority={bug.priority} size="md" />
          </FieldRow>
        </section>

        {/* ── Solution (read-only) ─────────────────────────────────── */}
        {bug.solution && (
          <>
            <Divider />
            <section>
              <SectionLabel>Solution</SectionLabel>
              <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-3">
                <p className="text-sm text-content-secondary leading-relaxed">{bug.solution}</p>
              </div>
            </section>
          </>
        )}

        {/* ── Assignment control ───────────────────────────────────── */}
        {canChangeAssignment && (
          <>
            <Divider />
            <section className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <UserCog className="w-3.5 h-3.5 text-content-muted" />
                <SectionLabel>Assign To</SectionLabel>
              </div>
              <PanelSelect
                label="Assign To"
                value={assignedUser}
                onChange={(e) => setAssignedUser(e.target.value)}
              >
                <option value="">Unassigned</option>
                {teamMembers?.map((m) => (
                  <option key={m._id} value={m._id}>{m.username}</option>
                ))}
              </PanelSelect>
              <PrimaryButton onClick={handleUpdateAssignment}>
                Save Assignment
              </PrimaryButton>
            </section>
          </>
        )}

        {/* ── Status control ───────────────────────────────────────── */}
        {canChangeStatus && (
          <>
            <Divider />
            <section className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <RefreshCw className="w-3.5 h-3.5 text-content-muted" />
                <SectionLabel>Update Status</SectionLabel>
              </div>
              <PanelSelect
                label="Update Status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>Open</option>
                <option>In Progress</option>
                <option>Fixed</option>
              </PanelSelect>
              <PrimaryButton onClick={handleUpdateStatus}>
                Save Status
              </PrimaryButton>
            </section>
          </>
        )}

        {/* ── Solution input ───────────────────────────────────────── */}
        {canFixBug && (status === "Fixed" || bug.status === "Fixed") && (
          <>
            <Divider />
            <section className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <SectionLabel>Submit Solution</SectionLabel>
              </div>
              <textarea
                placeholder="Describe what fixed this bug..."
                rows={4}
                className="w-full px-3 py-2.5 rounded-xl bg-background-secondary border border-border
                  text-content-primary text-sm focus:outline-none focus:border-primary
                  resize-none transition-colors placeholder:text-content-muted"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
              />
              <button
                onClick={handleSubmitSolution}
                className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium transition-colors"
              >
                Submit Solution
              </button>
            </section>
          </>
        )}

        {/* ── AI Suggestions ───────────────────────────────────────── */}
        <Divider />
        <section className="space-y-3">
          <button
            disabled={loadingAI}
            onClick={getAISolution}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              bg-violet-500/15 border border-violet-500/25 hover:bg-violet-500/25
              text-violet-300 text-sm font-medium transition-colors disabled:opacity-60"
          >
            <Sparkles className="w-4 h-4" />
            {loadingAI ? "Thinking…" : "Get AI Suggestions"}
          </button>

          {formatted && showAI && (
            <div className="rounded-xl bg-violet-500/10 border border-violet-500/20 px-4 py-4 space-y-3">
              <p className="text-xs font-semibold text-violet-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> AI Suggestion
              </p>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-blue-400 mb-1">Cause</p>
                <p className="text-sm text-content-secondary leading-relaxed">{formatted.cause}</p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-widest text-emerald-400 mb-1">Fix</p>
                <ul className="space-y-1 text-sm text-content-secondary list-disc ml-4">
                  {formatted.fixes.map((f, i) => <li key={i}>{f}</li>)}
                </ul>
              </div>
            </div>
          )}
        </section>

        {/* ── Comments ─────────────────────────────────────────────── */}
        <Divider />
        <section className="space-y-3">
          <CollapseToggle
            icon={MessageSquare}
            label="Comments"
            isOpen={showComments}
            onToggle={handleToggleComments}
          />
          {showComments && (
            <div ref={commentRef}>
              <CommentSection bugId={bug._id} />
            </div>
          )}
        </section>

        {/* ── Activity Timeline ────────────────────────────────────── */}
        <Divider />
        <section className="space-y-3">
          <CollapseToggle
            icon={Clock}
            label="Activity"
            isOpen={showTimeline}
            onToggle={() => setShowTimeline((p) => !p)}
          />
          {showTimeline && (
            <div className="max-h-64 overflow-y-auto rounded-xl border border-border bg-background-secondary/30 px-3 py-3">
              <ActivityTimeline bugId={bug._id} />
            </div>
          )}
        </section>

        {/* ── Danger zone ──────────────────────────────────────────── */}
        {isBugCreator && (
          <>
            <Divider />
            <section>
              <button
                onClick={() => { deleteBug(bug._id); setIsPanelOpen(false); }}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
                  bg-red-500/10 border border-red-500/20 hover:bg-red-500/20
                  text-red-400 text-sm font-medium transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Bug
              </button>
            </section>
          </>
        )}

      </div>
    </SlidePanel>
  );
}
