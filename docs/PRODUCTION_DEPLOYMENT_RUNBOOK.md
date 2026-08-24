# PERN Standalone Single-College ERP — Production Deployment Runbook & Go-Live Checklist

This document details the production operations, security policies, zero-downtime database migration procedures, disaster recovery protocols, and monitoring configurations for deploying the PERN Nursing & Medical Colleges ERP Management System.

---

## 1. Architecture Overview
- **Deployment Topology**: Standalone single-tenant deployment per college institution.
- **Database**: Dedicated PostgreSQL 16 instance with Write-Ahead Logging (WAL) enabled.
- **Cache & Message Broker**: Dedicated Redis 7 instance for Cache-Aside (`Cacheable`/`CacheEvict`) and BullMQ background worker queues.
- **Backend API**: NestJS (Node.js 22 LTS), Helmet security headers, Throttler rate limiting, Global Validation Pipes, and Correlation ID structured logging.
- **Frontend**: Next.js 15 App Router with SSR/SSG and Glassmorphic responsive UI.

---

## 2. Pre-Deployment Security Hardening Checklist

| Security Area | Policy / Requirement | Verification |
| :--- | :--- | :--- |
| **Secrets Management** | No plaintext keys in repository. All injected via environment variables or AWS Secrets Manager / HashiCorp Vault. | `JWT_SECRET`, `DATABASE_URL`, `REDIS_PASSWORD` rotated |
| **HTTP Security Headers** | Helmet middleware configured: HSTS, X-Content-Type-Options: nosniff, Frameguard (DENY), Cross-Origin Isolation. | Verified via `curl -I https://api.college.edu.pk/api/health` |
| **Rate Limiting** | NestJS ThrottlerGuard enabled: Default 100 requests / 60 seconds per IP; Public portal endpoints 30 requests / minute. | DDoS protection validated |
| **CORS Policy** | Whitelisted specific institutional origin domains (e.g. `https://erp.college.edu.pk`). Wildcards (`*`) forbidden in production. | Tested with mismatched Origin headers |
| **Container Isolation** | Non-root execution: Containers run as `nestjs:nodejs` (UID 1001) and `nextjs:nodejs`. | `USER nestjs` verified in Dockerfile |
| **Database Network** | PostgreSQL and Redis ports (5432, 6379) bound strictly to internal Docker bridge network (`pern_network`). | No public port exposures |

---

## 3. Step-by-Step Production Deployment Procedure

### Step 3.1: Environment Variable Provisioning
Create the production `.env` file on the deployment host:
```bash
NODE_ENV=production
PORT=4000
API_PREFIX=api

# Database Configuration (Dedicated PostgreSQL per College)
DATABASE_URL=postgresql://pern_user:STRONG_SECURE_PASSWORD@postgres:5432/nursing_college_prod?schema=public

# Redis & BullMQ Queue Broker
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=STRONG_REDIS_PASSWORD

# Security & Authentication
JWT_SECRET=SECURE_256_BIT_RANDOM_SECRET_KEY
JWT_EXPIRATION=7d
CORS_ORIGINS=https://erp.college.edu.pk,https://portal.college.edu.pk

# Next.js Public Endpoint
NEXT_PUBLIC_API_URL=https://api.college.edu.pk/api
```

### Step 3.2: Database Migration & Seeding
Run automated Prisma migrations before launching the web traffic:
```bash
# Generate Prisma runtime client
npm run prisma:generate

# Execute production migrations
npx prisma migrate deploy

# (Optional) Seed initial super-admin, standard roles, and PNC grading rules
npm run prisma:seed
```

### Step 3.3: Production Container Launch
```bash
# Build and start all services in detached mode
docker compose -f docker-compose.prod.yml up --build -d

# Verify all containers are in HEALTHY state
docker compose -f docker-compose.prod.yml ps
```

---

## 4. Automated Backup & Point-in-Time Recovery (PITR) Protocol

### Backup Cadence
- **Full Database Snapshots**: Executed daily at 02:00 UTC via `pg_dump` with SHA-256 integrity hashing.
- **Write-Ahead Log (WAL) Archiving**: Continuously archived to encrypted off-site object storage (S3/Wasabi) every 15 minutes for 0-data-loss RPO.

### Backup Execution Command
```bash
npm run backup
```

### Mock Restoration Drill
```bash
npx ts-node scripts/drills/recovery-drill.ts
```

---

## 5. Health Monitoring & Observability

### Health Check Endpoints
- API Liveness / Readiness: `GET /api/health`
- Swagger OpenAPI Specs: `GET /api/docs`
- Prometheus Metrics: `GET /api/metrics`

### Log Aggregation
All NestJS and Next.js services emit structured JSON log entries tagged with correlation IDs (`x-correlation-id`) for tracing user transactions across API calls, interactive database transactions, and background BullMQ workers.

---

## 6. Emergency Rollback Runbook
In the event of an unrecoverable production regression or database migration failure:
1. Halt frontend ingress traffic by switching Cloudflare / Nginx to Maintenance Mode.
2. Revert container image tags to the previous stable release:
   ```bash
   docker compose -f docker-compose.prod.yml down
   docker tag pern_api:prev pern_api:latest
   docker compose -f docker-compose.prod.yml up -d
   ```
3. Restore database snapshot from the latest manifest if data corruption occurred:
   ```bash
   npm run restore -- --file backups/latest_valid_snapshot.sql
   ```
4. Verify system health at `/api/health` and disable Maintenance Mode.
