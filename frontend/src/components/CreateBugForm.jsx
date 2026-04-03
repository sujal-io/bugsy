import { useState } from "react";

function CreateBugForm({ createBug }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");

  const handleSubmit = () => {
    if (!title || !description) return;

    createBug(title, description, priority);

    setTitle("");
    setDescription("");
    setPriority("Low");
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mb-8 shadow-lg">
      <h2 className="text-xl font-semibold mb-5">Create Bug</h2>

      <input
        type="text"
        placeholder="Enter bug title..."
        className="w-full p-3 mb-3 rounded-lg bg-white/5 border border-white/20 
        focus:outline-none focus:ring-2 focus:ring-blue-400"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Describe the issue..."
        rows="3"
        className="w-full p-3 mb-3 rounded-lg bg-white/5 border border-white/20 
        focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="relative mb-4">
        <select
          className="w-full p-3 rounded-lg bg-white/5 border border-white/20 
          text-white appearance-none"
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option className="text-black">Low</option>
          <option className="text-black">Medium</option>
          <option className="text-black">High</option>
        </select>

        <span className="absolute right-3 top-3 text-gray-300 pointer-events-none">
          ▼
        </span>
      </div>

      <button
        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 
        hover:from-blue-600 hover:to-blue-700 transition"
        onClick={handleSubmit}
      >
        Add Bug
      </button>
    </div>
  );
}

export default CreateBugForm;