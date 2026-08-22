/**
 * ПОЧЕМУ файл переписан: прежние тесты закрепляли ложь как требование —
 * они падали, если на странице нет «10,000+ Images Analyzed» и
 * «Join thousands of citizen scientists». Ни одно из этих чисел никто
 * не считал, а тест обязывал их показывать.
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@/test/test-utils';
import Home from '@/pages/Home';

vi.mock('@/store/authStore', () => ({
  useAuthStore: () => ({ isAuthenticated: false }),
}));

// Mock framer-motion to avoid animation issues in tests
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

describe('Home Page', () => {
  it('should render the hero title', () => {
    render(<Home />);
    expect(screen.getByText('Explore the Universe')).toBeInTheDocument();
  });

  it('без бэкенда ведёт только туда, где данные настоящие', () => {
    render(<Home />);
    expect(screen.getByText('Open the Gallery')).toBeInTheDocument();
    expect(screen.getByText(/Explore the Sky Map/)).toBeInTheDocument();
    // Регистрации нет: аккаунт хранить негде.
    expect(screen.queryByText('Create an Account')).not.toBeInTheDocument();
  });

  it('перечисляет только то, что действительно работает', () => {
    render(<Home />);
    expect(screen.getByText('NASA Picture of the Day')).toBeInTheDocument();
    expect(screen.getByText('Interactive Sky Map')).toBeInTheDocument();
    expect(screen.getByText('Event Calendar')).toBeInTheDocument();
  });

  it('счётчики сообщества помечены как отсутствующие', () => {
    render(<Home />);
    expect(screen.getByText('Community statistics')).toBeInTheDocument();
    // Четыре подписи — и под каждой «No data», а не число.
    expect(screen.getAllByText('No data')).toHaveLength(4);
    expect(screen.getByText('Images analysed')).toBeInTheDocument();
    expect(screen.getByText('Discoveries')).toBeInTheDocument();
  });

  it('не выдаёт себя за проект гражданской науки', () => {
    render(<Home />);
    const text = document.body.textContent || '';
    expect(text).not.toMatch(/contributes? to (actual|real)/i);
    // Вместо обещания — ссылка на проект, где вклад действительно настоящий.
    expect(screen.getByText('Zooniverse')).toBeInTheDocument();
  });
});
