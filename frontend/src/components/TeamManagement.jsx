import { useState, useEffect } from "react";
import { useToast } from "./ToastProvider";
import { apiRequest } from "../lib/apiClient";

function TeamManagement({ teams, onTeamsUpdated, onClose }) {
  const [teamName, setTeamName] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [userTeams, setUserTeams] = useState(teams || []);
  const toast = useToast();

  const updateStoredUserTeams = (teams) => {
    const stored = localStorage.getItem("user");
    if (!stored) return;
    try {
      const u = JSON.parse(stored);
      localStorage.setItem("user", JSON.stringify({ ...u, teams }));
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

      const updatedTeams = [...userTeams, data.team];
      setUserTeams(updatedTeams);
      updateStoredUserTeams(updatedTeams.map(t => t._id));
      onTeamsUpdated?.(updatedTeams);
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

      const updatedTeams = [...userTeams, data.team];
      setUserTeams(updatedTeams);
      updateStoredUserTeams(updatedTeams.map(t => t._id));
      onTeamsUpdated?.(updatedTeams);
      toast.success("Joined team");
      setInviteCode("");
    } catch (err) {
      toast.error(err?.message || "Join team failed");
    } finally {
      setLoading(false);
    }
  };

  const leaveTeam = async (teamId) => {
    if (!confirm("Are you sure you want to leave this team?")) return;

    try {
      await apiRequest(`/api/team/${teamId}`, { method: "DELETE" });
      
      const updatedTeams = userTeams.filter(team => team._id !== teamId);
      setUserTeams(updatedTeams);
      updateStoredUserTeams(updatedTeams.map(t => t._id));
      onTeamsUpdated?.(updatedTeams);
      toast.success("Left team successfully");
    } catch (err) {
      toast.error(err?.message || "Leave team failed");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto text-gray-800">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Teams</h2>
            <button
              onClick={onClose}
              className="btn btn-circle btn-ghost btn-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Current Teams */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Your Teams</h3>
            {userTeams.length === 0 ? (
              <p className="text-gray-500">You haven't joined any teams yet.</p>
            ) : (
              <div className="grid gap-3">
                {userTeams.map((team) => (
                  <div key={team._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-gray-500">
                        {team.members.length} members • Admin: {team.admin.username}
                      </div>
                    </div>
                    <button
                      onClick={() => leaveTeam(team._id)}
                      className="btn btn-error btn-sm"
                    >
                      Leave
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Create/Join Teams */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Create New Team</h3>
              <form onSubmit={createTeam} className="space-y-3">
                <input
                  className="input input-bordered w-full"
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

            <div>
              <h3 className="text-lg font-semibold mb-4">Join Team</h3>
              <form onSubmit={joinTeam} className="space-y-3">
                <input
                  className="input input-bordered w-full uppercase tracking-widest"
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
        </div>
      </div>
    </div>
  );
}

export default TeamManagement;
