import { describe, it, expect } from 'vitest';
import {
  createGame,
  startGame,
  togglePause,
  update,
  emptyInput,
  waveEnemyCount,
  isBossWave,
  addShake,
  CONFIG,
  GameState,
  InputState,
} from '@/game/engine';

// Deterministic RNG for reproducible spawning.
function seededRng(seed = 1): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function freshPlaying(): GameState {
  const g = createGame(480, 640, seededRng(42));
  startGame(g);
  return g;
}

const noInput: InputState = emptyInput();

// Advance the simulation by `seconds` using realistic capped steps.
function advance(g: GameState, seconds: number, input: InputState = noInput): void {
  const step = 0.016;
  let t = 0;
  while (t < seconds) {
    update(g, step, input);
    t += step;
  }
}

describe('engine - lifecycle', () => {
  it('starts in ready phase with 3 lives', () => {
    const g = createGame(480, 640);
    expect(g.phase).toBe('ready');
    expect(g.lives).toBe(3);
    expect(g.wave).toBe(0);
  });

  it('startGame moves to playing and resets score', () => {
    const g = freshPlaying();
    expect(g.phase).toBe('playing');
    expect(g.score).toBe(0);
  });

  it('togglePause flips between playing and paused', () => {
    const g = freshPlaying();
    togglePause(g);
    expect(g.phase).toBe('paused');
    togglePause(g);
    expect(g.phase).toBe('playing');
  });
});

describe('engine - frame-rate independence', () => {
  it('moves the player the same distance regardless of step size', () => {
    const input: InputState = { ...emptyInput(), right: true };

    const a = freshPlaying();
    const startX = a.player.x;
    // One big-ish step (capped at 0.05) vs many small steps over the same time.
    for (let i = 0; i < 25; i++) update(a, 0.02, input); // 0.5s total

    const b = freshPlaying();
    for (let i = 0; i < 50; i++) update(b, 0.01, input); // 0.5s total

    expect(Math.abs(a.player.x - b.player.x)).toBeLessThan(0.5);
    expect(a.player.x).toBeGreaterThan(startX);
  });

  it('clamps very large dt to avoid simulation explosions', () => {
    const g = freshPlaying();
    const input: InputState = { ...emptyInput(), right: true };
    update(g, 100, input); // huge dt
    // Player should stay within bounds, not teleport off-screen.
    expect(g.player.x).toBeLessThanOrEqual(g.width);
    expect(g.player.x).toBeGreaterThanOrEqual(0);
  });
});

describe('engine - player', () => {
  it('keeps the player within bounds', () => {
    const g = freshPlaying();
    const input: InputState = { ...emptyInput(), left: true };
    for (let i = 0; i < 200; i++) update(g, 0.016, input);
    expect(g.player.x).toBeGreaterThanOrEqual(g.player.radius - 0.001);
  });

  it('fires a bullet on the fire input respecting cooldown', () => {
    const g = freshPlaying();
    const input: InputState = { ...emptyInput(), fire: true };
    update(g, 0.016, input);
    const after1 = g.bullets.filter((b) => !b.fromEnemy).length;
    expect(after1).toBe(1);
    // Immediately firing again should be blocked by cooldown.
    update(g, 0.016, input);
    expect(g.bullets.filter((b) => !b.fromEnemy).length).toBe(1);
    // After the cooldown elapses, another shot is allowed.
    advance(g, CONFIG.fireInterval + 0.05, input);
    expect(g.bullets.filter((b) => !b.fromEnemy).length).toBeGreaterThanOrEqual(2);
  });
});

describe('engine - waves & boss', () => {
  it('escalates enemy count per wave', () => {
    expect(waveEnemyCount(1)).toBe(CONFIG.baseEnemies);
    expect(waveEnemyCount(3)).toBeGreaterThan(waveEnemyCount(1));
  });

  it('flags every Nth wave as a boss wave', () => {
    expect(isBossWave(CONFIG.bossEveryNthWave)).toBe(true);
    expect(isBossWave(1)).toBe(false);
    expect(isBossWave(CONFIG.bossEveryNthWave * 2)).toBe(true);
  });

  it('begins wave 1 after the intro timer elapses', () => {
    const g = freshPlaying();
    expect(g.wave).toBe(0);
    advance(g, 2); // exceeds initial waveTimer
    expect(g.wave).toBe(1);
    expect(g.waveInProgress).toBe(true);
  });

  it('spawns a boss on a boss wave', () => {
    const g = freshPlaying();
    g.wave = CONFIG.bossEveryNthWave - 1;
    g.waveInProgress = false;
    g.waveTimer = 0.01;
    update(g, 0.02, noInput);
    expect(g.wave).toBe(CONFIG.bossEveryNthWave);
    // Let it spawn.
    advance(g, 0.7);
    expect(g.enemies.some((e) => e.kind === 'boss')).toBe(true);
  });
});

describe('engine - combat & particles', () => {
  it('destroys an enemy and awards points when a bullet hits', () => {
    const g = freshPlaying();
    g.enemies.push({
      kind: 'grunt', x: 100, y: 100, vx: 0, vy: 0, radius: 16,
      hp: 1, maxHp: 1, fireCooldown: 999, dir: 1,
    });
    g.bullets.push({ x: 100, y: 100, vx: 0, vy: 0, radius: 4, fromEnemy: false });
    update(g, 0.016, noInput);
    expect(g.enemies.length).toBe(0);
    expect(g.score).toBeGreaterThan(0);
    expect(g.particles.length).toBeGreaterThan(0);
  });

  it('loses a life when an enemy bullet hits the player', () => {
    const g = freshPlaying();
    g.player.invuln = 0;
    g.bullets.push({
      x: g.player.x, y: g.player.y, vx: 0, vy: 0, radius: 4, fromEnemy: true,
    });
    update(g, 0.016, noInput);
    expect(g.lives).toBe(2);
    expect(g.player.invuln).toBeGreaterThan(0);
  });

  it('ends the game when lives run out', () => {
    const g = freshPlaying();
    g.lives = 1;
    g.player.invuln = 0;
    g.bullets.push({
      x: g.player.x, y: g.player.y, vx: 0, vy: 0, radius: 4, fromEnemy: true,
    });
    update(g, 0.016, noInput);
    expect(g.lives).toBe(0);
    expect(g.phase).toBe('gameover');
  });
});

describe('engine - juice', () => {
  it('shake decays toward zero over time', () => {
    const g = freshPlaying();
    addShake(g, 20);
    const before = g.shake;
    update(g, 0.1, noInput);
    expect(g.shake).toBeLessThan(before);
  });

  it('scrolls the starfield and wraps stars', () => {
    const g = createGame(480, 640, seededRng(7));
    const star = g.stars[0];
    star.y = g.height - 1;
    update(g, 0.5, noInput);
    expect(star.y).toBeLessThan(g.height); // wrapped to top
  });
});
