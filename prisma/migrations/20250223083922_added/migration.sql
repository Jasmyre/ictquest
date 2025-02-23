-- AlterTable
ALTER TABLE "UserAchievement" ADD COLUMN     "achievementDescription" TEXT NOT NULL DEFAULT 'Unknown Achievement',
ADD COLUMN     "achievementName" TEXT NOT NULL DEFAULT 'Unknown Achievement';
