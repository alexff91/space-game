// Pure, frame-rate-independent arcade engine for the Space Shooter mini-game.
//
// All state lives in a single `GameState` object and every mutation happens
// through `update(state, dtSeconds, input)`. Time is measured in seconds so the
// simulation runs identically regardless of the host's frame rate. Spawning
// uses an injectable RNG so behaviour can be tested deterministically.

export type GamePhase = 'ready' | 'playing' | 'paused' | 'gameover';

export interface Vec2 {
  x: number;
  y: number;
}

export interface Entity extends Vec2 {
  vx: number;
  vy: number;
  radius: number;
}

export interface Player extends Entity {
  cooldown: number; // seconds until next shot allowed
  invuln: number; // seconds of post-hit invulnerability remaining
}

export interface Bullet extends Entity {
  fromEnemy: boolean;
}

export type EnemyKind = 'grunt' | 'diver' | 'boss';

export interface Enemy extends Entity {
  kind: EnemyKind;
  hp: number;
  maxHp: number;
  fireCooldown: number;
  // boss horizontal patrol direction
  dir: number;
}

export interface Particle extends Entity {
  life: number; // remaining seconds
  maxLife: number;
  color: string;
  size: number;
}

export interface Star {
  x: number;
  y: number;
  z: number; // depth 0..1 -> parallax speed & size
}

export interface GameState {
  width: number;
  height: number;
  phase: GamePhase;
  player: Player;
  bullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  stars: Star[];
  score: number;
  lives: number;
  wave: number;
  waveInProgress: boolean;
  waveTimer: number; // countdown between waves
  spawnQueue: number; // enemies still to spawn this wave
  spawnTimer: number; // countdown to next spawn within wave
  shake: number; // current screen-shake magnitude (px), decays over time
  rng: () => number;
}

export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  fire: boolean;
}

// Tunables -------------------------------------------------------------------
export const CONFIG = {
  playerSpeed: 360, // px/s
  playerRadius: 14,
  bulletSpeed: 560,
  enemyBulletSpeed: 240,
  fireInterval: 0.18, // seconds between player shots
  invulnTime: 1.5,
  starCount: 90,
  bossEveryNthWave: 5,
  baseEnemies: 4,
  enemiesPerWave: 2,
  shakeDecay: 28, // px/s the shake magnitude decays
};

export function emptyInput(): InputState {
  return { left: false, right: false, up: false, down: false, fire: false };
}

// Deterministic-friendly star field.
function makeStars(width: number, height: number, rng: () => number): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < CONFIG.starCount; i++) {
    stars.push({
      x: rng() * width,
      y: rng() * height,
      z: 0.2 + rng() * 0.8,
    });
  }
  return stars;
}

export function createGame(
  width: number,
  height: number,
  rng: () => number = Math.random
): GameState {
  return {
    width,
    height,
    phase: 'ready',
    player: {
      x: width / 2,
      y: height - 60,
      vx: 0,
      vy: 0,
      radius: CONFIG.playerRadius,
      cooldown: 0,
      invuln: 0,
    },
    bullets: [],
    enemies: [],
    particles: [],
    stars: makeStars(width, height, rng),
    score: 0,
    lives: 3,
    wave: 0,
    waveInProgress: false,
    waveTimer: 1.5,
    spawnQueue: 0,
    spawnTimer: 0,
    shake: 0,
    rng,
  };
}

export function startGame(state: GameState): void {
  const fresh = createGame(state.width, state.height, state.rng);
  Object.assign(state, fresh);
  state.phase = 'playing';
}

export function togglePause(state: GameState): void {
  if (state.phase === 'playing') state.phase = 'paused';
  else if (state.phase === 'paused') state.phase = 'playing';
}

function spawnExplosion(state: GameState, x: number, y: number, color: string, count: number): void {
  for (let i = 0; i < count; i++) {
    const angle = state.rng() * Math.PI * 2;
    const speed = 60 + state.rng() * 220;
    const life = 0.4 + state.rng() * 0.6;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      radius: 0,
      life,
      maxLife: life,
      color,
      size: 1.5 + state.rng() * 2.5,
    });
  }
}

export function addShake(state: GameState, amount: number): void {
  state.shake = Math.min(24, state.shake + amount);
}

