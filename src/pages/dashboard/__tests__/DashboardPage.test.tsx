import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import DashboardPage from '../DashboardPage';

const mockDashboard = vi.fn();

vi.mock('@/hooks/useApi', () => ({
  useDashboard: () => mockDashboard(),
}));

vi.mock('@/utils/currency', () => ({
  formatNGN: (v: number) => `NGN ${(v / 100).toFixed(2)}`,
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <DashboardPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('DashboardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeletons when data is loading', () => {
    mockDashboard.mockReturnValue({ data: undefined, isLoading: true });
    const { container } = renderPage();

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    const skeletons = container.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders summary cards with correct numbers', () => {
    mockDashboard.mockReturnValue({
      data: {
        total_employees: 25,
        active_employees: 20,
        payroll_runs: 6,
        pending_approvals: 2,
        wallet_balance: 10000000,
        last_payroll_cost: 5000000,
      },
      isLoading: false,
    });

    renderPage();

    expect(screen.getByText('Total Employees')).toBeInTheDocument();
    expect(screen.getByText('25')).toBeInTheDocument();
    expect(screen.getByText('Active Employees')).toBeInTheDocument();
    expect(screen.getByText('20')).toBeInTheDocument();
    expect(screen.getByText('Payroll Runs')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('Pending Approvals')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('Wallet Balance')).toBeInTheDocument();
    expect(screen.getByText('NGN 100000.00')).toBeInTheDocument();
  });
});
