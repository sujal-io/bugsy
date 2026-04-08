import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BugsyLogo from "../components/BugsyLogo";
import { useToast } from "../components/toast.context";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const API_BASE_URL =
        import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch {
      toast.error("Network error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#141e30] to-[#243b55] flex items-center justify-center text-white">

      <div className="flex w-[900px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-lg overflow-hidden">

        {/* Left - Form */}
        <div className="w-full md:w-1/2 p-8">

          <div className="mb-6">
            <BugsyLogo className="h-10 w-10" wordmarkClassName="text-3xl" />
            <p className="text-gray-400 text-sm mt-1">Track bugs. Ship faster.</p>
          </div>

          {/* Heading */}
          <h2 className="text-2xl font-semibold mb-2">Welcome Back</h2>
          <p className="text-gray-300 mb-6">Login to your account</p>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 mb-4 rounded-lg bg-white/5 border border-white/20 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 mb-4 rounded-lg bg-white/5 border border-white/20 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <button
              className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 
              hover:from-blue-600 hover:to-blue-700 transition"
            >
              Sign In
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-300">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-400">
              Sign Up
            </Link>
          </p>
        </div>

        {/* Right - Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-white/5">
          <img
            src="/login.png"
            alt="Login Illustration"
            className="w-full max-w-lg object-contain"
          />
        </div>

      </div>

    </div>
  );
}

export default Login;