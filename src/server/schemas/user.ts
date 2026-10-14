import { z } from "zod";

/**
 * REST output schemas for the session summary (Migration 18, #41).
 *
 * `GET /v1/me` serves the bearer-or-cookie session summary. Passthrough
 * keeps the schema tolerant of Auth.js session additions while still
 * giving OpenAPI a stable contract.
 */
export const meUserSchema = z
  .object({
    id: z.string(),
    name: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    userName: z.string().nullable().optional(),
    roles: z.array(z.string()).optional(),
  })
  .passthrough();

export const meOutputSchema = z.object({
  success: z.literal(true),
  data: meUserSchema,
});

/**
 * Owner-scoped settings contracts (#81).
 *
 * Password strength reuses the auth credential rule (`registerSchema`
 * password: min 6) so settings never accepts a weaker secret than
 * sign-up. Email is normalized (trim + lowercase) in the service;
 * biography follows the profile normalize (trim, empty-to-null, 500 max).
 */
export const settingsProfileSchema = z.object({
  name: z.string().trim().min(6).max(32),
  biography: z.string().max(500).nullable().optional(),
  isPrivate: z.boolean().optional(),
});

export const updateEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6),
});

export const setPasswordSchema = z.object({
  newPassword: z.string().min(6),
});

export const settingsRowSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().nullable(),
  emailVerified: z.date().nullable(),
  image: z.string().nullable(),
  userName: z.string().nullable(),
  biography: z.string().nullable(),
  isPrivate: z.boolean(),
  hasPassword: z.boolean(),
});

export const settingsOutputSchema = z.object({
  success: z.literal(true),
  data: settingsRowSchema,
});
