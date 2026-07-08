import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Code } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { SiSocketdotio } from "react-icons/si";
import { BsClockHistory } from "react-icons/bs";
import {
  HiOutlineUserGroup,
  HiOutlineChatBubbleLeftRight,
  HiOutlinePaperClip,
} from "react-icons/hi2";

import { PiBugBeetleBold } from "react-icons/pi";
import { RiRobot2Line } from "react-icons/ri";
import { TbActivityHeartbeat } from "react-icons/tb";
import { Button } from "../components/ui/Button";
import Footer from "../components/layout/Footer";
import bugsyLogo from "/bugsy logo.png";
import { getApiBaseUrl } from "../lib/apiClient";

const LandingPage = () => {
  const navigate = useNavigate();

  const featureCards = [
    {
      icon: PiBugBeetleBold,

      title: "Smart Bug Tracking",

      description:
        "Create, organize and monitor bugs with priorities, statuses and assignments.",

      color: "danger",
    },

    {
      icon: HiOutlineUserGroup,

      title: "Team Collaboration",

      description:
        "Work together in shared workspaces with role-based access and team management.",

      color: "primary",
    },

    {
      icon: RiRobot2Line,

      title: "AI Bug Suggestions",

      description:
        "Generate debugging suggestions instantly to speed up issue resolution.",

      color: "cyan",
    },

    {
      icon: TbActivityHeartbeat,

      title: "Live Updates",

      description:
        "Socket.IO keeps every team member synchronized in real time.",

      color: "success",
    },

    {
      icon: HiOutlineChatBubbleLeftRight,

      title: "Discussions & Timeline",

      description: "Track conversations and every activity performed on a bug.",

      color: "warning",
    },

    {
      icon: HiOutlinePaperClip,

      title: "Attachments",

      description:
        "Upload screenshots and files through Cloudinary for better reporting.",

      color: "slate",
    },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* HERO  */}

      <div className="flex flex-col lg:flex-row min-h-[50vh]">
        {/* LEFT SIDE */}

        <div className="relative overflow-hidden w-full lg:w-1/2 flex flex-col justify-center px-6 py-10 lg:px-20 lg:py-16">
          {/* Background Glow - Subtle */}

          <div className="absolute top-24 left-20 w-72 h-72 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="relative z-10 max-w-xl space-y-8">
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
            </div>

            {/* Heading */}

            <div className="space-y-5">
              <h1 className="tracking-tight">
                <span className="block text-4xl lg:text-5xl font-bold text-content-primary leading-[1.1]">
                  Track Bugs.
                </span>

                <span className="block mt-2 text-4xl lg:text-5xl font-bold text-primary leading-[1.1]">
                  Ship Better.
                </span>
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-8 text-content-secondary">
                Bugsy helps engineering teams report, discuss and resolve bugs
                faster using real-time collaboration and AI-powered suggestions.
              </p>
            </div>

            {/* Buttons */}

            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={() => navigate("/signup")}
                className="w-full sm:w-auto justify-center px-8 py-3 bg-primary hover:bg-primary-hover text-white font-medium transition-colors duration-200"
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
            </div>
          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}

        <div className="w-full lg:w-1/2 flex items-start justify-center px-6 py-10 lg:px-12 lg:pt-24 lg:pb-16 relative">
          <div className="relative w-full max-w-sm">
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-lg">
              {/* Heading */}

              <h2 className="text-xl font-semibold text-center text-content-primary">
                Start Tracking Bugs
              </h2>

              <p className="mt-3 text-center text-content-secondary leading-relaxed">
                Sign in or continue with Google to access your workspace.
              </p>

              {/* Buttons */}

              <div className="mt-6 space-y-3">
                <Button
                  className="w-full py-3 bg-primary hover:bg-primary-hover text-white font-medium transition-colors duration-200"
                  onClick={() => navigate("/login")}
                >
                  Sign In
                </Button>
              </div>

              {/* Divider */}

              <div className="relative my-6">
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

              <div className="flex justify-center">
                <Button
                  onClick={() => {
                    window.location.href = `${getApiBaseUrl()}/api/oauth/google`;
                  }}
                  variant="secondary"
                  className="w-full max-w-xs flex items-center justify-center gap-3 py-3 font-medium"
                >
                  <FcGoogle className="text-xl" />
                  Continue with Google
                </Button>
              </div>

              {/* Highlights */}

              <div className="mt-6 pt-6 border-t border-border">
                <div className="grid grid-cols-3 gap-4">
                  <div className="flex flex-col items-center gap-2">
                    <FcGoogle className="text-xl" />

                    <span className="text-xs font-medium text-content-secondary">
                      Google OAuth
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <SiSocketdotio className="text-[18px] text-primary" />

                    <span className="text-xs font-medium text-content-secondary">
                      Socket.IO
                    </span>
                  </div>

                  <div className="flex flex-col items-center gap-2">
                    <BsClockHistory className="text-lg text-primary" />

                    <span className="text-xs font-medium text-content-secondary">
                      Timeline
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DASHBOARD PREVIEW ================= */}

      <div className="hidden lg:block max-w-6xl mx-auto px-6 lg:px-8 mt-2 pb-16">
        <div>
          <div className="relative z-20">
            <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
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

              <div className="overflow-hidden bg-background-secondary">
                <img
                  src="/dashboard.png"
                  alt="Bugsy Dashboard"
                  className="w-full object-cover"
                  draggable={false}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= FEATURES ================= */}

      <section className="px-6 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center rounded-full border border-border bg-surface px-4 py-1.5 text-sm font-medium text-content-secondary">
              Everything Your Team Needs
            </span>

            <h2 className="mt-5 text-3xl lg:text-4xl font-bold text-content-primary">
              Built for Modern Engineering Teams
            </h2>

            <p className="mt-5 max-w-2xl mx-auto text-lg text-content-secondary">
              Bugsy combines collaboration, AI assistance and real-time
              communication into one powerful bug tracking platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {featureCards.map((feature, index) => {
              const getColorClasses = (color) => {
                const colorMap = {
                  danger: {
                    bg: "bg-danger/10",

                    border: "border-danger/20",

                    text: "text-danger",
                  },

                  primary: {
                    bg: "bg-primary/10",

                    border: "border-primary/20",

                    text: "text-primary",
                  },

                  cyan: {
                    bg: "bg-cyan/10",

                    border: "border-cyan/20",

                    text: "text-cyan",
                  },

                  success: {
                    bg: "bg-success/10",

                    border: "border-success/20",

                    text: "text-success",
                  },

                  warning: {
                    bg: "bg-warning/10",

                    border: "border-warning/20",

                    text: "text-warning",
                  },

                  slate: {
                    bg: "bg-slate/10",

                    border: "border-slate/20",

                    text: "text-slate",
                  },
                };

                return colorMap[color] || colorMap.primary;
              };

              const colorClasses = getColorClasses(feature.color);

              return (
                <div
                  key={index}
                  className="group rounded-xl border border-border bg-surface p-6 transition-all duration-200 hover:-translate-y-1 hover:border-border-strong"
                >
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border ${colorClasses.bg} ${colorClasses.border}`}
                  >
                    <feature.icon className={`text-xl ${colorClasses.text}`} />
                  </div>

                  <h3 className="mt-5 text-lg font-semibold text-content-primary">
                    {feature.title}
                  </h3>

                  <p className="mt-2 leading-relaxed text-content-secondary">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}

      <Footer />
    </div>
  );
};

export default LandingPage;
