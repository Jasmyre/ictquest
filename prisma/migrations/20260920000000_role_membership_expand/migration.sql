-- Migration 22 - Implicit role membership expand (#59)
-- Additive only: new implicit many-to-many join `_RoleToUser` beside the
-- existing explicit `UserRoleAssignment` table. Existing assignment pairs
-- are copied one-to-one (provenance intentionally dropped on the new join);
-- no drops, no rewrites. Ordered after the profile-fields migration
-- (20260919000000) and before the role-join cutover.

CREATE TABLE IF NOT EXISTS "_RoleToUser" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  CONSTRAINT "_RoleToUser_pkey" PRIMARY KEY ("A", "B")
);

CREATE INDEX IF NOT EXISTS "_RoleToUser_B_idx" ON "_RoleToUser"("B");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = '_RoleToUser_A_fkey'
  ) THEN
    ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_A_fkey"
      FOREIGN KEY ("A") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = '_RoleToUser_B_fkey'
  ) THEN
    ALTER TABLE "_RoleToUser" ADD CONSTRAINT "_RoleToUser_B_fkey"
      FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- One-to-one pair copy: every explicit assignment becomes one implicit
-- membership row. Zero-pair users produce zero rows until heal.
INSERT INTO "_RoleToUser" ("A", "B")
SELECT "UserRoleAssignment"."roleId", "UserRoleAssignment"."userId"
FROM "UserRoleAssignment"
ON CONFLICT DO NOTHING;
