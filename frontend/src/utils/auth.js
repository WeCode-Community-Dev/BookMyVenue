export const getUserRoles = (user) =>
  Array.isArray(user?.roles) ? user.roles : [];

export const resolveEffectiveRoles = (roleOverride, user) => {
  if (Array.isArray(roleOverride)) return roleOverride;
  return getUserRoles(user);
};

export const isUserProvider = (user) =>
  getUserRoles(user).includes("provider");

export const isUserAdmin = (user) =>
  getUserRoles(user).includes("admin");

export const hasProviderRole = (roleOverride, user) =>
  resolveEffectiveRoles(roleOverride, user).includes("provider");

export const hasAdminRole = (roleOverride, user) =>
  resolveEffectiveRoles(roleOverride, user).includes("admin");
