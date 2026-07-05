import { useState, useRef } from "react";
import { useToast } from "../common/ToastProvider.jsx";
import { apiRequest } from "../../lib/apiClient";
import { Copy, Users, User, LogOut } from "lucide-react";

function TeamPanel({ team, onLeave }) {
  const [leaving, setLeaving] = useState(false);
  const toast = useToast();
  const modalRef = useRef(null);

  if (!team) return null;

  const memberCount = Array.isArray(team.members) ? team.members.length : 0;
  const adminName = team.admin?.username || "Admin";

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-5 mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-content-primary">{team.name}</h2>
          <p className="text-content-secondary text-sm flex items-center gap-2 mt-1">
            <User className="w-4 h-4" />
            Admin: {adminName} • <Users className="w-4 h-4" /> Members: {memberCount}
          </p>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="bg-background-secondary border border-border rounded-xl px-3 sm:px-4 py-2.5 font-mono tracking-widest text-xs sm:text-sm text-content-primary">
            {team.inviteCode}
          </div>
          <button
            type="button"
            className="p-2.5 rounded-xl bg-background-secondary border border-border hover:border-border-strong text-content-primary transition-colors"
            onClick={() => {
              navigator.clipboard.writeText(team.inviteCode);
              toast.success("Invite code copied!");
            }}
            title="Copy invite code"
          >
            <Copy className="w-4 h-4" />
          </button>
          <button
            type="button"
            className="px-3 sm:px-4 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 transition-colors text-xs sm:text-sm font-medium flex items-center gap-2"
            onClick={() => modalRef.current?.showModal()}
            disabled={leaving}
          >
            <LogOut className="w-4 h-4" />
            {leaving ? "Leaving..." : "Leave"}
          </button>
        </div>
      </div>

      {Array.isArray(team.members) && team.members.length > 0 && (
        <div className="mt-4">
          <p className="text-content-secondary text-sm mb-3 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Members
          </p>
          <div className="flex flex-wrap gap-2">
            {team.members.map((m) => (
              <span
                key={m._id}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background-secondary border border-border text-content-primary text-sm"
              >
                <User className="w-3 h-3 text-content-muted" />
                {m.username}
              </span>
            ))}
          </div>
        </div>
      )}

      <dialog ref={modalRef} className="modal">
        <div className="modal-box bg-surface border border-border rounded-2xl shadow-2xl">
          <h3 className="font-bold text-lg text-content-primary">Leave Team?</h3>
          <p className="py-4 text-content-secondary">Are you sure you want to leave <span className="font-semibold text-content-primary">{team.name}</span>?</p>
          <div className="modal-action">
            <button 
              type="button"
              className="px-6 py-2.5 rounded-xl bg-background-secondary border border-border hover:border-border-strong text-content-primary transition-colors text-sm font-medium" 
              onClick={() => modalRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium"
              onClick={async () => {
                setLeaving(true);
                try {
                  await apiRequest("/api/team/leave", { method: "POST" });
                  const stored = localStorage.getItem("user");
                  if (stored) {
                    try {
                      const u = JSON.parse(stored);
                      localStorage.setItem("user", JSON.stringify({ ...u, team: null }));
                    } catch {}
                  }
                  toast.success("Left team successfully");
                  onLeave?.();
                  window.location.reload();
                } catch (err) {
                  toast.error(err?.message || "Leave team failed");
                } finally {
                  setLeaving(false);
                  modalRef.current?.close();
                }
              }}
              disabled={leaving}
            >
              {leaving ? "Leaving..." : "Leave"}
            </button>
          </div>
        </div>
      </dialog>
    </div>
  );
}

export default TeamPanel;

