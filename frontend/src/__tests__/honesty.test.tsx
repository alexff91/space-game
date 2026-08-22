/**
 * Тесты честности демо-режима.
 *
 * ПОЧЕМУ этот файл существует: без бэкенда приложение раньше показывало
 * выдуманного пользователя CosmicExplorer с 4250 очками, выдуманный рейтинг
 * из 12 несуществующих людей и счётчики «10K+ снимков разобрано» — и при этом
 * обещало, что разметка идёт в настоящие исследования. Человек принимал
 * решения, опираясь на вымысел. Эти тесты держат границу: либо число посчитано,
 * либо честно написано, что данных нет.
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { render, screen } from '@/test/test-utils';

const SRC = resolve(__dirname, '..');

/** Все .ts/.tsx файлы приложения, кроме тестов. */
function appSourceFiles(dir = SRC): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === '__tests__' || entry === 'test') continue;
      out.push(...appSourceFiles(full));
    } else if (/\.tsx?$/.test(entry)) {
      out.push(full);
    }
  }
  return out;
}

const SOURCES = appSourceFiles().map((f) => ({ path: f, text: readFileSync(f, 'utf8') }));

// ---------------------------------------------------------------------------
// 1. Постоянная плашка демо-режима
// ---------------------------------------------------------------------------
describe('постоянная плашка демо-режима', () => {
  it('компонент DemoBanner существует', () => {
    expect(existsSync(join(SRC, 'components/DemoBanner.tsx'))).toBe(true);
  });

  it('говорит, что данные ничего не значат и никуда не уходят', async () => {
    const { default: DemoBanner } = await import('@/components/DemoBanner');
    render(<DemoBanner />);
    const text = document.body.textContent || '';
    // Три обязательных утверждения: нет бэкенда, ничего не сохраняется,
    // рейтинга/очков не существует.
    expect(text).toMatch(/no backend/i);
    expect(text).toMatch(/not saved|nothing is saved|never saved/i);
    expect(text).toMatch(/no scores|no leaderboard|no points/i);
  });

  it('нельзя закрыть — в плашке нет ни одной кнопки', async () => {
    const { default: DemoBanner } = await import('@/components/DemoBanner');
    const { container } = render(<DemoBanner />);
    expect(container.querySelectorAll('button')).toHaveLength(0);
    expect(container.textContent).not.toMatch(/dismiss|close|got it|hide/i);
  });

  it('Layout показывает плашку всегда, а не по условию', () => {
    const layout = readFileSync(join(SRC, 'components/Layout.tsx'), 'utf8');
    expect(layout).toContain('DemoBanner');
    // <DemoBanner /> без обрамляющего условия && или ? :
    expect(layout).toMatch(/^\s*<DemoBanner \/>\s*$/m);
  });
});

