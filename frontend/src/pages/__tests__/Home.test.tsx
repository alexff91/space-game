import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Home from '@/pages/Home';

const mockAuthStore = {
  isAuthenticated: false,
};

vi.mock('@/store/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Home Page', () => {
  beforeEach(() => {
    mockAuthStore.isAuthenticated = false;
  });

  it('should render the hero title', () => {
    render(<Home />);
    expect(screen.getByText('Explore the Universe')).toBeInTheDocument();
  });

  it('should render the tagline about citizen scientists', () => {
    render(<Home />);
    expect(
      screen.getByText(/citizen scientists analyzing real astronomical images/i)
    ).toBeInTheDocument();
  });

  it('should show Get Started and Sign In buttons when not authenticated', () => {
    mockAuthStore.isAuthenticated = false;
    render(<Home />);

    expect(screen.getByText('Get Started Free')).toBeInTheDocument();
    expect(screen.getByText('Sign In')).toBeInTheDocument();
  });

  it('should show Start Exploring button when authenticated', () => {
    mockAuthStore.isAuthenticated = true;
    render(<Home />);

    expect(screen.getByText('Start Exploring')).toBeInTheDocument();
    expect(screen.queryByText('Get Started Free')).not.toBeInTheDocument();
  });

  it('should render 4 feature cards', () => {
    render(<Home />);

    expect(screen.getByText('Real Space Images')).toBeInTheDocument();
    expect(screen.getByText('Make Discoveries')).toBeInTheDocument();
    expect(screen.getByText('Contribute to Science')).toBeInTheDocument();
    expect(screen.getByText('Earn Rewards')).toBeInTheDocument();
  });

  it('should render statistics section', () => {
    render(<Home />);

    expect(screen.getByText('10,000+')).toBeInTheDocument();
    expect(screen.getByText('Images Analyzed')).toBeInTheDocument();
    expect(screen.getByText('50,000+')).toBeInTheDocument();
    expect(screen.getByText('Annotations Made')).toBeInTheDocument();
    expect(screen.getByText('1,000+')).toBeInTheDocument();
    expect(screen.getByText('Active Scientists')).toBeInTheDocument();
  });

  it('should render How It Works section with 3 steps', () => {
    render(<Home />);

    expect(screen.getByText('How It Works')).toBeInTheDocument();
    expect(screen.getByText('View Images')).toBeInTheDocument();
    expect(screen.getByText('Annotate Objects')).toBeInTheDocument();
    expect(screen.getByText('Earn Recognition')).toBeInTheDocument();
  });
});
