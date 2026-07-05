import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useToast } from "../components/common/ToastProvider.jsx";
import { apiRequest } from "../lib/apiClient";
import bugsyLogo from "/bugsy logo.png";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

import { ArrowRight, Code, Zap } from "lucide-react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const toast = useToast();
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await apiRequest("/api/auth/login", {
        method: "POST",

        auth: false,

        body: { email, password },
      });

      localStorage.setItem("token", data.token);

      localStorage.setItem("user", JSON.stringify(data.user));

      toast.success("Login successful!");

      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      toast.error(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-12 py-6 lg:py-8 overflow-hidden">
      {/* Background */}

      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background-secondary/50 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* ================= LOGO ================= */}

        <div className="mb-5 text-center">
          <div className="flex items-center justify-center gap-3">
            <img
              src={bugsyLogo}
              alt="Bugsy"
              className="h-10 w-10 lg:h-11 lg:w-11 object-contain"
            />

            <h1 className="text-2xl font-bold tracking-tight text-content-primary">
              Bugsy
            </h1>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-content-secondary">
            Every bug has a story.
          </p>
        </div>

        {/* ================= CARD ================= */}

        <div className="rounded-3xl border border-primary/10 bg-surface/80 backdrop-blur-xl p-6 lg:p-7 shadow-[0_20px_60px_rgba(99,102,241,0.18)]">
          {/* Heading */}

          <h2 className="text-2xl font-bold text-center text-content-primary">
            Welcome back 👋
          </h2>

          <p className="mt-2 mb-6 text-center text-content-secondary">
            Continue tracking bugs with your team.
          </p>

          {/* Form */}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-content-primary">
                Email
              </label>

              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12 rounded-xl border-border bg-background-secondary px-4"
              />
            </div>

            {/* Password */}

            <div className="space-y-2">
              <label className="text-sm font-medium text-content-primary">
                Password
              </label>

              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-xl border-border bg-background-secondary px-4"
              />
            </div>

            {/* Submit */}

            <Button
              type="submit"
              loading={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-medium shadow-lg shadow-primary/25"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Divider */}

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>

            <div className="relative flex justify-center">
              <span className="bg-surface px-3 text-xs font-medium tracking-widest text-content-muted">
                OR
              </span>
            </div>
          </div>

          {/* Social Login */}

          <div className="grid grid-cols-2 gap-3">
            <Button variant="secondary" className="py-3 font-medium">
              <Code className="mr-2 h-4 w-4" />
              GitHub
            </Button>

            <Button variant="secondary" className="py-3 font-medium">
              <Zap className="mr-2 h-4 w-4" />
              Google
            </Button>
          </div>
        </div>

        {/* Bottom Link */}

        <p className="mt-6 text-center text-sm text-content-secondary">
          New to Bugsy?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary transition-colors hover:text-primary-hover"
          >
            Create Workspace
          </Link>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
