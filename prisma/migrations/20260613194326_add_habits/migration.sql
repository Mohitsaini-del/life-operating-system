/*
  Warnings:

  - You are about to drop the column `title` on the `Habit` table. All the data in the column will be lost.
  - Added the required column `name` to the `Habit` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Habit" DROP COLUMN "title",
ADD COLUMN     "completedToday" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "lastCompleted" TIMESTAMP(3),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "streak" INTEGER NOT NULL DEFAULT 0;
