import React from "react";
import useAuth from "../Auth/useAuth";

function RoleBasedRoute({ adminComponent, organizerComponent }) {
  const { user } = useAuth();

  if (user.role === "admin") return adminComponent;
  if (user.role === "organizer") return organizerComponent;
}

export default RoleBasedRoute;
