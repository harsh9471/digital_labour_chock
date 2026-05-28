-- CreateEnum
CREATE TYPE "project_status" AS ENUM ('PLANNING', 'ACTIVE', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "compliance_type" AS ENUM ('LABOR_LICENSE', 'GST_FILING', 'PF_REGISTRATION', 'ESI_REGISTRATION', 'SAFETY_AUDIT', 'SITE_INSPECTION', 'FIRE_NOC', 'BUILDING_PERMIT', 'OTHER');

-- CreateEnum
CREATE TYPE "compliance_status" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'OVERDUE', 'WAIVED');

-- CreateEnum
CREATE TYPE "report_type" AS ENUM ('ATTENDANCE_SUMMARY', 'PAYROLL_REGISTER', 'WORKER_PERFORMANCE', 'COMPLIANCE_SUMMARY', 'SITE_PRODUCTIVITY', 'CUSTOM');

-- CreateTable
CREATE TABLE "projects" (
    "id" TEXT NOT NULL,
    "companyId" TEXT,
    "contractorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT,
    "status" "project_status" NOT NULL DEFAULT 'ACTIVE',
    "budget" DECIMAL(14,2),
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "address" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "totalWorkers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_sites" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "project_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workforce_assignments" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "siteId" TEXT,
    "workerId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "jobId" TEXT,
    "role" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "dailyRate" DECIMAL(10,2),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workforce_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_records" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "contractorId" TEXT NOT NULL,
    "companyId" TEXT,
    "type" "compliance_type" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "compliance_status" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "fileUrl" TEXT,
    "notes" TEXT,
    "issuedBy" TEXT,
    "referenceNo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "compliance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_reports" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "report_type" NOT NULL,
    "fileUrl" TEXT,
    "data" JSONB,
    "periodStart" TIMESTAMP(3),
    "periodEnd" TIMESTAMP(3),
    "createdBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userRole" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT,
    "before" JSONB,
    "after" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "projects_code_key" ON "projects"("code");

-- CreateIndex
CREATE INDEX "projects_contractorId_idx" ON "projects"("contractorId");

-- CreateIndex
CREATE INDEX "projects_companyId_idx" ON "projects"("companyId");

-- CreateIndex
CREATE INDEX "projects_status_idx" ON "projects"("status");

-- CreateIndex
CREATE INDEX "projects_city_idx" ON "projects"("city");

-- CreateIndex
CREATE INDEX "projects_deletedAt_idx" ON "projects"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "project_sites_projectId_siteId_key" ON "project_sites"("projectId", "siteId");

-- CreateIndex
CREATE INDEX "workforce_assignments_projectId_idx" ON "workforce_assignments"("projectId");

-- CreateIndex
CREATE INDEX "workforce_assignments_workerId_idx" ON "workforce_assignments"("workerId");

-- CreateIndex
CREATE INDEX "workforce_assignments_contractorId_idx" ON "workforce_assignments"("contractorId");

-- CreateIndex
CREATE INDEX "workforce_assignments_siteId_idx" ON "workforce_assignments"("siteId");

-- CreateIndex
CREATE INDEX "workforce_assignments_isActive_idx" ON "workforce_assignments"("isActive");

-- CreateIndex
CREATE INDEX "compliance_records_contractorId_idx" ON "compliance_records"("contractorId");

-- CreateIndex
CREATE INDEX "compliance_records_companyId_idx" ON "compliance_records"("companyId");

-- CreateIndex
CREATE INDEX "compliance_records_projectId_idx" ON "compliance_records"("projectId");

-- CreateIndex
CREATE INDEX "compliance_records_status_idx" ON "compliance_records"("status");

-- CreateIndex
CREATE INDEX "compliance_records_type_idx" ON "compliance_records"("type");

-- CreateIndex
CREATE INDEX "compliance_records_dueDate_idx" ON "compliance_records"("dueDate");

-- CreateIndex
CREATE INDEX "compliance_records_deletedAt_idx" ON "compliance_records"("deletedAt");

-- CreateIndex
CREATE INDEX "project_reports_projectId_idx" ON "project_reports"("projectId");

-- CreateIndex
CREATE INDEX "project_reports_contractorId_idx" ON "project_reports"("contractorId");

-- CreateIndex
CREATE INDEX "project_reports_type_idx" ON "project_reports"("type");

-- CreateIndex
CREATE INDEX "audit_logs_userId_idx" ON "audit_logs"("userId");

-- CreateIndex
CREATE INDEX "audit_logs_resourceType_idx" ON "audit_logs"("resourceType");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_sites" ADD CONSTRAINT "project_sites_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_sites" ADD CONSTRAINT "project_sites_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workforce_assignments" ADD CONSTRAINT "workforce_assignments_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workforce_assignments" ADD CONSTRAINT "workforce_assignments_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workforce_assignments" ADD CONSTRAINT "workforce_assignments_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_records" ADD CONSTRAINT "compliance_records_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_records" ADD CONSTRAINT "compliance_records_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_reports" ADD CONSTRAINT "project_reports_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
