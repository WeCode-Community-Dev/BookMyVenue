export const RoleEnum = {
  OWNER: "OWNER",
  ADMIN: "ADMIN",
  CUSTOMER: "CUSTOMER",
};

export type RoleEnumType = (typeof RoleEnum)[keyof typeof RoleEnum];