// Number of enemies (excluding any boss) for a given wave.
export function waveEnemyCount(wave: number): number {
  return CONFIG.baseEnemies + (wave - 1) * CONFIG.enemiesPerWave;
}

export function isBossWave(wave: number): boolean {
  return wave > 0 && wave % CONFIG.bossEveryNthWave === 0;
}

// Enemy speed scales gently with wave for escalating difficulty.
function enemySpeedForWave(wave: number): number {
  return 40 + wave * 8;
}

function spawnEnemy(state: GameState): void {
  const wave = state.wave;
  const margin = 40;
  const x = margin + state.rng() * (state.width - margin * 2);
  const diver = state.rng() < Math.min(0.5, 0.1 + wave * 0.05);
  const speed = enemySpeedForWave(wave);
  state.enemies.push({
    kind: diver ? 'diver' : 'grunt',
    x,
    y: -30,
    vx: diver ? (state.rng() < 0.5 ? -1 : 1) * speed * 0.6 : 0,
    vy: diver ? speed * 1.6 : speed,
    radius: 16,
    hp: 1 + Math.floor(wave / 4),
    maxHp: 1 + Math.floor(wave / 4),
    fireCooldown: 1 + state.rng() * 2,
    dir: 1,
  });
}

function spawnBoss(state: GameState): void {
  const hp = 30 + state.wave * 6;
  state.enemies.push({
    kind: 'boss',
    x: state.width / 2,
    y: -60,
    vx: enemySpeedForWave(state.wave) * 1.2,
    vy: 0,
    radius: 46,
    hp,
    maxHp: hp,
    fireCooldown: 1.2,
    dir: 1,
  });
}

function beginWave(state: GameState): void {
  state.wave += 1;
  state.waveInProgress = true;
  if (isBossWave(state.wave)) {
    spawnBoss(state);
    state.spawnQueue = 0;
  } else {
    state.spawnQueue = waveEnemyCount(state.wave);
  }
  state.spawnTimer = 0;
}

function dist2(a: Vec2, b: Vec2): number {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return dx * dx + dy * dy;
}

function circlesOverlap(a: Entity, b: Entity): boolean {
  const r = a.radius + b.radius;
  return dist2(a, b) <= r * r;
}

function clamp(v: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, v));
}

function killPlayer(state: GameState): void {
  state.lives -= 1;
  spawnExplosion(state, state.player.x, state.player.y, '#38bdf8', 40);
  addShake(state, 18);
  if (state.lives <= 0) {
    state.phase = 'gameover';
  } else {
    state.player.x = state.width / 2;
    state.player.y = state.height - 60;
    state.player.invuln = CONFIG.invulnTime;
  }
}

