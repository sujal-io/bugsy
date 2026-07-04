import { useCallback, useEffect, useRef, useState } from "react";
import BugCard from "../components/BugCard";
import CreateBugForm from "../components/CreateBugForm";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";
import TeamGate from "../components/TeamGate";
import TeamPanel from "../components/TeamPanel";
import { useToast } from "../components/ToastProvider.jsx";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../lib/apiClient";
import { socket } from "../lib/socket";

const VIEW_LABELS = {
  my: "My Bugs",
  team: "Team Bugs",
  assigned: "Assigned to Me",
};

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const hasTeam = Boolean(user?.team);
  const bugsSectionRef = useRef(null);

  useEffect(() => {
    socket.connect();
  
    socket.on("connect", () => {
      console.log("CONNECTED:", socket.id);
  
      if (user?.team) {
        socket.emit("joinTeam", user.team);
  
        console.log("Joined room:", user.team);
      }
    });
  
    return () => {
      socket.disconnect();
    };
  }, [user?.team]);

  useEffect(() => {
    socket.on("bugCreated", (newBug) => {
      console.log("Realtime bug:", newBug);
  
      setBugs((prev) => [newBug, ...prev]);
    });
  
    return () => {
      socket.off("bugCreated");
    };
  }, []);

  useEffect(() => {
    socket.on("bugUpdated", (updatedBug) => {
      console.log("Realtime update:", updatedBug);
  
      setBugs((prev) =>
        prev.map((bug) =>
          bug._id === updatedBug._id ? updatedBug : bug
        )
      );
    });
  
    return () => {
      socket.off("bugUpdated");
    };
  }, []);

  useEffect(() => {
    socket.on("bugDeleted", (deletedBugId) => {
      console.log("Realtime delete:", deletedBugId);
  
      setBugs((prev) =>
        prev.filter((bug) => bug._id !== deletedBugId)
      );
    });
  
    return () => {
      socket.off("bugDeleted");
    };
  }, []);

  // Main data
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("my"); // "my" | "team" | "assigned"
  const [team, setTeam] = useState(null);
  const [bugsError, setBugsError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toast = useToast();

  // Filters
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  // Pagination
  const [page, setPage] = useState(1);

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

  const handleViewChange = (newView) => {
    setView(newView);
    window.setTimeout(() => {
      bugsSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  const sidebarOffset = isSidebarCollapsed ? "lg:ml-20" : "lg:ml-[280px]";

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
    <div className="min-h-screen bg-background">
      {hasTeam && (
        <Sidebar
          currentView={view}
          onViewChange={handleViewChange}
          user={user}
          onLogout={handleLogout}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
      )}

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          hasTeam ? sidebarOffset : ""
        }`}
      >
        <Navbar
          title={hasTeam ? VIEW_LABELS[view] : undefined}
          showLogo={!hasTeam}
        />

        <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-[1600px] w-full mx-auto">
      {/* Welcome */}
      <p className="text-content-secondary mb-6">
        Welcome back, {user?.username}
      </p>

      {/* No-team gate */}
      {!hasTeam ? (
        <div className="mt-4">
          <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-6 mb-6 shadow-2xl">
            <h2 className="text-xl font-semibold text-content-primary mb-2">You're not in a team yet</h2>
            <p className="text-content-secondary text-sm">
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
      <section ref={bugsSectionRef} id="bugs-section" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-content-primary">
            {VIEW_LABELS[view]}
          </h2>
          <span className="text-sm text-content-muted">
            {loading ? "Loading..." : `${bugs.length} bug${bugs.length === 1 ? "" : "s"}`}
          </span>
        </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-surface/50 border border-border rounded-2xl p-5"
            >
              <div className="h-5 w-3/4 mb-3 bg-background-secondary rounded animate-pulse" />
              <div className="h-3 w-full mb-2 bg-background-secondary rounded animate-pulse" />
              <div className="h-3 w-5/6 mb-6 bg-background-secondary rounded animate-pulse" />
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-background-secondary rounded animate-pulse" />
                <div className="h-6 w-20 bg-background-secondary rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : bugsError ? (
        <div className="mt-8" role="alert">
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl">
            {bugsError}
          </div>
        </div>
      ) : bugs.length === 0 ? (
        <p className="text-center text-content-muted mt-10">
          No bugs found
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
      </section>

        </>
      )}
      </div>

      <Footer />
    </div>
    </div>
  );
}

export default Dashboard;