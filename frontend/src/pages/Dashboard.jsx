import { useEffect, useState } from "react";
import BugCard from "../components/BugCard";
import CreateBugForm from "../components/CreateBugForm";

function Dashboard() {
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBugs();
  }, []);

  const fetchBugs = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch("http://localhost:5000/api/bugs/my", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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
      <h1 className="text-2xl font-bold mb-6">My Bugs</h1>

      {/* Form */}
      <CreateBugForm createBug={createBug} />

      {/* List */}
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