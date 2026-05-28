# CLAUDE.md — Digital Labour Chowk

> **Production-Grade Labour Marketplace & Workforce Management Platform**
> AI-assisted engineering reference for all contributors and coding agents.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Engineering Principles](#3-engineering-principles)
4. [Coding Standards](#4-coding-standards)
5. [Security Standards](#5-security-standards)
6. [AI Coding Instructions](#6-ai-coding-instructions)
7. [Folder Structure](#7-folder-structure)
8. [Git Workflow](#8-git-workflow)
9. [API Standards](#9-api-standards)
10. [Database Standards](#10-database-standards)
11. [DevOps Instructions](#11-devops-instructions)
12. [Testing Strategy](#12-testing-strategy)
13. [AI Agent Rules](#13-ai-agent-rules)

---

## 1. Project Overview

### Vision

**Digital Labour Chowk** is a next-generation blue-collar workforce platform that digitises the informal labour market — connecting skilled construction workers, contractors, and enterprises through a unified, AI-powered hiring and workforce management ecosystem.

### Mission

Eliminate friction in blue-collar hiring. Replace WhatsApp groups, physical mandis, and paper timesheets with a transparent, data-driven, mobile-first platform that creates dignity, opportunity, and operational efficiency for every stakeholder.

### Objectives

| Objective | Target |
|---|---|
| Reduce time-to-hire for skilled labour | < 2 hours |
| Worker onboarding (KYC + profile) | < 10 minutes |
| Payroll processing accuracy | 99.9% |
| Real-time workforce geo-tracking latency | < 5 seconds |
| Platform uptime SLA | 99.95% |

### Product Goals

- **Workers** — Find jobs, get paid on time, build a verified digital work history
- **Contractors** — Hire verified workers, manage attendance, run payroll, track sites
- **Enterprises** — Workforce compliance, vendor management, analytics, ESG reporting
- **Admins** — Platform governance, dispute resolution, fraud detection, revenue ops

### Core Business Problems Solved

1. **Unverified labour supply** — Identity-less workers, no skill validation → solved via AI-powered KYC + skill badges
2. **Cash payroll leakage** — Middlemen skimming wages → solved via direct digital payroll (UPI / wallet)
3. **Zero attendance visibility** — No site check-in data → solved via geo-fenced attendance with biometric fallback
4. **Fragmented contractor ops** — WhatsApp chaos → solved via unified contractor dashboard + mobile app
5. **No labour market data** — Blind pricing → solved via demand/supply analytics engine

---

## 2. Tech Stack

### Frontend — Contractor Dashboard & Enterprise Portal

```
Framework     : Next.js 15 (App Router)
Language      : TypeScript 5.x
Styling       : TailwindCSS 3.x + shadcn/ui
State         : Zustand (client) + TanStack Query v5 (server state)
Forms         : React Hook Form + Zod
Maps          : Mapbox GL JS / Google Maps SDK
Charts        : Recharts / Chart.js
Auth          : NextAuth.js v5
HTTP Client   : Axios (typed interceptors)
Notifications : react-hot-toast / Sonner
i18n          : next-intl (Hindi, English, Marathi)
```

### Backend — API Server

```
Runtime       : Node.js 20 LTS
Framework     : NestJS 11
Language      : TypeScript 5.x
API Style     : REST (versioned) + WebSocket (Socket.io)
Auth          : JWT (access + refresh tokens) + Passport.js
Validation    : class-validator + class-transformer
ORM           : TypeORM 0.3.x
Queue         : Bull / BullMQ (Redis-backed)
Mailer        : Nodemailer + SendGrid
SMS           : Twilio / MSG91
Storage       : AWS S3 + CloudFront
Search        : Elasticsearch 8.x
Scheduler     : @nestjs/schedule (cron)
Docs          : Swagger / OpenAPI 3.1
```

### Mobile — Worker App

```
Framework     : Flutter 3.x (Dart)
State         : Riverpod 2.x
Navigation    : GoRouter
Storage       : Hive (offline) + SharedPreferences
Maps          : Google Maps Flutter Plugin
Camera        : camera + image_picker
Biometric     : local_auth
Push          : Firebase Cloud Messaging (FCM)
Analytics     : Firebase Analytics
Crash         : Firebase Crashlytics
HTTP          : Dio (interceptors + retry)
i18n          : Flutter Intl (Hindi, English, 8+ regional)
```

### Database & Cache

```
Primary DB    : PostgreSQL 16 (RDS / Aurora)
Cache         : Redis 7 (ElastiCache) — sessions, queues, rate limits
Search        : Elasticsearch 8 — worker discovery, job search
Object Store  : AWS S3 — documents, photos, exports
Time-series   : PostgreSQL partitioned tables (attendance, payroll events)
```

### Infrastructure

```
Containers    : Docker + Docker Compose (local)
Orchestration : Kubernetes (EKS) — staging + production
Registry      : AWS ECR
CI/CD         : GitHub Actions
IaC           : Terraform (AWS resources)
Secrets       : AWS Secrets Manager + .env (local only)
CDN           : AWS CloudFront
DNS           : AWS Route 53
SSL           : AWS ACM
Monitoring    : Datadog (APM + logs + infra)
Alerting      : PagerDuty
Uptime        : AWS CloudWatch + Datadog Synthetics
```

---

## 3. Engineering Principles

### Architecture Pattern

**Modular Monolith → Microservices migration path**

Start with a well-structured NestJS modular monolith. Each business domain is a self-contained module with its own controllers, services, repositories, and DTOs. Modules communicate through internal service injection (not direct DB sharing). Extract to microservices only when a domain crosses a clear scaling or team boundary.

**Domains:**

```
auth          — authentication, sessions, tokens
workers       — profiles, skills, documents, KYC
contractors   — profiles, company, preferences
jobs          — postings, applications, matching
attendance    — check-in/out, geo-fence, biometric
payroll       — salary, deductions, disbursement, history
sites         — construction sites, geo-zones, workforce
notifications — push, SMS, email, in-app
analytics     — reports, dashboards, exports
admin         — governance, disputes, moderation
```

### Clean Architecture Layers

```
Controller Layer     ← HTTP boundary, input validation only
↓
Service Layer        ← Business logic, orchestration
↓
Repository Layer     ← Data access, query abstraction
↓
Domain/Entity Layer  ← Pure business rules, no framework deps
↓
Infrastructure Layer ← DB, cache, external APIs, file storage
```

### SOLID Principles

- **S** — One responsibility per class. `WorkerService` handles workers, not payroll.
- **O** — Extend via strategy/decorator, not modify. Add new payroll providers via interface.
- **L** — All subtypes must honour parent contracts. `BankTransfer` ↔ `WalletTransfer` both satisfy `PaymentProvider`.
- **I** — Split fat interfaces. `IAttendanceReader` ≠ `IAttendanceWriter`.
- **D** — Inject abstractions. Never `new DatabaseService()` inside a business service.

### Event-Driven Architecture

Use domain events for cross-module side effects:

```typescript
// Emit from PayrollService
this.eventEmitter.emit('payroll.processed', new PayrollProcessedEvent(payload));

// Handle in NotificationModule
@OnEvent('payroll.processed')
async handlePayrollProcessed(event: PayrollProcessedEvent) { ... }
```

### Domain-Driven Design Patterns

- Use **Aggregates** for complex domains (Worker aggregate owns Skills, Documents)
- Use **Value Objects** for immutable concepts (`AadhaarNumber`, `GeoCoordinate`, `MoneyAmount`)
- Use **Repository Pattern** — never query DB directly in service layer
- Use **Domain Events** for side-effect decoupling
- Use **DTOs** at every API boundary — never expose raw entities

---

## 4. Coding Standards

### Naming Conventions

#### TypeScript / NestJS (Backend)

```typescript
// Files
worker.service.ts          // kebab-case, descriptive suffix
create-worker.dto.ts
worker.entity.ts
worker.repository.ts
worker.controller.ts
worker.module.ts

// Classes
class WorkerService {}
class CreateWorkerDto {}
class WorkerEntity {}

// Interfaces
interface IWorkerRepository {}
interface IPaymentProvider {}

// Enums
enum WorkerStatus { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }
enum JobType { DAILY = 'DAILY', CONTRACT = 'CONTRACT' }

// Constants
const MAX_WORKERS_PER_SITE = 500;
const JWT_EXPIRY_SECONDS = 3600;

// Functions / Methods
async findWorkerById(id: string): Promise<Worker> {}
async processAttendance(dto: ProcessAttendanceDto): Promise<Attendance> {}

// Variables
const workerProfile = await this.workerService.findById(id);
const isVerified = worker.kycStatus === KycStatus.VERIFIED;
```

#### Next.js / React (Frontend)

```typescript
// Files
WorkerCard.tsx              // PascalCase for components
useWorkerProfile.ts         // camelCase with "use" prefix for hooks
workerApi.ts                // camelCase for API utilities
workerTypes.ts              // camelCase for types/interfaces

// Components
export function WorkerCard({ worker }: WorkerCardProps) {}
export default function WorkerProfilePage() {}

// Hooks
export function useWorkerProfile(workerId: string) {}

// Props interfaces
interface WorkerCardProps {
  worker: WorkerSummary;
  onHire?: (id: string) => void;
}

// Event handlers
const handleHireWorker = (workerId: string) => {};
const handleFormSubmit = (data: CreateJobFormData) => {};
```

#### Flutter / Dart (Mobile)

```dart
// Files
worker_profile_screen.dart   // snake_case
worker_card_widget.dart
worker_repository.dart
worker_notifier.dart

// Classes
class WorkerProfileScreen extends ConsumerWidget {}
class WorkerCardWidget extends StatelessWidget {}
class WorkerRepository {}

// Variables / Methods
final workerProfile = ref.watch(workerProfileProvider(workerId));
Future<Worker> fetchWorkerById(String id) async {}
```

### API Conventions

```
GET    /api/v1/workers                    — list with pagination
GET    /api/v1/workers/:id                — single resource
POST   /api/v1/workers                    — create
PATCH  /api/v1/workers/:id                — partial update
DELETE /api/v1/workers/:id                — soft delete
POST   /api/v1/workers/:id/verify-kyc     — action (verb noun)
GET    /api/v1/workers/:id/attendance     — nested resource
POST   /api/v1/jobs/:id/applications      — relationship resource
```

### Response Format Standards

**Success Response:**
```json
{
  "success": true,
  "data": { },
  "message": "Worker profile fetched successfully",
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 342,
    "totalPages": 18
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "WORKER_NOT_FOUND",
    "message": "Worker with ID xyz does not exist",
    "details": [],
    "timestamp": "2026-05-27T10:30:00Z",
    "path": "/api/v1/workers/xyz"
  }
}
```

### DTO Validation

```typescript
// ALWAYS use class-validator + class-transformer
export class CreateWorkerDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(100)
  fullName: string;

  @IsString()
  @Matches(/^[6-9]\d{9}$/, { message: 'Invalid Indian mobile number' })
  phone: string;

  @IsEnum(WorkerSkill)
  primarySkill: WorkerSkill;

  @IsOptional()
  @IsString()
  @Length(12, 12)
  aadhaarNumber?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(50)
  experienceYears?: number;
}
```

### Error Handling Strategy

```typescript
// 1. Domain exceptions (typed, caught globally)
export class WorkerNotFoundException extends NotFoundException {
  constructor(id: string) {
    super({ code: 'WORKER_NOT_FOUND', message: `Worker ${id} not found` });
  }
}

// 2. Global exception filter catches ALL exceptions
// 3. Never swallow errors — always log + rethrow or return typed error
// 4. Use Result<T, E> pattern for operations that can fail predictably
// 5. Never expose stack traces in production responses
```

### Logging Strategy

```typescript
// Use NestJS Logger — structured, context-tagged
private readonly logger = new Logger(WorkerService.name);

// Log levels: error > warn > log > verbose > debug
this.logger.error('KYC verification failed', { workerId, reason, stack: err.stack });
this.logger.warn('Duplicate application attempt', { workerId, jobId });
this.logger.log('Worker profile created', { workerId, phone });
this.logger.debug('Query executed', { query, durationMs });

// NEVER log: passwords, tokens, Aadhaar numbers, bank account numbers, OTPs
// ALWAYS log: request IDs, user IDs, operation names, durations, errors
```

---

## 5. Security Standards

### Authentication

```
Access Token  : JWT, RS256, 15 min expiry
Refresh Token : opaque UUID, 7 days, stored in HttpOnly cookie
Token Storage : access → memory (frontend), refresh → HttpOnly cookie
OTP Auth      : 6-digit, 3 min expiry, 5 attempt limit (Redis-backed)
```

### Role-Based Access Control (RBAC)

```typescript
enum UserRole {
  WORKER = 'WORKER',
  CONTRACTOR = 'CONTRACTOR',
  CONTRACTOR_ADMIN = 'CONTRACTOR_ADMIN',
  ENTERPRISE_MANAGER = 'ENTERPRISE_MANAGER',
  ENTERPRISE_ADMIN = 'ENTERPRISE_ADMIN',
  PLATFORM_ADMIN = 'PLATFORM_ADMIN',
  PLATFORM_SUPER_ADMIN = 'PLATFORM_SUPER_ADMIN',
}

// Use @Roles() decorator + RolesGuard on every protected endpoint
@Roles(UserRole.CONTRACTOR, UserRole.CONTRACTOR_ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Post('jobs')
async createJob(@Body() dto: CreateJobDto) {}
```

### Rate Limiting

```typescript
// Global: 100 req/min per IP
// Auth endpoints: 10 req/min per IP
// OTP send: 3 req/15min per phone number
// File upload: 10 uploads/hour per user
// Search: 60 req/min per authenticated user

// Implementation: @nestjs/throttler + Redis store
```

### Input Sanitization & Injection Prevention

- **All user input** passes through `class-validator` before reaching service layer
- **TypeORM parameterized queries** — never string-concatenated SQL
- **Raw queries** use positional parameters: `query('SELECT * FROM workers WHERE id = $1', [id])`
- **File uploads** — validate MIME type server-side (not just extension), size limits, virus scan via ClamAV
- **HTML input** — sanitize with DOMPurify before storage (contractor job descriptions)
- **NoSQL injection** — not applicable (PostgreSQL), but Elasticsearch queries are typed, not interpolated

### Encryption

```
Data in transit : TLS 1.3 minimum (enforced via ALB policy)
Data at rest    : AES-256 (RDS encryption enabled, S3 SSE-S3)
Sensitive fields: Aadhaar numbers, bank accounts → encrypted at application layer (AES-256-GCM) before DB write
PII fields      : phone, email → stored in cleartext but masked in logs and API responses
```

### Audit Logs

```typescript
// Every write operation in admin/financial domains creates an audit record
interface AuditLog {
  id: string;
  userId: string;
  userRole: UserRole;
  action: string;          // 'worker.kyc.approved', 'payroll.processed'
  resourceType: string;    // 'Worker', 'PayrollBatch'
  resourceId: string;
  before: Record<string, unknown>;
  after: Record<string, unknown>;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
}

// Audit logs are IMMUTABLE — no update/delete operations ever
// Retained for 7 years (compliance requirement)
```

### File Upload Security

```typescript
// Allowed types: image/jpeg, image/png, application/pdf
// Max size: 5MB per file
// Storage: S3 private bucket, pre-signed URLs (15 min expiry)
// Filename: UUID-generated, never trust original filename
// Path: /{env}/{resourceType}/{userId}/{uuid}.{ext}
// Malware scan: async Lambda trigger on S3 upload event
```

---

## 6. AI Coding Instructions

> Instructions for GitHub Copilot, Claude, Cursor, and any AI coding assistant working on this codebase.

### Generating Backend APIs (NestJS)

When asked to create a new API endpoint, always generate ALL of the following:

1. **DTO** — `create-{resource}.dto.ts` with full class-validator decorators
2. **Entity** — `{resource}.entity.ts` with TypeORM decorators, UUID PK, audit fields
3. **Repository** — `{resource}.repository.ts` extending base repository
4. **Service** — `{resource}.service.ts` with business logic, proper error handling
5. **Controller** — `{resource}.controller.ts` with Swagger decorators, guards, roles
6. **Module** — `{resource}.module.ts` registering all providers
7. **Tests** — `{resource}.service.spec.ts` with happy path + error cases

**Never** generate a controller method that calls the database directly.
**Always** route business logic through the service layer.

### Generating Frontend Components (Next.js)

```typescript
// PATTERN: Every new page/feature requires:
// 1. Page component (app/dashboard/workers/page.tsx)
// 2. Feature components (components/workers/WorkerCard.tsx)
// 3. Custom hook (hooks/useWorkers.ts) — data fetching via TanStack Query
// 4. API function (lib/api/workersApi.ts) — typed Axios call
// 5. Types (types/worker.types.ts) — mirrors backend DTOs
// 6. Zod schema for forms (lib/schemas/workerSchema.ts)

// Component structure
export function WorkerCard({ worker, onHire }: WorkerCardProps) {
  // 1. Hooks at top
  // 2. Derived state
  // 3. Event handlers
  // 4. Render — JSX only, no business logic
}
```

### Generating Database Migrations

```bash
# NEVER write raw SQL migrations manually
# ALWAYS use TypeORM migration generator:
npm run migration:generate -- src/migrations/AddWorkerSkillLevel

# Migration files must:
# 1. Be reversible (have down() method)
# 2. Not drop columns without data migration plan
# 3. Add indexes in the same migration as the column
# 4. Never truncate production tables
```

### Maintaining Architecture Consistency

- **Module imports**: Only import what's declared in the module's `imports` array. Cross-module data access goes through exported services, not direct entity access.
- **Circular dependencies**: Forbidden. Restructure using events or extract shared service to common module.
- **Config access**: Only via `ConfigService` — never `process.env` directly in business code.
- **HTTP calls in services**: Never call external HTTP directly — wrap in an infrastructure service (`SmsService`, `PaymentGatewayService`).

### Anti-Patterns to Avoid

```typescript
// ❌ NEVER — Fat controller with business logic
@Post('hire')
async hireWorker(@Body() dto: HireWorkerDto) {
  const worker = await this.db.query(`SELECT * FROM workers WHERE id = '${dto.workerId}'`);
  if (!worker) throw new Error('not found');
  worker.status = 'hired';
  await this.db.save(worker);
  await fetch('https://sms-api.com/send', { ... });
}

// ✅ ALWAYS — Thin controller, delegating to service
@Post('hire')
@Roles(UserRole.CONTRACTOR)
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiOperation({ summary: 'Hire a worker for a job' })
async hireWorker(@Body() dto: HireWorkerDto, @CurrentUser() user: AuthUser) {
  return this.jobsService.hireWorker(dto, user);
}
```

### DRY Principles

- Extract repeated query patterns into `BaseRepository<T>` methods
- Extract repeated response shapes into `ApiResponseDto<T>` wrapper
- Extract repeated guard combinations into custom decorators (`@AuthContractor()`)
- Extract repeated Tailwind class strings into component variants with `cva()`

---

## 7. Folder Structure

### Backend — NestJS

```
backend/
├── src/
│   ├── modules/
│   │   ├── auth/
│   │   │   ├── controllers/
│   │   │   │   └── auth.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── token.service.ts
│   │   │   ├── strategies/
│   │   │   │   ├── jwt.strategy.ts
│   │   │   │   └── jwt-refresh.strategy.ts
│   │   │   ├── guards/
│   │   │   │   ├── jwt-auth.guard.ts
│   │   │   │   └── roles.guard.ts
│   │   │   ├── decorators/
│   │   │   │   ├── current-user.decorator.ts
│   │   │   │   └── roles.decorator.ts
│   │   │   ├── dto/
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── send-otp.dto.ts
│   │   │   │   └── verify-otp.dto.ts
│   │   │   └── auth.module.ts
│   │   │
│   │   ├── workers/
│   │   │   ├── controllers/
│   │   │   │   └── workers.controller.ts
│   │   │   ├── services/
│   │   │   │   ├── workers.service.ts
│   │   │   │   └── worker-kyc.service.ts
│   │   │   ├── repositories/
│   │   │   │   └── worker.repository.ts
│   │   │   ├── entities/
│   │   │   │   ├── worker.entity.ts
│   │   │   │   ├── worker-skill.entity.ts
│   │   │   │   └── worker-document.entity.ts
│   │   │   ├── dto/
│   │   │   │   ├── create-worker.dto.ts
│   │   │   │   ├── update-worker.dto.ts
│   │   │   │   ├── worker-filter.dto.ts
│   │   │   │   └── worker-response.dto.ts
│   │   │   ├── enums/
│   │   │   │   ├── worker-status.enum.ts
│   │   │   │   └── worker-skill.enum.ts
│   │   │   ├── events/
│   │   │   │   ├── worker-registered.event.ts
│   │   │   │   └── worker-kyc-approved.event.ts
│   │   │   └── workers.module.ts
│   │   │
│   │   ├── contractors/
│   │   ├── jobs/
│   │   ├── attendance/
│   │   ├── payroll/
│   │   ├── sites/
│   │   ├── notifications/
│   │   └── admin/
│   │
│   ├── common/
│   │   ├── base/
│   │   │   ├── base.entity.ts         ← id, createdAt, updatedAt, deletedAt
│   │   │   └── base.repository.ts
│   │   ├── decorators/
│   │   │   └── api-paginated-response.decorator.ts
│   │   ├── dto/
│   │   │   ├── api-response.dto.ts
│   │   │   ├── pagination.dto.ts
│   │   │   └── id-param.dto.ts
│   │   ├── filters/
│   │   │   └── global-exception.filter.ts
│   │   ├── interceptors/
│   │   │   ├── response-transform.interceptor.ts
│   │   │   └── request-logging.interceptor.ts
│   │   ├── guards/
│   │   │   └── throttle.guard.ts
│   │   ├── pipes/
│   │   │   └── validation.pipe.ts
│   │   └── utils/
│   │       ├── pagination.util.ts
│   │       ├── crypto.util.ts
│   │       └── date.util.ts
│   │
│   ├── infrastructure/
│   │   ├── database/
│   │   │   ├── database.module.ts
│   │   │   └── typeorm.config.ts
│   │   ├── redis/
│   │   │   └── redis.module.ts
│   │   ├── storage/
│   │   │   └── s3.service.ts
│   │   ├── sms/
│   │   │   └── sms.service.ts
│   │   ├── email/
│   │   │   └── email.service.ts
│   │   └── payment/
│   │       └── payment-gateway.service.ts
│   │
│   ├── config/
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── aws.config.ts
│   │
│   ├── migrations/
│   │   └── 1716800000000-InitialSchema.ts
│   │
│   ├── app.module.ts
│   └── main.ts
│
├── test/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .env.example
├── docker-compose.yml
├── Dockerfile
└── package.json
```

### Frontend — Next.js

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── workers/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [id]/page.tsx
│   │   │   ├── jobs/
│   │   │   ├── attendance/
│   │   │   ├── payroll/
│   │   │   └── sites/
│   │   ├── (admin)/
│   │   │   └── ...
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                        ← shadcn/ui primitives
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   └── ...
│   │   ├── workers/
│   │   │   ├── WorkerCard.tsx
│   │   │   ├── WorkerList.tsx
│   │   │   ├── WorkerFilters.tsx
│   │   │   └── WorkerProfileModal.tsx
│   │   ├── jobs/
│   │   ├── attendance/
│   │   ├── payroll/
│   │   ├── maps/
│   │   │   ├── SiteMap.tsx
│   │   │   └── WorkerLocationPin.tsx
│   │   └── shared/
│   │       ├── PageHeader.tsx
│   │       ├── DataTable.tsx
│   │       ├── StatCard.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── hooks/
│   │   ├── useWorkers.ts
│   │   ├── useAttendance.ts
│   │   ├── usePayroll.ts
│   │   └── useAuth.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts              ← Axios instance
│   │   │   ├── workersApi.ts
│   │   │   ├── jobsApi.ts
│   │   │   ├── attendanceApi.ts
│   │   │   └── payrollApi.ts
│   │   ├── schemas/
│   │   │   ├── workerSchema.ts
│   │   │   └── jobSchema.ts
│   │   └── utils/
│   │       ├── formatters.ts
│   │       └── validators.ts
│   │
│   ├── store/
│   │   ├── authStore.ts
│   │   └── uiStore.ts
│   │
│   └── types/
│       ├── worker.types.ts
│       ├── job.types.ts
│       ├── api.types.ts
│       └── auth.types.ts
│
├── public/
├── .env.local.example
└── package.json
```

### Mobile — Flutter

```
mobile/
├── lib/
│   ├── main.dart
│   ├── app/
│   │   ├── app.dart
│   │   └── router.dart
│   │
│   ├── core/
│   │   ├── constants/
│   │   │   ├── app_constants.dart
│   │   │   └── api_constants.dart
│   │   ├── errors/
│   │   │   ├── exceptions.dart
│   │   │   └── failures.dart
│   │   ├── network/
│   │   │   ├── dio_client.dart
│   │   │   └── interceptors/
│   │   │       ├── auth_interceptor.dart
│   │   │       └── error_interceptor.dart
│   │   ├── storage/
│   │   │   └── local_storage.dart
│   │   ├── utils/
│   │   │   ├── formatters.dart
│   │   │   └── validators.dart
│   │   └── theme/
│   │       ├── app_theme.dart
│   │       └── app_colors.dart
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   ├── data/
│   │   │   │   ├── datasources/auth_remote_datasource.dart
│   │   │   │   └── repositories/auth_repository_impl.dart
│   │   │   ├── domain/
│   │   │   │   ├── entities/user.dart
│   │   │   │   ├── repositories/auth_repository.dart
│   │   │   │   └── usecases/
│   │   │   │       ├── send_otp.dart
│   │   │   │       └── verify_otp.dart
│   │   │   └── presentation/
│   │   │       ├── providers/auth_notifier.dart
│   │   │       └── screens/
│   │   │           ├── login_screen.dart
│   │   │           └── otp_verify_screen.dart
│   │   │
│   │   ├── jobs/
│   │   ├── attendance/
│   │   ├── profile/
│   │   └── wallet/
│   │
│   └── l10n/                          ← i18n ARB files
│       ├── app_en.arb
│       └── app_hi.arb
│
├── test/
│   ├── unit/
│   └── widget/
└── pubspec.yaml
```

### Infrastructure

```
infra/
├── terraform/
│   ├── modules/
│   │   ├── vpc/
│   │   ├── eks/
│   │   ├── rds/
│   │   ├── elasticache/
│   │   └── s3/
│   ├── environments/
│   │   ├── dev/
│   │   ├── staging/
│   │   └── prod/
│   └── main.tf
│
├── kubernetes/
│   ├── base/
│   │   ├── backend-deployment.yaml
│   │   ├── backend-service.yaml
│   │   ├── frontend-deployment.yaml
│   │   └── ingress.yaml
│   ├── overlays/
│   │   ├── staging/
│   │   └── production/
│   └── helm/
│       └── digital-labour-chowk/
│
├── docker/
│   ├── backend/Dockerfile
│   ├── frontend/Dockerfile
│   └── nginx/nginx.conf
│
└── .github/
    └── workflows/
        ├── ci.yml
        ├── deploy-staging.yml
        └── deploy-production.yml
```

---

## 8. Git Workflow

### Branching Strategy

```
main              ← production-only, protected, no direct push
├── develop       ← integration branch, all features merge here
├── feature/*     ← new features
├── fix/*         ← bug fixes
├── hotfix/*      ← critical prod patches (branch from main)
├── chore/*       ← config, deps, CI
└── release/*     ← release candidates
```

### Branch Naming

```bash
feature/DLC-123-worker-geo-attendance
feature/DLC-456-ai-worker-matching
fix/DLC-789-payroll-deduction-calculation
hotfix/DLC-999-otp-expiry-redis-crash
chore/DLC-101-upgrade-nestjs-11
release/v2.3.0
```

### Commit Message Convention (Conventional Commits)

```
<type>(<scope>): <short description>

[optional body]

[optional footer: BREAKING CHANGE, Closes #ticket]
```

**Types:**
```
feat      — new feature
fix       — bug fix
refactor  — code change (no feat/fix)
perf      — performance improvement
test      — adding/fixing tests
docs      — documentation only
chore     — build process, deps, CI
style     — formatting, no logic change
revert    — reverting a commit
```

**Examples:**
```
feat(attendance): add geo-fence auto check-in for site workers
fix(payroll): correct overtime calculation for 12-hour shifts
feat(workers): integrate Aadhaar OCR via AWS Textract
chore(deps): upgrade TypeORM to 0.3.20
test(jobs): add integration tests for worker matching algorithm
```

### PR Review Process

```markdown
## PR Checklist (required before merge)

### Code Quality
- [ ] Follows architecture patterns in CLAUDE.md
- [ ] No business logic in controllers
- [ ] DTOs have full validation decorators
- [ ] No raw SQL strings (parameterized only)

### Security
- [ ] No secrets/credentials in code or logs
- [ ] New endpoints have proper guards + roles
- [ ] File uploads validated for type and size
- [ ] PII fields masked in log statements

### Testing
- [ ] Unit tests pass (npm run test)
- [ ] New service methods have unit tests
- [ ] Critical paths have integration tests

### Database
- [ ] Migration file included (if schema changes)
- [ ] Migration is reversible (down() method)
- [ ] New columns have appropriate indexes

### Documentation
- [ ] Swagger decorators on all new endpoints
- [ ] Complex logic has inline comments
```

**Review SLAs:**
- `feature/*` → 1 working day
- `fix/*` → 4 hours
- `hotfix/*` → 1 hour (emergency review channel)

### Release Flow

```bash
# 1. Cut release branch from develop
git checkout -b release/v2.3.0 develop

# 2. Version bump + changelog
npm version minor
# Update CHANGELOG.md

# 3. QA sign-off on staging

# 4. Merge to main + tag
git checkout main
git merge release/v2.3.0
git tag -a v2.3.0 -m "Release v2.3.0"
git push origin main --tags

# 5. Merge back to develop
git checkout develop
git merge main
```

---

## 9. API Standards

### REST Naming Conventions

```
Resource naming : plural nouns                → /workers, /jobs, /sites
Actions         : POST /resource/:id/action   → POST /workers/:id/approve-kyc
Relationships   : /parent/:id/children        → /sites/:id/workers
Filtering       : query params                → GET /workers?skill=mason&city=mumbai
Sorting         : ?sort=createdAt&order=DESC
Pagination      : ?page=1&limit=20
Search          : ?search=rajesh
Field selection : ?fields=id,name,phone       (sparse fieldsets for mobile)
```

### Pagination Standard

**Request:**
```
GET /api/v1/workers?page=2&limit=20&sort=createdAt&order=DESC
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 2,
    "limit": 20,
    "total": 342,
    "totalPages": 18,
    "hasNextPage": true,
    "hasPreviousPage": true
  }
}
```

### HTTP Status Codes

```
200 OK              — successful GET, PATCH
201 Created         — successful POST (resource created)
204 No Content      — successful DELETE
400 Bad Request     — validation errors
401 Unauthorized    — missing or invalid token
403 Forbidden       — valid token, insufficient role
404 Not Found       — resource doesn't exist
409 Conflict        — duplicate resource (phone already registered)
422 Unprocessable   — business rule violation (worker already hired)
429 Too Many Requests — rate limit exceeded
500 Internal Error  — unexpected server error (never leak stack)
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": [
      { "field": "phone", "message": "Invalid Indian mobile number" },
      { "field": "primarySkill", "message": "Must be a valid WorkerSkill enum value" }
    ],
    "timestamp": "2026-05-27T10:30:00.000Z",
    "path": "/api/v1/workers",
    "requestId": "req_01hw5k9x2z3p4q5r6s7t8u9v"
  }
}
```

### Versioning Strategy

```
URL versioning  : /api/v1/, /api/v2/
Policy          : v1 supported minimum 12 months after v2 GA
Deprecation     : Sunset header added 3 months before retirement
                  Sunset: Sat, 27 May 2027 00:00:00 GMT
```

---

## 10. Database Standards

### Primary Keys

```sql
-- ALL tables use UUID v4 primary keys
id UUID PRIMARY KEY DEFAULT gen_random_uuid()

-- NEVER use auto-increment integers as public IDs
-- Sequence integers may be used for internal ordering only
```

### Audit Fields (every table)

```typescript
// base.entity.ts — all entities extend this
@Entity()
export class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null;         // soft delete

  @Column({ name: 'created_by', nullable: true })
  createdBy: string | null;       // user ID of creator

  @Column({ name: 'updated_by', nullable: true })
  updatedBy: string | null;       // user ID of last updater
}
```

### Soft Deletes

```typescript
// NEVER use hard DELETE in application code (except GDPR erasure pipeline)
// Use TypeORM's @DeleteDateColumn + softDelete() method

// Query — automatically excludes soft-deleted records
await this.workerRepository.findOne({ where: { id } });

// Include soft-deleted
await this.workerRepository.findOne({ where: { id }, withDeleted: true });

// Soft delete
await this.workerRepository.softDelete(id);
```

### Naming Conventions

```sql
-- Tables       : snake_case plural
workers, contractor_profiles, job_applications, attendance_records

-- Columns      : snake_case
created_at, primary_skill, kyc_status, aadhaar_number

-- Foreign keys : {referenced_table_singular}_id
worker_id, job_id, site_id, contractor_id

-- Indexes      : idx_{table}_{column(s)}
idx_workers_phone
idx_workers_city_skill
idx_attendance_worker_date

-- Unique       : uq_{table}_{column}
uq_workers_phone
uq_workers_aadhaar_number
```

### Indexing Strategy

```sql
-- Index every foreign key
CREATE INDEX idx_job_applications_worker_id ON job_applications(worker_id);
CREATE INDEX idx_job_applications_job_id ON job_applications(job_id);

-- Index all filter/search columns
CREATE INDEX idx_workers_city ON workers(city);
CREATE INDEX idx_workers_primary_skill ON workers(primary_skill);
CREATE INDEX idx_workers_status ON workers(status);

-- Composite indexes for common multi-column queries
CREATE INDEX idx_workers_city_skill_status ON workers(city, primary_skill, status);

-- Partial indexes for active records
CREATE INDEX idx_workers_active ON workers(id) WHERE deleted_at IS NULL;

-- Full-text search
CREATE INDEX idx_workers_fts ON workers USING GIN(to_tsvector('english', full_name || ' ' || COALESCE(bio, '')));
```

### Sensitive Data

```sql
-- These columns must be encrypted at application layer before storage:
workers.aadhaar_number       -- AES-256-GCM
workers.pan_number           -- AES-256-GCM
bank_accounts.account_number -- AES-256-GCM
bank_accounts.ifsc_code      -- plaintext (non-sensitive)

-- Column naming for encrypted fields:
aadhaar_number_encrypted     -- stores ciphertext
aadhaar_last_four            -- stores last 4 digits plaintext (for display)
```

---

## 11. DevOps Instructions

### Docker Strategy

```dockerfile
# Multi-stage build — keep production images minimal
# Backend
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS production
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/main.js"]
```

### Environment Handling

```
Environment    Storage                    Access method
──────────────────────────────────────────────────────
local          .env (gitignored)          ConfigService
dev (CI)       GitHub Actions Secrets     Injected at runtime
staging        AWS Secrets Manager        EKS service account
production     AWS Secrets Manager        EKS service account
```

```typescript
// NEVER: process.env.DATABASE_URL in business code
// ALWAYS: ConfigService injection
constructor(private configService: ConfigService) {}
const dbUrl = this.configService.get<string>('database.url');
```

### CI/CD Pipeline (GitHub Actions)

```yaml
# ci.yml — runs on every PR and push to develop/main
on: [push, pull_request]

jobs:
  lint:       # ESLint + Prettier check
  type-check: # tsc --noEmit
  test:       # Jest unit tests + integration tests
  security:   # npm audit + Snyk scan
  build:      # Docker build (validates Dockerfile)

# deploy-staging.yml — auto-deploy on merge to develop
on:
  push:
    branches: [develop]

jobs:
  build-and-push: # Build + push to ECR
  run-migrations:  # TypeORM migrations on staging DB
  deploy:          # kubectl apply (EKS staging)
  smoke-tests:     # Postman/Newman API health checks

# deploy-production.yml — manual trigger with approval gate
on:
  workflow_dispatch:
    inputs:
      version: { required: true }

jobs:
  approval:    # GitHub Environment approval gate (2 approvers)
  deploy:      # Blue/green deployment on EKS prod
  verify:      # Synthetic monitoring + rollback on failure
```

### Deployment Environments

| Environment | Branch | URL | Approval |
|---|---|---|---|
| Local | any | localhost | None |
| Development | develop | dev.dlc.internal | Auto |
| Staging | develop | staging.digitallabourcho wk.com | Auto |
| Production | main + tag | app.digitallabourcho wk.com | Manual (2-person) |

### Monitoring & Alerting

```yaml
# Metrics to monitor (Datadog dashboards)
- API latency p50/p95/p99 per endpoint
- Error rate (4xx/5xx) per service
- Job queue depth and processing lag
- Active WebSocket connections (for real-time tracking)
- Worker geo-ping freshness (< 30s = healthy)
- Payroll processing success rate
- OTP delivery rate (Twilio/MSG91)
- Database query duration p95
- Redis cache hit rate

# Alert thresholds (PagerDuty)
- 5xx error rate > 1% for 5min   → P2
- API latency p95 > 2000ms       → P3
- Job queue lag > 5 min          → P2
- Payroll job failure             → P1 (immediate)
- DB connections > 80% pool       → P2
- Disk usage > 85%               → P2
```

### Logging Architecture

```typescript
// Structured JSON logs — Datadog ingests and indexes
{
  "level": "error",
  "timestamp": "2026-05-27T10:30:00.000Z",
  "service": "backend",
  "env": "production",
  "requestId": "req_01hw5k9...",
  "userId": "usr_abc123",
  "module": "PayrollService",
  "message": "Payroll batch failed",
  "batchId": "batch_xyz",
  "workerCount": 47,
  "error": {
    "name": "PaymentGatewayException",
    "message": "Razorpay timeout after 30s",
    "code": "GATEWAY_TIMEOUT"
  }
}

// Log retention: 30 days hot (Datadog), 1 year cold (S3 archive)
// Audit logs: 7 years (regulatory requirement)
```

---

## 12. Testing Strategy

### Unit Testing (Jest — Backend)

```typescript
// Location: src/modules/{domain}/__tests__/{service}.spec.ts
// Target: 80% coverage on service layer minimum

describe('WorkerService', () => {
  let service: WorkerService;
  let repository: jest.Mocked<WorkerRepository>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WorkerService,
        { provide: WorkerRepository, useValue: createMockRepository() },
      ],
    }).compile();

    service = module.get(WorkerService);
    repository = module.get(WorkerRepository);
  });

  describe('findById', () => {
    it('should return worker when found', async () => { ... });
    it('should throw WorkerNotFoundException when not found', async () => { ... });
  });

  describe('processKyc', () => {
    it('should approve KYC and emit domain event', async () => { ... });
    it('should reject KYC with reason and send SMS', async () => { ... });
  });
});
```

### Integration Testing (Jest + Supertest)

```typescript
// Location: test/integration/{domain}.integration.spec.ts
// Uses real PostgreSQL (Docker test container) + real Redis

describe('Workers API (integration)', () => {
  let app: INestApplication;
  let jwtToken: string;

  beforeAll(async () => {
    // Spin up test DB + run migrations
    jwtToken = await getTestJwt(UserRole.CONTRACTOR);
  });

  it('POST /api/v1/workers — creates worker with valid data', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/workers')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(validCreateWorkerDto);

    expect(res.status).toBe(201);
    expect(res.body.data).toMatchObject({ phone: validCreateWorkerDto.phone });
  });
});
```

### E2E Testing (Playwright — Frontend)

```typescript
// Location: frontend/e2e/{flow}.spec.ts
// Target: all critical user journeys

test('Contractor can post job and hire worker', async ({ page }) => {
  await page.goto('/login');
  await loginAsContractor(page);

  await page.click('[data-testid="post-job-btn"]');
  await fillJobForm(page, testJobData);
  await page.click('[data-testid="submit-job"]');

  await expect(page.locator('[data-testid="job-posted-success"]')).toBeVisible();
});
```

### Flutter Testing

```dart
// Unit tests: test/unit/
// Widget tests: test/widget/
// Integration tests: integration_test/

testWidgets('WorkerCard shows verified badge for KYC approved workers', (tester) async {
  await tester.pumpWidget(
    ProviderScope(
      overrides: [workerProvider.overrideWithValue(mockVerifiedWorker)],
      child: MaterialApp(home: WorkerCard(workerId: 'test-id')),
    ),
  );

  expect(find.byKey(const Key('kyc-verified-badge')), findsOneWidget);
});
```

### API Testing (Postman / Newman)

```bash
# Collections: test/postman/{domain}.collection.json
# Environment files: test/postman/env/{environment}.json

# Run in CI
newman run test/postman/workers.collection.json \
  --environment test/postman/env/staging.json \
  --reporters cli,junit \
  --reporter-junit-export results/newman-report.xml
```

### Performance Testing (k6)

```javascript
// test/performance/worker-search.k6.js
// Target: 1000 concurrent users, p95 < 500ms

export const options = {
  vus: 1000,
  duration: '5m',
  thresholds: {
    http_req_duration: ['p(95)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function () {
  const res = http.get(`${BASE_URL}/api/v1/workers?city=mumbai&skill=mason`);
  check(res, { 'status 200': (r) => r.status === 200 });
}
```

### Coverage Targets

| Layer | Minimum | Target |
|---|---|---|
| Backend services | 80% | 90% |
| Backend controllers | 70% | 80% |
| Frontend hooks | 75% | 85% |
| Flutter domain usecases | 85% | 95% |
| E2E critical paths | 100% | 100% |

---

## 13. AI Agent Rules

> **MANDATORY** — All AI coding agents (Claude, Copilot, Cursor, Codeium) working on this codebase MUST follow these rules. Non-compliance will be caught in PR review.

### Architecture Rules

```
RULE-001  Never add business logic in controllers.
          Controllers validate input, call one service method, return response.

RULE-002  Never import one domain's entity repository into another domain's service.
          Cross-domain communication uses exported services or domain events.

RULE-003  Never use process.env directly in application code.
          Always use ConfigService. Add new config keys to the config module.

RULE-004  Never write raw SQL strings with string interpolation.
          Use TypeORM query builder or parameterized raw queries only.

RULE-005  Never create a service without a corresponding repository.
          The service layer must not know how data is stored.
```

### Code Quality Rules

```
RULE-006  Never duplicate error handling code.
          Create typed exceptions in the module's exceptions file.
          Let the global exception filter handle HTTP mapping.

RULE-007  Never return raw database entities from controllers.
          Always use Response DTOs. Map entities → DTOs in the service layer.

RULE-008  Never generate a module without Swagger documentation.
          Every controller method must have @ApiOperation, @ApiResponse decorators.

RULE-009  Never hardcode strings that will be user-visible.
          Use constants files for error codes, message templates.

RULE-010  Never skip DTO validation on any endpoint that accepts body or query params.
          Use @UsePipes(ValidationPipe) at the global or controller level.
```

### Security Rules

```
RULE-011  Never add an endpoint without @UseGuards(JwtAuthGuard) unless explicitly public.
          Public endpoints must have @Public() decorator to be intentional.

RULE-012  Never log sensitive fields.
          PII fields (phone, email, aadhaar) must be masked: phone → ***XXXXX1234.

RULE-013  Never trust file extensions for upload validation.
          Always validate MIME type server-side after reading file buffer.

RULE-014  Never store secrets in code, comments, or config files.
          Use AWS Secrets Manager references or environment variables only.

RULE-015  Never bypass rate limiting on auth or OTP endpoints.
          These are the primary DDoS and brute-force targets.
```

### Scalability Rules

```
RULE-016  Never perform blocking operations in the request thread.
          Heavy computation, external API calls, and batch processing use Bull queues.

RULE-017  Never add a feature that polls the database on a timer from the API server.
          Use database triggers, change data capture, or event sourcing.

RULE-018  Never load unbounded lists from the database.
          All list queries MUST have pagination. Default limit: 20. Maximum: 100.

RULE-019  Never make N+1 database queries.
          Use TypeORM relations with explicit JOIN or dataloader pattern.

RULE-020  Never cache data without a defined TTL and invalidation strategy.
          Document cache keys, TTLs, and invalidation triggers in code comments.
```

### DRY / Reuse Rules

```
RULE-021  Before creating a new utility function, check common/utils/.
          If it exists, use it. If it's missing, add it there for reuse.

RULE-022  Before creating a new guard or decorator, check common/decorators/ and common/guards/.
          Extend existing ones if possible.

RULE-023  Before writing a new TypeORM query pattern, check base.repository.ts.
          Common patterns (softDelete, findByIds, paginate) should live in the base.

RULE-024  Before creating a new Tailwind component pattern, check shadcn/ui primitives.
          Build on existing design system components, don't rebuild from scratch.

RULE-025  New Flutter widgets that appear in 2+ features belong in core/widgets/.
          Platform-specific one-offs stay in the feature folder.
```

### AI-Specific Instructions

```
When asked to add a new feature:
1. Identify which module it belongs to (or create a new module if justified)
2. Generate entity → repository → service → controller → module in that order
3. Add Swagger decorators to the controller
4. Add class-validator decorators to all DTOs
5. Create a spec file with at minimum happy path + not-found test
6. Update the module's barrel export (index.ts)

When asked to fix a bug:
1. First reproduce the issue by writing a failing test
2. Fix the code
3. Confirm the test now passes
4. Check if the same bug exists in similar code paths

When asked to refactor:
1. Confirm existing tests pass before refactoring
2. Refactor in small, compilable steps
3. Confirm tests pass after each step
4. Do not change behaviour during refactor — open a separate ticket for improvements

When unsure about architecture placement:
→ Ask: "Which bounded context owns this?" 
→ Prefer adding to an existing module over creating a new one
→ Prefer events for side-effects over direct service calls across modules
→ When in doubt, follow the pattern already established in the workers module
```

---

## Appendix

### Environment Variable Reference

```bash
# Application
NODE_ENV=production
PORT=3000
API_VERSION=v1

# Database
DATABASE_URL=postgresql://user:pass@host:5432/dlc_prod
DATABASE_POOL_MIN=5
DATABASE_POOL_MAX=20

# Redis
REDIS_URL=redis://host:6379
REDIS_TTL_SECONDS=3600

# JWT
JWT_PRIVATE_KEY_BASE64=<RS256 private key, base64 encoded>
JWT_PUBLIC_KEY_BASE64=<RS256 public key, base64 encoded>
JWT_ACCESS_EXPIRY=900
JWT_REFRESH_EXPIRY=604800

# AWS
AWS_REGION=ap-south-1
AWS_S3_BUCKET=dlc-documents-prod
AWS_S3_BUCKET_REGION=ap-south-1

# External Services
TWILIO_ACCOUNT_SID=...
TWILIO_AUTH_TOKEN=...
SENDGRID_API_KEY=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...

# Encryption
APP_ENCRYPTION_KEY=<32-byte hex key for AES-256-GCM>

# Monitoring
DATADOG_API_KEY=...
DATADOG_APP_KEY=...
```

### Useful Commands

```bash
# Backend
npm run dev                    # Start with hot reload
npm run build                  # Compile TypeScript
npm run test                   # Run unit tests
npm run test:cov               # Coverage report
npm run test:e2e               # E2E tests
npm run lint                   # ESLint
npm run migration:generate     # Generate migration from entity changes
npm run migration:run          # Run pending migrations
npm run migration:revert       # Revert last migration

# Frontend
npm run dev                    # Next.js dev server
npm run build                  # Production build
npm run type-check             # tsc --noEmit
npm run lint                   # ESLint + Prettier check
npm run test                   # Jest + React Testing Library

# Mobile
flutter run                    # Run on device/emulator
flutter test                   # Unit + widget tests
flutter build apk --release    # Android release build
flutter build ipa              # iOS release build
flutter gen-l10n               # Regenerate i18n files

# Docker
docker-compose up -d           # Start all local services
docker-compose down            # Stop all local services
docker-compose logs -f backend # Tail backend logs

# Database
npm run db:seed                # Seed development data
npm run db:reset               # Drop + recreate + migrate + seed (local only)
```

---

*This CLAUDE.md is a living document. Update it when architectural decisions change. All contributors — human and AI — are expected to know and follow it.*

*Last updated: May 2026 | Platform: Digital Labour Chowk v1.0 | Stack: NestJS + Next.js + Flutter*
