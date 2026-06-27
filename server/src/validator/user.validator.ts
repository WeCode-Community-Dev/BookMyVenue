import { z } from "zod";
import { RoleEnum } from "../enums/user-enum";

export const updateUserRoleSchema = z.object({
  role: z.enum(Object.values(RoleEnum) as [string, ...string[]], {
    message: "role is invalid",
  }),
});

export type UpdateUserRoleInput = z.infer<typeof updateUserRoleSchema>;
