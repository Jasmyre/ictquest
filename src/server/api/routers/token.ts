import {
  createTRPCRouter,
  permissionProcedure,
  requireUserId,
} from "@/server/api/trpc";
import {
  createTokenOutputSchema,
  createTokenSchema,
  listTokensOutputSchema,
  revokeTokenOutputSchema,
  tokenIdSchema,
} from "@/server/schemas/token";
import { createToken, listTokens, revokeToken } from "@/server/services/token";

/**
 * Token router (spec #57: owner-scoped PAT lifecycle, tRPC-only).
 *
 * Personal access tokens grant exactly the holder's own access, so every
 * procedure scopes by the session user id — never by caller input. `list`
 * shows metadata only (hashes never leave the server), `create` returns
 * the plain token once, and `revoke` is idempotent: revoking twice is
 * safe, while foreign or missing ids answer FORBIDDEN (anti-probing).
 *
 * Deliberately tRPC-only: no OpenAPI annotations, so nothing here is
 * served on the versioned REST mount.
 */
export const tokenRouter = createTRPCRouter({
  list: permissionProcedure("Token", "view")
    .output(listTokensOutputSchema)
    .query(({ ctx }) => listTokens(ctx.db, requireUserId(ctx.user))),

  create: permissionProcedure("Token", "create")
    .input(createTokenSchema)
    .output(createTokenOutputSchema)
    .mutation(({ ctx, input }) =>
      createToken(ctx.db, requireUserId(ctx.user), input)
    ),

  revoke: permissionProcedure("Token", "delete")
    .input(tokenIdSchema)
    .output(revokeTokenOutputSchema)
    .mutation(({ ctx, input }) =>
      revokeToken(ctx.db, requireUserId(ctx.user), input)
    ),
});
