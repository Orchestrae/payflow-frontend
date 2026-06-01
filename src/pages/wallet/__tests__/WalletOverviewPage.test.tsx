import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WalletOverviewPage from '../WalletOverviewPage';

const mockWallet = vi.fn();

vi.mock('@/hooks/useApi', () => ({
  useWallet: () => mockWallet(),
}));

vi.mock('@/api/wallet', () => ({
  walletApi: {
    createVirtualAccount: vi.fn(),
    initiateDeposit: vi.fn(),
  },
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
        <WalletOverviewPage />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

describe('WalletOverviewPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders balance display', () => {
    mockWallet.mockReturnValue({
      data: {
        balance: 50000000,
        locked_balance: 0,
        virtual_account_number: '',
        provider: 'paystack',
      },
      isLoading: false,
    });

    renderPage();

    expect(screen.getByText('Available Balance')).toBeInTheDocument();
    expect(screen.getByText('NGN 500000.00')).toBeInTheDocument();
  });

  it('shows virtual account info when present', () => {
    mockWallet.mockReturnValue({
      data: {
        balance: 50000000,
        locked_balance: 0,
        virtual_account_number: '0123456789',
        virtual_account_bank_name: 'Wema Bank',
        virtual_account_status: 'active',
        provider: 'paystack',
      },
      isLoading: false,
    });

    renderPage();

    expect(screen.getByText('0123456789')).toBeInTheDocument();
    expect(screen.getByText('Wema Bank')).toBeInTheDocument();
    expect(screen.getByText('Virtual Account')).toBeInTheDocument();
  });

  it('shows create virtual account button when no account exists', () => {
    mockWallet.mockReturnValue({
      data: {
        balance: 0,
        locked_balance: 0,
        virtual_account_number: '',
        provider: 'paystack',
      },
      isLoading: false,
    });

    renderPage();

    expect(
      screen.getByRole('button', { name: /create virtual account/i })
    ).toBeInTheDocument();
  });
});
