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
 * Owner-scoped Settings profile input (ticket #82, spec #81).
 *
 * All fields optional: `undefined` means "leave untouched". `null` on
 * `biography`/`userName` clears the field. Length rules mirror the
 * profile card (32-char identity fields, 500-char biography).
 */
export const updateProfileInputSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  userName: z.string().max(32).nullable().optional(),
  biography: z.string().max(500).nullable().optional(),
  isPrivate: z.boolean().optional(),
});

export const profileOutputSchema = z.object({
  success: z.literal(true),
  data: z.object({
    id: z.string(),
    name: z.string(),
    userName: z.string().nullable(),
    biography: z.string().nullable(),
    isPrivate: z.boolean(),
  }),
});
