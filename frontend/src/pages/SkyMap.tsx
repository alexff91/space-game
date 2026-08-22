import { useState, useRef, useCallback, useEffect } from 'react';
import { CONSTELLATIONS, STAR_DATA_SOURCE, type Constellation } from '@/services/referenceData';
import { MapPin, ZoomIn, ZoomOut, RotateCcw, Info, X, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Interactive Sky Map — a canvas-based star chart that lets users
 * explore constellations, zoom, pan, and learn about the night sky.
 * Uses stereographic projection for a realistic sky view.
 */

interface ViewState {
  centerRA: number;
  centerDec: number;
  zoom: number;
}

// Convert RA/Dec to screen coordinates using stereographic projection
function raDecToScreen(
  ra: number,
  dec: number,
  view: ViewState,
  width: number,
  height: number,
): { x: number; y: number; visible: boolean } {
  const toRad = Math.PI / 180;
  const raRad = ra * toRad;
  const decRad = dec * toRad;
  const ra0 = view.centerRA * toRad;
  const dec0 = view.centerDec * toRad;

  const cosDec = Math.cos(decRad);
  const sinDec = Math.sin(decRad);
  const cosDec0 = Math.cos(dec0);
  const sinDec0 = Math.sin(dec0);
  const cosRaDiff = Math.cos(raRad - ra0);

  const cosC = sinDec0 * sinDec + cosDec0 * cosDec * cosRaDiff;
  if (cosC < 0.01) return { x: 0, y: 0, visible: false };

  const scale = (view.zoom * Math.min(width, height)) / 4;

  const x = (cosDec * Math.sin(raRad - ra0)) / cosC;
  const y = (cosDec0 * sinDec - sinDec0 * cosDec * cosRaDiff) / cosC;

  return {
    x: width / 2 + x * scale,
    y: height / 2 - y * scale,
    visible: true,
  };
}

// Magnitude to rendered star radius
function magToRadius(mag: number, zoom: number): number {
  const base = Math.max(1, 4.5 - mag * 0.7);
  return base * Math.min(zoom * 0.4, 2.5);
}

// Фон неба. ПОЧЕМУ это важно подписать в интерфейсе: эти точки сгенерированы
// псевдослучайно, они не соответствуют ни одной настоящей звезде. Названные
// звёзды созвездий — настоящие, фон — оформление, и путать их нельзя.
function generateBackgroundStars(count: number): Array<{ ra: number; dec: number; mag: number }> {
  const stars: Array<{ ra: number; dec: number; mag: number }> = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return seed / 2147483647;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      ra: rand() * 360,
      dec: rand() * 180 - 90,
      mag: 3 + rand() * 3,
    });
  }
  return stars;
}

const BG_STARS = generateBackgroundStars(800);

