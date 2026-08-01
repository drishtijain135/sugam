import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import AuthorityDashboard from "./pages/AuthorityDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RegisterAuthority from "./pages/RegisterAuthority";

function App() {
  return (

    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route
        path="/register-authority"
        element={<RegisterAuthority />}
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute allowedRole="USER">
            <Dashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/authority"
        element={
          <ProtectedRoute allowedRole="AUTHORITY">
            <AuthorityDashboard />
          </ProtectedRoute>
        }
      />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
    </Routes>
  );
}

export default App;