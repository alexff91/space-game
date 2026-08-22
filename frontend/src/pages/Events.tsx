import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Eye, Search, Star, Moon, Sun, Zap, ChevronLeft, ChevronRight } from 'lucide-react';
import { ASTRONOMICAL_EVENTS, EVENTS_VERIFIED_ON, type AstronomicalEvent } from '@/services/referenceData';

/**
 * Astronomical Events Calendar — displays upcoming celestial events
 * with a beautiful timeline and filtering capabilities.
 */

const EVENT_TYPE_CONFIG: Record<AstronomicalEvent['type'], { icon: React.ReactNode; color: string; label: string }> = {
  'meteor-shower': { icon: <Star className="w-5 h-5" />, color: '#fbbf24', label: 'Meteor Shower' },
  'eclipse': { icon: <Moon className="w-5 h-5" />, color: '#ef4444', label: 'Eclipse' },
  'conjunction': { icon: <Zap className="w-5 h-5" />, color: '#a78bfa', label: 'Conjunction' },
  'opposition': { icon: <Search className="w-5 h-5" />, color: '#60a5fa', label: 'Opposition' },
  'transit': { icon: <Sun className="w-5 h-5" />, color: '#f97316', label: 'Transit' },
  'equinox': { icon: <Sun className="w-5 h-5" />, color: '#34d399', label: 'Equinox' },
  'solstice': { icon: <Sun className="w-5 h-5" />, color: '#fcd34d', label: 'Solstice' },
  'supermoon': { icon: <Moon className="w-5 h-5" />, color: '#c084fc', label: 'Supermoon' },
  'comet': { icon: <Star className="w-5 h-5" />, color: '#22d3ee', label: 'Comet' },
};

