import { z } from "zod";
import { ROLE_NAMES } from "@/lib/roles";

export const listUsersSchema = z.object({
  skip: z.number().min(0).optional(),
  take: z.number().min(1).max(100).optional(),
});

export const roleNameSchema = z.enum(ROLE_NAMES);

export const grantRoleSchema = z.object({
  userId: z.string().min(1),
  role: roleNameSchema,
});

export const revokeRoleSchema = z.object({
  userId: z.string().min(1),
  role: roleNameSchema,
});

export const grantAchievementSchema = z.object({
  userId: z.string().min(1),
  achievementName: z.string().min(1),
});

export const revokeAchievementSchema = z.object({
  userId: z.string().min(1),
  achievementName: z.string().min(1),
});

export const resetProgressSchema = z.object({
  userId: z.string().min(1),
});

export type ListUsersInput = z.infer<typeof listUsersSchema>;
export type GrantRoleInput = z.infer<typeof grantRoleSchema>;
export type RevokeRoleInput = z.infer<typeof revokeRoleSchema>;
export type GrantAchievementInput = z.infer<typeof grantAchievementSchema>;
export type RevokeAchievementInput = z.infer<typeof revokeAchievementSchema>;
export type ResetProgressInput = z.infer<typeof resetProgressSchema>;
