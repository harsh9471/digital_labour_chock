-- CreateEnum
CREATE TYPE "complaint_type" AS ENUM ('PAYMENT_DISPUTE', 'HARASSMENT', 'FRAUD', 'SAFETY_VIOLATION', 'CONTRACT_BREACH', 'OTHER');

-- CreateEnum
CREATE TYPE "complaint_status" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateTable
CREATE TABLE "complaints" (
    "id" TEXT NOT NULL,
    "reportedBy" TEXT NOT NULL,
    "reportedAgainst" TEXT,
    "type" "complaint_type" NOT NULL,
    "status" "complaint_status" NOT NULL DEFAULT 'OPEN',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "resolution" TEXT,
    "resolvedBy" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "complaints_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "complaints_reportedBy_idx" ON "complaints"("reportedBy");

-- CreateIndex
CREATE INDEX "complaints_reportedAgainst_idx" ON "complaints"("reportedAgainst");

-- CreateIndex
CREATE INDEX "complaints_status_idx" ON "complaints"("status");

-- CreateIndex
CREATE INDEX "complaints_type_idx" ON "complaints"("type");

-- CreateIndex
CREATE INDEX "complaints_createdAt_idx" ON "complaints"("createdAt");

-- AddForeignKey
ALTER TABLE "complaints" ADD CONSTRAINT "complaints_reportedBy_fkey" FOREIGN KEY ("reportedBy") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
