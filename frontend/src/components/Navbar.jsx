import { Link } from "react-router-dom";
import BugsyLogo from "./BugsyLogo";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="navbar bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mb-6">
      <div className="flex-1">
        <Link to="/dashboard" className="btn btn-ghost text-white">
          <BugsyLogo />
        </Link>
      </div>

      <div className="flex-none">
        <button onClick={handleLogout} className="btn btn-error btn-sm">
          Logout
        </button>
      </div>
    </div>
  );
}

export default Navbar;

