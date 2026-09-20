import { z } from "zod";

/**
 * Token contracts (spec #57: owner-scoped PAT lifecycle, tRPC-only).
 *
 * Personal access tokens are per-caller credentials: every procedure is
 * owner-scoped by the session user id, and the hash plus the plain token
 * never appear in any output. `create` returns the plain token once;
 * `list` shows metadata only; `revoke` is idempotent. Strict objects:
 * unknown fields fail loudly, never strip-drift.
 */

export const createTokenSchema = z.strictObject({
  name: z.string().min(1).max(64),
  scopes: z.array(z.string().min(1)).max(16).optional(),
  expiresAt: z.coerce.date().optional(),
});

export type CreateTokenInput = z.infer<typeof createTokenSchema>;

export const tokenIdSchema = z.strictObject({
  id: z.string().min(1),
});

export type TokenIdInput = z.infer<typeof tokenIdSchema>;

export const tokenRowSchema = z.strictObject({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  scopes: z.array(z.string()),
  expiresAt: z.date().nullable(),
  lastUsedAt: z.date().nullable(),
  createdAt: z.date(),
  revokedAt: z.date().nullable(),
});

export type TokenRow = z.infer<typeof tokenRowSchema>;

export const listTokensOutputSchema = z.strictObject({
  success: z.literal(true),
  data: z.array(tokenRowSchema),
});

export const createTokenOutputSchema = z.strictObject({
  success: z.literal(true),
  data: z.strictObject({
    token: tokenRowSchema,
    plainToken: z.string().min(1),
  }),
});

export const revokeTokenOutputSchema = z.strictObject({
  success: z.literal(true),
  data: tokenRowSchema,
});
