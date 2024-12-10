/*
  Warnings:

  - The `date` column on the `Schedule` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `type` on the `Schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `activity` on the `Schedule` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `fathername` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `birthdate` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Type" AS ENUM ('permanent', 'concert', 'additional');

-- CreateEnum
CREATE TYPE "Activity" AS ENUM ('vocal', 'choreo');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('student', 'teacher', 'admin');

-- AlterTable
ALTER TABLE "Schedule" ADD COLUMN     "day" TEXT,
DROP COLUMN "type",
ADD COLUMN     "type" "Type" NOT NULL,
DROP COLUMN "date",
ADD COLUMN     "date" TIMESTAMP(3),
DROP COLUMN "activity",
ADD COLUMN     "activity" "Activity" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "fathername" TEXT NOT NULL,
ADD COLUMN     "school" TEXT,
DROP COLUMN "birthdate",
ADD COLUMN     "birthdate" TIMESTAMP(3) NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL;

-- CreateTable
CREATE TABLE "Song" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "theme" TEXT NOT NULL,

    CONSTRAINT "Song_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_GroupSongs" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Song_name_key" ON "Song"("name");

-- CreateIndex
CREATE UNIQUE INDEX "_GroupSongs_AB_unique" ON "_GroupSongs"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupSongs_B_index" ON "_GroupSongs"("B");

-- AddForeignKey
ALTER TABLE "_GroupSongs" ADD CONSTRAINT "_GroupSongs_A_fkey" FOREIGN KEY ("A") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GroupSongs" ADD CONSTRAINT "_GroupSongs_B_fkey" FOREIGN KEY ("B") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
