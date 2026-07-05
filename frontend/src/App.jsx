import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import CreateBugPage from "./pages/CreateBugPage";
import ProtectedRoute from "./components/common/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} /> 
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* protected route for dashboard */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* protected route for create bug page */}
      <Route
        path="/dashboard/create-bug"
        element={
          <ProtectedRoute>
            <CreateBugPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
