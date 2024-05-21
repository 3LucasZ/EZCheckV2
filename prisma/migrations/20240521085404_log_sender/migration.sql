/*
  Warnings:

  - Added the required column `sender` to the `Log` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Log" ADD COLUMN     "sender" VARCHAR(255) NOT NULL;
