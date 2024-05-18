/*
  Warnings:

  - You are about to drop the `_authorized` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_authorized" DROP CONSTRAINT "_authorized_A_fkey";

-- DropForeignKey
ALTER TABLE "_authorized" DROP CONSTRAINT "_authorized_B_fkey";

-- DropTable
DROP TABLE "_authorized";

-- CreateTable
CREATE TABLE "MachineCertificate" (
    "machineId" INTEGER NOT NULL,
    "recipientId" TEXT NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "issuerId" TEXT NOT NULL,

    CONSTRAINT "MachineCertificate_pkey" PRIMARY KEY ("machineId","recipientId")
);

-- AddForeignKey
ALTER TABLE "MachineCertificate" ADD CONSTRAINT "MachineCertificate_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineCertificate" ADD CONSTRAINT "MachineCertificate_recipientId_fkey" FOREIGN KEY ("recipientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MachineCertificate" ADD CONSTRAINT "MachineCertificate_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
