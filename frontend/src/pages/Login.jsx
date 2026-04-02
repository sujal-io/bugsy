import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  // state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate(); // 🔥 for redirect later

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await res.json();

      console.log(data);

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

        <Link to="/signup" className="border border-gray-500 px-4 py-2 rounded-md">
          Signup
        </Link>
      </header>

      {/* Card */}
      <div className="bg-gray-900 p-8 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-4">Welcome Back</h2>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label>Email</label>
            <input
              type="email"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label>Password</label>
            <input
              type="password"
              className="w-full p-3 rounded-md bg-gray-800 border border-gray-700"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button className="w-full bg-orange-500 py-3 rounded-md">
            Login
          </button>

        </form>
      </div>
    </div>
  );
}

export default Login;