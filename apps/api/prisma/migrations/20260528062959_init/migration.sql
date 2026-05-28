-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('WORKER', 'CONTRACTOR', 'COMPANY_ADMIN', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "user_status" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_VERIFICATION', 'BANNED');

-- CreateEnum
CREATE TYPE "gender" AS ENUM ('MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY');

-- CreateEnum
CREATE TYPE "document_type" AS ENUM ('AADHAR', 'PAN', 'DRIVING_LICENSE', 'PASSPORT', 'VOTER_ID', 'WORK_PERMIT', 'SKILL_CERTIFICATE', 'EDUCATION_CERTIFICATE', 'OTHER');

-- CreateEnum
CREATE TYPE "document_status" AS ENUM ('PENDING', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "skill_level" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');

-- CreateEnum
CREATE TYPE "otp_purpose" AS ENUM ('LOGIN', 'REGISTER', 'PASSWORD_RESET', 'EMAIL_VERIFY', 'PHONE_VERIFY');

-- CreateEnum
CREATE TYPE "job_status" AS ENUM ('DRAFT', 'PUBLISHED', 'ACTIVE', 'FILLED', 'COMPLETED', 'CLOSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "job_type" AS ENUM ('DAILY', 'WEEKLY', 'MONTHLY', 'CONTRACT', 'FIXED_TERM');

-- CreateEnum
CREATE TYPE "application_status" AS ENUM ('SUBMITTED', 'VIEWED', 'SHORTLISTED', 'HIRED', 'REJECTED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "attendance_method" AS ENUM ('GPS', 'QR', 'MANUAL');

-- CreateEnum
CREATE TYPE "payroll_status" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PROCESSING', 'PAID', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "notification_type" AS ENUM ('JOB_APPLICATION', 'APPLICATION_UPDATE', 'ATTENDANCE_CHECKIN', 'PAYROLL_PROCESSED', 'KYC_UPDATE', 'GENERAL');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "passwordHash" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "role" "user_role" NOT NULL,
    "status" "user_status" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "avatar" TEXT,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "loginCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workers" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "bio" TEXT,
    "dateOfBirth" TIMESTAMP(3),
    "gender" "gender",
    "languages" TEXT[],
    "availableForWork" BOOLEAN NOT NULL DEFAULT true,
    "hourlyRate" DECIMAL(10,2),
    "dailyRate" DECIMAL(10,2),
    "weeklyRate" DECIMAL(10,2),
    "experienceYears" INTEGER NOT NULL DEFAULT 0,
    "locationId" TEXT,
    "city" TEXT,
    "state" TEXT,
    "pincode" TEXT,
    "aadhaarLastFour" TEXT,
    "panNumber" TEXT,
    "upiId" TEXT,
    "bankAccountNumber" TEXT,
    "bankIfsc" TEXT,
    "fcmToken" TEXT,
    "rating" DECIMAL(3,2),
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "totalJobsDone" INTEGER NOT NULL DEFAULT 0,
    "isProfileComplete" BOOLEAN NOT NULL DEFAULT false,
    "profileViews" INTEGER NOT NULL DEFAULT 0,
    "kycStatus" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "workers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contractors" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT,
    "bio" TEXT,
    "specializations" TEXT[],
    "licenseNumber" TEXT,
    "licenseExpiry" TIMESTAMP(3),
    "gstin" TEXT,
    "rating" DECIMAL(3,2),
    "totalRatings" INTEGER NOT NULL DEFAULT 0,
    "totalProjectsDone" INTEGER NOT NULL DEFAULT 0,
    "locationId" TEXT,
    "city" TEXT,
    "state" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "contractors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "companies" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "registrationNo" TEXT,
    "gstNumber" TEXT,
    "panNumber" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "coverUrl" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verifiedAt" TIMESTAMP(3),
    "employeeCount" INTEGER,
    "establishedYear" INTEGER,
    "locationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "companies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "isSuperAdmin" BOOLEAN NOT NULL DEFAULT false,
    "department" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_permissions" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "deviceId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "document_type" NOT NULL,
    "documentNumber" TEXT,
    "fileUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "status" "document_status" NOT NULL DEFAULT 'PENDING',
    "verifiedAt" TIMESTAMP(3),
    "verifiedBy" TEXT,
    "rejectionReason" TEXT,
    "expiryDate" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locations" (
    "id" TEXT NOT NULL,
    "address" TEXT,
    "landmark" TEXT,
    "area" TEXT,
    "city" TEXT NOT NULL,
    "district" TEXT,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "pincode" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skills" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_skills" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "level" "skill_level" NOT NULL DEFAULT 'BEGINNER',
    "yearsOfExperience" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "worker_skills_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_experiences" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "city" TEXT,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worker_experiences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "worker_ratings" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "rating" DECIMAL(3,2) NOT NULL,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "worker_ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_jobs" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_codes" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "identifier" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "purpose" "otp_purpose" NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "address" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "pincode" TEXT,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "radiusMeters" INTEGER NOT NULL DEFAULT 200,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "totalWorkers" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "jobs" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "siteId" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requiredSkillId" TEXT,
    "skillCategory" TEXT,
    "workerCount" INTEGER NOT NULL DEFAULT 1,
    "filledCount" INTEGER NOT NULL DEFAULT 0,
    "dailyWage" DECIMAL(10,2),
    "weeklyWage" DECIMAL(10,2),
    "jobType" "job_type" NOT NULL DEFAULT 'DAILY',
    "status" "job_status" NOT NULL DEFAULT 'DRAFT',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "latitude" DECIMAL(10,8),
    "longitude" DECIMAL(11,8),
    "isUrgent" BOOLEAN NOT NULL DEFAULT false,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_applications" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "status" "application_status" NOT NULL DEFAULT 'SUBMITTED',
    "coverNote" TEXT,
    "contractorNote" TEXT,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "viewedAt" TIMESTAMP(3),
    "shortlistedAt" TIMESTAMP(3),
    "hiredAt" TIMESTAMP(3),
    "rejectedAt" TIMESTAMP(3),
    "withdrawnAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hire_records" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "siteId" TEXT,
    "agreedDailyWage" DECIMAL(10,2) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "terminatedAt" TIMESTAMP(3),
    "terminationReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hire_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance_records" (
    "id" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "checkInTime" TIMESTAMP(3) NOT NULL,
    "checkOutTime" TIMESTAMP(3),
    "checkInLat" DECIMAL(10,8),
    "checkInLon" DECIMAL(11,8),
    "checkOutLat" DECIMAL(10,8),
    "checkOutLon" DECIMAL(11,8),
    "geoFenceValid" BOOLEAN NOT NULL DEFAULT true,
    "method" "attendance_method" NOT NULL DEFAULT 'GPS',
    "totalHours" DECIMAL(5,2),
    "isFlagged" BOOLEAN NOT NULL DEFAULT false,
    "flagReason" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "qr_codes" (
    "id" TEXT NOT NULL,
    "siteId" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "scansCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "qr_codes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_batches" (
    "id" TEXT NOT NULL,
    "contractorId" TEXT NOT NULL,
    "jobId" TEXT,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" "payroll_status" NOT NULL DEFAULT 'DRAFT',
    "totalWorkers" INTEGER NOT NULL DEFAULT 0,
    "totalAmount" DECIMAL(12,2),
    "processedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "approvedBy" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payroll_records" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "workerId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "workingDays" INTEGER NOT NULL DEFAULT 0,
    "totalHours" DECIMAL(7,2),
    "regularHours" DECIMAL(7,2),
    "overtimeHours" DECIMAL(7,2),
    "dailyWage" DECIMAL(10,2) NOT NULL,
    "grossAmount" DECIMAL(12,2) NOT NULL,
    "pfDeduction" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "esiDeduction" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "otherDeductions" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "netAmount" DECIMAL(12,2) NOT NULL,
    "paymentStatus" "payment_status" NOT NULL DEFAULT 'PENDING',
    "payslipUrl" TEXT,
    "utrNumber" TEXT,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payroll_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "type" "notification_type" NOT NULL DEFAULT 'GENERAL',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_phone_idx" ON "users"("phone");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_status_idx" ON "users"("status");

-- CreateIndex
CREATE INDEX "users_deletedAt_idx" ON "users"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "workers_userId_key" ON "workers"("userId");

-- CreateIndex
CREATE INDEX "workers_userId_idx" ON "workers"("userId");

-- CreateIndex
CREATE INDEX "workers_locationId_idx" ON "workers"("locationId");

-- CreateIndex
CREATE INDEX "workers_availableForWork_idx" ON "workers"("availableForWork");

-- CreateIndex
CREATE INDEX "workers_rating_idx" ON "workers"("rating");

-- CreateIndex
CREATE INDEX "workers_city_idx" ON "workers"("city");

-- CreateIndex
CREATE INDEX "workers_kycStatus_idx" ON "workers"("kycStatus");

-- CreateIndex
CREATE INDEX "workers_deletedAt_idx" ON "workers"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "contractors_userId_key" ON "contractors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "contractors_gstin_key" ON "contractors"("gstin");

-- CreateIndex
CREATE INDEX "contractors_userId_idx" ON "contractors"("userId");

-- CreateIndex
CREATE INDEX "contractors_companyId_idx" ON "contractors"("companyId");

-- CreateIndex
CREATE INDEX "contractors_locationId_idx" ON "contractors"("locationId");

-- CreateIndex
CREATE INDEX "contractors_deletedAt_idx" ON "contractors"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "companies_registrationNo_key" ON "companies"("registrationNo");

-- CreateIndex
CREATE UNIQUE INDEX "companies_gstNumber_key" ON "companies"("gstNumber");

-- CreateIndex
CREATE UNIQUE INDEX "companies_panNumber_key" ON "companies"("panNumber");

-- CreateIndex
CREATE INDEX "companies_name_idx" ON "companies"("name");

-- CreateIndex
CREATE INDEX "companies_slug_idx" ON "companies"("slug");

-- CreateIndex
CREATE INDEX "companies_isVerified_idx" ON "companies"("isVerified");

-- CreateIndex
CREATE INDEX "companies_deletedAt_idx" ON "companies"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "company_admins_userId_key" ON "company_admins"("userId");

-- CreateIndex
CREATE INDEX "company_admins_companyId_idx" ON "company_admins"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "roles_name_key" ON "roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_name_key" ON "permissions"("name");

-- CreateIndex
CREATE INDEX "permissions_resource_idx" ON "permissions"("resource");

-- CreateIndex
CREATE UNIQUE INDEX "role_permissions_roleId_permissionId_key" ON "role_permissions"("roleId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_permissions_adminId_permissionId_key" ON "admin_permissions"("adminId", "permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refreshToken_key" ON "user_sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "user_sessions_userId_idx" ON "user_sessions"("userId");

-- CreateIndex
CREATE INDEX "user_sessions_refreshToken_idx" ON "user_sessions"("refreshToken");

-- CreateIndex
CREATE INDEX "user_sessions_isActive_idx" ON "user_sessions"("isActive");

-- CreateIndex
CREATE INDEX "user_sessions_expiresAt_idx" ON "user_sessions"("expiresAt");

-- CreateIndex
CREATE INDEX "documents_userId_idx" ON "documents"("userId");

-- CreateIndex
CREATE INDEX "documents_status_idx" ON "documents"("status");

-- CreateIndex
CREATE INDEX "documents_type_idx" ON "documents"("type");

-- CreateIndex
CREATE INDEX "documents_deletedAt_idx" ON "documents"("deletedAt");

-- CreateIndex
CREATE INDEX "locations_city_idx" ON "locations"("city");

-- CreateIndex
CREATE INDEX "locations_state_idx" ON "locations"("state");

-- CreateIndex
CREATE INDEX "locations_pincode_idx" ON "locations"("pincode");

-- CreateIndex
CREATE UNIQUE INDEX "skills_name_key" ON "skills"("name");

-- CreateIndex
CREATE UNIQUE INDEX "skills_slug_key" ON "skills"("slug");

-- CreateIndex
CREATE INDEX "skills_category_idx" ON "skills"("category");

-- CreateIndex
CREATE INDEX "skills_isActive_idx" ON "skills"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "worker_skills_workerId_skillId_key" ON "worker_skills"("workerId", "skillId");

-- CreateIndex
CREATE INDEX "worker_experiences_workerId_idx" ON "worker_experiences"("workerId");

-- CreateIndex
CREATE INDEX "worker_ratings_workerId_idx" ON "worker_ratings"("workerId");

-- CreateIndex
CREATE INDEX "worker_ratings_contractorId_idx" ON "worker_ratings"("contractorId");

-- CreateIndex
CREATE UNIQUE INDEX "worker_ratings_workerId_jobId_key" ON "worker_ratings"("workerId", "jobId");

-- CreateIndex
CREATE INDEX "saved_jobs_workerId_idx" ON "saved_jobs"("workerId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_jobs_workerId_jobId_key" ON "saved_jobs"("workerId", "jobId");

-- CreateIndex
CREATE INDEX "otp_codes_identifier_idx" ON "otp_codes"("identifier");

-- CreateIndex
CREATE INDEX "otp_codes_purpose_idx" ON "otp_codes"("purpose");

-- CreateIndex
CREATE INDEX "otp_codes_expiresAt_idx" ON "otp_codes"("expiresAt");

-- CreateIndex
CREATE INDEX "sites_contractorId_idx" ON "sites"("contractorId");

-- CreateIndex
CREATE INDEX "sites_city_idx" ON "sites"("city");

-- CreateIndex
CREATE INDEX "sites_isActive_idx" ON "sites"("isActive");

-- CreateIndex
CREATE INDEX "sites_deletedAt_idx" ON "sites"("deletedAt");

-- CreateIndex
CREATE INDEX "jobs_contractorId_idx" ON "jobs"("contractorId");

-- CreateIndex
CREATE INDEX "jobs_siteId_idx" ON "jobs"("siteId");

-- CreateIndex
CREATE INDEX "jobs_status_idx" ON "jobs"("status");

-- CreateIndex
CREATE INDEX "jobs_city_idx" ON "jobs"("city");

-- CreateIndex
CREATE INDEX "jobs_jobType_idx" ON "jobs"("jobType");

-- CreateIndex
CREATE INDEX "jobs_startDate_idx" ON "jobs"("startDate");

-- CreateIndex
CREATE INDEX "jobs_requiredSkillId_idx" ON "jobs"("requiredSkillId");

-- CreateIndex
CREATE INDEX "jobs_deletedAt_idx" ON "jobs"("deletedAt");

-- CreateIndex
CREATE INDEX "job_applications_jobId_idx" ON "job_applications"("jobId");

-- CreateIndex
CREATE INDEX "job_applications_workerId_idx" ON "job_applications"("workerId");

-- CreateIndex
CREATE INDEX "job_applications_status_idx" ON "job_applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "job_applications_jobId_workerId_key" ON "job_applications"("jobId", "workerId");

-- CreateIndex
CREATE UNIQUE INDEX "hire_records_applicationId_key" ON "hire_records"("applicationId");

-- CreateIndex
CREATE INDEX "hire_records_jobId_idx" ON "hire_records"("jobId");

-- CreateIndex
CREATE INDEX "hire_records_workerId_idx" ON "hire_records"("workerId");

-- CreateIndex
CREATE INDEX "hire_records_contractorId_idx" ON "hire_records"("contractorId");

-- CreateIndex
CREATE INDEX "hire_records_isActive_idx" ON "hire_records"("isActive");

-- CreateIndex
CREATE INDEX "attendance_records_workerId_idx" ON "attendance_records"("workerId");

-- CreateIndex
CREATE INDEX "attendance_records_jobId_idx" ON "attendance_records"("jobId");

-- CreateIndex
CREATE INDEX "attendance_records_siteId_idx" ON "attendance_records"("siteId");

-- CreateIndex
CREATE INDEX "attendance_records_contractorId_idx" ON "attendance_records"("contractorId");

-- CreateIndex
CREATE INDEX "attendance_records_checkInTime_idx" ON "attendance_records"("checkInTime");

-- CreateIndex
CREATE UNIQUE INDEX "qr_codes_code_key" ON "qr_codes"("code");

-- CreateIndex
CREATE INDEX "qr_codes_siteId_idx" ON "qr_codes"("siteId");

-- CreateIndex
CREATE INDEX "qr_codes_code_idx" ON "qr_codes"("code");

-- CreateIndex
CREATE INDEX "qr_codes_isActive_idx" ON "qr_codes"("isActive");

-- CreateIndex
CREATE INDEX "payroll_batches_contractorId_idx" ON "payroll_batches"("contractorId");

-- CreateIndex
CREATE INDEX "payroll_batches_status_idx" ON "payroll_batches"("status");

-- CreateIndex
CREATE INDEX "payroll_batches_periodStart_idx" ON "payroll_batches"("periodStart");

-- CreateIndex
CREATE INDEX "payroll_records_batchId_idx" ON "payroll_records"("batchId");

-- CreateIndex
CREATE INDEX "payroll_records_workerId_idx" ON "payroll_records"("workerId");

-- CreateIndex
CREATE INDEX "payroll_records_jobId_idx" ON "payroll_records"("jobId");

-- CreateIndex
CREATE INDEX "payroll_records_paymentStatus_idx" ON "payroll_records"("paymentStatus");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "notifications"("type");

-- AddForeignKey
ALTER TABLE "workers" ADD CONSTRAINT "workers_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workers" ADD CONSTRAINT "workers_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contractors" ADD CONSTRAINT "contractors_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "companies" ADD CONSTRAINT "companies_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_admins" ADD CONSTRAINT "company_admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_admins" ADD CONSTRAINT "company_admins_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_permissions" ADD CONSTRAINT "admin_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_skills" ADD CONSTRAINT "worker_skills_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_skills" ADD CONSTRAINT "worker_skills_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_experiences" ADD CONSTRAINT "worker_experiences_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_ratings" ADD CONSTRAINT "worker_ratings_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "worker_ratings" ADD CONSTRAINT "worker_ratings_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_jobs" ADD CONSTRAINT "saved_jobs_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "otp_codes" ADD CONSTRAINT "otp_codes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_requiredSkillId_fkey" FOREIGN KEY ("requiredSkillId") REFERENCES "skills"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hire_records" ADD CONSTRAINT "hire_records_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "job_applications"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hire_records" ADD CONSTRAINT "hire_records_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hire_records" ADD CONSTRAINT "hire_records_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hire_records" ADD CONSTRAINT "hire_records_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance_records" ADD CONSTRAINT "attendance_records_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "qr_codes" ADD CONSTRAINT "qr_codes_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_batches" ADD CONSTRAINT "payroll_batches_contractorId_fkey" FOREIGN KEY ("contractorId") REFERENCES "contractors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "payroll_batches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_workerId_fkey" FOREIGN KEY ("workerId") REFERENCES "workers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payroll_records" ADD CONSTRAINT "payroll_records_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "jobs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
