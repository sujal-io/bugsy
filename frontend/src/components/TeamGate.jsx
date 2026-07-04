import { useState } from "react";
import { useToast } from "./ToastProvider.jsx";
import { apiRequest } from "../lib/apiClient";
import TeamHistory from "./TeamHistory.jsx";
import { Plus, LogIn } from "lucide-react";

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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-content-primary mb-1 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Create a Team
          </h2>
          <p className="text-content-secondary text-sm mb-4">
            Start a new workspace and invite your teammates.
          </p>

          <form onSubmit={createTeam} className="space-y-3">
            <input
              className="w-full p-3 rounded-xl bg-background-secondary border border-border text-content-primary placeholder:text-content-muted focus:outline-none focus:border-primary text-sm"
              placeholder="Team name"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              disabled={loading}
            />
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-medium shadow-lg shadow-primary/25 transition-all" disabled={loading}>
              {loading ? "Working..." : "Create Team"}
            </button>
          </form>
        </div>

        <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 shadow-lg">
          <h2 className="text-lg sm:text-xl font-semibold text-content-primary mb-1 flex items-center gap-2">
            <LogIn className="w-5 h-5" />
            Join a Team
          </h2>
          <p className="text-content-secondary text-sm mb-4">
            Enter an invite code from your team admin.
          </p>

          <form onSubmit={joinTeam} className="space-y-3">
            <input
              className="w-full p-3 rounded-xl bg-background-secondary border border-border text-content-primary placeholder:text-content-muted focus:outline-none focus:border-primary text-sm uppercase tracking-widest"
              placeholder="INVITE CODE"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              disabled={loading}
            />
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-medium shadow-lg shadow-purple-500/25 transition-all" disabled={loading}>
              {loading ? "Working..." : "Join Team"}
            </button>
          </form>
        </div>

        <TeamHistory onTeamUpdated={onTeamUpdated} />
      </div>
    </>
  );
}

export default TeamGate;

