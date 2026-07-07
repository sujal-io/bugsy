import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateBugPage from "./pages/CreateBugPage";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/common/ProtectedRoute";
import OAuthSuccess from "./pages/OAuthSuccess";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> 
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      {/* Protected dashboard route */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Protected create-bug route */}
      <Route
        path="/dashboard/create-bug"
        element={
          <ProtectedRoute>
            <CreateBugPage />
          </ProtectedRoute>
        }
      />

      {/* Protected profile route */}
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
