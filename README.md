# EduSaaS: Modern Multi-Tenant School Management System

> A scalable, TypeScript-first, multi-tenant SaaS School Management Platform built as a high-density, production-ready modular monolith.

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Better Auth](https://img.shields.io/badge/Better_Auth-1.7-indigo)](https://www.better-auth.com/)
[![Tests](https://img.shields.io/badge/Tests-Vitest_Passing-brightgreen?logo=vitest)](https://vitest.dev/)

---

## 1. Project Overview

**EduSaaS** is an institutional school operations platform designed from the ground up for multi-tenancy. From a single deployment, multiple independent schools operate with strict database partitioning, custom branding, and institutional isolation. 

The platform supports the entire academic lifecycle: prospective student admissions, active student census, staff allocations, daily roll call attendance, examinations with gradebook approval workflows, tuition fee invoicing, receipts, and parent notifications.

---

## 2. System Architecture

The codebase adheres strictly to a unidirectional layered modular monolith:

```
[UI Surface: Next.js Client Components / Forms / TanStack Tables]
                              │
                              ▼
        [Server Actions & API Route Handlers]
                              │
                              ▼
     [Tenant & Session Resolver (Subdomain / Slug / Headers)]
                              │
                              ▼
    [Authorization Guard (10-Role Granular RBAC Check)]
                              │
                              ▼
         [Input Validation (Zod Type Schemas)]
                              │
                              ▼
         [Domain Services (Pure Business Logic)]
                              │
                              ▼
     [Tenant-Scoped Prisma ORM (schoolId Enforced)]
                              │
                              ▼
          [PostgreSQL Database (Normalized)]
```

### Architectural Principles
1. **Zero Direct DB Access from UI**: All mutations flow through validated Server Actions.
2. **Guaranteed Tenant Partitioning**: `getTenantPrisma(schoolId)` automatically injects `schoolId` and active status filters into queries, preventing cross-school data contamination.
3. **Defense-in-Depth Authorization**: Every sensitive mutation validates session and granular permissions server-side.
4. **Resilient Offline/Build Mode**: Pages gracefully handle unseeded or preview builds with high-fidelity fallbacks.

---

## 3. Key Functional Modules

| Module | Description | Key Capabilities |
| :--- | :--- | :--- |
| **Multi-Tenancy** | Fleet governance & isolated school tenants | Subdomain / slug routing, institution branding, currency configs, Super Admin platform portal |
| **Students Census** | Complete learner directory | Auto-generated admission numbers, academic grade assignment, guardian linking, TanStack Data Table |
| **Admissions Pipeline** | Candidate intake workflow | Online applications, review stages (`PENDING`, `APPROVED`), one-click conversion to enrolled student |
| **Finance & Billing** | Tuition invoicing & collections ledger | Line-item invoice generation, partial/full payment recording, balance calculations, printable receipts |
| **Daily Attendance** | Fast roll call tracking | Date-picker rosters, one-click "Mark All Present", status toggles (`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`) |
| **Examinations** | Academic gradebook & assessments | Exam schedules, marks entry, admin approval gate, automated publication broadcasts to guardians |
| **Academics** | Structural hierarchy | Classrooms, grade levels, seating capacities, subjects, and teacher assignments |
| **Faculty & Staff** | Personnel directory | Staff ID registry, department allocations, role-based badge visualization |
| **Communications** | Multi-channel messaging | School announcements dispatched across Resend Email, SMS adapters, and student portals |
| **Document Registry** | Object storage & metadata | Supabase Object Storage with MIME type & size verification, plus PostgreSQL document tracking |

---

## 4. Granular Role-Based Access Control (RBAC)

The system enforces permissions across 10 specialized roles:

1. **Super Admin**: Platform-wide cross-tenant control, school provisioning, audit logs.
2. **School Administrator**: Full management within their single school tenant.
3. **Principal**: Academic oversight, results verification, admission approvals, staff read.
4. **Teacher**: Attendance roll call, examination marks entry, classroom roster view.
5. **Accountant**: Fee structures, invoice issuance, bursar payments, revenue ledgers.
6. **Admissions Officer**: Application review, interview scheduling, applicant management.
7. **Parent**: Child profile, attendance records, exam results, pending fee invoices.
8. **Student**: Class timetable, personal attendance rates, published grade reports.
9. **Librarian**: Student census access, library document circulation.
10. **Receptionist**: Visitor inquiry handling, attendance verification, parent contacts.

---

## 5. Technology Stack

- **Frontend Framework**: Next.js 16 (App Router) & React 19
- **Language**: TypeScript (Strict Mode)
- **Styling & UI**: Tailwind CSS v4, shadcn/ui design tokens
- **Data Tables**: TanStack Table v8 (sorting, filtering, searching, pagination)
- **Data Visualizations**: Recharts (Monthly fee collections, weekly attendance rates)
- **Forms & Validation**: React Hook Form + Zod
- **Database**: PostgreSQL (Normalized relational design with indexes and cascading rules)
- **ORM**: Prisma ORM v6
- **Authentication**: Better Auth (Secure sessions, role claims, email/password)
- **Email Service**: Resend API integration
- **SMS Integration**: Abstracted `NotificationService` (Twilio / Africa's Talking)
- **File Storage**: Supabase Object Storage
- **Testing**: Vitest (Unit & Integration)
- **Hosting & CI/CD**: Vercel & GitHub Actions

---

## 6. Directory Layout

```text
src/
├── app/
│   ├── (auth)/login/page.tsx            # Better Auth login surface
│   ├── (platform)/super-admin/page.tsx  # Super Admin fleet management
│   ├── [schoolSlug]/                    # Tenant-isolated routes
│   │   ├── dashboard/page.tsx           # Executive Cockpit
│   │   ├── students/                    # Census directory & enrollment
│   │   ├── admissions/                  # Applicant review & conversion
│   │   ├── finance/                     # Tuition invoices & payments
│   │   ├── attendance/                  # Daily roll call roster
│   │   ├── examinations/                # Assessments & gradebook
│   │   ├── academics/                   # Classes & curriculum
│   │   ├── staff/                       # Faculty directory
│   │   ├── communication/               # School announcements
│   │   ├── documents/                   # Object storage registry
│   │   └── settings/                    # Tenant branding & currency
│   ├── api/auth/[...all]/route.ts       # Better Auth route handler
│   └── page.tsx                         # SaaS landing page & tenant switcher
├── components/
│   ├── ui/                              # shadcn/ui buttons, cards, inputs, badges
│   ├── layout/                          # AppSidebar, TenantHeader, RoleBadge
│   ├── tables/                          # Reusable TanStack DataTable
│   ├── charts/                          # Recharts fee collection & attendance graphs
│   └── forms/                           # StudentEnrollmentForm & InvoiceCreationForm
├── lib/
│   ├── auth/                            # Better Auth configuration & client
│   ├── db/                              # Prisma singleton & tenant isolation extension
│   ├── permissions/                     # RBAC matrix & authorization guard
│   ├── tenant/                          # Subdomain & header tenant resolver
│   ├── storage/                         # Supabase storage validator
│   ├── notifications/                   # NotificationService (Email + SMS)
│   ├── pdf/                             # Structured invoice/receipt PDF generator
│   └── utils.ts                         # Formatting & class merger helpers
├── services/                            # Domain services (Students, Finance, etc.)
├── actions/                             # Next.js Server Actions
└── __tests__/                           # Vitest test suite
```

---

## 7. Getting Started

### Prerequisites
- Node.js 20+ or 22+
- npm or pnpm
- PostgreSQL database (local, Supabase, or Neon)

### 1. Clone & Install
```bash
git clone https://github.com/Thabisomaqhawengwenya/school_management.git
cd school_management
npm install
```

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Configure your environment variables:
```env
# Database Connection
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/school_management?schema=public"
DIRECT_URL="postgresql://postgres:postgres@localhost:5432/school_management?schema=public"

# Better Auth Secret
AUTH_SECRET="your-secure-auth-secret-min-32-chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Supabase Storage
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"

# Resend Email & SMS
RESEND_API_KEY="re_your_api_key"
SMS_PROVIDER="twilio"
SMS_API_KEY="your_sms_key"
SMS_ACCOUNT_SID="your_account_sid"
```

### 3. Database Migration & Prisma Client
```bash
# Push schema to database
npx prisma db push

# Generate typed client
npm run db:generate
```

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portal.

---

## 8. Verification & Testing

Run the Vitest test suite covering RBAC permissions and Zod schema validations:

```bash
npm test
```

Execute a full production build:

```bash
npm run build
```

---

## 9. Deployment on Vercel

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set your Production Environment Variables (`DATABASE_URL`, `AUTH_SECRET`, etc.).
4. The repository includes `.npmrc` with `legacy-peer-deps=true` and a `postinstall` script that automatically generates the Prisma Client during deployment.

---

## 10. License

Licensed under the [MIT License](LICENSE).
