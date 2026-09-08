import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="brand">
        <span className="brand-mark">Campus Voice</span>
        <span className="brand-tag">Student Feedback System</span>
      </div>
      {user && (
        <div className="topbar-user">
          <span>
            {user.name} · {user.role === "admin" ? "Administrator" : "Student"}
          </span>
          <button className="logout-btn" onClick={handleLogout}>
            Log out
          </button>
        </div>
      )}
    </header>
  );
};

export default Navbar;
