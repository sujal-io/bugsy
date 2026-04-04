import { useEffect, useState } from "react";
import BugCard from "../components/BugCard";
import CreateBugForm from "../components/CreateBugForm";
import FilterBar from "../components/FilterBar";

function Dashboard() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchBugs();
  }, [statusFilter, priorityFilter, search]);

  const fetchBugs = async () => {
    try {
      const token = localStorage.getItem("token");

      // Build query params
      let query = "";

      if (statusFilter) query += `status=${statusFilter}&`;
      if (priorityFilter) query += `priority=${priorityFilter}&`;
      if (search) query += `search=${search}&`;

      const res = await fetch(
        `http://localhost:5000/api/bugs/my?${query}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      setBugs(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  // Create Bug
  const createBug = async (title, description, priority) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/bugs", {
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
      console.error(error);
    }
  };

  // Delete Bug
  const deleteBug = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/bugs/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      fetchBugs();
    } catch (error) {
      console.error(error);
    }
  };

  // Update Status
  const updateBug = async (id, status) => {
    try {
      const token = localStorage.getItem("token");

      await fetch(`http://localhost:5000/api/bugs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      fetchBugs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141e30] to-[#243b55] text-white p-6">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bugs</h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }}
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        priorityFilter={priorityFilter}
        setPriorityFilter={setPriorityFilter}
      />

      {/* Create Bug Form */}
      <CreateBugForm createBug={createBug} />

      {/* Bug List */}
      {loading ? (
        <p>Loading...</p>
      ) : bugs.length === 0 ? (
        <p>No bugs found</p>
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
    </div>
  );
}

export default Dashboard;