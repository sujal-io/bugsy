import { useEffect, useState } from "react";
import BugCard from "../components/BugCard";
import CreateBugForm from "../components/CreateBugForm";
import FilterBar from "../components/FilterBar";
import Pagination from "../components/Pagination";

function Dashboard() {
  // Main data
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

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
  const fetchBugs = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        handleLogout();
        return;
      }

      let query = "";

      if (statusFilter) query += `status=${statusFilter}&`;
      if (priorityFilter) query += `priority=${priorityFilter}&`;
      if (search) query += `search=${search}&`;

      query += `page=${page}&limit=6`;

      const API_BASE_URL =
        import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await fetch(
        `${API_BASE_URL}/api/bugs/my?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Handle unauthorized
      if (res.status === 401) {
        handleLogout();
        return;
      }

      const data = await res.json();

      console.log("API DATA:", data); // Debug

      // Ensure array (API currently returns an array, but allow { bugs: [] } too)
      const nextBugs = Array.isArray(data) ? data : data?.bugs;
      setBugs(Array.isArray(nextBugs) ? nextBugs : []);
      setLoading(false);
    } catch (error) {
      console.error("Fetch bugs error:", error);
      setBugs([]);
      setLoading(false);
    }
  };

  // Fetch on change
  useEffect(() => {
    fetchBugs();
  }, [statusFilter, priorityFilter, search, page]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, search]);

  // Create Bug
  const createBug = async (title, description, priority) => {
    try {
      const token = localStorage.getItem("token");

      const API_BASE_URL =
        import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${API_BASE_URL}/api/bugs`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, priority }),
      });

      if (!res.ok) return;

      fetchBugs();
    } catch (error) {
      console.error("Create bug error:", error);
    }
  };

  // Delete Bug
  const deleteBug = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const API_BASE_URL =
        import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${API_BASE_URL}/api/bugs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Delete failed");
      }

      fetchBugs();
    } catch (error) {
      console.error("Delete bug error:", error);
      alert(error?.message || "Delete failed");
    }
  };

  // Update Bug
  const updateBug = async (id, status, solution) => {
    try {
      const token = localStorage.getItem("token");

      const API_BASE_URL =
        import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${API_BASE_URL}/api/bugs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status, solution }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.message || "Update failed");
      }

      fetchBugs();
    } catch (error) {
      console.error("Update bug error:", error);
      alert(error?.message || "Update failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141e30] to-[#243b55] text-white p-6">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Bugs</h1>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {/* Welcome */}
      <p className="text-gray-300 mb-6">
        Welcome back, {user?.username}
      </p>

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
        <p>Loading...</p>
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
      <Pagination page={page} setPage={setPage} />

    </div>
  );
}

export default Dashboard;