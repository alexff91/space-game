import { isDemoMode } from '@/services/appMode';

/**
 * Постоянная плашка о том, что бэкенда нет.
 *
 * Была жёлтой на весь экран, с перечислением всего, чего здесь нет. Второе
 * мнение (GPT, 12.09.2026): плашка подавляла продукт, а «ничего никуда не
 * уходит» неправда при живых запросах к NASA. Теперь одна строка в тон
 * шапки; несъёмность оставлена — ради неё плашка и существует.
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
      className="bg-slate-800/80 text-slate-200 border-b border-slate-700"
    >
      <p className="container mx-auto px-4 py-1.5 text-xs sm:text-sm leading-snug">
        <span className="font-semibold">Demo.</span> Nothing you do here is saved
        or sent anywhere. Images load live from NASA.
      </p>
    </div>
  );
}
