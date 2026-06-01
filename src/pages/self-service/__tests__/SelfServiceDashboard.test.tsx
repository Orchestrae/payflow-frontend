import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SelfServiceDashboard from '../SelfServiceDashboard';

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector: any) =>
    selector({ user: { full_name: 'Ada Obi', role: 'employee' } }),
}));

vi.mock('@/api/self-service', () => ({
  selfServiceApi: {
    getPayslips: vi.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          period: '2026-05',
          gross_pay: 50000000,
          total_deductions: 10000000,
          net_pay: 40000000,
        },
        {
          id: 2,
          period: '2026-04',
          gross_pay: 50000000,
          total_deductions: 10000000,
          net_pay: 40000000,
        },
      ],
    }),
    getLeaveRequests: vi.fn().mockResolvedValue({
      data: [{ id: 1, status: 'pending' }],
    }),
    getLoans: vi.fn().mockResolvedValue({
      data: [
        { id: 1, status: 'active', remaining_balance: 200000 },
      ],
    }),
  },
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SelfServiceDashboard />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('SelfServiceDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders employee dashboard with greeting', async () => {
    renderPage();

    expect(screen.getByText(/welcome back, ada/i)).toBeInTheDocument();
    expect(
      screen.getByText(/here is a summary of your pay and benefits/i)
    ).toBeInTheDocument();
  });

  it('shows recent payslips section', async () => {
    renderPage();

    expect(screen.getByText('Recent Payslips')).toBeInTheDocument();
    expect(screen.getByText(/view all/i)).toBeInTheDocument();
  });
});
