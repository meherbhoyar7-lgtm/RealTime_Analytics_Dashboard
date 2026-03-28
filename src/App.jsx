import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import Layout from "./layout/Layout";
import Overview from "./pages/Overview";
import Performance from "./pages/Performance";
import Errors from "./pages/Errors";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TeamMembers from "./pages/TeamMembers";
import Analytics from "./pages/Analytics";
import SystemHealth from "./pages/SystemHealth";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "light") {
      document.body.classList.add("light");
      setDarkMode(false);
    } else {
      document.body.classList.remove("light");
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.body.classList.remove("light");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.add("light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <Layout darkMode={darkMode} setDarkMode={setDarkMode} />
          </ProtectedRoute>
        }
      >
        <Route index element={<Overview />} />
        <Route path="performance" element={<Performance />} />
        <Route path="errors" element={<Errors />} />
        <Route path="activity" element={<ActivityLog />} />
        <Route path="team" element={<TeamMembers />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="health" element={<SystemHealth />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route
        path="*"
        element={
          localStorage.getItem("isAuthenticated") === "true" ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;