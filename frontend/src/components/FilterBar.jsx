function FilterBar({
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  priorityFilter,
  setPriorityFilter,
}) {
  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setPriorityFilter("");
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-4 mb-6 flex flex-col md:flex-row gap-4 items-center">

      {/* Search */}
      <input
        type="text"
        placeholder="Search bugs..."
        className="w-full md:w-1/3 p-2 rounded bg-white/5 border border-white/20 
        focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Status */}
      <select
        className="w-full md:w-1/4 p-2 rounded bg-white/5 border border-white/20 
        text-white appearance-none"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option className="text-black" value="">All Status</option>
        <option className="text-black" value="Open">Open</option>
        <option className="text-black" value="In Progress">In Progress</option>
        <option className="text-black" value="Fixed">Fixed</option>
      </select>

      {/* Priority */}
      <select
        className="w-full md:w-1/4 p-2 rounded bg-white/5 border border-white/20 
        text-white appearance-none"
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
      >
        <option className="text-black" value="">All Priority</option>
        <option className="text-black" value="Low">Low</option>
        <option className="text-black" value="Medium">Medium</option>
        <option className="text-black" value="High">High</option>
      </select>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="px-4 py-2 rounded-lg border border-white/20 bg-white/5 
        hover:bg-white/10 transition text-sm"
      >
        Reset
      </button>
    </div>
  );
}

export default FilterBar;