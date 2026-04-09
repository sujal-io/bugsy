import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="navbar bg-white/10 backdrop-blur-md border border-white/20 rounded-xl mb-6">
      <div className="flex-1">
        <Link to="/dashboard" className="flex items-center gap-2 text-white">
          <img
              src="/bugsy-logo.png"
              alt="Bugsy"
              className="h-12 w-auto object-contain"
            />
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

