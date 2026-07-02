import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Shield, Clock, ArrowRight, Layout, Database, Server, Radio, Key, Bot, Code } from "lucide-react";

import { Button } from "../components/ui/Button";
import bugsyLogo from "/bugsy logo.png";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Zap,
      title: "Live Team Collaboration",
      description: "Work together seamlessly with live updates.",
    },
    {
      icon: Radio,
      title: "Instant Sync",
      description: "See changes instantly across your entire team.",
    },
    {
      icon: Bot,
      title: "AI Debug Suggestions",
      description: "Let AI help you identify and resolve bugs faster.",
    },
    {
      icon: Shield,
      title: "Smart Team Permissions",
      description: "Granular access control for every workspace.",
    },
    {
      icon: Clock,
      title: "Complete Bug History",
      description: "Every issue, comment and update in one timeline.",
    },
  ];

  const techStack = [
    { name: "React", icon: Layout },
    { name: "Node.js", icon: Server },
    { name: "MongoDB", icon: Database },
    { name: "Socket.IO", icon: Radio },
    { name: "JWT", icon: Key },
    { name: "OpenRouter", icon: Bot },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* ================= HERO ================= */}

      <div className="flex flex-col lg:flex-row flex-1 min-h-[70vh]">

        {/* LEFT SIDE */}

        <div className="relative overflow-hidden w-full lg:w-1/2 flex flex-col justify-center px-6 py-10 lg:px-20 lg:py-16">

          {/* Background Glow */}

          <div className="absolute top-24 left-20 w-72 h-72 bg-primary/15 rounded-full blur-[140px] pointer-events-none" />

          <div className="absolute bottom-20 right-16 w-56 h-56 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-10">

            {/* Logo */}

            <div className="space-y-5">

              <div className="flex items-center gap-3">

                <img
                  src={bugsyLogo}
                  alt="Bugsy"
                  className="h-10 w-10 object-contain"
                />

                <span className="text-2xl font-bold text-content-primary tracking-tight">
                  Bugsy
                </span>

              </div>

              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">

                  <Zap className="w-3.5 h-3.5" />

                  AI-Powered Bug Tracking

                </span>
              </motion.div>

            </div>

            {/* Heading */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-5"
            >
              <h1 className="tracking-tight leading-none">

                <span className="block text-4xl lg:text-6xl font-bold text-white">
                  Every bug has a story.
                </span>

                <span className="block mt-5 text-2xl lg:text-4xl font-semibold text-slate-300 leading-snug">
                  Track it. Solve it.
                  <span className="text-primary font-bold">
                    {" "}
                    Ship it.
                  </span>
                </span>

              </h1>

              <p className="max-w-lg text-base lg:text-lg leading-relaxed text-content-secondary">
                From bug reports to AI-assisted debugging, Bugsy helps your
                engineering team collaborate in real time, resolve issues
                faster, and ship with confidence.
              </p>

            </motion.div>

            {/* Buttons */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >

              <Button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto justify-center px-8 py-3 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-medium shadow-lg shadow-primary/25"
              >
                Get Started

                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>

              <a
                href="https://github.com/sujal-io"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto"
              >
                <Button
                  variant="secondary"
                  className="w-full sm:w-auto justify-center px-8 py-3 font-medium"
                >
                  <Code className="mr-2 w-4 h-4" />

                  Explore on GitHub
                </Button>
              </a>

            </motion.div>

            {/* Features */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="pt-8"
            >

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                {features.map((feature, index) => (

                  <div
                    key={index}
                    className="flex items-start gap-3"
                  >

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-surface">

                      <feature.icon className="w-5 h-5 text-primary" />

                    </div>

                    <div>

                      <h3 className="text-sm font-semibold text-content-primary">
                        {feature.title}
                      </h3>

                      <p className="mt-1 text-xs leading-relaxed text-content-secondary">
                        {feature.description}
                      </p>

                    </div>

                  </div>

                ))}

              </div>

            </motion.div>

            {/* Tech Stack */}

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="pt-8"
            >

              <div className="flex flex-wrap gap-2">

                {techStack.map((tech, index) => (

                  <div
                    key={index}
                    className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 hover:border-border-strong transition-colors"
                  >

                    <tech.icon className="w-4 h-4 text-content-secondary" />

                    <span className="text-xs font-medium text-content-secondary">
                      {tech.name}
                    </span>

                  </div>

                ))}

              </div>

            </motion.div>

          </div>

        </div>
        {/* ================= RIGHT SIDE ================= */}

        <div className="w-full lg:w-1/2 flex items-start justify-center px-6 py-10 lg:px-12 lg:pt-24 lg:pb-16 relative">

          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-background-secondary/50 pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            whileHover={{ y: -4 }}
            className="relative w-full max-w-md"
          >
            <div className="bg-surface/80 backdrop-blur-xl border border-primary/10 rounded-3xl p-7 lg:p-8 shadow-[0_20px_60px_rgba(99,102,241,0.15)]">

              {/* Badge */}

              <div className="flex justify-center mb-5">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  <Bot className="w-3.5 h-3.5" />
                  AI Powered Workspace
                </span>
              </div>

              {/* Heading */}

              <h2 className="text-2xl font-bold text-center text-content-primary">
                Welcome to Bugsy
              </h2>

              <p className="mt-3 text-center text-content-secondary leading-relaxed">
                Create your workspace in seconds and start tracking bugs with your team.
              </p>

              {/* Buttons */}

              <div className="mt-8 space-y-4">

                <Button
                  className="w-full py-3 bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-medium shadow-lg shadow-primary/25"
                  onClick={() => navigate("/signup")}
                >
                  Get Started

                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>

                <Button
                  variant="secondary"
                  className="w-full py-3 font-medium"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>

              </div>

              {/* Divider */}

              <div className="relative my-7">

                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>

                <div className="relative flex justify-center">
                  <span className="bg-surface px-3 text-xs uppercase tracking-wider text-content-muted">
                    OR
                  </span>
                </div>

              </div>

              {/* Social */}

              <div className="grid grid-cols-2 gap-3">

                <Button
                  variant="secondary"
                  className="py-2.5 font-medium"
                >
                  <Code className="mr-2 w-4 h-4" />
                  GitHub
                </Button>

                <Button
                  variant="secondary"
                  className="py-2.5 font-medium"
                >
                  <Zap className="mr-2 w-4 h-4" />
                  Google
                </Button>

              </div>

              {/* Highlights */}

              <div className="mt-8 pt-6 border-t border-border">

                <div className="grid grid-cols-3 gap-4 text-center">

                  <div>
                    <Bot className="mx-auto mb-2 w-5 h-5 text-primary" />
                    <p className="text-xs text-content-secondary">
                      AI Assisted
                    </p>
                  </div>

                  <div>
                    <Radio className="mx-auto mb-2 w-5 h-5 text-primary" />
                    <p className="text-xs text-content-secondary">
                      Realtime
                    </p>
                  </div>

                  <div>
                    <Shield className="mx-auto mb-2 w-5 h-5 text-primary" />
                    <p className="text-xs text-content-secondary">
                      Secure
                    </p>
                  </div>

                </div>

              </div>

            </div>
          </motion.div>
        </div>
      </div>

      {/* ================= DASHBOARD PREVIEW ================= */}

      <div className="hidden lg:block px-6 lg:px-20 pb-16">

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >

          <div className="relative">

            <div className="absolute -inset-4 bg-gradient-to-r from-primary/20 to-primary/10 rounded-3xl blur-3xl pointer-events-none" />

            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl">

              {/* Browser */}

              <div className="flex items-center gap-2 border-b border-border bg-background-secondary px-4 py-3">

                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/80" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                  <div className="h-3 w-3 rounded-full bg-green-500/80" />
                </div>

                <div className="flex flex-1 justify-center">

                  <div className="rounded-md bg-background px-4 py-1 font-mono text-xs text-content-muted">
                    app.bugsy.io/dashboard
                  </div>

                </div>

              </div>

              {/* Replace this with your screenshot later */}

              <div className="aspect-[21/9] bg-gradient-to-br from-surface to-background-secondary flex items-center justify-center p-10">

                <div className="text-center">

                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">

                    <Layout className="h-10 w-10 text-primary" />

                  </div>

                  <h3 className="mt-6 text-xl font-semibold text-content-primary">
                    Dashboard Preview
                  </h3>

                  <p className="mt-2 text-content-secondary">
                    Replace this section with an actual screenshot of Bugsy.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </motion.div>

      </div>

    </div>
  );
};

export default LandingPage;