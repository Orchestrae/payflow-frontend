import { lazy, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { SelfServiceLayout } from '@/components/layout/SelfServiceLayout';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';
import { RoleGuard } from '@/components/layout/RoleGuard';
import { TableSkeleton } from '@/components/shared/Skeleton';

// Lazy-loaded pages
const LandingPage = lazy(() => import('@/pages/LandingPage'));
const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const AcceptInvitePage = lazy(() => import('@/pages/auth/AcceptInvitePage'));
const ForgotPasswordPage = lazy(() => import('@/pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('@/pages/auth/VerifyEmailPage'));

const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));

const EmployeeListPage = lazy(() => import('@/pages/employees/EmployeeListPage'));
const CreateEmployeePage = lazy(() => import('@/pages/employees/CreateEmployeePage'));
const EditEmployeePage = lazy(() => import('@/pages/employees/EditEmployeePage'));
const ImportEmployeesPage = lazy(() => import('@/pages/employees/ImportEmployeesPage'));

const CadreListPage = lazy(() => import('@/pages/cadres/CadreListPage'));
const CreateCadrePage = lazy(() => import('@/pages/cadres/CreateCadrePage'));
const EditCadrePage = lazy(() => import('@/pages/cadres/EditCadrePage'));

const DeductionListPage = lazy(() => import('@/pages/deductions/DeductionListPage'));
const CreateDeductionPage = lazy(() => import('@/pages/deductions/CreateDeductionPage'));
const EditDeductionPage = lazy(() => import('@/pages/deductions/EditDeductionPage'));

const PayrollListPage = lazy(() => import('@/pages/payroll/PayrollListPage'));
const CreatePayrollPage = lazy(() => import('@/pages/payroll/CreatePayrollPage'));
const PayrollDetailPage = lazy(() => import('@/pages/payroll/PayrollDetailPage'));

const TransferListPage = lazy(() => import('@/pages/transfers/TransferListPage'));
const NewTransferPage = lazy(() => import('@/pages/transfers/NewTransferPage'));
const BatchTransferPage = lazy(() => import('@/pages/transfers/BatchTransferPage'));

const WalletOverviewPage = lazy(() => import('@/pages/wallet/WalletOverviewPage'));
const TransactionsPage = lazy(() => import('@/pages/wallet/TransactionsPage'));
const LedgerPage = lazy(() => import('@/pages/wallet/LedgerPage'));

const BusinessSettingsPage = lazy(() => import('@/pages/settings/BusinessSettingsPage'));
const InviteUserPage = lazy(() => import('@/pages/settings/InviteUserPage'));
const TeamMembersPage = lazy(() => import('@/pages/settings/TeamMembersPage'));
const AuditLogsPage = lazy(() => import('@/pages/settings/AuditLogsPage'));

const PlansPage = lazy(() => import('@/pages/billing/PlansPage'));
const SubscriptionPage = lazy(() => import('@/pages/billing/SubscriptionPage'));
const PlatformDashboardPage = lazy(() => import('@/pages/platform/PlatformDashboardPage'));
const OrganizationListPage = lazy(() => import('@/pages/platform/OrganizationListPage'));
const PlatformSettingsPage = lazy(() => import('@/pages/platform/PlatformSettingsPage'));
const ReconciliationDashboardPage = lazy(() => import('@/pages/platform/ReconciliationDashboardPage'));
const NotificationListPage = lazy(() => import('@/pages/notifications/NotificationListPage'));
const LoanListPage = lazy(() => import('@/pages/loans/LoanListPage'));
const CreateLoanPage = lazy(() => import('@/pages/loans/CreateLoanPage'));
const LeaveListPage = lazy(() => import('@/pages/leave/LeaveListPage'));
const CreateLeaveTypePage = lazy(() => import('@/pages/leave/CreateLeaveTypePage'));

// Employee self-service
const EmployeeLoginPage = lazy(() => import('@/pages/auth/EmployeeLoginPage'));
const SelfServiceDashboard = lazy(() => import('@/pages/self-service/SelfServiceDashboard'));
const SelfServicePayslips = lazy(() => import('@/pages/self-service/SelfServicePayslips'));
const SelfServiceLeave = lazy(() => import('@/pages/self-service/SelfServiceLeave'));
const SelfServiceProfile = lazy(() => import('@/pages/self-service/SelfServiceProfile'));
const SelfServiceLoans = lazy(() => import('@/pages/self-service/SelfServiceLoans'));

function SuspenseWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<TableSkeleton />}>
      {children}
    </Suspense>
  );
}

