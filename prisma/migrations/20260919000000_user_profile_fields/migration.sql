-- Migration 21 - User profile fields (#58)
-- Additive only: nullable biography plus privacy boolean defaulting to
-- public (false). Existing rows backfill to unset (NULL) plus public;
-- no table drops, no data rewrites, ordered after the auth-contract
-- baseline (20260918000000) and before the role-join migration.

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "biography" TEXT;

ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "isPrivate" BOOLEAN NOT NULL DEFAULT false;