const VISIBILITY_CONFIG: Record<AstronomicalEvent['visibility'], { icon: React.ReactNode; label: string }> = {
  'naked-eye': { icon: <Eye className="w-4 h-4" />, label: 'Naked Eye' },
  'binoculars': { icon: <Eye className="w-4 h-4" />, label: 'Binoculars' },
  'telescope': { icon: <Search className="w-4 h-4" />, label: 'Telescope' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Events() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

  const events = useMemo(() => {
    let filtered = ASTRONOMICAL_EVENTS.filter((e) => new Date(e.date).getFullYear() === selectedYear);
    if (selectedType !== 'all') {
      filtered = filtered.filter((e) => e.type === selectedType);
    }
    return filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [selectedType, selectedYear]);

  const eventTypes = Array.from(new Set(ASTRONOMICAL_EVENTS.map((e) => e.type)));

  // Group by month
  const grouped = useMemo(() => {
    const groups: Record<number, AstronomicalEvent[]> = {};
    events.forEach((e) => {
      const month = new Date(e.date).getMonth();
      if (!groups[month]) groups[month] = [];
      groups[month].push(e);
    });
    return groups;
  }, [events]);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const daysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
    if (diff < 0) return 'Past';
    if (diff === 0) return 'Today!';
    if (diff === 1) return 'Tomorrow';
    return `${diff} days away`;
  };

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-3">
          <Calendar className="w-10 h-10 text-primary-400" />
          Astronomical Events
        </h1>
        <p className="text-gray-400 text-lg">
          Eclipses, meteor showers and oppositions for 2026
        </p>
        {/* ПОЧЕМУ подпись: 5 из 12 дат в прежнем списке были неверны.
            Дата сверки и ссылка на источник — то, чем читатель может это
            проверить, не веря нам на слово. */}
        <p className="text-xs text-gray-500 mt-3 max-w-2xl mx-auto leading-relaxed">
          Every date below was checked by hand against a published source on {EVENTS_VERIFIED_ON}
          {' '}(NASA GSFC eclipse tables, in-the-sky.org). Open an event to see its source link.
          Events that could not be checked are not listed.
        </p>
      </div>

      {/* Year selector */}
      <div className="flex items-center justify-center space-x-4 mb-6">
        <button onClick={() => setSelectedYear((y) => y - 1)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-space-purple rounded-lg">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <span className="text-2xl font-bold text-primary-400">{selectedYear}</span>
        <button onClick={() => setSelectedYear((y) => y + 1)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center hover:bg-space-purple rounded-lg">
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        <button
          onClick={() => setSelectedType('all')}
          className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors ${
            selectedType === 'all' ? 'bg-primary-600 text-white' : 'bg-space-blue text-gray-400 hover:text-white'
          }`}
        >
          All Events ({events.length})
        </button>
        {eventTypes.map((type) => {
          const config = EVENT_TYPE_CONFIG[type];
          return (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 min-h-[44px] rounded-full text-sm font-medium transition-colors flex items-center gap-1.5 ${
                selectedType === type
                  ? 'text-white'
                  : 'bg-space-blue text-gray-400 hover:text-white'
              }`}
              style={selectedType === type ? { backgroundColor: config.color + '40', color: config.color } : {}}
            >
              {config.icon}
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary-500/50 via-purple-500/50 to-primary-500/50" />

        {/* Month groups */}
        {Object.entries(grouped).map(([monthStr, monthEvents], gIdx) => {
          const month = parseInt(monthStr);
          return (
            <div key={month} className="mb-8">
              {/* Month header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="relative z-10 ml-4 md:ml-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                  <div className="px-4 py-1.5 bg-space-blue border border-primary-500/30 rounded-full">
                    <span className="text-primary-400 font-semibold text-sm">
                      {MONTHS[month]} {selectedYear}
                    </span>
                  </div>
                </div>
              </div>

              {/* Events */}
              {monthEvents.map((event, idx) => {
                const config = EVENT_TYPE_CONFIG[event.type];
                const vis = VISIBILITY_CONFIG[event.visibility];
                const isExpanded = expandedEvent === event.id;
                const isRight = (gIdx + idx) % 2 === 0;

                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: isRight ? 30 : -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    className={`relative flex items-start mb-6 ${
                      isRight ? 'md:flex-row-reverse' : ''
                    }`}
                  >
                    {/* Timeline dot */}
                    <div className="absolute left-[26px] md:left-1/2 md:-translate-x-1/2 z-10 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: config.color, backgroundColor: '#0a0e27' }}
                    >
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: config.color }} />
                    </div>

                    {/* Card */}
                    <div
                      className={`ml-16 md:ml-0 w-full md:w-[calc(50%-2rem)] cursor-pointer ${
                        isRight ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
                      }`}
                      onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                    >
                      <div className={`card hover:shadow-xl transition-all ${isExpanded ? 'ring-1' : ''}`}
                        style={isExpanded ? { borderColor: config.color + '40' } : {}}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg" style={{ backgroundColor: config.color + '20', color: config.color }}>
                              {config.icon}
                            </div>
                            <div>
                              <h3 className="font-semibold text-sm">{event.title}</h3>
                              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                                <span>{formatDate(event.date)}</span>
                                <span className="font-medium" style={{ color: config.color }}>{daysUntil(event.date)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-3 space-y-3"
                          >
                            <p className="text-sm text-gray-300 leading-relaxed">{event.description}</p>
                            <div className="flex flex-wrap gap-3 text-xs">
                              <div className="flex items-center gap-1 px-2 py-1 bg-space-dark rounded-full">
                                {vis.icon}
                                <span>{vis.label}</span>
                              </div>
                              <div className="flex items-center gap-1 px-2 py-1 bg-space-dark rounded-full">
                                <span>{event.bestRegion}</span>
                              </div>
                              <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ backgroundColor: config.color + '20', color: config.color }}>
                                {config.label}
                              </div>
                            </div>
                            <a
                              href={event.source}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="inline-block text-xs text-primary-400 hover:text-primary-300 underline decoration-dotted"
                            >
                              Check this date at the source
                            </a>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          );
        })}

        {events.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            {selectedYear === 2026
              ? 'No events match the selected filter.'
              : `No data — only 2026 has been checked against a source. Nothing is listed for ${selectedYear}.`}
          </div>
        )}
      </div>
    </div>
  );
}