const router = createBrowserRouter([
  // Public landing page
  {
    path: '/',
    element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>,
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <SuspenseWrapper><LoginPage /></SuspenseWrapper> },
      { path: '/register', element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper> },
      { path: '/employee-login', element: <SuspenseWrapper><EmployeeLoginPage /></SuspenseWrapper> },
      { path: '/accept-invitation', element: <SuspenseWrapper><AcceptInvitePage /></SuspenseWrapper> },
      { path: '/forgot-password', element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper> },
      { path: '/reset-password', element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper> },
      { path: '/verify-email', element: <SuspenseWrapper><VerifyEmailPage /></SuspenseWrapper> },
    ],
  },
  // Employee self-service portal
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <RoleGuard allowedRoles={['employee']} />,
        children: [
          {
            element: <SelfServiceLayout />,
            children: [
              { path: '/self-service/dashboard', element: <SuspenseWrapper><SelfServiceDashboard /></SuspenseWrapper> },
              { path: '/self-service/payslips', element: <SuspenseWrapper><SelfServicePayslips /></SuspenseWrapper> },
              { path: '/self-service/leave', element: <SuspenseWrapper><SelfServiceLeave /></SuspenseWrapper> },
              { path: '/self-service/profile', element: <SuspenseWrapper><SelfServiceProfile /></SuspenseWrapper> },
              { path: '/self-service/loans', element: <SuspenseWrapper><SelfServiceLoans /></SuspenseWrapper> },
            ],
          },
        ],
      },
    ],
  },
  // Admin dashboard
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: '/dashboard',
            element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>,
          },
          // Employee routes (admin + operator)
          {
            element: <RoleGuard allowedRoles={['admin', 'operator']} />,
            children: [
              { path: '/employees', element: <SuspenseWrapper><EmployeeListPage /></SuspenseWrapper> },
              { path: '/employees/new', element: <SuspenseWrapper><CreateEmployeePage /></SuspenseWrapper> },
              { path: '/employees/:id/edit', element: <SuspenseWrapper><EditEmployeePage /></SuspenseWrapper> },
              { path: '/employees/import', element: <SuspenseWrapper><ImportEmployeesPage /></SuspenseWrapper> },
              // Cadre routes
              { path: '/cadres', element: <SuspenseWrapper><CadreListPage /></SuspenseWrapper> },
              { path: '/cadres/new', element: <SuspenseWrapper><CreateCadrePage /></SuspenseWrapper> },
              { path: '/cadres/:id/edit', element: <SuspenseWrapper><EditCadrePage /></SuspenseWrapper> },
            ],
          },
          // Deduction routes (admin only)
          {
            element: <RoleGuard allowedRoles={['admin']} />,
            children: [
              { path: '/deductions', element: <SuspenseWrapper><DeductionListPage /></SuspenseWrapper> },
              { path: '/deductions/new', element: <SuspenseWrapper><CreateDeductionPage /></SuspenseWrapper> },
              { path: '/deductions/:id/edit', element: <SuspenseWrapper><EditDeductionPage /></SuspenseWrapper> },
            ],
          },
          // Payroll routes (all roles can read, role-specific actions in component)
          {
            element: <RoleGuard allowedRoles={['admin', 'operator', 'approver']} />,
            children: [
              { path: '/payroll', element: <SuspenseWrapper><PayrollListPage /></SuspenseWrapper> },
              { path: '/payroll/new', element: <SuspenseWrapper><CreatePayrollPage /></SuspenseWrapper> },
              { path: '/payroll/:id', element: <SuspenseWrapper><PayrollDetailPage /></SuspenseWrapper> },
            ],
          },
          // Transfer routes (all authenticated)
          { path: '/transfers', element: <SuspenseWrapper><TransferListPage /></SuspenseWrapper> },
          { path: '/transfers/new', element: <SuspenseWrapper><NewTransferPage /></SuspenseWrapper> },
          { path: '/transfers/batch', element: <SuspenseWrapper><BatchTransferPage /></SuspenseWrapper> },
          // Wallet routes (all authenticated)
          { path: '/wallet', element: <SuspenseWrapper><WalletOverviewPage /></SuspenseWrapper> },
          { path: '/wallet/transactions', element: <SuspenseWrapper><TransactionsPage /></SuspenseWrapper> },
          { path: '/wallet/ledger', element: <SuspenseWrapper><LedgerPage /></SuspenseWrapper> },
          // Settings routes (admin only)
          {
            element: <RoleGuard allowedRoles={['admin']} />,
            children: [
              { path: '/settings', element: <SuspenseWrapper><BusinessSettingsPage /></SuspenseWrapper> },
              { path: '/settings/invite', element: <SuspenseWrapper><InviteUserPage /></SuspenseWrapper> },
              { path: '/settings/team', element: <SuspenseWrapper><TeamMembersPage /></SuspenseWrapper> },
              { path: '/settings/audit-logs', element: <SuspenseWrapper><AuditLogsPage /></SuspenseWrapper> },
            ],
          },
          // Notifications (all authenticated)
          { path: '/notifications', element: <SuspenseWrapper><NotificationListPage /></SuspenseWrapper> },
          // Loans (admin + operator)
          {
            element: <RoleGuard allowedRoles={['admin', 'operator']} />,
            children: [
              { path: '/loans', element: <SuspenseWrapper><LoanListPage /></SuspenseWrapper> },
              { path: '/loans/new', element: <SuspenseWrapper><CreateLoanPage /></SuspenseWrapper> },
            ],
          },
          // Leave (all roles)
          {
            element: <RoleGuard allowedRoles={['admin', 'operator', 'approver']} />,
            children: [
              { path: '/leave', element: <SuspenseWrapper><LeaveListPage /></SuspenseWrapper> },
              { path: '/leave/types/new', element: <SuspenseWrapper><CreateLeaveTypePage /></SuspenseWrapper> },
            ],
          },
          // Billing (admin)
          {
            element: <RoleGuard allowedRoles={['admin']} />,
            children: [
              { path: '/billing', element: <SuspenseWrapper><PlansPage /></SuspenseWrapper> },
              { path: '/billing/subscription', element: <SuspenseWrapper><SubscriptionPage /></SuspenseWrapper> },
            ],
          },
          // Platform Admin (super_admin only)
          {
            element: <RoleGuard allowedRoles={['super_admin']} />,
            children: [
              { path: '/platform', element: <SuspenseWrapper><PlatformDashboardPage /></SuspenseWrapper> },
              { path: '/platform/organizations', element: <SuspenseWrapper><OrganizationListPage /></SuspenseWrapper> },
              { path: '/platform/settings', element: <SuspenseWrapper><PlatformSettingsPage /></SuspenseWrapper> },
              { path: '/platform/reconciliation', element: <SuspenseWrapper><ReconciliationDashboardPage /></SuspenseWrapper> },
            ],
          },
        ],
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