// Core simulation step. `dt` is seconds elapsed since the previous step.
export function update(state: GameState, dt: number, input: InputState): void {
  // Clamp dt to avoid huge jumps after a tab is backgrounded.
  dt = clamp(dt, 0, 0.05);

  // Starfield parallax runs in every phase so the menu feels alive.
  for (const s of state.stars) {
    s.y += (20 + s.z * 80) * dt;
    if (s.y > state.height) {
      s.y = 0;
      s.x = state.rng() * state.width;
    }
  }

  // Shake always decays toward zero.
  state.shake = Math.max(0, state.shake - CONFIG.shakeDecay * dt);

  if (state.phase !== 'playing') return;

  const p = state.player;
  p.invuln = Math.max(0, p.invuln - dt);
  p.cooldown = Math.max(0, p.cooldown - dt);

  // Player movement.
  const sp = CONFIG.playerSpeed;
  p.vx = (input.right ? 1 : 0) * sp - (input.left ? 1 : 0) * sp;
  p.vy = (input.down ? 1 : 0) * sp - (input.up ? 1 : 0) * sp;
  p.x = clamp(p.x + p.vx * dt, p.radius, state.width - p.radius);
  p.y = clamp(p.y + p.vy * dt, p.radius, state.height - p.radius);

  // Firing.
  if (input.fire && p.cooldown <= 0) {
    state.bullets.push({
      x: p.x,
      y: p.y - p.radius,
      vx: 0,
      vy: -CONFIG.bulletSpeed,
      radius: 4,
      fromEnemy: false,
    });
    p.cooldown = CONFIG.fireInterval;
  }

  // Wave pacing: when nothing is in progress, count down then start next wave.
  if (!state.waveInProgress) {
    state.waveTimer -= dt;
    if (state.waveTimer <= 0) beginWave(state);
  } else if (state.spawnQueue > 0) {
    state.spawnTimer -= dt;
    if (state.spawnTimer <= 0) {
      spawnEnemy(state);
      state.spawnQueue -= 1;
      state.spawnTimer = 0.6;
    }
  } else if (state.enemies.length === 0) {
    // Wave cleared.
    state.waveInProgress = false;
    state.waveTimer = 2.5;
    state.score += 50; // wave-clear bonus
  }

  // Update bullets.
  for (const b of state.bullets) {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
  }
  state.bullets = state.bullets.filter(
    (b) => b.y > -20 && b.y < state.height + 20 && b.x > -20 && b.x < state.width + 20
  );

  // Update enemies.
  for (const e of state.enemies) {
    if (e.kind === 'boss') {
      e.x += e.vx * e.dir * dt;
      if (e.x < e.radius) {
        e.x = e.radius;
        e.dir = 1;
      } else if (e.x > state.width - e.radius) {
        e.x = state.width - e.radius;
        e.dir = -1;
      }
      // Descend to hover height.
      if (e.y < 90) e.y += 60 * dt;
    } else {
      e.x += e.vx * dt;
      e.y += e.vy * dt;
      if (e.kind === 'diver' && (e.x < e.radius || e.x > state.width - e.radius)) {
        e.vx *= -1;
        e.x = clamp(e.x, e.radius, state.width - e.radius);
      }
    }

    // Enemy fire.
    e.fireCooldown -= dt;
    if (e.fireCooldown <= 0 && e.y > 0) {
      const shots = e.kind === 'boss' ? 3 : 1;
      for (let i = 0; i < shots; i++) {
        const spread = (i - (shots - 1) / 2) * 90;
        state.bullets.push({
          x: e.x,
          y: e.y + e.radius,
          vx: spread,
          vy: CONFIG.enemyBulletSpeed,
          radius: 4,
          fromEnemy: true,
        });
      }
      e.fireCooldown = e.kind === 'boss' ? 0.9 : 1.5 + state.rng() * 1.5;
    }
  }

  // Player bullets vs enemies.
  const survivingBullets: Bullet[] = [];
  for (const b of state.bullets) {
    if (b.fromEnemy) {
      survivingBullets.push(b);
      continue;
    }
    let hit = false;
    for (const e of state.enemies) {
      if (circlesOverlap(b, e)) {
        hit = true;
        e.hp -= 1;
        spawnExplosion(state, b.x, b.y, '#fbbf24', 6);
        if (e.hp <= 0) {
          const pts = e.kind === 'boss' ? 500 : e.kind === 'diver' ? 25 : 15;
          state.score += pts;
          spawnExplosion(state, e.x, e.y, e.kind === 'boss' ? '#f87171' : '#a78bfa', e.kind === 'boss' ? 60 : 18);
          addShake(state, e.kind === 'boss' ? 16 : 6);
        }
        break;
      }
    }
    if (!hit) survivingBullets.push(b);
  }
  state.bullets = survivingBullets;
  state.enemies = state.enemies.filter((e) => e.hp > 0);

  // Enemy bullets & bodies vs player.
  if (p.invuln <= 0) {
    for (const b of state.bullets) {
      if (b.fromEnemy && circlesOverlap(b, p)) {
        killPlayer(state);
        break;
      }
    }
  }
  if (p.invuln <= 0 && state.phase === 'playing') {
    for (const e of state.enemies) {
      if (circlesOverlap(e, p)) {
        killPlayer(state);
        break;
      }
    }
  }
  // Drop enemy bullets that hit the player and enemies that flew off-screen.
  state.bullets = state.bullets.filter((b) => !(b.fromEnemy && b.y > state.height + 20));
  state.enemies = state.enemies.filter((e) => e.y < state.height + 80);

  // Update particles.
  for (const pt of state.particles) {
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    pt.vx *= 1 - 1.5 * dt; // drag
    pt.vy *= 1 - 1.5 * dt;
    pt.life -= dt;
  }
  state.particles = state.particles.filter((pt) => pt.life > 0);
}
