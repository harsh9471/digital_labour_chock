# PRD — Digital Labour Chowk

> **Product Requirements Document**
> Version 1.0 | May 2026
> Status: **Approved for Development**
> Owner: Product Team | Reviewed by: Engineering, Design, Business

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Problem Statement](#2-problem-statement)
3. [Goals & Success Metrics](#3-goals--success-metrics)
4. [User Personas](#4-user-personas)
5. [User Stories](#5-user-stories)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Product Roadmap](#8-product-roadmap)
9. [Out of Scope](#9-out-of-scope)
10. [Dependencies](#10-dependencies)
11. [Risks & Mitigations](#11-risks--mitigations)
12. [Appendix](#12-appendix)

---

## 1. Executive Summary

### Product Name
**Digital Labour Chowk** — India's blue-collar workforce platform.

### One-Line Pitch
A mobile-first, AI-powered platform that digitises the informal construction labour market — connecting verified skilled workers with contractors and enterprises through transparent hiring, geo-tracked attendance, and direct digital payroll.

### Background
India's construction sector employs **60+ million blue-collar workers**, yet hiring remains almost entirely informal — workers are sourced through WhatsApp groups, word-of-mouth, and physical mandis (labour markets). Contractors have zero workforce visibility. Workers have no digital work history. Cash payroll enables rampant middlemen skimming (up to 20-30% of wages). There is no reliable data on labour pricing or supply.

Digital Labour Chowk replaces this broken ecosystem with a unified digital platform — giving workers dignity and financial inclusion, contractors operational control, and enterprises compliance visibility.

### Vision
> Be the operating system of India's blue-collar construction workforce.

### Mission
Eliminate friction in blue-collar hiring. Create dignity, opportunity, and operational efficiency for every stakeholder in the labour ecosystem.

---

## 2. Problem Statement

### For Workers
| Problem | Impact |
|---------|--------|
| No digital identity or verified work history | Forced to accept lower wages, no career progression |
| Cash wages siphoned by middlemen (thekedars) | Workers receive 70–80% of earned wages |
| No visibility into available jobs nearby | Waste time travelling to mandis daily |
| No proof of skills | Cannot command market rates for expertise |
| No financial inclusion | No bank account, no UPI, no credit access |

### For Contractors
| Problem | Impact |
|---------|--------|
| No reliable source of verified workers | Rework, project delays, quality issues |
| Manual paper attendance | Disputes, buddy-punching, inaccurate payroll |
| Cash payroll via middlemen | Financial leakage, compliance risk |
| No real-time site visibility | Can't track who's on site, who's absent |
| No worker performance history | Rehiring bad workers repeatedly |

### For Enterprises
| Problem | Impact |
|---------|--------|
| No contractor compliance visibility | ESG risk, legal exposure |
| No workforce analytics | Cannot forecast labour costs |
| Manual vendor invoicing | Billing disputes, payment delays |
| Zero audit trail | Cannot demonstrate labour law compliance |

---

## 3. Goals & Success Metrics

### Business Goals

| Goal | Target | Timeline |
|------|--------|----------|
| Worker registrations | 10,000 verified workers | 6 months post-launch |
| Active contractors | 500 onboarded | 6 months post-launch |
| Jobs posted monthly | 2,000+ | Month 3 |
| Payroll processed monthly | ₹2 Cr+ | Month 6 |
| Worker retention (30-day) | > 60% | Month 3 |
| Contractor retention (30-day) | > 75% | Month 3 |

### Product KPIs

| KPI | Target |
|-----|--------|
| Time-to-hire (job post → worker confirmed) | < 2 hours |
| Worker onboarding (signup → KYC verified) | < 10 minutes |
| Attendance check-in time | < 30 seconds |
| Payroll processing accuracy | 99.9% |
| Platform uptime SLA | 99.95% |
| Real-time geo-tracking latency | < 5 seconds |
| App crash-free rate (Flutter) | > 99.5% |
| API response time (p95) | < 500ms |

### North Star Metric
> **Total verified worker-days booked per month** — captures hiring, attendance, and payroll in one number.

---

## 4. User Personas

### Persona 1 — Raju (The Worker)

```
Name        : Raju Kumar
Age         : 28
Location    : Dharavi, Mumbai
Skill       : Mason (skilled), 5 years experience
Device      : ₹6,000 Android, 2G/4G intermittent
Language    : Hindi
Income      : ₹700–900/day (cash)
Pain Points : Doesn't know tomorrow's job, wages deducted by thekedar,
              no proof of his 5 years of masonry experience
Goal        : Steady work, get full wages directly, be recognised as skilled
```

### Persona 2 — Vikram (The Contractor)

```
Name        : Vikram Patil
Age         : 42
Location    : Pune
Company     : Small civil contractor, 3 active sites, ~80 workers
Device      : iPhone 13, laptop
Language    : Marathi, English
Pain Points : Can't find reliable masons fast, worker attendance disputes,
              cash payroll takes 2 full days every Friday
Goal        : Fill site positions in hours, automate attendance + payroll,
              see all 3 sites on one dashboard
```

### Persona 3 — Priya (The Enterprise HR Manager)

```
Name        : Priya Sharma
Age         : 35
Location    : Bengaluru
Company     : Large real estate developer, 10+ contractor vendors
Device      : MacBook, iPhone
Language    : English
Pain Points : Can't verify contractor compliance, no unified vendor dashboard,
              ESG reporting requires manual data collection
Goal        : Single view of all vendor workforces, automated compliance reports,
              digital audit trail for labour law adherence
```

### Persona 4 — Admin (Platform Operator)

```
Name        : Internal Ops Team
Tools       : Admin panel (web), internal dashboards
Pain Points : Manual KYC review, no fraud detection, no dispute visibility
Goal        : Scale worker verification, detect fraud, manage disputes,
              monitor platform health in real time
```

---

## 5. User Stories

### Worker Stories

```
W-001  As a worker, I want to register with my phone number via OTP
       so that I can create my digital identity without needing email.

W-002  As a worker, I want to upload my Aadhaar and skill photo
       so that my identity and skills get verified.

W-003  As a worker, I want to see nearby job openings on a map
       so that I can find work close to home without going to the mandi.

W-004  As a worker, I want to apply for a job in one tap
       so that I don't need a middleman to represent me.

W-005  As a worker, I want to check in at the site using my phone's GPS
       so that my attendance is recorded without a paper register.

W-006  As a worker, I want to see my attendance history and earnings
       so that I know exactly what I'll be paid.

W-007  As a worker, I want to receive my wages directly to my UPI / bank account
       so that no middleman can take a cut.

W-008  As a worker, I want to see my digital skill badges
       so that contractors can trust my experience level.

W-009  As a worker, I want to receive job alerts via SMS and push notification
       so that I never miss relevant work opportunities.

W-010  As a worker, I want to use the app in Hindi
       so that language is never a barrier.
```

### Contractor Stories

```
C-001  As a contractor, I want to post a job with skill requirements, location,
       and daily wage so that verified workers can discover and apply.

C-002  As a contractor, I want to browse verified worker profiles filtered by
       skill, city, and rating so that I hire the right person faster.

C-003  As a contractor, I want to hire a worker directly from their profile
       so that I bypass expensive placement agencies.

C-004  As a contractor, I want to see my site's live worker count on a map
       so that I know who is present at any moment.

C-005  As a contractor, I want attendance records to auto-generate
       so that I don't maintain paper registers.

C-006  As a contractor, I want to run weekly payroll in one click
       so that I stop spending Fridays counting cash.

C-007  As a contractor, I want payroll to auto-deduct PF (12%) and ESI (0.75%)
       so that I stay compliant without manual calculation.

C-008  As a contractor, I want to manage multiple sites from one dashboard
       so that I don't need multiple tools or spreadsheets.

C-009  As a contractor, I want to see worker ratings and job history
       so that I make better hiring decisions.

C-010  As a contractor, I want to raise and resolve attendance disputes
       so that payment disagreements are handled transparently.
```

### Enterprise Stories

```
E-001  As an enterprise manager, I want to onboard multiple contractors as vendors
       so that I manage all workforce via one portal.

E-002  As an enterprise manager, I want to see a consolidated workforce dashboard
       across all vendor contractors so that I have full site visibility.

E-003  As an enterprise manager, I want automated compliance reports (PF, ESI, labour law)
       so that I can demonstrate regulatory adherence without manual effort.

E-004  As an enterprise manager, I want to receive alerts when a contractor's
       workforce falls below threshold so that I can intervene before project delays.

E-005  As an enterprise manager, I want to export payroll and attendance data
       so that I can integrate with my ERP system.
```

### Admin Stories

```
A-001  As an admin, I want to review and approve/reject worker KYC documents
       so that only verified workers access the platform.

A-002  As an admin, I want to see a fraud detection dashboard flagging
       suspicious activity (duplicate Aadhaar, GPS spoofing) so that I act fast.

A-003  As an admin, I want to manage disputes between workers and contractors
       so that disagreements are resolved fairly and documented.

A-004  As an admin, I want to see platform-wide analytics (DAU, jobs posted,
       payroll processed) so that I track business health.

A-005  As an admin, I want to blacklist or suspend any user
       so that bad actors are removed from the platform.
```

---

## 6. Functional Requirements

### 6.1 Authentication & Identity

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-AUTH-01 | OTP-based login via Indian mobile number (6–9 series, 10 digits) | P0 |
| FR-AUTH-02 | JWT access token (15 min) + refresh token (7 days, HttpOnly cookie) | P0 |
| FR-AUTH-03 | Role-based access: Worker, Contractor, Contractor Admin, Enterprise Manager, Enterprise Admin, Platform Admin, Platform Super Admin | P0 |
| FR-AUTH-04 | OTP: 6-digit, 3-minute expiry, max 5 attempts, 15-minute lockout | P0 |
| FR-AUTH-05 | Session management — logout invalidates refresh token | P1 |
| FR-AUTH-06 | Biometric unlock (Face ID / Fingerprint) for returning users on mobile | P2 |

---

### 6.2 Worker Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-WRK-01 | Worker registration: name, phone, primary skill, city, experience, daily wage | P0 |
| FR-WRK-02 | Worker profile: photo, bio, skill badges, work history, ratings | P0 |
| FR-WRK-03 | KYC: Aadhaar upload (OCR auto-fill), selfie match, document storage on S3 | P0 |
| FR-WRK-04 | Skill verification: badge issued on admin approval | P1 |
| FR-WRK-05 | Worker search: filter by skill, city, kyc status, rating, availability | P0 |
| FR-WRK-06 | Worker availability toggle (available / not available) | P1 |
| FR-WRK-07 | Work history: past jobs, contractors, ratings, earnings summary | P1 |
| FR-WRK-08 | Bank account / UPI ID linking for payroll disbursement | P0 |
| FR-WRK-09 | Aadhaar number encrypted at rest (AES-256-GCM), last 4 digits shown | P0 |
| FR-WRK-10 | Worker rating by contractor (1–5 stars) after job completion | P1 |

---

### 6.3 Contractor Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-CON-01 | Contractor registration: name, company, GST number, city, phone | P0 |
| FR-CON-02 | Company profile: logo, description, active projects, worker count | P1 |
| FR-CON-03 | Multi-site management: create, edit, archive construction sites | P0 |
| FR-CON-04 | Contractor admin can invite sub-users with limited roles | P1 |
| FR-CON-05 | Contractor subscription plan (Free / Pro / Enterprise) | P2 |

---

### 6.4 Job Marketplace

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-JOB-01 | Post a job: title, skill required, site location, start date, duration, daily wage, slots | P0 |
| FR-JOB-02 | Job discovery for workers: list + map view, filter by skill + distance | P0 |
| FR-JOB-03 | Worker applies to job in one tap | P0 |
| FR-JOB-04 | Contractor reviews applicants and hires / rejects | P0 |
| FR-JOB-05 | AI-suggested workers: ranked by skill match, proximity, rating, availability | P1 |
| FR-JOB-06 | Job status lifecycle: DRAFT → OPEN → IN_PROGRESS → COMPLETED → CLOSED | P0 |
| FR-JOB-07 | Job expiry: auto-close after end date if no action | P1 |
| FR-JOB-08 | Job share via WhatsApp / SMS deep link | P2 |
| FR-JOB-09 | Contractor can directly invite a worker to a job | P1 |

---

### 6.5 Attendance System

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ATT-01 | Geo-fenced check-in: worker checks in only within site radius (configurable, default 200m) | P0 |
| FR-ATT-02 | Server-side geo-fence validation via PostGIS (not client-side only) | P0 |
| FR-ATT-03 | Check-out with GPS coordinate + auto-calculate working hours | P0 |
| FR-ATT-04 | Manual attendance override by contractor with reason | P1 |
| FR-ATT-05 | Daily attendance summary per site (present / absent / partial) | P0 |
| FR-ATT-06 | Attendance history for worker: calendar view with day-level details | P1 |
| FR-ATT-07 | QR code check-in fallback (for low GPS accuracy scenarios) | P2 |
| FR-ATT-08 | Biometric check-in fallback (device fingerprint / face) | P2 |
| FR-ATT-09 | Attendance dispute flow: worker raises dispute → contractor reviews → resolved | P1 |
| FR-ATT-10 | Bulk attendance export (CSV/Excel) per site per period | P1 |

---

### 6.6 Payroll System

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-PAY-01 | Auto-calculate payroll from attendance: working days × daily wage | P0 |
| FR-PAY-02 | Overtime calculation: hours beyond 8/day at 1.5× rate | P1 |
| FR-PAY-03 | Statutory deductions: PF @ 12%, ESI @ 0.75% | P0 |
| FR-PAY-04 | Payroll batch: contractor reviews summary → approves → triggers disbursement | P0 |
| FR-PAY-05 | Digital disbursement: UPI / IMPS / bank transfer via Razorpay Payouts | P0 |
| FR-PAY-06 | Worker receives push + SMS notification on payment | P0 |
| FR-PAY-07 | Payslip generation: downloadable PDF per worker per period | P1 |
| FR-PAY-08 | Payroll history: full audit trail, immutable | P0 |
| FR-PAY-09 | Failed payment retry logic with alerting | P1 |
| FR-PAY-10 | PF and ESI challan export for compliance | P2 |

---

### 6.7 Sites Module

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-SITE-01 | Create site: name, address, GPS coordinates, geo-fence radius | P0 |
| FR-SITE-02 | Site dashboard: active workers, attendance today, payroll pending | P0 |
| FR-SITE-03 | Live worker map: see all checked-in workers on map (< 5s latency) | P1 |
| FR-SITE-04 | Site workforce history: who worked, when, how many hours | P1 |
| FR-SITE-05 | Multi-site overview for contractor: all sites in one map | P1 |

---

### 6.8 Notifications

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-NOT-01 | Push notifications via FCM (Flutter app) | P0 |
| FR-NOT-02 | SMS notifications via Twilio / MSG91 (Hindi + English templates) | P0 |
| FR-NOT-03 | In-app notification bell with unread count | P1 |
| FR-NOT-04 | Email notifications for contractors and enterprise (SendGrid) | P1 |
| FR-NOT-05 | Notification preferences: worker can toggle push / SMS | P2 |

**Notification triggers:**
- Job application received (contractor)
- Application accepted / rejected (worker)
- Check-in confirmation (worker)
- Daily attendance summary (contractor)
- Payroll approved / disbursed (worker)
- KYC approved / rejected (worker)
- Dispute raised / resolved (both)

---

### 6.9 Analytics & Reports

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ANA-01 | Contractor dashboard: workers hired, attendance rate, payroll spend (MTD/YTD) | P1 |
| FR-ANA-02 | Enterprise dashboard: vendor-wise workforce, compliance score, total spend | P1 |
| FR-ANA-03 | Admin dashboard: platform DAU, jobs posted, payroll processed, KYC queue | P0 |
| FR-ANA-04 | Worker analytics: earnings history, jobs completed, attendance rate | P1 |
| FR-ANA-05 | Labour market insights: avg wage by skill + city (anonymised) | P2 |
| FR-ANA-06 | Export reports: CSV / Excel / PDF for all major data views | P1 |

---

### 6.10 Admin Panel

| ID | Requirement | Priority |
|----|-------------|----------|
| FR-ADM-01 | KYC review queue: review Aadhaar + selfie, approve / reject with reason | P0 |
| FR-ADM-02 | User management: search, view, suspend, blacklist any user | P0 |
| FR-ADM-03 | Fraud detection dashboard: duplicate Aadhaar, GPS spoof patterns, bulk flag | P1 |
| FR-ADM-04 | Dispute resolution: view dispute timeline, mediate, close with outcome | P1 |
| FR-ADM-05 | Platform configuration: commission rates, geo-fence defaults, OTP TTL | P1 |
| FR-ADM-06 | Audit log viewer: immutable log of all admin actions | P0 |
| FR-ADM-07 | Announcement broadcast: push message to all workers or contractors | P2 |

---

## 7. Non-Functional Requirements

### 7.1 Performance

| Requirement | Target |
|-------------|--------|
| API response time (p50) | < 200ms |
| API response time (p95) | < 500ms |
| API response time (p99) | < 1000ms |
| App cold start time (Flutter) | < 3 seconds |
| Page load (Next.js dashboard) | < 2 seconds (LCP) |
| Real-time geo-tracking latency | < 5 seconds |
| Payroll batch processing (1,000 workers) | < 2 minutes |
| Search results (Elasticsearch) | < 300ms |

### 7.2 Scalability

| Requirement | Target |
|-------------|--------|
| Concurrent API users | 10,000 |
| Peak concurrent WebSocket connections | 5,000 |
| Workers registered on platform | 1,000,000 (Year 2) |
| Jobs posted per day | 10,000 |
| Attendance records per day | 500,000 |
| Payroll disbursements per month | 200,000 |

### 7.3 Availability & Reliability

| Requirement | Target |
|-------------|--------|
| Platform uptime SLA | 99.95% |
| Planned maintenance window | < 2 hours/month (off-peak) |
| RTO (Recovery Time Objective) | < 1 hour |
| RPO (Recovery Point Objective) | < 5 minutes |
| Database backup frequency | Continuous (Aurora PITR) |
| Cross-region DR failover | AWS ap-south-1 → ap-northeast-1 |

### 7.4 Security

| Requirement | Standard |
|-------------|----------|
| Data in transit | TLS 1.3 minimum |
| Data at rest | AES-256 (RDS + S3) |
| Sensitive field encryption | AES-256-GCM at application layer (Aadhaar, bank accounts) |
| Authentication | JWT RS256, OTP HMAC-SHA256 |
| Token storage | Access token in memory, refresh in HttpOnly cookie |
| Rate limiting | 100 req/min (global), 3 OTPs/15min per phone |
| PII in logs | Masked (phone → `98*****210`) |
| File uploads | Server-side MIME validation, 5MB limit, ClamAV scan |
| Secrets | AWS Secrets Manager — never in code or `.env` in production |
| Compliance | DPDP Act 2023 (India), labour law audit trail |

### 7.5 Usability

| Requirement | Standard |
|-------------|----------|
| Languages | Hindi, English, Marathi (Phase 1) |
| Mobile OS support | Android 8.0+ (API 26+), iOS 14+ |
| Offline capability | Worker app: view profile, last attendance, cached jobs (Hive) |
| Low-bandwidth support | Designed for 2G/3G — lazy load images, compressed API payloads |
| Accessibility | WCAG 2.1 Level AA on web dashboards |
| Minimum device support | 2GB RAM Android, ₹6,000 device segment |

### 7.6 Compliance & Legal

| Requirement | Detail |
|-------------|--------|
| PF deduction | 12% employer + 12% employee above ₹15,000/month threshold |
| ESI deduction | 0.75% employee, 3.25% employer below ₹21,000/month |
| Data retention | User data: 3 years post account deletion; Payroll: 7 years (statutory) |
| Audit logs | Immutable, 7-year retention |
| DPDP Act 2023 | Consent before KYC data collection, right to erasure pipeline |
| Aadhaar handling | UIDAI-compliant — no raw Aadhaar storage, encrypted vault only |

---

## 8. Product Roadmap

### Phase 1 — MVP (Month 1–2)

```
✅ Worker registration + OTP login
✅ KYC upload (Aadhaar + selfie)
✅ Contractor registration
✅ Job posting + application
✅ Geo-fenced attendance (check-in/out)
✅ Basic payroll calculation + manual disbursement
✅ Push + SMS notifications
✅ Admin KYC review panel
✅ Contractor dashboard (web)
✅ Worker mobile app (Android)
```

### Phase 2 — Growth (Month 3–5)

```
⬜ AI worker matching & ranking
⬜ Automated payroll batch processing (BullMQ)
⬜ Razorpay Payouts integration (direct UPI disbursement)
⬜ Digital payslip PDF generation
⬜ Attendance dispute flow
⬜ Enterprise portal (multi-vendor management)
⬜ Worker ratings & reviews
⬜ Analytics dashboards (contractor + admin)
⬜ iOS worker app release
⬜ Hindi / Marathi full i18n
```

### Phase 3 — Scale (Month 6–9)

```
⬜ Labour market pricing insights (demand/supply heat maps)
⬜ Skill assessment tests (AI-proctored)
⬜ Contractor CRM (notes, labels, worker pools)
⬜ ESG compliance reporting for enterprises
⬜ Embedded financial services (worker credit line, insurance)
⬜ PF & ESI challan auto-generation
⬜ WhatsApp Business API for worker notifications
⬜ Offline-first sync for attendance in no-signal sites
⬜ Multi-language expansion (Tamil, Telugu, Bengali)
```

### Phase 4 — Platform (Month 10–18)

```
⬜ Open API for enterprise ERP integration
⬜ Worker skill marketplace (training + certification)
⬜ Background verification via third-party (SpringVerify / AuthBridge)
⬜ Contractor fleet management (vehicles, equipment)
⬜ B2B SaaS tiers with usage-based billing
⬜ Referral programme (worker invites worker)
⬜ iOS contractor app
```

---

## 9. Out of Scope

The following are **explicitly not in scope** for Phase 1:

```
✗ White-collar / office job marketplace
✗ International markets (outside India)
✗ Worker housing or accommodation booking
✗ Equipment / machinery rental marketplace
✗ Contractor invoicing to end clients (only internal payroll)
✗ Native iOS contractor app (web PWA in Phase 1)
✗ In-app chat / messaging between workers and contractors
✗ Worker lending / BNPL products (Phase 3+)
✗ Automated PF / ESI challan filing (Phase 3+)
✗ ERP integrations (Phase 4+)
```

---

## 10. Dependencies

### External Services

| Service | Purpose | Fallback |
|---------|---------|----------|
| Twilio / MSG91 | OTP + SMS notifications | MSG91 failover |
| Razorpay Payouts | Payroll disbursement (UPI / IMPS) | Manual bank transfer |
| AWS S3 | Document + photo storage | — |
| AWS RDS (Aurora PostgreSQL) | Primary database | Read replica |
| AWS ElastiCache (Redis) | Sessions, queues, rate limits | — |
| Firebase Cloud Messaging | Push notifications (Android + iOS) | SMS fallback |
| SendGrid | Email notifications | — |
| Google Maps / Mapbox | Site maps, worker location | OpenStreetMap |
| UIDAI / DigiLocker | Aadhaar KYC verification (Phase 2) | Manual review |
| AWS Textract | Aadhaar OCR auto-fill (Phase 2) | Manual entry |
| ClamAV | Malware scan on uploaded files | — |

### Internal Dependencies

| Dependency | Required By |
|------------|-------------|
| Auth module live | All other modules |
| Worker KYC approved | Job application, payroll |
| Site created | Attendance, live tracking |
| Attendance records | Payroll calculation |
| Bank/UPI linked | Payroll disbursement |

---

## 11. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| GPS spoofing for fake attendance | Medium | High | Server-side PostGIS validation + anomaly detection (same coords for multiple workers) |
| Aadhaar data breach | Low | Critical | AES-256-GCM field encryption, no raw Aadhaar stored, UIDAI-compliant flow |
| Payment gateway downtime | Medium | High | Razorpay fallback to IMPS, retry queue, PagerDuty P1 alert |
| Low worker smartphone literacy | High | Medium | Voice-guided onboarding, Hindi UI, offline-first design, simple 3-tap flows |
| Contractor resistance to digital payroll | Medium | High | Show cost savings (no thekedar fee), offer cash disbursement bridge in Phase 1 |
| Regulatory change (DPDP Act enforcement) | Medium | Medium | Data minimisation, consent flows built-in, legal review at each phase |
| Fake worker profiles | Medium | Medium | Aadhaar KYC mandatory for job application, admin fraud detection dashboard |
| Network unreliability on construction sites | High | Medium | Offline check-in queue with sync on reconnect (WorkManager + Hive) |
| Competitor replication | Medium | Low | Network effects (worker reviews, work history), data moat (labour market data) |
| Payroll calculation errors | Low | Critical | Unit tests for every formula, 99.9% accuracy SLA, manual override + dispute flow |

---

## 12. Appendix

### Glossary

| Term | Definition |
|------|-----------|
| **Chowk** | Hindi for "intersection" — the traditional labour market gathering point |
| **Mandi** | Informal labour market where workers gather daily for work |
| **Thekedar** | Labour contractor / middleman who sources and manages workers |
| **KYC** | Know Your Customer — identity verification using Aadhaar + selfie |
| **PF** | Provident Fund — statutory retirement saving, 12% of basic wages |
| **ESI** | Employee State Insurance — health insurance, 0.75% employee contribution |
| **UPI** | Unified Payments Interface — India's real-time payment rail |
| **Geo-fence** | Virtual boundary around a construction site for attendance validation |
| **DAU** | Daily Active Users |
| **MTD / YTD** | Month-to-Date / Year-to-Date |

### Priority Definitions

| Priority | Meaning |
|----------|---------|
| **P0** | Must have for MVP — cannot launch without |
| **P1** | Should have in Phase 1 — significantly reduces value if missing |
| **P2** | Nice to have — defer to Phase 2 if needed |
| **P3** | Future roadmap — documented but not scheduled |

### Stakeholder Sign-off

| Role | Name | Status |
|------|------|--------|
| Product Owner | — | ✅ Approved |
| Engineering Lead | — | ✅ Approved |
| Design Lead | — | ✅ Approved |
| Business / CEO | — | ✅ Approved |
| Legal / Compliance | — | ⏳ Pending |

---

*Document: PRD.md | Platform: Digital Labour Chowk v1.0*
*Last updated: May 2026 | Next review: August 2026*
