# PERN Multi-College ERP: Production Architecture & Implementation Report

This report outlines the **PostgreSQL + Prisma Schema** and **NestJS Production Backend Architecture** tailored for **independent single-tenant college deployments** with enterprise production standards.

---

## 🏛️ Independent-per-College Deployment Architecture

Each college runs an independent deployment instance connected to its own dedicated PostgreSQL database and Redis instance:

```
                                  HTTP Request
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │       Security Pipeline       │
                       │  • Helmet (Security Headers)  │
                       │  • Throttler (DDoS/Brute)     │
                       │  • JwtAuthGuard (15m Token)   │
                       │  • PermissionsGuard (RBAC)    │
                       │  • ModuleEnabledGuard (SaaS)  │
                       └───────────────┬───────────────┘
                                       │
                                       ▼
                               ┌───────────────┐
                               │  Controller   │
                               └───────┬───────┘
                                       │
                                       ▼
                       ┌───────────────────────────────┐
                       │        Domain Service         │
                       │  (Academics, Finance, etc.)   │
                       └───────┬───────────────┬───────┘
                               │               │
                               ▼               ▼
                       ┌───────────────┐ ┌─────────────────────────────────────┐
                       │ Redis Cache   │ │       PostgreSQL Transaction        │
                       │ & Locks/Mutex │ │  ┌───────────────┐ ┌──────────────┐ │
                       └───────────────┘ │  │ Business Data │ │   AuditLog   │ │
                                         │  └───────────────┘ └──────────────┘ │
                                         └──────────────────┬──────────────────┘
                                                            │
                                                            ▼ (On Commit)
                                                  ┌───────────────────┐
                                                  │  Publish/Queue    │
                                                  │    (BullMQ)       │
                                                  │ • Email / SMS     │
                                                  │ • PDF Generation  │
                                                  │ • Notifications   │
                                                  └───────────────────┘
```

1. **Dedicated Database Isolation**: No `collegeId` required on operational models (`Student`, `Faculty`, `Exam`, `HospitalWard`, `Prescription`) because one database belongs to exactly one college instance.
2. **Dedicated Modular Guards**:
   - `HostelController` guarded by `@RequireModule(ModuleType.HOSTEL)`
   - `LibraryController` guarded by `@RequireModule(ModuleType.LIBRARY)`
   - `TransportController` guarded by `@RequireModule(ModuleType.TRANSPORT)`
   - `HospitalController` guarded by `@RequireModule(ModuleType.HOSPITAL)`
   - `ClinicalController` guarded by `@RequireModule(ModuleType.CLINICAL_TRAINING)`
   - `PharmacyController` guarded by `@RequireModule(ModuleType.PHARMACY)`
   - `HrController` guarded by `@RequireModule(ModuleType.HR)`

---

## 🛡️ Core Production Infrastructure Subsystems (Phase 1 Complete ✅)

| Infrastructure Subsystem | Capabilities | Status |
|---|---|---|
| **Database & ORM** | PostgreSQL with Prisma ORM 6 (Dedicated DB per college instance) | ✅ Complete |
| **Authentication & Sessions** | 15m Access Token + 7d Refresh Token rotation, Replay attack detection, Logout blacklist, Brute-force lockout, Password recovery | ✅ Complete |
| **Granular RBAC** | `User -> UserRole -> Role -> RolePermission -> Permission`, cached permission resolution, `SUPER_ADMIN` wildcard, `PermissionsGuard` | ✅ Complete |
| **Caching Infrastructure** | Multi-driver (Redis + Memory fallback), Thundering Herd (Mutex) protection, `@Cacheable`, `@CacheEvict`, `@HttpCache` | ✅ Complete |
| **Business Audit Logging** | `AuditService`, `@Audited()` decorator, diff capturing, immutable PostgreSQL `AuditLog` trail, `GET /api/audit-logs` | ✅ Complete |
| **Transaction & Idempotency** | `TransactionService` (Prisma interactive transactions with deadlock retry), `@Idempotent()` header protection | ✅ Complete |
| **BullMQ / Background Jobs** | Queues for `email`, `sms`, `pdf-generation`, `notifications`, worker processors with exponential backoff & dev fallback | ✅ Complete |
| **Multi-Channel Notifications** | `NotificationService` (In-App alerts, Email, SMS via BullMQ), `GET /api/notifications`, `PATCH /api/notifications/:id/read` | ✅ Complete |
| **File Storage Abstraction** | Pluggable `StorageService` (Local disk & S3/R2 object storage) | ✅ Complete |
| **Dual Backup & Disaster Recovery** | Logical `pg_dump` snapshot + Physical PITR strategy + Off-site remote storage documentation | ✅ Complete |
| **Observability & Reliability** | `CorrelationIdMiddleware` (`X-Correlation-ID`), `LoggingInterceptor`, `GlobalExceptionFilter` (Prisma error mapping), `Helmet`, Graceful Shutdown | ✅ Complete |

