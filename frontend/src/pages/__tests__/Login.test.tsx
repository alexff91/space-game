import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import Login from '@/pages/Login';

const mockLogin = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    login: mockLogin,
    isLoading: false,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('Login Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render login form with title', () => {
    render(<Login />);

    expect(screen.getByText('Welcome Back')).toBeInTheDocument();
    expect(
      screen.getByText('Sign in to continue your journey')
    ).toBeInTheDocument();
  });

  it('should render email and password inputs', () => {
    render(<Login />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should render Sign In button', () => {
    render(<Login />);

    expect(
      screen.getByRole('button', { name: 'Sign In' })
    ).toBeInTheDocument();
  });

  it('should render link to register page', () => {
    render(<Login />);

    expect(screen.getByText('Sign up')).toBeInTheDocument();
    expect(screen.getByText('Sign up').closest('a')).toHaveAttribute(
      'href',
      '/register'
    );
  });

  it('should allow typing in email and password fields', async () => {
    const user = userEvent.setup();
    render(<Login />);

    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    await user.type(emailInput, 'user@example.com');
    await user.type(passwordInput, 'mypassword');

    expect(emailInput).toHaveValue('user@example.com');
    expect(passwordInput).toHaveValue('mypassword');
  });

  it('should call login on form submission', async () => {
    mockLogin.mockResolvedValue(undefined);
    const user = userEvent.setup();
    render(<Login />);

    await user.type(screen.getByLabelText('Email'), 'user@example.com');
    await user.type(screen.getByLabelText('Password'), 'mypassword');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'mypassword');
  });
});
