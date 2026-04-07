import { useState } from "react";

function TeamGate({ onTeamUpdated }) {
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: "", message: "" });

  const API_BASE_URL =
    import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast({ type: "", message: "" }), 2000);
  };

  const updateStoredUserTeam = (teamId) => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const u = JSON.parse(stored);
      localStorage.setItem("user", JSON.stringify({ ...u, team: teamId }));
    } catch {
      // ignore malformed user in storage
    }
  };

  const createTeam = async (e) => {
    e.preventDefault();
    if (!teamName.trim()) {
      showToast("error", "Team name is required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/team/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: teamName.trim() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Create team failed");

      updateStoredUserTeam(data?.team?._id);
      onTeamUpdated?.(data?.team);
      showToast("success", "Team created");
      setTeamName("");
    } catch (err) {
      showToast("error", err?.message || "Create team failed");
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      showToast("error", "Invite code is required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API_BASE_URL}/api/team/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ inviteCode: inviteCode.trim().toUpperCase() }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Join team failed");

      updateStoredUserTeam(data?.team?._id);
      onTeamUpdated?.(data?.team);
      showToast("success", "Joined team");
      setInviteCode("");
    } catch (err) {
      showToast("error", err?.message || "Join team failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-1">Create a Team</h2>
        <p className="text-gray-300 text-sm mb-4">
          Start a new workspace and invite your teammates.
        </p>

        <form onSubmit={createTeam} className="space-y-3">
          <input
            className="input input-bordered w-full bg-white/5"
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            disabled={loading}
          />
          <button className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Working..." : "Create Team"}
          </button>
        </form>
      </div>

      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-1">Join a Team</h2>
        <p className="text-gray-300 text-sm mb-4">
          Enter an invite code from your team admin.
        </p>

        <form onSubmit={joinTeam} className="space-y-3">
          <input
            className="input input-bordered w-full bg-white/5 uppercase tracking-widest"
            placeholder="INVITE CODE"
            value={inviteCode}
            onChange={(e) => setInviteCode(e.target.value)}
            disabled={loading}
          />
          <button className="btn btn-secondary w-full" disabled={loading}>
            {loading ? "Working..." : "Join Team"}
          </button>
        </form>
      </div>

      {toast.message && (
        <div className="toast toast-top toast-end">
          <div
            className={`alert ${
              toast.type === "error" ? "alert-error" : "alert-success"
            }`}
          >
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamGate;