// ---------------------------------------------------------------------------
// 2. Выдуманных данных в исходниках больше нет
// ---------------------------------------------------------------------------
describe('выдуманные данные удалены', () => {
  it('нет выдуманных имён из фальшивого рейтинга', () => {
    const invented = [
      'CosmicExplorer', 'NebulaNova', 'StardustSam', 'GalaxyGrace', 'PulsarPete',
      'OrionOlivia', 'QuasarQuinn', 'VortexVera', 'CosmicCaden', 'AstroAria',
      'LunarLiam', 'StellarSophie',
    ];
    const hits = SOURCES.flatMap(({ path, text }) =>
      invented.filter((n) => text.includes(n)).map((n) => `${path}: ${n}`),
    );
    expect(hits).toEqual([]);
  });

  it('нет выдуманных агрегатов DEMO_*', () => {
    const banned = [
      'DEMO_USER', 'DEMO_LEADERBOARD', 'DEMO_USER_STATS', 'DEMO_STREAK',
      'DEMO_ANNOTATIONS', 'DEMO_MISSIONS', 'DEMO_DAILY_CHALLENGE',
      'DEMO_ACHIEVEMENTS', 'DEMO_IMAGES', 'DEMO_APOD_GALLERY',
    ];
    const hits = SOURCES.flatMap(({ path, text }) =>
      banned.filter((n) => text.includes(n)).map((n) => `${path}: ${n}`),
    );
    expect(hits).toEqual([]);
  });

  it('нет имитации задержки сервера, которого нет', () => {
    const hits = SOURCES.filter(({ text }) =>
      /const\s+delay\s*=|await\s+delay\(/.test(text),
    ).map(({ path }) => path);
    expect(hits).toEqual([]);
  });

  it('файл demoService.ts удалён целиком', () => {
    expect(existsSync(join(SRC, 'services/demoService.ts'))).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 3. Ссылки на снимки: ни одного зашитого apod.nasa.gov/apod/image/...
//    (все 17 таких ссылок в прежней версии отдавали 404)
// ---------------------------------------------------------------------------
describe('источник снимков', () => {
  it('в коде нет зашитых ссылок на файлы apod.nasa.gov', () => {
    const hits = SOURCES.flatMap(({ path, text }) => {
      const m = text.match(/https:\/\/apod\.nasa\.gov\/apod\/image\/[^"'\s]+/g);
      return m ? m.map((u) => `${path}: ${u}`) : [];
    });
    expect(hits).toEqual([]);
  });

  it('снимки запрашиваются у официального NASA APOD API', async () => {
    const mod = await import('@/services/apodService');
    expect(mod.NASA_APOD_ENDPOINT).toBe('https://api.nasa.gov/planetary/apod');
  });

  it('при недоступности NASA сервис не подставляет картинки, а падает', async () => {
    const { fetchApod } = await import('@/services/apodService');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 503 }));
    await expect(fetchApod(4)).rejects.toThrow();
  });
});

// ---------------------------------------------------------------------------
// 4. Главная страница: ни выдуманных счётчиков, ни обещания вклада в науку
// ---------------------------------------------------------------------------
describe('главная страница', () => {
  beforeEach(() => {
    vi.doMock('@/store/authStore', () => ({ useAuthStore: () => ({ isAuthenticated: false }) }));
  });

  it('не показывает выдуманные счётчики сообщества', async () => {
    const { default: Home } = await import('@/pages/Home');
    render(<Home />);
    const text = document.body.textContent || '';
    for (const fake of ['10K+', '50K+', '1K+', '10,000+', '50,000+', '1,000+']) {
      expect(text).not.toContain(fake);
    }
    // «47 открытий» — выдуманное число рядом со словом Discoveries
    expect(text).not.toMatch(/47\s*Discoveries/i);
  });

  it('вместо счётчиков говорит, что данных нет', async () => {
    const { default: Home } = await import('@/pages/Home');
    render(<Home />);
    expect(screen.getAllByText(/no data/i).length).toBeGreaterThan(0);
  });

  it('не обещает, что разметка попадает в настоящие исследования', () => {
    const claims = [
      /contributes? to (actual|real) (space )?research/i,
      /join thousands of citizen scientists/i,
      /help advance real scientific research/i,
      /could lead to real scientific discoveries/i,
      /help researchers discover the secrets/i,
    ];
    const hits = SOURCES.flatMap(({ path, text }) =>
      claims.filter((re) => re.test(text)).map((re) => `${path}: ${re}`),
    );
    expect(hits).toEqual([]);
  });
});

// ---------------------------------------------------------------------------
// 5. Рейтинг без бэкенда — «нет данных», а не выдуманные люди
// ---------------------------------------------------------------------------
describe('рейтинг', () => {
  it('в демо-режиме показывает «нет данных» и ни одного имени', async () => {
    vi.doMock('@/store/authStore', () => ({ useAuthStore: () => ({ user: null }) }));
    const { default: Leaderboard } = await import('@/pages/Leaderboard');
    render(<Leaderboard />);
    expect(await screen.findByText(/no data/i)).toBeInTheDocument();
    expect(document.body.textContent).not.toMatch(/Nova|Sam|Grace|Pete/);
  });
});
