// Persistent local high-score table for the Space Shooter mini-game.
// Scores are stored in localStorage so they survive reloads on the same device.

export interface ScoreEntry {
  initials: string;
  score: number;
  wave: number;
  date: string; // ISO date
}

export const STORAGE_KEY = 'spaceShooter.highScores';
export const MAX_ENTRIES = 10;

// Storage abstraction keeps the module testable without a real localStorage.
export interface ScoreStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

function defaultStore(): ScoreStore | null {
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch {
    // Access can throw in sandboxed/private contexts.
  }
  return null;
}

export function normalizeInitials(raw: string): string {
  return raw
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, '')
    .slice(0, 3)
    .padEnd(3, 'A');
}

export function loadScores(store: ScoreStore | null = defaultStore()): ScoreEntry[] {
  if (!store) return [];
  try {
    const raw = store.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (e): e is ScoreEntry =>
          e &&
          typeof e.initials === 'string' &&
          typeof e.score === 'number' &&
          Number.isFinite(e.score)
      )
      .map((e) => ({
        initials: normalizeInitials(e.initials),
        score: Math.max(0, Math.floor(e.score)),
        wave: typeof e.wave === 'number' ? Math.max(0, Math.floor(e.wave)) : 0,
        date: typeof e.date === 'string' ? e.date : new Date().toISOString(),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, MAX_ENTRIES);
  } catch {
    return [];
  }
}

// Returns true if the given score would earn a place on the board.
export function isHighScore(
  score: number,
  store: ScoreStore | null = defaultStore()
): boolean {
  if (score <= 0) return false;
  const scores = loadScores(store);
  if (scores.length < MAX_ENTRIES) return true;
  return score > scores[scores.length - 1].score;
}

// Inserts a new entry and returns the trimmed, sorted board.
export function submitScore(
  entry: { initials: string; score: number; wave: number },
  store: ScoreStore | null = defaultStore()
): ScoreEntry[] {
  const next: ScoreEntry = {
    initials: normalizeInitials(entry.initials),
    score: Math.max(0, Math.floor(entry.score)),
    wave: Math.max(0, Math.floor(entry.wave)),
    date: new Date().toISOString(),
  };
  const updated = [...loadScores(store), next]
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_ENTRIES);
  if (store) {
    try {
      store.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota / availability errors; the in-memory list is still returned.
    }
  }
  return updated;
}
