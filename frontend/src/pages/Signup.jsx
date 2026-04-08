import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import BugsyLogo from "../components/BugsyLogo";
import { useToast } from "../components/toast.context";
import { apiRequest } from "../lib/apiClient";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const toast = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiRequest("/api/auth/register", {
        method: "POST",
        auth: false,
        body: { username, email, password },
      });

      toast.success("Signup successful!");

      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
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
          <h2 className="text-2xl font-semibold mb-2">Create Account</h2>
          <p className="text-gray-300 mb-6">Sign up to get started</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              className="w-full p-3 mb-4 rounded-lg bg-white/5 border border-white/20 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />

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
              Sign Up
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-gray-300">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400">
              Login
            </Link>
          </p>
        </div>

        {/* Right - Image */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-white/5">
          <img
            src="/signup.png"
            alt="Signup Illustration"
            className="w-full max-w-lg object-contain"
          />
        </div>

      </div>

    </div>
  );
}

export default Signup;