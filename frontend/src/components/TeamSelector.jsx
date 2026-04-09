import { useState } from "react";

function TeamSelector({ teams, selectedTeam, onTeamSelect, onManageTeams }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!teams || teams.length === 0) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary btn-sm gap-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        {selectedTeam ? selectedTeam.name : "Select Team"}
        <svg className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white/95 backdrop-blur-md border border-white/20 rounded-lg shadow-lg z-50">
          <div className="p-2">
            {teams.map((team) => (
              <button
                key={team._id}
                onClick={() => {
                  onTeamSelect(team);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                  selectedTeam?._id === team._id
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 text-gray-800'
                }`}
              >
                <div className="font-medium">{team.name}</div>
                <div className="text-xs opacity-75">
                  {team.members.length} members
                </div>
              </button>
            ))}
            <div className="border-t border-gray-200 mt-2 pt-2">
              <button
                onClick={() => {
                  onManageTeams();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 text-gray-800 text-sm"
              >
                Manage Teams
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeamSelector;
