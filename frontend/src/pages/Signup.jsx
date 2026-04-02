import { useState } from "react";
import { Link } from "react-router-dom";

function Signup() {
  // States
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message);
        return;
      }

      setError("");
      alert("Signup successful!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen text-white flex items-center justify-center">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
        <Link to="/" className="text-xl font-bold text-orange-500">
          BugTracker
        </Link>

        <Link
          to="/login"
          className="border border-gray-500 px-4 py-2 rounded-md"
        >
          Login
        </Link>
      </header>

      {/* Card */}
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-4">Create Account</h2>

        <p className="text-center text-gray-400 mb-6">
          Start tracking bugs efficiently 🚀
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="text-gray-400">Username</label>
            <input
              type="text"
              placeholder="Enter username"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="text-gray-400">Email</label>
            <input
              type="email"
              placeholder="Enter email"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="text-gray-400">Password</label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-center mb-3">{error}</div>
          )}

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-blue-600 py-3 rounded-md transition"
          >
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;
