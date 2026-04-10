import { useState, useRef } from "react";
import { useToast } from "./ToastProvider.jsx";
import { apiRequest } from "../lib/apiClient";

function TeamPanel({ team, onLeave }) {
  const [leaving, setLeaving] = useState(false);
  const toast = useToast();
  const modalRef = useRef(null);

  if (!team) return null;

  const memberCount = Array.isArray(team.members) ? team.members.length : 0;
  const adminName = team.admin?.username || "Admin";

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{team.name}</h2>
          <p className="text-gray-300 text-sm">
            Admin: {adminName} • Members: {memberCount}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-black/20 border border-white/20 rounded-lg px-3 py-2 font-mono tracking-widest">
            {team.inviteCode}
          </div>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => navigator.clipboard.writeText(team.inviteCode)}
          >
            Copy
          </button>
          <button
            type="button"
            className="btn btn-sm btn-error"
            onClick={() => modalRef.current?.showModal()}
            disabled={leaving}
          >
            {leaving ? "Leaving..." : "Leave"}
          </button>
        </div>
      </div>

      {Array.isArray(team.members) && team.members.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-300 text-sm mb-2">Members</p>
          <div className="flex flex-wrap gap-2">
            {team.members.map((m) => (
              <span
                key={m._id}
                className="badge badge-outline text-white border-white/30"
              >
                {m.username}
              </span>
            ))}
          </div>
        </div>
      )}

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Leave Team?</h3>
          <p className="py-4">Are you sure you want to leave <span className="font-semibold">{team.name}</span>?</p>
          <div className="modal-action">
            <button 
              type="button"
              className="btn" 
              onClick={() => modalRef.current?.close()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-error"
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

