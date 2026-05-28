# Skills.md — Digital Labour Chowk

> **Engineering Team Handbook & Skills Reference**
> Version 1.0 | For Engineers, Leads, and AI Coding Agents
> Platform: Labour Marketplace & Workforce Management System
> Style: Claude Code Vibe Coding — AI-native, product-first, ship with confidence

---

## Table of Contents

1. [Engineering Philosophy](#1-engineering-philosophy)
2. [Required Frontend Skills](#2-required-frontend-skills)
3. [Required Backend Skills](#3-required-backend-skills)
4. [Mobile Development Skills](#4-mobile-development-skills)
5. [Database Skills](#5-database-skills)
6. [DevOps Skills](#6-devops-skills)
7. [Security Skills](#7-security-skills)
8. [AI Coding Skills](#8-ai-coding-skills)
9. [Testing Skills](#9-testing-skills)
10. [Soft Skills](#10-soft-skills)
11. [Team Roles](#11-team-roles)
12. [Engineering Standards](#12-engineering-standards)
13. [AI Agent Collaboration Rules](#13-ai-agent-collaboration-rules)

---

## 1. Engineering Philosophy

### The Prime Directive

> **Build for the mason on a ₹6,000 phone, not the engineer on a MacBook Pro.**

Every technical decision — architecture, performance budget, API design, UI interaction — is evaluated through this lens. If it works brilliantly on a high-end dev machine but breaks down on a low-RAM Android device with 2G connectivity, it is not done.

---

### AI-Assisted Development

We are an **AI-native engineering team**. This is not a preference — it is a structural advantage over teams that use AI as an afterthought. Every engineer on this team is expected to be fluent in AI-assisted development workflows.

**What AI-assisted means here:**

```
Traditional workflow:              AI-native workflow:
─────────────────────              ─────────────────────────────────
Read docs (30 min)                 Describe intent to Claude (2 min)
Write boilerplate (45 min)         Review + refine generated code (10 min)
Debug setup issues (60 min)        Write the interesting problem-solving part
Write the interesting part (2h)    Ship in 1/3 the time
Write tests (30 min)               Tests generated alongside the code
Total: ~4.5 hours                  Total: ~1–1.5 hours
```

**What AI-assisted does NOT mean:**

```
❌ Blindly accepting every token Claude generates
❌ Skipping code review because "the AI wrote it"
❌ Letting AI design your architecture (you own this)
❌ Using AI to avoid understanding the code you ship
❌ Generating 500 lines and merging without reading them

✅ Using AI to accelerate the implementation of YOUR decisions
✅ Reviewing AI output with the same rigour as any PR
✅ Using AI to explore edge cases you might miss
✅ Using AI to write tests first, then implementation
✅ Treating AI suggestions as a "smart first draft", not the final word
```

---

### Rapid Iteration

We operate in **2-week sprints** with working software shipping every sprint. This rhythm requires engineering discipline:

```
Day 1–2:   Design + architecture decisions made (not during implementation)
Day 3–10:  Build with AI assistance, review continuously
Day 11:    Feature freeze, bug fixing, documentation
Day 14:    Demo, retro, deploy to staging

Speed comes from:
  Good upfront design (30 min well-spent saves 3 hours of refactoring)
  Strong module boundaries (change one thing, only one thing breaks)
  AI acceleration for implementation (once design is solid)
  Test-as-you-go (catch bugs at 5 min cost, not 5 hour regression)
  No heroics — consistent 8-hour days beat two 14-hour days
```

---

### Scalable Engineering

Write code that scales to 10× the load without architectural rewrites:

```
Scalability is not just infrastructure — it is code quality:

  Write stateless services         → horizontal scaling trivial
  Use async for side effects       → I/O never blocks the thread
  Never hold secrets in memory     → pods can restart anytime
  Design for idempotency           → safe to retry anything
  Parameterise everything          → behaviour config, not code changes
  Paginate all lists from day one  → no "works until 1000 records" bugs
  Cache with explicit invalidation → no stale data surprises at scale

Premature optimisation:
  We DO NOT optimise speculatively.
  We DO design structurally for scale (clean interfaces, async patterns).
  We DO add caching when we can measure a problem, not guess one.
```

---

### Product-First Mindset

**Engineers here are product engineers, not feature factories.**

```
What this means in practice:

  Before writing code, ask:
    "Does this solve a real problem for a worker or contractor?"
    "Is there a simpler solution that delivers 90% of the value?"
    "What happens when this fails? Is the failure graceful?"

  When estimating, ask:
    "What is the smallest version of this we can ship and learn from?"
    "Are we building this because we know users need it, or because it's interesting?"

  When reviewing PRs, ask:
    "Would this make Rajesh the mason's day better or worse?"
    "Is this code simpler than what it replaced?"

  Signs you have the mindset:
    You've said "we don't need to build that yet" and been right
    You've simplified a design after talking to a user
    You measure features by adoption, not by lines of code
```

---

## 2. Required Frontend Skills

### Core Competencies

#### React.js — Proficiency: Advanced

```
What you must know:

Component Model:
  ✦ Functional components only (no class components in new code)
  ✦ Hooks: useState, useEffect, useCallback, useMemo, useRef, useContext
  ✦ Custom hooks — extract and reuse stateful logic
  ✦ Understand the re-render model — when it happens, how to prevent unnecessary ones
  ✦ Keys in lists — why they matter, what breaks without correct keys
  ✦ Portals — for modals, tooltips that need to escape DOM stacking contexts

Performance:
  ✦ React.memo — when it helps, when it hurts (overuse is a bug)
  ✦ useCallback + useMemo — only for expensive computations or stable references
  ✦ Code splitting — React.lazy + Suspense for route-level chunks
  ✦ Virtual DOM diffing — understand why moving array items needs stable keys

Patterns:
  ✦ Compound components (DataTable, Tabs, Accordion)
  ✦ Render props — understand legacy pattern for working with existing libs
  ✦ Context + reducer for medium-complexity local state
  ✦ Forward refs for form library integration (RHF + shadcn)

What trips up junior engineers (know these):
  ✦ Stale closures in useEffect
  ✦ Dependency array mistakes leading to infinite loops
  ✦ Object/array equality in deps ([] !== [] reference equality)
  ✦ useEffect cleanup (returning a cleanup function)
```

#### Next.js 15 — Proficiency: Advanced

```
App Router (Required — we use App Router exclusively):
  ✦ File-based routing: page.tsx, layout.tsx, loading.tsx, error.tsx, not-found.tsx
  ✦ Server Components vs Client Components — when to use each (understand the boundary)
  ✦ 'use client' directive — only when browser APIs, hooks, or interactivity needed
  ✦ Data fetching in Server Components (async components, fetch with cache config)
  ✦ Route groups: (auth), (dashboard) for layout isolation
  ✦ Dynamic routes: [id], [...slug], catch-all patterns
  ✦ Parallel routes and intercepting routes (modal patterns)
  ✦ Server Actions — form submissions without API route boilerplate
  ✦ Streaming + Suspense for progressive loading

Performance:
  ✦ next/image — automatic WebP, lazy loading, blur placeholder
  ✦ next/font — self-hosted fonts, no layout shift
  ✦ Static vs dynamic rendering — know which pages should be static
  ✦ Route segment config: revalidate, dynamic, runtime settings
  ✦ Middleware for auth redirects (not for heavy logic)

Deployment:
  ✦ Docker build output for self-hosted EKS deployment
  ✦ Environment variables: NEXT_PUBLIC_ prefix for client-side
  ✦ next.config.ts: image domains, redirects, headers, rewrites
```

#### TypeScript — Proficiency: Advanced

```
Type system fundamentals (you must be comfortable with all of these):
  ✦ Union types:          type Status = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'
  ✦ Intersection types:   type AdminWorker = Worker & AdminPermissions
  ✦ Generics:             function paginate<T>(items: T[]): PaginatedResult<T>
  ✦ Utility types:        Partial<T>, Required<T>, Pick<T,K>, Omit<T,K>, Record<K,V>
  ✦ Conditional types:    T extends string ? 'string' : 'other'
  ✦ Template literals:    type Route = `/api/v1/${string}`
  ✦ Discriminated unions: for type-safe state machines
  ✦ Type guards:          function isWorker(u: User): u is Worker { ... }
  ✦ const assertions:     as const for literal type inference
  ✦ Satisfies operator:   validates without widening type

Configuration:
  ✦ tsconfig.json — strict mode enabled, path aliases (@/*), ES2022 target
  ✦ Understand noImplicitAny, strictNullChecks, strictFunctionTypes
  ✦ Declaration files (.d.ts) — when and how to write them

Anti-patterns to avoid:
  ❌ as any — if you use this, you owe the team an explanation
  ❌ as unknown as T — double cast is a red flag
  ❌ Ignoring TypeScript errors with @ts-ignore (use @ts-expect-error with comment)
  ❌ Overloading where union types would be cleaner
```

#### TailwindCSS — Proficiency: Intermediate–Advanced

```
Core knowledge:
  ✦ Utility-first mental model — no context-switching to CSS files
  ✦ Responsive prefixes: sm: md: lg: xl: 2xl: (mobile-first)
  ✦ State variants: hover: focus: active: disabled: group-hover: peer-*
  ✦ Dark mode: dark: variant
  ✦ Arbitrary values: w-[240px] h-[calc(100vh-64px)] (use sparingly)
  ✦ @apply in globals.css for repeated utility combinations
  ✦ Component extraction with cva() (class-variance-authority)
  ✦ cn() utility (clsx + tailwind-merge) for conditional class merging

Design token integration:
  ✦ Extend tailwind.config.ts with our custom tokens (see Design.md §11)
  ✦ Never hardcode colour hex values in className — use token names
  ✦ Use spacing scale (space-4 = 16px), not arbitrary values for standard spacing

Performance:
  ✦ PurgeCSS is automatic (content: paths in config) — understand how it works
  ✦ Group related utilities with @layer components for semantic custom classes
```

#### State Management — Proficiency: Advanced

```
Zustand (UI/client state):
  ✦ Create slices for distinct concerns (auth, ui, filters)
  ✦ Use immer middleware for complex nested updates
  ✦ Persist middleware for localStorage-backed state
  ✦ Subscriptions with selectors (avoid re-renders on unrelated state)
  ✦ Know when NOT to use Zustand (server state → use TanStack Query)

TanStack Query v5 (server state):
  ✦ useQuery for read operations — understand stale time vs cache time
  ✦ useMutation for write operations — onSuccess invalidation pattern
  ✦ Optimistic updates for snappy UI (especially hire/shortlist actions)
  ✦ Query key factory pattern (consistent, type-safe query keys)
  ✦ Prefetching for anticipated navigation (hover over worker → prefetch profile)
  ✦ Infinite queries for "load more" worker lists
  ✦ Query invalidation strategy — invalidate specifically, not broadly

The rule:
  Server state (API data) → TanStack Query
  Client state (modals, filters, UI preferences) → Zustand
  Form state → React Hook Form
  URL state (filters, pagination) → useSearchParams (Next.js)
  Never mix: no API calls in Zustand stores
```

#### API Integration — Proficiency: Advanced

```
Axios configuration:
  ✦ Base instance with baseURL, timeout, default headers
  ✦ Request interceptor: attach Authorization header from memory
  ✦ Response interceptor: unwrap data, handle 401 → token refresh
  ✦ Retry interceptor: retry 3× on 5xx with exponential backoff
  ✦ TypeScript: typed axios requests with generic response type

Patterns:
  ✦ API module per domain (workersApi.ts, jobsApi.ts) — never inline fetches
  ✦ Consistent error handling — map API errors to typed error objects
  ✦ Request cancellation (AbortController) for autocomplete/search
  ✦ Upload progress tracking for KYC document uploads

Type safety:
  ✦ Response types mirror backend DTOs (generate from OpenAPI schema when possible)
  ✦ Zod schema validation on API responses in development mode
```

---

## 3. Required Backend Skills

### Node.js — Proficiency: Advanced

```
Runtime fundamentals:
  ✦ Event loop — understand libuv, the call stack, microtask queue, macrotask queue
  ✦ Async/await vs Promise chains — when each is appropriate
  ✦ Stream API — piping large files, avoiding loading everything into memory
  ✦ Worker threads — CPU-intensive tasks (PDF generation, report processing)
  ✦ Cluster mode — understanding (NestJS / PM2 handles this, but know why)
  ✦ Memory management — avoiding memory leaks in long-running services
  ✦ Buffer and typed arrays — working with binary data (file uploads, crypto)

Common pitfalls:
  ✦ Blocking the event loop with synchronous I/O (crypto.pbkdf2Sync in request handler)
  ✦ Unhandled promise rejections (always catch, always log)
  ✦ process.env mutations in tests (use dedicated test config)
  ✦ Forgetting to close DB connections in tests (Jest open handles)
```

### NestJS — Proficiency: Advanced

```
Core framework concepts:
  ✦ Module system — imports, exports, providers, controllers
  ✦ Dependency injection — understand the IoC container, scope (DEFAULT, REQUEST, TRANSIENT)
  ✦ Decorators — @Injectable, @Controller, @Get/@Post, @Body, @Param, @Query, @Headers
  ✦ Guards — CanActivate, ExecutionContext, Reflector for metadata
  ✦ Interceptors — NestInterceptor, Observable pipeline (response transform, logging)
  ✦ Pipes — PipeTransform, ValidationPipe, ParseIntPipe
  ✦ Filters — ExceptionFilter, catch all exceptions globally
  ✦ Middleware — NestMiddleware, order of execution relative to guards
  ✦ Custom decorators — createParamDecorator for @CurrentUser()

Advanced patterns:
  ✦ Dynamic modules — forRoot() / forRootAsync() pattern (ConfigModule, TypeOrmModule)
  ✦ Circular dependency — forwardRef() (avoid, but know how to use)
  ✦ Event emitter — @OnEvent handlers for domain events
  ✦ Cron jobs — @Cron() with @nestjs/schedule
  ✦ WebSocket gateway — @WebSocketGateway, @SubscribeMessage
  ✦ Microservices — @MessagePattern, ClientProxy (Phase 2 knowledge)
  ✦ Config module — @nestjs/config, ConfigService, typed config namespaces
  ✦ Swagger — @ApiOperation, @ApiResponse, @ApiTags, @ApiBearerAuth

Testing in NestJS:
  ✦ Test.createTestingModule() — unit test setup
  ✦ createMock<T>() — typed mocks for service dependencies
  ✦ e2e with supertest — full HTTP layer testing
```

### REST API Design — Proficiency: Advanced

```
Resource design:
  ✦ Plural nouns, not verbs: /workers not /getWorkers
  ✦ Nested resources for relationships: /sites/:id/workers
  ✦ Actions on resources: POST /workers/:id/approve-kyc
  ✦ Correct HTTP verbs: GET (read), POST (create), PATCH (partial update), DELETE (soft delete)
  ✦ Consistent pagination: page + limit + sort + order as query params
  ✦ Filtering via query strings: ?skill=mason&city=mumbai&status=ACTIVE

Versioning:
  ✦ URL versioning (/api/v1/) — we use this
  ✦ Sunset headers for deprecated versions
  ✦ Never break v1 without a 90-day deprecation notice

Response design:
  ✦ Consistent envelope: { success, data, message, meta }
  ✦ Consistent error format: { success, error: { code, message, details } }
  ✦ Never expose internal IDs (UUIDs only), stack traces, or DB column names
  ✦ HATEOAS — considered but not implemented (future consideration)
```

### Authentication & JWT — Proficiency: Advanced

```
JWT implementation:
  ✦ RS256 asymmetric signing — private key signs, public key verifies
  ✦ Access token (15 min, in-memory only) + refresh token (7 days, HttpOnly cookie)
  ✦ JWKS endpoint (/.well-known/jwks.json) for key distribution
  ✦ Token rotation: new refresh token on every use (detect token theft)
  ✦ Token revocation: Redis allowlist/denylist strategies
  ✦ Claims design: sub, role, sessionId, iat, exp — no sensitive data in payload

Passport.js strategies:
  ✦ JwtStrategy, JwtRefreshStrategy
  ✦ Custom validation callback — check user active status, not just token validity

OTP flow:
  ✦ Redis-backed OTP with TTL and attempt limiting
  ✦ Hash OTP before storage (HMAC-SHA256, not MD5/SHA1)
  ✦ SMS provider abstraction (swap MSG91 → Twilio without business logic changes)
```

### RBAC — Proficiency: Advanced

```
Implementation:
  ✦ Role enum with clear hierarchy
  ✦ Permission-based checks (not just role checks) for fine-grained control
  ✦ @Roles() decorator + RolesGuard for controller-level enforcement
  ✦ Resource ownership check (contractor can only see their own workers)
  ✦ Admin impersonation audit log (any admin acting as another user is logged)

Testing RBAC:
  ✦ Unit test each role's access to each endpoint
  ✦ Negative tests — verify forbidden paths actually return 403
  ✦ Test role escalation attempts (worker trying to access contractor endpoints)
```

### PostgreSQL with TypeORM — Proficiency: Advanced

```
TypeORM patterns:
  ✦ Entity decorators: @Entity, @Column, @PrimaryGeneratedColumn('uuid')
  ✦ Relations: @OneToMany, @ManyToOne, @ManyToMany, @JoinColumn
  ✦ Cascades: understand when cascade delete is right vs wrong
  ✦ Query builder: complex joins, subqueries, raw SQL when needed
  ✦ Repository pattern: custom repositories extending Repository<T>
  ✦ Migrations: generate, run, revert — reversible down() methods always
  ✦ Transactions: queryRunner.startTransaction() for multi-step operations
  ✦ Soft delete: @DeleteDateColumn + softDelete() + withDeleted option

PostGIS (geospatial):
  ✦ GEOGRAPHY vs GEOMETRY column types
  ✦ ST_Within for geo-fence validation
  ✦ ST_Distance for proximity searches
  ✦ Spatial indexes (GIST) for performance
```

### Redis — Proficiency: Intermediate–Advanced

```
Data structures (know when to use each):
  ✦ Strings:   OTP storage, rate limit counters, simple caches
  ✦ Hashes:    Session data, user profile cache (field-level access)
  ✦ Lists:     BullMQ queues, activity feeds
  ✦ Sets:      Unique visitor tracking, tag collections
  ✦ Sorted sets: Worker ranking by score, live site worker locations (score=timestamp)
  ✦ Streams:   Event log, Kafka-lite use cases (future)

Patterns:
  ✦ Cache-aside pattern: check cache → miss → DB → populate cache
  ✦ Write-through pattern: write DB + cache simultaneously
  ✦ TTL management: always set TTLs, never leave keys immortal
  ✦ Key naming conventions: {namespace}:{entity}:{id}:{field}
  ✦ Atomic operations: INCR, SETNX for race-condition-safe counters
  ✦ Pub/Sub: Socket.io Redis adapter, real-time location broadcasts
  ✦ Lua scripting: atomic check-and-set operations
```

### Queue Systems — Proficiency: Intermediate

```
BullMQ:
  ✦ Queue, Worker, QueueEvents — the three primitives
  ✦ Job options: attempts, backoff (exponential), delay, priority, removeOnComplete
  ✦ Processor function — async, returns result, throws on failure
  ✦ Concurrency control per worker: number of parallel jobs per processor
  ✦ Dead letter queue pattern: jobs that exhaust retries → alert + log
  ✦ Flow/Parent-child jobs: payroll batch → individual payment jobs
  ✦ Rate-limited queues: SMS sending at provider rate limits
  ✦ Scheduled jobs: cron string syntax, repeatable jobs
  ✦ KEDA autoscaling: custom Kubernetes metric based on queue length
```

---

## 4. Mobile Development Skills

### Flutter — Proficiency: Advanced

```
Dart language:
  ✦ null safety — ?, ??, !, late — understand each precisely
  ✦ async/await, Future, Stream — understand differences
  ✦ Isolates — Dart's equivalent of worker threads for CPU work
  ✦ Extension methods — adding functionality to existing types
  ✦ Mixins — composition over inheritance
  ✦ Generics — typed data structures, repositories
  ✦ const constructors — compile-time constants for performance
  ✦ Named + positional + optional parameters — all three patterns

Flutter framework:
  ✦ Widget tree fundamentals — StatelessWidget, StatefulWidget, InheritedWidget
  ✦ BuildContext — understand what it is, when it becomes invalid
  ✦ Key types — GlobalKey, ValueKey, ObjectKey — when each is needed
  ✦ Layout system — Row, Column, Flex, Stack, Positioned, SizedBox, Expanded
  ✦ Scrolling — ListView, GridView, CustomScrollView, Slivers
  ✦ Navigation — GoRouter (imperative + declarative, deep links, query params)
  ✦ Animation — AnimationController, Tween, AnimatedWidget, AnimatedBuilder
  ✦ Platform channels — calling native Android/iOS APIs from Dart
  ✦ Render pipeline — understand rasterization, why rebuilds are expensive

Performance:
  ✦ const widgets — prevents unnecessary rebuilds
  ✦ RepaintBoundary — isolate expensive repaint subtrees
  ✦ ListView.builder vs ListView — never build all items upfront
  ✦ Image caching — cached_network_image, proper asset sizing
  ✦ Frame budget — 16ms per frame (60fps), how to detect jank (Flutter DevTools)
```

### Riverpod 2.x — Proficiency: Advanced

```
Providers:
  ✦ Provider — synchronous, computed values
  ✦ StateProvider — simple state
  ✦ FutureProvider — async one-shot data
  ✦ StreamProvider — reactive streams (WebSocket, live GPS)
  ✦ StateNotifierProvider — complex state with methods
  ✦ AsyncNotifierProvider — async state with mutations
  ✦ NotifierProvider — synchronous complex state

Patterns:
  ✦ Family modifier — parameterised providers (workerProfileProvider(id))
  ✦ AutoDispose — release resources when provider not observed
  ✦ ref.watch vs ref.read vs ref.listen — know when each is correct
  ✦ ProviderScope + overrides — dependency injection in tests
  ✦ Combining providers — ref.watch inside provider build
  ✦ Error handling — AsyncValue.when() with error + loading states
```

### Clean Architecture (Flutter) — Proficiency: Advanced

```
Layers (data → domain → presentation):

  Domain layer (pure Dart, zero Flutter imports):
    ✦ Entities — data classes with business rules
    ✦ Repository interfaces — abstract contracts
    ✦ Use cases — single-responsibility business operations
    ✦ Failures — sealed classes for typed errors

  Data layer (implements domain contracts):
    ✦ Models — JSON serializable (fromJson/toJson)
    ✦ Remote datasources — Dio API calls
    ✦ Local datasources — Hive read/write
    ✦ Repository implementations — orchestrates remote + local

  Presentation layer (Flutter-specific):
    ✦ Providers / Notifiers — state management
    ✦ Screens — full pages, minimal logic
    ✦ Widgets — reusable UI components
    ✦ No business logic in widgets — ever

The test:
  "Can I unit-test this class without a Flutter widget test runner?"
  If yes → it's in the right layer.
  If no → you've leaked framework concerns into domain/data layers.
```

### Offline Sync — Proficiency: Intermediate–Advanced

```
Architecture:
  ✦ Hive for local persistence (typed adapters, fast reads)
  ✦ Connectivity Plus — detect network state changes
  ✦ Work Manager — background sync tasks, OS-managed scheduling
  ✦ Pending operations queue — store mutations while offline
  ✦ Sync engine — process queue on reconnect, in order, idempotently
  ✦ Conflict resolution — last-write-wins by updatedAt timestamp
  ✦ Delta sync — GET /sync?since=timestamp reduces payload size

Critical for this platform:
  ✦ Attendance records must survive connectivity loss
  ✦ GPS pings buffered for up to 24h, submitted in batch on reconnect
  ✦ Job application state must not be lost if app crashes mid-flow
```

### GPS & Geofencing — Proficiency: Intermediate

```
Packages:
  geolocator         — location services, permissions
  permission_handler — runtime permission requests
  google_maps_flutter — map rendering
  sensors_plus        — accelerometer (detect fake GPS spoofing)

Implementation:
  ✦ Request location permissions gracefully (explain why before asking)
  ✦ Distinguish between permission denied and denied-forever (different UX)
  ✦ Background location — service notification required on Android 10+
  ✦ Battery-aware: use geo-fence entry events over continuous polling where possible
  ✦ GPS accuracy threshold — ignore fixes with accuracy > 50m
  ✦ Velocity check — if worker moved 500km in 2 minutes, flag as suspicious

Geo-fence logic:
  ✦ Calculate distance: Geolocator.distanceBetween(lat1, lon1, lat2, lon2)
  ✦ Compare to site radius (stored from API response)
  ✦ Client validates for UX, server always validates for truth
```

### Push Notifications — Proficiency: Intermediate

```
Firebase Cloud Messaging:
  ✦ firebase_messaging package setup (Android + iOS both required)
  ✦ Foreground messages — show local notification manually
  ✦ Background messages — isolate handler, cannot touch UI
  ✦ Notification tap — navigate to relevant screen via GoRouter
  ✦ Topic subscriptions — contractor broadcasts to all workers on a site
  ✦ Token management — refresh token, send to backend on app open
  ✦ iOS permissions — explicit permission request required (explain value first)

Notification types on this platform:
  ✦ Job matches — navigate to job detail
  ✦ Hire confirmation — navigate to attendance screen
  ✦ Payroll processed — navigate to wallet
  ✦ KYC approved/rejected — navigate to profile
  ✦ Attendance alert — navigate to check-in screen
```

---

## 5. Database Skills

### PostgreSQL Optimisation — Proficiency: Advanced

```
Query planning:
  ✦ EXPLAIN ANALYZE — read it, understand Seq Scan vs Index Scan vs Bitmap Scan
  ✦ Query cost — relative units, not milliseconds; understand node cost
  ✦ Sort operations — when sorts are unavoidable, how to eliminate them
  ✦ Hash joins vs nested loops vs merge joins — understand when each is chosen
  ✦ Statistics — pg_stats, ANALYZE, understand how stale stats cause bad plans
  ✦ Configuration: work_mem, effective_cache_size — impact on query plans

Indexing strategy:
  ✦ B-tree indexes — default, range queries, equality, sorts
  ✦ GIN indexes — full-text search, JSONB, array containment
  ✦ GIST indexes — geometric types, PostGIS, range types
  ✦ Partial indexes — WHERE deleted_at IS NULL (huge for soft-delete pattern)
  ✦ Covering indexes — INCLUDE clause eliminates index-only scan heap fetches
  ✦ Composite indexes — column order matters (most selective first, unless range)
  ✦ Index bloat — VACUUM, REINDEX CONCURRENTLY

Partitioning:
  ✦ Range partitioning by date — attendance_records, payroll_records, location_pings
  ✦ pg_partman — automated partition maintenance
  ✦ Partition pruning — WHERE clause must include partition key
  ✦ Cross-partition queries — understand performance implications

Transactions:
  ✦ ACID properties — can explain each with examples
  ✦ Isolation levels: READ COMMITTED (default), REPEATABLE READ, SERIALIZABLE
  ✦ Deadlock detection — how to design to avoid, how to handle when it occurs
  ✦ Advisory locks — application-level locks for payroll processing
  ✦ SELECT FOR UPDATE — pessimistic locking, when to use vs optimistic
```

### Query Tuning — Proficiency: Advanced

```
Common performance problems and fixes:

  N+1 queries:
    Symptom: 500 workers → 501 DB queries
    Fix: JOIN with TypeORM relations, or use DataLoader pattern

  Missing index on filter column:
    Symptom: Seq Scan on workers (100k rows) for every search
    Fix: CREATE INDEX idx_workers_city_skill ON workers(city, primary_skill)

  Counting total rows for pagination:
    Symptom: SELECT COUNT(*) takes 800ms on 10M attendance records
    Fix: Estimate via pg_class.reltuples, or use cursor-based pagination

  LIKE '%keyword%' full-table scan:
    Symptom: Worker name search is slow
    Fix: Full-text search with tsvector + GIN index, or Elasticsearch

  Repeated identical queries:
    Symptom: Same profile fetched 20× per request
    Fix: Application-level cache (Redis) or DataLoader batching

  Loading unnecessary columns:
    Symptom: SELECT * on wide table for list view
    Fix: TypeORM select option or dedicated summary DTO

Tools:
  pg_stat_statements   — find slowest queries across all executions
  pgBadger             — analyse PostgreSQL logs
  auto_explain         — log slow query plans automatically
  DataDog DB Monitoring — production query performance
```

### Migrations — Proficiency: Advanced

```
Rules (non-negotiable):
  ✦ Every schema change must have a migration file
  ✦ Every migration must have a reversible down() method
  ✦ Migrations must be backward-compatible with the previous code version
    (new column = nullable or with default; rename = two-step: add → copy → remove)
  ✦ Never truncate or drop tables in a migration without a separate data migration plan
  ✦ Test migration up() and down() on a copy of production data before deploying
  ✦ Large table migrations (> 1M rows) use pg_repack or online-schema-change tooling

Additive-only migration pattern:
  Phase 1: Add new column (nullable) — deploy code that WRITES to both old + new
  Phase 2: Backfill new column — run data migration script
  Phase 3: Add NOT NULL constraint — deploy code that reads from new column only
  Phase 4: Remove old column — deploy code that no longer references old column

Zero-downtime index creation:
  -- Always use CONCURRENTLY to avoid table locks
  CREATE INDEX CONCURRENTLY idx_workers_city ON workers(city);
  -- Not in a transaction block (CONCURRENTLY cannot run in a transaction)
```

---

## 6. DevOps Skills

### Docker — Proficiency: Intermediate–Advanced

```
Required knowledge:
  ✦ Dockerfile best practices: multi-stage builds, minimal base images (alpine)
  ✦ Layer caching — order instructions from least to most frequently changed
  ✦ .dockerignore — exclude node_modules, .env, test files
  ✦ Non-root user — never run production containers as root
  ✦ Health checks — HEALTHCHECK instruction for container orchestration
  ✦ Signal handling — use exec form CMD, handle SIGTERM for graceful shutdown
  ✦ Build args vs env vars — ARG (build-time) vs ENV (runtime)
  ✦ Multi-platform builds — ARM64 for AWS Graviton (cost savings)

docker-compose (local dev):
  ✦ Service dependencies — depends_on with healthcheck condition
  ✦ Volume mounts for local development (hot reload)
  ✦ Named volumes for database persistence
  ✦ Environment file interpolation (.env → docker-compose)
  ✦ Network aliases for service-to-service communication
```

### Kubernetes — Proficiency: Intermediate

```
Core resources:
  ✦ Deployment — replicas, strategy (RollingUpdate, Recreate), selectors
  ✦ Service — ClusterIP, NodePort, LoadBalancer — when to use each
  ✦ ConfigMap — non-secret configuration
  ✦ Secret — base64-encoded secrets (sealed-secrets or Secrets Manager for production)
  ✦ Ingress — routing rules, TLS termination, path-based routing
  ✦ HorizontalPodAutoscaler — CPU/memory + custom metrics
  ✦ PodDisruptionBudget — maintain availability during node drain
  ✦ ServiceAccount — IAM roles for service accounts (IRSA on EKS)

Debugging:
  ✦ kubectl logs, describe, exec, port-forward — daily tools
  ✦ kubectl top — resource consumption
  ✦ Events — kubectl get events --sort-by=.lastTimestamp
  ✦ CrashLoopBackOff, OOMKilled, ImagePullBackOff — diagnose each

Networking:
  ✦ Pod-to-pod communication via Service DNS (backend.dlc-production.svc.cluster.local)
  ✦ Network policies — restrict egress/ingress between namespaces
```

### AWS — Proficiency: Intermediate

```
Services we actively use:
  ✦ EKS — managed Kubernetes, node groups, IRSA
  ✦ RDS / Aurora PostgreSQL — multi-AZ, read replicas, parameter groups
  ✦ ElastiCache Redis — cluster mode, node types, security groups
  ✦ S3 — bucket policies, presigned URLs, lifecycle rules, CORS
  ✦ CloudFront — distribution config, cache behaviours, invalidations
  ✦ ECR — image repository, lifecycle policies (keep last 10 prod images)
  ✦ Secrets Manager — rotation, cross-account access
  ✦ IAM — roles, policies, least-privilege principle, IRSA for EKS
  ✦ Route 53 — health checks, failover routing, latency routing
  ✦ ACM — certificate issuance, ALB integration
  ✦ CloudWatch — log groups, metric filters, alarms
  ✦ SES — transactional email (backup to SendGrid)

Cost awareness:
  ✦ Use Spot Instances for BullMQ worker nodes (stateless, interruptible)
  ✦ Graviton (ARM) instances for 20% cost reduction on compute
  ✦ S3 Intelligent-Tiering for documents (automatic cost optimisation)
  ✦ Reserved Instances for baseline DB capacity
```

### CI/CD — Proficiency: Intermediate–Advanced

```
GitHub Actions:
  ✦ Workflow syntax: on, jobs, steps, uses, with, env, needs
  ✦ Secrets and variables — repo vs environment secrets
  ✦ Environments — protection rules, required reviewers
  ✦ Matrix builds — test across multiple Node versions
  ✦ Caching — actions/cache for node_modules, Docker layers
  ✦ OIDC authentication to AWS (no static access keys)
  ✦ Reusable workflows — DRY CI logic across repos
  ✦ Composite actions — reusable step sequences

Pipeline stages we own:
  ✦ Lint → TypeCheck → Test → SecurityScan → Build → Push → Deploy → Verify
  ✦ Each stage must fail loudly — no passing pipelines with suppressed errors
  ✦ Build once, deploy everywhere (same image to staging then production)
```

### Monitoring & Logging — Proficiency: Intermediate

```
Datadog:
  ✦ APM traces — understand distributed tracing, span hierarchy
  ✦ Log ingestion — structured JSON, facets, log patterns
  ✦ Dashboards — build per-service dashboards, not just raw metrics
  ✦ Monitors — threshold, anomaly, forecast, composite alerts
  ✦ Synthetics — browser tests, API tests from multiple regions

What every engineer must know:
  ✦ How to query logs for a specific request ID across services
  ✦ How to read an APM trace — find the slow span, identify N+1 queries
  ✦ How to create a monitor for a new service they own
  ✦ How to read a memory/CPU flame graph

Logging discipline:
  ✦ Structured JSON — every log entry is machine-parseable
  ✦ Request ID propagation — trace a user's journey across all services
  ✦ No sensitive data in logs — phone numbers masked, no tokens/passwords
  ✦ Log levels used correctly — error for actionable failures, not info
```

---

## 7. Security Skills

### JWT & Token Security — Proficiency: Advanced

```
Must know:
  ✦ RS256 vs HS256 — asymmetric vs symmetric, why RS256 for multi-service
  ✦ Token storage — why localStorage is unsafe, why HttpOnly cookie is safer
  ✦ Token refresh race conditions — mutex lock for concurrent refresh calls
  ✦ JWKS rotation — key ID (kid) claim, grace period during rotation
  ✦ JWT attacks: none algorithm, algorithm confusion, expired token acceptance
  ✦ Claims validation — verify exp, iat, aud, iss (don't trust payload blindly)
  ✦ Refresh token rotation — detect theft via reuse detection
```

### OWASP Top 10 — Proficiency: Intermediate–Advanced

```
All engineers must know the current OWASP Top 10 and our mitigation for each:

  A01 Broken Access Control
      Mitigation: RBAC on every endpoint, resource ownership checks, test 403s

  A02 Cryptographic Failures
      Mitigation: TLS 1.3, AES-256-GCM for PII fields, bcrypt for passwords (N/A — OTP auth)

  A03 Injection
      Mitigation: TypeORM parameterised queries, class-validator on all inputs

  A04 Insecure Design
      Mitigation: Threat model per feature, security review on auth/payment flows

  A05 Security Misconfiguration
      Mitigation: Helmet.js, CSP headers, no default credentials, no debug mode in prod

  A06 Vulnerable Components
      Mitigation: npm audit in CI, Snyk scanning, Dependabot PRs

  A07 Auth Failures
      Mitigation: OTP rate limiting, JWT rotation, session invalidation on logout

  A08 Data Integrity Failures
      Mitigation: Signed payloads from payment gateways, verify webhook signatures

  A09 Logging Failures
      Mitigation: Structured logging, audit trail for all financial + KYC operations

  A10 SSRF
      Mitigation: Whitelist external URLs, block private IP ranges in outbound calls
```

### API Security — Proficiency: Advanced

```
Headers every response must have:
  X-Content-Type-Options: nosniff
  X-Frame-Options: DENY
  X-XSS-Protection: 1; mode=block
  Strict-Transport-Security: max-age=31536000; includeSubDomains
  Content-Security-Policy: (defined in Design.md §8)
  Cache-Control: no-store (for API responses with PII)

Input security:
  ✦ Validate ALL user input at the boundary (DTO + class-validator)
  ✦ Strip HTML from free-text fields before storage (sanitize-html)
  ✦ Limit request body size (10MB default, 5MB for file uploads)
  ✦ Verify Content-Type matches what you're processing
  ✦ Reject unexpected fields (whitelist, not blacklist)
  ✦ Check file upload MIME type by reading magic bytes, not just extension

Webhook security:
  ✦ Verify signature (HMAC-SHA256) on every incoming webhook
  ✦ Reject replays (check timestamp in header, 5-minute window)
  ✦ Respond 200 immediately, process asynchronously (prevent timeout retries)
```

---

## 8. AI Coding Skills

> This section is what separates engineers on this team from teams at our competitors. Mastering AI-assisted development is a core job requirement, not optional.

### The AI Coding Mental Model

```
Think of AI coding tools as a "contextually brilliant but architecturally naive" pair programmer.

They are brilliant at:
  ✦ Generating boilerplate that follows patterns it has learned
  ✦ Completing code when you show them what you've already done
  ✦ Explaining unfamiliar APIs and libraries
  ✦ Writing tests when you describe the expected behaviour
  ✦ Refactoring isolated functions for clarity
  ✦ Translating designs into initial component implementations
  ✦ Catching common bugs when asked to review

They are naive about:
  ✦ Your specific business domain (they don't know what "geo-fence check-in" means in YOUR system)
  ✦ Your architectural decisions (they don't know you chose Modular Monolith over Microservices)
  ✦ Your existing code (they don't know WorkerService already has findByPhone())
  ✦ What NOT to build (they will happily generate 200 lines of over-engineered code)
  ✦ Your security requirements (they won't know your rate limit rules)
  ✦ Long-term maintainability trade-offs (they optimise for "working" not "maintainable")

Your job:
  Provide context + constraints → accept the acceleration → own the output.
```

---

### Claude Code — Primary AI Tool

```
When to use Claude Code:
  ✦ Generating a full NestJS module from a spec (entity, DTO, service, controller, module)
  ✦ Writing migrations from a schema description
  ✦ Creating Flutter feature scaffolding (datasource, repo, usecase, provider, screen)
  ✦ Generating comprehensive test suites for a service you've already written
  ✦ Refactoring a complex function that has grown messy
  ✦ Understanding an unfamiliar codebase section ("explain what this service does")
  ✦ Exploring architectural options before committing ("what are 3 ways to implement X?")
  ✦ Reviewing code for security issues, edge cases, or anti-patterns
  ✦ Writing documentation from code

High-quality prompts for this codebase:

  === MODULE GENERATION ===
  "Generate a complete NestJS PayrollModule following our architecture in CLAUDE.md.
   Include:
   - PayrollRecord entity extending BaseEntity with these fields: [list fields]
   - CreatePayrollBatchDto with class-validator decorators
   - PayrollService with processPayrollBatch() method that:
     a) Fetches attendance records for the period from AttendanceService
     b) Applies WageStructure calculations
     c) Applies PF (12%) and ESI (0.75%) deductions
     d) Creates PayrollRecord per worker
     e) Emits 'payroll.batch.processed' domain event
   - PayrollController with Swagger decorators
   - Guard: @Roles(UserRole.CONTRACTOR)
   Follow the patterns in src/modules/attendance/ as reference."

  === TEST GENERATION ===
  "Write Jest unit tests for PayrollService.processPayrollBatch().
   Test:
   - Happy path: 5 workers, all with attendance, correct wage calculation
   - Worker with zero attendance (should create ₹0 payroll record, not skip them)
   - Worker with overtime (> 8 hours triggers 1.5× multiplier)
   - Transaction rollback when payment gateway throws
   - Domain event emitted on success
   Use createMock<AttendanceRepository>() for mocking."

  === REVIEW REQUEST ===
  "Review this PayrollService for:
   1. Security issues (any amount manipulation risks?)
   2. Race conditions (if two requests call processPayrollBatch simultaneously)
   3. Missing error handling
   4. Violations of our CLAUDE.md standards
   Be specific about line numbers and provide fixes."
```

### Prompt Engineering for Codebase Context

```
The single biggest mistake engineers make with AI tools:
  Asking questions without context.

Bad:  "Write a check-in function"
Good: "Write a checkIn() method for AttendanceService following our patterns in
       src/modules/attendance/services/attendance.service.ts.
       It should:
       - Accept CheckInDto { workerId, siteId, latitude, longitude }
       - Validate the worker has an active hire record for the site (via HireRepository)
       - Validate GPS coordinates are within site geo-fence (PostGIS ST_Within query)
       - Create an AttendanceRecord entity
       - Emit 'attendance.checked_in' event
       - Return { success: true, checkInTime, siteName }
       - Throw WorkerNotHiredForSiteException if not hired
       - Throw OutsideGeoFenceException if location invalid
       Follow CLAUDE.md Rule ARCH-001: no business logic in controllers."

Context injection techniques:
  ✦ Include relevant existing code in the prompt ("here's the existing WorkerService, follow its patterns")
  ✦ Reference CLAUDE.md rules ("follow RULE-004 for all database queries")
  ✦ Specify the exact file location ("this goes in src/modules/payroll/services/")
  ✦ State what NOT to do ("don't create a new repository, use the existing WorkerRepository")
  ✦ Include error types ("use our existing exceptions from src/common/exceptions/")

Context window management:
  ✦ Don't dump entire codebase — paste only the relevant 50–100 lines
  ✦ Summarise existing context: "We already have WorkerService.findById() and SiteService.getBoundary()"
  ✦ Build iteratively: generate → review → refine with "change X, keep Y the same"
  ✦ Use /clear between unrelated tasks (stale context causes confused output)
```

### Architecture Preservation with AI

```
The risk:
  AI tools will generate code that "works" but violates your architecture.
  A well-meaning but unconstrained Claude can:
  - Add direct DB queries in a controller
  - Create a circular dependency between two modules
  - Introduce a new infrastructure concern directly in a service
  - Use process.env directly instead of ConfigService
  - Create duplicate logic that already exists in another service

How to prevent this:

  BEFORE generating:
    Paste relevant sections of CLAUDE.md into context
    State explicit constraints: "Never call the DB directly in the controller"
    Name the existing service/repo to use: "Use the existing WorkerRepository"

  AFTER generating:
    Run: tsc --noEmit (catches type errors)
    Run: npm run lint (catches style violations)
    Ask Claude to review its own output against CLAUDE.md rules
    Human review: specifically look for cross-module boundary violations

  CHECKLIST before accepting AI-generated backend code:
    [ ] No DB calls in controllers
    [ ] No process.env usage outside config files
    [ ] All DTOs have class-validator decorators
    [ ] All endpoints have @UseGuards + @Roles
    [ ] All exceptions are typed (not throw new Error('...'))
    [ ] No business logic in event handlers (delegate to service)
    [ ] No circular module imports
```

### AI Validation Workflow

```
Every AI-generated code block goes through this before merging:

Step 1: Read it  (2 min)
  Read the entire generated block, line by line.
  If you don't understand a line, ask Claude to explain it.
  If you still don't understand it after explanation, don't merge it.

Step 2: Type-check it  (30 sec)
  tsc --noEmit
  Zero errors required. Fix any type issues before moving to step 3.

Step 3: Lint it  (30 sec)
  npm run lint
  No lint errors. If lint suggests a fix, apply it (don't suppress).

Step 4: Test it  (5–15 min)
  For business logic: write tests first if you didn't already.
  For boilerplate: run the service and hit the endpoint.
  For components: render in browser and test the interaction manually.

Step 5: Security scan it  (2 min — for auth/payment/data code)
  Ask Claude: "Review this code specifically for security vulnerabilities,
  focusing on input validation, authentication bypass, and injection risks."
  Address every finding before merging.

Step 6: Architecture check  (2 min)
  Does it follow the patterns in CLAUDE.md?
  Would a senior engineer approve this in code review?

If any step fails → fix before merge.
If you're unsure → ask a team member, not just the AI.
```

### Cursor — IDE Integration

```
Best uses in this codebase:
  ✦ ⌘K (inline edit): modify a specific function — "add transaction rollback here"
  ✦ ⌘L (chat): explain selected code, ask about patterns, request refactors
  ✦ Tab (autocomplete): accept completions that follow established patterns
  ✦ Multi-file edits: "update all callers of WorkerService.findById() after I rename it"
  ✦ Codebase Q&A: "where is OTP rate limiting currently implemented?"

Rules for Cursor use:
  ✦ Review diffs before accepting multi-file changes
  ✦ Don't accept autocomplete suggestions that cross module boundaries
  ✦ .cursorrules file in project root enforces CLAUDE.md as persistent context
```

### GitHub Copilot — Supplemental

```
Best uses:
  ✦ Completing repetitive patterns (Swagger decorators, TypeORM columns)
  ✦ Inline documentation suggestions
  ✦ Test case generation when test file is already structured

Limitations vs Claude:
  ✦ Less context retention (doesn't maintain architectural awareness across files)
  ✦ No conversational refinement
  ✦ Inline only — not suitable for module-level generation

Use Copilot for line/function level. Use Claude for module/feature level.
```

---

## 9. Testing Skills

### Unit Testing — Proficiency: Advanced

```
Jest (Backend):
  ✦ describe / it / expect — fluent test structure
  ✦ beforeAll / afterAll / beforeEach / afterEach — lifecycle hooks
  ✦ jest.fn() / jest.spyOn() — function mocks and spies
  ✦ createMock<T>() (@golevelup/ts-jest) — auto-mock typed interfaces
  ✦ Async tests — async/await, resolves, rejects matchers
  ✦ Mock modules — jest.mock('module') for external dependencies
  ✦ Snapshots — for serialisable DTOs/responses (not component trees)
  ✦ Coverage reporting — lcov, check thresholds in jest.config.ts

What to test (and what not to):
  ✅ Test:  Business logic in services (all paths, all branches)
  ✅ Test:  Error cases (service should throw, event not emitted)
  ✅ Test:  DTO validation (valid data passes, invalid data fails with correct error)
  ✅ Test:  Utility functions (crypto, pagination, date helpers)
  ❌ Skip:  NestJS framework wiring (controllers just delegate, trust the framework)
  ❌ Skip:  Configuration module setup
  ❌ Skip:  Entity column definitions

AAA Pattern (Arrange, Act, Assert):
  it('should throw WorkerNotFoundException when worker does not exist', async () => {
    // Arrange
    mockWorkerRepository.findOne.mockResolvedValue(null);

    // Act + Assert
    await expect(workerService.findById('non-existent-id'))
      .rejects.toThrow(WorkerNotFoundException);
  });
```

### Integration Testing — Proficiency: Intermediate–Advanced

```
NestJS + Supertest + PostgreSQL (Docker):
  ✦ Full HTTP layer tested — real Express/Fastify adapter
  ✦ Real database (test container or test DB with migrations applied)
  ✦ Real Redis (test Redis instance, flushAll in beforeEach)
  ✦ Authentication: generate real JWTs with test keys for each role
  ✦ Test data factories: create test data with minimal required fields

Critical integration tests for this platform:
  Worker registration → OTP verify → profile created in DB
  Contractor posts job → worker applies → contractor hires → attendance created
  Attendance check-in → geo-fence validation → record created → WebSocket event emitted
  Payroll batch creation → calculation → disbursement status update

Database isolation between tests:
  Option A: Wrap each test in a transaction, rollback after test (fast, recommended)
  Option B: Truncate tables in beforeEach (slower but more realistic)
  Never run integration tests against production or staging databases.
```

### E2E Testing — Proficiency: Intermediate

```
Playwright (Frontend + Web flows):
  ✦ Page object model — encapsulate page interactions in reusable classes
  ✦ Test isolation — each test starts fresh, uses its own test user
  ✦ Network mocking — intercept API calls for predictable test data
  ✦ Visual regression — screenshot comparison for critical UI components
  ✦ Parallel execution — multiple browsers simultaneously (CI speed)
  ✦ Trace viewer — debug failing tests with full browser trace

Critical E2E flows (always maintained, never allowed to fail):
  Worker: Login → complete profile → apply to job → check in → view payslip
  Contractor: Login → post job → hire worker → view attendance → process payroll
  Admin: Login → review KYC queue → approve worker

Flutter integration tests (integration_test/ package):
  ✦ Real device / emulator testing (not widget tests — full app with network)
  ✦ Firebase Test Lab for automated device matrix testing
  ✦ Critical mobile flows: OTP login → check-in → view wallet
```

### API Testing — Proficiency: Intermediate

```
Postman + Newman:
  ✦ Collection per domain (workers, jobs, attendance, payroll)
  ✦ Environment variables (baseUrl, authToken, testWorkerId)
  ✦ Pre-request scripts — auto-refresh tokens, set up test data
  ✦ Post-response tests — validate status code, response shape, data types
  ✦ Collection runner in CI (Newman) — smoke tests on every staging deploy

Contract testing (Pact) — Phase 2:
  Consumer (Next.js) writes contract for WorkerService API
  Provider (NestJS) verifies contract in CI
  Prevents breaking API changes from reaching consumers
```

---

## 10. Soft Skills

### System Design Thinking

```
Every engineer on this team is expected to participate in system design.
This is not just for architects or senior engineers.

Fundamentals everyone must know:
  ✦ CAP theorem — Consistency, Availability, Partition tolerance: pick 2
    → We choose CP for financial data, AP for job search/recommendations
  ✦ Latency vs throughput — optimising one often hurts the other
  ✦ SQL vs NoSQL — understand the tradeoffs, not dogma
  ✦ Synchronous vs asynchronous — when each is appropriate
  ✦ Horizontal vs vertical scaling — know which levers to pull
  ✦ Caching strategies — when it helps, when it creates stale data problems
  ✦ Idempotency — design operations safe to retry

System design interview readiness (not just for interviews):
  ✦ Load estimation (DAU × actions/day = req/s → CPU/memory requirements)
  ✦ Data size estimation (rows × avg row size × years = GB → storage tier)
  ✦ Bottleneck identification (where does this system fall over at 10× scale?)
  ✦ Trade-off articulation ("we chose X over Y because...")

For this platform specifically:
  ✦ Geo-fence check-in at scale: 1M workers checking in between 7–9 AM
  ✦ Payroll processing: 50k workers paid simultaneously, no double payments
  ✦ AI matching: sub-second recommendations for 1M worker-job pairs
  ✦ Real-time site map: 50k contractors watching 1M location pings/minute
```

### Communication

```
Written communication (Slack, PRs, docs):
  ✦ PRs: description explains WHY, not just WHAT (the code shows what)
  ✦ Commits: follow conventional commits (feat/fix/chore/test/docs)
  ✦ ADRs: write one whenever you make a significant architectural decision
  ✦ Incident reports: timeline + root cause + prevention + action items
  ✦ Estimation: provide ranges with confidence, not false precision

In team communication:
  ✦ Ask questions early — "I'm about to implement X, does that make sense?" over "I built X but..."
  ✦ Share blockers before they become 2-day delays
  ✦ Disagree with data, not opinion — "the query takes 800ms on staging because..." not "I feel like it's slow"
  ✦ Give feedback on the code, not the person — "this function is complex" not "you write complex code"

Cross-functional (with PM, Design):
  ✦ Raise technical risks before sprint start, not mid-sprint
  ✦ Translate technical constraints into user impact ("this will add 2s to load time")
  ✦ Propose alternatives when pushback is needed ("we can't do X in 2 days, but we could do Y")
```

### Documentation

```
What we document:
  ✦ CLAUDE.md — architecture decisions, coding standards, AI agent rules (this is the source of truth)
  ✦ Architecture.md — system design, infrastructure, service interactions
  ✦ Design.md — UI/UX standards, design tokens, component patterns
  ✦ API docs — Swagger/OpenAPI auto-generated from decorators (always kept in sync)
  ✦ ADRs — one file per significant decision in docs/decisions/
  ✦ Runbooks — operational procedures for incidents, deployments, rollbacks
  ✦ README.md — per repo: setup, commands, environment variables

What we do NOT spend time documenting:
  ✦ "Self-documenting code" that actually is obvious
  ✦ Generated code (TypeORM migrations, OpenAPI specs)
  ✦ Outdated processes that no longer reflect reality

Documentation rules:
  ✦ Update docs in the same PR as code changes — never a separate "will do later" PR
  ✦ If you read a doc and it's wrong, fix it immediately (boy scout rule)
  ✦ Write for the new engineer who joined last week, not yourself today
```

### Agile Collaboration

```
Sprint rituals:
  ✦ Planning: arrive with tickets estimated (T-shirt sizing or story points)
  ✦ Standups: yesterday / today / blockers — 2 min max per person
  ✦ Reviews: show working software, get real feedback
  ✦ Retrospectives: contribute 1 keep + 1 improve + 1 action item minimum

Code review culture:
  ✦ Review all PRs within 1 business day (hotfixes within 2 hours)
  ✦ Leave comments on code, not the author
  ✦ Distinguish: blocker (must change) / suggestion (should change) / nit (could change)
  ✦ Approve when good enough — perfect is the enemy of shipped
  ✦ Praise good code — the ratio of positive to critical comments should be at least 1:1

Estimation principles:
  ✦ Include test writing time in every estimate
  ✦ Include code review time in sprint capacity
  ✦ If you've never done something similar before → add 50% buffer
  ✦ A task with no known unknowns that takes > 3 days → should be broken down
```

---

## 11. Team Roles

### Frontend Developer

```
Title:       Frontend Engineer (L2) / Senior Frontend Engineer (L3)
Reports to:  Engineering Lead
Works with:  Backend Engineers (API contracts), Design (implementation), QA (test flows)

Core technical requirements:
  ✦ React.js — Advanced
  ✦ Next.js 15 App Router — Advanced
  ✦ TypeScript — Advanced
  ✦ TailwindCSS + shadcn/ui — Intermediate–Advanced
  ✦ TanStack Query + Zustand — Advanced
  ✦ Zod + React Hook Form — Intermediate
  ✦ Axios + API integration — Advanced
  ✦ Accessibility (WCAG 2.1 AA) — Intermediate
  ✦ Responsive design — Advanced
  ✦ Git workflow — Advanced

AI skills expected:
  ✦ Component generation from design specs
  ✦ Hook pattern generation (TanStack Query hooks)
  ✦ Refactoring complex components with AI assistance
  ✦ Generating stories/tests from component props

Ownership:
  ✦ Contractor Dashboard (Next.js)
  ✦ Enterprise Portal (Next.js)
  ✦ Admin Panel (Next.js)
  ✦ Shared component library
  ✦ Design token implementation

Deliverables per sprint:
  ✦ 2–3 feature-complete UI screens with all states (loading, empty, error)
  ✦ Responsive implementation verified at 320px, 768px, 1280px+
  ✦ Accessibility review completed for every new component
  ✦ Unit tests for hooks and utility functions
  ✦ Playwright tests for critical user flows
```

### Backend Developer

```
Title:       Backend Engineer (L2) / Senior Backend Engineer (L3)
Reports to:  Engineering Lead
Works with:  Frontend (API contracts), Mobile (API contracts), DevOps (deployment)

Core technical requirements:
  ✦ Node.js — Advanced
  ✦ NestJS — Advanced
  ✦ TypeScript — Advanced
  ✦ PostgreSQL + TypeORM — Advanced
  ✦ Redis — Intermediate–Advanced
  ✦ BullMQ — Intermediate
  ✦ JWT + Auth — Advanced
  ✦ REST API design — Advanced
  ✦ RBAC — Advanced
  ✦ Docker — Intermediate
  ✦ OWASP security practices — Intermediate–Advanced

AI skills expected:
  ✦ Full NestJS module generation from specs
  ✦ Migration generation from schema descriptions
  ✦ Test suite generation for service layer
  ✦ Security review of generated code

Ownership:
  ✦ Core API services (workers, jobs, contractors)
  ✦ Domain event system
  ✦ REST API documentation (Swagger)
  ✦ Database migrations
  ✦ BullMQ job processors

Deliverables per sprint:
  ✦ All endpoints for assigned feature with full Swagger docs
  ✦ DTOs with class-validator for all inputs
  ✦ Unit tests (≥ 80% service coverage) + integration tests for critical flows
  ✦ Migration files for any schema changes
  ✦ No regressions in existing API contract (run full Postman suite)
```

### Mobile Developer

```
Title:       Flutter Engineer (L2) / Senior Flutter Engineer (L3)
Reports to:  Engineering Lead
Works with:  Backend (API contracts), Design (UI implementation), QA (device testing)

Core technical requirements:
  ✦ Flutter 3.x — Advanced
  ✦ Dart (null safety) — Advanced
  ✦ Riverpod 2.x — Advanced
  ✦ Clean Architecture (Flutter) — Advanced
  ✦ GoRouter — Intermediate–Advanced
  ✦ Hive (offline storage) — Intermediate–Advanced
  ✦ GPS + Geo-fencing — Intermediate
  ✦ FCM push notifications — Intermediate
  ✦ Work Manager (background tasks) — Intermediate
  ✦ REST API integration (Dio) — Advanced
  ✦ Flutter testing (unit + widget + integration) — Intermediate

AI skills expected:
  ✦ Feature folder scaffolding generation
  ✦ Riverpod provider generation
  ✦ Widget test generation
  ✦ Dart model generation from API JSON response

Ownership:
  ✦ Worker mobile app (iOS + Android)
  ✦ Offline sync engine
  ✦ GPS tracking + geo-fence check-in
  ✦ Push notification handling
  ✦ Local data storage strategy

Critical competency: Low-end device performance.
  All features tested on Moto G equivalent (2GB RAM, Android 10, 2G network).
  If it doesn't work there, it's not done.
```

### DevOps Engineer

```
Title:       DevOps / Platform Engineer (L2–L3)
Reports to:  Engineering Lead / CTO
Works with:  All engineers (infrastructure, deployment, tooling)

Core technical requirements:
  ✦ Docker + Docker Compose — Advanced
  ✦ Kubernetes (EKS) — Advanced
  ✦ AWS (EKS, RDS, ElastiCache, S3, CloudFront, Route 53) — Advanced
  ✦ Terraform — Intermediate–Advanced
  ✦ GitHub Actions — Advanced
  ✦ Datadog (APM, logs, monitors) — Intermediate–Advanced
  ✦ Helm — Intermediate
  ✦ PostgreSQL DBA basics (connection pooling, backup/restore) — Intermediate
  ✦ Security: IAM, security groups, network policies — Advanced
  ✦ Incident management (PagerDuty, post-mortems) — Intermediate

AI skills expected:
  ✦ Terraform module generation
  ✦ Kubernetes manifest generation
  ✦ GitHub Actions workflow generation
  ✦ Monitoring query generation (Datadog query language)

Ownership:
  ✦ All AWS infrastructure (managed via Terraform)
  ✦ CI/CD pipelines for all services
  ✦ Monitoring, alerting, and on-call rotation
  ✦ Incident response and disaster recovery runbooks
  ✦ Developer tooling (local dev setup, CLI tooling)
  ✦ Platform security (patch management, vulnerability scanning)

Critical competency: Runbooks for everything.
  Every infrastructure operation (deploy, scale, rollback, DB failover, secret rotation)
  must have a documented, tested runbook before the DevOps engineer goes on leave.
```

### QA Engineer

```
Title:       QA Engineer (L2) / Senior QA Engineer (L3)
Reports to:  Engineering Lead
Works with:  All engineers (test planning), PM (acceptance criteria)

Core technical requirements:
  ✦ Playwright — Intermediate–Advanced
  ✦ Postman + Newman — Intermediate–Advanced
  ✦ Jest (read/review) — Intermediate
  ✦ SQL (read queries, verify data integrity) — Intermediate
  ✦ Flutter integration testing — Basic
  ✦ Performance testing (k6) — Intermediate
  ✦ API testing — Advanced
  ✦ Mobile device testing — Intermediate
  ✦ Bug reporting and regression tracking — Advanced

AI skills expected:
  ✦ Test case generation from acceptance criteria
  ✦ Playwright test generation from user flow descriptions
  ✦ Bug report writing with AI assistance
  ✦ Edge case exploration ("what edge cases am I missing for this flow?")

Ownership:
  ✦ Automated E2E test suite (Playwright)
  ✦ API test suite (Postman collections)
  ✦ Performance testing plan + execution (k6)
  ✦ Release sign-off for staging → production
  ✦ Test coverage reporting
  ✦ Device compatibility matrix management

Critical competency: Real device testing.
  Must own physical Android devices in low/mid/high tiers for manual regression.
  Cannot sign off on worker app release without physical device testing.
```

### Software Architect

```
Title:       Software Architect / Principal Engineer (L4–L5)
Reports to:  CTO
Works with:  All teams, influences all technical decisions

Core technical requirements:
  ✦ All backend skills — Expert
  ✦ System design — Expert
  ✦ Database design — Expert
  ✦ Security architecture — Advanced
  ✦ Cloud architecture (AWS) — Advanced
  ✦ Performance engineering — Advanced
  ✦ API design — Expert
  ✦ Technical writing (ADRs, CLAUDE.md, Architecture.md) — Advanced
  ✦ Cross-platform understanding (frontend, mobile, devops) — Intermediate–Advanced

AI skills expected:
  ✦ Architecture exploration with AI ("compare 3 approaches to X problem")
  ✦ Reviewing AI-generated code for architectural violations at scale
  ✦ Generating ADR drafts from decision conversations
  ✦ Using AI to explore scaling implications of design choices

Responsibilities:
  ✦ Own CLAUDE.md, Architecture.md — kept current and accurate
  ✦ Review all significant architectural decisions before implementation
  ✦ Conduct architecture sessions for new features > 1 week of work
  ✦ Define and enforce module boundaries
  ✦ Lead technical hiring interviews
  ✦ Evaluate new technologies before adoption
  ✦ Write ADRs for every significant decision

What the architect does NOT do:
  ✦ Own all code (single points of failure are a smell)
  ✦ Approve every PR (bottleneck)
  ✦ Make architectural decisions in isolation (decisions are team decisions, architect facilitates)
```

### Product Manager

```
Title:       Product Manager (L2) / Senior PM (L3)
Reports to:  CTO / CPO
Works with:  Engineering (specs, priorities), Design (UX flows), Business (strategy)

Technical requirements (PM-specific):
  ✦ SQL basics — can write simple queries to answer product questions
  ✦ API basics — understands REST, can read Swagger docs
  ✦ Analytics tools — Mixpanel / Amplitude / Datadog dashboards
  ✦ Git basics — can read PRs, understands branching
  ✦ Platform awareness — understands system limitations and constraints

AI skills expected:
  ✦ Product specification drafting with Claude
  ✦ User research synthesis with AI assistance
  ✦ Competitive analysis with AI
  ✦ Data analysis queries for product metrics

Responsibilities:
  ✦ Own product backlog — prioritised, estimated, acceptance criteria defined
  ✦ Write user stories with enough technical context to estimate accurately
  ✦ Define success metrics before sprint start, not after
  ✦ Facilitate sprint planning with engineering team
  ✦ Conduct user interviews with workers and contractors monthly
  ✦ Own product roadmap and communicate trade-offs to stakeholders

Critical competency: Empathy for the blue-collar user.
  Every PM on this team is required to spend one day per quarter at a construction
  site, watching workers use the app in their real environment.
  No exceptions.
```

---

## 12. Engineering Standards

### Clean Code Principles

```
Naming:
  ✦ Names tell you WHAT, not HOW: getUserById not executeQueryAndReturnUser
  ✦ Boolean names: isVerified, hasAttendance, canApply (not: verified, attendance, apply)
  ✦ Function names: verb + noun: createWorker, processPayroll, sendNotification
  ✦ Constants: SCREAMING_SNAKE_CASE, explain the "why" in a comment if not obvious
  ✦ Abbreviations: forbidden (wrkr → worker, cfg → config, svc → service)

Functions:
  ✦ Single responsibility — does exactly one thing
  ✦ 20 line limit (soft) — if a function is > 20 lines, ask if it should be split
  ✦ Max 3 parameters — if more are needed, use a parameter object
  ✦ No side effects in functions named like a query (findWorker shouldn't send an email)
  ✦ Pure functions wherever possible (same input → same output, no external state)

Comments:
  ✦ Comment WHY, not WHAT (the code shows what; comments explain why you made a choice)
  ✦ TODO comments must include: // TODO(username): description and ticket number
  ✦ Never commit commented-out code (git blame is your history, not comments)
  ✦ Complex business rules deserve a comment (VAT calculation, overtime rules)

Error handling:
  ✦ Never swallow errors silently (catch {} is a bug waiting to happen)
  ✦ Always log + rethrow or log + return typed error
  ✦ Typed exceptions over generic Error objects
  ✦ User-facing error messages must be in plain language (not "NullPointerException")
```

### Reusability

```
The DRY Test:
  If you've written the same logic twice → create a shared function
  If you've written the same component twice → extract to shared component
  If you've written the same test setup twice → create a test factory

When NOT to DRY:
  Accidental similarity — two things that look the same but have different change drivers
  The wrong abstraction is worse than duplication
  Rule: Wait until you need it 3 times before abstracting (WET → DRY on third repetition)

Backend reusability:
  ✦ BaseRepository<T> — common query patterns (softDelete, findOneOrFail, paginate)
  ✦ ApiResponseDto<T> — consistent response wrapper
  ✦ PaginationDto — page/limit/sort query params
  ✦ Custom decorators — @CurrentUser(), @Roles(), @AuthContractor()
  ✦ Shared validators — Indian phone number, pincode, Aadhaar format

Frontend reusability:
  ✦ Component library — atoms and molecules in lib/components/shared/
  ✦ Hook library — reusable data fetching in lib/hooks/
  ✦ API module — typed API calls in lib/api/
  ✦ Form schemas — shared Zod schemas used by form + API validation
```

### Scalability

```
Architectural scalability (Day 1):
  ✦ Stateless services (no local state → horizontal scaling trivial)
  ✦ Async side effects (domain events + queues → decouple I/O from user request)
  ✦ Pagination everywhere (no unbounded list queries — ever)
  ✦ Idempotent write operations (safe to retry on network failure)
  ✦ Background processing for > 500ms operations

Database scalability:
  ✦ Indexes on every filter/sort/join column (don't wait for it to be slow)
  ✦ Partitioned tables for high-volume append-only data (attendance, payroll)
  ✦ Connection pooling (PgBouncer — never let service pods connect directly)
  ✦ Read replicas for analytics/reporting queries

Code scalability:
  ✦ Feature flags for gradual rollout (no big-bang releases on a live platform)
  ✦ Config over code for business rules (overtime multiplier in config, not hardcoded 1.5)
  ✦ Observability built-in (every service emits structured logs + traces from day 1)
```

### Documentation-First Approach

```
The contract:
  Document BEFORE you build. The document IS the design review.

  For a new API endpoint:
    1. Write the Swagger spec (request/response/errors)
    2. Share with frontend/mobile team for feedback
    3. Update based on feedback
    4. THEN write the code

  For a new data model:
    1. Write the entity design (fields, types, indexes, constraints)
    2. Share with team for feedback
    3. Write the migration
    4. THEN write the entities/services

  For a new architecture decision:
    1. Write the ADR (context, options considered, decision, consequences)
    2. Team reviews and challenges
    3. ADR approved
    4. THEN implement

This approach sounds slower but is 3× faster overall because:
  - Feedback is cheapest before any code is written
  - Misunderstandings are caught at the specification stage
  - The document becomes the AI coding prompt (precise spec → precise output)
  - The document becomes the test spec (QA writes tests from the doc, not the code)
```

---

## 13. AI Agent Collaboration Rules

> These rules govern how AI coding tools (Claude, Copilot, Cursor, Codeium) collaborate with human engineers on this codebase. They are non-negotiable and enforced in code review.

### Rule 01 — AI Assists, Humans Architect

```
STATUS: MANDATORY

The principle:
  AI generates implementation. Humans own design.

What this means in practice:
  ✦ The decision to use Event Emitter over direct service calls → human decision
  ✦ The decision to partition the attendance table by month → human decision
  ✦ The decision to use CQRS for analytics → human decision
  ✦ Generating the AttendanceModule boilerplate given those decisions → AI task
  ✦ Generating the partition migration given that decision → AI task

Red flag behaviours:
  ❌ "I let Claude design the database schema" — Claude designed it, you agreed to it
  ❌ "The AI said to use microservices here" — AI suggests, you evaluate
  ❌ Accepting architectural changes hidden inside feature-level AI output

Enforcement:
  If an AI-generated PR changes module structure, adds a new cross-module
  dependency, changes an API contract, or modifies database schema without
  a prior ADR or tech design — it requires architect review before merge.
```

### Rule 02 — Always Review Generated Code

```
STATUS: MANDATORY

The principle:
  Code that no human has read should never run in production.

Minimum review standard for AI-generated code:
  ✦ Read every line — if you can't explain what it does, don't merge it
  ✦ Run it locally — compilation success ≠ correctness
  ✦ Check for: security issues, incorrect assumptions, missing error handling
  ✦ Check that it actually solves the stated problem (AI can confidently solve the wrong problem)
  ✦ Check it follows CLAUDE.md patterns and ARCH rules

The "explanation test":
  If asked in a code review "why is this here?" — you must be able to answer.
  "The AI put it there" is not an acceptable answer. Ever.
```

### Rule 03 — Never Merge Untested AI Code

```
STATUS: MANDATORY

The principle:
  AI-generated code without tests is debt, not a feature.

Test requirements before merging AI-generated code:

  Business logic (services):
    ✦ Minimum: happy path + primary error case unit tested
    ✦ Preferred: all branches of all if/else/switch have test coverage

  API endpoints:
    ✦ Minimum: integration test for the happy path with real HTTP call
    ✦ Preferred: integration tests for all 4xx error cases

  React components:
    ✦ Minimum: renders without crashing, primary interaction tested
    ✦ Preferred: all conditional render paths tested

  Flutter widgets:
    ✦ Minimum: widget test for primary render and primary interaction

  Exception: Pure boilerplate (entity column definitions, module registration)
    does not require tests, but must be reviewed.

CI enforcement:
  Coverage threshold set in jest.config.ts — CI fails if coverage drops below 80%
  on new code (not global threshold — per-file new code threshold via `--coverage-provider v8`)
```

### Rule 04 — Maintain Architectural Consistency

```
STATUS: MANDATORY

The principle:
  One inconsistently architected service poisons the codebase.

AI has a tendency to:
  ✦ Mix patterns: generate a Query Builder query in a service that uses Repository elsewhere
  ✦ Invent new abstractions: create a DataAccessObject that isn't in the existing pattern
  ✦ Over-engineer: generate a 6-interface hierarchy for a simple CRUD service
  ✦ Under-engineer: inline a 50-line function that should be 5 functions
  ✦ Copy from the internet: suggest patterns that contradict what's established here

Consistency enforcement:
  Before generating: paste the relevant existing module as context ("follow this pattern")
  After generating: diff against an existing module of the same type
  In review: reject any PR that introduces a new pattern without an ADR justifying it

The "existing module test":
  Open workers.service.ts and attendance.service.ts side by side with your new service.
  They should look structurally similar. Same patterns, same naming, same error handling.
  If they look like they were written by different teams, fix the new one before merging.
```

### Rule 05 — Validate AI Security Assumptions

```
STATUS: MANDATORY

The principle:
  AI tools are trained on a wide range of code, including insecure code.
  They will sometimes generate code with subtle security flaws.

Required security checks for ALL AI-generated code that:
  ✦ Handles user input:          Check for injection, missing validation
  ✦ Involves authentication:     Check for token handling, timing attacks
  ✦ Processes payments/money:    Check for amount manipulation, double processing
  ✦ Handles file uploads:        Check MIME validation, path traversal
  ✦ Calls external services:     Check for SSRF, unvalidated redirect
  ✦ Logs anything:               Check for PII leakage in log statements

Specific security anti-patterns Claude sometimes generates:
  ❌ console.log(user.aadhaarNumber)     → PII in logs
  ❌ `SELECT * FROM workers WHERE id='${id}'`  → SQL injection
  ❌ jwt.verify(token, 'secret')          → hardcoded secret
  ❌ if (user.role === 'admin')           → string comparison for RBAC
  ❌ res.json({ error: err.stack })       → stack trace in response

Add to your review checklist:
  "Does this generated code handle security with the same rigour as hand-written code?"
  If not, fix it before merge.
```

### Rule 06 — Context Discipline

```
STATUS: RECOMMENDED (will become MANDATORY)

The principle:
  AI tools with wrong context generate confidently wrong code.
  Wrong code that compiles is harder to detect than a compile error.

Context discipline rules:
  ✦ Never prompt AI with vague context ("write a user service for my app")
  ✦ Always include: what exists already, what patterns to follow, what constraints apply
  ✦ Include relevant sections of CLAUDE.md in the prompt for module-level generation
  ✦ Clear context between unrelated tasks (/clear in Claude Code)
  ✦ If AI output references a pattern or library not in our stack → reject and re-prompt

Signs of context pollution in AI output:
  ✦ References a library not in package.json
  ✦ Uses a pattern from a different framework (Express patterns in NestJS code)
  ✦ Assumes a table structure that doesn't match our schema
  ✦ Uses process.env directly instead of ConfigService
  ✦ Creates a REST endpoint using a different response format than our standard
```

### Rule 07 — Document AI-Assisted Decisions

```
STATUS: RECOMMENDED

The principle:
  When AI helps you make a non-obvious architectural decision,
  document the decision as if you made it (because you did — you accepted it).

When an ADR is triggered:
  ✦ AI suggested an approach and after exploration you adopted it
  ✦ AI generated multiple options and you chose one
  ✦ AI identified a problem with your planned approach and you pivoted

ADR template (30-minute investment, saves hours of future "why did we do this?"):

  # ADR-NNN: [Decision title]
  ## Status: Accepted
  ## Context: [What problem were we solving?]
  ## Options considered: [At least 2 alternatives]
  ## Decision: [What we chose and why]
  ## Consequences: [Good and bad outcomes of this decision]
  ## AI involvement: [If AI suggested this approach, note it — not for blame, for context]
```

---

## Appendix A: Skill Self-Assessment Guide

Use this to evaluate yourself honestly. Rate each area 1–5:

```
1 — No experience or awareness
2 — Basic understanding, need guidance
3 — Can work independently on most tasks
4 — Strong, can mentor others
5 — Expert, can design systems around this skill

Frontend Skills:
  React.js:           [ 1 / 2 / 3 / 4 / 5 ]
  Next.js App Router: [ 1 / 2 / 3 / 4 / 5 ]
  TypeScript:         [ 1 / 2 / 3 / 4 / 5 ]
  TailwindCSS:        [ 1 / 2 / 3 / 4 / 5 ]
  TanStack Query:     [ 1 / 2 / 3 / 4 / 5 ]
  Accessibility:      [ 1 / 2 / 3 / 4 / 5 ]

Backend Skills:
  NestJS:             [ 1 / 2 / 3 / 4 / 5 ]
  PostgreSQL / TypeORM: [ 1 / 2 / 3 / 4 / 5 ]
  Redis:              [ 1 / 2 / 3 / 4 / 5 ]
  REST API Design:    [ 1 / 2 / 3 / 4 / 5 ]
  JWT / Auth:         [ 1 / 2 / 3 / 4 / 5 ]
  Queue Systems:      [ 1 / 2 / 3 / 4 / 5 ]

Mobile Skills:
  Flutter / Dart:     [ 1 / 2 / 3 / 4 / 5 ]
  Riverpod:           [ 1 / 2 / 3 / 4 / 5 ]
  Offline Sync:       [ 1 / 2 / 3 / 4 / 5 ]
  GPS / Geofencing:   [ 1 / 2 / 3 / 4 / 5 ]

AI Coding Skills:
  Prompt engineering: [ 1 / 2 / 3 / 4 / 5 ]
  Context management: [ 1 / 2 / 3 / 4 / 5 ]
  AI code review:     [ 1 / 2 / 3 / 4 / 5 ]
  Architecture preservation: [ 1 / 2 / 3 / 4 / 5 ]

Security:
  OWASP Top 10:       [ 1 / 2 / 3 / 4 / 5 ]
  JWT implementation: [ 1 / 2 / 3 / 4 / 5 ]
  API security:       [ 1 / 2 / 3 / 4 / 5 ]

DevOps:
  Docker:             [ 1 / 2 / 3 / 4 / 5 ]
  Kubernetes basics:  [ 1 / 2 / 3 / 4 / 5 ]
  CI/CD:              [ 1 / 2 / 3 / 4 / 5 ]

Minimum bar for joining a sprint independently:
  Core role skills: score ≥ 3
  Adjacent skills: score ≥ 2
  AI coding skills: score ≥ 3 (non-negotiable for this team)
```

---

## Appendix B: Onboarding Checklist for New Engineers

```
Week 1 — Foundation
  [ ] Read CLAUDE.md, Architecture.md, Design.md, Skills.md in full
  [ ] Set up local dev environment (docker-compose up -d → backend running)
  [ ] Run full test suite (npm run test) — understand what passes and what doesn't
  [ ] Explore the codebase: find where WorkerService lives, trace a request end-to-end
  [ ] Make first PR: fix a lint warning or add a missing Swagger decorator (something real)
  [ ] Shadow a code review — observe how the team reviews PRs

Week 2 — First Feature
  [ ] Pick up a "good first issue" ticket from the backlog
  [ ] Use Claude to generate boilerplate, review with senior engineer
  [ ] Write tests before asking for review
  [ ] Go through the full AI validation workflow (§8)
  [ ] First solo PR — not just scaffolding, a real feature

Week 3 — Independence
  [ ] Own a full sprint ticket independently (design → implementation → tests → PR)
  [ ] Review a junior engineer's PR (give constructive feedback)
  [ ] Contribute one improvement to CLAUDE.md or Architecture.md (something you noticed)

Week 4 — Contribution
  [ ] Lead a mini tech design session for a new feature
  [ ] Write an ADR for a decision you made
  [ ] Set up a Datadog monitor for a service you now own
```

---

*Skills.md — Digital Labour Chowk*
*Version 1.0 | May 2026 | Owned by: Engineering Leadership*
*Review cycle: Quarterly — update with new tools and team learnings*
*"The best engineers on this team are those who make the people around them better."*
