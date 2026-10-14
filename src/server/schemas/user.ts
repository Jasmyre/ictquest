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
 *
 * The limits below are client-safe (this module imports only `zod`), so
 * Client Components import them from here instead of redeclaring the
 * literals per form.
 */
export const DISPLAY_NAME_MIN_LENGTH = 6;
export const DISPLAY_NAME_MAX_LENGTH = 32;
export const BIOGRAPHY_MAX_LENGTH = 500;
export const PASSWORD_MIN_LENGTH = 6;

export const settingsProfileSchema = z.object({
  name: z
    .string()
    .trim()
    .min(DISPLAY_NAME_MIN_LENGTH)
    .max(DISPLAY_NAME_MAX_LENGTH),
  biography: z.string().max(BIOGRAPHY_MAX_LENGTH).nullable().optional(),
  isPrivate: z.boolean().optional(),
});

export const updateEmailSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH),
});

export const setPasswordSchema = z.object({
  newPassword: z.string().min(PASSWORD_MIN_LENGTH),
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