export default function SkyMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<ViewState>({ centerRA: 84, centerDec: 5, zoom: 2 });
  const [selectedConstellation, setSelectedConstellation] = useState<Constellation | null>(null);
  const [showLabels, setShowLabels] = useState(true);
  const [showLines, setShowLines] = useState(true);
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width: 900, height: 600 });
  const isDragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });

  // Resize observer
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setCanvasSize({ width: Math.floor(width), height: Math.floor(Math.min(height, 700)) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Draw the sky
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const { width, height } = canvasSize;
    canvas.width = width;
    canvas.height = height;

    // Background gradient (deep space)
    const grad = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width * 0.7);
    grad.addColorStop(0, '#0c1229');
    grad.addColorStop(1, '#030510');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // Milky Way band (subtle)
    const milkyWay = ctx.createLinearGradient(0, height * 0.3, width, height * 0.7);
    milkyWay.addColorStop(0, 'rgba(100, 120, 180, 0)');
    milkyWay.addColorStop(0.3, 'rgba(100, 120, 180, 0.03)');
    milkyWay.addColorStop(0.5, 'rgba(100, 120, 180, 0.06)');
    milkyWay.addColorStop(0.7, 'rgba(100, 120, 180, 0.03)');
    milkyWay.addColorStop(1, 'rgba(100, 120, 180, 0)');
    ctx.fillStyle = milkyWay;
    ctx.fillRect(0, 0, width, height);

    // Background stars
    BG_STARS.forEach((s) => {
      const pos = raDecToScreen(s.ra, s.dec, view, width, height);
      if (!pos.visible || pos.x < -20 || pos.x > width + 20 || pos.y < -20 || pos.y > height + 20) return;
      const r = magToRadius(s.mag, view.zoom);
      const alpha = Math.max(0.2, 1 - s.mag / 6);
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200, 210, 255, ${alpha})`;
      ctx.fill();
    });

    // Constellation lines
    if (showLines) {
      CONSTELLATIONS.forEach((c) => {
        const isSelected = selectedConstellation?.name === c.name;
        ctx.strokeStyle = isSelected ? 'rgba(56, 189, 248, 0.6)' : 'rgba(100, 150, 255, 0.25)';
        ctx.lineWidth = isSelected ? 2 : 1;
        c.lines.forEach(([i, j]) => {
          const s1 = c.stars[i];
          const s2 = c.stars[j];
          if (!s1 || !s2) return;
          const p1 = raDecToScreen(s1.ra, s1.dec, view, width, height);
          const p2 = raDecToScreen(s2.ra, s2.dec, view, width, height);
          if (!p1.visible || !p2.visible) return;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.stroke();
        });
      });
    }

    // Constellation stars
    CONSTELLATIONS.forEach((c) => {
      c.stars.forEach((star) => {
        const pos = raDecToScreen(star.ra, star.dec, view, width, height);
        if (!pos.visible || pos.x < -20 || pos.x > width + 20 || pos.y < -20 || pos.y > height + 20) return;
        const r = magToRadius(star.magnitude, view.zoom);
        const isHovered = hoveredStar === star.name;

        // Glow
        const glow = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, r * 4);
        glow.addColorStop(0, (star.color || '#d0e8ff') + '40');
        glow.addColorStop(1, 'transparent');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        // Star body
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, isHovered ? r * 1.5 : r, 0, Math.PI * 2);
        ctx.fillStyle = star.color || '#d0e8ff';
        ctx.fill();

        // Label
        if (showLabels && (view.zoom >= 1.5 || star.magnitude < 2)) {
          ctx.font = `${isHovered ? 'bold ' : ''}${Math.max(10, 11 + view.zoom)}px Inter, system-ui, sans-serif`;
          ctx.fillStyle = isHovered ? '#38bdf8' : 'rgba(200, 220, 255, 0.7)';
          ctx.textAlign = 'center';
          ctx.fillText(star.name, pos.x, pos.y - r * 2 - 4);
        }
      });
    });

    // Constellation names
    if (showLabels && view.zoom >= 1) {
      CONSTELLATIONS.forEach((c) => {
        const avgRA = c.stars.reduce((s, st) => s + st.ra, 0) / c.stars.length;
        const avgDec = c.stars.reduce((s, st) => s + st.dec, 0) / c.stars.length;
        const pos = raDecToScreen(avgRA, avgDec, view, width, height);
        if (!pos.visible) return;
        const isSelected = selectedConstellation?.name === c.name;
        ctx.font = `${isSelected ? 'bold ' : ''}${14 + view.zoom}px Inter, system-ui, sans-serif`;
        ctx.fillStyle = isSelected ? '#38bdf8' : 'rgba(56, 189, 248, 0.5)';
        ctx.textAlign = 'center';
        ctx.fillText(c.name, pos.x, pos.y + 30);
      });
    }

    // Coordinate grid (subtle)
    if (view.zoom >= 2) {
      ctx.strokeStyle = 'rgba(100, 150, 255, 0.08)';
      ctx.lineWidth = 0.5;
      for (let ra = 0; ra < 360; ra += 30) {
        ctx.beginPath();
        let first = true;
        for (let dec = -80; dec <= 80; dec += 5) {
          const p = raDecToScreen(ra, dec, view, width, height);
          if (!p.visible) { first = true; continue; }
          if (first) { ctx.moveTo(p.x, p.y); first = false; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
      for (let dec = -60; dec <= 60; dec += 30) {
        ctx.beginPath();
        let first = true;
        for (let ra = 0; ra <= 360; ra += 5) {
          const p = raDecToScreen(ra, dec, view, width, height);
          if (!p.visible) { first = true; continue; }
          if (first) { ctx.moveTo(p.x, p.y); first = false; }
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
      }
    }
  }, [view, canvasSize, showLabels, showLines, hoveredStar, selectedConstellation]);

  useEffect(() => {
    draw();
  }, [draw]);

  // Mouse/touch interaction
  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging.current) {
      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      lastPos.current = { x: e.clientX, y: e.clientY };
      const sensitivity = 0.3 / view.zoom;
      setView((v) => ({
        ...v,
        centerRA: v.centerRA - dx * sensitivity,
        centerDec: Math.max(-85, Math.min(85, v.centerDec + dy * sensitivity)),
      }));
    } else {
      // Hit-test stars for hover
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      let found: string | null = null;
      for (const c of CONSTELLATIONS) {
        for (const star of c.stars) {
          const pos = raDecToScreen(star.ra, star.dec, view, canvasSize.width, canvasSize.height);
          if (!pos.visible) continue;
          const dist = Math.hypot(mx - pos.x, my - pos.y);
          if (dist < 15) {
            found = star.name;
            break;
          }
        }
        if (found) break;
      }
      setHoveredStar(found);
    }
  };

  const handlePointerUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setView((v) => ({
      ...v,
      zoom: Math.max(0.5, Math.min(8, v.zoom + (e.deltaY < 0 ? 0.3 : -0.3))),
    }));
  };

  const handleClick = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    // Check if clicked on a constellation star
    for (const c of CONSTELLATIONS) {
      for (const star of c.stars) {
        const pos = raDecToScreen(star.ra, star.dec, view, canvasSize.width, canvasSize.height);
        if (!pos.visible) continue;
        if (Math.hypot(mx - pos.x, my - pos.y) < 15) {
          setSelectedConstellation(c);
          return;
        }
      }
    }
    setSelectedConstellation(null);
  };

  const resetView = () => setView({ centerRA: 84, centerDec: 5, zoom: 2 });

  const navigateToConstellation = (c: Constellation) => {
    const avgRA = c.stars.reduce((s, st) => s + st.ra, 0) / c.stars.length;
    const avgDec = c.stars.reduce((s, st) => s + st.dec, 0) / c.stars.length;
    setView({ centerRA: avgRA, centerDec: avgDec, zoom: 3 });
    setSelectedConstellation(c);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
          <MapPin className="w-10 h-10 text-primary-400" />
          Interactive Sky Map
        </h1>
        <p className="text-gray-400 text-lg">
          Drag to pan, scroll to zoom, click a star for its data
        </p>
        <p className="text-xs text-gray-500 mt-3 max-w-2xl mx-auto leading-relaxed">
          Named stars use J2000 catalogue positions and visual magnitudes (
          <a href={STAR_DATA_SOURCE} target="_blank" rel="noopener noreferrer" className="text-primary-400 hover:text-primary-300">SIMBAD</a>
          ). The faint background stars are generated decoration and do not correspond to
          real stars — only the labelled ones do.
        </p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sky Canvas */}
        <div className="lg:col-span-3">
          <div className="card p-0 overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-3 border-b border-primary-900/20 bg-space-blue/50">
              <div className="flex items-center space-x-2">
                <button onClick={() => setView((v) => ({ ...v, zoom: Math.min(8, v.zoom + 0.5) }))} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-space-purple rounded" title="Zoom in">
                  <ZoomIn className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-400 px-2">{view.zoom.toFixed(1)}x</span>
                <button onClick={() => setView((v) => ({ ...v, zoom: Math.max(0.5, v.zoom - 0.5) }))} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-space-purple rounded" title="Zoom out">
                  <ZoomOut className="w-5 h-5" />
                </button>
                <button onClick={resetView} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-space-purple rounded ml-2" title="Reset view">
                  <RotateCcw className="w-5 h-5" />
                </button>
                <div className="border-l border-gray-700 h-6 mx-2" />
                <button onClick={() => setShowLabels((v) => !v)} className={`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded ${showLabels ? 'bg-primary-900/30 text-primary-400' : 'hover:bg-space-purple'}`} title="Toggle labels">
                  {showLabels ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                </button>
                <button onClick={() => setShowLines((v) => !v)} className={`p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded text-sm font-medium ${showLines ? 'bg-primary-900/30 text-primary-400' : 'hover:bg-space-purple text-gray-400'}`} title="Toggle constellation lines">
                  Lines
                </button>
              </div>
              <div className="text-xs text-gray-500">
                RA {view.centerRA.toFixed(1)}  Dec {view.centerDec.toFixed(1)}
              </div>
            </div>

            {/* Canvas */}
            <div ref={containerRef} className="w-full" style={{ height: 'clamp(400px, 60vh, 700px)' }}>
              <canvas
                ref={canvasRef}
                className="w-full h-full cursor-grab active:cursor-grabbing touch-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onWheel={handleWheel}
                onClick={handleClick}
              />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Selected constellation info */}
          <AnimatePresence mode="wait">
            {selectedConstellation && (
              <motion.div
                key={selectedConstellation.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="card bg-gradient-to-br from-primary-900/30 to-purple-900/30"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-primary-400" />
                    <h3 className="text-lg font-bold">{selectedConstellation.name}</h3>
                    <span className="text-xs text-gray-500">({selectedConstellation.abbreviation})</span>
                  </div>
                  <button onClick={() => setSelectedConstellation(null)} className="text-gray-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-300 mb-3">{selectedConstellation.description}</p>
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold text-gray-400 uppercase">Notable Stars</h4>
                  {selectedConstellation.stars.filter((s) => s.magnitude < 3).map((star) => (
                    <div key={star.name} className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: star.color || '#d0e8ff' }} />
                        <span>{star.name}</span>
                      </div>
                      <span className="text-gray-500">mag {star.magnitude.toFixed(1)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Constellation list */}
          <div className="card">
            <h3 className="text-lg font-semibold mb-3">Constellations</h3>
            <div className="space-y-1 max-h-[400px] overflow-y-auto scrollbar-thin">
              {CONSTELLATIONS.map((c) => (
                <button
                  key={c.name}
                  onClick={() => navigateToConstellation(c)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                    selectedConstellation?.name === c.name
                      ? 'bg-primary-900/30 text-primary-400'
                      : 'hover:bg-space-purple text-gray-300'
                  }`}
                >
                  <span className="font-medium">{c.name}</span>
                  <span className="text-gray-500 ml-2">({c.abbreviation})</span>
                  <div className="text-xs text-gray-500 mt-0.5">{c.stars.length} stars</div>
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="card">
            <h3 className="text-sm font-semibold mb-2">Star Colors</h3>
            <p className="text-xs text-gray-500 mb-2">Approximate, by spectral type.</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#a8d8ff' }} /><span>Blue (Hot)</span></div>
              <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ffffd0' }} /><span>White</span></div>
              <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ffd699' }} /><span>Yellow</span></div>
              <div className="flex items-center space-x-2"><div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#ff6b35' }} /><span>Red (Cool)</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
