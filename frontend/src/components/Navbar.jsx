import { Link, useNavigate } from "react-router-dom";
import { useToast } from "../components/ToastProvider.jsx";
import { useState } from "react";

function Navbar() {
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
    <div className="navbar bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mb-6">
      <div 
      className="flex-1">
        <Link to="/dashboard" className="flex items-center gap-2 text-white">
          <img
            src="/bugsy-logo.png"
            alt="Bugsy"
            className="h-12 w-auto object-contain"
          />
        </Link>
      </div>

      <div className="flex-none">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="btn btn-error btn-sm flex items-center gap-2"
        >
          {loading && (
            <span className="loading loading-spinner loading-xs"></span>
          )}
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;
