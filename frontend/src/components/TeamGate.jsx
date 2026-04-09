import { useState } from "react";
import { useToast } from "./ToastProvider.jsx";
import { apiRequest } from "../lib/apiClient";

function TeamGate({ onTeamUpdated }) {
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();

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
      toast.error("Team name is required");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/api/team/create", {
        method: "POST",
        body: { name: teamName.trim() },
      });

      updateStoredUserTeam(data?.team?._id);
      onTeamUpdated?.(data?.team);
      toast.success("Team created");
      setTeamName("");
    } catch (err) {
      toast.error(err?.message || "Create team failed");
    } finally {
      setLoading(false);
    }
  };

  const joinTeam = async (e) => {
    e.preventDefault();
    if (!inviteCode.trim()) {
      toast.error("Invite code is required");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest("/api/team/join", {
        method: "POST",
        body: { inviteCode: inviteCode.trim().toUpperCase() },
      });

      updateStoredUserTeam(data?.team?._id);
      onTeamUpdated?.(data?.team);
      toast.success("Joined team");
      setInviteCode("");
    } catch (err) {
      toast.error(err?.message || "Join team failed");
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

    </div>
  );
}

export default TeamGate;

