/*
  Warnings:

  - You are about to drop the column `supervising` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "supervising",
ADD COLUMN     "isSupervising" BOOLEAN NOT NULL DEFAULT false;
