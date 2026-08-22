import { AlertTriangle } from 'lucide-react';
import { isDemoMode } from '@/services/appMode';

/**
 * Постоянная плашка о том, что бэкенда нет.
 *
 * ПОЧЕМУ не всплывающее окно: окно закрывают на первом экране и дальше
 * человек час размечает снимки, считая, что помогает науке. Плашка липнет
 * к верху страницы, у неё нет кнопки закрытия и её нельзя скрыть — это
 * единственный способ, при котором утверждение остаётся верным всё время,
 * пока человек пользуется приложением.
 */
export default function DemoBanner() {
  if (!isDemoMode()) return null;

  return (
    <div
      role="status"
      className="bg-amber-500 text-amber-950 border-b border-amber-700"
    >
      <div className="container mx-auto px-4 py-2 flex items-start gap-2 text-xs sm:text-sm">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
        <p className="leading-snug">
          <span className="font-bold uppercase tracking-wide">Demo build — no backend.</span>{' '}
          Nothing is saved and nothing is sent anywhere — not to a server, not to
          any researcher. There are no scores, no leaderboard and no accounts. The images
          come live from NASA&apos;s public APOD API; everything else on this site is
          reference data with its source cited, or it is not shown at all.
        </p>
      </div>
    </div>
  );
}
