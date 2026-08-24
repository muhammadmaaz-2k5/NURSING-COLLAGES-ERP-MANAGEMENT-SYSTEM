# Standalone College Instance: Backup & Disaster Recovery Guide

Because each college deployment uses a **dedicated PostgreSQL database** and **isolated file storage**, backup and disaster recovery is cleanly isolated with zero multi-tenant entanglement.

---

## 💾 Dual Backup Architecture

```
                    COLLEGE DEPLOYMENT INSTANCE
                                 │
         ┌───────────────────────┴───────────────────────┐
         ▼                                               ▼
  Logical Backup                                 Physical / PITR Backup
  (Daily Snapshot)                               (Continuous Protection)
         │                                               │
         ▼                                               ▼
  pg_dump --no-owner                             pg_basebackup + WAL Archiving
  (database.sql)                                 (Point-in-Time Recovery)
         │                                               │
         └───────────────────────┬───────────────────────┘
                                 │
                                 ▼
                    Off-Site Remote Storage
                    (AWS S3 / Cloudflare R2 / Remote NFS)
                    *Never keep backups solely on the college VM*
```

| Component | Storage Type | Strategy |
|---|---|---|
| **PostgreSQL Logical** | SQL Dump | Daily `pg_dump` snapshot (`database.sql`) |
| **PostgreSQL Physical / PITR** | Base Backup + WAL | Continuous WAL archiving for second-by-second Point-in-Time Recovery |
| **Uploaded Storage** | Local Disk / S3 / MinIO | Daily file archive (`/uploads` directory) |
| **Configuration** | Environment (`.env`) | Versioned infrastructure configs |
| **Redis Cache** | In-Memory Key-Value | **Disposable** (No backup needed; automatically rebuilt) |

---

## 🛠️ Automated Logical Backup Procedure

Run the automated backup tool:
```bash
npm run backup
```

This creates an atomic snapshot folder under `/backups/{COLLEGE_CODE}_{TIMESTAMP}` containing:
- `database.sql`: Full SQL schema & operational data dump.
- `uploads/`: Complete document, certificate, student photo, and clinical logbook files.
- `metadata.json`: Instance code, timestamp, and environment metadata.

---

## ☁️ Off-Site Cloud Archiving (Production Standard)

In production, backups are automatically synced to an external S3-compatible bucket (e.g. AWS S3, Cloudflare R2, Wasabi):
```bash
# Sync snapshot to off-site cloud storage
aws s3 sync /backups/ s3://college-backups-bucket/nmc-01/
```

---

## 🔄 Disaster Recovery & Full Restore Procedure

In the event of total server loss or database migration:

1. **Deploy Clean Server / Environment**:
   ```bash
   git clone <repository_url>
   cd PERN
   npm install
   cp .env.example .env
   ```

2. **Run the Restore Script**:
   ```bash
   npm run restore backups/NMC-01_2026-08-24T06-00-00-000Z
   ```

3. **Verify Database & Start Application**:
   ```bash
   npm run build
   npm run start
   ```
