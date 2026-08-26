# Student Role Architecture & Complete System Documentation

Comprehensive technical documentation covering the backend and frontend capabilities, security boundaries, API endpoints, data models, and user experience for the **STUDENT** role in the Nursing College ERP & Management Monolith.

---

## 1. Role Definition & Security Architecture

### Role Identity & RBAC Matrix
- **System Role**: `STUDENT` (Defined in Prisma Enum `Role.STUDENT`)
- **Primary Persona**: *Amina Bibi* (Registration ID: `NUR-2022-0041`, Generic BSN 4-Year Program, Active Semester 6)
- **Security Boundary**: **Strict Read-Only Self-Scoped Access** with transactional procedure logging.
  - Students **cannot** mark or alter attendance (attendance marking is restricted exclusively to `FACULTY` and `COLLEGE_ADMIN`).
  - Students **cannot** enter marks, alter exam grading scales, or publish transcripts.
  - Students **cannot** create or modify tuition fee structures or administrative campus facilities.
  - Students are row-level scoped to their own `studentId`.

### Permission Set Assigned to `STUDENT`
| Permission Scope | Read (`.read`) | Create (`.create`) | Update (`.update`) | Delete (`.delete`) |
| :--- | :---: | :---: | :---: | :---: |
| **`attendance.*`** | ✅ (Own History) | ❌ | ❌ | ❌ |
| **`academic.*`** | ✅ (Enrolled Program/Syllabus) | ❌ | ❌ | ❌ |
| **`exams.*`** | ✅ (Published Results & Transcript) | ❌ | ❌ | ❌ |
| **`clinical.*`** | ✅ (1200h Logbook) | ✅ (Submit Procedure Log) | ❌ | ❌ |
| **`finance.*`** | ✅ (Challans & Receipts) | ❌ | ❌ | ❌ |
| **`library.*`** | ✅ (Issued Books & Catalog) | ✅ (Reserve Stacks Copy) | ❌ | ❌ |
| **`facilities.*`** | ✅ (Hostel & Bus Pass) | ❌ | ❌ | ❌ |

---

## 2. Backend Capabilities & API Endpoints

The backend is built with **NestJS 11**, **Prisma ORM 6**, and **PostgreSQL**.

### 2.1 Authentication & Profile Handshake
- **`POST /api/auth/login`**: Authenticates credentials and returns signed JWT containing `sub`, `role: 'STUDENT'`, and `collegeId`.
- **`GET /api/auth/me`**: Returns the active student profile, enrolled degree program, active semester, and assigned persona.

### 2.2 Academic & Curriculum (`AcademicModule`)
- **`GET /api/academic/programs`**: Lists accredited programs (e.g. Generic BSN, Post-RN BSN).
- **`GET /api/academic/curriculum`**: Returns semester-by-semester subject mapping, theory credit hours, practical lab hours, and PNC clinical hours.
- **`GET /api/academic/timetable`**: Returns weekly lecture schedule, hall locations, and course instructor names.

### 2.3 Attendance & PNC Compliance (`AttendanceModule`)
- **`GET /api/attendance/students/:id/summary`**: Returns student's overall attendance rate and subject-wise breakdown.
- **`GET /api/attendance/classes/:classId/subjects/:subjectId`**: Returns session logs.
- **Automated PNC Exam Threshold Engine**:
  - Calculates whether a student meets the minimum required attendance (e.g., 75% PNC rule or 80% HEC distinction).
  - If `< 75%`, marks student as `BARRED` and dispatches an automated alert.

### 2.4 Examinations & Absolute GPA Engine (`ExamsModule`)
- **`GET /api/exams/student/:studentId/results`**: Returns verified marks obtained across all completed examination components.
- **`GET /api/exams/transcript/:studentId`**: Generates digitally signed semester transcript with official seal.
- **Absolute Grading Formula**:
  - **A+** (85.0% - 100%): 4.00 Grade Points
  - **A** (80.0% - 84.9%): 3.70 Grade Points
  - **B+** (75.0% - 79.9%): 3.30 Grade Points
  - **B** (70.0% - 74.9%): 3.00 Grade Points
  - **C+** (65.0% - 69.9%): 2.70 Grade Points
  - **C** (60.0% - 64.9%): 2.30 Grade Points
  - **D** (50.0% - 59.9%): 2.00 Grade Points
  - **F** (< 50.0%): 0.00 Grade Points (Fail)

### 2.5 PNC 1200 Hours Clinical Training (`ClinicalModule`)
- **`GET /api/clinical/rotations`**: Fetches active hospital ward rotations (e.g. ICU Ward, Emergency, Pediatric).
- **`GET /api/clinical/skills`**: Fetches standard PNC procedural competencies.
- **`POST /api/clinical/logs`**: Allows students to submit bedside procedure logs (e.g. IV Cannulation, BLS CPR, Catheterization) for clinical supervisor sign-off.
- **`GET /api/clinical/students/:id/logbook`**: Aggregates completed hours against the 1200-hour PNC graduation requirement.

