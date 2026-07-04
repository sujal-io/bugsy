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
    <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-4 mb-6 flex flex-col sm:flex-row gap-3 sm:gap-4 items-center shadow-lg">

      {/* Search */}
      <input
        type="text"
        placeholder="Search bugs..."
        className="w-full sm:w-1/3 p-3 rounded-xl bg-background-secondary border border-border 
        focus:outline-none focus:border-primary text-content-primary placeholder:text-content-muted text-sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Status */}
      <select
        className="w-full sm:w-1/4 p-3 rounded-xl bg-background-secondary border border-border 
        text-content-primary appearance-none focus:outline-none focus:border-primary text-sm"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Open">Open</option>
        <option value="In Progress">In Progress</option>
        <option value="Fixed">Fixed</option>
      </select>

      {/* Priority */}
      <select
        className="w-full sm:w-1/4 p-3 rounded-xl bg-background-secondary border border-border 
        text-content-primary appearance-none focus:outline-none focus:border-primary text-sm"
        value={priorityFilter}
        onChange={(e) => setPriorityFilter(e.target.value)}
      >
        <option value="">All Priority</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      {/* Reset Button */}
      <button
        onClick={handleReset}
        className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border bg-background-secondary 
        hover:bg-white/[0.04] text-content-primary transition-colors text-sm font-medium"
      >
        Reset
      </button>
    </div>
  );
}

export default FilterBar;