---

## 🗺️ ERP Business Implementation Roadmap

```
PHASE 1: Foundation Infrastructure (✅ COMPLETE)
   │
   ▼
PHASE 2: College Core (Next)
   ├── 1. College Profile & Multi-Currency/Timezone Settings
   ├── 2. Module Dynamic Configuration (Feature Toggles)
   ├── 3. Users, Roles & Permission Matrices
   ├── 4. Campus, Buildings & Rooms
   ├── 5. Departments
   ├── 6. Degree Programs (BSN Generic 4Y, Post-RN 2Y, DPT, BS-MLT)
   ├── 7. Academic Sessions
   ├── 8. Semesters
   ├── 9. Subjects / Courses & Prerequisites
   └── 10. Class Sections & Student Group Allocations
   │
   ▼
PHASE 3: Student Lifecycle
   ├── 11. Admissions Inquiries & Online Applications
   ├── 12. Student Registration & Biographic Records
   ├── 13. Parents & Emergency Contact Linking
   ├── 14. Student Educational Documents Verification
   └── 15. Semester Enrollments & Course Registrations
   │
   ▼
PHASE 4: Academic Operations
   ├── 16. Faculty Workload & Course Allocation
   ├── 17. Weekly Class & Lab Timetables
   ├── 18. Student & Faculty Attendance (Daily & Subject logs)
   ├── 19. Examination Schedules (Midterm, Final, OSPE/Viva)
   ├── 20. Marks Entry & Paper Rubrics
   └── 21. GPA, CGPA & PNC Letter Grade Generation (A+, A, B, C, D, F)
   │
   ▼
PHASE 5: Fees & Finance
   ├── 22. Fee Structures & Program Fee Templates
   ├── 23. Student Challan Invoices Generation
   ├── 24. Payment Ledger & Reconciliation (Cash, Bank, Online)
   ├── 25. Merit & Need-Based Scholarships Allocation
   ├── 26. Student Financial Ledger
   └── 27. Revenue & Outstanding Balance Analytics
   │
   ▼
PHASE 6: Nursing & Clinical Training (Specialized Healthcare ERP)
   ├── 28. Partner Teaching Hospitals & Clinical Sites
   ├── 29. Student Clinical Ward Rotations & Duty Rosters
   ├── 30. Standard Nursing Procedural Skills Matrix
   ├── 31. Student Clinical Skill Logbook
   └── 32. Faculty Supervisor Bedside Assessment & Sign-Offs
   │
   ▼
PHASE 7: Optional Modules (Enabled per College Configuration)
   ├── 33. Hospital OPD/IPD (Wards, Beds, Doctors, Patients, Prescriptions, Lab Tests)
   ├── 34. Pharmacy & Medicine Stock Inventory
   ├── 35. Hostels (Buildings, Rooms, Bed Occupancy Allocation)
   ├── 36. Library (Cataloging, Circulation & Borrow/Return Ledger)
   ├── 37. Transport (Fleet Vehicles, Route Stops & Student Bus Passes)
   └── 38. HR & Staff Monthly Payroll Processing
   │
   ▼
PHASE 8: Public Portal & CMS
   ├── 39. Public Website Pages & CMS
   ├── 40. College News & Announcements
   ├── 41. Campus Events & Workshops
   ├── 42. Academic Notice Board
   ├── 43. Public Admissions Portal
   └── 44. QR-Code Verifiable Student Certificates & Transcripts
```
