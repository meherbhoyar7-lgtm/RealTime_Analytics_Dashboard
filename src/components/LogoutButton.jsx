import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton = React.memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    navigate("/login");
  }, [dispatch, navigate]);

  return (
    <button className="logout-btn" onClick={handleLogout} aria-label="Log out">
      🚪 Log Out
    </button>
  );
});

LogoutButton.displayName = "LogoutButton";
export default LogoutButton;