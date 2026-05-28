# Architecture.md — Digital Labour Chowk

> **Enterprise Architecture Reference Document**
> Version 1.0 | Authored for CTOs, Principal Engineers, and AI Coding Agents
> Platform: Labour Marketplace & Workforce Management System

---

## Table of Contents

1. [High-Level System Architecture](#1-high-level-system-architecture)
2. [Architecture Style](#2-architecture-style)
3. [Core Services Design](#3-core-services-design)
4. [API Gateway Design](#4-api-gateway-design)
5. [Database Architecture](#5-database-architecture)
6. [Realtime Systems](#6-realtime-systems)
7. [Cloud Infrastructure](#7-cloud-infrastructure)
8. [Security Architecture](#8-security-architecture)
9. [DevOps Architecture](#9-devops-architecture)
10. [Mobile App Architecture](#10-mobile-app-architecture)
11. [AI Recommendation Architecture](#11-ai-recommendation-architecture)
12. [Scalability Strategy](#12-scalability-strategy)
13. [Tech Stack Justification](#13-tech-stack-justification)
14. [Production Deployment Flow](#14-production-deployment-flow)

---

## 1. High-Level System Architecture

### System Context Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DIGITAL LABOUR CHOWK PLATFORM                        │
│                                                                               │
│  ┌─────────────┐   ┌─────────────────┐   ┌──────────────┐  ┌─────────────┐ │
│  │  Worker App  │   │ Contractor Dash │   │ Enterprise   │  │ Admin Panel │ │
│  │  (Flutter)   │   │   (Next.js)     │   │  Portal      │  │  (Next.js)  │ │
│  └──────┬───────┘   └────────┬────────┘   │  (Next.js)   │  └──────┬──────┘ │
│         │                    │            └──────┬───────┘         │        │
│         └────────────────────┴───────────────────┴─────────────────┘        │
│                                           │                                  │
│                              ┌────────────▼────────────┐                    │
│                              │      API GATEWAY         │                    │
│                              │  (Kong / AWS API GW)     │                    │
│                              │  - JWT Validation        │                    │
│                              │  - Rate Limiting         │                    │
│                              │  - Request Routing       │                    │
│                              │  - Load Balancing        │                    │
│                              └────────────┬────────────┘                    │
│                                           │                                  │
│              ┌────────────────────────────┼────────────────────────────┐    │
│              │                            │                            │    │
│   ┌──────────▼──────────┐   ┌────────────▼────────┐  ┌───────────────▼──┐  │
│   │   CORE SERVICES      │   │  REALTIME SERVICES  │  │  ASYNC SERVICES  │  │
│   │  (NestJS Modules)    │   │  (Socket.io/WS)     │  │  (Bull Queues)   │  │
│   └─────────────────────┘   └─────────────────────┘  └──────────────────┘  │
│              │                            │                            │    │
│   ┌──────────▼──────────────────────────────────────────────────────▼──┐   │
│   │                     DATA LAYER                                       │   │
│   │   PostgreSQL (RDS)  │  Redis (ElastiCache)  │  Elasticsearch  │  S3 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────────────────┐
│              FRONTEND LAYER (3 Apps)                 │
│                                                       │
│  ┌──────────────────────┐  ┌───────────────────────┐ │
│  │  Contractor Dashboard │  │  Enterprise Portal    │ │
│  │  Next.js 15 (App Dir) │  │  Next.js 15 (App Dir) │ │
│  │  ├── Auth module      │  │  ├── Auth module       │ │
│  │  ├── Workers module   │  │  ├── Vendors module    │ │
│  │  ├── Jobs module      │  │  ├── Analytics module  │ │
│  │  ├── Attendance module│  │  ├── Compliance module │ │
│  │  ├── Payroll module   │  │  └── Reports module    │ │
│  │  └── Maps module      │  └───────────────────────┘ │
│  └──────────────────────┘                             │
│                                                       │
│  ┌──────────────────────────────────────────────────┐ │
│  │              Admin Panel                          │ │
│  │              Next.js 15 (App Dir)                 │ │
│  │  ├── User management    ├── Dispute resolution    │ │
│  │  ├── Platform analytics ├── Content moderation    │ │
│  │  └── System config      └── Audit logs            │ │
│  └──────────────────────────────────────────────────┘ │
│                                                       │
│  Shared: shadcn/ui, Zustand, TanStack Query v5        │
│  CDN: AWS CloudFront (static assets, images)          │
└─────────────────────────────────────────────────────┘
```

### Backend Architecture

```
┌────────────────────────────────────────────────────────────┐
│                  BACKEND LAYER (NestJS)                     │
│                                                              │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │  Auth    │ │  Worker  │ │   Job    │ │  Attendance  │  │
│  │  Module  │ │  Module  │ │  Module  │ │    Module    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐  │
│  │ Payroll  │ │  Notify  │ │Analytics │ │    Admin     │  │
│  │  Module  │ │  Module  │ │  Module  │ │    Module    │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────┘  │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              COMMON INFRASTRUCTURE                   │   │
│  │  EventEmitter | Bull Queues | WebSocket Gateway      │   │
│  │  Global Filters | Interceptors | Guards              │   │
│  └─────────────────────────────────────────────────────┘   │
└────────────────────────────────────────────────────────────┘
```

### Mobile Architecture

```
┌─────────────────────────────────────────────┐
│          WORKER APP (Flutter)                │
│                                              │
│  Presentation → Domain → Data               │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │  Features                              │  │
│  │  auth | jobs | attendance | wallet     │  │
│  │  profile | notifications | tracking   │  │
│  └────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────┐  │
│  │  Local Storage: Hive (offline-first)   │  │
│  │  Sync Engine: Background service       │  │
│  │  Location: Geo-fence + periodic ping   │  │
│  └────────────────────────────────────────┘  │
└─────────────────────────────────────────────┘
```

### Database Architecture (Overview)

```
┌─────────────────────────────────────────────────────────────┐
│                    DATA LAYER                                 │
│                                                               │
│  ┌─────────────────────┐    ┌──────────────────────────────┐ │
│  │   PostgreSQL 16      │    │        Redis 7               │ │
│  │   (Aurora RDS)       │    │     (ElastiCache)            │ │
│  │                      │    │                              │ │
│  │  Primary (writer)    │    │  Cluster Mode (3 shards)     │ │
│  │  Read Replica x2     │    │  - Sessions                  │ │
│  │  (Mumbai + DR)       │    │  - OTP store                 │ │
│  │                      │    │  - Rate limits               │ │
│  │  Partitioning:       │    │  - Job queues (BullMQ)       │ │
│  │  - attendance by mo  │    │  - Geo cache                 │ │
│  │  - payroll by year   │    │  - Hot worker profiles       │ │
│  └─────────────────────┘    └──────────────────────────────┘ │
│                                                               │
│  ┌─────────────────────┐    ┌──────────────────────────────┐ │
│  │  Elasticsearch 8    │    │        AWS S3                │ │
│  │  (3-node cluster)   │    │   (private + public CDN)     │ │
│  │  - Worker search    │    │   - Documents / KYC images   │ │
│  │  - Job search       │    │   - Profile photos           │ │
│  │  - Full-text search │    │   - Payslip PDFs             │ │
│  └─────────────────────┘    └──────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Cloud Architecture (AWS — ap-south-1)

```
┌──────────────────────────────────────────────────────────────────┐
│                      AWS — ap-south-1 (Mumbai)                    │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐  │
│  │                    VPC (10.0.0.0/16)                         │  │
│  │                                                               │  │
│  │  ┌──────────────────────┐  ┌──────────────────────────────┐  │  │
│  │  │  Public Subnets       │  │   Private Subnets            │  │  │
│  │  │  (AZ-a, AZ-b, AZ-c)  │  │   (AZ-a, AZ-b, AZ-c)        │  │  │
│  │  │  - ALB               │  │   - EKS Worker Nodes         │  │  │
│  │  │  - NAT Gateways      │  │   - RDS Aurora               │  │  │
│  │  │  - Bastion Host      │  │   - ElastiCache Redis        │  │  │
│  │  └──────────────────────┘  │   - Elasticsearch            │  │  │
│  │                             └──────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Route 53 → CloudFront → ALB → EKS (Ingress) → Services          │
│  S3 (static) ←→ CloudFront (CDN)                                  │
│  ACM (TLS) | WAF | Shield Standard                                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Style

### Decision: Modular Monolith with Microservices Extraction Path

#### Why NOT pure microservices from day one

| Concern | Pure Microservices | Modular Monolith |
|---|---|---|
| Operational complexity | Very high (12+ deployments) | Low (1 deployment) |
| Developer velocity (early) | Slow (network hops, service contracts) | Fast |
| Data consistency | Hard (distributed transactions) | Simple (single DB ACID) |
| Debugging | Difficult (distributed tracing required) | Simple (single process) |
| Team size required | Large (1 team per service) | Small to medium |
| Infrastructure cost | High (12+ containers) | Low |

#### Why NOT a traditional monolith

A classic Rails/Django-style monolith becomes a ball of mud at scale. The Modular Monolith solves this by enforcing module boundaries, making future microservice extraction a **refactor, not a rewrite**.

#### Recommended Architecture: Modular Monolith Phase 1 → Selective Microservices Phase 2

```
PHASE 1 (0–500k users): Single NestJS application, strong module boundaries
─────────────────────────────────────────────────────────────────────────────
NestJS App
├── AuthModule         (isolated, no domain deps)
├── WorkerModule       (owns Worker aggregate)
├── ContractorModule   (owns Contractor aggregate)
├── JobModule          (orchestrates Worker + Contractor)
├── AttendanceModule   (event consumer: jobs.assigned)
├── PayrollModule      (event consumer: attendance.closed)
├── NotificationModule (event consumer: all domain events)
└── AnalyticsModule    (event consumer: all events, read-only)

PHASE 2 (500k–5M users): Extract high-load or team-boundary services
─────────────────────────────────────────────────────────────────────────────
Extract as independent services:
1. NotificationService    → extremely high volume, isolated infra
2. AttendanceService      → real-time geo data, different scaling needs
3. PayrollService         → financial isolation, compliance boundary
4. AnalyticsService       → read-heavy, own data pipeline (Kafka → data warehouse)
5. AI/RecommendationService → Python (ML), own scaling profile

Remaining core stays as a monolith until team size justifies further split.
```

### Event-Driven Workflows

```
Domain Event Flow:

WorkerRegistered ──────────────────────┬──→ NotificationModule (welcome SMS)
                                        ├──→ AnalyticsModule (user funnel)
                                        └──→ AIModule (create embedding)

JobApplicationSubmitted ───────────────┬──→ NotificationModule (notify contractor)
                                        └──→ AIModule (update matching score)

AttendanceCheckedIn ───────────────────┬──→ NotificationModule (confirm to worker)
                                        ├──→ SiteModule (update headcount)
                                        └──→ AnalyticsModule (live dashboard)

PayrollProcessed ──────────────────────┬──→ NotificationModule (payslip + SMS)
                                        ├──→ WorkerModule (update wallet balance)
                                        └──→ AuditModule (immutable record)
```

### Service Communication Patterns

```
Synchronous (REST):
  Client → API Gateway → Service
  Use for: user-facing requests requiring immediate response

Synchronous (gRPC) [Phase 2]:
  Service A ↔ Service B
  Use for: internal service-to-service (low latency, typed contracts)

Asynchronous (Domain Events via EventEmitter2):
  Service A emits → EventBus → Service B handles
  Use for: cross-domain side effects (Phase 1)

Asynchronous (Message Queue via BullMQ):
  Producer → Redis Queue → Worker Process
  Use for: background jobs (payroll processing, bulk SMS, report generation)

Asynchronous (Kafka) [Phase 2, Analytics]:
  All domain events → Kafka topics → Analytics consumers
  Use for: event sourcing, audit trail, data warehouse ingestion
```

---

## 3. Core Services Design

### 3.1 Authentication Service

```
Responsibility: Identity, session management, OTP, token lifecycle

Endpoints:
  POST /auth/send-otp          → Send OTP to phone (SMS via MSG91)
  POST /auth/verify-otp        → Verify OTP, return access + refresh tokens
  POST /auth/refresh            → Rotate tokens using refresh token
  POST /auth/logout             → Invalidate refresh token
  POST /auth/logout-all         → Invalidate all sessions for user

Token Architecture:
  ┌─────────────────────────────────────────────────┐
  │  Access Token (JWT, RS256)                       │
  │  - Expiry: 15 minutes                            │
  │  - Payload: userId, role, phone, sessionId       │
  │  - Stored: memory only (never localStorage)      │
  └─────────────────────────────────────────────────┘
  ┌─────────────────────────────────────────────────┐
  │  Refresh Token (opaque UUID)                     │
  │  - Expiry: 7 days (workers), 30 days (web apps)  │
  │  - Stored: HttpOnly Secure SameSite=Strict cookie│
  │  - Backed: Redis hash {userId → Set<tokenId>}    │
  └─────────────────────────────────────────────────┘

OTP Flow:
  1. Client POST /auth/send-otp { phone }
  2. Generate 6-digit OTP
  3. Store in Redis: key=otp:{phone}, value=hash(OTP), ttl=180s
  4. Store attempt count: key=otp:attempts:{phone}, ttl=900s
  5. If attempts >= 5 → lock for 15 minutes
  6. Send via MSG91 (primary) / Twilio (fallback)
  7. Client POST /auth/verify-otp { phone, otp }
  8. Compare hash(otp) with Redis value
  9. Delete OTP key, issue JWT pair
```

### 3.2 Worker Service

```
Responsibility: Worker lifecycle, profile, skills, KYC, documents

Domain Entities:
  Worker           → core identity, contact, location, status
  WorkerSkill      → skill type, level, years of experience, verified flag
  WorkerDocument   → Aadhaar, PAN, certificates, photos
  WorkerRating     → rating by contractor post-job
  WorkerAvailability → availability windows, preferred locations

Key Operations:
  Registration      → phone OTP → basic profile → skill tagging
  KYC Verification  → Aadhaar OCR (AWS Textract) → liveness check → manual review
  Skill Verification → document upload → AI validation → badge issuance
  Profile Scoring   → completeness score drives search ranking

State Machine:
  REGISTERED → KYC_PENDING → KYC_VERIFIED → ACTIVE ← → SUSPENDED → DEACTIVATED
                           ↘ KYC_REJECTED ↗

Search Architecture:
  Worker profiles synced to Elasticsearch on update (via event)
  Search fields: name, skills, city, pincode, availability, rating, wage range
  Elasticsearch index: workers_v2 (aliased for zero-downtime reindex)
```

### 3.3 Contractor Service

```
Responsibility: Contractor and company profile, site management, team management

Domain Entities:
  Contractor       → individual contractor identity
  Company          → registered company (can have multiple contractors)
  ContractorSite   → construction site belonging to a contractor
  ContractorTeam   → saved worker groups for reuse

Key Operations:
  Onboarding        → GST verification → company profile → site setup
  Worker Favourites → save shortlisted workers
  Hiring History    → past workers, ratings given
  Credit/Subscription → platform subscription tier, posting credits
```

### 3.4 Job Service

```
Responsibility: Job lifecycle, applications, hiring decisions, worker matching

Domain Entities:
  Job              → posting (title, skills, location, duration, wage)
  JobApplication   → worker applying to a job
  HireRecord       → confirmed hire (worker ↔ job ↔ contractor)
  JobTemplate      → reusable job posting templates

State Machines:

  Job:
  DRAFT → PUBLISHED → ACTIVE → FILLED → COMPLETED → CLOSED
                ↘ EXPIRED ↗

  Application:
  SUBMITTED → SHORTLISTED → INTERVIEW_SCHEDULED → HIRED
                           ↘ REJECTED

Matching Engine:
  On job publish → emit JobPublished event
  AI Service consumes → scores eligible workers → stores ranked list in Redis
  GET /jobs/:id/recommended-workers → reads from Redis ranked list
  Background refresh: every 6 hours or on new application

Worker-to-Job Recommendations:
  On worker profile update → emit WorkerProfileUpdated event
  AI Service recalculates matching jobs → stores in Redis sorted set
  GET /workers/:id/recommended-jobs → reads from Redis
```

### 3.5 Attendance Service

```
Responsibility: Check-in/out, geo-fence validation, biometric, timesheet

Domain Entities:
  AttendanceRecord  → check-in/out timestamps, GPS coords, method
  GeoFence          → site boundary polygon (GeoJSON)
  BiometricRecord   → selfie-based liveness check reference
  Timesheet         → daily/weekly aggregated hours per worker per site

Check-in Flow:
  1. Worker opens app on site
  2. App requests GPS location
  3. App sends POST /attendance/check-in { siteId, geoCoords, selfie? }
  4. Server validates: worker is hired for this site's active job
  5. Server validates: GPS coords within site's geo-fence polygon
  6. If enabled: compare selfie to profile photo (AWS Rekognition)
  7. Create AttendanceRecord, emit AttendanceCheckedIn event
  8. Realtime: push confirmation to contractor dashboard (WebSocket)

Geo-Fence Validation:
  Site boundary stored as PostGIS POLYGON geometry
  Query: SELECT ST_Within(ST_Point($lon, $lat), site.boundary) FROM sites
  False GPS detection: velocity check (if > 100 km/h since last ping → flag)

GPS Tracking (Active Jobs Only):
  Worker app sends location every 60 seconds while job is active
  Stored in Redis Sorted Set: key=site:{siteId}:workers, score=timestamp
  Displayed on contractor dashboard via WebSocket stream
  Stored to DB (location_pings table) in batches every 5 minutes
```

### 3.6 Payroll Service

```
Responsibility: Wage calculation, deductions, disbursement, payslips, compliance

Domain Entities:
  PayrollBatch      → group of payroll records processed together
  PayrollRecord     → individual worker pay for a period
  WageStructure     → base wage, overtime multiplier, allowances per job
  Deduction         → PF, ESI, advance recovery, penalties
  Disbursement      → payment instruction sent to payment gateway
  PayslipDocument   → generated PDF stored in S3

Payroll Calculation Flow:
  1. Trigger: manual (contractor) or automated (cron, monthly)
  2. Aggregate attendance: sum working hours per worker per period
  3. Apply wage structure: base × days + overtime × multiplier
  4. Apply deductions: statutory (PF 12%, ESI 0.75%) + custom
  5. Generate PayrollRecord for each worker
  6. Create PayrollBatch, status = PENDING_APPROVAL
  7. Contractor reviews + approves
  8. Batch status → PROCESSING
  9. Submit to payment gateway (Razorpay Payouts / NEFT)
  10. On callback: update disbursement status
  11. Generate payslip PDF (PDFKit), upload to S3
  12. Emit PayrollProcessed event (triggers SMS + in-app notification)

Idempotency:
  Every disbursement has an idempotency key (batchId + workerId)
  Prevents double payment on gateway retries
```

### 3.7 Notification Service

```
Responsibility: Multi-channel notification delivery (push, SMS, email, in-app)

Channels:
  Push    → Firebase Cloud Messaging (Android + iOS)
  SMS     → MSG91 (primary) + Twilio (failover)
  Email   → SendGrid (transactional)
  In-app  → stored in DB, delivered via WebSocket on connection

Notification Events Handled:
  worker.registered              → Welcome SMS + push
  job.application.submitted      → Push to contractor
  job.application.hired          → SMS + push to worker
  attendance.checked_in          → In-app confirmation to worker
  payroll.processed              → SMS + push + email (payslip PDF link)
  kyc.approved / kyc.rejected    → SMS + push to worker
  job.expiring_soon              → Push to contractor (24h warning)

Queue Architecture:
  All notification sends go through BullMQ queues (priority-based)
  High priority: OTP, payment confirmation, KYC decisions
  Normal priority: job matches, application updates
  Low priority: weekly reports, marketing messages

Retry Strategy:
  SMS: retry 3x with exponential backoff (1s, 5s, 30s)
  Push: retry 2x (FCM has own retry), mark token invalid on 404
  Email: retry 5x over 1 hour (transient SMTP errors)

Template Management:
  Templates stored in DB (supports Hindi/English/regional)
  Variables: {{workerName}}, {{jobTitle}}, {{amount}}, {{date}}
  Template versioning for A/B testing
```

### 3.8 Analytics Service

```
Responsibility: Business intelligence, dashboards, reports, data exports

Data Sources:
  Domain events (all services) → consumed by Analytics handlers
  Read replicas of PostgreSQL → heavy aggregation queries
  Elasticsearch → worker/job metrics

Key Metrics:

  Platform Level:
    - Daily/Monthly Active Workers, Contractors
    - Job fill rate, time-to-fill
    - Worker retention rate
    - Platform GMV (gross wages processed)
    - Geographic heat maps (demand vs supply)

  Contractor Level:
    - Hire rate by skill, location
    - Average time-to-hire
    - Payroll trend
    - Worker attendance reliability scores

  Worker Level:
    - Jobs applied vs offered
    - Attendance consistency score
    - Wage trend over time
    - Skill demand heat map

Report Generation:
  On-demand → BullMQ job → PDF/Excel via ExcelJS/PDFKit → S3 link
  Scheduled → cron → weekly contractor digest email
```

### 3.9 Admin Service

```
Responsibility: Platform governance, moderation, dispute resolution, configuration

Capabilities:
  User management         → suspend, ban, restore accounts
  KYC review queue        → approve/reject with reason
  Dispute resolution       → mediate worker-contractor conflicts
  Content moderation       → flag inappropriate job postings
  Platform configuration   → feature flags, rate limits, subscription pricing
  Revenue dashboard        → subscription revenue, GMV, take rate
  Audit log viewer         → immutable trail of all admin actions
  Fraud signals            → workers with multiple Aadhaar submissions
```

---

## 4. API Gateway Design

### Gateway Architecture

```
Internet
    │
    ▼
Route 53 (DNS)
    │
    ▼
CloudFront (CDN + WAF + DDoS protection)
    │
    ▼
Application Load Balancer (ALB) — HTTPS termination, ACM cert
    │
    ▼
API Gateway (Kong OSS on EKS)
    │
    ├── Plugin: JWT Validation (RS256 public key)
    ├── Plugin: Rate Limiting (Redis-backed)
    ├── Plugin: Request ID injection
    ├── Plugin: CORS
    ├── Plugin: Request/Response logging
    ├── Plugin: IP Allowlist (admin routes)
    └── Plugin: Prometheus metrics
    │
    ▼
NestJS Application (EKS Pods)
```

### JWT Validation at Gateway

```yaml
# Kong JWT Plugin config
jwt:
  key_claim_name: kid
  claims_to_verify: [exp, nbf]
  algorithms: [RS256]
  run_on_preflight: false

# Public key fetched from /.well-known/jwks.json
# Key rotation: new key pair generated monthly
# Grace period: old key accepted 24h after rotation
```

### Rate Limiting Strategy

```
Tier          Limit                  Scope         Backend
──────────────────────────────────────────────────────────
Global IP     1000 req/min           Per IP        Redis
Auth (OTP)    10 req/15min           Per IP        Redis
Auth (login)  20 req/min             Per IP        Redis
Worker API    300 req/min            Per user JWT  Redis
Contractor    500 req/min            Per user JWT  Redis
Enterprise    2000 req/min           Per org JWT   Redis
Admin         unlimited              Allowlisted   N/A
File upload   10 uploads/hour        Per user      Redis
Search        120 req/min            Per user JWT  Redis
```

### Request Routing

```
Route                        Upstream Service       Auth Required
──────────────────────────────────────────────────────────────────
/api/v1/auth/*               auth-service           No
/api/v1/workers/*            worker-service         Yes (Worker)
/api/v1/contractors/*        contractor-service     Yes (Contractor)
/api/v1/jobs/*               job-service            Yes (any role)
/api/v1/attendance/*         attendance-service     Yes (Worker/Contractor)
/api/v1/payroll/*            payroll-service        Yes (Contractor+)
/api/v1/notifications/*      notification-service   Yes (any role)
/api/v1/analytics/*          analytics-service      Yes (Contractor+)
/api/v1/admin/*              admin-service          Yes (Admin roles only)
/ws                          websocket-service      Yes (JWT in query param)
/.well-known/jwks.json       auth-service           No
/health                      all services           No
```

### API Aggregation (BFF Pattern)

```typescript
// Backend-for-Frontend pattern for dashboard home page
// Instead of client making 5 API calls, one aggregated endpoint

GET /api/v1/bff/contractor/dashboard

// Internally (parallel execution):
const [stats, recentJobs, pendingApplications, siteStatus, pendingPayroll] =
  await Promise.all([
    this.analyticsService.getContractorStats(contractorId),
    this.jobService.getRecentJobs(contractorId, 5),
    this.jobService.getPendingApplications(contractorId),
    this.siteService.getActiveSiteStatus(contractorId),
    this.payrollService.getPendingBatches(contractorId),
  ]);

// Returns single aggregated response — reduces mobile/browser round trips
```

---

## 5. Database Architecture

### Schema Design Philosophy

```
Principles:
1. UUID primary keys everywhere (not sequential integers)
2. Soft deletes via deleted_at (no hard DELETE in app code)
3. Audit fields on every table (created_at, updated_at, created_by, updated_by)
4. Sensitive fields encrypted at application layer (not DB-level only)
5. PostGIS extension for geospatial data (attendance, sites)
6. Partitioning for high-volume append-only tables
7. Read replicas for analytics and reporting queries
```

### Core Schema (Key Tables)

```sql
-- Workers
CREATE TABLE workers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone           VARCHAR(15) NOT NULL UNIQUE,
  full_name       VARCHAR(100) NOT NULL,
  date_of_birth   DATE,
  gender          VARCHAR(10),
  city            VARCHAR(100),
  state           VARCHAR(100),
  pincode         CHAR(6),
  primary_skill   VARCHAR(50),
  experience_years SMALLINT DEFAULT 0,
  kyc_status      VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  worker_status   VARCHAR(30) NOT NULL DEFAULT 'REGISTERED',
  profile_score   SMALLINT DEFAULT 0,
  aadhaar_encrypted TEXT,        -- AES-256-GCM ciphertext
  aadhaar_last_four CHAR(4),     -- for display
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ,
  created_by      UUID
);

CREATE INDEX idx_workers_phone         ON workers(phone);
CREATE INDEX idx_workers_city_skill    ON workers(city, primary_skill);
CREATE INDEX idx_workers_kyc_status    ON workers(kyc_status);
CREATE INDEX idx_workers_active        ON workers(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_workers_fts           ON workers
  USING GIN(to_tsvector('simple', full_name));

-- Jobs
CREATE TABLE jobs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id   UUID NOT NULL REFERENCES contractors(id),
  site_id         UUID REFERENCES sites(id),
  title           VARCHAR(200) NOT NULL,
  description     TEXT,
  required_skill  VARCHAR(50) NOT NULL,
  worker_count    SMALLINT NOT NULL,
  daily_wage      DECIMAL(10,2) NOT NULL,
  start_date      DATE NOT NULL,
  end_date        DATE,
  job_type        VARCHAR(30) NOT NULL, -- DAILY, WEEKLY, CONTRACT
  job_status      VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
  city            VARCHAR(100),
  state           VARCHAR(100),
  latitude        DECIMAL(9,6),
  longitude       DECIMAL(9,6),
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_jobs_contractor       ON jobs(contractor_id);
CREATE INDEX idx_jobs_status_skill     ON jobs(job_status, required_skill);
CREATE INDEX idx_jobs_location         ON jobs(city, state);
CREATE INDEX idx_jobs_dates            ON jobs(start_date, end_date);

-- Attendance (PARTITIONED by month)
CREATE TABLE attendance_records (
  id              UUID NOT NULL DEFAULT gen_random_uuid(),
  worker_id       UUID NOT NULL,
  job_id          UUID NOT NULL,
  site_id         UUID NOT NULL,
  check_in_time   TIMESTAMPTZ NOT NULL,
  check_out_time  TIMESTAMPTZ,
  check_in_lat    DECIMAL(9,6),
  check_in_lon    DECIMAL(9,6),
  check_out_lat   DECIMAL(9,6),
  check_out_lon   DECIMAL(9,6),
  geo_fence_valid BOOLEAN DEFAULT TRUE,
  method          VARCHAR(30) DEFAULT 'GPS', -- GPS, BIOMETRIC, MANUAL
  total_hours     DECIMAL(4,2),
  created_at      TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (check_in_time);

-- Create monthly partitions (automated via pg_partman)
CREATE TABLE attendance_records_2026_05
  PARTITION OF attendance_records
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');

CREATE INDEX idx_attendance_worker_date
  ON attendance_records(worker_id, check_in_time);
CREATE INDEX idx_attendance_job_date
  ON attendance_records(job_id, check_in_time);

-- Sites with PostGIS
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE sites (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  contractor_id   UUID NOT NULL REFERENCES contractors(id),
  name            VARCHAR(200) NOT NULL,
  address         TEXT,
  city            VARCHAR(100),
  state           VARCHAR(100),
  latitude        DECIMAL(9,6),
  longitude       DECIMAL(9,6),
  boundary        GEOGRAPHY(POLYGON, 4326), -- PostGIS geo-fence
  radius_meters   INTEGER DEFAULT 100,
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  deleted_at      TIMESTAMPTZ
);

CREATE INDEX idx_sites_boundary ON sites USING GIST(boundary);
CREATE INDEX idx_sites_contractor ON sites(contractor_id);

-- Payroll (PARTITIONED by year)
CREATE TABLE payroll_records (
  id              UUID NOT NULL DEFAULT gen_random_uuid(),
  batch_id        UUID NOT NULL,
  worker_id       UUID NOT NULL,
  job_id          UUID NOT NULL,
  period_start    DATE NOT NULL,
  period_end      DATE NOT NULL,
  working_days    SMALLINT NOT NULL,
  total_hours     DECIMAL(6,2) NOT NULL,
  gross_amount    DECIMAL(12,2) NOT NULL,
  pf_deduction    DECIMAL(10,2) DEFAULT 0,
  esi_deduction   DECIMAL(10,2) DEFAULT 0,
  other_deductions DECIMAL(10,2) DEFAULT 0,
  net_amount      DECIMAL(12,2) NOT NULL,
  payment_status  VARCHAR(30) NOT NULL DEFAULT 'PENDING',
  utr_number      VARCHAR(50),          -- bank transaction reference
  payslip_url     TEXT,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (period_start);
```

### Redis Cache Design

```
Key Pattern                          Type        TTL       Purpose
─────────────────────────────────────────────────────────────────────
session:{userId}:{sessionId}         Hash        7 days    Refresh token validation
otp:{phone}                          String      3 min     OTP value (hashed)
otp:attempts:{phone}                 String      15 min    Rate limit attempts
rl:{ip}:{endpoint}                   String      1 min     Rate limiting counter
worker:profile:{workerId}            Hash        1 hour    Hot worker profile cache
worker:jobs:{workerId}               String(JSON) 30 min   Recommended jobs list
job:workers:{jobId}                  String(JSON) 30 min   Recommended workers list
site:{siteId}:workers                ZSet        5 min     Live worker locations
attendance:pending:{workerId}        String      24 hours  Unsynced offline checkins
contractor:dashboard:{id}            String(JSON) 5 min    Dashboard BFF cache
fcm:token:{userId}                   String      30 days   FCM device token
search:workers:{queryHash}           String(JSON) 10 min   Search result cache
queue:notifications                  List        —         BullMQ notification jobs
queue:payroll                        List        —         BullMQ payroll jobs
queue:reports                        List        —         BullMQ report gen jobs
```

### Read Replica Routing

```typescript
// TypeORM multi-connection configuration
TypeOrmModule.forRoot({
  type: 'postgres',
  replication: {
    master: {
      host: process.env.DB_MASTER_HOST,
      port: 5432,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: 'dlc_production',
    },
    slaves: [
      { host: process.env.DB_REPLICA_1_HOST, port: 5432, ... },
      { host: process.env.DB_REPLICA_2_HOST, port: 5432, ... },
    ],
  },
})

// All SELECT queries auto-routed to replica (round-robin)
// All INSERT/UPDATE/DELETE routed to master
// Analytics service always uses replica (via separate connection)
```

### Database Scaling Strategy

```
Phase 1 (0–100k workers):
  db.r6g.large (2 vCPU, 16 GB) + 1 read replica
  Single PostgreSQL instance
  Connection pool: 20 connections (PgBouncer)

Phase 2 (100k–1M workers):
  Aurora PostgreSQL (db.r6g.2xlarge, 8 vCPU, 64 GB)
  2 read replicas (different AZs)
  PgBouncer sidecar (pool size: 100)
  Enable Aurora Auto Scaling for replicas

Phase 3 (1M+ workers):
  Aurora Serverless v2 (auto-scales 0.5–64 ACU)
  Up to 5 read replicas
  Separate Aurora cluster for analytics (replica lag acceptable)
  CQRS: writes to master, reads from replica via separate repository
  Consider Citus (horizontal sharding) for attendance/payroll tables
```

---

## 6. Realtime Systems

### WebSocket Architecture

```
Client (Flutter App / Browser)
    │
    │  ws://api.dlc.com/ws?token=<jwt>
    ▼
API Gateway (Kong WebSocket passthrough)
    │
    ▼
NestJS WebSocket Gateway (Socket.io)
    │
    ├── Namespace: /workers
    │     Rooms: worker:{workerId}
    │     Events: job.match, notification, payroll.update
    │
    ├── Namespace: /contractors
    │     Rooms: contractor:{contractorId}, site:{siteId}
    │     Events: worker.checkin, worker.location, application.received
    │
    └── Namespace: /admin
          Rooms: admin:global
          Events: platform.alert, fraud.signal

Horizontal Scaling Problem:
  Socket.io sticky sessions + Redis adapter (socket.io-redis)
  All pods share same channel via Redis pub/sub
  When pod A emits to room, Redis broadcasts to all pods
  Pod with client connection delivers the message
```

### Notification Delivery Flow

```
Domain Event Emitted
      │
      ▼
NotificationService.handleEvent()
      │
      ├── Determine channels (push, SMS, email, in-app)
      ├── Render template with variables
      ├── Create in-app notification record in DB
      │
      ├── Push via BullMQ queue → FCM processor
      ├── SMS via BullMQ queue → MSG91 processor
      └── Email via BullMQ queue → SendGrid processor

      In-app (WebSocket):
      If user is connected → emit directly via socket.io
      If user is offline → stored in DB, fetched on next app open

Push Notification Fallback:
  FCM delivery receipt → if failed (token invalid) → remove token
  If no valid FCM token → fallback to SMS
  If SMS fails → email (if available)
  All delivery attempts logged for debugging
```

### Real-Time Attendance Tracking

```
Worker App Flow:
  1. Job starts → app enters "active job" mode
  2. Every 60 seconds: background service reads GPS
  3. POST /attendance/location { jobId, lat, lng, timestamp, battery }
  4. Server stores in Redis ZSet (score = timestamp)
  5. Server validates geo-fence (< 500m from site)
  6. If outside fence for > 10 min → alert contractor
  7. Server emits via WebSocket to contractor dashboard

Contractor Dashboard:
  Connected to /contractors WebSocket namespace
  Joins room: site:{siteId}
  Receives: worker.location events (workerId, lat, lng, timestamp)
  Renders: live dot on Mapbox map, updates every 60s

Data Retention:
  Redis: last 5 hours of location data (for live map)
  PostgreSQL: daily aggregated pings (for audit/dispute)
  Raw GPS data: archived to S3 after 30 days
```

### GPS Update Architecture

```
Flutter Background Service (work_manager package):
  Registered task: "location_ping" — 60 second period
  Reads GPS: location package (high accuracy when on site)
  Batches: accumulates 5 pings if offline, sends on reconnect

Offline Handling:
  If no internet → store in Hive local DB
  On reconnect → background sync → POST /attendance/location/batch
  Server accepts batch (up to 24h old) — marks as "offline-submitted"

Server Processing (attendance/location endpoint):
  1. Validate JWT + active job association
  2. Calculate distance from site center (Haversine formula)
  3. Update Redis: ZADD site:{siteId}:workers timestamp {workerId:lat:lng}
  4. Pub/sub: PUBLISH site:{siteId}:location_update {workerId, lat, lng}
  5. Socket.io Redis adapter broadcasts to contractor WebSocket room
  6. Every 5 min: batch flush Redis pings to DB (location_pings table)
```

---

## 7. Cloud Infrastructure

### AWS Architecture (Production)

```
┌─────────────────────────────────────────────────────────────────────┐
│  AWS ap-south-1 (Mumbai) — Primary Region                            │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────────┐  │
│  │  Edge Layer                                                     │  │
│  │  Route 53 (health-checked failover) → CloudFront (CDN + WAF)   │  │
│  │  ACM (TLS certs, auto-renewed)                                  │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                │                                      │
│  ┌─────────────────────────────▼──────────────────────────────────┐  │
│  │  Public Subnets (10.0.1.0/24, 10.0.2.0/24, 10.0.3.0/24)       │  │
│  │  ┌─────────────────────────────────────────────────────────┐   │  │
│  │  │  ALB (internet-facing)                                   │   │  │
│  │  │  Listeners: :443 → Target Group (EKS NodePort)           │   │  │
│  │  │             :80  → Redirect to :443                      │   │  │
│  │  └─────────────────────────────────────────────────────────┘   │  │
│  │  NAT Gateways (one per AZ for HA)                               │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                │                                      │
│  ┌─────────────────────────────▼──────────────────────────────────┐  │
│  │  Private Subnets (10.0.10.0/24, 10.0.11.0/24, 10.0.12.0/24)   │  │
│  │                                                                  │  │
│  │  EKS Cluster (1.31)                                             │  │
│  │  ├── System Node Group: t3.medium x3 (Kube system + monitoring)│  │
│  │  ├── App Node Group: c6g.2xlarge, min:3 max:20 (Graviton)      │  │
│  │  └── Memory Node Group: r6g.large, min:2 max:6 (Redis workers) │  │
│  │                                                                  │  │
│  │  Aurora PostgreSQL Cluster                                      │  │
│  │  ├── Writer: db.r6g.2xlarge (AZ-a)                             │  │
│  │  └── Readers: db.r6g.xlarge x2 (AZ-b, AZ-c)                   │  │
│  │                                                                  │  │
│  │  ElastiCache Redis (Cluster Mode)                               │  │
│  │  └── 3 shards × 2 nodes (primary + replica per shard)          │  │
│  │                                                                  │  │
│  │  Elasticsearch (OpenSearch 2.x)                                 │  │
│  │  └── 3 data nodes (r6g.large.search)                           │  │
│  └────────────────────────────────────────────────────────────────┘  │
│                                                                       │
│  S3 Buckets:                                                          │
│  dlc-documents-prod (private, SSE-S3, versioning on)                │
│  dlc-static-prod (public, CloudFront origin)                        │
│  dlc-backups-prod (private, Glacier lifecycle after 90d)            │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│  AWS ap-northeast-1 (Tokyo) — Disaster Recovery Region               │
│  Aurora Global Database (replica, < 1s lag)                          │
│  S3 Cross-Region Replication                                         │
│  Route 53 health-check failover (RTO: 15 min, RPO: 1 min)           │
└─────────────────────────────────────────────────────────────────────┘
```

### Auto Scaling Configuration

```yaml
# HPA for NestJS backend pods
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 3
  maxReplicas: 50
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 65
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 75

# Cluster Autoscaler for EC2 nodes
# Triggers when pods are Pending due to insufficient node capacity
# Scale-down: node idle for > 10 minutes
# Scale-up: pending pod detected
```

### CDN Strategy

```
Assets served via CloudFront:
  Static files (JS/CSS/fonts) → S3 origin, TTL 1 year (immutable hash filenames)
  Profile images              → S3 origin, TTL 7 days
  Payslip PDFs                → S3 pre-signed URL (no CloudFront, 15-min expiry)
  API responses               → NOT cached at CDN (JWT-authenticated)
  Worker search results       → Redis cache at app layer (not CDN)

CloudFront Configuration:
  Price Class: PriceClass_200 (NA, EU, Asia, Middle East)
  Compress: gzip + Brotli
  HTTP/2 + HTTP/3 enabled
  Origin Shield: ap-south-1 (reduces origin load)
  Cache behaviours:
    /static/*  → TTL max (31536000s), Compress=true
    /images/*  → TTL 604800s, Vary: Accept (WebP negotiation)
    /api/*     → TTL 0 (pass-through)
```

---

## 8. Security Architecture

### Authentication Flow

```
Mobile OTP Flow:
┌──────┐  POST /auth/send-otp   ┌─────────┐  Lookup/Create user ┌──────┐
│App   │ ───────────────────→  │Auth Svc  │ ──────────────────→ │  DB  │
│      │                        │          │  Store OTP in Redis  │      │
│      │  "OTP sent"            │          │ ──────────────────→ │Redis │
│      │ ←───────────────────  │          │                       │      │
│      │  MSG91 delivers OTP   └─────────┘                       └──────┘
│      │  [user reads from SMS]
│      │  POST /auth/verify-otp
│      │ ───────────────────→  ┌─────────┐
│      │                        │Auth Svc  │  Verify hash(otp) == Redis
│      │  { accessToken,        │          │  Delete OTP key
│      │    refreshToken cookie}│          │  Create session in Redis
│      │ ←───────────────────  └─────────┘
└──────┘

Web Login Flow (Contractor/Enterprise):
  Same OTP flow, but refresh token delivered as:
    Set-Cookie: refreshToken=...; HttpOnly; Secure; SameSite=Strict; Path=/auth/refresh
  CSRF protection via custom request header check (X-Requested-With: XMLHttpRequest)
```

### RBAC Implementation

```typescript
// Permission matrix
const PERMISSIONS = {
  [UserRole.WORKER]: [
    'job:read', 'job:apply',
    'attendance:write:own', 'attendance:read:own',
    'profile:write:own', 'profile:read:own',
    'wallet:read:own', 'notification:read:own'
  ],

  [UserRole.CONTRACTOR]: [
    'job:write:own', 'job:read',
    'worker:read', 'worker:hire',
    'attendance:read:site', 'site:write:own',
    'payroll:write:own', 'payroll:read:own',
    'analytics:read:own', 'notification:write:own'
  ],

  [UserRole.ENTERPRISE_ADMIN]: [
    '...contractor permissions...',
    'vendor:manage', 'compliance:read',
    'analytics:read:org', 'report:generate:org'
  ],

  [UserRole.PLATFORM_ADMIN]: [
    'user:manage', 'kyc:review',
    'dispute:resolve', 'platform:configure',
    'analytics:read:platform', 'audit:read'
  ],

  [UserRole.PLATFORM_SUPER_ADMIN]: ['*'] // all permissions
};

// Guard checks permission for the specific resource
@Injectable()
export class PermissionGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    const user = context.switchToHttp().getRequest().user;
    return requiredPermissions.every(p => hasPermission(user.role, p));
  }
}
```

### Encryption Architecture

```
Layer 1: Transport (TLS 1.3)
  All client ↔ server communication over HTTPS
  Internal EKS pod communication: mTLS via Istio service mesh (Phase 2)

Layer 2: Database (RDS Encryption at Rest)
  AWS-managed KMS key (AES-256)
  All RDS volumes, snapshots, read replicas encrypted
  Aurora: encryption enabled at cluster creation (cannot be changed)

Layer 3: S3 (SSE-S3)
  Server-side encryption for all objects
  KYC documents: SSE-KMS (separate key, access logged)

Layer 4: Application-Level Field Encryption
  Aadhaar number  → AES-256-GCM before DB write
  Bank account    → AES-256-GCM before DB write
  Key management: AWS Secrets Manager (key rotation every 90 days)

  // Encryption utility
  async encryptField(plaintext: string): Promise<string> {
    const iv = crypto.randomBytes(12);
    const key = await this.getEncryptionKey(); // from Secrets Manager
    const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return Buffer.concat([iv, tag, encrypted]).toString('base64');
  }
```

### Security Headers

```typescript
// Helmet.js configuration (applied globally)
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'nonce-{nonce}'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https://dlc-static-prod.cloudfront.net"],
      connectSrc: ["'self'", "wss://api.digitallabourcho wk.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
    }
  },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: false,
}));
```

### Audit Logging Architecture

```
All write operations in:
  - Payroll (any amount change)
  - KYC decisions
  - Admin actions
  - Account suspension/ban
  - Role changes
  - Dispute resolution

→ AuditInterceptor captures before/after state
→ Writes to audit_logs table (append-only, no UPDATE/DELETE ever)
→ Replicated to S3 (Glacier after 1 year, retained 7 years)
→ Indexed in Elasticsearch for admin search

Audit log entry:
{
  id, timestamp, service, action,
  actor: { userId, role, ip, userAgent },
  resource: { type, id },
  changes: { before: {...}, after: {...} },
  requestId, sessionId
}
```

---

## 9. DevOps Architecture

### Kubernetes Deployment Architecture

```yaml
# Production namespace structure
namespaces:
  - dlc-production    # main app workloads
  - dlc-monitoring    # Prometheus, Grafana, Loki
  - dlc-ingress       # Kong ingress controller
  - dlc-jobs          # BullMQ worker pods (separate node group)

# Backend deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: dlc-production
spec:
  replicas: 3                      # minimum, HPA scales to 50
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0            # zero-downtime rollout
  template:
    spec:
      affinity:
        podAntiAffinity:           # spread across AZs
          requiredDuringSchedulingIgnoredDuringExecution:
            - labelSelector:
                matchLabels: { app: backend }
              topologyKey: topology.kubernetes.io/zone
      containers:
        - name: backend
          image: {ECR_URI}/backend:{TAG}
          resources:
            requests: { cpu: "500m", memory: "512Mi" }
            limits:   { cpu: "2000m", memory: "2Gi" }
          readinessProbe:
            httpGet: { path: /health, port: 3000 }
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet: { path: /health/live, port: 3000 }
            initialDelaySeconds: 30
            periodSeconds: 15
          env:
            - name: NODE_ENV
              value: production
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: dlc-secrets
                  key: DATABASE_URL
```

### CI/CD Pipeline

```
─────────────────────────────────────────────────────────────────
Developer pushes branch → GitHub
─────────────────────────────────────────────────────────────────
CI Pipeline (runs on every push + PR):

  ┌─────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
  │  Lint   │───▶│  Types   │───▶│  Tests   │───▶│ Security │
  │ ESLint  │    │tsc check │    │ Jest unit│    │ npm audit│
  │Prettier │    │          │    │+ integr. │    │  Snyk    │
  └─────────┘    └──────────┘    └──────────┘    └──────────┘
                                                       │
                                               ┌───────▼──────┐
                                               │ Docker Build │
                                               │ (validates   │
                                               │  Dockerfile) │
                                               └──────────────┘

─────────────────────────────────────────────────────────────────
PR merged to develop → Staging Deploy
─────────────────────────────────────────────────────────────────

  ┌────────────┐    ┌──────────────┐    ┌─────────────────┐
  │ Build +    │───▶│  Push to ECR │───▶│ Run Migrations  │
  │ Tag image  │    │  (semver tag) │    │ (staging DB)    │
  └────────────┘    └──────────────┘    └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │ kubectl apply   │
                                         │ (rolling update)│
                                         └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │ Newman smoke    │
                                         │ tests (30 APIs) │
                                         └────────┬────────┘
                                                  │
                                         ┌────────▼────────┐
                                         │ Notify Slack:   │
                                         │ "Staging Ready" │
                                         └─────────────────┘

─────────────────────────────────────────────────────────────────
Manual trigger → Production Deploy (2-person approval)
─────────────────────────────────────────────────────────────────

  ┌─────────────────────────┐
  │ GitHub Environment:     │
  │ "production"            │
  │ Required reviewers: 2   │
  └────────────┬────────────┘
               │ APPROVED
               ▼
  ┌─────────────────────────┐
  │ Canary Deploy (10%)     │
  │ Monitor error rate 5min │
  │ Auto-rollback if > 1%   │
  └────────────┬────────────┘
               │ HEALTHY
               ▼
  ┌─────────────────────────┐
  │ Full Rolling Deploy     │
  │ maxUnavailable: 0       │
  │ Monitor 15 min          │
  └────────────┬────────────┘
               │ HEALTHY
               ▼
  ┌─────────────────────────┐
  │ Tag release in GitHub   │
  │ Post to #deployments    │
  └─────────────────────────┘
```

### Monitoring Stack

```
Metrics:
  Prometheus → scrapes EKS pods (via ServiceMonitor)
  Grafana    → dashboards (API latency, error rates, business metrics)
  Datadog    → APM traces, infrastructure metrics, log management
  AWS CloudWatch → RDS, ElastiCache, ALB native metrics

Logging:
  App logs → stdout/stderr (JSON structured)
  Fluent Bit (DaemonSet) → collects from all pods
  AWS CloudWatch Logs → storage + search
  Datadog Log Management → indexing + alerting

Tracing:
  OpenTelemetry SDK in NestJS
  Traces → Datadog APM (or Jaeger, open-source alternative)
  Trace ID propagated via X-Request-ID header through all layers

Alerting (PagerDuty):
  P1 (immediate page):   Payroll job failure, auth service down, DB connection loss
  P2 (5-min page):       5xx rate > 1%, queue lag > 5min, memory > 85%
  P3 (Slack only):       API latency p95 > 2s, disk > 80%, cache hit rate < 70%

Uptime Monitoring:
  Datadog Synthetics: browser test on contractor dashboard every 5 min
  API health check: /health endpoint polled every 1 min from 3 regions
```

### Disaster Recovery

```
RTO (Recovery Time Objective):  15 minutes
RPO (Recovery Point Objective): 1 minute

Strategy:

  Database:
    Aurora Global Database → Tokyo read replica (lag < 1s)
    Point-in-time recovery enabled (5-min granularity, 35-day window)
    Daily snapshot to S3 + replicated to Tokyo

  Application:
    Docker images in ECR (multi-region replication)
    Terraform state in S3 (versioned, replicated)
    EKS manifests in Git (can redeploy in < 10 min)

  Failover Runbook:
    1. Promote Aurora Tokyo replica to writer (< 1 min via Console/CLI)
    2. Update Secrets Manager in Tokyo with new DB endpoint
    3. Apply EKS manifests to Tokyo cluster (pre-provisioned, always running at 1/3 capacity)
    4. Update Route 53 health check → point to Tokyo ALB
    5. Verify via synthetic monitoring
    6. Notify stakeholders

  Tested quarterly via Game Day exercises.
```

---

## 10. Mobile App Architecture

### Flutter Clean Architecture

```
lib/
├── core/                          ← Framework-agnostic utilities
│   ├── network/                   ← Dio client, interceptors
│   ├── storage/                   ← Hive adapters, SharedPreferences
│   ├── location/                  ← GPS service abstraction
│   ├── errors/                    ← Failures, Exceptions
│   └── usecases/                  ← UseCase<Params, Result> base class
│
├── features/
│   └── attendance/
│       ├── data/
│       │   ├── datasources/
│       │   │   ├── attendance_remote_datasource.dart   ← Dio calls
│       │   │   └── attendance_local_datasource.dart    ← Hive reads/writes
│       │   ├── models/
│       │   │   └── attendance_record_model.dart        ← JSON serializable
│       │   └── repositories/
│       │       └── attendance_repository_impl.dart     ← Combines remote + local
│       ├── domain/
│       │   ├── entities/
│       │   │   └── attendance_record.dart              ← Pure Dart, no imports
│       │   ├── repositories/
│       │   │   └── attendance_repository.dart          ← Abstract interface
│       │   └── usecases/
│       │       ├── check_in.dart
│       │       └── check_out.dart
│       └── presentation/
│           ├── providers/
│           │   └── attendance_notifier.dart            ← Riverpod AsyncNotifier
│           ├── screens/
│           │   └── attendance_screen.dart
│           └── widgets/
│               └── check_in_button.dart
```

### Offline-First Sync Architecture

```
Online Mode:
  User Action → UseCase → RemoteDataSource → API
                        ↓ (on success)
                        LocalDataSource (cache result)

Offline Mode:
  User Action → UseCase → LocalDataSource (returns cached data)
                        ↓ (stores mutation as PendingOperation)
                        Hive: pending_operations box

Sync Engine (triggers on connectivity restored):
  1. Read all PendingOperations from Hive (ordered by timestamp)
  2. For each operation:
     a. Send to API
     b. On success: mark as synced, update local cache with server response
     c. On conflict (409): apply server wins policy (show user notification)
     d. On failure: retry up to 3x, then mark as failed + notify user
  3. Pull latest server state (sync pull endpoint: GET /sync?since=lastSyncTimestamp)
  4. Merge server state with local state (LWW: last write wins by updatedAt)

Conflict Resolution:
  Attendance records: server always wins (geo-fence validation is server-side)
  Worker profile: merge field-by-field (server wins on KYC fields, client wins on preferences)
  Job application: server always wins
```

### API Synchronization Strategy

```dart
// Sync pull — efficient delta sync
class SyncService {
  Future<void> syncAll() async {
    final lastSync = await _storage.getLastSyncTimestamp();

    // Single endpoint returns all changed resources since lastSync
    final delta = await _api.getSyncDelta(since: lastSync);

    await Future.wait([
      _applyWorkerDelta(delta.workers),
      _applyJobDelta(delta.jobs),
      _applyNotificationDelta(delta.notifications),
    ]);

    await _storage.setLastSyncTimestamp(delta.serverTimestamp);
  }
}

// Backend sync endpoint
GET /api/v1/sync?since=2026-05-27T10:00:00Z
Response: {
  "workers":       [...changed worker records],
  "jobs":          [...changed job records],
  "notifications": [...new notifications],
  "serverTimestamp": "2026-05-27T12:00:00Z"
}
```

### Local Caching (Hive)

```dart
// Hive boxes and adapters
@HiveType(typeId: 0)
class WorkerProfileModel extends HiveObject {
  @HiveField(0) String id;
  @HiveField(1) String fullName;
  @HiveField(2) String phone;
  // ... remaining fields
}

// Box usage
final workerBox = await Hive.openBox<WorkerProfileModel>('workers');

// Cache profile
await workerBox.put(worker.id, worker);

// Read cached profile (instant, no network)
final cached = workerBox.get(workerId);
```

---

## 11. AI Recommendation Architecture

### Worker–Job Matching Engine

```
Architecture:

  Offline (model training + embedding generation):
    1. Worker profiles → feature extraction → 768-dim embedding (BERT fine-tuned on job descriptions)
    2. Job postings → feature extraction → 768-dim embedding
    3. Historical hire data → collaborative filtering (ALS / Matrix Factorization)
    4. Embeddings stored in Elasticsearch dense_vector fields (kNN search)
    5. Model retrained weekly (AWS SageMaker training job)

  Online (real-time serving):
    New job posted → JobPublished event → AI service
    1. Fetch job embedding (or generate if new)
    2. kNN search in Elasticsearch: find top-100 nearest worker vectors
    3. Re-rank using XGBoost model (features: skill match, location dist, availability, rating)
    4. Store ranked list: Redis sorted set key=job:{jobId}:workers, score=match_score, ttl=6h
    5. GET /jobs/:id/recommended-workers → reads from Redis (< 5ms latency)

  Worker seeking jobs (symmetric):
    Worker profile updated → WorkerProfileUpdated event → AI service
    1. Fetch/generate worker embedding
    2. kNN search for top-50 matching open jobs
    3. Store: Redis sorted set key=worker:{workerId}:jobs, score=match_score, ttl=6h
    4. GET /workers/:id/recommended-jobs → reads from Redis
```

### Feature Engineering

```
Worker Features:
  Categorical:  primarySkill, city, state, gender, kycStatus
  Numerical:    experienceYears, rating (0-5), profileScore, distanceToJob
  Behavioral:   applyRate, hireRate, attendanceScore, responseTime
  Temporal:     availabilityDays, preferredStartDate

Job Features:
  Categorical:  requiredSkill, city, state, jobType
  Numerical:    dailyWage, workerCount, durationDays
  Temporal:     startDate, urgencyScore (days until start)

Derived Features:
  skillExactMatch:     worker.primarySkill == job.requiredSkill
  locationDistance:    Haversine(worker.coords, job.coords)
  wageSatisfaction:    job.dailyWage / worker.expectedWage
  contractorRating:    contractor's average rating from workers
```

### Demand Prediction Engine

```
Use Case: Predict labour demand by skill/location/date → helps workers plan availability

Model:
  Time-series forecasting (Prophet / LSTM)
  Input features: historical job postings, season, local events, construction indices
  Output: expected job count per (skill × city × week)

Serving:
  Weekly batch job (SageMaker) → predictions stored in PostgreSQL
  API: GET /market/demand?skill=mason&city=mumbai&from=2026-06-01
  Used by: worker app home screen ("High demand for Masons in Mumbai next week")
  Used by: contractor dashboard ("Current market supply/demand ratio")

Feedback Loop:
  Actual hires recorded → compared to predictions → model drift detection
  Retrain triggered if MAPE > 15% on 4-week rolling window
```

### Skill Recommendation Engine

```
Use Case: Suggest additional skills a worker should acquire to increase hire rate

Logic:
  1. Cluster workers by skill profile (k-means on skill vectors)
  2. For each cluster, identify highest-earning + most-hired workers
  3. Find skills those workers have that the target worker lacks
  4. Cross-reference with demand prediction (suggest skills with rising demand)
  5. Output: ranked list of suggested skills with expected wage uplift

API:
  GET /workers/:id/skill-recommendations
  Response: [
    { skill: "Shuttering Carpenter", demandScore: 0.87, wageUplift: "₹150/day", coursesAvailable: 3 },
    { skill: "CPVC Plumber", demandScore: 0.74, wageUplift: "₹200/day", coursesAvailable: 1 }
  ]
```

---

## 12. Scalability Strategy

### Horizontal Scaling

```
Application Tier:
  EKS HPA: scale from 3 → 50 pods based on CPU/memory
  Pod startup time: < 15 seconds (optimized Docker image, pre-warmed)
  Zero-downtime deploys: RollingUpdate with maxUnavailable=0
  Stateless design: no local state (sessions in Redis, files in S3)

Database Tier:
  Read replicas absorb SELECT load (auto-scaled by Aurora)
  Write scaling: connection pooling via PgBouncer (prevents connection exhaustion)
  Partitioned tables (attendance, payroll): query pruning on partition key
  Phase 3: Citus horizontal sharding on worker_id

Cache Tier:
  Redis Cluster (3 shards): horizontal key-space partitioning
  Add shards without downtime (live resharding)
  Each shard: primary + replica (HA)

Search Tier:
  Elasticsearch: add data nodes horizontally
  Sharding: workers index → 5 primary shards (supports 5 data nodes)
  Replicas: 1 replica per shard (HA + read throughput)
```

### Queue System

```
BullMQ (Redis-backed):

  Queues:
  ┌──────────────────────┬──────────────┬────────────────────────────┐
  │ Queue                │ Concurrency  │ Use case                   │
  ├──────────────────────┼──────────────┼────────────────────────────┤
  │ notifications:high   │ 50           │ OTP, payment confirmation  │
  │ notifications:normal │ 100          │ Job matches, hire alerts   │
  │ notifications:low    │ 20           │ Weekly digests, marketing  │
  │ payroll              │ 5            │ Payroll batch processing   │
  │ reports              │ 10           │ PDF/Excel generation       │
  │ kyc                  │ 20           │ Document OCR processing    │
  │ ai:matching          │ 30           │ Embedding generation       │
  │ location:flush       │ 10           │ GPS ping DB flush          │
  └──────────────────────┴──────────────┴────────────────────────────┘

  Worker pods: separate Kubernetes Deployment (dlc-worker)
  Scaling: separate HPA based on queue depth metric (custom metric via KEDA)

KEDA (Kubernetes Event-Driven Autoscaling):
  Scale dlc-worker pods based on BullMQ queue length
  0 pods when queue empty → 30 pods when queue > 10,000 jobs
```

### Async Job Patterns

```
Pattern 1: Fire and Forget
  POST /payroll/process → creates BullMQ job → returns { jobId }
  Client polls GET /payroll/jobs/{jobId}/status or subscribes via WebSocket

Pattern 2: Webhooks (for enterprise integrations)
  Payroll processed → HTTP POST to enterprise webhook URL
  Retry with exponential backoff (1s, 2s, 4s, 8s, 16s)
  Dead letter queue for persistent failures → admin notification

Pattern 3: Server-Sent Events (lightweight realtime)
  Report generation progress: GET /reports/{id}/progress (SSE stream)
  Events: { "progress": 45, "status": "generating", "eta": "30s" }
```

---

## 13. Tech Stack Justification

| Layer | Choice | Justification |
|---|---|---|
| **Frontend** | Next.js 15 (App Router) | SSR for SEO on job listings; RSC reduces client bundle; built-in API routes; Vercel/self-hosted both viable |
| **Styling** | TailwindCSS + shadcn/ui | Design system consistency; tree-shaking removes unused CSS; shadcn components are copy-owned (no version lock) |
| **State** | Zustand + TanStack Query | Zustand: minimal boilerplate for UI state. TanStack Query: server state, caching, background refetch, optimistic updates |
| **Backend** | NestJS (Node.js) | TypeScript-first; dependency injection native; modular structure enforces architecture; massive ecosystem; 3x faster dev vs Spring Boot for this team size |
| **Mobile** | Flutter | Single codebase for Android + iOS; Dart compiles to native ARM; Riverpod is compile-safe; offline-first support via Hive; FCM integration |
| **Primary DB** | PostgreSQL 16 + Aurora | ACID guarantees for financial data; PostGIS for geospatial; JSON columns for flexible schemas; Aurora: managed, multi-AZ, auto-scaling storage |
| **Cache** | Redis 7 (Cluster Mode) | Sub-millisecond latency; sorted sets for leaderboards/rankings; pub/sub for WebSocket fan-out; BullMQ uses Redis natively |
| **Search** | Elasticsearch 8 | Full-text + vector search in one engine; kNN for AI matching; faceted filtering for worker/job search; near-realtime indexing |
| **Queue** | BullMQ | Redis-based (no new infra); priority queues; delayed jobs; rate-limited queues; KEDA integration; repeatable jobs |
| **Container Orchestration** | Kubernetes (EKS) | Industry standard; auto-scaling; self-healing; rolling deployments; multi-AZ pod distribution; rich ecosystem |
| **CI/CD** | GitHub Actions | Native GitHub integration; free for OSS; matrix builds; environment protection rules; OIDC for AWS auth (no static secrets) |
| **Monitoring** | Datadog | APM + logs + infra + synthetics in one platform; Hindi/English log parsing; mobile RUM for Flutter; cost justified at scale |
| **IaC** | Terraform | Multi-cloud capable; module reuse; state management; plan before apply; Atlantis for GitOps |

---

## 14. Production Deployment Flow

### Environment Progression

```
Local → Development → Staging → Production
  │          │             │          │
  │     Feature builds  QA + UAT   Live traffic
  │     Auto deploy     Auto deploy  Manual approval
  │     Dev DB          Staging DB   Production DB
  │     No PII data     Anonymised   Real data
```

### Staging Environment

```
Purpose: Integration testing, QA, UAT, load testing
Data: Production snapshot, PII anonymised (phone → 9999XXXXXX, names → "Test User")
Infrastructure: 30% of production capacity (cost optimisation)
URL: staging.digitallabourcho wk.com (IP-restricted to team + clients)

Auto-deploy on merge to develop:
  1. GitHub Actions: test → build → push ECR → run migrations
  2. kubectl rollout restart deployment/backend -n dlc-staging
  3. Newman smoke tests (30 critical API tests)
  4. Slack notification: "Staging updated: v2.3.1-staging-abc1234"

Staging-specific:
  Payment gateway: sandbox mode (no real transactions)
  SMS: test numbers only (no real SMS sent)
  FCM: test project (separate Firebase project)
  Feature flags: all new features enabled (to catch integration issues)
```

### Production Deployment

```
Trigger: Manual workflow dispatch (CTO or lead engineer)
Gate: 2 GitHub Environment approvers required (Engineering Lead + QA Lead)
Version: semantic version tag (v2.3.1)

Step 1: Pre-deployment checklist (automated + manual)
  ✅ All CI checks pass on release branch
  ✅ Staging smoke tests passing
  ✅ DB migration is backward-compatible (old code + new schema works)
  ✅ No open P1/P2 incidents on status page
  ✅ Load test passed (if infra changes)
  ✅ Change freeze period check (no deploys on salary disbursement day)

Step 2: Database migration (before code deploy)
  Run migration on production DB (read replica still serves traffic)
  Migration must be backward-compatible (additive only: new columns nullable)
  If migration takes > 1min → use pg_repack or online-schema-change tool
  Validate: row count, index creation, no lock timeouts

Step 3: Canary deployment (10% traffic)
  Deploy new image to 1 of 10 pods
  Monitor for 5 minutes:
    - Error rate < 0.5% (baseline: < 0.1%)
    - P95 latency < 1.5s (baseline: < 500ms)
    - No new exception types in Datadog
  Auto-rollback: if error rate > 1%, revert pod to previous image

Step 4: Full rolling deployment
  maxSurge: 1, maxUnavailable: 0
  Each pod: new pod Ready → old pod terminated
  Duration: ~5 minutes for 10 pods
  Monitor for 15 minutes post-deployment

Step 5: Post-deployment verification
  Synthetic monitoring: 5 browser tests pass
  Manual smoke test: check-in flow, job post flow, payroll flow
  Datadog dashboard: all green for 15 minutes
  Notify #deployments channel
```

### Canary Deployment Detail

```yaml
# Argo Rollouts (or manual weight shifting via Ingress)
apiVersion: argoproj.io/v1alpha1
kind: Rollout
spec:
  strategy:
    canary:
      canaryService: backend-canary
      stableService: backend-stable
      steps:
        - setWeight: 10
        - pause: { duration: 5m }
        - analysis:                    # automated analysis step
            templates: [error-rate-analysis, latency-analysis]
        - setWeight: 50
        - pause: { duration: 5m }
        - setWeight: 100
      autoPromotionEnabled: false      # manual final promotion
      antiAffinity:
        preferredDuringScheduling: {}

  analysis templates:
    error-rate-analysis:
      successCondition: result < 0.01  # < 1% error rate
      failureLimit: 1
      metrics:
        provider: datadog
        query: "sum:trace.express.request.errors{env:production}.as_rate()"
```

### Rollback Strategy

```
Rollback Triggers:
  - Automated: Argo Rollouts analysis fails (error rate > 1%)
  - Manual: Engineer triggers via GitHub Actions "Rollback" workflow

Rollback Process:
  1. kubectl rollout undo deployment/backend -n dlc-production
     (reverts to previous image tag in < 60 seconds)
  2. If DB migration was applied:
     - Run down() migration to revert schema
     - Only possible if migration was backward-compatible
     - If breaking migration: hotfix forward (cannot rollback)
  3. Notify #incidents channel with rollback reason
  4. Create post-mortem ticket

Image Retention:
  ECR: last 10 production tags retained (never deleted)
  Rollback always possible to any of last 10 releases
```

---

## Appendix A: Architecture Decision Records

### ADR-001: Modular Monolith over Microservices

**Status**: Accepted
**Context**: Platform is pre-product-market-fit with a team of 8 engineers.
**Decision**: Start with NestJS modular monolith. Extract to microservices when a module has a distinct scaling profile or crosses a team boundary.
**Consequences**: Faster development velocity. Simpler debugging. Single deployment. Must maintain strict module boundaries to enable future extraction.

### ADR-002: PostgreSQL over MongoDB

**Status**: Accepted
**Context**: Payroll data requires ACID transactions. Worker profiles benefit from relational queries. Geo-data handled by PostGIS.
**Decision**: PostgreSQL as primary store. MongoDB rejected due to ACID complexity for financial data.
**Consequences**: Strong consistency. Powerful query engine. Schema migrations required for changes.

### ADR-003: Flutter for Mobile

**Status**: Accepted
**Context**: Target Android market (90%+ blue-collar workers on Android). Single codebase preference.
**Decision**: Flutter over React Native. Reasoning: Dart compiles to native ARM (no JS bridge), consistent performance on low-end Android devices, Riverpod provides better compile-time safety than RN's ecosystem.
**Consequences**: Dart language adoption required. Smaller talent pool than React Native.

### ADR-004: Redis Cluster for Queue + Cache

**Status**: Accepted
**Context**: Both BullMQ and application caching need Redis. Separate instances evaluated.
**Decision**: Single Redis Cluster (3 shards). Queues and cache share infrastructure but use separate key namespaces and separate logical databases.
**Consequences**: Reduced operational overhead. Memory monitoring required to prevent queue depth from starving cache.

---

## Appendix B: Capacity Planning

```
Scenario: 1 Million Active Workers, 50,000 Active Contractors

Daily load estimates:
  Worker check-ins:           1M × 1/day     = ~12,000 req/min (peak: 8–9 AM)
  GPS pings (active jobs):    200k × 1/min   = 200,000 pings/min (peak: 9 AM–5 PM)
  Job searches:               100k × 10/day  = ~700 req/min
  Contractor dashboard loads: 50k × 20/day   = ~700 req/min
  Notifications:              500k × 3/day   = 1.5M notifications/day

Required infrastructure at 1M workers (estimated):
  Backend pods:    15–20 (c6g.2xlarge)
  DB writer:       db.r6g.4xlarge (16 vCPU, 128 GB)
  DB readers:      3 × db.r6g.2xlarge
  Redis:           3 shards × r6g.large (6 GB each = 18 GB total)
  Elasticsearch:   5 × r6g.xlarge.search
  Worker pods:     10 (BullMQ processors)

Monthly infrastructure cost estimate (ap-south-1): ~$8,000–$12,000 USD
```

---

*Architecture.md — Digital Labour Chowk*
*Version 1.0 | May 2026 | Owned by: Engineering Leadership*
*Review cycle: Quarterly or on major architectural change*
*Next review: August 2026*
