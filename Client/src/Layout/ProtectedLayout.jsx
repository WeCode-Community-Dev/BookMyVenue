import React from "react";
import useAuth from "../Auth/useAuth";
import { Navigate, Outlet } from "react-router-dom";

function ProtectedLayout({role}) {
  const { isAuthenticated, isLoading, hasRole } = useAuth();
  if (isLoading) {
    return (
      <div style={style.loader}>
        <div style={style.spinner} />
        <p style={style.loaderText}>Checking session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/signup" replace />;
  }

  if (role && !hasRole(role)) {
    return <Navigate to="/venues" replace />;
  }

  return <Outlet />;
}

const style = {
  loader: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    gap: "12px",
    background: "#f8fafc",
  },
  spinner: {
    width: "36px",
    height: "36px",
    border: "3px solid #e2e8f0",
    borderTop: "3px solid #6366f1",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loaderText: {
    color: "#94a3b8",
    fontSize: "14px",
    fontFamily: "system-ui, sans-serif",
  },
};

const styleTag = document.createElement("style");
styleTag.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(styleTag);

export default ProtectedLayout;
