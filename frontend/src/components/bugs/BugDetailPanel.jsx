import { useState } from "react";
import {
  Sparkles, MessageSquare, Clock, Trash2,
  UserCog, RefreshCw, CheckCircle2, ChevronDown, Image,
} from "lucide-react";
import { BugStatusBadge } from "./BugStatusBadge";
import { BugPriorityBadge } from "./BugPriorityBadge";
import CommentSection from "../comments/CommentSection.jsx";
import ActivityTimeline from "../activity/ActivityTimeline.jsx";
import SlidePanel from "../common/SlidePanel.jsx";
import ImagePreviewModal from "../attachments/ImagePreviewModal.jsx";

// ── Shared layout primitives ───────────────────────────────────────────────

function Divider() {
  return <div className="border-t border-border" />;
}

function SectionLabel({ children }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-widest text-content-muted mb-2">
      {children}
    </p>
  );
}

function SectionHeader({ icon: Icon, title, description, iconClass = "text-content-muted" }) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="shrink-0 mt-0.5 h-8 w-8 rounded-lg bg-background-secondary border border-border flex items-center justify-center">
        <Icon className={`w-4 h-4 ${iconClass}`} />
      </div>
      <div>
        <p className="text-sm font-semibold text-content-primary leading-none">{title}</p>
        {description && (
          <p className="text-xs text-content-muted mt-1">{description}</p>
        )}
      </div>
    </div>
  );
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

function PanelSelect({ value, onChange, children }) {
  return (
    <select
      className="w-full px-3 py-2.5 rounded-xl bg-background-secondary border border-border
        text-content-primary text-sm focus:outline-none focus:border-primary
        transition-colors appearance-none"
      value={value}
      onChange={onChange}
    >
      {children}
    </select>
  );
}

function PrimaryButton({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white text-sm font-medium transition-colors"
    >
      {children}
    </button>
  );
}

