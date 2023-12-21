/*
  Warnings:

  - You are about to drop the `machine` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_authorized" DROP CONSTRAINT "_authorized_A_fkey";

-- DropForeignKey
ALTER TABLE "_authorized" DROP CONSTRAINT "_authorized_B_fkey";

-- DropForeignKey
ALTER TABLE "machine" DROP CONSTRAINT "machine_usedById_fkey";

-- DropTable
DROP TABLE "machine";

-- CreateTable
CREATE TABLE "Machine" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "lastSeen" VARCHAR(255),
    "usedById" INTEGER,
    "IP" VARCHAR(255),

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Machine_name_key" ON "Machine"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Machine_usedById_key" ON "Machine"("usedById");

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_usedById_fkey" FOREIGN KEY ("usedById") REFERENCES "Student"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorized" ADD CONSTRAINT "_authorized_A_fkey" FOREIGN KEY ("A") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_authorized" ADD CONSTRAINT "_authorized_B_fkey" FOREIGN KEY ("B") REFERENCES "Student"("id") ON DELETE CASCADE ON UPDATE CASCADE;
