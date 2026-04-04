function BugCard({ bug, deleteBug, updateBug }) {
  const getPriorityColor = (priority) => {
    if (priority === "High") return "bg-orange-400/20 text-orange-300";
    if (priority === "Medium") return "bg-yellow-400/20 text-yellow-300";
    return "bg-green-400/20 text-green-300";
  };

  const getStatusColor = (status) => {
    if (status === "Open") return "bg-blue-400/20 text-blue-300";
    if (status === "In Progress") return "bg-purple-400/20 text-purple-300";
    return "bg-green-400/20 text-green-300";
  };

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-lg hover:shadow-xl transition">
      <h2 className="text-lg font-semibold mb-1">{bug.title}</h2>

      <p className="text-gray-300 text-sm mb-3">
        {bug.description}
      </p>

      <div className="flex justify-between items-center text-sm mb-3">
        <span className={`px-2 py-1 rounded-md ${getStatusColor(bug.status)}`}>
          {bug.status}
        </span>

        <span className={`px-2 py-1 rounded-md ${getPriorityColor(bug.priority)}`}>
          {bug.priority}
        </span>
      </div>

      <div className="relative mb-2">
        <select
          className="w-full p-2 rounded bg-white/5 border border-white/20 
          text-white appearance-none"
          value={bug.status}
          onChange={(e) => updateBug(bug._id, e.target.value)}
        >
          <option className="text-black">Open</option>
          <option className="text-black">In Progress</option>
          <option className="text-black">Fixed</option>
        </select>

        <span className="absolute right-3 top-2 text-gray-300 pointer-events-none text-sm">
          ▼
        </span>
      </div>

      <button
        className="w-full bg-red-500/80 hover:bg-red-600 p-2 rounded transition"
        onClick={() => deleteBug(bug._id)}
      >
        Delete
      </button>
    </div>
  );
}

export default BugCard;