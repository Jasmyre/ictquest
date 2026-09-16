-- Migration 13 — Post deletion (#36)
-- Drops the example Post table removed from the Prisma schema. The example
-- post router was a verified unused stub; ICTQuest domain tables
-- (User, ProgressData, Achievement, UserAchievement, Role,
-- UserRoleAssignment, PersonalAccessToken, Account) are untouched.

-- DropTable
DROP TABLE IF EXISTS "Post";
