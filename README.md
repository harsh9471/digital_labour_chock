# 🏗️ Digital Labour Chowk

> India's Most Trusted Labour Marketplace Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D20-green)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)](https://typescriptlang.org)
[![NestJS](https://img.shields.io/badge/NestJS-10-red)](https://nestjs.com)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org)
[![Flutter](https://img.shields.io/badge/Flutter-3.24-blue)](https://flutter.dev)

## 📋 Overview

Digital Labour Chowk is a production-grade labour marketplace platform connecting workers, contractors, and companies across India. This monorepo contains the complete source code for the web frontend, backend API, and mobile app.

## 🏛️ Architecture

```
DigitalLabourChowk/
├── apps/
│   ├── api/              # NestJS Backend (Port 3001)
│   ├── web/              # Next.js 15 Frontend (Port 3000)
│   └── mobile/           # Flutter Mobile App
├── packages/
│   └── shared/           # Shared TypeScript types & utilities
├── docker/               # Docker configurations
│   ├── postgres/         # PostgreSQL init scripts
│   └── nginx/            # Nginx reverse proxy config
├── .github/
│   └── workflows/        # CI/CD GitHub Actions
└── docker-compose.yml    # Full stack orchestration
```

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, React, TypeScript, TailwindCSS, ShadCN UI |
| Backend | NestJS, TypeScript, Prisma ORM, JWT Auth |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Mobile | Flutter 3.24 (Dart) |
| DevOps | Docker, Docker Compose, GitHub Actions |

## 🚀 Quick Start

### Prerequisites

- Node.js >= 20
- Docker & Docker Compose
- Flutter SDK >= 3.24 (for mobile)

### 1. Clone & Setup Environment

```bash
# Clone repository
git clone https://github.com/your-org/digital-labour-chowk.git
cd digital-labour-chowk

# Copy environment file
cp .env.example .env
# Edit .env with your values
```

### 2. Start with Docker (Recommended)

```bash
# Start all services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f api
```

### 3. Run Database Migrations & Seed

```bash
# Run migrations
npm run db:migrate

# Seed sample data (20 workers, 5 contractors, 3 companies, 2 admins)
npm run db:seed
```

### 4. Development (Without Docker)

```bash
# Install dependencies
npm install

# Start PostgreSQL & Redis (required)
docker-compose up postgres redis -d

# Start API
npm run dev:api

# Start Web (in new terminal)
npm run dev:web
```

## 🔐 Default Credentials (Development)

| Role | Email | Password |
|------|-------|----------|
| Super Admin | superadmin@digitallabourchowk.com | Password@123 |
| Admin | admin@digitallabourchowk.com | Password@123 |
| Workers | OTP via +919700001001 to +919700001020 | - |
| Contractors | Email login | Password@123 |

## 📡 API Endpoints

Base URL: `http://localhost:3001/api/v1`

Swagger Docs: `http://localhost:3001/api/v1/docs`

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register new user |
| POST | `/auth/login/email` | Email/password login |
| POST | `/auth/otp/send` | Send OTP to phone |
| POST | `/auth/otp/verify` | Verify OTP & get tokens |
| POST | `/auth/refresh` | Refresh access token |
| POST | `/auth/logout` | Logout current session |
| GET  | `/auth/me` | Get current user profile |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users` | List all users (Admin) |
| GET | `/users/workers` | List workers with filters |
| GET | `/users/contractors` | List contractors |
| GET | `/users/:id` | Get user profile |
| PATCH | `/users/:id/status` | Update status (Admin) |
| DELETE | `/users/:id` | Soft delete (Admin) |

## 📱 Mobile App

```bash
cd apps/mobile
flutter pub get
flutter run
```

## 🐳 Docker Commands

```bash
# Full stack
docker-compose up -d

# Production mode
docker-compose --profile production up -d

# Stop all
docker-compose down

# Reset database
docker-compose down -v
docker-compose up -d
```

## 🧪 Testing

```bash
# Run all tests
npm run test

# API tests
npm run test:api

# Web tests
npm run test:web
```

## 📊 Database Schema

The platform uses PostgreSQL with Prisma ORM. Key models:

- **users** - Core user accounts with RBAC
- **workers** - Worker profiles with skills, rates, availability
- **contractors** - Contractor profiles with company associations
- **companies** - Business entities
- **admins** - Platform administrators
- **roles** / **permissions** - RBAC system
- **user_sessions** - JWT session management
- **documents** - ID verification documents
- **locations** - Geographic data
- **skills** / **worker_skills** - Skill taxonomy

## 🔒 Security Features

- JWT access tokens (15min expiry) + Refresh tokens (7 days)
- Token rotation on refresh
- OTP-based authentication with rate limiting
- Bcrypt password hashing (cost factor: 12)
- Redis session blacklisting on logout
- RBAC with role guards
- Helmet.js security headers
- Rate limiting (ThrottlerModule)
- Input validation with class-validator
- SQL injection prevention via Prisma

## 📁 Folder Structure Details

```
apps/api/src/
├── auth/               # JWT, OTP, Guards, Strategies
├── users/              # User management
├── prisma/             # Database service
├── redis/              # Cache service
├── common/             # Shared filters, interceptors, decorators
└── config/             # Configuration & validation

apps/web/src/
├── app/                # Next.js 15 App Router
│   ├── (auth)/         # Login, Register, OTP pages
│   └── (dashboard)/    # Role-based dashboards
├── components/
│   ├── ui/             # ShadCN components
│   └── auth/           # Auth forms
├── lib/                # API client, utilities
├── store/              # Zustand state management
└── types/              # TypeScript types
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feat/your-feature`
3. Commit: `git commit -m 'feat(scope): description'`
4. Push: `git push origin feat/your-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ in India 🇮🇳
# digital_labour_chock
