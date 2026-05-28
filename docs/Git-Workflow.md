# Git-Workflow.md — Digital Labour Chowk

> **Engineering Git & Deployment Reference**
> Version 1.0 | For Engineers, DevOps, and AI Coding Agents
> Platform: Labour Marketplace & Workforce Management System
> Style: Claude Code Vibe Coding — AI-native, safe deploys, zero surprises

---

## Table of Contents

1. [Git Workflow Philosophy](#1-git-workflow-philosophy)
2. [Repository Structure](#2-repository-structure)
3. [Branching Strategy](#3-branching-strategy)
4. [Commit Standards](#4-commit-standards)
5. [Pull Request Workflow](#5-pull-request-workflow)
6. [Automatic Code Commit Workflow](#6-automatic-code-commit-workflow)
7. [Git Hooks](#7-git-hooks)
8. [CI/CD Pipeline Architecture](#8-cicd-pipeline-architecture)
9. [GitHub Actions Workflows](#9-github-actions-workflows)
10. [Docker Workflow](#10-docker-workflow)
11. [Deployment Workflow](#11-deployment-workflow)
12. [Release Management](#12-release-management)
13. [Security Workflow](#13-security-workflow)
14. [AI Coding Workflow](#14-ai-coding-workflow)
15. [Monitoring & Alerts](#15-monitoring--alerts)
16. [Engineering Rules](#16-engineering-rules)

---

## 1. Git Workflow Philosophy

### The Four Pillars

```
┌─────────────────┬────────────────────────────────────────────────────┐
│  Pillar          │  What It Means in Practice                         │
├─────────────────┼────────────────────────────────────────────────────┤
│  Fast Iteration  │  Feature branches live 1–3 days, not 2 weeks.     │
│                  │  Small PRs merge fast. Big PRs break down.         │
├─────────────────┼────────────────────────────────────────────────────┤
│  Safe Deploys    │  No human can push to main directly. Ever.         │
│                  │  Every deploy is tested, scanned, and reversible.  │
├─────────────────┼────────────────────────────────────────────────────┤
│  AI-Assisted     │  Claude, Cursor, and Copilot accelerate coding.    │
│  Development     │  Humans own architecture and review. AI generates. │
├─────────────────┼────────────────────────────────────────────────────┤
│  Scalable        │  Workflow scales from 3 engineers to 30.           │
│  Collaboration   │  Same rules apply to junior devs and AI agents.    │
└─────────────────┴────────────────────────────────────────────────────┘
```

### Git Philosophy Statement

```
Every commit tells a story.
Every PR is a conversation.
Every deploy is a promise.

We write commit messages for the engineer who will debug this at 2 AM.
We write PR descriptions for the reviewer who has 6 other PRs to review.
We write deployment configs for the on-call engineer during an incident.

Speed is not the enemy of quality.
Small, frequent, tested changes are both fast AND safe.
Big bang deployments are neither.
```

### AI-Assisted Development Contract

```
The contract between human engineers and AI tools on this team:

  AI WILL:
  ✦ Generate implementation code within clearly defined scope
  ✦ Create commit messages from staged diffs
  ✦ Suggest PR descriptions from branch changes
  ✦ Run pre-commit checks before committing
  ✦ Flag potential architecture violations before they merge
  ✦ Generate test boilerplate for new features

  AI WILL NOT:
  ✗ Push directly to develop or main (no AI agent has push access to protected branches)
  ✗ Approve PRs on behalf of human reviewers
  ✗ Bypass CI checks
  ✗ Override security scan failures
  ✗ Make architectural decisions without human sign-off

  The pipeline is the last line of defence.
  The human reviewer is the second-to-last.
  Pre-commit hooks are the first.
  All three must agree before code ships.
```

---

## 2. Repository Structure

### Monorepo Layout

```
dlc-platform/                        ← GitHub Repository Root
│
├── .github/
│   ├── workflows/                   ← All GitHub Actions YAML files
│   │   ├── ci.yml                   ← Runs on every PR + push
│   │   ├── deploy-staging.yml       ← Auto-deploy on merge to develop
│   │   ├── deploy-production.yml    ← Manual dispatch + approval gate
│   │   ├── mobile-build.yml         ← Flutter APK/IPA build pipeline
│   │   ├── security-scan.yml        ← Scheduled weekly security audit
│   │   └── release.yml              ← Auto-release on version tag push
│   ├── PULL_REQUEST_TEMPLATE.md
│   ├── ISSUE_TEMPLATE/
│   │   ├── bug_report.md
│   │   └── feature_request.md
│   └── CODEOWNERS                   ← Auto-assign reviewers by path
│
├── frontend/                        ← Next.js 15 (Contractor + Admin dashboards)
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── next.config.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── .eslintrc.json
│   ├── .prettierrc
│   └── README.md
│
├── backend/                         ← NestJS REST API
│   ├── src/
│   ├── test/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── nest-cli.json
│   ├── .eslintrc.json
│   ├── .prettierrc
│   └── README.md
│
├── mobile/                          ← Flutter Worker App
│   ├── lib/
│   ├── test/
│   ├── integration_test/
│   ├── android/
│   ├── ios/
│   ├── pubspec.yaml
│   ├── analysis_options.yaml
│   └── README.md
│
├── infrastructure/                  ← Terraform + Kubernetes manifests
│   ├── terraform/
│   │   ├── modules/
│   │   │   ├── vpc/
│   │   │   ├── eks/
│   │   │   ├── rds/
│   │   │   └── elasticache/
│   │   └── environments/
│   │       ├── staging/
│   │       └── production/
│   ├── kubernetes/
│   │   ├── base/
│   │   │   ├── backend-deployment.yaml
│   │   │   ├── frontend-deployment.yaml
│   │   │   ├── ingress.yaml
│   │   │   └── hpa.yaml
│   │   └── overlays/
│   │       ├── staging/
│   │       └── production/
│   ├── helm/
│   │   └── dlc-platform/
│   └── README.md
│
├── docs/                            ← Engineering documentation
│   ├── decisions/                   ← Architecture Decision Records (ADRs)
│   │   └── ADR-001-modular-monolith.md
│   ├── runbooks/                    ← Operational runbooks
│   │   ├── deploy-production.md
│   │   ├── rollback.md
│   │   └── incident-response.md
│   ├── postman/                     ← API collections
│   └── DEMO_GUIDE.md
│
├── scripts/                         ← Developer utility scripts
│   ├── setup-local.sh               ← One-command local setup
│   ├── seed-database.sh
│   ├── generate-migration.sh
│   └── check-env.sh
│
├── docker-compose.yml               ← Local development environment
├── docker-compose.override.yml      ← Local overrides (hot reload)
├── .env.example                     ← All env vars documented (no values)
├── .gitignore
├── .gitleaks.toml                   ← Secret scanning config
├── CLAUDE.md                        ← AI coding standards
├── Architecture.md
├── Design.md
├── Skills.md
├── Task.md
├── Git-Workflow.md                  ← This file
└── README.md
```

### CODEOWNERS Configuration

```
# .github/CODEOWNERS
# Auto-assigns reviewers based on changed file paths
# Format: <path> <@github-username or @org/team>

# Global fallback — TL reviews anything not explicitly owned
*                           @dlc-platform/tech-leads

# Backend changes require backend team review
/backend/                   @dlc-platform/backend-engineers

# Frontend changes require frontend team review
/frontend/                  @dlc-platform/frontend-engineers

# Mobile changes require mobile team review
/mobile/                    @dlc-platform/mobile-engineers

# Infrastructure requires DevOps review
/infrastructure/            @dlc-platform/devops-engineers
/.github/workflows/         @dlc-platform/devops-engineers
/docker-compose*.yml        @dlc-platform/devops-engineers

# Security-sensitive files require security lead review
/.gitleaks.toml             @dlc-platform/security-leads
/backend/src/modules/auth/  @dlc-platform/tech-leads
/backend/src/modules/payroll/ @dlc-platform/tech-leads

# Documentation can be reviewed by any lead
/docs/                      @dlc-platform/tech-leads
/CLAUDE.md                  @dlc-platform/tech-leads
```

---

## 3. Branching Strategy

### Branch Hierarchy

```
main                          ← Production-only. Tagged releases. No direct push.
│
└── develop                   ← Integration branch. All features land here first.
    │
    ├── feature/*             ← New features (1–3 days max lifetime)
    ├── fix/*                 ← Bug fixes found in develop/staging
    ├── chore/*               ← Dependency updates, config changes, tooling
    ├── test/*                ← Adding/fixing tests without feature changes
    └── docs/*                ← Documentation-only changes

main
└── hotfix/*                  ← Critical production fixes (branch from main, PR to BOTH main + develop)

develop
└── release/*                 ← Release candidate branches (branched from develop)
```

### Branch Descriptions

#### `main` — The Sacred Branch
```
Purpose:    Represents exactly what is running in production right now.
Protection: No direct pushes. Ever. From anyone. Including the CTO.
Updates:    Only via PR from release/* or hotfix/*
Deployment: Auto-deploys to production on push (after approval gate)
Tags:       Every merge to main creates a version tag (v2.3.1)
History:    Linear — all merges are squash merges

Rules:
  ✦ Protected: require 2 PR approvals
  ✦ Require CI status checks to pass
  ✦ Require branch to be up to date with main before merging
  ✦ No force pushes. Ever.
  ✦ No deletion (obviously)
```

#### `develop` — The Integration Branch
```
Purpose:    The "next release" branch. Always in a releasable state.
Protection: No direct pushes. Requires 1 PR approval + CI green.
Updates:    Via PR from feature/*, fix/*, chore/*, docs/* branches
Deployment: Auto-deploys to staging on every merge
State:      Should ALWAYS be deployable. If it's broken, fixing it is P0.

Rules:
  ✦ Protected: require 1 PR approval
  ✦ Require CI status checks to pass
  ✦ Require branch to be up to date before merging
  ✦ Squash merge strategy (clean history)
```

#### `feature/*` — Feature Development
```
Lifetime:    1–3 days ideally. Maximum 5 days. If longer, break it down.
Source:      Branched from develop
Target:      PRs to develop
Naming:      feature/{ticket-id}-{short-description}

Examples:
  feature/DLC-123-worker-gps-attendance
  feature/DLC-456-payroll-overtime-calculation
  feature/DLC-789-contractor-bulk-hire
  feature/DLC-101-admin-kyc-review-queue
  feature/DLC-202-flutter-offline-sync

AI branch naming (when Claude generates the branch):
  feature/AI-DLC-123-worker-gps-attendance
  (AI prefix makes AI-initiated branches identifiable in tooling)
```

#### `fix/*` — Bug Fixes
```
Lifetime:    Hours to 1 day
Source:      Branched from develop (for bugs found in staging)
Target:      PRs to develop
Naming:      fix/{ticket-id}-{what-was-broken}

Examples:
  fix/DLC-891-otp-rate-limit-not-resetting
  fix/DLC-892-payroll-incorrect-esi-calculation
  fix/DLC-893-attendance-timezone-offset-error
```

#### `hotfix/*` — Production Emergency Fixes
```
Lifetime:    Hours (this is urgent)
Source:      Branched from main (not develop — production code)
Target:      PRs to BOTH main AND develop
Naming:      hotfix/{ticket-id}-{critical-issue}

Examples:
  hotfix/DLC-P1-jwt-token-not-expiring
  hotfix/DLC-P1-payroll-double-processing-bug
  hotfix/DLC-P1-otp-bypass-vulnerability

Process:
  1. git checkout -b hotfix/DLC-P1-description main
  2. Fix the issue + add regression test
  3. Open PR to main (2 approvers required, expedited review)
  4. After main merge: open second PR to develop (bring fix into integration)
  5. Tag release immediately after merge to main

Hotfix SLA:
  Identified → PR open:   30 minutes
  PR open → Approved:     1 hour (emergency review channel)
  Approved → Deployed:    15 minutes (auto-deploy pipeline)
```

#### `release/*` — Release Candidates
```
Lifetime:    1–2 days (QA sign-off period)
Source:      Branched from develop when sprint is feature-complete
Target:      PRs to main
Naming:      release/v{major}.{minor}.{patch}

Examples:
  release/v1.0.0     ← MVP launch
  release/v1.1.0     ← First feature sprint
  release/v1.1.1     ← Patch after 1.1.0

Process:
  1. git checkout -b release/v1.1.0 develop
  2. Version bump: update package.json, pubspec.yaml
  3. Update CHANGELOG.md
  4. QA does final sign-off on staging
  5. Fix any last-minute bugs directly on release branch
  6. PR to main → merge → tag v1.1.0
  7. PR back to develop → merge (bring changelog + version bump back)
```

### Branch Lifecycle Diagram

```
develop ──────────────────────────────────────────────────────────►
   │          │ Merge               │ Merge           │ Merge
   │    feature/DLC-123 ──────────►│   fix/DLC-891 ─►│
   │    (3 days)                    │   (4 hours)      │
   │                                                   │
   │────────────────────────── release/v1.1.0 ────────►│
                                    QA (1 day)          │
                                                       ▼
main ──────────────────────────────────────────── v1.1.0 tag ────►
       │
       │  hotfix/DLC-P1 ──────────────────────────────────────────►
       │  (2 hours)                                    ↑ merge to main
       │                                               ↓ merge to develop
```

---

## 4. Commit Standards

### Conventional Commits Format

```
<type>(<scope>): <short description>

[optional body — explains WHY, not WHAT]

[optional footer]
  Closes: DLC-123
  Breaking-Change: <description if any>
  Co-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>
```

### Commit Types Reference

```
Type        When to use                                   Scope examples
─────────────────────────────────────────────────────────────────────────
feat        New feature for the user                      auth, jobs, payroll
fix         Bug fix for the user (not build/CI)           attendance, workers
refactor    Code change (no fix, no feature)              workers, db, api
perf        Performance improvement                       jobs, search, db
test        Adding or updating tests                      auth, payroll, e2e
docs        Documentation changes only                   api, readme, adr
style       Formatting, semicolons (no logic change)     (all)
chore       Build process, dependency updates             deps, ci, docker
ci          CI/CD configuration changes                   github-actions
build       Build system changes (webpack, docker)        docker, k8s
revert      Reverting a previous commit                   (all)
```

### Commit Message Examples

```bash
# ─── FEATURES ──────────────────────────────────────────────────────
feat(auth): implement OTP rate limiting with Redis

Store attempt counter in Redis with 15-minute window.
Block after 5 failed attempts. Auto-reset after window expires.
This prevents brute-force OTP attacks on worker accounts.

Closes: DLC-045

feat(jobs): add full-text search using PostgreSQL GIN index

Replace LIKE '%query%' with tsquery + tsvector for 10x faster
search on the jobs table (benchmarked at 50k rows).

feat(attendance): add PostGIS geo-fence validation for check-in

Workers must be within site.radius_meters of site center to
check in. Returns geoFenceValid=false (not blocked) if outside,
so contractors see flagged check-ins.

feat(mobile): implement offline GPS attendance queue

Buffer GPS check-ins in Hive when offline.
WorkManager task syncs on network reconnect.
Handles up to 24 hours of offline attendance data.

Co-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>

# ─── BUG FIXES ─────────────────────────────────────────────────────
fix(payroll): correct ESI deduction threshold calculation

ESI applies to workers earning ≤ ₹21,000/month, not ≤ ₹15,000.
Incorrect threshold was under-deducting for workers in ₹15k–₹21k range.

Closes: DLC-891

fix(attendance): handle timezone offset in check-in timestamp

check_in_time was stored in local timezone instead of UTC.
All timestamps now stored as TIMESTAMPTZ in UTC.
Fixes attendance showing incorrect hours for IST workers.

Closes: DLC-893

# ─── CHORES & INFRA ─────────────────────────────────────────────────
chore(deps): upgrade NestJS to 11.0.2

Security patch for @nestjs/platform-express CVE-2026-XXXXX.
No API changes required.

ci(github-actions): add Docker image vulnerability scan step

Added Trivy scan to CI pipeline.
Fails build on CRITICAL severity findings.
HIGH severity findings create GitHub security advisory.

chore(docker): switch backend base image to node:20-alpine

Reduces production image size from 1.2GB to 180MB.
Non-root user configured (appuser).

# ─── TESTS ──────────────────────────────────────────────────────────
test(payroll): add unit tests for overtime calculation

Covers: regular hours, overtime at 1.5x, overnight shifts,
multi-day aggregation. Fixes gap in coverage for PayrollService.

test(e2e): add Playwright test for contractor hiring flow

Full journey: login → post job → find worker → hire → confirm.
Uses test fixtures and auto-seeded test database.

# ─── DOCS ───────────────────────────────────────────────────────────
docs(api): add Swagger decorators to attendance controller

All 6 endpoints now have @ApiOperation, @ApiResponse decorators.
Documents error codes: WORKER_NOT_HIRED, OUTSIDE_GEO_FENCE.

docs(adr): ADR-003 — PostgreSQL over MongoDB for financial data

Documents the decision to use PostgreSQL for ACID compliance
in payroll and attendance modules.

# ─── REVERTING ──────────────────────────────────────────────────────
revert: feat(jobs): add elasticsearch integration

Reverts commit abc1234.
Elasticsearch cluster provisioning is delayed to Sprint 3.
Rolling back to PostgreSQL FTS for MVP demo.
```

### Commit Anti-Patterns (Never Do These)

```bash
# ❌ Vague and useless
git commit -m "fix"
git commit -m "update"
git commit -m "changes"
git commit -m "WIP"           # (unless prefixed in branch name for draft PRs)
git commit -m "asdfgh"

# ❌ Too many things in one commit
git commit -m "add auth, fix payroll, update docs, upgrade deps"

# ❌ Past tense
git commit -m "added OTP rate limiting"   # → "add OTP rate limiting"
git commit -m "fixed ESI calculation"     # → "fix ESI calculation"

# ❌ Screaming
git commit -m "FIXED THE BUG THAT WAS CAUSING PROD TO BREAK"

# ❌ Secrets in commit message
git commit -m "add API key AIzaSy... for Firebase"

# ✅ Good: present tense, scoped, explains why
git commit -m "fix(payroll): correct ESI threshold from ₹15k to ₹21k limit"
```

---

## 5. Pull Request Workflow

### PR Lifecycle

```
┌─────────────────────────────────────────────────────────────────────┐
│                        PR LIFECYCLE                                  │
│                                                                       │
│  1. ENGINEER          │  2. CI PIPELINE       │  3. REVIEW           │
│  ─────────────        │  ────────────────     │  ──────────          │
│  Push feature branch  │  Lint checks          │  1 human reviewer    │
│  Open PR (draft)      │  Type checking        │  AI code review      │
│  Self-review diff     │  Unit tests           │  Security scan       │
│  Remove draft status  │  Integration tests    │  Architecture check  │
│  Request review       │  Docker build         │  Comments addressed  │
│                       │  Security scan        │                      │
│                       │  Coverage report      │                      │
│                                                                       │
│  4. APPROVAL          │  5. MERGE             │  6. DEPLOY           │
│  ──────────           │  ──────────           │  ──────────          │
│  All CI checks green  │  Squash merge         │  Auto-deploy staging │
│  1+ approvals         │  Delete branch        │  Slack notification  │
│  No blocking comments │  Closes linked issues │  Smoke tests run     │
└─────────────────────────────────────────────────────────────────────┘
```

### PR Template

```markdown
<!-- .github/PULL_REQUEST_TEMPLATE.md -->

## Summary
<!-- What does this PR do? 2-3 sentences max. -->

## Linked Ticket
Closes: DLC-XXX

## Type of Change
- [ ] feat: New feature
- [ ] fix: Bug fix
- [ ] refactor: Code refactor (no behavior change)
- [ ] chore: Maintenance (deps, config, tooling)
- [ ] test: Tests only
- [ ] docs: Documentation only
- [ ] ci: CI/CD changes

## How to Test
<!-- Step-by-step instructions for the reviewer to verify this works. -->
1. 
2. 
3. 

**Postman/curl:**
```
curl -X POST https://localhost:3000/api/v1/...
```

## Screenshots / Recordings
<!-- Required for any UI changes. Drag and drop images here. -->
| Before | After |
|--------|-------|
|        |       |

## Engineering Checklist
- [ ] Tests added or updated (unit + integration if applicable)
- [ ] CLAUDE.md architecture rules followed
- [ ] Swagger documentation updated for any API changes
- [ ] No console.log or debug code committed
- [ ] No secrets, tokens, or credentials in code
- [ ] Migration file included if DB schema changed
- [ ] `.env.example` updated if new env vars added
- [ ] Responsive design verified (if UI change)
- [ ] Error states and loading states handled (if UI change)

## Breaking Changes
<!-- Is this a breaking change for any API consumer? -->
- [ ] No breaking changes
- [ ] Breaking change: describe below

## AI Assistance Used
<!-- Transparency about AI involvement -->
- [ ] No AI assistance used
- [ ] AI generated initial code (reviewed and validated by me)
- [ ] AI generated tests (reviewed and validated by me)
- [ ] AI generated commit message (reviewed by me)
```

### Review Standards

```
Review SLAs:
  feature/* → develop:   Within 4 business hours
  fix/*     → develop:   Within 2 hours
  hotfix/*  → main:      Within 1 hour (emergency channel)
  release/* → main:      Same day (QA sign-off required)

What reviewers check:

  Architecture:
    ✦ Does this follow CLAUDE.md module patterns?
    ✦ Is business logic in the right layer (service, not controller)?
    ✦ Does it create any new cross-module dependencies?
    ✦ Does it follow the existing naming conventions?

  Security:
    ✦ Are all new endpoints protected with @UseGuards?
    ✦ Are inputs validated with DTOs + class-validator?
    ✦ Is no PII logged?
    ✦ Are no secrets hardcoded?

  Quality:
    ✦ Is the code readable without needing to run it?
    ✦ Are error cases handled?
    ✦ Are tests covering the new behaviour?
    ✦ Would this code survive a 3 AM incident debug session?

  Performance:
    ✦ Are there any obvious N+1 queries?
    ✦ Are new DB queries using appropriate indexes?
    ✦ Are any heavy operations pushed to background queues?

Comment conventions:
  [BLOCKER]  Must fix before merge. Decline if unaddressed.
  [SUGGEST]  Should fix. Will approve if not addressed but flagged.
  [NIT]      Minor style/naming. Fix if 2 minutes, skip if not.
  [Q]        Genuine question. Not requesting a change.
  [PRAISE]   Explicitly noting excellent work (do this more).
  [FYI]      Informational. No action required.
```

### Merge Strategy

```
develop ← feature branches:   SQUASH AND MERGE
  Reason: Clean develop history. Each feature = 1 commit.
  Result: develop history is readable: "feat(auth): add OTP flow | DLC-045"

main ← release branches:      MERGE COMMIT (no squash)
  Reason: Preserve release history. Multiple commits tell the release story.
  Result: main shows release commits with full context.

main ← hotfix branches:       MERGE COMMIT
  Reason: Preserve emergency fix context for post-mortem analysis.

Never use: REBASE AND MERGE
  Reason: Rewrites commit hashes. Breaks existing references to those commits.
           Causes confusion in cross-branch comparisons and blame history.
```

---

## 6. Automatic Code Commit Workflow

### AI-Assisted Commit Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│            AI-ASSISTED CODE → COMMIT WORKFLOW                        │
│                                                                       │
│  Step 1: AI GENERATES CODE                                           │
│  ─────────────────────────                                           │
│  Claude Code generates feature implementation                        │
│  → Code lives in working directory (unstaged)                        │
│                                                                       │
│  Step 2: AUTOMATED VALIDATION (pre-stage)                           │
│  ────────────────────────────────────────                            │
│  npm run lint:fix         → auto-fixes ESLint issues                │
│  npm run format           → Prettier formats all changed files       │
│  tsc --noEmit             → TypeScript type check                    │
│  → If any step fails: Claude reviews + fixes before staging          │
│                                                                       │
│  Step 3: SELECTIVE STAGING                                           │
│  ─────────────────────────                                           │
│  Engineer reviews diff (git diff)                                    │
│  Stages only intended changes (git add -p for partial staging)      │
│  Never: git add . blindly after AI generation                       │
│                                                                       │
│  Step 4: PRE-COMMIT HOOKS (Husky)                                   │
│  ────────────────────────────────                                    │
│  lint-staged runs on staged files                                    │
│  gitleaks scans for secrets                                         │
│  Quick unit test run (affected tests only)                          │
│  → Hook failure: fix + re-stage                                     │
│                                                                       │
│  Step 5: COMMIT MESSAGE GENERATION                                  │
│  ─────────────────────────────────                                   │
│  Claude analyzes git diff → suggests commit message                 │
│  Engineer reviews + approves the message                            │
│  git commit -m "feat(auth): ..." --trailer "Co-authored-by: ..."   │
│                                                                       │
│  Step 6: PUSH + PR AUTOMATION                                       │
│  ────────────────────────────                                        │
│  git push origin feature/DLC-123-...                                │
│  gh pr create --fill                                                 │
│  Claude generates PR description from branch diff                   │
│  CI pipeline triggers automatically                                  │
└─────────────────────────────────────────────────────────────────────┘
```

### Claude Code Integration Workflow

```bash
# ─── DAILY WORKFLOW WITH CLAUDE CODE ──────────────────────────────

# 1. Start of feature
git checkout develop
git pull origin develop
git checkout -b feature/DLC-123-worker-geo-attendance

# 2. Claude generates implementation
# In Claude Code terminal:
# "Generate the attendance check-in endpoint following patterns in
#  src/modules/jobs/services/jobs.service.ts. Include geo-fence
#  validation using PostGIS ST_DWithin. Follow CLAUDE.md RULE-001."

# 3. Review generated code
git diff                    # Review all changes
git diff src/modules/auth/  # Review specific module

# 4. Auto-format and lint
npm run lint:fix            # ESLint auto-fix
npm run format              # Prettier format
npm run type-check          # TypeScript validation

# 5. Stage reviewed changes (NEVER git add . after AI generation)
git add src/modules/attendance/services/attendance.service.ts
git add src/modules/attendance/dto/check-in.dto.ts
git add src/modules/attendance/attendance.module.ts
# Review what you're about to commit:
git diff --staged

# 6. Claude suggests commit message
# Paste git diff --staged into Claude:
# "Generate a conventional commit message for this diff"
# Review + use the suggestion:
git commit -m "feat(attendance): add PostGIS geo-fence validation for GPS check-in

Workers must be within site.radius_meters of site center.
Returns geoFenceValid flag (not blocking) for contractor visibility.
Uses ST_DWithin for efficient spatial index lookup.

Closes: DLC-123

Co-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>"

# 7. Push + open PR
git push origin feature/DLC-123-worker-geo-attendance
gh pr create --title "feat(attendance): GPS geo-fence validation" \
             --body "$(claude-pr-description)"  # Claude generates body
```

### Automated PR Description Generation

```bash
# scripts/generate-pr-description.sh
# Run this after pushing a feature branch to get a Claude-generated PR description

#!/bin/bash

BRANCH=$(git branch --show-current)
BASE_BRANCH=${1:-develop}

# Get the diff summary
DIFF_STAT=$(git diff $BASE_BRANCH..HEAD --stat)
CHANGED_FILES=$(git diff $BASE_BRANCH..HEAD --name-only)
COMMITS=$(git log $BASE_BRANCH..HEAD --oneline)

# Generate PR description via Claude API
# (requires ANTHROPIC_API_KEY in environment)
cat << EOF | claude --print
Generate a GitHub PR description for these changes.
Follow the template in .github/PULL_REQUEST_TEMPLATE.md

Branch: $BRANCH
Commits:
$COMMITS

Changed files:
$CHANGED_FILES

Diff stats:
$DIFF_STAT

Generate a professional PR description. Be specific about what changed and why.
Include testing instructions that reference the actual endpoints/components changed.
EOF
```

### Commit Message Generation Script

```bash
# scripts/generate-commit-message.sh
# Usage: npm run commit:suggest

#!/bin/bash

# Get staged diff
STAGED_DIFF=$(git diff --staged)

if [ -z "$STAGED_DIFF" ]; then
  echo "No staged changes. Run 'git add' first."
  exit 1
fi

echo "Generating commit message from staged diff..."
echo ""

# Send to Claude for commit message suggestion
cat << EOF | claude --print
Generate a conventional commit message for this staged git diff.

Rules:
- Format: <type>(<scope>): <short description>
- Types: feat, fix, refactor, perf, test, docs, style, chore, ci, build, revert
- Scope: the NestJS module, Next.js feature, or Flutter feature being changed
- Description: present tense, lowercase, max 72 chars, no period
- Add body if the WHY is not obvious from the WHAT
- Add "Closes: DLC-XXX" if a ticket ID is detectable from branch name

Current branch: $(git branch --show-current)

Diff:
$STAGED_DIFF

Provide 3 options ranked by accuracy. Mark the best one.
EOF
```

---

## 7. Git Hooks

### Husky Setup

```bash
# Install Husky + lint-staged
npm install -D husky lint-staged
npx husky install

# Add to package.json (root)
{
  "scripts": {
    "prepare": "husky install",
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,json,md,yml}\"",
    "format:check": "prettier --check \"**/*.{ts,tsx,json,md,yml}\"",
    "type-check": "tsc --noEmit",
    "test:quick": "jest --testPathPattern='.*service.spec.ts' --passWithNoTests"
  },
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

### Pre-Commit Hook

```bash
# .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

echo "🔍 Running pre-commit checks..."

# ── 1. Secret scanning ──────────────────────────────────────────────
echo "  Scanning for secrets..."
if command -v gitleaks &> /dev/null; then
  gitleaks protect --staged --config=.gitleaks.toml
  if [ $? -ne 0 ]; then
    echo "❌ SECRET DETECTED in staged files!"
    echo "   Remove the secret and use environment variables instead."
    echo "   See: docs/runbooks/secret-management.md"
    exit 1
  fi
else
  echo "  ⚠️  gitleaks not installed. Install: brew install gitleaks"
fi

# ── 2. Lint + format staged files ──────────────────────────────────
echo "  Running lint-staged..."
npx lint-staged
if [ $? -ne 0 ]; then
  echo "❌ Lint/format checks failed!"
  echo "   Run 'npm run lint:fix' to auto-fix linting issues."
  echo "   Run 'npm run format' to auto-fix formatting issues."
  exit 1
fi

# ── 3. TypeScript type check (backend + frontend only) ─────────────
STAGED_TS=$(git diff --cached --name-only | grep -E '\.(ts|tsx)$')
if [ -n "$STAGED_TS" ]; then
  echo "  Running TypeScript type check..."

  # Check which project has changed files
  if echo "$STAGED_TS" | grep -q "^backend/"; then
    (cd backend && npx tsc --noEmit)
    if [ $? -ne 0 ]; then
      echo "❌ Backend TypeScript errors found!"
      exit 1
    fi
  fi

  if echo "$STAGED_TS" | grep -q "^frontend/"; then
    (cd frontend && npx tsc --noEmit)
    if [ $? -ne 0 ]; then
      echo "❌ Frontend TypeScript errors found!"
      exit 1
    fi
  fi
fi

# ── 4. Dart/Flutter analysis ────────────────────────────────────────
STAGED_DART=$(git diff --cached --name-only | grep -E '\.dart$')
if [ -n "$STAGED_DART" ]; then
  echo "  Running Flutter analyze..."
  (cd mobile && flutter analyze --no-pub)
  if [ $? -ne 0 ]; then
    echo "❌ Flutter analysis failed!"
    exit 1
  fi
fi

# ── 5. Quick unit test on affected service files ────────────────────
STAGED_SERVICES=$(git diff --cached --name-only | grep -E '\.service\.ts$')
if [ -n "$STAGED_SERVICES" ]; then
  echo "  Running quick unit tests for changed services..."
  (cd backend && npx jest --testPathPattern='\.service\.spec\.ts$' \
    --passWithNoTests --silent)
  if [ $? -ne 0 ]; then
    echo "❌ Unit tests failed for changed service files!"
    echo "   Fix the tests before committing."
    exit 1
  fi
fi

echo "✅ All pre-commit checks passed!"
```

### Commit Message Hook

```bash
# .husky/commit-msg
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat "$COMMIT_MSG_FILE")

echo "📝 Validating commit message..."

# Conventional commit pattern
PATTERN="^(feat|fix|refactor|perf|test|docs|style|chore|ci|build|revert)(\([a-z-]+\))?: .{1,72}$"

# Check first line of commit message
FIRST_LINE=$(head -n 1 "$COMMIT_MSG_FILE")

if ! echo "$FIRST_LINE" | grep -qE "$PATTERN"; then
  echo ""
  echo "❌ Invalid commit message format!"
  echo ""
  echo "   Expected: <type>(<scope>): <description>"
  echo "   Received: $FIRST_LINE"
  echo ""
  echo "   Valid types: feat fix refactor perf test docs style chore ci build revert"
  echo "   Example: feat(auth): add OTP rate limiting with Redis"
  echo ""
  echo "   See Git-Workflow.md §4 for full commit standards."
  exit 1
fi

# Check for WIP in commit message (allow in body, not subject)
if echo "$FIRST_LINE" | grep -qi "wip"; then
  echo "⚠️  WIP detected in commit message subject."
  echo "   Use a draft PR instead of WIP commits."
  echo "   To bypass: git commit --no-verify (use sparingly)"
fi

echo "✅ Commit message format valid!"
```

### Pre-Push Hook

```bash
# .husky/pre-push
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

CURRENT_BRANCH=$(git branch --show-current)
REMOTE=$1
REMOTE_URL=$2

echo "🚀 Running pre-push checks for branch: $CURRENT_BRANCH"

# ── 1. Prevent direct push to protected branches ────────────────────
if [ "$CURRENT_BRANCH" = "main" ] || [ "$CURRENT_BRANCH" = "develop" ]; then
  echo ""
  echo "❌ DIRECT PUSH TO $CURRENT_BRANCH IS NOT ALLOWED!"
  echo ""
  echo "   Protected branches require Pull Requests."
  echo "   See Git-Workflow.md §3 for the branching strategy."
  echo ""
  echo "   If this is an emergency hotfix, use:"
  echo "   git checkout -b hotfix/DLC-P1-description main"
  exit 1
fi

# ── 2. Run full test suite before push ──────────────────────────────
CHANGED_FILES=$(git diff origin/$CURRENT_BRANCH..HEAD --name-only 2>/dev/null || \
                git diff HEAD~1..HEAD --name-only)

if echo "$CHANGED_FILES" | grep -q "^backend/"; then
  echo "  Running backend tests..."
  (cd backend && npm run test -- --passWithNoTests)
  if [ $? -ne 0 ]; then
    echo "❌ Backend tests failed! Fix before pushing."
    exit 1
  fi
fi

if echo "$CHANGED_FILES" | grep -q "^mobile/"; then
  echo "  Running Flutter tests..."
  (cd mobile && flutter test)
  if [ $? -ne 0 ]; then
    echo "❌ Flutter tests failed! Fix before pushing."
    exit 1
  fi
fi

echo "✅ Pre-push checks passed! Pushing to $REMOTE..."
```

### Gitleaks Configuration

```toml
# .gitleaks.toml
title = "Digital Labour Chowk — Secret Detection Rules"

[extend]
useDefault = true          # Use gitleaks default rules as base

[[rules]]
id = "dlc-jwt-secret"
description = "DLC JWT Secret Key"
regex = '''JWT_SECRET\s*=\s*['""]?[a-zA-Z0-9+/=]{20,}'''
tags = ["secret", "jwt"]

[[rules]]
id = "dlc-db-password"
description = "Database password in code"
regex = '''DB_PASSWORD\s*=\s*['""]?.{8,}'''
tags = ["secret", "database"]

[[rules]]
id = "razorpay-key"
description = "Razorpay API key"
regex = '''rzp_(live|test)_[a-zA-Z0-9]{14,}'''
tags = ["secret", "payment"]

[[rules]]
id = "msg91-api-key"
description = "MSG91 API Key"
regex = '''['""]?[A-Z0-9]{24,}['""]?\s*#\s*msg91'''
tags = ["secret", "sms"]

[[allowlist]]
description = "Allow .env.example and test fixtures"
paths = [
  '''.env\.example$''',
  '''test/fixtures/''',
  '''__mocks__/'''
]

[[allowlist]]
description = "Allow test/mock values"
regexes = [
  '''test-secret''',
  '''mock-api-key''',
  '''dev-only-not-real'''
]
```

---

## 8. CI/CD Pipeline Architecture

### Full Pipeline Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    COMPLETE CI/CD PIPELINE                               │
│                                                                           │
│  TRIGGER: Push to feature/* or PR opened/updated                        │
│                                                                           │
│  ┌─────────┐   ┌──────────┐   ┌──────────┐   ┌──────────┐             │
│  │  Lint   │──►│  Build   │──►│  Tests   │──►│ Security │             │
│  │ & Types │   │ (all 3)  │   │ Unit+Int │   │  Scans   │             │
│  └─────────┘   └──────────┘   └──────────┘   └──────────┘             │
│       │               │              │              │                    │
│       └───────────────┴──────────────┴──────────────┘                  │
│                               │ ALL PASS                                │
│                               ▼                                          │
│                    ┌──────────────────────┐                             │
│                    │  Docker Image Build  │                             │
│                    │  + Push to ECR       │                             │
│                    └──────────────────────┘                             │
│                               │                                          │
│  TRIGGER: Merge to develop ───┼────────────────────────────────────    │
│                               ▼                                          │
│                    ┌──────────────────────┐                             │
│                    │  Staging Deploy      │                             │
│                    │  DB Migrations       │                             │
│                    │  Smoke Tests         │                             │
│                    └──────────────────────┘                             │
│                               │                                          │
│  TRIGGER: Manual dispatch ────┼────────────────────────────────────    │
│           + 2 approvals       ▼                                          │
│                    ┌──────────────────────┐                             │
│                    │  Production Deploy   │                             │
│                    │  Canary (10%) → Full │                             │
│                    │  Post-deploy verify  │                             │
│                    └──────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────┘
```

### Pipeline Stage Definitions

```
Stage 1: INSTALL DEPENDENCIES
  Backend:  npm ci (uses package-lock.json for exact versions)
  Frontend: npm ci
  Mobile:   flutter pub get
  Cache:    node_modules cached by package-lock.json hash
  Duration: ~60s (cache hit), ~180s (cache miss)

Stage 2: LINT & TYPE CHECK
  Backend:  eslint src/ --ext .ts + tsc --noEmit
  Frontend: eslint src/ --ext .ts,.tsx + tsc --noEmit
  Mobile:   flutter analyze
  Fail:     Any lint error or type error fails the pipeline
  Duration: ~30–60s

Stage 3: UNIT TESTS
  Backend:  jest --coverage --coverageThreshold='{"global":{"lines":80}}'
  Frontend: jest --coverage
  Mobile:   flutter test
  Reports:  Coverage uploaded to Codecov
  Duration: ~60–120s

Stage 4: INTEGRATION TESTS
  Backend:  jest --config jest.integration.config.ts
            (uses Docker service containers: postgres, redis)
  Frontend: (skipped — integration tested via E2E)
  Mobile:   (skipped in CI — requires device)
  Duration: ~120–180s

Stage 5: BUILD
  Backend:  npm run build (tsc compiles to /dist)
  Frontend: npm run build (Next.js SSG/SSR build)
  Mobile:   flutter build apk --release (on PRs to develop)
  Duration: ~60–180s

Stage 6: DOCKER IMAGE BUILD
  Trigger:  Only on merge to develop or main (not on feature PRs)
  Backend:  docker build -t backend:$SHA ./backend
  Frontend: docker build -t frontend:$SHA ./frontend
  Multi-platform: linux/amd64,linux/arm64 (for Graviton)
  Duration: ~120–300s (layer cache usually kicks in)

Stage 7: SECURITY SCANNING
  SAST:     Semgrep (code vulnerability patterns)
  SCA:      npm audit + Snyk (dependency vulnerabilities)
  Container:Trivy (Docker image CVE scan)
  Secrets:  Gitleaks (final check on full repo)
  Policy:   CRITICAL → fail build | HIGH → warn + create advisory | MEDIUM → log
  Duration: ~60–120s

Stage 8: DEPLOYMENT
  Staging:  Auto on merge to develop
  Production: Manual dispatch + 2-person approval
  Method:   kubectl apply (K8s) or aws ecs update-service (ECS)
  Duration: ~5–10 minutes (including health check stabilization)
```

---

## 9. GitHub Actions Workflows

### backend-ci.yml

```yaml
# .github/workflows/backend-ci.yml
name: Backend CI

on:
  push:
    branches: [develop, main]
    paths:
      - 'backend/**'
      - '.github/workflows/backend-ci.yml'
  pull_request:
    branches: [develop, main]
    paths:
      - 'backend/**'

env:
  NODE_VERSION: '20'
  WORKING_DIR: ./backend

jobs:
  # ── Job 1: Lint & Type Check ────────────────────────────────────────
  lint:
    name: Lint & Type Check
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.WORKING_DIR }}
        run: npm ci

      - name: Run ESLint
        working-directory: ${{ env.WORKING_DIR }}
        run: npm run lint

      - name: Run TypeScript type check
        working-directory: ${{ env.WORKING_DIR }}
        run: npx tsc --noEmit

  # ── Job 2: Unit Tests ───────────────────────────────────────────────
  unit-tests:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.WORKING_DIR }}
        run: npm ci

      - name: Run unit tests with coverage
        working-directory: ${{ env.WORKING_DIR }}
        run: |
          npm run test:cov -- \
            --coverageThreshold='{"global":{"lines":80,"functions":75,"branches":70}}' \
            --forceExit

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v4
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          directory: backend/coverage
          flags: backend
          fail_ci_if_error: false

  # ── Job 3: Integration Tests ────────────────────────────────────────
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    needs: lint
    services:
      postgres:
        image: postgis/postgis:16-3.4-alpine
        env:
          POSTGRES_DB: dlc_test
          POSTGRES_USER: test_user
          POSTGRES_PASSWORD: test_password
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

      redis:
        image: redis:7-alpine
        ports:
          - 6379:6379
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.WORKING_DIR }}
        run: npm ci

      - name: Run database migrations
        working-directory: ${{ env.WORKING_DIR }}
        env:
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USER: test_user
          DB_PASSWORD: test_password
          DB_NAME: dlc_test
        run: npm run migration:run

      - name: Run integration tests
        working-directory: ${{ env.WORKING_DIR }}
        env:
          NODE_ENV: test
          DB_HOST: localhost
          DB_PORT: 5432
          DB_USER: test_user
          DB_PASSWORD: test_password
          DB_NAME: dlc_test
          REDIS_URL: redis://localhost:6379
          JWT_SECRET: test-secret-not-for-production
        run: npm run test:integration -- --forceExit

  # ── Job 4: Build ────────────────────────────────────────────────────
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [unit-tests, integration-tests]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: backend/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.WORKING_DIR }}
        run: npm ci

      - name: Build NestJS application
        working-directory: ${{ env.WORKING_DIR }}
        run: npm run build

      - name: Upload build artifact
        uses: actions/upload-artifact@v4
        with:
          name: backend-dist
          path: backend/dist
          retention-days: 1

  # ── Job 5: Docker Build & Security Scan ────────────────────────────
  docker-build:
    name: Docker Build & Scan
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'push' || github.base_ref == 'develop'
    permissions:
      contents: read
      security-events: write
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ap-south-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ steps.login-ecr.outputs.registry }}/dlc/backend
          tags: |
            type=sha,prefix=sha-
            type=ref,event=branch
            type=semver,pattern={{version}}

      - name: Build Docker image (multi-platform)
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          platforms: linux/amd64,linux/arm64
          push: false
          load: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Run Trivy vulnerability scan
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ steps.login-ecr.outputs.registry }}/dlc/backend:sha-${{ github.sha }}
          format: 'sarif'
          output: 'trivy-results.sarif'
          severity: 'CRITICAL,HIGH'
          exit-code: '1'

      - name: Upload Trivy results to GitHub Security
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: 'trivy-results.sarif'

      - name: Push image to ECR (develop/main only)
        if: github.event_name == 'push'
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          platforms: linux/amd64,linux/arm64
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Output image digest
        run: echo "Image digest: ${{ steps.docker-build.outputs.digest }}"
```

### frontend-ci.yml

```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI

on:
  push:
    branches: [develop, main]
    paths:
      - 'frontend/**'
      - '.github/workflows/frontend-ci.yml'
  pull_request:
    branches: [develop, main]
    paths:
      - 'frontend/**'

env:
  NODE_VERSION: '20'
  WORKING_DIR: ./frontend

jobs:
  lint:
    name: Lint, Types & Format Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.WORKING_DIR }}
        run: npm ci

      - name: ESLint check
        working-directory: ${{ env.WORKING_DIR }}
        run: npm run lint

      - name: TypeScript type check
        working-directory: ${{ env.WORKING_DIR }}
        run: npx tsc --noEmit

      - name: Prettier format check
        working-directory: ${{ env.WORKING_DIR }}
        run: npm run format:check

  test:
    name: Unit Tests
    runs-on: ubuntu-latest
    needs: lint
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.WORKING_DIR }}
        run: npm ci

      - name: Run Jest tests
        working-directory: ${{ env.WORKING_DIR }}
        run: npm run test -- --ci --coverage

  e2e-tests:
    name: Playwright E2E Tests
    runs-on: ubuntu-latest
    needs: lint
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.WORKING_DIR }}
        run: npm ci

      - name: Install Playwright browsers
        working-directory: ${{ env.WORKING_DIR }}
        run: npx playwright install chromium --with-deps

      - name: Run Playwright tests
        working-directory: ${{ env.WORKING_DIR }}
        env:
          PLAYWRIGHT_BASE_URL: http://localhost:3001
          NEXT_PUBLIC_API_URL: ${{ secrets.STAGING_API_URL }}
        run: npx playwright test

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: playwright-report
          path: frontend/playwright-report/
          retention-days: 7

  build:
    name: Next.js Build
    runs-on: ubuntu-latest
    needs: [test]
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: ${{ env.WORKING_DIR }}
        run: npm ci

      - name: Build Next.js application
        working-directory: ${{ env.WORKING_DIR }}
        env:
          NEXT_PUBLIC_API_URL: ${{ secrets.STAGING_API_URL }}
          NEXT_PUBLIC_MAPBOX_TOKEN: ${{ secrets.MAPBOX_TOKEN_PUBLIC }}
        run: npm run build

      - name: Run Lighthouse CI
        uses: treosh/lighthouse-ci-action@v11
        with:
          configPath: ./frontend/.lighthouserc.json
          uploadArtifacts: true
          temporaryPublicStorage: true

  docker-build:
    name: Docker Build & Scan
    runs-on: ubuntu-latest
    needs: build
    if: github.event_name == 'push'
    steps:
      - uses: actions/checkout@v4

      - uses: docker/setup-buildx-action@v3

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ap-south-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push frontend image
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          platforms: linux/amd64,linux/arm64
          push: true
          tags: |
            ${{ steps.login-ecr.outputs.registry }}/dlc/frontend:sha-${{ github.sha }}
            ${{ steps.login-ecr.outputs.registry }}/dlc/frontend:${{ github.ref_name }}
          build-args: |
            NEXT_PUBLIC_API_URL=${{ secrets.STAGING_API_URL }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Scan image with Trivy
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ steps.login-ecr.outputs.registry }}/dlc/frontend:sha-${{ github.sha }}
          severity: 'CRITICAL'
          exit-code: '1'
```

### deploy.yml

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  # Auto-deploy to staging on merge to develop
  push:
    branches: [develop]

  # Manual production deploy
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deploy target'
        required: true
        type: choice
        options: [staging, production]
      image_tag:
        description: 'Docker image tag to deploy (default: latest develop)'
        required: false
        type: string
      skip_smoke_tests:
        description: 'Skip smoke tests (emergency only)'
        required: false
        type: boolean
        default: false

env:
  AWS_REGION: ap-south-1
  EKS_CLUSTER_STAGING: dlc-staging
  EKS_CLUSTER_PRODUCTION: dlc-production
  ECR_REGISTRY: ${{ secrets.AWS_ACCOUNT_ID }}.dkr.ecr.ap-south-1.amazonaws.com

jobs:
  # ── Determine deployment parameters ─────────────────────────────────
  prepare:
    name: Prepare Deployment
    runs-on: ubuntu-latest
    outputs:
      environment: ${{ steps.params.outputs.environment }}
      image_tag: ${{ steps.params.outputs.image_tag }}
      cluster: ${{ steps.params.outputs.cluster }}
    steps:
      - name: Set deployment parameters
        id: params
        run: |
          if [ "${{ github.event_name }}" = "push" ]; then
            echo "environment=staging" >> $GITHUB_OUTPUT
            echo "image_tag=sha-${{ github.sha }}" >> $GITHUB_OUTPUT
            echo "cluster=${{ env.EKS_CLUSTER_STAGING }}" >> $GITHUB_OUTPUT
          else
            ENV="${{ inputs.environment }}"
            TAG="${{ inputs.image_tag }}"
            echo "environment=${ENV}" >> $GITHUB_OUTPUT
            echo "image_tag=${TAG:-sha-${{ github.sha }}}" >> $GITHUB_OUTPUT
            if [ "$ENV" = "production" ]; then
              echo "cluster=${{ env.EKS_CLUSTER_PRODUCTION }}" >> $GITHUB_OUTPUT
            else
              echo "cluster=${{ env.EKS_CLUSTER_STAGING }}" >> $GITHUB_OUTPUT
            fi
          fi

  # ── Production approval gate ─────────────────────────────────────────
  approve-production:
    name: Production Approval
    runs-on: ubuntu-latest
    needs: prepare
    if: needs.prepare.outputs.environment == 'production'
    environment:
      name: production
      # GitHub Environment requires 2 approvals (configured in repo settings)
    steps:
      - name: Confirm production deployment
        run: |
          echo "✅ Production deployment approved"
          echo "   Environment: production"
          echo "   Image tag: ${{ needs.prepare.outputs.image_tag }}"
          echo "   Cluster: ${{ needs.prepare.outputs.cluster }}"

  # ── Database migrations ──────────────────────────────────────────────
  run-migrations:
    name: Run Database Migrations
    runs-on: ubuntu-latest
    needs: [prepare, approve-production]
    if: always() && !failure() && !cancelled()
    environment: ${{ needs.prepare.outputs.environment }}
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig \
            --name ${{ needs.prepare.outputs.cluster }} \
            --region ${{ env.AWS_REGION }}

      - name: Run database migrations (one-off K8s job)
        run: |
          # Create a one-off migration job using the new image
          cat <<EOF | kubectl apply -f -
          apiVersion: batch/v1
          kind: Job
          metadata:
            name: db-migrate-${{ github.sha }}
            namespace: dlc-${{ needs.prepare.outputs.environment }}
          spec:
            ttlSecondsAfterFinished: 3600
            template:
              spec:
                restartPolicy: Never
                containers:
                - name: migration
                  image: ${{ env.ECR_REGISTRY }}/dlc/backend:${{ needs.prepare.outputs.image_tag }}
                  command: ["node", "dist/migrations/run-migrations.js"]
                  envFrom:
                  - secretRef:
                      name: dlc-secrets
          EOF

          # Wait for migration job to complete
          kubectl wait job/db-migrate-${{ github.sha }} \
            --for=condition=complete \
            --timeout=300s \
            --namespace=dlc-${{ needs.prepare.outputs.environment }}

      - name: Check migration logs
        run: |
          POD=$(kubectl get pods -n dlc-${{ needs.prepare.outputs.environment }} \
            -l job-name=db-migrate-${{ github.sha }} -o name | head -1)
          kubectl logs $POD -n dlc-${{ needs.prepare.outputs.environment }}

  # ── Deploy backend ───────────────────────────────────────────────────
  deploy-backend:
    name: Deploy Backend
    runs-on: ubuntu-latest
    needs: [prepare, run-migrations]
    environment: ${{ needs.prepare.outputs.environment }}
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig \
            --name ${{ needs.prepare.outputs.cluster }} \
            --region ${{ env.AWS_REGION }}

      - name: Deploy backend to Kubernetes
        run: |
          # Update the image tag in the deployment
          kubectl set image deployment/backend \
            backend=${{ env.ECR_REGISTRY }}/dlc/backend:${{ needs.prepare.outputs.image_tag }} \
            --namespace=dlc-${{ needs.prepare.outputs.environment }}

          # Record the deployment for rollback capability
          kubectl annotate deployment/backend \
            kubernetes.io/change-cause="Deploy ${{ needs.prepare.outputs.image_tag }} by ${{ github.actor }}" \
            --namespace=dlc-${{ needs.prepare.outputs.environment }}

          # Wait for rolling update to complete
          kubectl rollout status deployment/backend \
            --namespace=dlc-${{ needs.prepare.outputs.environment }} \
            --timeout=300s

  # ── Deploy frontend ──────────────────────────────────────────────────
  deploy-frontend:
    name: Deploy Frontend
    runs-on: ubuntu-latest
    needs: [prepare, run-migrations]
    environment: ${{ needs.prepare.outputs.environment }}
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig \
            --name ${{ needs.prepare.outputs.cluster }} \
            --region ${{ env.AWS_REGION }}

      - name: Deploy frontend to Kubernetes
        run: |
          kubectl set image deployment/frontend \
            frontend=${{ env.ECR_REGISTRY }}/dlc/frontend:${{ needs.prepare.outputs.image_tag }} \
            --namespace=dlc-${{ needs.prepare.outputs.environment }}

          kubectl rollout status deployment/frontend \
            --namespace=dlc-${{ needs.prepare.outputs.environment }} \
            --timeout=300s

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"

  # ── Smoke tests ──────────────────────────────────────────────────────
  smoke-tests:
    name: Smoke Tests
    runs-on: ubuntu-latest
    needs: [prepare, deploy-backend, deploy-frontend]
    if: ${{ !inputs.skip_smoke_tests }}
    steps:
      - uses: actions/checkout@v4

      - name: Run API smoke tests (Newman)
        run: |
          npm install -g newman
          newman run docs/postman/DLC-Smoke-Tests.postman_collection.json \
            --environment docs/postman/env/${{ needs.prepare.outputs.environment }}.json \
            --reporters cli,junit \
            --reporter-junit-export results/smoke-tests.xml

      - name: Check health endpoints
        run: |
          ENV=${{ needs.prepare.outputs.environment }}
          if [ "$ENV" = "production" ]; then
            BASE_URL="https://api.digitallabourcho wk.com"
          else
            BASE_URL="${{ secrets.STAGING_API_URL }}"
          fi

          # Check backend health
          HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/health)
          if [ "$HTTP_STATUS" != "200" ]; then
            echo "❌ Backend health check failed: HTTP $HTTP_STATUS"
            exit 1
          fi

          # Check readiness
          HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/health/ready)
          if [ "$HTTP_STATUS" != "200" ]; then
            echo "❌ Backend readiness check failed: HTTP $HTTP_STATUS"
            exit 1
          fi

          echo "✅ All health checks passed"

  # ── Auto-rollback on failure ─────────────────────────────────────────
  rollback-on-failure:
    name: Auto Rollback
    runs-on: ubuntu-latest
    needs: [prepare, deploy-backend, deploy-frontend, smoke-tests]
    if: failure()
    steps:
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_DEPLOY_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Update kubeconfig
        run: |
          aws eks update-kubeconfig \
            --name ${{ needs.prepare.outputs.cluster }} \
            --region ${{ env.AWS_REGION }}

      - name: Rollback to previous deployment
        run: |
          NAMESPACE=dlc-${{ needs.prepare.outputs.environment }}
          kubectl rollout undo deployment/backend --namespace=$NAMESPACE
          kubectl rollout undo deployment/frontend --namespace=$NAMESPACE
          echo "⏪ Rolled back backend and frontend to previous version"

      - name: Notify rollback via Slack
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              "text": "🚨 *DEPLOYMENT FAILED & ROLLED BACK*",
              "attachments": [{
                "color": "danger",
                "fields": [
                  { "title": "Environment", "value": "${{ needs.prepare.outputs.environment }}", "short": true },
                  { "title": "Image Tag", "value": "${{ needs.prepare.outputs.image_tag }}", "short": true },
                  { "title": "Triggered by", "value": "${{ github.actor }}", "short": true },
                  { "title": "Action URL", "value": "${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}", "short": false }
                ]
              }]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_DEPLOYMENTS }}

  # ── Notify success ───────────────────────────────────────────────────
  notify-success:
    name: Notify Deployment Success
    runs-on: ubuntu-latest
    needs: [prepare, smoke-tests]
    if: success()
    steps:
      - name: Send success notification
        uses: 8398a7/action-slack@v3
        with:
          status: custom
          custom_payload: |
            {
              "text": "✅ *Deployment Successful*",
              "attachments": [{
                "color": "good",
                "fields": [
                  { "title": "Environment", "value": "${{ needs.prepare.outputs.environment }}", "short": true },
                  { "title": "Image Tag", "value": "${{ needs.prepare.outputs.image_tag }}", "short": true },
                  { "title": "Deployed by", "value": "${{ github.actor }}", "short": true },
                  { "title": "Duration", "value": "${{ job.duration }}s", "short": true }
                ]
              }]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_DEPLOYMENTS }}
```

---

## 10. Docker Workflow

### Local Development (docker-compose)

```yaml
# docker-compose.yml — Base services
version: '3.9'

services:
  postgres:
    image: postgis/postgis:16-3.4-alpine
    container_name: dlc-postgres
    environment:
      POSTGRES_DB: dlc_dev
      POSTGRES_USER: dlc_user
      POSTGRES_PASSWORD: dlc_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./scripts/init-db.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U dlc_user -d dlc_dev"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - dlc-network

  redis:
    image: redis:7-alpine
    container_name: dlc-redis
    command: redis-server --appendonly yes --requirepass dlc_redis_password
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "-a", "dlc_redis_password", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - dlc-network

  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:8.13.0
    container_name: dlc-elasticsearch
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"
    networks:
      - dlc-network

  backend:
    build:
      context: ./backend
      target: development          # Uses dev stage with devDependencies
    container_name: dlc-backend
    environment:
      NODE_ENV: development
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: dlc_user
      DB_PASSWORD: dlc_password
      DB_NAME: dlc_dev
      REDIS_URL: redis://:dlc_redis_password@redis:6379
      ELASTICSEARCH_URL: http://elasticsearch:9200
    volumes:
      - ./backend/src:/app/src    # Hot reload: mount source
      - /app/node_modules          # Don't override container's node_modules
    ports:
      - "3000:3000"
      - "9229:9229"               # Node.js debug port
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    networks:
      - dlc-network
    command: npm run start:debug

  frontend:
    build:
      context: ./frontend
      target: development
    container_name: dlc-frontend
    environment:
      NEXT_PUBLIC_API_URL: http://localhost:3000
    volumes:
      - ./frontend/src:/app/src
      - /app/node_modules
      - /app/.next
    ports:
      - "3001:3001"
    depends_on:
      - backend
    networks:
      - dlc-network
    command: npm run dev

  bull-board:
    image: node:20-alpine
    container_name: dlc-bull-board
    # Lightweight Bull Board UI for queue inspection in development
    # Accessed at http://localhost:3002/admin/queues
    depends_on:
      - redis
    networks:
      - dlc-network

volumes:
  postgres_data:
  redis_data:
  elasticsearch_data:

networks:
  dlc-network:
    driver: bridge
```

### Multi-Stage Dockerfile — Backend

```dockerfile
# backend/Dockerfile

# ── Stage 1: Dependencies ──────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
# Copy only package files for better layer caching
COPY package*.json ./
# Install all dependencies (dev + prod) for build stage
RUN npm ci

# ── Stage 2: Builder ──────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy source code
COPY . .
# Build TypeScript to JavaScript
RUN npm run build
# Remove development dependencies
RUN npm prune --production

# ── Stage 3: Development (hot reload) ─────────────────────────────────
FROM node:20-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3000 9229
CMD ["npm", "run", "start:debug"]

# ── Stage 4: Production ───────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Security: create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs

# Copy only what's needed for production
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/package.json ./

# Switch to non-root user
USER nestjs

EXPOSE 3000

# Healthcheck
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3000/health || exit 1

# Use exec form to handle signals correctly
CMD ["node", "dist/main.js"]
```

### Multi-Stage Dockerfile — Frontend

```dockerfile
# frontend/Dockerfile

# ── Stage 1: Dependencies ──────────────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ── Stage 2: Builder ──────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build arguments for environment-specific builds
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_MAPBOX_TOKEN
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_MAPBOX_TOKEN=$NEXT_PUBLIC_MAPBOX_TOKEN

# Enable Next.js standalone output for minimal container
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# ── Stage 3: Development ─────────────────────────────────────────────
FROM node:20-alpine AS development
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 3001
CMD ["npm", "run", "dev"]

# ── Stage 4: Production ──────────────────────────────────────────────
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output (minimal — no node_modules copy needed)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:3001/api/health || exit 1

CMD ["node", "server.js"]
```

### Environment Variable Strategy

```
Environment    │  Secret Source              │  Injection Method
───────────────┼─────────────────────────────┼──────────────────────────
local          │  .env (gitignored)           │  docker-compose env_file
dev/CI         │  GitHub Actions Secrets      │  Passed as --build-arg / env
staging        │  AWS Secrets Manager         │  K8s ExternalSecret + envFrom
production     │  AWS Secrets Manager         │  K8s ExternalSecret + envFrom

Rules:
  ✦ .env files: ONLY for local development. Always in .gitignore.
  ✦ .env.example: committed with ALL variable names, NO values
  ✦ GitHub Secrets: used in CI/CD pipelines. Rotated every 90 days.
  ✦ AWS Secrets Manager: source of truth for deployed environments
  ✦ Never pass secrets as Docker build args (they appear in image history)
  ✦ Runtime injection only: secrets go in K8s Secrets (ExternalSecrets operator)
```

---

## 11. Deployment Workflow

### Environment Promotion Flow

```
Developer Machine
    │ git push feature/DLC-123
    ▼
GitHub CI (lint + test + build + scan)
    │ CI passes
    ▼
Code Review + Approval
    │ PR merged to develop
    ▼
Staging Auto-Deploy
    │ Smoke tests pass
    ▼
QA Sign-off (manual)
    │ release/* branch created
    ▼
Production Manual Deploy
    │ 2 approvers + CI green
    ▼
Production Live
    │ Post-deploy monitoring (15 min)
    ▼
Release Tagged (v1.x.x)
```

### Staging Deployment

```bash
# Auto-triggered on merge to develop
# No human action required after PR merge

Sequence:
  1. GitHub Actions detect push to develop
  2. Run full CI pipeline (must pass)
  3. Build Docker images → push to ECR with sha-{commit} tag
  4. kubectl set image deployment/backend backend=ECR/dlc/backend:sha-{commit}
  5. kubectl rollout status → wait for stable
  6. Run DB migrations (K8s one-off job)
  7. Run smoke tests (Newman API collection, 15 critical endpoints)
  8. CloudFront invalidation for frontend CDN
  9. Slack notification: "✅ Staging updated: sha-abc1234 by @engineer"

Rollback staging:
  kubectl rollout undo deployment/backend -n dlc-staging
  kubectl rollout undo deployment/frontend -n dlc-staging
  (Takes ~60 seconds to rollback)
```

### Production Deployment

```bash
# Triggered manually via GitHub Actions workflow_dispatch
# Requires 2 approvals in GitHub Environment "production"

Pre-deployment checklist (done by release manager):
  [ ] QA sign-off email received
  [ ] Staging smoke tests passing (last 30 minutes)
  [ ] No active P1/P2 incidents on status page
  [ ] Change freeze check (no deploys on salary disbursement day: 1st and 15th)
  [ ] Rollback plan reviewed with on-call engineer
  [ ] Database migration reviewed (backward-compatible confirmed)
  [ ] Notify #engineering-deploys 30 min before deploy

Deployment steps (all automated after approval):
  1. Pre-deploy: take DB snapshot (automated before migration)
  2. Run migrations (K8s job, validated against pre-deploy snapshot)
  3. Canary deploy: route 10% traffic to new version
  4. Monitor 5 minutes (error rate, latency p95, 5xx rate)
  5. If healthy: progress to 50% → 100% rolling deploy
  6. Post-deploy monitoring: 15 minutes of metric observation
  7. Tag git commit: git tag v1.2.0 && git push --tags
  8. Generate CHANGELOG.md update (automated from conventional commits)
  9. Notify #engineering-deploys: "✅ Production v1.2.0 deployed"
```

### Blue-Green Deployment

```yaml
# kubernetes/base/backend-service.yaml
# Blue-Green via Kubernetes Service selector switching

apiVersion: v1
kind: Service
metadata:
  name: backend
  namespace: dlc-production
spec:
  selector:
    app: backend
    version: blue           # ← Switch to "green" to cut traffic
  ports:
    - port: 3000
      targetPort: 3000

---
# Blue deployment (currently serving traffic)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-blue
  namespace: dlc-production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: backend
      version: blue
  template:
    metadata:
      labels:
        app: backend
        version: blue
    spec:
      containers:
        - name: backend
          image: ECR/dlc/backend:v1.1.0

---
# Green deployment (new version, zero traffic until switch)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend-green
  namespace: dlc-production
spec:
  replicas: 5
  selector:
    matchLabels:
      app: backend
      version: green
  template:
    metadata:
      labels:
        app: backend
        version: green
    spec:
      containers:
        - name: backend
          image: ECR/dlc/backend:v1.2.0   # ← New version

# To cut traffic to green:
# kubectl patch service backend -p '{"spec":{"selector":{"version":"green"}}}'
# To rollback instantly:
# kubectl patch service backend -p '{"spec":{"selector":{"version":"blue"}}}'
```

### Canary Deployment

```yaml
# Using Argo Rollouts for progressive canary
apiVersion: argoproj.io/v1alpha1
kind: Rollout
metadata:
  name: backend
  namespace: dlc-production
spec:
  replicas: 10
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: backend
          image: ECR/dlc/backend:latest
          resources:
            requests: { cpu: "500m", memory: "512Mi" }
            limits:   { cpu: "2000m", memory: "2Gi" }

  strategy:
    canary:
      # Canary step progression
      steps:
        - setWeight: 10          # Route 10% traffic to canary
        - pause: { duration: 5m }
        - analysis:
            templates:
              - templateName: error-rate-analysis
              - templateName: latency-analysis
        - setWeight: 30
        - pause: { duration: 5m }
        - analysis:
            templates:
              - templateName: error-rate-analysis
        - setWeight: 60
        - pause: { duration: 3m }
        - setWeight: 100

      # Auto-rollback rules
      autoPromotionEnabled: false   # Require manual promotion after analysis
      antiAffinity:
        preferredDuringScheduling: {}

---
# Analysis template — error rate
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: error-rate-analysis
spec:
  metrics:
    - name: error-rate
      interval: 1m
      successCondition: result < 0.01      # < 1% error rate
      failureLimit: 2                       # 2 consecutive failures → rollback
      provider:
        datadog:
          query: |
            sum:trace.express.request.errors{env:production}.as_rate()

---
# Analysis template — latency
apiVersion: argoproj.io/v1alpha1
kind: AnalysisTemplate
metadata:
  name: latency-analysis
spec:
  metrics:
    - name: p95-latency
      interval: 1m
      successCondition: result < 1000      # p95 < 1000ms
      failureLimit: 2
      provider:
        datadog:
          query: |
            p95:trace.express.request.duration{env:production}
```

---

## 12. Release Management

### Semantic Versioning

```
Format: v{MAJOR}.{MINOR}.{PATCH}

MAJOR: Breaking change (new major API version, migration required by clients)
       Example: v1.0.0 → v2.0.0
       Trigger: API breaking change, major architectural shift

MINOR: New feature, backward-compatible
       Example: v1.0.0 → v1.1.0
       Trigger: End of every 2-week sprint (new features shipped)

PATCH: Bug fix, no new features
       Example: v1.1.0 → v1.1.1
       Trigger: Hotfixes, emergency patches

Pre-release:
  v1.1.0-beta.1   ← Beta release for testing
  v1.1.0-rc.1     ← Release candidate (final QA)
  v1.1.0          ← General availability

Current version tracked in:
  backend/package.json:     "version": "1.2.0"
  frontend/package.json:    "version": "1.2.0"
  mobile/pubspec.yaml:      version: 1.2.0+12   (version+build)
```

### Release Tagging

```bash
# release.yml — Automated release on tag push
# Trigger: git tag v1.2.0 && git push origin v1.2.0

name: Release

on:
  push:
    tags:
      - 'v[0-9]+.[0-9]+.[0-9]+'

jobs:
  create-release:
    runs-on: ubuntu-latest
    permissions:
      contents: write
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0    # Full history for changelog generation

      - name: Generate changelog
        id: changelog
        uses: orhun/git-cliff-action@v3
        with:
          config: cliff.toml
          args: --latest --strip header

      - name: Create GitHub Release
        uses: actions/create-release@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          tag_name: ${{ github.ref_name }}
          release_name: "Digital Labour Chowk ${{ github.ref_name }}"
          body: ${{ steps.changelog.outputs.changelog }}
          draft: false
          prerelease: ${{ contains(github.ref_name, '-') }}

      - name: Build and attach Flutter APK
        run: |
          cd mobile
          flutter build apk --release \
            --dart-define=API_URL=${{ secrets.PRODUCTION_API_URL }}
          mv build/app/outputs/flutter-apk/app-release.apk \
             dlc-worker-${{ github.ref_name }}.apk

      - name: Upload APK to release
        uses: actions/upload-release-asset@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          upload_url: ${{ steps.create-release.outputs.upload_url }}
          asset_path: mobile/dlc-worker-${{ github.ref_name }}.apk
          asset_name: dlc-worker-${{ github.ref_name }}.apk
          asset_content_type: application/vnd.android.package-archive
```

### Automated Changelog (git-cliff)

```toml
# cliff.toml — Changelog generation config

[changelog]
header = """
# Changelog — Digital Labour Chowk\n
All notable changes to this project are documented here.\n
"""
body = """
{% if version %}
## [{{ version | trim_start_matches(pat="v") }}] - {{ timestamp | date(format="%Y-%m-%d") }}
{% else %}
## [Unreleased]
{% endif %}
{% for group, commits in commits | group_by(attribute="group") %}
### {{ group | upper_first }}
{% for commit in commits %}
- {% if commit.scope %}**{{ commit.scope }}**: {% endif %}{{ commit.message }}
  ([{{ commit.id | truncate(length=7, end="") }}](https://github.com/dlc-platform/dlc-platform/commit/{{ commit.id }}))
{% endfor %}
{% endfor %}
"""
footer = """
---
*Generated by git-cliff*
"""

[git]
conventional_commits = true
filter_unconventional = true
commit_parsers = [
  { message = "^feat", group = "Features" },
  { message = "^fix", group = "Bug Fixes" },
  { message = "^perf", group = "Performance" },
  { message = "^refactor", group = "Refactoring" },
  { message = "^docs", group = "Documentation" },
  { message = "^test", group = "Testing" },
  { message = "^chore|^ci|^build", group = "Maintenance" },
  { message = "^revert", group = "Reverted Changes" },
]
filter_commits = false
tag_pattern = "v[0-9]*"
```

### Rollback Strategy

```bash
# ─── ROLLBACK RUNBOOK ──────────────────────────────────────────────────

# Level 1: Kubernetes rollback (fastest — 60 seconds)
# Use when: new deployment has issues, no data migration involved
kubectl rollout undo deployment/backend -n dlc-production
kubectl rollout undo deployment/frontend -n dlc-production
kubectl rollout status deployment/backend -n dlc-production

# Level 2: Specific version rollback
# Use when: need to go back multiple versions
kubectl rollout history deployment/backend -n dlc-production
kubectl rollout undo deployment/backend --to-revision=3 -n dlc-production

# Level 3: Image tag rollback (explicit control)
# Use when: rollout undo doesn't work as expected
kubectl set image deployment/backend \
  backend=$ECR/dlc/backend:sha-{previous-commit-sha} \
  -n dlc-production

# Level 4: Database rollback
# Use when: migration caused data corruption
# WARNING: Only if migration was additive and backward-compatible
# NEVER use if: data has been modified by new schema

# Step 1: Roll back K8s deployment to previous version
kubectl rollout undo deployment/backend -n dlc-production

# Step 2: Run migration revert (down() method)
kubectl run db-revert-$(date +%s) \
  --image=$ECR/dlc/backend:sha-{previous-sha} \
  --restart=Never \
  --command -- node dist/migrations/revert-migrations.js

# Step 3: Verify data integrity
kubectl exec -it postgres-pod -- psql -U dlc_user -d dlc_prod \
  -c "SELECT * FROM migrations ORDER BY timestamp DESC LIMIT 5;"

# Level 5: Full disaster recovery (last resort)
# Restore from RDS automated snapshot
# See: docs/runbooks/disaster-recovery.md

# Decision tree for rollback:
# Is it a UI/API issue? → Level 1 or 2
# Is it a config issue? → Update ConfigMap/Secret, restart pods
# Did migration break something? → Level 3, evaluate Level 4
# Is data corrupted? → Level 5 + incident call
```

---

## 13. Security Workflow

### Secret Management

```
Secret Lifecycle:

  CREATION:
    1. Secret needed → added to AWS Secrets Manager (never hardcoded)
    2. ExternalSecrets Operator syncs → K8s Secret created
    3. K8s Secret mounted as env var in pod → app reads via ConfigService
    4. Secret name added to .env.example (no value, just the key name)

  ROTATION POLICY:
    JWT signing keys:    90 days (with graceful rotation window)
    Database passwords:  90 days (Aurora auto-rotation enabled)
    API keys (MSG91):    180 days or on suspected compromise
    AWS access keys:     Never created (use IRSA/role-based access)
    GitHub secrets:      90 days

  BREACH RESPONSE:
    1. Immediately rotate the compromised secret
    2. Revoke old secret in AWS Secrets Manager + provider
    3. Roll all pods (pick up new secret)
    4. Review audit logs for unauthorized access
    5. Create incident report
    6. See: docs/runbooks/secret-rotation.md
```

### Branch Protection Rules

```
GitHub Branch Protection Settings:

  Branch: main
  ✦ Require pull request reviews: 2 approvals
  ✦ Dismiss stale pull request approvals when new commits are pushed
  ✦ Require review from code owners (CODEOWNERS file)
  ✦ Require status checks to pass:
      - backend-ci / lint
      - backend-ci / unit-tests
      - backend-ci / integration-tests
      - frontend-ci / lint
      - frontend-ci / test
      - docker-build / security-scan
  ✦ Require branches to be up to date before merging
  ✦ Require conversation resolution before merging
  ✦ Require signed commits (GPG signing)
  ✦ Restrict pushes: empty list (nobody pushes directly)
  ✦ Do not allow force pushes
  ✦ Do not allow deletions

  Branch: develop
  ✦ Require pull request reviews: 1 approval
  ✦ Require status checks to pass: (same as main minus integration tests)
  ✦ Require branches to be up to date
  ✦ Require signed commits
  ✦ Do not allow force pushes
```

### Dependency Scanning

```yaml
# .github/workflows/security-scan.yml
# Runs weekly + on any dependency file change

name: Security Scan

on:
  schedule:
    - cron: '0 9 * * 1'           # Every Monday 9 AM
  push:
    paths:
      - '**/package.json'
      - '**/package-lock.json'
      - '**/pubspec.yaml'
      - '**/pubspec.lock'

jobs:
  dependency-scan:
    name: Dependency Vulnerability Scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Run npm audit (backend)
        working-directory: backend
        run: |
          npm audit --audit-level=high --json > /tmp/backend-audit.json || true
          cat /tmp/backend-audit.json

      - name: Run Snyk (backend)
        uses: snyk/actions/node@master
        with:
          args: --severity-threshold=high --file=backend/package.json
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Run Snyk (frontend)
        uses: snyk/actions/node@master
        with:
          args: --severity-threshold=high --file=frontend/package.json
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

      - name: Flutter dependency check
        working-directory: mobile
        run: |
          flutter pub audit

      - name: Run Semgrep SAST
        uses: returntocorp/semgrep-action@v1
        with:
          config: >-
            p/security-audit
            p/typescript
            p/owasp-top-ten
        env:
          SEMGREP_APP_TOKEN: ${{ secrets.SEMGREP_APP_TOKEN }}

      - name: Upload SARIF results
        uses: github/codeql-action/upload-sarif@v3
        if: always()
        with:
          sarif_file: semgrep.sarif
```

---

## 14. AI Coding Workflow

### AI Agent Git Permissions

```
What AI tools (Claude Code, Cursor, Copilot) CAN do:
  ✦ Create new files in working directory
  ✦ Modify existing files in working directory
  ✦ Run git diff and git status to understand changes
  ✦ Stage specific files (git add <specific-file>)
  ✦ Create commits with suggested messages (after human approval)
  ✦ Create branches from develop (git checkout -b feature/...)
  ✦ Push feature branches to origin

What AI tools CANNOT do (enforced by hook + policy):
  ✗ Push to develop or main (pre-push hook blocks it)
  ✗ Approve pull requests (GitHub requires human reviewer)
  ✗ Bypass CI checks (GitHub branch protection)
  ✗ Access production secrets or credentials
  ✗ Create or modify .github/workflows/ (DevOps team only, CODEOWNERS)
  ✗ Modify CLAUDE.md, Architecture.md without Tech Lead approval
```

### AI-Assisted PR Creation Workflow

```bash
# scripts/ai-pr-workflow.sh
# Complete AI-assisted workflow from code gen to PR creation

#!/bin/bash
set -e

TICKET_ID=$1
DESCRIPTION=$2
BASE_BRANCH=${3:-develop}

if [ -z "$TICKET_ID" ] || [ -z "$DESCRIPTION" ]; then
  echo "Usage: ./scripts/ai-pr-workflow.sh DLC-123 'worker geo-fence attendance'"
  exit 1
fi

echo "🤖 Starting AI-assisted PR workflow for $TICKET_ID..."

# ── Step 1: Create feature branch ──────────────────────────────────────
BRANCH_NAME="feature/$TICKET_ID-$(echo $DESCRIPTION | tr ' ' '-' | tr '[:upper:]' '[:lower:]')"
git checkout $BASE_BRANCH
git pull origin $BASE_BRANCH
git checkout -b "$BRANCH_NAME"
echo "✅ Created branch: $BRANCH_NAME"

# ── Step 2: Open Claude Code context ──────────────────────────────────
echo ""
echo "📝 Context for Claude:"
echo "   Branch: $BRANCH_NAME"
echo "   Ticket: $TICKET_ID"
echo "   CLAUDE.md location: $(pwd)/CLAUDE.md"
echo ""
echo "   Suggested Claude prompt:"
echo "   ┌──────────────────────────────────────────────────────────────┐"
echo "   │ Implement ticket $TICKET_ID: $DESCRIPTION                    │"
echo "   │ Follow all patterns in CLAUDE.md.                            │"
echo "   │ Reference: src/modules/workers/ for existing patterns.       │"
echo "   │ Scope: backend (NestJS) + frontend (Next.js) if applicable.  │"
echo "   └──────────────────────────────────────────────────────────────┘"
echo ""

# ── Step 3: Wait for AI to generate code (manual step) ─────────────────
read -p "⏸  Press Enter when Claude has generated the code and you've reviewed it..."

# ── Step 4: Auto-format and validate ──────────────────────────────────
echo "🔍 Running auto-format and validation..."
(cd backend && npm run lint:fix && npm run format) 2>/dev/null || true
(cd frontend && npm run lint:fix && npm run format) 2>/dev/null || true
(cd mobile && dart format lib/) 2>/dev/null || true

# ── Step 5: Type check ─────────────────────────────────────────────────
echo "🔷 Running TypeScript checks..."
(cd backend && npx tsc --noEmit) || { echo "❌ Backend TypeScript errors!"; exit 1; }
(cd frontend && npx tsc --noEmit) || { echo "❌ Frontend TypeScript errors!"; exit 1; }

# ── Step 6: Quick tests ────────────────────────────────────────────────
echo "🧪 Running quick unit tests..."
(cd backend && npm run test -- --passWithNoTests --silent) || \
  { echo "❌ Tests failed!"; exit 1; }

# ── Step 7: Show staged changes ────────────────────────────────────────
echo "📋 Changes ready to stage:"
git status --short
echo ""
read -p "⏸  Review the changes above. Press Enter to proceed to staging..."

# ── Step 8: Stage changes ─────────────────────────────────────────────
git add -p   # Interactive staging — review each hunk

# ── Step 9: Generate commit message ───────────────────────────────────
echo "💬 Generating commit message..."
STAGED_DIFF=$(git diff --staged)
COMMIT_MSG=$(echo "$STAGED_DIFF" | claude --print \
  "Generate a conventional commit message for this diff. \
   Ticket: $TICKET_ID. \
   Follow: <type>(<scope>): <description> format. \
   Return ONLY the commit message, no explanation.")

echo "Suggested commit message:"
echo "  $COMMIT_MSG"
echo ""
read -p "⏸  Accept this commit message? (Enter to accept, Ctrl+C to type manually): "

# ── Step 10: Commit ────────────────────────────────────────────────────
git commit -m "$COMMIT_MSG

Closes: $TICKET_ID

Co-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>"

# ── Step 11: Push ──────────────────────────────────────────────────────
git push origin "$BRANCH_NAME"
echo "✅ Pushed to origin/$BRANCH_NAME"

# ── Step 12: Create PR ────────────────────────────────────────────────
echo "📬 Creating pull request..."
PR_TITLE=$(echo "$COMMIT_MSG" | head -1)
PR_BODY=$(cat << 'PREOF'
## Summary
<!-- Generated by AI workflow script. Please edit before submitting. -->

## Linked Ticket
Closes: $TICKET_ID

## How to Test
1. Run `docker-compose up -d`
2. Run `npm run test` in backend/
3. Test the endpoint via Postman collection

## Engineering Checklist
- [ ] Tests added or updated
- [ ] CLAUDE.md architecture rules followed
- [ ] No console.log committed
- [ ] No secrets in code

## AI Assistance Used
- [x] AI generated initial code (reviewed and validated by me)
- [x] AI generated commit message (reviewed by me)
PREOF
)

gh pr create \
  --title "$PR_TITLE" \
  --body "$PR_BODY" \
  --base develop \
  --assignee "@me"

echo ""
echo "🎉 PR created! Review it at:"
gh pr view --web
```

### Architecture Consistency Checks

```bash
# scripts/check-architecture.sh
# Run before opening a PR to catch CLAUDE.md violations

#!/bin/bash

VIOLATIONS=0

echo "🏛️  Checking CLAUDE.md architecture rules..."
echo ""

# RULE-001: No business logic in controllers
CONTROLLER_VIOLATIONS=$(grep -rn "this\.\w*Repository\." backend/src/*/controllers/ 2>/dev/null)
if [ -n "$CONTROLLER_VIOLATIONS" ]; then
  echo "❌ RULE-001 VIOLATION: Repository called directly in controller:"
  echo "$CONTROLLER_VIOLATIONS"
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# RULE-003: No process.env in business code
PROCESSENV_VIOLATIONS=$(grep -rn "process\.env\." backend/src/modules/ 2>/dev/null)
if [ -n "$PROCESSENV_VIOLATIONS" ]; then
  echo "❌ RULE-003 VIOLATION: process.env used outside config files:"
  echo "$PROCESSENV_VIOLATIONS"
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# RULE-004: No raw SQL string interpolation
SQL_INJECTION_RISK=$(grep -rn "query(\`" backend/src/ 2>/dev/null | grep -v "//")
if [ -n "$SQL_INJECTION_RISK" ]; then
  echo "⚠️  RULE-004 WARNING: Template literal in raw query (check for interpolation):"
  echo "$SQL_INJECTION_RISK"
fi

# RULE-010: No endpoints without DTOs
NO_BODY_VALIDATION=$(grep -rn "@Body()" backend/src/*/controllers/ 2>/dev/null | \
  grep -v ": Create\|: Update\|: Filter\|Dto")
if [ -n "$NO_BODY_VALIDATION" ]; then
  echo "❌ RULE-010 WARNING: @Body() without DTO type annotation:"
  echo "$NO_BODY_VALIDATION"
  VIOLATIONS=$((VIOLATIONS + 1))
fi

# Check for console.log in committed code
CONSOLE_LOGS=$(git diff origin/develop..HEAD --unified=0 | \
  grep "^+" | grep "console\.log" | grep -v "^+++" | grep -v "//")
if [ -n "$CONSOLE_LOGS" ]; then
  echo "❌ console.log found in diff:"
  echo "$CONSOLE_LOGS"
  VIOLATIONS=$((VIOLATIONS + 1))
fi

echo ""
if [ $VIOLATIONS -eq 0 ]; then
  echo "✅ All architecture checks passed! Ready for PR."
else
  echo "❌ $VIOLATIONS architecture violation(s) found."
  echo "   Fix these before opening a PR."
  exit 1
fi
```

---

## 15. Monitoring & Alerts

### CI Failure Alerts

```yaml
# Slack notification on CI failure
# Added to all workflow files as last job with if: failure()

notify-ci-failure:
  name: Notify CI Failure
  runs-on: ubuntu-latest
  needs: [lint, unit-tests, integration-tests, build, docker-build]
  if: failure()
  steps:
    - name: Send Slack alert
      uses: 8398a7/action-slack@v3
      with:
        status: failure
        fields: repo,message,author,ref,workflow
        custom_payload: |
          {
            "text": "❌ *CI Pipeline Failed*",
            "attachments": [{
              "color": "danger",
              "fields": [
                { "title": "Repository", "value": "${{ github.repository }}", "short": true },
                { "title": "Branch", "value": "${{ github.ref_name }}", "short": true },
                { "title": "Author", "value": "${{ github.actor }}", "short": true },
                { "title": "Commit", "value": "${{ github.event.head_commit.message }}", "short": false },
                { "title": "Action", "value": "<${{ github.server_url }}/${{ github.repository }}/actions/runs/${{ github.run_id }}|View Failed Run>", "short": false }
              ]
            }]
          }
      env:
        SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_CI }}
```

### Deployment Monitoring

```
Post-deploy monitoring dashboard (Datadog):

  SLOs to watch for 15 minutes after every production deploy:
  ┌──────────────────────────────────────────────────────────────┐
  │  Metric                     │  Threshold    │  Action        │
  ├──────────────────────────────────────────────────────────────┤
  │  5xx error rate             │  < 0.5%       │  Rollback P0   │
  │  API p95 latency            │  < 800ms      │  Investigate   │
  │  DB connection pool usage   │  < 80%        │  Scale DB      │
  │  Memory usage (pods)        │  < 85%        │  Scale pods    │
  │  Queue lag (BullMQ)         │  < 2 min      │  Scale workers │
  │  Active WebSocket conns     │  stable ±20%  │  Monitor       │
  │  Check-in success rate      │  > 99%        │  Rollback P0   │
  │  Auth flow success rate     │  > 99.5%      │  Rollback P0   │
  └──────────────────────────────────────────────────────────────┘

Automatic rollback triggers (Argo Rollouts):
  error-rate > 1% for 2 consecutive minutes → auto-rollback
  p95 latency > 2000ms for 3 minutes → auto-rollback
  health endpoint returning non-200 for 1 minute → auto-rollback

PagerDuty escalation:
  P1 (production down):    immediate page → on-call engineer
  P2 (degraded service):   5 min → on-call engineer
  P3 (elevated errors):    Slack only → investigate next business day
```

### Performance Monitoring

```yaml
# Lighthouse CI config
# .lighthouserc.json

{
  "ci": {
    "collect": {
      "url": [
        "http://localhost:3001/login",
        "http://localhost:3001/dashboard",
        "http://localhost:3001/workers"
      ],
      "numberOfRuns": 3,
      "settings": {
        "preset": "desktop"
      }
    },
    "assert": {
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.75 }],
        "categories:accessibility": ["error", { "minScore": 0.90 }],
        "categories:best-practices": ["warn", { "minScore": 0.85 }],
        "categories:seo": ["warn", { "minScore": 0.80 }],
        "first-contentful-paint": ["warn", { "maxNumericValue": 2000 }],
        "total-blocking-time": ["error", { "maxNumericValue": 500 }],
        "largest-contentful-paint": ["warn", { "maxNumericValue": 3000 }],
        "cumulative-layout-shift": ["error", { "maxNumericValue": 0.1 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
```

---

## 16. Engineering Rules

### The Non-Negotiables

```
These rules are enforced by tooling (hooks, CI, branch protection).
They are NOT optional. They are NOT negotiable. They protect the team.

RULE-GIT-01: Never commit directly to main or develop.
  Enforced by: GitHub branch protection + pre-push hook
  Consequence: Push rejected automatically

RULE-GIT-02: Always require PR review before merging.
  Enforced by: GitHub branch protection (1 reviewer for develop, 2 for main)
  Consequence: Merge button blocked until approvals received

RULE-GIT-03: Always run CI checks before merge.
  Enforced by: Required status checks in branch protection
  Consequence: Merge blocked until all checks pass

RULE-GIT-04: Always scan Docker images before push.
  Enforced by: Trivy scan in docker-build CI job
  Consequence: CRITICAL severity → build fails, image not pushed

RULE-GIT-05: Always validate secrets before commit.
  Enforced by: gitleaks in pre-commit hook + CI pipeline
  Consequence: Commit blocked if secret pattern detected

RULE-GIT-06: Never force push to shared branches.
  Enforced by: GitHub branch protection (no force push)
  Consequence: Push rejected

RULE-GIT-07: Always write conventional commit messages.
  Enforced by: commit-msg Husky hook
  Consequence: Commit blocked if format doesn't match pattern

RULE-GIT-08: Never commit .env files.
  Enforced by: .gitignore + gitleaks
  Consequence: Commit blocked if .env content detected

RULE-GIT-09: Never merge a PR with unresolved conversations.
  Enforced by: "Require conversation resolution" branch protection
  Consequence: Merge blocked until all PR comments resolved

RULE-GIT-10: Always delete branches after merge.
  Enforced by: GitHub "Automatically delete head branches" setting
  Consequence: Auto-deleted by GitHub after merge
```

### Quick Reference Card

```
Daily commands:
  git checkout develop && git pull origin develop   ← Start here every morning
  git checkout -b feature/DLC-XXX-description       ← Start new feature
  git diff --staged                                  ← Review before committing
  npm run lint:fix && npm run format                 ← Before staging files
  git commit -m "feat(scope): description"           ← Commit with convention
  git push origin feature/DLC-XXX-description       ← Push branch
  gh pr create --fill                                ← Open PR via GitHub CLI

Emergency commands:
  kubectl rollout undo deployment/backend            ← Rollback backend
  kubectl rollout undo deployment/frontend           ← Rollback frontend
  kubectl rollout status deployment/backend          ← Check rollout status
  kubectl get pods -n dlc-production                 ← Check pod health
  kubectl logs -f deployment/backend -n dlc-production ← Tail logs

Useful aliases (add to ~/.zshrc or ~/.bashrc):
  alias gst='git status'
  alias gd='git diff'
  alias gds='git diff --staged'
  alias gl='git log --oneline --graph -20'
  alias gpf='git push origin $(git branch --show-current)'
  alias gcp='git cherry-pick'
  alias dlc-rollback='kubectl rollout undo deployment/backend deployment/frontend -n dlc-production'
  alias dlc-logs='kubectl logs -f deployment/backend -n dlc-production'
```

---

## Appendix A: Git Cheat Sheet for AI Agents

```
When Claude Code or Cursor is generating code for this repo:

ALWAYS do:
  ✦ Create a feature branch from develop before making changes
  ✦ Use conventional commit format for all commit messages
  ✦ Stage only the files you intended to change (git add <specific files>)
  ✦ Run npm run lint:fix before staging TypeScript files
  ✦ Add Co-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com> to commits
  ✦ Reference the ticket ID in commit footer: Closes: DLC-XXX

NEVER do:
  ✗ git add .   (stages everything including unintended files)
  ✗ git push origin main   (blocked by protection, but never try)
  ✗ git push origin develop   (blocked by protection)
  ✗ git commit --no-verify   (bypasses safety hooks)
  ✗ git push --force   (blocked, but never attempt)
  ✗ Commit .env files or secrets of any kind

Commit message template for AI-generated code:
  feat(module): implement [feature name]

  [2-3 sentences explaining what was implemented and WHY this approach was chosen]

  Closes: DLC-XXX

  Co-authored-by: Claude Sonnet 4.6 <noreply@anthropic.com>
```

---

*Git-Workflow.md — Digital Labour Chowk*
*Version 1.0 | May 2026 | Owned by: Platform Engineering*
*Review cycle: Quarterly or on significant tooling change*
*"A codebase is a long conversation between engineers across time. Write clearly."*
