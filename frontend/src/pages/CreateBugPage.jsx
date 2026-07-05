import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Bug } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import { apiRequest } from "../lib/apiClient";
import { useToast } from "../components/ToastProvider";
import { socket } from "../lib/socket";

function CreateBugPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const user = JSON.parse(localStorage.getItem("user"));
  const hasTeam = Boolean(user?.team);

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [assignedTo, setAssignedTo] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [team, setTeam] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Socket and team setup
  useEffect(() => {
    if (!hasTeam) return;

    socket.connect();
    socket.on("connect", () => {
      if (user?.team) {
        socket.emit("joinTeam", user.team);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.team, hasTeam]);

  // Fetch team
  useEffect(() => {
    const fetchTeam = async () => {
      try {
        if (!localStorage.getItem("token")) return;
        if (!user?.team) {
          setTeam(null);
          return;
        }
        const data = await apiRequest("/api/team/me");
        setTeam(data?.team || null);
      } catch {
        setTeam(null);
      }
    };

    fetchTeam();
  }, [user?.team]);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      toast.error("Please fill in title and description");
      return;
    }

    try {
      setIsSubmitting(true);
      await apiRequest("/api/bugs", {
        method: "POST",
        body: {
          title: title.trim(),
          description: description.trim(),
          priority,
          assignedTo: assignedTo || undefined,
        },
      });

      toast.success("Bug created successfully!");
      setTitle("");
      setDescription("");
      setPriority("Low");
      setAssignedTo("");

      // Navigate back to overview after brief delay
      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      console.error("Create bug error:", error);
      toast.error(error?.message || "Failed to create bug");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    navigate("/dashboard");
  };

  const sidebarOffset = isSidebarCollapsed ? "lg:ml-20" : "lg:ml-[280px]";

  if (!hasTeam) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar title="Create Bug" showLogo />
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="text-center">
            <p className="text-content-secondary mb-4">
              You need to be in a team to create bugs.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentView="create"
        onViewChange={(view) => {
          if (view !== "create") {
            navigate("/dashboard");
          }
        }}
        user={user}
        onLogout={handleLogout}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${sidebarOffset}`}
      >
        <Navbar title="Create Bug" />

        <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 max-w-[1200px] w-full mx-auto">
          {/* Header with back button */}
          <div className="mb-8">
            <button
              onClick={handleBack}
              className="inline-flex items-center gap-2 text-sm font-medium text-content-secondary hover:text-content-primary mb-6 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </button>

            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-xl bg-primary/20 flex items-center justify-center">
                  <Bug className="h-5 w-5 text-primary" />
                </div>
                <h1 className="text-3xl sm:text-4xl font-bold text-content-primary">
                  Report a New Bug
                </h1>
              </div>
              <p className="text-content-secondary text-sm sm:text-base max-w-2xl">
                Help your team stay organized. Provide clear details about the issue so it can be fixed quickly.
              </p>
            </div>
          </div>

          {/* Main form card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-6 sm:p-8 shadow-lg max-w-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title field */}
              <div>
                <label className="block text-sm font-semibold text-content-primary mb-2">
                  Bug Title
                </label>
                <input
                  type="text"
                  placeholder="Summarize the issue in one sentence..."
                  className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border 
                  focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
                  text-content-primary placeholder:text-content-muted text-sm
                  transition-all duration-200"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-content-muted mt-1.5">
                  Be specific and concise about what's broken
                </p>
              </div>

              {/* Description field */}
              <div>
                <label className="block text-sm font-semibold text-content-primary mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe the issue in detail:
• What did you expect to happen?
• What actually happened?
• Steps to reproduce..."
                  rows="5"
                  className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border 
                  focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
                  text-content-primary placeholder:text-content-muted text-sm resize-none
                  transition-all duration-200"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isSubmitting}
                />
                <p className="text-xs text-content-muted mt-1.5">
                  Include as much detail as possible to help with debugging
                </p>
              </div>

              {/* Priority and Assignment row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Priority field */}
                <div>
                  <label className="block text-sm font-semibold text-content-primary mb-2">
                    Priority
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border 
                      text-content-primary appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
                      text-sm transition-all duration-200"
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                      disabled={isSubmitting}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                    <span className="absolute right-4 top-3.5 text-content-muted pointer-events-none">
                      ▼
                    </span>
                  </div>
                </div>

                {/* Assignment field */}
                <div>
                  <label className="block text-sm font-semibold text-content-primary mb-2">
                    Assign To
                  </label>
                  <div className="relative">
                    <select
                      className="w-full px-4 py-3 rounded-xl bg-background-secondary border border-border 
                      text-content-primary appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50
                      text-sm transition-all duration-200"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      disabled={isSubmitting}
                    >
                      <option value="">Unassigned (optional)</option>
                      {(team?.members || []).map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.username}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-4 top-3.5 text-content-muted pointer-events-none">
                      ▼
                    </span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-primary-hover 
                  hover:from-primary-hover hover:to-primary text-white font-semibold shadow-lg shadow-primary/25 
                  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Bug className="h-5 w-5" />
                      Create Bug
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="px-6 py-3 rounded-xl bg-surface border border-border text-content-primary 
                  hover:bg-surface-hover transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>

          {/* Info box */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="mt-8 bg-primary/5 border border-primary/20 rounded-xl p-4 sm:p-6"
          >
            <h3 className="font-semibold text-content-primary text-sm sm:text-base mb-2">
              Tips for better bug reports:
            </h3>
            <ul className="text-xs sm:text-sm text-content-secondary space-y-1.5">
              <li>✓ Use a clear, descriptive title</li>
              <li>✓ Include steps to reproduce the issue</li>
              <li>✓ Mention expected vs actual behavior</li>
              <li>✓ Assign to the right team member if needed</li>
            </ul>
          </motion.div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default CreateBugPage;
