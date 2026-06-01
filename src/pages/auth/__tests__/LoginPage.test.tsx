import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../LoginPage';

const mockLogin = vi.fn();
const mockSetAuth = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/api/auth', () => ({
  authApi: {
    login: (...args: any[]) => mockLogin(...args),
  },
}));

vi.mock('@/store/authStore', () => ({
  useAuthStore: (selector: any) => selector({ setAuth: mockSetAuth }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function renderLoginPage() {
  return render(
    <BrowserRouter>
      <LoginPage />
    </BrowserRouter>
  );
}

describe('LoginPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form with email and password fields', () => {
    renderLoginPage();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('shows validation error for empty fields on submit', async () => {
    const user = userEvent.setup();
    renderLoginPage();

    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(screen.getByText(/enter a valid email/i)).toBeInTheDocument();
    });
  });

  it('submits form and calls API with credentials', async () => {
    mockLogin.mockResolvedValue({
      data: {
        token: 'test-token',
        user: { id: 1, email: 'admin@test.com', role: 'admin' },
      },
    });

    const user = userEvent.setup();
    renderLoginPage();

    await user.type(screen.getByLabelText(/email/i), 'admin@test.com');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('admin@test.com', 'password123');
      expect(mockSetAuth).toHaveBeenCalledWith('test-token', {
        id: 1,
        email: 'admin@test.com',
        role: 'admin',
      });
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
    });
  });
});
