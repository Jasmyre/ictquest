-- Migration 23 - Role membership contract (#60)
-- Cutover to the implicit many-to-many join (`_RoleToUser`): all callers now
-- grant/revoke/list/heal through `User.roles` / `Role.users`. The explicit
-- `UserRoleAssignment` table (with provenance columns `assignedAt` /
-- `assignedBy`) is deleted; the pair copy from #59 already preserved every
-- membership one-to-one, so no data copy happens here.

DROP TABLE IF EXISTS "UserRoleAssignment";
