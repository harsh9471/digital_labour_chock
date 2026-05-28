# ============================================================
# Digital Labour Chowk - API Dockerfile
# Multi-stage build for development and production
# ============================================================

# Base stage
FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl curl
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Development stage
FROM node:20-alpine AS development
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl curl
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npx prisma generate
CMD ["npm", "run", "start:dev"]

# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package*.json ./
RUN npm ci && npm cache clean --force
COPY . .
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:20-alpine AS production
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl curl dumb-init
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs
EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3001/api/v1/health || exit 1

ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main"]
