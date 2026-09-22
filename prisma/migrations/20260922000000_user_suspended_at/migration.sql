-- Migration 24 - Suspended capability with preserved roles (#72)
-- Adds `User.suspendedAt`: a nullable suspension timestamp set and cleared
-- only by admins. Roles underneath are preserved untouched, so unsuspend
-- restores exactly what the user had. Suspension never creates a Role-less
-- user; it is the approved disable mechanism per ADR-0001 (extended by #68).

ALTER TABLE "User" ADD COLUMN "suspendedAt" TIMESTAMP(3);
