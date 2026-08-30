import { useCallback, useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, RotateCcw, Trophy } from 'lucide-react';
import {
  createGame,
  startGame,
  togglePause,
  update,
  emptyInput,
  isBossWave,
  GameState,
  InputState,
} from '@/game/engine';
import { SoundFx } from '@/game/audio';
import {
  loadScores,
  isHighScore,
  submitScore,
  normalizeInitials,
  ScoreEntry,
} from '@/game/leaderboard';

const WIDTH = 480;
const HEIGHT = 640;

const KEY_MAP: Record<string, keyof InputState> = {
  ArrowLeft: 'left',
  ArrowRight: 'right',
  ArrowUp: 'up',
  ArrowDown: 'down',
  KeyA: 'left',
  KeyD: 'right',
  KeyW: 'up',
  KeyS: 'down',
  Space: 'fire',
};

export default function SpaceShooter() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const stateRef = useRef<GameState>(createGame(WIDTH, HEIGHT));
  const inputRef = useRef<InputState>(emptyInput());
  const sfxRef = useRef<SoundFx>(new SoundFx());
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  // Snapshot of last frame's values so we can fire sound effects on change.
  const prevRef = useRef({ score: 0, lives: 3, wave: 0 });

  const [muted, setMuted] = useState(false);
  // HUD mirror of engine state (updated each frame).
  const [hud, setHud] = useState({ score: 0, lives: 3, wave: 0, phase: 'ready' as GameState['phase'] });
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [initials, setInitials] = useState('AAA');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setScores(loadScores());
  }, []);

  const setInput = useCallback((code: string, down: boolean) => {
    const key = KEY_MAP[code];
    if (key) inputRef.current[key] = down;
  }, []);

  // Keyboard handling + pause/mute shortcuts.
  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      if (e.code in KEY_MAP) e.preventDefault();
      if (e.code === 'KeyP') {
        togglePause(stateRef.current);
        return;
      }
      if (e.code === 'KeyM') {
        setMuted((m) => {
          sfxRef.current.setMuted(!m);
          return !m;
        });
        return;
      }
      setInput(e.code, true);
    };
    const onUp = (e: KeyboardEvent) => setInput(e.code, false);
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, [setInput]);

  // Main loop: delta-time based so it runs consistently across frame rates.
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const frame = (now: number) => {
      const last = lastTimeRef.current || now;
      const dt = (now - last) / 1000;
      lastTimeRef.current = now;

      const state = stateRef.current;
      const wasPlaying = state.phase === 'playing';
      update(state, dt, inputRef.current);

      // Fire sound effects by diffing engine state.
      const sfx = sfxRef.current;
      const prev = prevRef.current;
      if (state.phase === 'playing') {
        if (state.score > prev.score) sfx.play(state.score - prev.score >= 100 ? 'explode' : 'hit');
        if (state.wave > prev.wave) sfx.play('wave');
        if (state.lives < prev.lives) sfx.play('explode');
      }
      if (wasPlaying && state.phase === 'gameover') sfx.play('gameover');
      prevRef.current = { score: state.score, lives: state.lives, wave: state.wave };

      render(ctx, state);

      setHud((h) =>
        h.score === state.score && h.lives === state.lives && h.wave === state.wave && h.phase === state.phase
          ? h
          : { score: state.score, lives: state.lives, wave: state.wave, phase: state.phase }
      );

      rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // When entering game over, prep the high-score form.
  useEffect(() => {
    if (hud.phase === 'gameover') setSubmitted(false);
  }, [hud.phase]);

  const handleStart = () => {
    sfxRef.current.play('wave'); // unlocks audio context on user gesture
    startGame(stateRef.current);
    prevRef.current = { score: 0, lives: 3, wave: 0 };
  };

  const handleSubmitScore = () => {
    const updated = submitScore(
      { initials, score: stateRef.current.score, wave: stateRef.current.wave },
      undefined
    );
    setScores(updated);
    setSubmitted(true);
  };

  const toggleMute = () => {
    setMuted((m) => {
      sfxRef.current.setMuted(!m);
      return !m;
    });
  };

  const qualifies = hud.phase === 'gameover' && !submitted && isHighScore(stateRef.current.score);

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start justify-center">
      <div className="relative">
        <canvas
          ref={canvasRef}
          width={WIDTH}
          height={HEIGHT}
          className="rounded-xl border border-primary-900/40 shadow-2xl bg-space-darker max-w-full touch-none"
          style={{ aspectRatio: `${WIDTH} / ${HEIGHT}` }}
        />

        {/* HUD overlay */}
        <div className="absolute top-2 left-3 right-3 flex items-center justify-between text-sm font-mono pointer-events-none">
          <span className="text-primary-300">SCORE {hud.score.toLocaleString()}</span>
          <span className={isBossWave(hud.wave) ? 'text-red-400 font-bold' : 'text-purple-300'}>
            WAVE {hud.wave}{isBossWave(hud.wave) ? ' ⚠ BOSS' : ''}
          </span>
          <span className="text-pink-400">{'♥'.repeat(Math.max(0, hud.lives))}</span>
        </div>

        {/* Controls */}
        <div className="absolute bottom-2 right-2 flex gap-2 pointer-events-auto">
          {hud.phase === 'playing' || hud.phase === 'paused' ? (
            <button
              onClick={() => togglePause(stateRef.current)}
              className="p-2 rounded-lg bg-space-blue/80 hover:bg-space-purple text-white"
              title="Pause / Resume (P)"
            >
              {hud.phase === 'paused' ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
          ) : null}
          <button
            onClick={toggleMute}
            className="p-2 rounded-lg bg-space-blue/80 hover:bg-space-purple text-white"
            title="Mute (M)"
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
        </div>

        {/* Start / pause / game-over screens */}
        {hud.phase !== 'playing' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-space-darker/70 backdrop-blur-sm rounded-xl text-center px-6">
            {hud.phase === 'ready' && (
              <>
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                  Star Defender
                </h2>
                <p className="text-gray-300 text-sm mb-5 max-w-xs">
                  Arrows / WASD to fly, Space to fire. Survive escalating waves and
                  face a mini-boss every 5th wave.
                </p>
                <button onClick={handleStart} className="btn-primary flex items-center gap-2">
                  <Play className="w-4 h-4" /> Launch
                </button>
              </>
            )}

            {hud.phase === 'paused' && (
              <>
                <h2 className="text-2xl font-bold mb-4">Paused</h2>
                <button onClick={() => togglePause(stateRef.current)} className="btn-primary flex items-center gap-2">
                  <Play className="w-4 h-4" /> Resume
                </button>
              </>
            )}

            {hud.phase === 'gameover' && (
              <>
                <h2 className="text-3xl font-bold mb-1 text-red-400">Game Over</h2>
                <p className="text-gray-200 mb-1">Score: <span className="font-mono">{hud.score.toLocaleString()}</span></p>
                <p className="text-gray-400 text-sm mb-4">Reached wave {hud.wave}</p>

                {qualifies ? (
                  <div className="flex flex-col items-center gap-3 mb-4">
                    <p className="text-yellow-400 text-sm font-semibold">New high score! Enter initials:</p>
                    <input
                      value={initials}
                      onChange={(e) => setInitials(normalizeInitials(e.target.value))}
                      maxLength={3}
                      className="input-field w-24 text-center text-2xl font-mono tracking-widest uppercase"
                    />
                    <button onClick={handleSubmitScore} className="btn-primary flex items-center gap-2">
                      <Trophy className="w-4 h-4" /> Save Score
                    </button>
                  </div>
                ) : null}

                <button onClick={handleStart} className="btn-secondary flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" /> Play Again
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="card w-full lg:w-72">
        <h3 className="flex items-center gap-2 text-lg font-bold mb-4">
          <Trophy className="w-5 h-5 text-yellow-400" /> High Scores
        </h3>
        {scores.length === 0 ? (
          <p className="text-gray-400 text-sm">No scores yet. Be the first!</p>
        ) : (
          <ol className="space-y-1">
            {scores.map((s, i) => (
              <li key={`${s.initials}-${s.date}-${i}`} className="flex items-center justify-between text-sm font-mono py-1 border-b border-primary-900/20 last:border-0">
                <span className="text-gray-500 w-6">{i + 1}.</span>
                <span className="font-bold tracking-widest text-primary-300">{s.initials}</span>
                <span className="text-gray-300">{s.score.toLocaleString()}</span>
                <span className="text-purple-400 text-xs">W{s.wave}</span>
              </li>
            ))}
          </ol>
        )}
        <p className="text-gray-500 text-xs mt-4 leading-relaxed">
          Controls: <kbd>←↑↓→</kbd>/<kbd>WASD</kbd> move · <kbd>Space</kbd> fire · <kbd>P</kbd> pause · <kbd>M</kbd> mute
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Rendering (kept out of the engine so simulation stays pure & testable).
function render(ctx: CanvasRenderingContext2D, s: GameState): void {
  ctx.clearRect(0, 0, s.width, s.height);

  // Screen shake offset.
  const sx = s.shake ? (Math.random() - 0.5) * s.shake : 0;
  const sy = s.shake ? (Math.random() - 0.5) * s.shake : 0;
  ctx.save();
  ctx.translate(sx, sy);

  // Background gradient.
  const grad = ctx.createLinearGradient(0, 0, 0, s.height);
  grad.addColorStop(0, '#050714');
  grad.addColorStop(1, '#1a1f3a');
  ctx.fillStyle = grad;
  ctx.fillRect(-20, -20, s.width + 40, s.height + 40);

  // Parallax starfield.
  for (const star of s.stars) {
    ctx.globalAlpha = 0.3 + star.z * 0.7;
    ctx.fillStyle = '#cbd5e1';
    const size = star.z * 2;
    ctx.fillRect(star.x, star.y, size, size);
  }
  ctx.globalAlpha = 1;

  // Particles.
  for (const p of s.particles) {
    ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Bullets.
  for (const b of s.bullets) {
    ctx.fillStyle = b.fromEnemy ? '#f87171' : '#7dd3fc';
    ctx.fillRect(b.x - b.radius / 2, b.y - b.radius, b.radius, b.radius * 2.5);
  }

  // Enemies.
  for (const e of s.enemies) {
    if (e.kind === 'boss') {
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(e.x, e.y + e.radius);
      ctx.lineTo(e.x - e.radius, e.y - e.radius * 0.6);
      ctx.lineTo(e.x + e.radius, e.y - e.radius * 0.6);
      ctx.closePath();
      ctx.fill();
      // Boss HP bar.
      const w = e.radius * 2;
      ctx.fillStyle = '#3f1111';
      ctx.fillRect(e.x - e.radius, e.y - e.radius - 12, w, 5);
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(e.x - e.radius, e.y - e.radius - 12, w * (e.hp / e.maxHp), 5);
    } else {
      ctx.fillStyle = e.kind === 'diver' ? '#f472b6' : '#a78bfa';
      ctx.beginPath();
      ctx.moveTo(e.x, e.y + e.radius);
      ctx.lineTo(e.x - e.radius, e.y - e.radius);
      ctx.lineTo(e.x + e.radius, e.y - e.radius);
      ctx.closePath();
      ctx.fill();
    }
  }

  // Player ship (skip flicker frames during invulnerability).
  const p = s.player;
  const flicker = p.invuln > 0 && Math.floor(p.invuln * 10) % 2 === 0;
  if (s.phase !== 'gameover' && !flicker) {
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.moveTo(p.x, p.y - p.radius);
    ctx.lineTo(p.x - p.radius, p.y + p.radius);
    ctx.lineTo(p.x, p.y + p.radius * 0.4);
    ctx.lineTo(p.x + p.radius, p.y + p.radius);
    ctx.closePath();
    ctx.fill();
    // Engine flame.
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.moveTo(p.x - 4, p.y + p.radius * 0.5);
    ctx.lineTo(p.x, p.y + p.radius + 6 + Math.random() * 4);
    ctx.lineTo(p.x + 4, p.y + p.radius * 0.5);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}
