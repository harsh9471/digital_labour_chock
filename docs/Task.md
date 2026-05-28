# Task.md — Digital Labour Chowk

> **6-Day MVP Sprint Execution Document**
> Version 1.0 | Engineering Execution Reference
> Platform: Labour Marketplace & Workforce Management System
> Style: Startup Engineering — Ship fast, ship right, ship with confidence

---

## Table of Contents

1. [Sprint Overview](#1-sprint-overview)
2. [Day 1 — Project Initialization & Architecture](#2-day-1--project-initialization--architecture)
3. [Day 2 — Authentication & User Management](#3-day-2--authentication--user-management)
4. [Day 3 — Job Marketplace & Workforce Module](#4-day-3--job-marketplace--workforce-module)
5. [Day 4 — Attendance & Payroll System](#5-day-4--attendance--payroll-system)
6. [Day 5 — Notifications, Analytics & Admin Panel](#6-day-5--notifications-analytics--admin-panel)
7. [Day 6 — Testing, Optimization & Deployment](#7-day-6--testing-optimization--deployment)
8. [Daily Engineering Standards](#8-daily-engineering-standards)
9. [QA Checklist](#9-qa-checklist)
10. [Final MVP Deliverables](#10-final-mvp-deliverables)

---

## 1. Sprint Overview

### Mission Statement

> Ship a working, deployable, investor-demonstrable MVP of Digital Labour Chowk in 6 working days. Every day ends with a deployed, testable increment — not a half-built feature.

### Sprint Goal

Build a production-grade MVP covering the complete hiring lifecycle: worker registration → job discovery → contractor hiring → attendance tracking → digital payroll — accessible via web dashboard, mobile app, and admin panel, deployed on AWS with CI/CD operational.

### Timeline

```
Day 1  │  Mon  │  Project setup, architecture, infra foundation
Day 2  │  Tue  │  Auth, user management, roles, OTP login
Day 3  │  Wed  │  Job marketplace, worker profiles, hiring workflow
Day 4  │  Thu  │  Attendance (GPS + QR), payroll, salary reports
Day 5  │  Fri  │  Notifications, analytics, admin panel, monitoring
Day 6  │  Sat  │  Testing, security review, production deployment, docs
```

### Team Composition & Assignments

```
┌────────────────────────┬─────────────────────────────────────────────┐
│  Role                  │  Primary Ownership                           │
├────────────────────────┼─────────────────────────────────────────────┤
│  Backend Dev (BE)      │  NestJS APIs, PostgreSQL, Redis, BullMQ      │
│  Frontend Dev (FE)     │  Next.js dashboards (Contractor + Admin)     │
│  Mobile Dev (MOB)      │  Flutter worker app                          │
│  DevOps Engineer (OPS) │  Docker, AWS, CI/CD, monitoring              │
│  QA Engineer (QA)      │  Testing, Postman, Playwright, checklists    │
│  Tech Lead (TL)        │  Architecture, PR reviews, blockers          │
└────────────────────────┴─────────────────────────────────────────────┘
```

### Sprint Deliverables (Full List)

```
✦ Worker Mobile App (Flutter, Android APK)
✦ Contractor Dashboard (Next.js, deployed)
✦ Company / Enterprise Portal (Next.js, deployed)
✦ Admin Panel (Next.js, deployed)
✦ REST API (NestJS, versioned, Swagger documented)
✦ PostgreSQL database (schemas, migrations, seed data)
✦ Redis (sessions, queues, rate limiting)
✦ Docker Compose (local) + Kubernetes manifests (production)
✦ GitHub Actions CI/CD pipeline
✦ AWS production deployment (EKS or ECS)
✦ Postman collection (all endpoints)
✦ Technical documentation (README.md per service)
```

### Non-Negotiables for MVP

```
Every day must end with:
  ✦ All code merged to develop branch (no stale feature branches)
  ✦ CI pipeline green (no failing tests)
  ✦ Staging deployment updated and accessible
  ✦ End-of-day standup note in #engineering-sprint Slack channel
  ✦ Blockers escalated immediately, not held until the next morning

MVP scope boundaries (in scope):
  ✦ OTP-based authentication (phone number)
  ✦ Worker profile + KYC document upload (no AI verification — manual review)
  ✦ Job posting, search, and application
  ✦ GPS + QR attendance check-in/out
  ✦ Basic payroll calculation + payslip generation
  ✦ FCM push notifications
  ✦ Admin panel for user management and KYC review
  ✦ SMS via MSG91 (OTP + payment confirmation)

Out of scope for Day 6 demo:
  ✗ AI-powered matching engine (mocked with basic skill filter)
  ✗ Payment gateway integration (UI built, gateway mocked)
  ✗ Biometric face verification (placeholder with manual KYC)
  ✗ Enterprise multi-vendor portal (single contractor for MVP)
```

### Daily Standup Schedule

```
09:00 AM  Morning standup         (15 min, Slack huddle)
01:00 PM  Mid-day sync            (10 min, blockers only)
06:00 PM  End-of-day check-in     (20 min, demo progress + handoff notes)
```

---

## 2. Day 1 — Project Initialization & Architecture

> **Theme:** "If Day 1 is done right, Days 2–6 move at double speed."
> Every decision made today saves 10 decisions later. Invest here.

### Day 1 Goals

```
✦ Monorepo initialized with all three projects (backend, frontend, mobile)
✦ All environments running locally (docker-compose up → everything starts)
✦ Database connected with base schema and first migration applied
✦ CI pipeline triggers on push and runs checks
✦ Team has agreed on folder structures, naming, and branch workflow
✦ Staging environment accessible (even if it's just a health endpoint)
```

---

### Backend Tasks — Day 1

#### TASK-BE-01 · Initialize NestJS Project
```
Owner:     Backend Dev
Priority:  P0 — BLOCKING everything
Estimate:  45 min
Branch:    feat/BE-01-nestjs-init

Steps:
  1. npm i -g @nestjs/cli
  2. nest new backend --strict --package-manager npm
  3. Configure tsconfig.json:
       "strict": true,
       "paths": { "@/*": ["src/*"] }
  4. Install core dependencies:
       npm install @nestjs/config @nestjs/typeorm typeorm pg
       npm install @nestjs/jwt @nestjs/passport passport passport-jwt
       npm install @nestjs/throttler @nestjs/event-emitter
       npm install class-validator class-transformer
       npm install @nestjs/swagger swagger-ui-express
       npm install bcrypt helmet compression
       npm install ioredis @nestjs/cache-manager cache-manager-ioredis-yet
       npm install bullmq @nestjs/bullmq
  5. Install dev dependencies:
       npm install -D @types/node @types/bcrypt @types/passport-jwt
       npm install -D jest @nestjs/testing supertest @types/supertest
  6. Configure ESLint + Prettier (copy from CLAUDE.md standards)

Definition of Done:
  ✅ npm run start:dev starts without errors on port 3000
  ✅ GET /health returns { status: 'ok', timestamp: '...' }
  ✅ npm run build succeeds
  ✅ npm run test runs (0 tests, but no errors)
```

#### TASK-BE-02 · PostgreSQL + Redis + Docker Compose
```
Owner:     Backend Dev + DevOps
Priority:  P0 — BLOCKING
Estimate:  60 min
Branch:    feat/BE-02-database-setup

docker-compose.yml services to define:
  postgres:
    image: postgis/postgis:16-3.4-alpine
    environment: POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
    volumes: postgres_data:/var/lib/postgresql/data
    ports: 5432:5432
    healthcheck: pg_isready -U ${POSTGRES_USER}

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes: redis_data:/data
    ports: 6379:6379

  backend:
    build: ./backend
    environment: (from .env)
    depends_on: postgres, redis
    ports: 3000:3000

  frontend:
    build: ./frontend
    ports: 3001:3001

NestJS Database Module setup:
  src/infrastructure/database/database.module.ts
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('DB_HOST'),
        port: config.get('DB_PORT'),
        username: config.get('DB_USER'),
        password: config.get('DB_PASSWORD'),
        database: config.get('DB_NAME'),
        entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/../../migrations/*{.ts,.js}'],
        synchronize: false,
        logging: config.get('NODE_ENV') === 'development',
      })
    })

.env.example to create:
  NODE_ENV=development
  PORT=3000
  DB_HOST=localhost
  DB_PORT=5432
  DB_USER=dlc_user
  DB_PASSWORD=dlc_password
  DB_NAME=dlc_dev
  REDIS_URL=redis://localhost:6379
  JWT_SECRET=dev-secret-change-in-production
  JWT_EXPIRY=900
  JWT_REFRESH_EXPIRY=604800

Definition of Done:
  ✅ docker-compose up -d starts postgres + redis without errors
  ✅ NestJS connects to PostgreSQL (log: "TypeORM connected")
  ✅ NestJS connects to Redis (log: "Redis connected")
  ✅ .env.example committed, .env in .gitignore
```

#### TASK-BE-03 · Base Architecture Scaffolding
```
Owner:     Backend Dev + Tech Lead
Priority:  P0 — Architecture foundation
Estimate:  90 min
Branch:    feat/BE-03-base-architecture

Folder structure to create:
  src/
  ├── modules/           ← domain modules (created as features land)
  ├── common/
  │   ├── base/
  │   │   ├── base.entity.ts
  │   │   └── base.repository.ts
  │   ├── decorators/
  │   │   ├── current-user.decorator.ts
  │   │   └── roles.decorator.ts
  │   ├── dto/
  │   │   ├── api-response.dto.ts
  │   │   └── pagination.dto.ts
  │   ├── filters/
  │   │   └── global-exception.filter.ts
  │   ├── interceptors/
  │   │   ├── response-transform.interceptor.ts
  │   │   └── request-logging.interceptor.ts
  │   ├── pipes/
  │   │   └── validation.pipe.ts
  │   └── enums/
  │       └── user-role.enum.ts
  ├── config/
  │   ├── app.config.ts
  │   ├── database.config.ts
  │   └── jwt.config.ts
  ├── infrastructure/
  │   ├── database/database.module.ts
  │   └── redis/redis.module.ts
  └── app.module.ts

Files to implement:

  base.entity.ts:
    @PrimaryGeneratedColumn('uuid') id: string
    @CreateDateColumn() createdAt: Date
    @UpdateDateColumn() updatedAt: Date
    @DeleteDateColumn() deletedAt: Date | null
    @Column({ nullable: true }) createdBy: string
    @Column({ nullable: true }) updatedBy: string

  global-exception.filter.ts:
    Catches all HttpException + unknown errors
    Returns { success: false, error: { code, message, details, timestamp, path } }
    Never exposes stack traces in production

  response-transform.interceptor.ts:
    Wraps all successful responses in { success: true, data: ..., message: '...' }

  api-response.dto.ts:
    Generic ApiResponseDto<T> type
    PaginatedResponseDto<T> with meta: { page, limit, total, totalPages }

  user-role.enum.ts:
    WORKER, CONTRACTOR, CONTRACTOR_ADMIN,
    ENTERPRISE_ADMIN, PLATFORM_ADMIN, PLATFORM_SUPER_ADMIN

Definition of Done:
  ✅ Folder structure committed with stub files
  ✅ BaseEntity has all audit fields
  ✅ Global exception filter returns standard error format
  ✅ Response interceptor wraps all 2xx responses
  ✅ POST /test with invalid body returns standard validation error format
```

#### TASK-BE-04 · First Database Migration
```
Owner:     Backend Dev
Priority:  P1
Estimate:  30 min
Branch:    feat/BE-04-initial-migration

  Install migration tooling:
    npm install -D ts-node
    Add to package.json scripts:
      "migration:generate": "typeorm-ts-node-commonjs migration:generate"
      "migration:run":      "typeorm-ts-node-commonjs migration:run"
      "migration:revert":   "typeorm-ts-node-commonjs migration:revert"

  Create first migration:
    src/migrations/1716800000000-InitialSchema.ts
    up():   CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
            CREATE EXTENSION IF NOT EXISTS postgis;
            (Nothing else — entities drive subsequent migrations)
    down(): DROP EXTENSION postgis; DROP EXTENSION "uuid-ossp";

  Create typeorm.config.ts (datasource for CLI):
    export const AppDataSource = new DataSource({ ... })

Definition of Done:
  ✅ npm run migration:run executes without error
  ✅ Extensions enabled in database
  ✅ npm run migration:revert works
```

---

### Frontend Tasks — Day 1

#### TASK-FE-01 · Initialize Next.js Project
```
Owner:     Frontend Dev
Priority:  P0 — BLOCKING
Estimate:  60 min
Branch:    feat/FE-01-nextjs-init

Steps:
  1. npx create-next-app@latest frontend \
       --typescript --tailwind --eslint \
       --app --src-dir --import-alias "@/*"

  2. Install dependencies:
       npm install @tanstack/react-query@5 axios zustand zod
       npm install react-hook-form @hookform/resolvers
       npm install next-auth@5
       npm install framer-motion
       npm install sonner
       npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
       npm install lucide-react
       npm install class-variance-authority clsx tailwind-merge
       npm install date-fns

  3. Initialize shadcn/ui:
       npx shadcn@latest init
       npx shadcn@latest add button input card badge avatar
       npx shadcn@latest add dialog dropdown-menu table tabs
       npx shadcn@latest add form label select textarea
       npx shadcn@latest add alert toast progress skeleton

  4. Configure tailwind.config.ts with design tokens from Design.md §11

  5. Create folder structure:
       src/
       ├── app/(auth)/login/page.tsx
       ├── app/(dashboard)/layout.tsx
       ├── app/(dashboard)/dashboard/page.tsx
       ├── components/ui/         ← shadcn components
       ├── components/shared/     ← StatCard, PageHeader, DataTable
       ├── lib/api/               ← axios instances + API modules
       ├── lib/schemas/           ← Zod schemas
       ├── hooks/                 ← TanStack Query hooks
       ├── store/                 ← Zustand stores
       └── types/                 ← TypeScript types

  6. Set up Axios client:
       lib/api/client.ts
       — Base URL from NEXT_PUBLIC_API_URL env
       — Request interceptor: attach Bearer token from memory
       — Response interceptor: unwrap { success, data } envelope
       — 401 interceptor: redirect to login

  7. Set up TanStack Query:
       app/providers.tsx: QueryClientProvider with staleTime: 60_000

Definition of Done:
  ✅ npm run dev starts on port 3001 without errors
  ✅ http://localhost:3001 renders a page (even a placeholder)
  ✅ Tailwind and shadcn components import without errors
  ✅ Axios client connects to backend (GET /health returns ok)
```

#### TASK-FE-02 · Base Layout Components
```
Owner:     Frontend Dev
Priority:  P1
Estimate:  90 min
Branch:    feat/FE-02-base-layouts

Components to build:

  DashboardLayout (app/(dashboard)/layout.tsx):
    Sidebar (240px, dark) + main content area
    Responsive: collapsed sidebar on tablet, drawer on mobile

  Sidebar component (components/shared/Sidebar.tsx):
    Logo + nav items (with icons from Lucide)
    Active state: brand-500 left border
    User profile footer
    Placeholder nav items (Dashboard, Workers, Jobs, Attendance, Payroll)

  PageHeader (components/shared/PageHeader.tsx):
    Breadcrumb + title + optional CTA button slot
    Props: title, subtitle, breadcrumbs[], action?: ReactNode

  StatCard (components/shared/StatCard.tsx):
    Icon + label + value + optional trend (up/down %)
    Variants: default, success, warning, danger

  DataTable (components/shared/DataTable.tsx):
    Wraps TanStack Table — columns config + data[]
    Built-in: loading skeleton, empty state, pagination row

  Loading states:
    Skeleton variants: card, table row, stat card, full page

Definition of Done:
  ✅ DashboardLayout renders with sidebar on http://localhost:3001/dashboard
  ✅ StatCard renders with mock data
  ✅ DataTable renders with 3 mock columns and 5 mock rows
  ✅ Mobile: sidebar collapses to hamburger drawer
```

---

### Mobile Tasks — Day 1

#### TASK-MOB-01 · Initialize Flutter Project
```
Owner:     Mobile Dev
Priority:  P0 — BLOCKING
Estimate:  90 min
Branch:    feat/MOB-01-flutter-init

Steps:
  1. flutter create mobile --org com.dlc --platforms android,ios

  2. Add to pubspec.yaml:
       dependencies:
         # State management
         flutter_riverpod: ^2.5.1
         riverpod_annotation: ^2.3.5
         # Navigation
         go_router: ^14.0.0
         # HTTP
         dio: ^5.4.3
         # Local storage
         hive_flutter: ^1.1.0
         # Auth
         shared_preferences: ^2.2.3
         flutter_secure_storage: ^9.0.0
         # Location
         geolocator: ^12.0.0
         permission_handler: ^11.3.1
         # Maps
         google_maps_flutter: ^2.6.1
         # Firebase
         firebase_core: ^3.0.0
         firebase_messaging: ^15.0.0
         firebase_analytics: ^11.0.0
         firebase_crashlytics: ^4.0.0
         # UI
         cached_network_image: ^3.3.1
         image_picker: ^1.1.0
         # Utils
         intl: ^0.19.0
         connectivity_plus: ^6.0.3
         package_info_plus: ^8.0.0

       dev_dependencies:
         build_runner: ^2.4.9
         riverpod_generator: ^2.4.0
         hive_generator: ^2.0.1
         flutter_lints: ^4.0.0

  3. Create folder structure:
       lib/
       ├── main.dart
       ├── app/
       │   ├── app.dart
       │   └── router.dart
       ├── core/
       │   ├── constants/   api_constants.dart, app_constants.dart
       │   ├── theme/       app_theme.dart, app_colors.dart (from Design.md)
       │   ├── network/     dio_client.dart
       │   ├── storage/     local_storage.dart
       │   └── utils/       formatters.dart, validators.dart
       └── features/
           ├── auth/
           ├── jobs/
           ├── attendance/
           ├── profile/
           └── wallet/

  4. Configure Dio client:
       core/network/dio_client.dart
       — Base URL from dart-define FLUTTER_API_URL
       — Auth interceptor: attach Bearer token from secure storage
       — Error interceptor: map HTTP errors to typed Failures
       — Logging interceptor: debug mode only

  5. Configure GoRouter:
       app/router.dart
       Routes: /splash, /login, /otp, /home, /jobs, /attendance, /profile, /wallet

  6. Configure app.dart with ProviderScope + MaterialApp.router

Definition of Done:
  ✅ flutter run launches on Android emulator without errors
  ✅ App shows splash screen → navigates to login
  ✅ Dio client configured and can reach backend (debug log confirms)
  ✅ Theme colours match Design.md tokens
```

---

### DevOps Tasks — Day 1

#### TASK-OPS-01 · GitHub Repository & Monorepo Setup
```
Owner:     DevOps + Tech Lead
Priority:  P0 — BLOCKING EVERYONE
Estimate:  60 min
Time:      Complete FIRST (before anyone else starts)

Steps:
  1. Create GitHub organisation: digital-labour-chowk
  2. Create repository: dlc-platform (monorepo)
  3. Initialize with:
       /backend     ← NestJS
       /frontend    ← Next.js
       /mobile      ← Flutter
       /infra       ← Terraform + K8s manifests
       /docs        ← ADRs, runbooks
       CLAUDE.md, Architecture.md, Design.md, Skills.md, Task.md

  4. Branch protection rules on main and develop:
       ✦ Require PR reviews: 1 reviewer minimum
       ✦ Require status checks: CI must pass
       ✦ No direct pushes to main or develop
       ✦ Require branches to be up to date before merging

  5. Create branch naming labels in GitHub:
       feat, fix, chore, test, docs, hotfix

  6. Create GitHub Project board with columns:
       Backlog | In Progress | In Review | In Testing | Done

  7. Create GitHub Environments:
       staging:    auto-deploy on merge to develop
       production: manual approval required (2 reviewers)

  8. Add all team members with appropriate roles:
       TL + OPS → Admin
       All developers → Write

Definition of Done:
  ✅ All team members can clone and push
  ✅ Branch protection rules active on main and develop
  ✅ GitHub Project board shared with team
  ✅ README.md at repo root explains project structure
```

#### TASK-OPS-02 · CI Pipeline — Day 1 Foundation
```
Owner:     DevOps
Priority:  P0
Estimate:  90 min
Branch:    feat/OPS-02-ci-foundation

.github/workflows/ci.yml (triggers on: push + PR to develop/main):

  jobs:
    backend-ci:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: { node-version: '20', cache: 'npm', cache-dependency-path: backend/package-lock.json }
        - run: npm ci           (working-directory: backend)
        - run: npm run lint
        - run: npm run build
        - run: npm run test

    frontend-ci:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: actions/setup-node@v4
          with: { node-version: '20', cache: 'npm', cache-dependency-path: frontend/package-lock.json }
        - run: npm ci
        - run: npm run lint
        - run: npm run type-check   (tsc --noEmit)
        - run: npm run build

    mobile-ci:
      runs-on: ubuntu-latest
      steps:
        - uses: actions/checkout@v4
        - uses: subosito/flutter-action@v2
          with: { flutter-version: '3.22.0' }
        - run: flutter pub get    (working-directory: mobile)
        - run: flutter analyze
        - run: flutter test

    docker-build:
      runs-on: ubuntu-latest
      needs: [backend-ci, frontend-ci]
      steps:
        - uses: actions/checkout@v4
        - run: docker compose build  (validates Dockerfiles)

Definition of Done:
  ✅ CI workflow file committed
  ✅ Pipeline triggers on push to feature branch
  ✅ All 4 jobs pass on initial commit
  ✅ CI badge added to README.md
```

#### TASK-OPS-03 · Dockerfile Setup
```
Owner:     DevOps
Priority:  P1
Estimate:  60 min
Branch:    feat/OPS-03-dockerfiles

backend/Dockerfile:
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM node:20-alpine AS production
  WORKDIR /app
  ENV NODE_ENV=production
  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  COPY --from=builder /app/dist ./dist
  COPY --from=builder /app/node_modules ./node_modules
  USER appuser
  EXPOSE 3000
  HEALTHCHECK --interval=30s CMD wget -qO- http://localhost:3000/health || exit 1
  CMD ["node", "dist/main.js"]

frontend/Dockerfile:
  FROM node:20-alpine AS builder
  WORKDIR /app
  COPY package*.json ./
  RUN npm ci
  COPY . .
  RUN npm run build

  FROM node:20-alpine AS production
  RUN addgroup -S appgroup && adduser -S appuser -G appgroup
  COPY --from=builder /app/.next/standalone ./
  COPY --from=builder /app/.next/static ./.next/static
  COPY --from=builder /app/public ./public
  USER appuser
  EXPOSE 3001
  CMD ["node", "server.js"]

.dockerignore (both services):
  node_modules, .next, .env*, *.log, coverage, .git, test

Definition of Done:
  ✅ docker compose build succeeds for both services
  ✅ docker compose up starts all services
  ✅ Backend health check passes inside container
  ✅ Non-root user confirmed: docker exec <id> whoami → appuser
```

---

### Day 1 End-of-Day Checklist

```
Time:  6:00 PM standup

Required before closing Day 1:
  [ ] BE: GET /health returns 200 from Docker container
  [ ] BE: Database connection confirmed in logs
  [ ] BE: Redis connection confirmed in logs
  [ ] BE: First migration ran successfully
  [ ] FE: npm run dev starts without errors
  [ ] FE: Dashboard layout renders at localhost:3001
  [ ] MOB: flutter run launches on Android emulator
  [ ] OPS: CI pipeline green on develop branch
  [ ] OPS: docker compose up starts all services
  [ ] ALL: .env.example committed, all env vars documented
  [ ] ALL: Feature branches merged to develop via PR
  [ ] TL: Architecture reviewed, no deviations from CLAUDE.md

If ANY of these are red at 6 PM — work continues until green.
This is the foundation. Cracks here become walls on Day 3.
```

---

## 3. Day 2 — Authentication & User Management

> **Theme:** "Identity is the foundation of trust. Get it right."
> By end of Day 2, any valid phone number can register, authenticate, and land on the correct dashboard based on their role.

### Day 2 Goals

```
✦ OTP-based phone authentication working end-to-end (SMS delivered)
✦ JWT access + refresh token pair issued and rotating correctly
✦ All user roles exist: Worker, Contractor, Admin (with RBAC guards)
✦ Worker registration flow complete (mobile app)
✦ Contractor registration flow complete (web dashboard)
✦ Login screens built and connected to real APIs
✦ Role-based routing working (worker → app, contractor → dashboard)
```

---

### Backend Tasks — Day 2

#### TASK-BE-05 · Auth Module — OTP + JWT
```
Owner:     Backend Dev
Priority:  P0
Estimate:  3 hours
Branch:    feat/BE-05-auth-module

Files to create:
  src/modules/auth/
  ├── auth.module.ts
  ├── auth.controller.ts         (routes: /auth/*)
  ├── auth.service.ts            (business logic)
  ├── token.service.ts           (JWT generation + validation)
  ├── otp.service.ts             (generate, store, verify OTP)
  ├── strategies/
  │   ├── jwt.strategy.ts        (validates access token)
  │   └── jwt-refresh.strategy.ts
  ├── guards/
  │   ├── jwt-auth.guard.ts
  │   └── roles.guard.ts
  ├── decorators/
  │   ├── public.decorator.ts    (@Public() — skip JWT guard)
  │   └── roles.decorator.ts     (@Roles(UserRole.CONTRACTOR))
  └── dto/
      ├── send-otp.dto.ts
      ├── verify-otp.dto.ts
      └── auth-response.dto.ts

Endpoints to implement:
  POST /api/v1/auth/send-otp
    Body: { phone: string }
    Validates Indian mobile (^[6-9]\d{9}$)
    Generates 6-digit OTP
    Stores in Redis: key=otp:{phone}, value=hash(otp), ttl=180s
    Stores attempt counter: key=otp:attempts:{phone}, ttl=900s
    Blocks if attempts >= 5
    Sends SMS via MSG91 (or logs OTP in dev mode)
    Returns: { message: 'OTP sent', expiresIn: 180 }

  POST /api/v1/auth/verify-otp
    Body: { phone: string, otp: string, role: UserRole }
    Verifies hash(otp) matches Redis stored value
    Deletes OTP key on success
    Upserts user record (creates if first login)
    Generates: accessToken (JWT, 15min) + refreshToken (UUID, 7 days)
    Stores refreshToken in Redis: key=refresh:{userId}:{tokenId}
    Sets refreshToken in HttpOnly cookie
    Returns: { accessToken, user: { id, phone, role, isProfileComplete } }

  POST /api/v1/auth/refresh
    Reads refreshToken from HttpOnly cookie
    Validates against Redis
    Rotates: issues new pair, invalidates old refreshToken
    Returns: { accessToken }

  POST /api/v1/auth/logout
    Deletes refreshToken from Redis
    Clears cookie
    Returns: { message: 'Logged out' }

OTP Service (Redis operations):
  generateOtp(): crypto.randomInt(100000, 999999).toString()
  hashOtp(otp): crypto.createHmac('sha256', OTP_SECRET).update(otp).digest('hex')
  storeOtp(phone, hashedOtp): SET otp:{phone} {hash} EX 180
  verifyOtp(phone, otp): compare hash(otp) with GET otp:{phone}
  checkAttempts(phone): INCR otp:attempts:{phone}, check <= 5

Token Service:
  generateAccessToken(payload): jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '15m' })
  generateRefreshToken(): uuid.v4()
  storeRefreshToken(userId, tokenId): SET refresh:{userId}:{tokenId} 1 EX 604800
  revokeRefreshToken(userId, tokenId): DEL refresh:{userId}:{tokenId}

Definition of Done:
  ✅ POST /auth/send-otp stores OTP in Redis (verify via redis-cli GET otp:{phone})
  ✅ POST /auth/verify-otp returns JWT access token
  ✅ POST /auth/refresh rotates tokens correctly
  ✅ Protected endpoint returns 401 without token
  ✅ Protected endpoint returns 403 with wrong role
  ✅ Rate limit: 6th OTP request returns 429
  ✅ Swagger documentation on all auth endpoints
```

#### TASK-BE-06 · User & Worker Entities + Registration APIs
```
Owner:     Backend Dev
Priority:  P0
Estimate:  2.5 hours
Branch:    feat/BE-06-user-registration

Entities to create:
  users.entity.ts (base identity)
    id, phone, role, isActive, lastLoginAt + BaseEntity fields

  workers.entity.ts (extends/relations with User)
    fullName, dateOfBirth, gender, city, state, pincode
    primarySkill (WorkerSkill enum), experienceYears
    expectedDailyWage, kycStatus, profileScore
    aadhaarLastFour, fcmToken + BaseEntity fields

  contractors.entity.ts
    fullName, companyName, gstNumber, city, state
    subscriptionTier, totalJobsPosted + BaseEntity fields

Enums to create:
  WorkerSkill: MASON, CARPENTER, ELECTRICIAN, PLUMBER, PAINTER,
               WELDER, STEEL_FIXER, SHUTTERING, HELPER, OTHER
  KycStatus:   PENDING, SUBMITTED, VERIFIED, REJECTED
  WorkerStatus:REGISTERED, ACTIVE, SUSPENDED, DEACTIVATED

APIs to implement:
  POST /api/v1/workers/profile         (Worker — complete profile after OTP)
    Body: CreateWorkerProfileDto {
      fullName, dateOfBirth, gender, city, state, pincode,
      primarySkill, experienceYears, expectedDailyWage
    }
    Creates WorkerProfile linked to authenticated User
    Returns: WorkerProfileResponseDto

  GET  /api/v1/workers/profile/me      (Worker — get own profile)
  PATCH /api/v1/workers/profile/me     (Worker — update own profile)

  POST /api/v1/contractors/profile     (Contractor — complete profile)
    Body: { fullName, companyName, gstNumber, city, state }

  GET  /api/v1/contractors/profile/me

Migrations to generate:
  npm run migration:generate -- CreateUsersTable
  npm run migration:generate -- CreateWorkersTable
  npm run migration:generate -- CreateContractorsTable

Definition of Done:
  ✅ User created on first OTP verify
  ✅ Worker profile API creates profile linked to user
  ✅ Contractor profile API creates profile linked to user
  ✅ GET /workers/profile/me returns full profile (no another user's data)
  ✅ Migrations run cleanly in order
  ✅ Postman collection updated with all new endpoints
```

---

### Frontend Tasks — Day 2

#### TASK-FE-03 · Login & OTP Screens (Web)
```
Owner:     Frontend Dev
Priority:  P0
Estimate:  2.5 hours
Branch:    feat/FE-03-auth-screens

Pages to build:
  app/(auth)/login/page.tsx
    Phone number input (large, autofocus)
    Indian phone validation (10 digits, 6–9 start)
    [Continue] button → calls POST /auth/send-otp
    Loading state on button during API call
    Error state: inline below input

  app/(auth)/otp/page.tsx
    6 individual OTP input boxes (48×56px each)
    Auto-advance on digit entry
    Auto-submit on 6th digit
    Countdown timer "Resend in 45s"
    Resend link (calls send-otp again)
    Loading overlay during verification

  app/(auth)/register/page.tsx (Contractor flow)
    Multi-step form:
      Step 1: Full name + company name
      Step 2: City + state (dropdown)
      Step 3: GST number (optional)
    Progress indicator (Step X of 3)
    Validation using React Hook Form + Zod

Routing after login:
  useEffect on auth success:
    if role === WORKER → push to /app (Flutter deep link)
    if role === CONTRACTOR → push to /dashboard
    if role === PLATFORM_ADMIN → push to /admin

Zustand auth store:
  store/authStore.ts
    state: { user, accessToken, isAuthenticated }
    actions: { setAuth, clearAuth, refreshToken }
    accessToken stored in memory only (never localStorage)

Definition of Done:
  ✅ Full OTP flow works end-to-end (phone → OTP → dashboard)
  ✅ Invalid phone shows error inline (not alert)
  ✅ Wrong OTP shows error inline
  ✅ Successful login stores token in memory and redirects
  ✅ Refreshing page while logged in re-fetches token (via /auth/refresh)
  ✅ Logout clears store and redirects to /login
```

#### TASK-FE-04 · Contractor Dashboard Home
```
Owner:     Frontend Dev
Priority:  P1
Estimate:  2 hours
Branch:    feat/FE-04-contractor-dashboard

Page to build: app/(dashboard)/dashboard/page.tsx

Components:
  4 StatCards:
    Active Workers | Today's Attendance | Open Jobs | Monthly Spend
    All show skeleton while loading, real data when API responds

  Placeholder sections (filled on Day 3+):
    "Recent Applications" — empty state with "Post your first job" CTA
    "Active Sites" — empty state with "Add a site" CTA

Hooks to create:
  hooks/useDashboardStats.ts → useQuery → GET /analytics/contractor/stats
  (Returns mocked data on Day 2, real data wired on Day 5)

Definition of Done:
  ✅ Contractor dashboard loads after login with 4 stat cards
  ✅ Loading skeleton appears for < 1s before stats show
  ✅ Sidebar nav items all render (links go to placeholder pages for now)
  ✅ Mobile responsive: single column on < 768px
```

---

### Mobile Tasks — Day 2

#### TASK-MOB-02 · Auth Feature — OTP Login
```
Owner:     Mobile Dev
Priority:  P0
Estimate:  3 hours
Branch:    feat/MOB-02-auth-screens

Feature folder: lib/features/auth/

Files to create:

  Domain:
    entities/user.dart              User(id, phone, role, isProfileComplete)
    repositories/auth_repository.dart  abstract class
    usecases/send_otp.dart          UseCase<void, String phone>
    usecases/verify_otp.dart        UseCase<AuthResult, VerifyOtpParams>

  Data:
    models/user_model.dart          fromJson/toJson
    datasources/auth_remote_datasource.dart   Dio calls
    repositories/auth_repository_impl.dart    impl + error mapping

  Presentation:
    providers/auth_notifier.dart    AsyncNotifier<AuthState>
    screens/phone_input_screen.dart
    screens/otp_screen.dart
    screens/worker_registration_screen.dart

Phone Input Screen:
  Large phone input field, number keyboard
  +91 prefix, Indian 10-digit validation
  [Get OTP] button (disabled until 10 digits)
  Loading state during API call

OTP Screen:
  6 separated TextField boxes (custom widget: OtpInputRow)
  Auto-advance, auto-submit on complete
  Countdown timer + Resend button
  "Wrong OTP" inline error (red border on all 6 boxes + message)

Worker Registration Screen (after first OTP verify if profile incomplete):
  Full Name → Primary Skill (bottom sheet picker) → City
  3 fields only — progressive (more in profile section)
  [Complete Registration] button

GoRouter configuration:
  /splash   → SplashScreen (check stored token → navigate)
  /login    → PhoneInputScreen
  /otp/:phone → OtpScreen
  /register → WorkerRegistrationScreen
  /home     → HomeScreen (requires auth guard)

Secure token storage:
  flutter_secure_storage: store accessToken
  Hive: store user profile for offline display

Definition of Done:
  ✅ Complete OTP flow on Android emulator with real backend
  ✅ Successful login navigates to /home (even a placeholder home)
  ✅ Failed OTP shows error without crashing
  ✅ App restores session on restart (reads token from secure storage)
  ✅ Logout clears secure storage + navigates to /login
```

---

### Day 2 End-of-Day Checklist

```
Time:  6:00 PM standup

  [ ] BE: POST /auth/send-otp sends SMS (or logs to console in dev)
  [ ] BE: POST /auth/verify-otp returns valid JWT
  [ ] BE: JWT guard blocks unauthorized requests (tested with Postman)
  [ ] BE: Worker profile + Contractor profile APIs working
  [ ] FE: Web OTP login flow works end-to-end
  [ ] FE: Contractor lands on dashboard after login
  [ ] MOB: Android OTP login works with real backend
  [ ] MOB: First-time worker sees registration screen after OTP
  [ ] ALL: No hardcoded credentials in any committed code
  [ ] CI: All pipelines green on develop branch
```

---

## 4. Day 3 — Job Marketplace & Workforce Module

> **Theme:** "Connect supply and demand. Make the core transaction work."
> By end of Day 3, a contractor can post a job and a worker can apply. The core marketplace transaction is live.

### Day 3 Goals

```
✦ Job posting API complete with all fields
✦ Job search with skill + city filtering working
✦ Worker can browse and apply to jobs (mobile)
✦ Contractor can view applications and hire a worker
✦ Worker profile page complete (view + edit)
✦ Job listing pages on web dashboard
✦ Basic Elasticsearch sync (or PostgreSQL FTS as MVP fallback)
```

---

### Backend Tasks — Day 3

#### TASK-BE-07 · Job Module — Complete CRUD + Search
```
Owner:     Backend Dev
Priority:  P0
Estimate:  3 hours
Branch:    feat/BE-07-jobs-module

Entities:
  jobs.entity.ts:
    id, title, description, contractorId, siteId (nullable)
    requiredSkill (WorkerSkill enum), workerCount, dailyWage
    startDate, endDate, jobType (DAILY/WEEKLY/CONTRACT)
    jobStatus (DRAFT/PUBLISHED/ACTIVE/FILLED/COMPLETED/CLOSED)
    city, state, latitude, longitude
    + BaseEntity fields

  job_applications.entity.ts:
    id, jobId, workerId, applicationStatus, appliedAt
    contractorNote, workerNote
    + BaseEntity fields

Enums: JobStatus, JobType, ApplicationStatus (SUBMITTED/SHORTLISTED/HIRED/REJECTED)

Endpoints:
  POST   /api/v1/jobs                  Contractor: create job
  GET    /api/v1/jobs                  Public: list with filter/pagination
    Query: ?skill=MASON&city=Mumbai&status=PUBLISHED&page=1&limit=20&sort=createdAt&order=DESC
  GET    /api/v1/jobs/:id              Public: job detail
  PATCH  /api/v1/jobs/:id              Contractor: update (own job only)
  DELETE /api/v1/jobs/:id              Contractor: soft delete (own job only)
  POST   /api/v1/jobs/:id/publish      Contractor: DRAFT → PUBLISHED
  GET    /api/v1/jobs/my              Contractor: own jobs

  POST   /api/v1/jobs/:id/apply       Worker: submit application
  GET    /api/v1/jobs/:id/applications Contractor: list applications for a job
  PATCH  /api/v1/jobs/:id/applications/:appId Contractor: update status (HIRED/REJECTED)
  GET    /api/v1/workers/me/applications Worker: own application history

Business rules:
  Worker cannot apply to same job twice (409 Conflict)
  Contractor can only manage own jobs (403 if wrong owner)
  Job auto-closes when workerCount applications are HIRED
  HIRED application triggers HireRecord creation (for attendance Day 4)

Search implementation (PostgreSQL FTS for MVP):
  CREATE INDEX idx_jobs_fts ON jobs USING GIN(
    to_tsvector('english', title || ' ' || COALESCE(description, ''))
  );
  Add ?search= query param to jobs list endpoint
  PostgreSQL: WHERE tsquery matches AND skill = $skill AND city = $city

Definition of Done:
  ✅ Contractor can create, publish, and manage jobs
  ✅ GET /jobs with ?skill=MASON&city=Mumbai returns filtered results
  ✅ Worker can apply to a job (duplicate apply returns 409)
  ✅ Contractor can mark application as HIRED
  ✅ HIRED application creates hire record for attendance module
  ✅ Postman collection updated with all job endpoints
```

#### TASK-BE-08 · Worker Discovery API + Sites Module
```
Owner:     Backend Dev
Priority:  P1
Estimate:  2 hours
Branch:    feat/BE-08-worker-discovery

Workers discovery API:
  GET /api/v1/workers
    Query: ?skill=MASON&city=Mumbai&minRating=4&minExperience=2
    Pagination + sorting
    Only returns KYC_VERIFIED or ACTIVE workers (no pending KYC)
    Excludes worker PII (no Aadhaar, no full phone) from list response

  GET /api/v1/workers/:id             Contractor: worker public profile
  POST /api/v1/workers/:id/shortlist  Contractor: save to shortlist

Sites module (minimal for MVP):
  sites.entity.ts:
    id, contractorId, name, address, city, state, latitude, longitude
    radiusMeters (default 100), isActive + BaseEntity fields
    boundary: geography column (PostGIS POLYGON, for Day 4 geo-fence)

  POST /api/v1/sites                  Contractor: create site
  GET  /api/v1/sites                  Contractor: list own sites
  GET  /api/v1/sites/:id              Contractor: site detail
  PATCH /api/v1/sites/:id             Contractor: update

Definition of Done:
  ✅ GET /workers with filters returns paginated worker list
  ✅ Worker PII masked in list response (phone shown as ***XXXXX1234)
  ✅ Site creation with location works (PostGIS point stored)
  ✅ Contractor can only see own sites
```

---

### Frontend Tasks — Day 3

#### TASK-FE-05 · Job Management — Contractor Dashboard
```
Owner:     Frontend Dev
Priority:  P0
Estimate:  3 hours
Branch:    feat/FE-05-job-management

Pages to build:

  app/(dashboard)/jobs/page.tsx       Job listing page
    DataTable with columns: Title | Skill | Location | Workers | Status | Date | Actions
    Filters: status dropdown, skill dropdown
    [Post New Job] button → opens modal

  app/(dashboard)/jobs/[id]/page.tsx  Job detail page
    Job info + Applications tab
    Applications tab: DataTable with columns: Worker | Applied | Status | Actions
    Actions: [Shortlist] [Hire] [Reject] buttons with confirmation dialogs

  JobFormModal (components/jobs/JobFormModal.tsx):
    Multi-step form (React Hook Form + Zod):
      Step 1: Title, description, required skill, worker count
      Step 2: Daily wage, job type, start date, end date
      Step 3: Site selection (dropdown from contractor's sites) or manual address
    Submit: POST /api/v1/jobs
    On success: toast "Job posted!" + close modal + refetch list

Hooks:
  hooks/useJobs.ts          → useQuery: GET /jobs/my (contractor view)
  hooks/useJob.ts           → useQuery: GET /jobs/:id
  hooks/useJobApplications  → useQuery: GET /jobs/:id/applications
  hooks/useCreateJob.ts     → useMutation: POST /jobs
  hooks/useUpdateApplication → useMutation: PATCH /jobs/:id/applications/:appId

Workers discovery page:
  app/(dashboard)/workers/page.tsx
    Search input + skill/city filters
    Grid of WorkerCards (avatar, name, skill, rating, wage expectation)
    Click → Worker profile modal (read-only view)
    [Hire for Job] → job selector → confirm

Definition of Done:
  ✅ Contractor can post a job via the form modal
  ✅ Job list shows all contractor's jobs with status
  ✅ Contractor can view applications and click Hire/Reject
  ✅ Worker discovery page loads with filters working
  ✅ All loading/empty/error states handled
```

#### TASK-FE-06 · Worker Profile Pages (Contractor View)
```
Owner:     Frontend Dev
Priority:  P1
Estimate:  1.5 hours
Branch:    feat/FE-06-worker-profile-view

WorkerProfileModal (components/workers/WorkerProfileModal.tsx):
  Rendered as a Dialog (shadcn)
  Sections: Photo + name + badges | Stats row | Skills | Availability | Work history
  Action bar: [Shortlist ♡] [Hire for Job →]

WorkerCard (components/workers/WorkerCard.tsx):
  Compact card: avatar, name, skill, city, rating, expected wage, KYC badge
  Hover: shadow-md, reveal action buttons

Definition of Done:
  ✅ Worker cards render in discovery grid with real API data
  ✅ Click opens profile modal with full data
  ✅ Hire button opens job selector → confirm → success toast
```

---

### Mobile Tasks — Day 3

#### TASK-MOB-03 · Job Listing & Application (Worker App)
```
Owner:     Mobile Dev
Priority:  P0
Estimate:  3.5 hours
Branch:    feat/MOB-03-job-listing

Feature folder: lib/features/jobs/

Screens to build:

  JobsScreen (features/jobs/presentation/screens/jobs_screen.dart):
    TabBar: Recommended Jobs | All Jobs | My Applications
    Recommended tab: ListView of JobCards (AI mock: skill-match filter)
    All Jobs tab: search bar + skill filter chips + ListView
    My Applications tab: timeline view (Applied → Shortlisted → Hired)

  JobDetailScreen:
    Hero: job title + contractor name + wage + location
    Required skill chip + worker count + dates
    Description (expandable)
    Map thumbnail showing job location (google_maps_flutter LatLng marker)
    [Apply Now] sticky bottom button (disabled if already applied)

  JobCard widget:
    Title + skill chip + city + wage/day + "X days left" countdown
    Tap → JobDetailScreen

State management (Riverpod):
  providers/jobs_notifier.dart → AsyncNotifier<JobsState>
    state: { jobs: List<Job>, myApplications: List<Application>, isLoading, error }
    actions: fetchJobs(filters), applyToJob(jobId), fetchMyApplications()

Apply flow:
  Tap [Apply Now] → confirm bottom sheet
  → POST /jobs/:id/apply
  → Success: ConfettiAnimation (simple flutter animation) + toast "Application sent!"
  → Tab switches to My Applications

Filter bottom sheet:
  Skill multi-select chips
  City text input with suggestions
  Wage range slider (₹200 – ₹2000/day)
  [Apply Filters] + [Clear] buttons

Definition of Done:
  ✅ Jobs list loads with real API data on emulator
  ✅ Search + skill filter returns filtered results
  ✅ Worker can apply to a job and see confirmation animation
  ✅ My Applications tab shows applications with status pills
  ✅ Hired application shows "Report to site on [date]" message
```

---

### Day 3 End-of-Day Checklist

```
Time:  6:00 PM standup

  [ ] BE: Contractor can create, publish, and manage jobs via API
  [ ] BE: Worker can search and apply to jobs via API
  [ ] BE: Contractor can hire a worker (application → HIRED status)
  [ ] FE: Contractor job posting form works end-to-end
  [ ] FE: Applications table shows with hire/reject actions
  [ ] FE: Worker discovery page with filters works
  [ ] MOB: Job listing loads with real data
  [ ] MOB: Worker can apply to a job from mobile
  [ ] ALL: Postman collection has all new endpoints tested
  [ ] CI: Green on develop branch
```

---

## 5. Day 4 — Attendance & Payroll System

> **Theme:** "Time is money — track it precisely, pay it honestly."
> By end of Day 4, a worker can check in using GPS or QR code, and a contractor can run payroll with one click.

### Day 4 Goals

```
✦ GPS-based attendance check-in/out working end-to-end
✦ QR code attendance as fallback
✦ Payroll calculation (base wage × days + overtime - deductions)
✦ Payslip PDF generated and accessible
✦ Attendance dashboard on contractor web portal
✦ Worker can view earnings and attendance history on mobile
```

---

### Backend Tasks — Day 4

#### TASK-BE-09 · Attendance Module
```
Owner:     Backend Dev
Priority:  P0
Estimate:  3 hours
Branch:    feat/BE-09-attendance-module

Entities:
  attendance_records.entity.ts (PARTITIONED in production, regular table for MVP):
    id, workerId, jobId, siteId, contractorId
    checkInTime, checkOutTime
    checkInLat, checkInLon, checkOutLat, checkOutLon
    geoFenceValid (boolean), method (GPS/QR/MANUAL)
    totalHours (computed on check-out), flagged (boolean)
    + BaseEntity fields

  hire_records.entity.ts (created when contractor hires worker):
    id, workerId, jobId, contractorId, siteId
    hireDate, startDate, endDate (nullable), isActive
    agreedDailyWage, wageStructureId
    + BaseEntity fields

  qr_codes.entity.ts (contractor generates for site):
    id, siteId, contractorId, code (UUID), expiresAt, isActive

Endpoints:
  POST /api/v1/attendance/check-in
    Body: { siteId, latitude, longitude, method: 'GPS' | 'QR' }
    Auth: Worker JWT
    Validates: worker has active hire record for this site/job
    Validates GPS: ST_Within(ST_Point($lon,$lat), site.boundary) → geoFenceValid
    If method=GPS and outside boundary: allow check-in but mark geoFenceValid=false
    Creates AttendanceRecord with checkInTime = NOW()
    Returns: { attendanceId, checkInTime, siteName, geoFenceValid }

  POST /api/v1/attendance/check-out
    Body: { attendanceId, latitude, longitude }
    Auth: Worker JWT
    Updates: checkOutTime = NOW(), checkOutLat/Lon, totalHours = diff
    Returns: { totalHours, estimatedEarning }

  POST /api/v1/attendance/check-in-qr
    Body: { qrCode, latitude, longitude }
    Auth: Worker JWT
    Validates QR code exists, belongs to worker's site, not expired
    Then same as GPS check-in

  GET /api/v1/attendance/my             Worker: own attendance history
    Query: ?from=2026-05-01&to=2026-05-31
    Returns daily records with hours, earnings

  GET /api/v1/attendance/site/:siteId   Contractor: site attendance
    Query: ?date=2026-05-27
    Returns all worker check-ins for the date

  GET /api/v1/attendance/summary        Contractor: attendance summary
    Query: ?jobId=&from=&to=
    Returns: { totalWorkerDays, totalHours, presentToday, absentToday }

  POST /api/v1/attendance/qr/generate   Contractor: generate QR for site
    Returns: { code, expiresAt, qrImageUrl } (QR image via qrcode library)

  GET  /api/v1/attendance/today/live    Contractor: today's live attendance list
    Returns workers currently checked in (checkOutTime IS NULL)

PostGIS geo-fence validation:
  Site boundary stored as GEOGRAPHY(POLYGON)
  For MVP: use site center + radiusMeters to construct circular boundary
  SELECT ST_DWithin(
    ST_Point($lon, $lat)::geography,
    ST_Point(site.longitude, site.latitude)::geography,
    site.radius_meters
  )

Definition of Done:
  ✅ Worker can check in with GPS coordinates → creates record
  ✅ Geo-fence validates distance from site center
  ✅ Worker can check out → totalHours calculated
  ✅ QR check-in works with valid code
  ✅ Contractor sees today's live attendance via API
  ✅ Contractor can generate QR code for their site
```

#### TASK-BE-10 · Payroll Module
```
Owner:     Backend Dev
Priority:  P0
Estimate:  3 hours
Branch:    feat/BE-10-payroll-module

Entities:
  payroll_batches.entity.ts:
    id, contractorId, periodStart, periodEnd
    batchStatus (DRAFT/PENDING_APPROVAL/PROCESSING/COMPLETED/FAILED)
    totalWorkers, totalAmount, processedAt
    + BaseEntity fields

  payroll_records.entity.ts:
    id, batchId, workerId, jobId
    workingDays, totalHours, regularHours, overtimeHours
    dailyWage, grossAmount
    pfDeduction (12%), esiDeduction (0.75%), otherDeductions
    netAmount, paymentStatus (PENDING/PROCESSING/PAID/FAILED)
    payslipUrl, utrNumber (bank reference)
    + BaseEntity fields

Payroll calculation logic (PayrollCalculationService):
  Input: workerId, jobId, periodStart, periodEnd, dailyWage

  Step 1: Aggregate attendance records for period
    SELECT SUM(total_hours), COUNT(DISTINCT DATE(check_in_time)) AS working_days
    FROM attendance_records
    WHERE worker_id = $workerId AND job_id = $jobId
    AND check_in_time BETWEEN $periodStart AND $periodEnd

  Step 2: Calculate gross
    regularHours = workingDays × 8
    overtimeHours = MAX(totalHours - regularHours, 0)
    grossAmount = (workingDays × dailyWage) + (overtimeHours × dailyWage/8 × 1.5)

  Step 3: Calculate deductions
    pfDeduction = grossAmount × 0.12   (if grossAmount > 15000/month)
    esiDeduction = grossAmount × 0.0075 (if grossAmount <= 21000/month)
    netAmount = grossAmount - pfDeduction - esiDeduction

Endpoints:
  POST /api/v1/payroll/batch            Contractor: create payroll batch
    Body: { jobId, periodStart, periodEnd }
    Calculates PayrollRecord for each active worker on job
    Status: DRAFT initially

  GET  /api/v1/payroll/batch/:id        Contractor: batch summary + worker list
  PATCH /api/v1/payroll/batch/:id/approve  Contractor: DRAFT → PENDING_APPROVAL → PROCESSING
  GET  /api/v1/payroll/my              Worker: own payroll history
  GET  /api/v1/payroll/record/:id      Worker/Contractor: single record detail
  GET  /api/v1/payroll/record/:id/payslip  Returns payslip PDF (generated on demand)

Payslip PDF generation:
  npm install pdfkit
  PDFKitService.generatePayslip(payrollRecord) → Buffer → upload to S3 → return URL
  Template: Company header, worker details, earnings table, deductions, net pay, signature line

Mock payment disbursement (MVP — no real gateway):
  PROCESSING status → wait 3 seconds → mark all records as PAID
  Set utrNumber = MOCK-{timestamp}
  In production: replace with Razorpay Payout API

Definition of Done:
  ✅ Payroll batch created with correct calculation for each worker
  ✅ PF and ESI deductions calculated correctly
  ✅ Overtime calculated for hours > 8/day
  ✅ Payslip PDF generated with correct data
  ✅ Worker sees payroll history with amounts
  ✅ Contractor sees full batch breakdown before approving
```

---

### Frontend Tasks — Day 4

#### TASK-FE-07 · Attendance Dashboard
```
Owner:     Frontend Dev
Priority:  P0
Estimate:  2.5 hours
Branch:    feat/FE-07-attendance-dashboard

Pages to build:

  app/(dashboard)/attendance/page.tsx
    Today's Overview section:
      Present count | Absent count | Late check-ins | Average hours today
    Live Attendance Table:
      Columns: Worker | Check-in Time | Check-out Time | Hours | Geo-fence | Status
      Colour coding: Present = green row tint, Absent = red, In Progress = blue
      Auto-refresh every 30 seconds (refetchInterval: 30_000 in useQuery)
    Date picker → historical attendance view

  QR Code Generator modal:
    [Generate QR Code for Site] button
    Displays QR image (from API) with 8-hour expiry
    Print button (window.print())
    Download button (canvas → PNG download)

  Payroll flow entry point:
    [Run Payroll for This Period] button → /payroll page

Attendance map placeholder (shown if GPS data exists):
  Small static Mapbox map showing site center
  "Live tracking not shown in MVP" notice
  (Full live map is Phase 2)

Definition of Done:
  ✅ Today's attendance stats update in real-time (30s poll)
  ✅ Attendance table shows correct check-in/out times
  ✅ QR code generates and is displayable/printable
  ✅ Historical date selector works
```

#### TASK-FE-08 · Payroll Management
```
Owner:     Frontend Dev
Priority:  P0
Estimate:  2 hours
Branch:    feat/FE-08-payroll-management

Pages to build:

  app/(dashboard)/payroll/page.tsx
    Period selector (from → to date range)
    [Calculate Payroll] button → POST /payroll/batch
    After calculation: PayrollReviewTable

  PayrollReviewTable (components/payroll/PayrollReviewTable.tsx):
    Columns: Worker | Days Worked | Hours | Gross | PF | ESI | Net | Status
    Totals row at bottom (sum all Net amounts)
    [Approve & Process] button (primary, full-width) — with confirmation dialog

  PayrollHistory tab:
    Past batches: Month | Workers | Total Amount | Status | Download
    Status badges: DRAFT / PROCESSING / COMPLETED / FAILED

  Payslip view:
    Click worker row → modal with payslip preview
    Download PDF button

Definition of Done:
  ✅ Payroll batch calculation UI shows correct breakdown
  ✅ Approve button processes and shows PAID status
  ✅ Payslip PDF opens in new tab (from S3 pre-signed URL)
  ✅ Export to CSV works on payroll table
```

---

### Mobile Tasks — Day 4

#### TASK-MOB-04 · Attendance Screen — GPS + QR Check-in
```
Owner:     Mobile Dev
Priority:  P0
Estimate:  3 hours
Branch:    feat/MOB-04-attendance

Feature folder: lib/features/attendance/

Screens:

  AttendanceScreen:
    If active job + not checked in:
      GPS map view (google_maps_flutter) showing worker dot + site boundary circle
      Geo-fence status: "Within site ✓" or "200m away from site ⚠"
      [Check In] button (enabled only if within boundary)
    If checked in:
      Green status card: "Checked in at 08:47 AM"
      Timer: "Working for 3h 24m"
      [Check Out] button

  QR Scanner Screen:
    Opens camera (mobile_scanner package)
    Scans QR → calls POST /attendance/check-in-qr
    Success animation → back to attendance screen

  Attendance History Screen:
    Monthly calendar view with coloured dates
    Green = present, Red = absent, Grey = no work scheduled
    Tap date → day detail (check in/out times, hours, earnings)

GPS check-in flow:
  1. Tap [Check In] → request location permission if not granted
  2. Get current GPS position (geolocator.getCurrentPosition)
  3. Show accuracy indicator (GPS accuracy in meters)
  4. If accuracy > 50m: "GPS signal weak, please wait..."
  5. POST /attendance/check-in { siteId, latitude, longitude, method: 'GPS' }
  6. If geoFenceValid=false: warn "You are outside the site boundary — check-in recorded with flag"
  7. Success: green animated confirmation

Background location ping (while checked in):
  WorkManager periodic task: every 60 seconds
  POST /attendance/location { attendanceId, latitude, longitude }
  Offline: buffer in Hive, send batch on reconnect

Definition of Done:
  ✅ GPS check-in works on physical Android device (emulator GPS mocked)
  ✅ QR scanner opens camera and processes valid QR code
  ✅ Check-in confirmation screen shows time and site name
  ✅ Attendance history calendar renders correctly
  ✅ Check-out calculates and displays total hours
```

#### TASK-MOB-05 · Wallet / Payroll Screen
```
Owner:     Mobile Dev
Priority:  P1
Estimate:  1.5 hours
Branch:    feat/MOB-05-wallet

Screens:

  WalletScreen:
    Balance card: "Available Balance ₹12,450" (from latest payroll net amounts)
    This month: Earned ₹8,200 | Deductions ₹656 | Net ₹7,544
    Payroll history: list by month (accordion expand)
    Each record: Period | Days | Net Pay | Status badge | [View Payslip]

  PayslipScreen:
    Full breakdown: Earnings, Deductions, Net
    Share to WhatsApp button (Share.share())
    Download option (opens PDF URL in InAppWebView or browser)

Definition of Done:
  ✅ Wallet screen shows correct balance from API
  ✅ Payroll history list loads correctly
  ✅ Payslip opens and is shareable
```

---

### Day 4 End-of-Day Checklist

```
Time:  6:00 PM standup

  [ ] BE: GPS check-in creates attendance record with geo-fence validation
  [ ] BE: QR check-in works with valid QR code
  [ ] BE: Payroll calculation produces correct amounts (PF, ESI, overtime)
  [ ] BE: Payslip PDF generates and is accessible via S3 URL
  [ ] FE: Attendance dashboard shows today's records with auto-refresh
  [ ] FE: QR code generates and renders in modal
  [ ] FE: Payroll table calculates + displays breakdown + processes on approval
  [ ] MOB: GPS check-in works end-to-end on Android device
  [ ] MOB: QR scanner opens and processes code
  [ ] MOB: Wallet shows payroll history with correct amounts
  [ ] ALL: No regressions in auth or job module (quick Postman run)
  [ ] CI: Green on develop
```

---

## 6. Day 5 — Notifications, Analytics & Admin Panel

> **Theme:** "Give everyone visibility. Let the platform run itself."
> By end of Day 5, push notifications are delivered, admins can manage the platform, and dashboards show real data.

### Day 5 Goals

```
✦ FCM push notifications delivered for key events
✦ SMS notifications for OTP + payment confirmation
✦ Admin panel with user management and KYC review queue
✦ Analytics dashboards showing real metrics
✦ Basic fraud signals in admin panel
✦ Monitoring setup (Datadog or CloudWatch)
✦ BullMQ queues operational (notifications + payroll processing)
```

---

### Backend Tasks — Day 5

#### TASK-BE-11 · Notification Module + BullMQ
```
Owner:     Backend Dev
Priority:  P0
Estimate:  2.5 hours
Branch:    feat/BE-11-notifications

Queues to create (BullMQ):
  notifications:push   — FCM push notifications
  notifications:sms    — MSG91 SMS
  notifications:email  — SendGrid email (basic for MVP)

Domain events to handle (@OnEvent):
  worker.registered        → Welcome SMS + Push
  job.application.hired    → SMS + Push to worker ("You've been hired for...")
  attendance.checked_in    → Push to contractor ("Rajesh checked in at BKC site")
  payroll.processed        → SMS + Push to worker ("₹7,544 processed. Payslip ready.")
  kyc.status.updated       → SMS + Push to worker

FCM Service (infrastructure/fcm/fcm.service.ts):
  sendToToken(token, { title, body, data }):
    Uses firebase-admin SDK
    Handles: invalid token (remove from DB), quota exceeded (retry queue)

SMS Service (infrastructure/sms/sms.service.ts):
  send(phone, message):
    Primary: MSG91 REST API
    Log to console in dev mode (MOCK_SMS=true env var)
    Template: store SMS templates in DB (templated with {{variables}})

In-app notifications:
  notifications.entity.ts: id, userId, title, body, type, isRead, data
  GET /api/v1/notifications       — paginated list
  PATCH /api/v1/notifications/read-all — mark all read
  Delivered via WebSocket on connect (future), fetched on app open (Day 5 MVP)

WebSocket Gateway (for contractor live attendance):
  src/modules/realtime/realtime.gateway.ts
  @WebSocketGateway({ namespace: '/contractors', cors: true })
  Auth: JWT in handshake query param
  On 'joinSite' event: join room site:{siteId}
  Backend emits to room on every check-in (from attendance module event)

Definition of Done:
  ✅ BullMQ queues operational (visible in Bull Board dashboard)
  ✅ Worker receives SMS on hire (logged in dev, real SMS in staging)
  ✅ Worker receives push notification on payroll processed (FCM token needed)
  ✅ In-app notifications stored in DB and retrievable
  ✅ WebSocket gateway accepts connections with JWT auth
```

#### TASK-BE-12 · Analytics Service + Admin Module
```
Owner:     Backend Dev
Priority:  P0
Estimate:  2.5 hours
Branch:    feat/BE-12-analytics-admin

Analytics endpoints (read from read replica or direct queries for MVP):
  GET /api/v1/analytics/platform/summary   (Admin)
    totalWorkers, totalContractors, totalJobs (open), platformGMVThisMonth

  GET /api/v1/analytics/contractor/stats   (Contractor)
    activeWorkers, todayAttendance, pendingApplications, monthlyPayroll
    attendanceRate (last 7 days), fillRate (hired/job slots)

  GET /api/v1/analytics/contractor/attendance-trend  (Contractor)
    Daily attendance count for last 30 days (for area chart)
    Returns: [{ date: '2026-05-01', present: 45, absent: 3 }, ...]

  GET /api/v1/analytics/contractor/payroll-trend     (Contractor)
    Monthly payroll total for last 6 months (for bar chart)

Admin Module:
  GET  /api/v1/admin/users           List all users (paginated, filterable by role/status)
  GET  /api/v1/admin/users/:id       User detail
  PATCH /api/v1/admin/users/:id/suspend   Suspend account
  PATCH /api/v1/admin/users/:id/activate  Restore account

  GET  /api/v1/admin/kyc/queue       KYC pending review (sorted by oldest first)
  PATCH /api/v1/admin/kyc/:workerId/approve
  PATCH /api/v1/admin/kyc/:workerId/reject  Body: { reason: string }

  GET  /api/v1/admin/stats           Platform-level statistics
  GET  /api/v1/admin/audit-logs      Recent audit trail (last 100 entries)

  Fraud signals (basic):
    GET /api/v1/admin/fraud/signals
    Query: workers with GPS check-in velocity > 100km/h in 2h
    Query: workers with check-ins from 2+ different cities same day
    Returns flagged workers list with signal description

Definition of Done:
  ✅ Contractor dashboard stats endpoint returns real data
  ✅ Admin can list + suspend + activate users
  ✅ KYC review queue sorted by oldest submission
  ✅ Admin can approve/reject KYC with reason
  ✅ Platform summary stats accessible to admin
  ✅ Fraud signals query returns flagged workers (even if 0 for MVP data)
```

---

### Frontend Tasks — Day 5

#### TASK-FE-09 · Admin Panel
```
Owner:     Frontend Dev
Priority:  P0
Estimate:  3 hours
Branch:    feat/FE-09-admin-panel

App route group: app/(admin)/

Pages:

  app/(admin)/dashboard/page.tsx:
    4 stat cards: Total Workers | Total Contractors | Open Jobs | Platform GMV
    Recent Activity feed (last 10 audit log entries)
    KYC Queue alert: "12 pending KYC reviews" → link to KYC queue

  app/(admin)/users/page.tsx:
    Tabs: All Users | Workers | Contractors
    DataTable: Name | Phone | Role | Status | Registered | Actions
    Filters: status, role, city, date range
    Row actions: [View] [Suspend] [Activate]
    Bulk actions: select multiple → suspend selected

  app/(admin)/kyc/page.tsx (Priority queue):
    List of workers with submitted KYC, sorted by submission date
    Each row: Worker name + phone | Document thumbnails | Submitted date | SLA countdown
    Actions: [Approve] [Reject with reason]
    Reject modal: reason text area + confirmation

  app/(admin)/reports/page.tsx:
    Report type selector
    Date range + scope filters
    [Generate] → loading → [Download PDF] / [Download CSV]

Admin layout:
  Different from contractor layout — monochrome sidebar, more data-dense
  Quick search bar at top of sidebar (search any user by phone)

Definition of Done:
  ✅ Admin can log in and land on admin dashboard
  ✅ User list loads with real data and pagination
  ✅ Suspend/activate works with optimistic update + API sync
  ✅ KYC queue shows pending reviews with approve/reject actions
  ✅ Admin layout is visually distinct from contractor dashboard
```

#### TASK-FE-10 · Analytics Charts — Contractor Dashboard Enhancement
```
Owner:     Frontend Dev
Priority:  P1
Estimate:  2 hours
Branch:    feat/FE-10-analytics-charts

Install: npm install recharts

Charts to add to contractor dashboard:

  AttendanceTrendChart (components/analytics/AttendanceTrendChart.tsx):
    AreaChart — 30 days of daily attendance
    X: dates, Y: worker count
    Tooltip: "27 May: 41 present, 3 absent"
    Data: GET /analytics/contractor/attendance-trend

  PayrollTrendChart (components/analytics/PayrollTrendChart.tsx):
    BarChart — 6 months of payroll spend
    X: month names, Y: amount in ₹
    Data: GET /analytics/contractor/payroll-trend

  JobFillRateDonut (components/analytics/JobFillRateDonut.tsx):
    PieChart — filled vs open slots across all jobs
    Legend: Filled (green), Open (orange)

Update Contractor Dashboard:
  Replace placeholder sections with real charts
  Wire charts to /analytics/contractor/* endpoints
  Add date range picker for attendance trend (7d / 30d / 90d)

Definition of Done:
  ✅ All 3 charts render with real data on contractor dashboard
  ✅ Charts are responsive (recharts ResponsiveContainer)
  ✅ Loading skeleton shown while chart data fetches
  ✅ Empty state for charts when no data exists yet
```

---

### Mobile Tasks — Day 5

#### TASK-MOB-06 · Push Notifications + Home Screen Enhancement
```
Owner:     Mobile Dev
Priority:  P0
Estimate:  2 hours
Branch:    feat/MOB-06-notifications

Firebase setup:
  Configure google-services.json (Android) + GoogleService-Info.plist (iOS)
  Initialize in main.dart: await Firebase.initializeApp()
  Request permission (iOS): FirebaseMessaging.requestPermission()

Token management:
  On app start: FirebaseMessaging.instance.getToken() → POST /workers/profile/me (fcmToken field)
  Token refresh: FirebaseMessaging.onTokenRefresh → update backend

Notification handling:
  Foreground: FlutterLocalNotificationsPlugin.show() (displays as local notification)
  Background: firebaseMessagingBackgroundHandler (isolate, cannot touch UI)
  Tap: GoRouter.of(context).go(notification.data['route'])
    Routes: /jobs/:id | /attendance | /wallet | /notifications

NotificationsScreen:
  List of in-app notifications from GET /notifications
  Unread highlighted with brand-50 background
  Pull to refresh
  Mark all read on screen open

Home screen enhancements:
  Active Job Banner: if has active job → show site name + check-in CTA
  Notification bell icon in AppBar with unread count badge

Definition of Done:
  ✅ FCM token registered with backend on app start
  ✅ Test push notification (via Firebase Console) delivered to app
  ✅ Tap on notification navigates to correct screen
  ✅ In-app notifications screen loads and marks read
  ✅ Unread badge shows on bell icon
```

---

### DevOps Tasks — Day 5

#### TASK-OPS-04 · Monitoring & Staging Deployment
```
Owner:     DevOps
Priority:  P0
Estimate:  3 hours
Branch:    feat/OPS-04-monitoring

Monitoring setup:
  Option A (AWS-native): CloudWatch + AWS X-Ray
  Option B (recommended): Datadog free trial

  CloudWatch setup (minimal):
    Log groups: /dlc/backend, /dlc/frontend
    Metric alarms: 5xx error rate > 5% → SNS email alert
    Dashboard: API request count, error rate, DB connections

  NestJS logging (structured JSON to stdout → CloudWatch):
    npm install winston nest-winston
    Replace default NestJS logger with Winston JSON logger
    Fields: level, timestamp, requestId, userId, message, service

  Health endpoint enhancement:
    GET /health/live  → { status: 'ok' } (liveness probe)
    GET /health/ready → checks DB + Redis connectivity (readiness probe)

Staging AWS deployment:
  Option A: ECS Fargate (simpler for MVP):
    Create ECS cluster, task definitions, services
    ALB → ECS services
    RDS + ElastiCache in private subnets

  Option B: EKS (use if team has K8s experience):
    eks-staging cluster with 3 nodes (t3.medium)
    Apply base K8s manifests

  GitHub Actions deploy-staging.yml:
    Trigger: push to develop
    Steps: test → build → push ECR → deploy to ECS/EKS

Definition of Done:
  ✅ Staging environment reachable at staging.dlc.internal (or similar)
  ✅ Backend logs appearing in CloudWatch / Datadog
  ✅ Health endpoint returns ready status in staging
  ✅ GitHub Actions deploys to staging on merge to develop
  ✅ Team notified in Slack on successful staging deploy
```

---

### Day 5 End-of-Day Checklist

```
Time:  6:00 PM standup

  [ ] BE: Push notification delivered for job hire event
  [ ] BE: BullMQ notification queues processing (verify in Bull Board)
  [ ] BE: Analytics stats endpoints return real data
  [ ] BE: Admin KYC approval/rejection works
  [ ] FE: Admin panel accessible and KYC queue shows data
  [ ] FE: Contractor dashboard charts render with real data
  [ ] FE: User management table works with suspend/activate
  [ ] MOB: FCM token registered with backend
  [ ] MOB: Test push notification received on physical device
  [ ] OPS: Staging environment deployed and accessible
  [ ] OPS: Structured logs appearing in monitoring
  [ ] ALL: End-to-end smoke test: register → job → attend → payroll → notification ✅
  [ ] CI: Green on develop branch
```

---

## 7. Day 6 — Testing, Optimization & Production Deployment

> **Theme:** "Ship with confidence. Demo with pride."
> By end of Day 6, a live URL exists, CI/CD is operational, and every critical user journey is tested.

### Day 6 Goals

```
✦ Production AWS infrastructure deployed via CI/CD
✦ All critical user journeys covered by automated tests
✦ Security review completed and findings addressed
✦ Performance baseline established (Lighthouse ≥ 75 mobile)
✦ Production deployment with zero downtime
✦ Full documentation committed and accessible
✦ MVP demo ready with seed data
```

---

### Testing Tasks — Day 6

#### TASK-QA-01 · Backend Unit Tests
```
Owner:     Backend Dev + QA
Priority:  P0
Estimate:  2.5 hours
Branch:    feat/QA-01-unit-tests

Services to test (unit tests with mocked dependencies):

  AuthService:
    ✦ sendOtp: should store hashed OTP in Redis
    ✦ sendOtp: should throw if attempts >= 5 (TooManyOtpAttemptsException)
    ✦ verifyOtp: should return auth tokens on valid OTP
    ✦ verifyOtp: should throw InvalidOtpException on wrong OTP
    ✦ refreshToken: should rotate tokens
    ✦ refreshToken: should throw if refresh token not in Redis

  JobService:
    ✦ createJob: should create job with DRAFT status
    ✦ publishJob: should transition DRAFT → PUBLISHED
    ✦ applyToJob: should create application
    ✦ applyToJob: should throw if worker already applied (DuplicateApplicationException)
    ✦ hireWorker: should create hire record and update application status

  AttendanceService:
    ✦ checkIn: should create record with geo-fence validation
    ✦ checkIn: should throw if worker not hired for site
    ✦ checkOut: should calculate correct totalHours
    ✦ checkOut: should throw if no active check-in

  PayrollService:
    ✦ calculatePayroll: should calculate correct gross for 20 working days
    ✦ calculatePayroll: should apply PF deduction (12%)
    ✦ calculatePayroll: should apply ESI deduction (0.75%)
    ✦ calculatePayroll: should calculate overtime for hours > 8/day

Target coverage: ≥ 80% on service layer for the above modules
Run: npm run test:cov — must pass in CI
```

#### TASK-QA-02 · API Integration Tests
```
Owner:     QA + Backend Dev
Priority:  P0
Estimate:  2 hours
Branch:    feat/QA-02-integration-tests

Test suites (using Supertest + real test database):

  auth.integration.spec.ts:
    POST /auth/send-otp — 200 with valid phone
    POST /auth/send-otp — 400 with invalid phone
    POST /auth/verify-otp — 200 + tokens with correct OTP
    POST /auth/verify-otp — 401 with wrong OTP
    POST /auth/refresh — 200 with valid refresh cookie

  jobs.integration.spec.ts:
    POST /jobs — 201 (as contractor)
    POST /jobs — 403 (as worker)
    POST /jobs/:id/apply — 201 (as worker)
    POST /jobs/:id/apply — 409 (duplicate application)
    PATCH /jobs/:id/applications/:appId — 200 hire (as contractor)

  attendance.integration.spec.ts:
    POST /attendance/check-in — 201 with GPS coords
    POST /attendance/check-in — 422 if not hired for site
    POST /attendance/check-out — 200 with totalHours calculated

Postman collection for manual demo:
  All 40+ endpoints organized by domain
  Environment file: { baseUrl, workerToken, contractorToken, adminToken }
  Pre-request scripts for token refresh
  Tests on every response: status code, response shape, required fields
```

#### TASK-QA-03 · Playwright E2E Tests
```
Owner:     QA
Priority:  P1
Estimate:  2 hours
Branch:    feat/QA-03-e2e-tests

Install: npm install -D @playwright/test
npx playwright install chromium

Critical paths to test:

  contractor-hiring.spec.ts:
    1. Navigate to /login
    2. Enter test contractor phone
    3. Enter OTP (read from test endpoint GET /test/latest-otp/:phone)
    4. Assert: redirected to /dashboard
    5. Click "Post New Job"
    6. Fill and submit job form
    7. Assert: job appears in jobs list
    8. Navigate to Workers, find test worker
    9. Click Hire, select job
    10. Assert: success toast shown
    11. Navigate to job, assert: application status = HIRED

  payroll-processing.spec.ts:
    1. Login as contractor
    2. Navigate to Payroll
    3. Set period (test dates with pre-seeded attendance data)
    4. Click Calculate Payroll
    5. Assert: PayrollReviewTable shows correct amounts
    6. Click Approve & Process
    7. Assert: All records show PAID status

  admin-kyc.spec.ts:
    1. Login as admin
    2. Navigate to KYC Queue
    3. Click Approve on first pending record
    4. Assert: row disappears from queue
    5. Navigate to Users
    6. Find the approved worker
    7. Assert: KYC status = VERIFIED
```

---

### Security Tasks — Day 6

#### TASK-QA-04 · Security Review
```
Owner:     Tech Lead + QA
Priority:  P0
Estimate:  2 hours

Checklist to execute (reference CLAUDE.md §5 Security Standards):

  Authentication:
    [ ] JWT secret is not hardcoded (checked in all env files)
    [ ] Access token not stored in localStorage (browser devtools check)
    [ ] Refresh token in HttpOnly cookie (Network tab check)
    [ ] OTP rate limit blocks after 5 attempts (manual test)
    [ ] Expired token returns 401 (Postman: wait 15 min and retry)

  Authorization:
    [ ] Worker cannot access /admin endpoints (expect 403)
    [ ] Contractor cannot access another contractor's jobs (expect 403)
    [ ] Worker cannot view other worker's payroll (expect 403)
    [ ] Unprotected endpoint GET /health has no auth (expect 200)

  Input validation:
    [ ] SQL injection: send ' OR 1=1 -- in search field (expect 400 or sanitized)
    [ ] XSS: send <script>alert(1)</script> in job description (verify stored safely)
    [ ] Oversized payload: send 10MB body to /workers/profile (expect 413)
    [ ] Invalid phone: send "12345" to /auth/send-otp (expect 400)

  File uploads:
    [ ] Upload .exe file as profile photo (expect 400 MIME type rejection)
    [ ] Upload 10MB image (expect 413)
    [ ] S3 URLs expire (access URL after 15 min → expect 403)

  Headers:
    [ ] X-Content-Type-Options: nosniff present in all API responses
    [ ] No Server header leaking framework version
    [ ] CORS only allows configured origins (test from different origin)

  Findings to fix before production:
    Any P0 (authentication bypass, SQL injection, XSS) → BLOCK deployment
    P1 (missing headers, rate limit gaps) → fix same day
    P2 (minor issues) → create tickets, deploy with noted risk
```

---

### DevOps Tasks — Day 6

#### TASK-OPS-05 · Production AWS Deployment
```
Owner:     DevOps
Priority:  P0
Estimate:  4 hours
Branch:    feat/OPS-05-production-deploy

AWS Infrastructure (Terraform or manual for Day 6 speed):

  VPC:
    2 public subnets (us-east-1a, us-east-1b) — ALB
    2 private subnets — ECS/EKS, RDS, ElastiCache

  RDS Aurora PostgreSQL:
    db.t3.medium, single instance (Multi-AZ for post-MVP)
    PostGIS extension enabled (run in migration)
    Automated backups: 7-day retention

  ElastiCache Redis:
    cache.t3.micro, single node (cluster for post-MVP)

  ECS Fargate (recommended for Day 6 speed over EKS):
    Cluster: dlc-production
    Task definitions: backend (512 CPU, 1024 MB), frontend (256 CPU, 512 MB)
    Services: backend (min 2 tasks), frontend (min 2 tasks)
    ALB target groups: :3000 (backend), :3001 (frontend)

  ECR:
    Repositories: dlc/backend, dlc/frontend

  Secrets Manager:
    dlc/production: DATABASE_URL, REDIS_URL, JWT_SECRET, MSG91_API_KEY, FCM_SERVER_KEY

  Route 53 + ACM:
    api.digitallabourcho wk.com → ALB (backend)
    app.digitallabourcho wk.com → ALB (frontend)
    ACM certificate (validated)

GitHub Actions deploy-production.yml:
  Trigger: workflow_dispatch (manual) with version input
  Steps:
    1. Run all tests (must pass)
    2. Build Docker images
    3. Push to ECR with version tag
    4. Run DB migrations (one-off ECS task)
    5. Update ECS service with new task definition
    6. Wait for deployment to stabilize (aws ecs wait services-stable)
    7. Run smoke tests (curl the health endpoints)
    8. Notify Slack: "Production deployed: v{version}"

Rollback plan:
  If smoke tests fail:
    aws ecs update-service --task-definition {previous-revision}
    Notify Slack: "Deployment FAILED — rolled back to {previous-version}"

Definition of Done:
  ✅ https://api.digitallabourcho wk.com/health returns { status: 'ok' }
  ✅ https://app.digitallabourcho wk.com loads contractor login page
  ✅ Production DB has all migrations applied
  ✅ HTTPS with valid ACM certificate (no browser warnings)
  ✅ GitHub Actions deployed to production via workflow_dispatch
  ✅ Rollback tested: previous task definition works
```

#### TASK-OPS-06 · CI/CD Finalization
```
Owner:     DevOps
Priority:  P0
Estimate:  1.5 hours
Branch:    feat/OPS-06-cicd-final

Final CI/CD pipeline state:

  .github/workflows/ci.yml              ← runs on every PR + push
    jobs: lint + typecheck + tests + docker-build

  .github/workflows/deploy-staging.yml  ← runs on merge to develop
    jobs: build + push ECR + migrate + deploy ECS staging + smoke tests

  .github/workflows/deploy-production.yml ← manual workflow_dispatch
    jobs: (same as staging) + 2-reviewer approval gate

  Add to all workflows:
    Slack notification on failure:
      uses: 8398a7/action-slack@v3
      with: { status: ${{ job.status }}, fields: repo,message,author }

  Bull Board endpoint:
    Add @bull-board/nestjs to backend
    Accessible at /admin/queues (admin role only)
    Shows queue depths, job counts, failed jobs

Definition of Done:
  ✅ All 3 workflow files committed and working
  ✅ Staging auto-deploys on merge to develop (verified)
  ✅ Production requires manual approval (GitHub environment protection)
  ✅ Slack notifications working for failures
  ✅ Bull Board accessible at /admin/queues in production
```

---

### Performance Tasks — Day 6

#### TASK-QA-05 · Performance Baseline
```
Owner:     Frontend Dev + QA
Priority:  P1
Estimate:  1.5 hours

Frontend Performance (Lighthouse CLI):
  npx lighthouse https://app.digitallabourcho wk.com/dashboard \
    --output json --output-path ./lighthouse-report.json

  Targets for MVP (not final product targets):
    Performance: ≥ 75 (desktop), ≥ 65 (mobile)
    Accessibility: ≥ 90
    Best Practices: ≥ 85
    SEO: ≥ 80

  Common issues to fix quickly:
    Images not using next/image → replace in top 3 pages
    Missing meta description → add to layout.tsx
    Unused JavaScript → check for large unneeded imports

Backend Performance (k6 basic load test):
  k6 run - <<EOF
  import http from 'k6/http';
  export const options = { vus: 50, duration: '30s' };
  export default function () {
    http.get('https://api.digitallabourcho wk.com/health');
  }
  EOF

  Target: p95 latency < 500ms at 50 concurrent users

  If failing:
    Check DB connection pool size (increase PgBouncer pool)
    Check response caching (add Redis cache to heavy /analytics endpoints)

Flutter App Performance:
  Profile mode build: flutter build apk --profile
  Flutter DevTools: check frame rendering times on job list scroll
  Target: no frames > 16ms (jank-free 60fps)
```

---

### Documentation Tasks — Day 6

#### TASK-ALL-01 · Documentation Cleanup
```
Owner:     ALL (each owns their domain)
Priority:  P1
Estimate:  1 hour (parallel)

Backend Dev:
  backend/README.md:
    Setup instructions (docker-compose up)
    Environment variables (all, with descriptions)
    Migration commands
    API documentation link (Swagger URL)
    Known MVP limitations

Frontend Dev:
  frontend/README.md:
    Setup instructions
    Environment variables (all NEXT_PUBLIC_ vars documented)
    Deployment instructions

Mobile Dev:
  mobile/README.md:
    Setup instructions (flutter pub get, firebase setup)
    How to configure API URL (--dart-define)
    How to build release APK
    Known device-specific issues

DevOps:
  infra/README.md:
    AWS infrastructure overview (architecture diagram or link to Architecture.md)
    How to deploy staging and production
    How to rollback
    Secrets Manager key names

Tech Lead:
  Update CLAUDE.md: mark any architectural decisions made during sprint
  Update Architecture.md: add actual deployed infrastructure details
  Create docs/decisions/ADR-001.md: document key MVP architectural decisions
  Create docs/DEMO_GUIDE.md:
    Step-by-step demo script for investor presentation
    Pre-loaded demo accounts (email + OTP codes for staging)
    Key features to show with screenshots

Definition of Done:
  ✅ All READMEs allow a new engineer to set up locally in < 30 minutes
  ✅ Demo guide committed with demo account credentials
  ✅ Swagger accessible at https://api.dlc.com/api/docs
  ✅ Postman collection shared via workspace link in README
```

---

### Day 6 End-of-Day Checklist

```
Time:  6:00 PM — Sprint Close

  [ ] All unit tests passing (npm run test — 0 failures)
  [ ] All integration tests passing
  [ ] E2E tests passing for 3 critical journeys
  [ ] Security review completed — all P0 findings resolved
  [ ] Lighthouse score ≥ 75 on desktop
  [ ] Production deployed and accessible via HTTPS
  [ ] CI/CD pipeline operational (staging auto-deploy verified)
  [ ] Demo accounts seeded in production staging
  [ ] All README.md files up to date
  [ ] Demo guide committed
  [ ] Slack message to team: "MVP Sprint Complete 🚀"
  [ ] Demo scheduled for next business day
```

---

## 8. Daily Engineering Standards

### PR Review Process

```
Rules:
  ✦ Every feature branch requires minimum 1 approval before merging to develop
  ✦ Author CANNOT approve their own PR (GitHub branch protection enforces this)
  ✦ PR reviews must happen within 2 hours during sprint (not next day)
  ✦ CI must be green before requesting review
  ✦ PR description must include: What changed, Why, How to test, Screenshots (if UI)

PR Template (.github/PULL_REQUEST_TEMPLATE.md):
  ## What changed
  [Brief description of changes]

  ## Why
  [Link to task ID: TASK-BE-07]

  ## How to test
  1. Step-by-step testing instructions
  2. Postman request or curl command if API change

  ## Screenshots
  [Before / After for UI changes]

  ## Checklist
  - [ ] Tests added/updated
  - [ ] CLAUDE.md rules followed
  - [ ] No console.log/debug code committed
  - [ ] No secrets or .env changes (unless adding to .env.example)
  - [ ] Swagger updated (if API change)

Review comment conventions:
  [BLOCKER] → must fix before merge
  [SUGGEST] → should fix, but not a blocker
  [NIT]     → minor style/naming, fix if convenient
  [Q]       → question, not requesting a change
  [PRAISE]  → explicitly noting good work
```

### Feature Branch Workflow

```
Branch lifecycle:
  1. Create branch from develop: git checkout -b feat/TASK-ID-description develop
  2. Work in small, logical commits (never 1 giant commit)
  3. Push daily (even WIP — use [WIP] prefix in commit message)
  4. Open PR when feature is complete (remove [WIP])
  5. Address review comments in new commits (never force-push after review started)
  6. Squash and merge to develop (keeps history clean)
  7. Delete branch after merge

Branch naming rules:
  feat/BE-07-jobs-module
  feat/FE-05-job-management
  feat/MOB-03-job-listing
  feat/OPS-04-monitoring
  fix/BE-12-otp-rate-limit
  test/QA-02-integration-tests
  docs/ALL-01-documentation
  hotfix/BE-auth-token-rotation    ← branches from main, PRs to both main and develop
```

### Commit Naming Convention

```
Format: <type>(<scope>): <description>

Types:  feat | fix | test | docs | chore | refactor | perf | style

Examples:
  feat(auth): implement OTP rate limiting with Redis
  feat(jobs): add job search with PostgreSQL full-text search
  fix(attendance): correct geo-fence distance calculation
  test(payroll): add unit tests for overtime calculation
  docs(api): add Swagger decorators to attendance controller
  chore(deps): upgrade NestJS to 11.0.1
  perf(jobs): add missing index on jobs.city column

Rules:
  ✦ Lowercase description, present tense ("add" not "added")
  ✦ No period at end of description
  ✦ 72 character maximum on description
  ✦ Reference task ID in commit body if relevant:
      feat(jobs): add contractor job posting endpoint

      Implements contractor-side job creation with validation.
      Closes TASK-BE-07
```

### API Documentation Updates

```
Every PR that changes an API endpoint MUST include:
  ✦ @ApiOperation({ summary: '...' }) on the controller method
  ✦ @ApiResponse({ status: 201, description: '...', type: ResponseDto }) for success
  ✦ @ApiResponse({ status: 400, description: 'Validation error' })
  ✦ @ApiResponse({ status: 401, description: 'Unauthorized' })
  ✦ @ApiResponse({ status: 403, description: 'Forbidden' }) if role-protected
  ✦ @ApiBearerAuth() if protected endpoint
  ✦ Request DTO with @ApiProperty() on every field (auto-documents request body)

Postman collection:
  Updated in the same PR as the new endpoint
  Collection file: docs/postman/DLC-API.postman_collection.json
  Environment file: docs/postman/DLC-Environment.postman_environment.json
  Tests on every request (status code + response shape)
```

### Test Coverage Requirements

```
Minimum gate (CI enforces these — build fails if below threshold):
  Backend service layer:  80% line coverage
  Backend DTOs:           100% (class-validator decorators — no untested validation)
  Frontend hooks:         70% line coverage
  Flutter domain layer:   85% line coverage

Per-sprint targets (aspirational, not CI gate):
  Backend overall:        75%
  Frontend overall:       65%
  Flutter overall:        70%

What counts as "tested":
  ✦ Unit tests for service methods (happy path + primary error case minimum)
  ✦ Integration test for every API endpoint (at least 1 call per endpoint)
  ✦ E2E test for every critical user journey (3 journeys minimum for MVP)
  ✦ Manual smoke test for every new mobile screen before PR is opened
```

---

## 9. QA Checklist

### Authentication Testing

```
Test Case                                           Expected    Status
────────────────────────────────────────────────────────────────────
POST /auth/send-otp with valid phone                200 OK      [ ]
POST /auth/send-otp with invalid phone (5 digits)   400 Bad     [ ]
POST /auth/send-otp 6th attempt (rate limit)         429 Too     [ ]
POST /auth/verify-otp with correct OTP              200 + JWT   [ ]
POST /auth/verify-otp with wrong OTP                401         [ ]
POST /auth/verify-otp with expired OTP (wait 3min)  401         [ ]
POST /auth/refresh with valid cookie                200 + JWT   [ ]
POST /auth/refresh with invalid cookie              401         [ ]
POST /auth/logout                                   200         [ ]
GET  /workers/profile/me after logout               401         [ ]
Worker accessing /admin endpoint                    403         [ ]
Contractor accessing /workers/:id/suspend (admin)   403         [ ]
Valid JWT but suspended user                        403         [ ]
Mobile: OTP flow on Android                         ✅ Pass     [ ]
Mobile: Session persists after app restart          ✅ Pass     [ ]
Mobile: Logout clears all local data                ✅ Pass     [ ]
```

### API Testing (Postman)

```
Test Suite                  Endpoints    Pass Rate    Status
──────────────────────────────────────────────────────────
Authentication              8            100%         [ ]
Worker Registration         5            100%         [ ]
Contractor Profile          4            100%         [ ]
Job Management              10           100%         [ ]
Job Applications            6            100%         [ ]
Sites Management            5            100%         [ ]
Attendance GPS              4            100%         [ ]
Attendance QR               3            100%         [ ]
Payroll Calculation         4            100%         [ ]
Payroll Processing          3            100%         [ ]
Notifications               3            100%         [ ]
Analytics                   4            100%         [ ]
Admin User Mgmt             5            100%         [ ]
Admin KYC Queue             4            100%         [ ]
────────────────────────────────────────────────────────
Total                       68           ≥ 95%        [ ]
```

### Mobile Testing (Android Physical Device)

```
Flow                         Steps                           Pass    Device
──────────────────────────────────────────────────────────────────────────
OTP Login                    Enter phone → receive OTP →     [ ]     Android 12
                             verify → land on home
Profile Setup                Complete 3-field registration   [ ]     Android 10
Job Search                   Search → filter → view detail  [ ]     Android 11
Job Application              Apply → see confirmation        [ ]     Android 12
GPS Check-in                 On-site → tap check in →        [ ]     Android 10
                             confirmation screen
QR Check-in                  Scan QR → check in             [ ]     Android 12
Check-out                    Tap check out → hours shown     [ ]     Android 11
Wallet View                  View earnings + payslip         [ ]     Android 10
Push Notification            Receive hire notification       [ ]     Android 12
Offline Mode                 Airplane mode → check in →      [ ]     Android 11
                             sync on reconnect
```

### Responsive Design Testing

```
Breakpoint       Device/Width       Pages Tested              Pass
──────────────────────────────────────────────────────────────────
320px           iPhone SE equiv    Login, Dashboard, Jobs      [ ]
375px           iPhone 14          Login, Dashboard, Jobs      [ ]
390px           iPhone 15 Pro      Login, Dashboard, Jobs      [ ]
768px           iPad mini          Dashboard, Attendance       [ ]
1024px          iPad Pro           Full dashboard              [ ]
1280px          13" laptop         All pages                   [ ]
1440px          15" laptop         All pages                   [ ]
1920px          27" desktop        All pages                   [ ]

Rules checked per breakpoint:
  [ ] No horizontal scroll on any page
  [ ] Text never below 16px
  [ ] Buttons minimum 44px touch target on mobile
  [ ] Tables scroll horizontally on mobile (not overflow hidden)
  [ ] Modals become bottom sheets on < 640px
  [ ] Sidebar collapses to drawer on < 768px
```

### Security Validation

```
Category              Test                                    Pass
──────────────────────────────────────────────────────────────────
SQL Injection         ' OR 1=1 -- in search params           [ ]
XSS                   <script>alert(1)</script> in text field [ ]
IDOR                  Access /workers/:other-id               [ ]
Broken Auth           JWT from User A works for User B?       [ ]
File Upload           .exe file → rejected                    [ ]
File Upload           50MB file → rejected                    [ ]
Rate Limiting         OTP: 6 attempts → 429                  [ ]
Rate Limiting         API: 1001 req/min → throttled           [ ]
Sensitive in logs     Aadhaar number in logs?                 [ ]
Sensitive in response Stack trace in 500 error?               [ ]
HTTPS                 HTTP redirects to HTTPS                 [ ]
Token Storage         Access token in localStorage?           [ ]
Cookie Security       Refresh token HttpOnly+Secure?          [ ]
CORS                  Request from invalid origin rejected?    [ ]
```

---

## 10. Final MVP Deliverables

### Deliverable Checklist

```
Web Applications:
  [ ] Contractor Dashboard — https://app.dlc.com (or staging URL)
      Login, Dashboard, Jobs, Workers, Attendance, Payroll, Reports
  [ ] Enterprise Portal — https://enterprise.dlc.com
      (MVP scope: same as contractor, different branding/nav)
  [ ] Admin Panel — https://admin.dlc.com
      User management, KYC review, Analytics, System config

Mobile Application:
  [ ] Worker App APK — https://github.com/.../releases/tag/v1.0.0-mvp
      Android 10+ compatible, tested on 3 real devices
      Features: Login, Jobs, Apply, Attendance (GPS+QR), Wallet, Notifications

Backend API:
  [ ] REST API — https://api.dlc.com
  [ ] API Documentation — https://api.dlc.com/api/docs (Swagger UI)
  [ ] Health endpoint — https://api.dlc.com/health
  [ ] 68+ endpoints across all domains

Database:
  [ ] PostgreSQL (Aurora) — production instance running
  [ ] All migrations applied (verify: SELECT * FROM migrations ORDER BY id)
  [ ] Seed data: 5 workers, 3 contractors, 10 jobs, 30 days attendance data
  [ ] PostGIS extension enabled and site geo-fences created for demo

Infrastructure:
  [ ] Docker Compose (local) — docker-compose up starts everything in < 2 min
  [ ] AWS production — ECS + RDS + ElastiCache + CloudFront
  [ ] Kubernetes manifests committed to infra/ folder (even if using ECS for MVP)
  [ ] Terraform modules for VPC, ECS, RDS, ElastiCache

CI/CD Pipeline:
  [ ] GitHub Actions: CI on every PR (lint + type-check + tests + docker build)
  [ ] GitHub Actions: Auto-deploy to staging on merge to develop
  [ ] GitHub Actions: Manual deploy to production with approval gate
  [ ] Rollback tested and documented

Technical Documentation:
  [ ] CLAUDE.md — coding standards + AI agent rules
  [ ] Architecture.md — system design
  [ ] Design.md — UI/UX standards
  [ ] Skills.md — team handbook
  [ ] Task.md — sprint execution (this file)
  [ ] backend/README.md — setup + environment + API docs link
  [ ] frontend/README.md — setup + deployment
  [ ] mobile/README.md — setup + build instructions
  [ ] infra/README.md — infrastructure + deployment runbook
  [ ] docs/DEMO_GUIDE.md — investor demo walkthrough
  [ ] docs/postman/ — Postman collection + environment files

Test Artifacts:
  [ ] Unit test results: npm run test (backend) — 0 failures
  [ ] E2E test results: npx playwright test — 3 flows passing
  [ ] Security review findings document
  [ ] Lighthouse reports (desktop + mobile) — stored in docs/
  [ ] Postman test run results — 95%+ pass rate
```

### Demo Accounts (Pre-seeded in Staging)

```
Role               Phone           OTP (staging only)   Credentials
──────────────────────────────────────────────────────────────────
Worker             9876543210      123456               Profile: Rajesh Kumar (Mason, Mumbai)
Contractor         9876543211      123456               Profile: Ravi Constructions, 5 active jobs
Enterprise Admin   9876543212      123456               Profile: BuildCorp India Ltd
Platform Admin     9876543213      123456               Full admin access

Demo Data:
  Workers: 5 verified workers with complete profiles, photos, skills
  Jobs: 3 published jobs (Mason, Carpenter, Electrician) in Mumbai
  Sites: 2 sites with geo-fence boundaries (BKC, Andheri West)
  Attendance: 30 days of past attendance data for payroll demo
  Payroll: 1 completed batch (April 2026), 1 pending batch (May 2026)
  Notifications: 5 unread notifications for demo worker
```

### Sprint Velocity Metrics

```
Track and report these for sprint retrospective:

  Total tasks completed:     ___ / 38
  PRs merged:                ___ (target: 38+ PRs)
  Bugs found in QA:          ___
  Bugs fixed same day:       ___
  P0 security findings:      ___ (must be 0 at ship)
  CI pipeline green rate:    ___% (target: > 90%)
  Test coverage (backend):   ___% (target: > 80%)
  Lighthouse score (mobile): ___ (target: > 65)
  Deploy time (staging):     ___ minutes
  Deploy time (production):  ___ minutes
```

### Post-Sprint: Week 2 Priorities

```
Immediately after MVP:

  P0: Payment gateway integration (Razorpay Payouts for real disbursement)
  P0: KYC AI verification (AWS Textract for Aadhaar OCR)
  P0: AI job matching engine (Elasticsearch kNN + worker embeddings)
  P1: Real-time site map (Mapbox live GPS tracking on contractor dashboard)
  P1: Biometric attendance (face match via AWS Rekognition)
  P1: Enterprise multi-vendor portal (company dashboard expansion)
  P2: Elasticsearch migration (replace PostgreSQL FTS for worker/job search)
  P2: Kubernetes migration from ECS (if team grows)
  P2: Analytics data warehouse (Redshift or BigQuery for historical analysis)
  P3: iOS app (Flutter already cross-platform — just needs provisioning profile)
  P3: Hindi localisation (i18n keys all in place — translation only)
```

---

*Task.md — Digital Labour Chowk*
*6-Day MVP Sprint | Version 1.0 | May 2026*
*"Six days to build the foundation. Six months to build the moat."*

---

> **Sprint war room:** #engineering-sprint (Slack)
> **Blockers:** Tag @tech-lead immediately — never hold blockers until standup
> **Demo:** Scheduled for Day 7 morning — invite investors, advisors, first 3 contractors
