function TeamPanel({ team }) {
  if (!team) return null;

  const memberCount = Array.isArray(team.members) ? team.members.length : 0;
  const adminName = team.admin?.username || "Admin";

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">{team.name}</h2>
          <p className="text-gray-300 text-sm">
            Admin: {adminName} • Members: {memberCount}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-black/20 border border-white/20 rounded-lg px-3 py-2 font-mono tracking-widest">
            {team.inviteCode}
          </div>
          <button
            type="button"
            className="btn btn-sm"
            onClick={() => navigator.clipboard.writeText(team.inviteCode)}
          >
            Copy
          </button>
        </div>
      </div>

      {Array.isArray(team.members) && team.members.length > 0 && (
        <div className="mt-4">
          <p className="text-gray-300 text-sm mb-2">Members</p>
          <div className="flex flex-wrap gap-2">
            {team.members.map((m) => (
              <span
                key={m._id}
                className="badge badge-outline text-white border-white/30"
              >
                {m.username}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamPanel;

