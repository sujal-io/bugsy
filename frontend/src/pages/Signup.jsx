import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState({ type: "", message: "" });

  const navigate = useNavigate();

  const showToast = (type, message) => {
    setToast({ type, message });

    setTimeout(() => {
      setToast({ type: "", message: "" });
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data.message);
        return;
      }

      showToast("success", "Signup successful!");

      // redirect to login after success
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error) {
      showToast("error", "Something went wrong");
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950 min-h-screen flex items-center justify-center text-white">

      <div className="bg-gray-900 p-8 rounded-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center mb-4">Signup</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="input input-bordered w-full mb-3"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="email"
            placeholder="Email"
            className="input input-bordered w-full mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="input input-bordered w-full mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-full">Signup</button>
        </form>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-orange-400">Login</Link>
        </p>
      </div>

      {/* 🔥 Toast */}
      {toast.message && (
        <div className="toast toast-top toast-end">
          <div className={`alert ${toast.type === "error" ? "alert-error" : "alert-success"}`}>
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default Signup;