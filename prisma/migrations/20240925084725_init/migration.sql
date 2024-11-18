/*
  Warnings:

  - You are about to drop the `_GroupToSchedule` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_GroupToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GroupToSchedule" DROP CONSTRAINT "_GroupToSchedule_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToSchedule" DROP CONSTRAINT "_GroupToSchedule_B_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_GroupToUser" DROP CONSTRAINT "_GroupToUser_B_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "birthdate" SET DATA TYPE TEXT,
ALTER COLUMN "photoURL" DROP NOT NULL,
ALTER COLUMN "isActive" SET DEFAULT true;

-- DropTable
DROP TABLE "_GroupToSchedule";

-- DropTable
DROP TABLE "_GroupToUser";

-- CreateTable
CREATE TABLE "_UserGroups" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_GroupSchedules" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserGroups_AB_unique" ON "_UserGroups"("A", "B");

-- CreateIndex
CREATE INDEX "_UserGroups_B_index" ON "_UserGroups"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupSchedules_AB_unique" ON "_GroupSchedules"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupSchedules_B_index" ON "_GroupSchedules"("B");

-- AddForeignKey
ALTER TABLE "_UserGroups" ADD CONSTRAINT "_UserGroups_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserGroups" ADD CONSTRAINT "_UserGroups_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupSchedules" ADD CONSTRAINT "_GroupSchedules_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupSchedules" ADD CONSTRAINT "_GroupSchedules_B_fkey" FOREIGN KEY ("B") REFERENCES "Schedule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
