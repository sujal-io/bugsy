import { useCallback, useEffect, useState } from "react";
import BugCard from "../components/BugCard";
import CreateBugForm from "../components/CreateBugForm";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import TeamGate from "../components/TeamGate";
import TeamPanel from "../components/TeamPanel";
import { useToast } from "../components/ToastProvider.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { apiRequest } from "../lib/apiClient";

function Dashboard() {
  // Main data
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("my"); // "my" | "team" | "assigned"
  const [team, setTeam] = useState(null);
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

      // If user has no team, skip bug fetch (CreateBug requires a team)
      if (!user?.team) {
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

      let endpoint = "my";
      if (view === "team") {
        endpoint = "team";
      } else if (view === "assigned") {
        endpoint = `team?assignedTo=${user.id}`;
      }

      // Build URL with proper query separator
      const queryString = endpoint.includes("?") ? `&${query}` : `?${query}`;
      const url = `/api/bugs/${endpoint}${queryString}`;

      let data;
      try {
        data = await apiRequest(url);
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
  }, [user?.team, user?.id, view, statusFilter, priorityFilter, search, page]);

  const fetchTeam = useCallback(async () => {
    try {
      if (!localStorage.getItem("token")) return;
      if (!user?.team) {
        setTeam(null);
        return;
      }
      const data = await apiRequest("/api/team/me");
      setTeam(data?.team || null);
    } catch {
      setTeam(null);
    }
  }, [user?.team]);

  // Fetch on change
  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  useEffect(() => {
    fetchTeam();
  }, [fetchTeam]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [view, statusFilter, priorityFilter, search]);

  // Create Bug
  const createBug = async (title, description, priority, assignedTo) => {
    try {
      await apiRequest("/api/bugs", {
        method: "POST",
        body: { title, description, priority, assignedTo: assignedTo || undefined },
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
  const updateBug = async (id, status, solution, assignedTo) => {
    try {
      const body = {};
      if (status !== undefined) body.status = status;
      if (solution !== undefined) body.solution = solution;
      if (assignedTo !== undefined) body.assignedTo = assignedTo;

      await apiRequest(`/api/bugs/${id}`, {
        method: "PUT",
        body,
      });

      fetchBugs();
      toast.success("Bug updated");
    } catch (error) {
      console.error("Update bug error:", error);
      toast.error(error?.message || "Update failed");
    }
  };

  return (
    <div className="text-white p-6 min-h-screen flex flex-col">

      <Navbar />

      <div className="flex-1">
      {/* Scope tabs */}
      <div className="mb-4">
        <div role="tablist" className="tabs tabs-boxed bg-white/10">
          <button
            role="tab"
            type="button"
            className={`tab ${view === "my" ? "tab-active" : ""}`}
            onClick={() => setView("my")}
          >
            My Bugs
          </button>
          <button
            role="tab"
            type="button"
            className={`tab ${view === "team" ? "tab-active" : ""}`}
            onClick={() => setView("team")}
          >
            Team Bugs
          </button>
          <button
            role="tab"
            type="button"
            className={`tab ${view === "assigned" ? "tab-active" : ""}`}
            onClick={() => setView("assigned")}
          >
            Assigned to Me
          </button>
        </div>
      </div>

      {/* Welcome */}
      <p className="text-gray-300 mb-6">
        Welcome back, {user?.username}
      </p>

      {/* No-team gate */}
      {!user?.team ? (
        <div className="mt-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-1">You’re not in a team yet</h2>
            <p className="text-gray-300 text-sm">
              Create a team or join one with an invite code to start tracking bugs.
            </p>
          </div>

          <TeamGate
            onTeamUpdated={(t) => {
              setTeam(t);
              window.location.reload();
            }}
          />
        </div>
      ) : (
        <>
          {/* Team info */}
          <TeamPanel team={team} onLeave={() => { setTeam(null); window.location.reload(); }} />

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
      <CreateBugForm createBug={createBug} teamMembers={team?.members || []} />

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
              teamMembers={team?.members || []}
              currentUserId={user?.id}
              isTeamAdmin={String(team?.admin?._id || team?.admin) === String(user?.id)}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

        </>
      )}
      </div>

      <Footer />
    </div>
  );
}

export default Dashboard;