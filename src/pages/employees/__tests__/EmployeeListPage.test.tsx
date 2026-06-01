import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EmployeeListPage from '../EmployeeListPage';

const mockEmployees = vi.fn();
const mockDeactivate = vi.fn();

vi.mock('@/hooks/useApi', () => ({
  useEmployees: () => mockEmployees(),
  useDeactivateEmployee: () => ({
    mutate: mockDeactivate,
    isPending: false,
  }),
}));

function renderPage() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <EmployeeListPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('EmployeeListPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading skeleton initially', () => {
    mockEmployees.mockReturnValue({ data: undefined, isLoading: true });
    const { container } = renderPage();
    // TableSkeleton renders animated pulse divs
    const pulseElements = container.querySelectorAll('.animate-pulse');
    expect(pulseElements.length).toBeGreaterThan(0);
  });

  it('shows employee table when data loads', () => {
    mockEmployees.mockReturnValue({
      data: [
        {
          id: 1,
          full_name: 'John Doe',
          email: 'john@test.com',
          bank_name: 'GTBank',
          bank_account_verified: true,
          bank_account_name: 'John Doe',
          is_active: true,
        },
        {
          id: 2,
          full_name: 'Jane Smith',
          email: 'jane@test.com',
          bank_name: 'Access Bank',
          bank_account_verified: false,
          is_active: false,
        },
      ],
      isLoading: false,
    });

    renderPage();

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('jane@test.com')).toBeInTheDocument();
    expect(screen.getByText('GTBank')).toBeInTheDocument();
  });

  it('shows empty state when no employees', () => {
    mockEmployees.mockReturnValue({ data: [], isLoading: false });
    renderPage();

    expect(screen.getByText(/no employees yet/i)).toBeInTheDocument();
  });
});
