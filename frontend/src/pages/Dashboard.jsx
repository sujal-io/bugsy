import { useEffect, useState } from "react";

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

  // Priority color logic
  const getPriorityColor = (priority) => {
    if (priority === "High")
      return "bg-orange-400/20 text-orange-300";
    if (priority === "Medium")
      return "bg-yellow-400/20 text-yellow-300";
    return "bg-green-400/20 text-green-300";
  };

  // Status color logic
  const getStatusColor = (status) => {
    if (status === "Open")
      return "bg-blue-400/20 text-blue-300";
    if (status === "In Progress")
      return "bg-purple-400/20 text-purple-300";
    return "bg-green-400/20 text-green-300"; // Closed / Resolved
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141e30] to-[#243b55] text-white p-6">
      <h1 className="text-2xl font-bold mb-6">My Bugs</h1>

      {loading ? (
        <p>Loading...</p>
      ) : bugs.length === 0 ? (
        <p>No bugs found</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {bugs.map((bug) => (
            <div
              key={bug._id}
              className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer"
            >
              <h2 className="text-lg font-semibold mb-1">
                {bug.title}
              </h2>

              <p className="text-gray-300 text-sm mb-3">
                {bug.description}
              </p>

              <div className="flex justify-between items-center text-sm">
                {/* Status */}
                <span
                  className={`px-2 py-1 rounded-md ${getStatusColor(
                    bug.status
                  )}`}
                >
                  {bug.status}
                </span>

                {/* Priority */}
                <span
                  className={`px-2 py-1 rounded-md ${getPriorityColor(
                    bug.priority
                  )}`}
                >
                  {bug.priority}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;