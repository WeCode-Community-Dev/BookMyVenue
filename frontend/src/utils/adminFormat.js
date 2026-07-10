export const formatStatusLabel = (status) =>
  status ? status.charAt(0).toUpperCase() + status.slice(1) : "—";

export const formatRoleLabel = (role) =>
  role ? role.charAt(0).toUpperCase() + role.slice(1) : "—";

export const formatRoles = (roles = []) =>
  roles.map(formatRoleLabel).join(", ");
