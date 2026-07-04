import { useState } from "react";

function CreateBugForm({ createBug, teamMembers = [] }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedTo, setAssignedTo] = useState("");

  const handleSubmit = () => {
    if (!title || !description) return;

    createBug(title, description, priority, assignedTo);

    setTitle("");
    setDescription("");
    setPriority("Low");
    setAssignedTo("");
  };

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
      <h2 className="text-lg sm:text-xl font-semibold text-content-primary mb-4 sm:mb-5">Create Bug</h2>

      <input
        type="text"
        placeholder="Enter bug title..."
        className="w-full p-3 mb-3 rounded-xl bg-background-secondary border border-border 
        focus:outline-none focus:border-primary text-content-primary placeholder:text-content-muted text-sm"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Describe the issue..."
        rows="3"
        className="w-full p-3 mb-3 rounded-xl bg-background-secondary border border-border 
        focus:outline-none focus:border-primary text-content-primary placeholder:text-content-muted text-sm resize-none"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="relative mb-4">
        <select
          className="w-full p-3 rounded-xl bg-background-secondary border border-border 
          text-content-primary appearance-none focus:outline-none focus:border-primary text-sm"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <span className="absolute right-3 top-3 text-content-muted pointer-events-none">
          ▼
        </span>
      </div>

      <div className="relative mb-4">
        <select
          className="w-full p-3 rounded-xl bg-background-secondary border border-border 
          text-content-primary appearance-none focus:outline-none focus:border-primary text-sm"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">
            Assign to someone (optional)
          </option>

          {teamMembers?.map((m) => (
            <option key={m._id} value={m._id}>
              {m.username}
            </option>
          ))}
        </select>

        <span className="absolute right-3 top-3 text-content-muted pointer-events-none">
          ▼
        </span>
      </div>

      <button
        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover 
        hover:from-primary-hover hover:to-primary text-white font-medium shadow-lg shadow-primary/25 transition-all"
        onClick={handleSubmit}
      >
        Add Bug
      </button>
    </div>
  );
}

export default CreateBugForm;