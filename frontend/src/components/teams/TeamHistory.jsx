import { useEffect, useState } from "react";
import { useToast } from "../common/ToastProvider.jsx";
import { apiRequest } from "../../lib/apiClient.js";
import { History, Users, X, LogIn } from "lucide-react";

function TeamHistory({ onTeamUpdated }) {
  const [teamHistory, setTeamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rejoinLoading, setRejoinLoading] = useState(null);
  const [activeTeamId, setActiveTeamId] = useState(null);
  const [inviteCode, setInviteCode] = useState("");
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

  // Fetch team history on mount
  useEffect(() => {
    const fetchTeamHistory = async () => {
      try {
        setLoading(true);
        const data = await apiRequest("/api/team/history");
        setTeamHistory(data?.teamHistory || []);
      } catch (error) {
        console.error("Fetch team history error:", error);
        toast.error(error?.message || "Failed to fetch team history");
      } finally {
        setLoading(false);
      }
    };

    fetchTeamHistory();
  }, []);

  const handleRejoinClick = (teamId) => {
    setActiveTeamId(teamId);
    setInviteCode("");
  };

  const rejoinTeam = async (teamId) => {
    if (!inviteCode.trim()) {
      toast.error("Invite code is required");
      return;
    }

    setRejoinLoading(teamId);
    try {
      const data = await apiRequest("/api/team/rejoin", {
        method: "POST",
        body: { inviteCode: inviteCode.trim().toUpperCase() },
      });

      updateStoredUserTeam(data?.team?._id);
      onTeamUpdated?.(data?.team);
      toast.success("Rejoined team successfully");

      // Remove from history display after rejoin
      setTeamHistory(teamHistory.filter((t) => t._id !== teamId));
      setActiveTeamId(null);
      setInviteCode("");
    } catch (err) {
      toast.error(err?.message || "Failed to rejoin team");
    } finally {
      setRejoinLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-semibold text-content-primary mb-4 flex items-center gap-2">
          <History className="w-5 h-5" />
          Team History
        </h2>
        <div className="text-center text-content-secondary">Loading...</div>
      </div>
    );
  }

  if (teamHistory.length === 0) {
    return (
      <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 shadow-lg">
        <h2 className="text-lg sm:text-xl font-semibold text-content-primary mb-4 flex items-center gap-2">
          <History className="w-5 h-5" />
          Team History
        </h2>
        <p className="text-content-secondary text-sm">
          No team history yet. Create or join a team to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 shadow-lg">
      <h2 className="text-lg sm:text-xl font-semibold text-content-primary mb-1 flex items-center gap-2">
        <History className="w-5 h-5" />
        Team History
      </h2>
      <p className="text-content-secondary text-sm mb-4">
        Rejoin teams you've been part of
      </p>

      <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
        {teamHistory.map((team) => (
          <div key={team._id}>
            {activeTeamId === team._id ? (
              // Show invite code input form
              <div className="bg-background-secondary/50 border border-border rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-content-primary">{team.name}</h3>
                  <button
                    onClick={() => setActiveTeamId(null)}
                    className="text-xs text-content-muted hover:text-content-primary transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <input
                  type="text"
                  className="w-full p-3 rounded-xl bg-background-secondary border border-border text-content-primary placeholder:text-content-muted focus:outline-none focus:border-primary text-sm uppercase tracking-widest"
                  placeholder="INVITE CODE"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  disabled={rejoinLoading === team._id}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => rejoinTeam(team._id)}
                    disabled={rejoinLoading === team._id}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-medium shadow-lg shadow-primary/25 transition-all flex-1 text-sm"
                  >
                    {rejoinLoading === team._id ? "Joining..." : "Rejoin"}
                  </button>
                  <button
                    onClick={() => setActiveTeamId(null)}
                    disabled={rejoinLoading === team._id}
                    className="px-4 py-2.5 rounded-xl bg-background-secondary border border-border hover:border-border-strong text-content-primary transition-colors flex-1 text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Show team info with rejoin button
              <div className="bg-background-secondary/50 border border-border rounded-xl p-4 flex justify-between items-center hover:bg-background-secondary transition-colors cursor-pointer" onClick={() => handleRejoinClick(team._id)}>
                <div className="flex-1">
                  <h3 className="font-medium text-content-primary">{team.name}</h3>
                  <p className="text-xs text-content-muted mt-1 flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {team.members?.length || 0} members
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRejoinClick(team._id);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary/20 border border-primary/30 hover:bg-primary/30 text-primary transition-colors text-sm font-medium flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  Rejoin
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default TeamHistory;
