-- DropForeignKey
ALTER TABLE "MachineCertificate" DROP CONSTRAINT "MachineCertificate_issuerId_fkey";

-- AlterTable
ALTER TABLE "MachineCertificate" ALTER COLUMN "issuerId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "MachineCertificate" ADD CONSTRAINT "MachineCertificate_issuerId_fkey" FOREIGN KEY ("issuerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
