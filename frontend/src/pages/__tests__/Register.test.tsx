import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import Register from '@/pages/Register';

const mockRegister = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/store/authStore', () => ({
  useAuthStore: () => ({
    register: mockRegister,
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

describe('Register Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render registration form with title', () => {
    render(<Register />);

    expect(screen.getByText('Join AstroQuest')).toBeInTheDocument();
    expect(
      screen.getByText('Start your cosmic adventure today')
    ).toBeInTheDocument();
  });

  it('should render all required form fields', () => {
    render(<Register />);

    expect(screen.getByLabelText('Username')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
  });

  it('should render Create Account button', () => {
    render(<Register />);

    expect(
      screen.getByRole('button', { name: 'Create Account' })
    ).toBeInTheDocument();
  });

  it('should render link to login page', () => {
    render(<Register />);

    expect(screen.getByText('Sign in')).toBeInTheDocument();
    expect(screen.getByText('Sign in').closest('a')).toHaveAttribute(
      'href',
      '/login'
    );
  });

  it('should allow filling in the form', async () => {
    const user = userEvent.setup();
    render(<Register />);

    await user.type(screen.getByLabelText('Username'), 'spacefan');
    await user.type(screen.getByLabelText('Email'), 'space@fan.com');
    await user.type(screen.getByLabelText('Password'), 'secure123');
    await user.type(screen.getByLabelText('Confirm Password'), 'secure123');

    expect(screen.getByLabelText('Username')).toHaveValue('spacefan');
    expect(screen.getByLabelText('Email')).toHaveValue('space@fan.com');
  });
});