// Collapsible sub-section used for Activity inside Discussion
function Collapsible({ icon: Icon, label, iconClass, children }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-3 py-2 rounded-xl
          bg-background-secondary/40 hover:bg-background-secondary/80
          border border-border hover:border-border-strong
          text-content-secondary hover:text-content-primary
          text-sm font-medium transition-colors"
      >
        <span className="flex items-center gap-2">
          <Icon className={`w-4 h-4 ${iconClass}`} />
          {label}
        </span>
        <ChevronDown className={`w-4 h-4 text-content-muted transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-xl border border-border bg-background-secondary/30 px-3 py-3">
          {children}
        </div>
      )}
    </div>
  );
}

// ── Main export ────────────────────────────────────────────────────────────

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
  // handlers
  handleUpdateAssignment,
  handleUpdateStatus,
  handleSubmitSolution,
  getAISolution,
  deleteBug,
  setIsPanelOpen,
  // permissions
  canChangeAssignment,
  canChangeStatus,
  canFixBug,
  isBugCreator,
  isTeamAdmin,
  // data
  teamMembers,
}) {
  const [isDiscussionOpen, setIsDiscussionOpen] = useState(false);
  const [isActivityOpen, setIsActivityOpen] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  return (
    <SlidePanel isOpen={isOpen} onClose={onClose} title={bug.title} priority={bug.priority} status={bug.status}>
      <div className="space-y-5 pb-10">

        {/* ── Description ─────────────────────────────────────────── */}
        <section>
          <SectionLabel>Description</SectionLabel>
          <p className="text-sm text-content-secondary leading-relaxed bg-background-secondary/40 rounded-xl px-4 py-3 border border-border">
            {bug.description}
          </p>
        </section>

        <Divider />

        {bug.screenshots?.length > 0 && (
          <section>
            <SectionLabel>Screenshots</SectionLabel>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {bug.screenshots.map((screenshot) => (
                <button
                  key={screenshot._id || screenshot.publicId}
                  type="button"
                  onClick={() => setSelectedScreenshot({ url: screenshot.url, filename: screenshot.filename })}
                  className="group overflow-hidden rounded-xl border border-border bg-background-secondary/40 p-1 text-left transition-transform hover:-translate-y-0.5 hover:shadow-md"
                >
                  <img
                    src={screenshot.url}
                    alt={screenshot.filename}
                    className="h-24 w-full rounded-lg object-cover"
                  />
                  <p className="truncate px-1 pb-1 pt-2 text-[11px] font-medium text-content-primary">
                    {screenshot.filename}
                  </p>
                </button>
              ))}
            </div>
          </section>
        )}

        {selectedScreenshot && (
          <ImagePreviewModal
            url={selectedScreenshot.url}
            filename={selectedScreenshot.filename}
            onClose={() => setSelectedScreenshot(null)}
          />
        )}

        <Divider />

        {/* ── Details ─────────────────────────────────────────────── */}
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

        {/* ── Solution read-only ───────────────────────────────────── */}
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

        <Divider />

        {/* ── Discussion ───────────────────────────────────────────── */}
        <section>
          <button
            type="button"
            onClick={() => setIsDiscussionOpen((prev) => !prev)}
            className="w-full flex items-center justify-between rounded-xl border border-border bg-background-secondary/40 px-3 py-2.5 text-left transition-colors hover:bg-background-secondary/80"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background-secondary">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-content-primary leading-none">Discussion</p>
                <p className="mt-1 text-xs text-content-muted">Comments and activity for this bug.</p>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-content-muted transition-transform duration-200 ${isDiscussionOpen ? "rotate-180" : ""}`} />
          </button>

          {isDiscussionOpen && (
            <div className="mt-3">
              <CommentSection
                bugId={bug._id}
                canUpload={true}
              />
            </div>
          )}
        </section>

        <Divider />

        <section>
          <button
            type="button"
            onClick={() => setIsActivityOpen((prev) => !prev)}
            className="w-full flex items-center justify-between rounded-xl border border-border bg-background-secondary/40 px-3 py-2.5 text-left transition-colors hover:bg-background-secondary/80"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-background-secondary">
                <Clock className="h-4 w-4 text-content-muted" />
              </div>
              <div>
                <p className="text-sm font-semibold text-content-primary leading-none">Activity Timeline</p>
                <p className="mt-1 text-xs text-content-muted">Recent updates for this bug.</p>
              </div>
            </div>
            <ChevronDown className={`h-4 w-4 text-content-muted transition-transform duration-200 ${isActivityOpen ? "rotate-180" : ""}`} />
          </button>

          {isActivityOpen && (
            <div className="mt-3">
              <ActivityTimeline bugId={bug._id} />
            </div>
          )}
        </section>

        <Divider />

        {/* ── AI Suggestions ───────────────────────────────────────── */}
        <section className="space-y-3">
          <SectionHeader
            icon={Sparkles}
            title="AI Suggestions"
            description="Let AI help diagnose this bug."
            iconClass="text-violet-400"
          />

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

        {/* ── Assignment control ───────────────────────────────────── */}
        {canChangeAssignment && (
          <>
            <Divider />
            <section className="space-y-2">
              <div className="flex items-center gap-2 mb-1">
                <UserCog className="w-3.5 h-3.5 text-content-muted" />
                <SectionLabel>Assign To</SectionLabel>
              </div>
              <PanelSelect value={assignedUser} onChange={(e) => setAssignedUser(e.target.value)}>
                <option value="">Unassigned</option>
                {teamMembers?.map((m) => (
                  <option key={m._id} value={m._id}>{m.username}</option>
                ))}
              </PanelSelect>
              <PrimaryButton onClick={handleUpdateAssignment}>Save Assignment</PrimaryButton>
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
              <PanelSelect value={status} onChange={(e) => setStatus(e.target.value)}>
                <option>Open</option>
                <option>In Progress</option>
                <option>Fixed</option>
              </PanelSelect>
              <PrimaryButton onClick={handleUpdateStatus}>Save Status</PrimaryButton>
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
