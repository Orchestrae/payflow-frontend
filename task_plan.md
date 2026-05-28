# PayFlow Frontend — Task Plan

## Goal
Build a production-grade React admin dashboard for PayFlow (Nigerian payroll SaaS). 29 pages across 9 modules. Must look like a real fintech product (Paystack/Mono quality).

## Tech Stack
React 18 + Vite + TypeScript, TailwindCSS, React Router v6, Axios, TanStack Query v5, React Hook Form + Zod, Zustand, Framer Motion, react-hot-toast, Lucide React, date-fns, Recharts

## Phases

### Phase 1: Project Scaffold `status:complete`
- [x] Create Vite + React + TypeScript project
- [x] Install all dependencies
- [x] Configure Tailwind v4, tsconfig with path aliases, vite.config with proxy
- [x] Create .env.example with VITE_API_URL
- [x] Set up directory structure (api/, components/, hooks/, pages/, store/, types/, utils/)

### Phase 2: Infrastructure `status:complete`
- [x] TypeScript types (30+ interfaces matching Go domain models exactly)
- [x] Axios client with auth interceptor + 401 handler
- [x] Zustand auth store (token, user, sidebar, localStorage persistence)
- [x] 11 API modules (auth, employees, cadres, deductions, payroll, transfers, wallet, dashboard, settings, audit)
- [x] 30+ React Query hooks with mutations and toast notifications
- [x] Utility functions (formatNGN, parseNGNToKobo, formatDate, formatPeriod, 30+ Nigerian banks, role checks)
- [x] 6 UI components (Button, Card, Input, Select, Modal, Toggle)
- [x] 6 shared components (StatusBadge, CurrencyDisplay, EmptyState, Skeleton, Pagination, ErrorBoundary)
- [x] Layout components (AuthLayout, DashboardLayout with Sidebar + TopBar)
- [x] Routes with lazy loading + ProtectedRoute + RoleGuard

### Phase 3: Auth Pages `status:complete`
- [x] Login page (email + password, JWT storage)
- [x] Accept Invitation page (token from URL, set password)
- [x] Forgot Password page (email form, success state)
- [x] Reset Password page (token from URL, new password)

### Phase 4: Dashboard `status:complete`
- [x] Dashboard page with 6 summary cards (employees, active, payroll runs, pending approvals, wallet balance, last payroll cost)

### Phase 5: Employee Management `status:complete`
- [x] Employee List (table, search, filter by status, deactivate with confirm modal)
- [x] Create Employee form (all fields including TIN, pension RSA PIN, NHF, annual rent, bank selector)
- [x] Edit Employee form (pre-populated from API)
- [x] CSV Import (drag-and-drop, results table with error rows)

### Phase 6: Cadre Management `status:complete`
- [x] Cadre List (expandable rows showing earning components and totals)
- [x] Create/Edit Cadre (dynamic earning component rows with type selector)

### Phase 7: Deduction Rules `status:complete`
- [x] Deduction Rules List with delete confirmation
- [x] Create/Edit Rule (percentage/flat toggle, value, calculation basis)

### Phase 8: Payroll `status:complete`
- [x] Payroll Runs List (status badges, period, totals, clickable rows)
- [x] Create Payroll Run (month picker, defaults to current month)
- [x] Payroll Detail (expandable entries: earnings, statutory deductions, employer costs, net pay, cost to company)
- [x] Workflow Actions (Submit, Approve, Reject with reason modal, Process Now — role+status aware)
- [x] Reports Download (PAYE, pension, NHF, bank schedule, summary CSVs)
- [x] Payslips (individual PDF per employee, bulk ZIP)

### Phase 9: Transfers `status:complete`
- [x] Transfer List (status badges, provider, bank name, retry on failed)
- [x] New Transfer form (provider selector, amount in NGN, bank dropdown, narration)
- [x] Batch Transfer (multi-row form with add/remove)
- [x] Retry Failed (retry button on failed transfers)

### Phase 10: Wallet `status:complete`
- [x] Wallet Overview (balance card, virtual account details, locked balance indicator)
- [x] Transaction History (paginated table with type badges, amount coloring)

### Phase 11: Settings `status:complete`
- [x] Business Settings (toggle switches for PAYE, pension, NHF, NSITF, approval workflow, auto-process)
- [x] Invite User (email + role dropdown, success confirmation state)
- [x] Team Members list
- [x] Audit Logs (paginated table with action badges)

## Architecture Decisions
- Zustand: auth state only (token, user, sidebar collapsed)
- React Query: all server state with query key convention ['resource', ...params]
- API layer: thin pass-through, kobo→NGN conversion at display layer
- Code splitting: React.lazy for all pages, main bundle has layouts + UI
- Role-based access: ProtectedRoute (auth check) + RoleGuard (role check)
- Forms: React Hook Form + Zod for validation
- Error handling: global toast on query errors, inline Zod errors on forms

## Errors Encountered
| Error | Attempt | Resolution |
|-------|---------|------------|
| TS deprecated baseUrl warning | 1 | Added `ignoreDeprecations: "6.0"` to tsconfig |
| Zod v4 enum API changed | 1 | Changed `required_error` to `message` in z.enum() calls |

## Final Stats
- 66 source files
- 0 TypeScript errors
- Vite build: 1.65s
- Bundle: ~350KB main + lazy-loaded chunks
