import { describe, it, expect, beforeEach } from 'vitest';
import {
  loadScores,
  submitScore,
  isHighScore,
  normalizeInitials,
  MAX_ENTRIES,
  STORAGE_KEY,
  ScoreStore,
} from '@/game/leaderboard';

// In-memory store implementing the ScoreStore interface.
function makeStore(): ScoreStore & { data: Record<string, string> } {
  const data: Record<string, string> = {};
  return {
    data,
    getItem: (k) => (k in data ? data[k] : null),
    setItem: (k, v) => {
      data[k] = v;
    },
  };
}

let store: ReturnType<typeof makeStore>;
beforeEach(() => {
  store = makeStore();
});

describe('normalizeInitials', () => {
  it('uppercases, strips, and pads to 3 chars', () => {
    expect(normalizeInitials('ab')).toBe('ABA');
    expect(normalizeInitials('a!b@c#d')).toBe('ABC');
    expect(normalizeInitials('')).toBe('AAA');
    expect(normalizeInitials('xyz123')).toBe('XYZ');
  });
});

describe('submitScore / loadScores', () => {
  it('persists and returns sorted descending', () => {
    submitScore({ initials: 'abc', score: 100, wave: 2 }, store);
    submitScore({ initials: 'def', score: 300, wave: 5 }, store);
    submitScore({ initials: 'ghi', score: 200, wave: 3 }, store);
    const scores = loadScores(store);
    expect(scores.map((s) => s.score)).toEqual([300, 200, 100]);
    expect(scores[0].initials).toBe('DEF');
  });

  it('caps the board at MAX_ENTRIES', () => {
    for (let i = 0; i < MAX_ENTRIES + 5; i++) {
      submitScore({ initials: 'AAA', score: i * 10, wave: 1 }, store);
    }
    expect(loadScores(store).length).toBe(MAX_ENTRIES);
  });

  it('round-trips through the raw storage key', () => {
    submitScore({ initials: 'ZZZ', score: 50, wave: 1 }, store);
    expect(store.data[STORAGE_KEY]).toContain('ZZZ');
  });

  it('returns empty for corrupt data', () => {
    store.data[STORAGE_KEY] = 'not json{';
    expect(loadScores(store)).toEqual([]);
  });
});

describe('isHighScore', () => {
  it('is false for zero or negative scores', () => {
    expect(isHighScore(0, store)).toBe(false);
    expect(isHighScore(-5, store)).toBe(false);
  });

  it('is true while the board has free slots', () => {
    expect(isHighScore(10, store)).toBe(true);
  });

  it('compares against the lowest entry once full', () => {
    for (let i = 1; i <= MAX_ENTRIES; i++) {
      submitScore({ initials: 'AAA', score: i * 100, wave: 1 }, store);
    }
    // Lowest is 100.
    expect(isHighScore(50, store)).toBe(false);
    expect(isHighScore(150, store)).toBe(true);
  });
});
