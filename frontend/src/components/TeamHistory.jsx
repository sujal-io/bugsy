import { useEffect, useState } from "react";
import { useToast } from "./ToastProvider.jsx";
import { apiRequest } from "../lib/apiClient";

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
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Team History</h2>
        <div className="text-center text-gray-300">Loading...</div>
      </div>
    );
  }

  if (teamHistory.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Team History</h2>
        <p className="text-gray-300 text-sm">
          No team history yet. Create or join a team to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6">
      <h2 className="text-xl font-semibold mb-1">Team History</h2>
      <p className="text-gray-300 text-sm mb-4">
        Rejoin teams you've been part of
      </p>

      <div className="space-y-3 max-h-52 overflow-y-auto pr-2">
        {teamHistory.map((team) => (
          <div key={team._id}>
            {activeTeamId === team._id ? (
              // Show invite code input form
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium text-white">{team.name}</h3>
                  <button
                    onClick={() => setActiveTeamId(null)}
                    className="text-xs text-gray-400 hover:text-gray-200"
                  >
                    ✕
                  </button>
                </div>
                <input
                  type="text"
                  className="input input-bordered input-sm w-full bg-white/5 uppercase tracking-widest"
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
                    className="btn btn-sm btn-primary flex-1"
                  >
                    {rejoinLoading === team._id ? "Joining..." : "Rejoin"}
                  </button>
                  <button
                    onClick={() => setActiveTeamId(null)}
                    disabled={rejoinLoading === team._id}
                    className="btn btn-sm btn-ghost flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              // Show team info with rejoin button
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 flex justify-between items-center hover:bg-white/10 transition">
                <div className="flex-1">
                  <h3 className="font-medium text-white">{team.name}</h3>
                  <p className="text-xs text-gray-400 mt-1">
                    {team.members?.length || 0} members
                  </p>
                </div>
                <button
                  onClick={() => handleRejoinClick(team._id)}
                  className="btn btn-sm btn-outline btn-primary"
                >
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
