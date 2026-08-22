import { Link } from 'react-router-dom';
import { ServerOff, ArrowRight } from 'lucide-react';

/**
 * Заглушка для экранов, которые без бэкенда были бы враньём.
 *
 * ПОЧЕМУ экраны выкинуты, а не «смягчены»: разметка, очки, уровни, серии
 * и рейтинг существуют только если их кто-то хранит и считает. Без бэкенда
 * любая цифра на этих экранах — выдумка, и «менее выдуманной» её не сделать.
 * Код самих экранов остался и работает, когда VITE_API_URL указывает
 * на настоящий сервер.
 */
export default function BackendRequired({ feature }: { feature: string }) {
  return (
    <div className="max-w-xl mx-auto text-center py-20">
      <ServerOff className="w-14 h-14 text-gray-500 mx-auto mb-6" />
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{feature} is not available here</h1>
      <p className="text-gray-400 leading-relaxed mb-3">
        This is a static build with no backend. {feature} would need a server to store
        and count things, and there isn&apos;t one — so this page has no data to show.
      </p>
      <p className="text-gray-500 text-sm leading-relaxed mb-8">
        Rather than fill it with plausible-looking numbers, the page is switched off.
        Run the project with its backend (<code className="text-gray-400">VITE_API_URL</code>{' '}
        pointing at a real API) to get it back.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/gallery" className="btn-primary flex items-center justify-center gap-2">
          NASA Gallery <ArrowRight className="w-4 h-4" />
        </Link>
        <Link to="/sky-map" className="btn-secondary flex items-center justify-center gap-2">
          Sky Map <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
