import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider.jsx";
import { useState } from "react";
import { LogOut } from "lucide-react";

function Navbar({ title, showLogo = false }) {
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    toast.success("Logged out successfully!");

    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-xl">
      <div
        className={`flex items-center justify-between gap-3 py-3 pr-4 sm:pr-6 ${
          showLogo ? "pl-4 sm:pl-6" : "pl-14 lg:pl-6"
        }`}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          {showLogo && (
            <Link to="/dashboard" className="flex items-center gap-2 text-content-primary shrink-0">
              <img
                src="/bugsy logo.png"
                alt="Bugsy"
                className="h-10 w-auto object-contain"
              />
            </Link>
          )}
          {title && (
            <h1 className="text-base sm:text-lg font-semibold text-content-primary truncate x">
              {title}
            </h1>
          )}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loading}
          aria-label={loading ? "Logging out" : "Logout"}
          className="shrink-0 p-2 sm:px-4 sm:py-2 rounded-xl bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-300 transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">
            {loading ? "Logging out..." : "Logout"}
          </span>
        </button>
      </div>
    </header>
  );
}

export default Navbar;
