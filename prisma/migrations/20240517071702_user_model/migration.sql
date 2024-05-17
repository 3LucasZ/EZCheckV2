/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Student` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[PIN]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_usedById_fkey";

-- DropForeignKey
ALTER TABLE "_authorized" DROP CONSTRAINT "_authorized_B_fkey";

-- AlterTable
ALTER TABLE "Machine" ALTER COLUMN "usedById" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "PIN" VARCHAR(255),
ADD COLUMN     "supervising" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "_authorized" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- DropTable
DROP TABLE "Admin";

-- DropTable
DROP TABLE "Student";

-- CreateIndex
CREATE UNIQUE INDEX "User_PIN_key" ON "User"("PIN");

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorized" ADD CONSTRAINT "_authorized_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
