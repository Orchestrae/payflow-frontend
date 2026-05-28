# PayFlow Admin Dashboard

React frontend for [PayFlow](https://github.com/Orchestrae/payflow-backend) — an automated payroll platform for Nigerian and Ghanaian businesses.

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router v6
- TanStack Query (React Query)
- React Hook Form + Zod
- Zustand (auth state)
- Framer Motion (animations)
- Lucide React (icons)
- react-hot-toast (notifications)

## Quick Start

```bash
npm install
cp .env.example .env
npm run dev
```

Open http://localhost:5173. The Vite dev server proxies `/v1` API calls to the backend at `localhost:8080`.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:8080` | Backend API URL |

## Pages (27)

### Auth
- Login, Accept Invitation, Forgot Password, Reset Password

### Dashboard
- Summary cards: employees, payroll cost, balance, pending approvals

### Employees
- List, Create, Edit, CSV Import

### Cadres
- List, Create, Edit (with earning components + ComponentType)

### Deduction Rules
- List, Create, Edit

### Payroll
- List, Create, Detail (with statutory deductions + employer costs)
- Submit, Approve, Reject, Process Now
- Reports download (PAYE, Pension, NHF, Bank Schedule, Summary CSV)
- Payslips download (individual PDF, bulk ZIP)

### Transfers
- List, New Transfer (with provider selection), Batch Transfer, Retry Failed

### Wallet
- Overview (balance, virtual account), Transaction History

### Settings
- Business Settings (toggle statutory deductions)
- Invite User, Team Members, Audit Logs

## Deployment

Deployed on Vercel. Set `VITE_API_URL` to your production backend URL.

## Backend

The Go backend is at [Orchestrae/payflow-backend](https://github.com/Orchestrae/payflow-backend).
