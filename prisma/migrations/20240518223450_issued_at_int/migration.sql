/*
  Warnings:

  - The `issuedAt` column on the `MachineCertificate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MachineCertificate" DROP COLUMN "issuedAt",
ADD COLUMN     "issuedAt" INTEGER;
