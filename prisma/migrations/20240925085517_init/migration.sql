/*
  Warnings:

  - Changed the type of `durationMin` on the `Schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Schedule" DROP COLUMN "durationMin",
ADD COLUMN     "durationMin" INTEGER NOT NULL;
