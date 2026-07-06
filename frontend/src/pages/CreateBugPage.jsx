import { useState, useEffect } from "react";
import { ArrowLeft, Bug, ImagePlus, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import Sidebar from "../components/layout/Sidebar";
import { apiRequest } from "../lib/apiClient";
import { useToast } from "../components/common/ToastProvider";
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
  const [screenshots, setScreenshots] = useState([]);
  const [screenshotPreviews, setScreenshotPreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [team, setTeam] = useState(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Socket and team setup
  useEffect(() => {
  if (!hasTeam || !user?.team) return;

  const handleConnect = () => {
    socket.emit("joinTeam", user.team);
  };

  socket.connect();

  if (socket.connected) {
    handleConnect();
  } else {
    socket.on("connect", handleConnect);
  }

  return () => {
    socket.off("connect", handleConnect);
    socket.disconnect();
  };
}, [hasTeam, user?.team]);

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

  const handleScreenshotSelection = (e) => {
    const files = Array.from(e.target.files || []);
    const validImages = files.filter((file) => file.type.startsWith("image/"));

    if (validImages.length === 0) {
      toast.error("Please select image files only");
      return;
    }

    if (screenshots.length + validImages.length > 5) {
      toast.error("You can upload up to 5 screenshots");
      return;
    }

    const previews = validImages.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
      name: file.name,
    }));

    setScreenshots((prev) => [...prev, ...validImages]);
    setScreenshotPreviews((prev) => [...prev, ...previews]);
    e.target.value = "";
  };

  const handleRemoveScreenshot = (index) => {
    const preview = screenshotPreviews[index];
    if (preview?.previewUrl) {
      URL.revokeObjectURL(preview.previewUrl);
    }

    setScreenshots((prev) => prev.filter((_, i) => i !== index));
    setScreenshotPreviews((prev) => prev.filter((_, i) => i !== index));
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
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("description", description.trim());
      formData.append("priority", priority);
      if (assignedTo) formData.append("assignedTo", assignedTo);
      screenshots.forEach((file) => formData.append("screenshots", file));

      await apiRequest("/api/bugs", {
        method: "POST",
        body: formData,
      });

      toast.success("Bug created successfully!");
      setTitle("");
      setDescription("");
      setPriority("Low");
      setAssignedTo("");
      setScreenshots([]);
      screenshotPreviews.forEach((preview) => {
        if (preview.previewUrl) URL.revokeObjectURL(preview.previewUrl);
      });
      setScreenshotPreviews([]);

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
          <div className="bg-surface/80 backdrop-blur-xl border border-border rounded-2xl p-6 sm:p-8 shadow-lg max-w-2xl">

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

              {/* Screenshots section */}
              <div className="rounded-2xl border border-border bg-background-secondary/40 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-content-primary">
                      Screenshots (Optional)
                    </label>
                    <p className="mt-1 text-xs text-content-muted">
                      PNG, JPG, or JPEG • up to 5 images • 10 MB each
                    </p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-surface px-3 py-2 text-sm font-medium text-content-primary transition-colors hover:bg-surface-hover">
                    <ImagePlus className="h-4 w-4" />
                    Add Images
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleScreenshotSelection}
                      disabled={isSubmitting || screenshots.length >= 5}
                    />
                  </label>
                </div>

                {screenshotPreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {screenshotPreviews.map((preview, index) => (
                      <div key={`${preview.name}-${index}`} className="group relative overflow-hidden rounded-xl border border-border bg-surface">
                        <img
                          src={preview.previewUrl}
                          alt={preview.name}
                          className="h-24 w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveScreenshot(index)}
                          className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white transition-opacity hover:bg-black/80"
                          aria-label={`Remove ${preview.name}`}
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <p className="truncate px-2 py-1.5 text-[11px] text-content-muted">
                          {preview.name}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
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
          </div>

          {/* Info box */}
          <div
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
          </div>
        </div>

        <Footer />
      </div>
    </div>
  );
}

export default CreateBugPage;
