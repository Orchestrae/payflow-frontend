# PayFlow Frontend — Findings

## API Key Facts
- Base URL: http://localhost:8080, configurable via VITE_API_URL
- Auth: JWT Bearer token, claims: user_id, business_id, role (admin/operator/approver)
- All money in kobo (int64). 30000000 kobo = NGN 300,000.00
- Dates: ISO 8601 from API
- Rate limits: 100 req/sec global, 5 req/sec auth endpoints
- Responses include X-Request-ID header

## API Endpoints Summary
- Auth: register, login, invite, accept-invitation, forgot-password, reset-password
- Dashboard: GET /v1/dashboard
- Employees: CRUD + deactivate + CSV import
- Cadres: CRUD with earning components + deduction rule linking
- Deduction Rules: CRUD (admin only)
- Payroll: CRUD + submit/approve/reject/process-now + 6 report types + payslips
- Transfers: single, batch, list, get, retry
- Wallet: get, balance, transactions, virtual-account, account-holders
- Settings: GET/PATCH business settings
- Audit: GET /v1/audit-logs

## Payroll Status Machine
draft → pending_approval → approved → processing → completed
                |                          |
                v                          v
            rejected                     failed

## Role Access Matrix
- Admin: everything
- Operator: cadres, employees, payroll (create/submit/process), transfers, wallet
- Approver: payroll (read/approve/reject), transfers, wallet

## Key Response Shapes (from API docs)
- Employee fields: full_name, email, cadre_id, bank_name, bank_code, bank_account_number, is_active, TIN, PensionRSAPIN, NHFNumber, AnnualRentPaid
- EarningComponent: name, amount (kobo), component_type (basic/housing/transport/other)
- Transfer amount field is STRING in API (not int)
- Cadre create: earning_components array + deduction_rule_ids
- PayrollRun entries have Details array with Type (earning/deduction), Name, Amount