### 2.6 Finance & Tuition Ledger (`FinanceModule`)
- **`GET /api/finance/students/:id/invoices`**: Returns semester tuition fee challans, merit scholarships, and payment history.
- **`GET /api/finance/invoices/:id`**: Downloads itemized fee voucher receipts.

### 2.7 Library & Digital Stacks (`LibraryModule`)
- **`GET /api/library/books`**: Searches catalog titles, authors, and shelf/bay locations.
- **`GET /api/library/students/:id/issues`**: Retrieves currently borrowed books, return due dates, and fine balance.

### 2.8 Real-Time WebSockets (`apps/ws` on Port 4000)
- Standalone WebSocket server running on `ws://localhost:4000`.
- Auto-joins room `user:<studentId>` and `role:STUDENT`.
- Pushes real-time notifications:
  - `ATTENDANCE_ALERT`: Warnings when attendance drops below the 75% cutoff.
  - `FEE_ALERT`: Upcoming fee challan due dates.
  - `EXAM_RESULT`: Notification when exam results are published.
  - `CLINICAL_SIGN_OFF`: Alerts when a clinical supervisor verifies a bedside procedure.

---

## 3. Frontend Architecture & User Interface

The frontend is built with **Next.js 15 App Router**, **React 19**, and **Tailwind CSS**.

### 3.1 Student Portal Command Center (`/`)
When a student logs in, the root route (`/`) automatically renders the **`StudentPortalDashboard`**:
1. **Core Metrics Bar**:
   - 🛡️ **PNC Attendance**: `91.4% Overall Attendance` (Exam Eligible)
   - 🩺 **Clinical Logbook**: `840 / 1200 Hours` (70.0% Complete)
   - 🎓 **Cumulative Standing**: `CGPA 3.82` (Rank #1 in Class Cohort)
   - 💳 **Financial Balance**: `₨ 0 Due` (Semester 6 Tuition Cleared)
2. **Today's Live Schedule Banner**:
   - `08:00 AM - 02:00 PM`: Teaching Hospital ICU Ward Duty (Supervisor: *Sister Farida Bano*)
   - `02:30 PM - 04:00 PM`: Adult Health Nursing II (Lecture Hall 3 - *Dr. Tariq Mahmood*)
3. **Degree Progress Tracker (`DegreeProgressCard`)**:
   - Visual dual-meter displaying total academic credits earned (`94 / 136 Cr - 69.1%`) and clinical hours completed (`840 / 1200h`).
   - PNC graduation clearance verification checklist.

---

### 3.2 Dedicated Route Experiences for Students

| Route | Student View Experience | Administrative Gating |
| :--- | :--- | :--- |
| **`/attendance`** | **`StudentAttendanceReport`**: Dynamic 75%/80%/70% exam rule selector, subject progress bars, `Allowed for Exam` / `Barred` status indicators, and verified attendance session history. | Batch marking roster is hidden; students cannot mark attendance. |
| **`/academic`** | **Enrolled Curriculum View**: Generic BSN semester syllabus, 18 credit hours breakdown, course instructor contacts, and weekly timetable. | "Create Program" and "Assign Course" buttons hidden behind `RoleGate`. |
| **`/exams`** | **Academic Transcript & Results View**: Published marks, letter grades (`A+`/`A`), GP, term GPA (`3.82`), admit card eligibility, and transcript PDF download. | Exam creation and teacher marks entry grids hidden behind `RoleGate`. |
| **`/clinical`** | **1200h Clinical Logbook View**: Hospital ward rotations, bedside procedure competency counters, supervisor sign-offs, and procedure logging modal. | Hospital site and rotation creation tools hidden behind `RoleGate`. |
| **`/finance`** | **Tuition Ledger View**: Semester fee status (`₨ 0 Due`), 30% Merit Scholarship waiver credit, paid bank wire history, and receipt downloads. | Fee structure creation and invoice generator hidden behind `RoleGate`. |
| **`/library`** | **Student Library Card View**: Borrowed books (`2 of 3 Books Active`), return due dates, zero fines status, and digital stacks catalog search. | Loan desk check-in/check-out tools hidden behind `RoleGate`. |
| **`/facilities`** | **Campus Pass View**: Florence Nightingale Hostel Room #204 Bed #2 allocation and Commuter Transport Route 1 bus seat pass. | Facility management tools hidden behind `RoleGate`. |

---

## 4. Verification & Testing Standards

- **Turborepo Build Pipeline**: All 3 workspaces (`@pern/api`, `@pern/web` with 38 static/dynamic routes, and `@pern/ws`) compile with **0 errors**.
- **Backend Jest Test Suites**: 6/6 test suites and 20/20 test cases pass 100%.
- **Live Role Persona Switching**: Builtin Persona Switcher in the topbar enables instant toggling between `STUDENT` (*Amina Bibi*), `FACULTY` (*Dr. Tariq Mahmood*), and `COLLEGE_ADMIN` (*Prof. Muhammad Asif*) for end-to-end user experience testing.
