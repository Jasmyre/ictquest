-- Migration 20 - Auth contract final (#43)
-- Breaking cutover: drops the legacy single-role column plus enum after every
-- caller migrated to the explicit Role/UserRoleAssignment contract, then adds
-- the missing per-user indexes. Row counts for User, ProgressData,
-- UserAchievement, and Account are unchanged (column drop only; no table
-- drops or data rewrites). Unrelated legacy migrations still replay.

-- Drop legacy single-role column (all callers now use UserRoleAssignment).
ALTER TABLE "User" DROP COLUMN IF EXISTS "role";

-- Drop legacy enum (Postgres type left over from the initial migration).
DROP TYPE IF EXISTS "UserRole";

-- Missing indexes: per-user reads (progress lists, stats, achievement
-- inventory, OAuth accounts) previously ran without index support.
CREATE INDEX "ProgressData_userId_idx" ON "ProgressData"("userId");

CREATE INDEX "ProgressData_userId_topic_idx" ON "ProgressData"("userId", "topic");

CREATE INDEX "Account_userId_idx" ON "Account"("userId");

CREATE INDEX "UserAchievement_userId_idx" ON "UserAchievement"("userId");

CREATE INDEX "UserAchievement_achievementId_idx" ON "UserAchievement"("achievementId");
