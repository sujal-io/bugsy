import { Navigate } from "react-router-dom";

function ProtectedRoute({ children }) {
  // get token from localStorage
  const token = localStorage.getItem("token");

  // if no token → redirect to login
  if (!token) {
    return <Navigate to="/login" />;
  }

  // ✅ if token exists → allow access
  return children;
}

export default ProtectedRoute;