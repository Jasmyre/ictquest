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
