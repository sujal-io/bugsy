import { useState, useEffect } from "react";
import { useToast } from "./ToastProvider.jsx";
import { apiRequest } from "../lib/apiClient";

function BugCard({ bug, deleteBug, updateBug }) {
  const toast = useToast();

  const [solution, setSolution] = useState("");
  const [status, setStatus] = useState(bug.status);

  const [aiResult, setAiResult] = useState("");
  const [showAI, setShowAI] = useState(false); // 👈 NEW
  const [loadingAI, setLoadingAI] = useState(false);

  useEffect(() => {
    setSolution("");
    setStatus(bug.status);
    setAiResult("");
    setShowAI(false); // reset on bug change
  }, [bug._id]);

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

  const handleUpdate = () => {
    updateBug(bug._id, status, status === "Fixed" ? solution : undefined);
    if (status === "Fixed") setSolution("");
  };

  // ✅ AI CALL (with caching behavior)
  const getAISolution = async () => {
    // If already fetched → just show
    if (aiResult) {
      setShowAI(true);
      return;
    }

    setLoadingAI(true);

    try {
      const data = await apiRequest("/api/ai/explain", {
        method: "POST",
        body: {
          title: bug.title,
          description: bug.description,
        },
      });

      if (!data || !data.result) {
        throw new Error("Invalid AI response");
      }

      setAiResult(data.result);
      setShowAI(true);
    } catch (err) {
      toast.error("AI failed");
    } finally {
      setLoadingAI(false);
    }
  };

  // ✅ SAFE FORMATTER
  const formatAI = (text = "") => {
    if (!text) return { cause: "", fixes: [] };

    const [causePart = "", fixPart = ""] = text.split("Fix:");

    return {
      cause: causePart.replace("Cause:", "").trim(),
      fixes: fixPart
        .split("-")
        .map((f) => f.trim())
        .filter(Boolean),
    };
  };

  const formatted = aiResult ? formatAI(aiResult) : null;

  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-5 shadow-lg hover:shadow-xl transition">
      <h2 className="text-lg font-semibold mb-1">{bug.title}</h2>

      <p className="text-gray-300 text-sm mb-3">{bug.description}</p>

      <p className="text-gray-400 text-xs mb-3">
        Created by: {bug.user?.username}
      </p>

      <p className="text-gray-400 text-xs mb-3">
        Fixed by: {bug.updatedBy?.username}
      </p>

      {bug.solution && (
        <p className="text-green-300 text-sm mb-3">
          Solution: {bug.solution}
        </p>
      )}

      <div className="flex justify-between items-center text-sm mb-3">
        <span className={`px-2 py-1 rounded-md ${getStatusColor(status)}`}>
          {status}
        </span>

        <span
          className={`px-2 py-1 rounded-md ${getPriorityColor(bug.priority)}`}
        >
          {bug.priority}
        </span>
      </div>

      <div className="relative mb-2">
        <select
          className="w-full p-2 rounded bg-white/5 border border-white/20 text-white appearance-none"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option className="text-black">Open</option>
          <option className="text-black">In Progress</option>
          <option className="text-black">Fixed</option>
        </select>

        <span className="absolute right-3 top-2 text-gray-300 pointer-events-none text-sm">
          ▼
        </span>
      </div>

      {status === "Fixed" && (
        <textarea
          placeholder="Explain the fix..."
          className="w-full mt-2 p-2 rounded bg-white/5"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
        />
      )}

      {/* Buttons */}
      <div className="flex flex-col gap-3 mt-2">
        <button
          onClick={handleUpdate}
          className="w-full bg-blue-500 p-2 rounded"
        >
          Update
        </button>

        <button
          className="w-full bg-red-500/80 hover:bg-red-600 p-2 rounded transition"
          onClick={() => deleteBug(bug._id)}
        >
          Delete
        </button>

        <button
          disabled={loadingAI}
          className="w-full bg-purple-500 hover:bg-purple-600 p-2 rounded transition disabled:opacity-50"
          onClick={getAISolution}
        >
          {loadingAI
            ? "Thinking..."
            : aiResult
            ? "👁 Show AI Help"
            : "✨ Get AI Help"}
        </button>
      </div>

      {/* AI Result */}
      {formatted && showAI && (
        <div className="mt-3 p-4 bg-white/10 border border-white/20 rounded-lg text-sm relative">
          
          {/* Hide button (does NOT delete data) */}
          <button
            onClick={() => setShowAI(false)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-400"
          >
            ✖
          </button>

          {/* Copy */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(aiResult);
              toast.success("Copied!");
            }}
            className="absolute top-2 right-8 text-gray-400 hover:text-blue-400"
          >
            📋
          </button>

          <p className="text-purple-300 font-semibold mb-3">
            🤖 AI Suggestion
          </p>

          <div className="mb-3">
            <p className="text-blue-300 font-semibold">Cause</p>
            <p className="text-gray-200">{formatted.cause}</p>
          </div>

          <div>
            <p className="text-green-300 font-semibold">Fix</p>
            <ul className="list-disc ml-5 text-gray-200">
              {formatted.fixes.map((fix, i) => (
                <li key={i}>{fix}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default BugCard;
