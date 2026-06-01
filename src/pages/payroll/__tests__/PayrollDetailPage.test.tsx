import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import PayrollDetailPage from '../PayrollDetailPage';

const mockPayrollRun = vi.fn();

vi.mock('@/hooks/useApi', () => ({
  usePayrollRun: () => mockPayrollRun(),
  useSubmitPayroll: () => ({ mutate: vi.fn(), isPending: false }),
  useApprovePayroll: () => ({ mutate: vi.fn(), isPending: false }),
  useRejectPayroll: () => ({ mutate: vi.fn(), isPending: false }),
  useProcessPayroll: () => ({ mutate: vi.fn(), isPending: false }),
  useAmendPayroll: () => ({ mutate: vi.fn(), isPending: false }),
  useReversePayroll: () => ({ mutate: vi.fn(), isPending: false }),
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector: any) =>
    selector({ user: { role: 'admin' } }),
}));

vi.mock('@/utils/roles', () => ({
  hasRole: () => true,
}));

vi.mock('@/utils/currency', () => ({
  formatNGN: (v: number) => `NGN ${(v / 100).toFixed(2)}`,
}));

vi.mock('@/utils/date', () => ({
  formatPeriod: (p: string) => p,
}));

vi.mock('@/api/payroll', () => ({
  payrollApi: {
    downloadReport: vi.fn(),
    downloadPayslip: vi.fn(),
    downloadAllPayslips: vi.fn(),
  },
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/payroll/1']}>
        <Routes>
          <Route path="/payroll/:id" element={<PayrollDetailPage />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  );
}

describe('PayrollDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders payroll details with status badge', () => {
    mockPayrollRun.mockReturnValue({
      data: {
        id: 1,
        period: '2026-01',
        status: 'completed',
        total_gross_pay: 50000000,
        total_deductions: 10000000,
        total_net_pay: 40000000,
        total_employer_costs: 5000000,
        total_cost_to_company: 55000000,
        entries: [],
      },
      isLoading: false,
    });

    renderPage();

    expect(screen.getByText('2026-01')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('shows entries table with employee breakdown', () => {
    mockPayrollRun.mockReturnValue({
      data: {
        id: 1,
        period: '2026-01',
        status: 'draft',
        total_gross_pay: 50000000,
        total_deductions: 10000000,
        total_net_pay: 40000000,
        total_employer_costs: 5000000,
        total_cost_to_company: 55000000,
        entries: [
          {
            id: 10,
            employee_id: 1,
            gross_pay: 25000000,
            net_pay: 20000000,
            total_cost_to_company: 27500000,
            employee: { full_name: 'John Doe', email: 'john@test.com' },
            details: [],
          },
        ],
      },
      isLoading: false,
    });

    renderPage();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Employee Breakdown (1)')).toBeInTheDocument();
  });
});
