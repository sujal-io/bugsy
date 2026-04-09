import { useCallback, useEffect, useState } from "react";
import BugCard from "../components/BugCard";
import CreateBugForm from "../components/CreateBugForm";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import TeamGate from "../components/TeamGate";
import TeamPanel from "../components/TeamPanel";
import TeamSelector from "../components/TeamSelector";
import TeamManagement from "../components/TeamManagement";
import { useToast } from "../components/ToastProvider.jsx";
import Navbar from "../components/Navbar";
import { apiRequest } from "../lib/apiClient";

function Dashboard() {
  // Main data
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scope, setScope] = useState("my"); // "my" | "team"
  const [teams, setTeams] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [bugsError, setBugsError] = useState("");
  const [totalPages, setTotalPages] = useState(1);

  const toast = useToast();

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

  // User
  const user = JSON.parse(localStorage.getItem("user"));

  // Initialize teams from user data
  useEffect(() => {
    if (user?.teams && user.teams.length > 0) {
      setTeams(user.teams);
      setSelectedTeam(user.teams[0]);
    }
  }, [user]);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Fetch bugs
  const fetchBugs = useCallback(async () => {
    try {
      setLoading(true);
      setBugsError("");
      if (!localStorage.getItem("token")) {
        handleLogout();
        return;
      }

      // If user has no teams or no selected team, skip bug fetch
      if (!selectedTeam) {
        setBugs([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      let query = "";

      if (statusFilter) query += `status=${statusFilter}&`;
      if (priorityFilter) query += `priority=${priorityFilter}&`;
      if (search) query += `search=${search}&`;

      query += `page=${page}&limit=6`;

      const endpoint = scope === "team" ? "team" : "my";

      let data;
      try {
        data = await apiRequest(`/api/bugs/${endpoint}?${query}`);
      } catch (err) {
        if (err?.status === 401) {
          handleLogout();
          return;
        }
        throw err;
      }

      // Ensure array (API currently returns an array, but allow { bugs: [] } too)
      const nextBugs = Array.isArray(data) ? data : data?.bugs;
      setBugs(Array.isArray(nextBugs) ? nextBugs : []);
      setTotalPages(
        typeof data?.totalPages === "number" && data.totalPages > 0
          ? data.totalPages
          : 1
      );
      setLoading(false);
    } catch (error) {
      console.error("Fetch bugs error:", error);
      setBugs([]);
      setTotalPages(1);
      setBugsError(error?.message || "Network error while fetching bugs");
      setLoading(false);
    }
  }, [selectedTeam, scope, statusFilter, priorityFilter, search, page]);

  const fetchTeams = useCallback(async () => {
    try {
      if (!localStorage.getItem("token")) return;
      const data = await apiRequest("/api/team/teams");
      setTeams(data?.teams || []);
      if (data?.teams?.length > 0 && !selectedTeam) {
        setSelectedTeam(data.teams[0]);
      }
    } catch {
      setTeams([]);
    }
  }, [selectedTeam]);

  // Fetch on change
  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  useEffect(() => {
    fetchTeams();
  }, [fetchTeams]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [scope, statusFilter, priorityFilter, search]);

  // Create Bug
  const createBug = async (title, description, priority) => {
    try {
      await apiRequest("/api/bugs", {
        method: "POST",
        body: { title, description, priority },
      });

      fetchBugs();
      toast.success("Bug created");
    } catch (error) {
      console.error("Create bug error:", error);
      toast.error(error?.message || "Create bug failed");
    }
  };

  // Delete Bug
  const deleteBug = async (id) => {
    try {
      await apiRequest(`/api/bugs/${id}`, { method: "DELETE" });

      fetchBugs();
      toast.success("Bug deleted");
    } catch (error) {
      console.error("Delete bug error:", error);
      toast.error(error?.message || "Delete failed");
    }
  };

  // Update Bug
  const updateBug = async (id, status, solution) => {
    try {
      await apiRequest(`/api/bugs/${id}`, {
        method: "PUT",
        body: { status, solution },
      });

      fetchBugs();
      toast.success("Bug updated");
    } catch (error) {
      console.error("Update bug error:", error);
      toast.error(error?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141e30] to-[#243b55] text-white p-6">

      <Navbar />

      {/* Scope tabs */}
      <div className="mb-4">
        <div role="tablist" className="tabs tabs-boxed bg-white/10">
          <button
            role="tab"
            type="button"
            className={`tab ${scope === "my" ? "tab-active" : ""}`}
            onClick={() => setScope("my")}
          >
            My Bugs
          </button>
          <button
            role="tab"
            type="button"
            className={`tab ${scope === "team" ? "tab-active" : ""}`}
            onClick={() => setScope("team")}
          >
            Team Bugs
          </button>
        </div>
      </div>

      {/* Welcome */}
      <p className="text-gray-300 mb-6">
        Welcome back, {user?.username}
      </p>

      {/* No-teams gate */}
      {teams.length === 0 ? (
        <div className="mt-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-1">You’re not in a team yet</h2>
            <p className="text-gray-300 text-sm">
              Create a team or join one with an invite code to start tracking bugs.
            </p>
          </div>

          <TeamGate
            onTeamUpdated={(t) => {
              setTeams(prev => [...prev, t]);
              setSelectedTeam(t);
              window.location.reload();
            }}
          />
        </div>
      ) : (
        <>
          {/* Team selector and info */}
          <div className="flex justify-between items-center mb-6">
            <TeamSelector
              teams={teams}
              selectedTeam={selectedTeam}
              onTeamSelect={setSelectedTeam}
              onManageTeams={() => setShowTeamManagement(true)}
            />
          </div>

          {selectedTeam && <TeamPanel team={selectedTeam} />}

          {/* Filters */}
          <FilterBar
            search={search}
            setSearch={setSearch}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            priorityFilter={priorityFilter}
            setPriorityFilter={setPriorityFilter}
          />

          {/* Create Bug */}
          <CreateBugForm createBug={createBug} />

          {/* Bug List */}
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-white/10 border border-white/20 rounded-xl p-5"
                >
                  <div className="skeleton h-5 w-3/4 mb-3 bg-white/10" />
                  <div className="skeleton h-3 w-full mb-2 bg-white/10" />
                  <div className="skeleton h-3 w-5/6 mb-6 bg-white/10" />
                  <div className="flex gap-2">
                    <div className="skeleton h-6 w-20 bg-white/10" />
                    <div className="skeleton h-6 w-20 bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : bugsError ? (
            <div className="mt-8">
              <div className="alert alert-error">
                <span>{bugsError}</span>
              </div>
            </div>
          ) : bugs.length === 0 ? (
            <p className="text-center text-gray-400 mt-10">
              No bugs found
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bugs.map((bug) => (
                <BugCard
                  key={bug._id}
                  bug={bug}
                  deleteBug={deleteBug}
                  updateBug={updateBug}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          <Pagination page={page} setPage={setPage} totalPages={totalPages} />
        </>
      )}

      {/* Team Management Modal */}
      {showTeamManagement && (
        <TeamManagement
          teams={teams}
          onTeamsUpdated={(updatedTeams) => {
            setTeams(updatedTeams);
            if (!selectedTeam && updatedTeams.length > 0) {
              setSelectedTeam(updatedTeams[0]);
            }
          }}
          onClose={() => setShowTeamManagement(false)}
        />
      )}
    </div>
  );
}

export default Dashboard;