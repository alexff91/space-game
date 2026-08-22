/**
 * Справочные данные — только то, что можно проверить по первоисточнику.
 *
 * ПОЧЕМУ этот файл заменил demoData.ts: в том файле настоящий звёздный
 * каталог лежал вперемешку с выдуманным рейтингом, выдуманным пользователем
 * и счётчиками «24 разметки» — и всё вместе называлось «демо-данные».
 * Здесь остались только величины из каталогов и таблиц, у каждой указан
 * источник. Всё, что нельзя подтвердить, удалено, а не «оценено».
 */

// ---------------------------------------------------------------------------
// Календарь астрономических событий
//
// Даты сверены вручную 22.08.2026:
//   - затмения — по декадным таблицам NASA GSFC;
//   - метеорные потоки, противостояния, равноденствия и солнцестояния —
//     по календарю in-the-sky.org.
// Прежняя версия списка содержала 5 неверных дат из 12: противостояние
// Юпитера стояло в ноябре вместо января, Сатурна — в сентябре вместо октября,
// частное лунное затмение — 17 сентября, когда его не существует.
// ---------------------------------------------------------------------------

export const EVENTS_VERIFIED_ON = '2026-08-22';

const NASA_SOLAR_ECLIPSES = 'https://eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html';
const NASA_LUNAR_ECLIPSES = 'https://eclipse.gsfc.nasa.gov/LEdecade/LEdecade2021.html';
const skyCalendar = (month: number) =>
  `https://in-the-sky.org/newscal.php?year=2026&month=${month}`;

export interface AstronomicalEvent {
  id: number;
  title: string;
  date: string;
  description: string;
  type:
    | 'meteor-shower' | 'eclipse' | 'conjunction' | 'opposition'
    | 'transit' | 'equinox' | 'solstice' | 'supermoon' | 'comet';
  visibility: 'naked-eye' | 'binoculars' | 'telescope';
  bestRegion: string;
  /** Ссылка, по которой дату можно перепроверить. Без неё событию здесь не место. */
  source: string;
}

export const ASTRONOMICAL_EVENTS: AstronomicalEvent[] = [
  {
    id: 1,
    title: 'Quadrantids Meteor Shower',
    date: '2026-01-03',
    description:
      'Peak of the Quadrantids. Published zenithal hourly rate is around 110-120 — that is an idealised figure for a dark sky with the radiant overhead; a real count is usually far lower. Best after midnight.',
    type: 'meteor-shower', visibility: 'naked-eye', bestRegion: 'Northern Hemisphere',
    source: skyCalendar(1),
  },
  {
    id: 2,
    title: 'Jupiter at Opposition',
    date: '2026-01-10',
    description:
      'Jupiter is opposite the Sun and at its closest and brightest for the year. Cloud bands and the four Galilean moons are visible in a small telescope.',
    type: 'opposition', visibility: 'binoculars', bestRegion: 'Global',
    source: skyCalendar(1),
  },
  {
    id: 3,
    title: 'Annular Solar Eclipse',
    date: '2026-02-17',
    description:
      'Annular eclipse, eclipse magnitude 0.963, up to 2 min 20 s of annularity. The annular path runs across Antarctica; partial phases are seen from southern Argentina and Chile and from southern Africa.',
    type: 'eclipse', visibility: 'naked-eye', bestRegion: 'Antarctica, southern South America, southern Africa',
    source: NASA_SOLAR_ECLIPSES,
  },
  {
    id: 4,
    title: 'Total Lunar Eclipse',
    date: '2026-03-03',
    description:
      'The Moon passes through the Earth\'s umbra. Umbral magnitude 1.151; totality lasts about 58 minutes within a 3 h 27 m partial phase.',
    type: 'eclipse', visibility: 'naked-eye', bestRegion: 'Pacific, Americas, East Asia',
    source: NASA_LUNAR_ECLIPSES,
  },
  {
    id: 5,
    title: 'March Equinox',
    date: '2026-03-20',
    description:
      'The Sun crosses the celestial equator northwards. Day and night are close to equal length everywhere on Earth; astronomical spring begins in the Northern Hemisphere.',
    type: 'equinox', visibility: 'naked-eye', bestRegion: 'Global',
    source: skyCalendar(3),
  },
  {
    id: 6,
    title: 'Lyrid Meteor Shower',
    date: '2026-04-22',
    description:
      'Peak of the Lyrids, debris from comet C/1861 G1 Thatcher. Zenithal hourly rate around 18 under ideal conditions.',
    type: 'meteor-shower', visibility: 'naked-eye', bestRegion: 'Northern Hemisphere',
    source: skyCalendar(4),
  },
  {
    id: 7,
    title: 'June Solstice',
    date: '2026-06-21',
    description:
      'The Sun reaches its northernmost point. Longest day of 2026 in the Northern Hemisphere, shortest in the Southern.',
    type: 'solstice', visibility: 'naked-eye', bestRegion: 'Global',
    source: skyCalendar(6),
  },
  {
    id: 8,
    title: 'Total Solar Eclipse',
    date: '2026-08-12',
    description:
      'Total eclipse, eclipse magnitude 1.039, up to 2 min 18 s of totality. The path of totality crosses eastern Greenland, Iceland and northern Spain; partial phases reach northern North America, western Africa and the rest of Europe.',
    type: 'eclipse', visibility: 'naked-eye', bestRegion: 'Greenland, Iceland, Spain',
    source: NASA_SOLAR_ECLIPSES,
  },
  {
    id: 9,
    title: 'Perseid Meteor Shower',
    date: '2026-08-13',
    description:
      'Peak of the Perseids, debris from comet 109P/Swift-Tuttle. Zenithal hourly rate around 100 — the idealised dark-sky figure, not what a typical observer counts.',
    type: 'meteor-shower', visibility: 'naked-eye', bestRegion: 'Northern Hemisphere',
    source: skyCalendar(8),
  },
  {
    id: 10,
    title: 'Partial Lunar Eclipse',
    date: '2026-08-28',
    description:
      'Partial eclipse with umbral magnitude 0.930 — about 93% of the lunar disc enters the Earth\'s umbra. Visible from the Americas, Antarctica, Africa and Europe.',
    type: 'eclipse', visibility: 'naked-eye', bestRegion: 'Americas, Africa, Europe',
    source: NASA_LUNAR_ECLIPSES,
  },
  {
    id: 11,
    title: 'Saturn at Opposition',
    date: '2026-10-04',
    description:
      'Saturn is opposite the Sun, at its closest and brightest for the year. The best night of 2026 to observe and photograph the rings.',
    type: 'opposition', visibility: 'binoculars', bestRegion: 'Global',
    source: skyCalendar(10),
  },
  {
    id: 12,
    title: 'Orionid Meteor Shower',
    date: '2026-10-21',
    description:
      'Peak of the Orionids, debris from comet 1P/Halley. Zenithal hourly rate around 20; the meteors are fast and often leave persistent trains.',
    type: 'meteor-shower', visibility: 'naked-eye', bestRegion: 'Global',
    source: skyCalendar(10),
  },
  {
    id: 13,
    title: 'Uranus at Opposition',
    date: '2026-11-25',
    description:
      'Uranus is opposite the Sun and best placed for the year. At around magnitude 5.6 it needs binoculars and a dark sky, and a telescope to show a disc.',
    type: 'opposition', visibility: 'binoculars', bestRegion: 'Global',
    source: skyCalendar(11),
  },
  {
    id: 14,
    title: 'Geminid Meteor Shower',
    date: '2026-12-14',
    description:
      'Peak of the Geminids, debris from asteroid 3200 Phaethon. Zenithal hourly rate around 150 under ideal conditions — the richest shower of the year.',
    type: 'meteor-shower', visibility: 'naked-eye', bestRegion: 'Global',
    source: skyCalendar(12),
  },
  {
    id: 15,
    title: 'December Solstice',
    date: '2026-12-21',
    description:
      'The Sun reaches its southernmost point. Shortest day of 2026 in the Northern Hemisphere, longest in the Southern.',
    type: 'solstice', visibility: 'naked-eye', bestRegion: 'Global',
    source: skyCalendar(12),
  },
];

// ---------------------------------------------------------------------------
// Звёзды созвездий
//
// Координаты — ICRS/J2000 в градусах, звёздные величины — визуальные (V).
// Сверено выборочно по SIMBAD (Betelgeuse 88.7929 / +7.4070, Vega 279.235 /
// +38.784). Величина Бетельгейзе указана типичной: звезда переменная,
// 0.0-1.6, поэтому одно число здесь — приближение по своей природе.
// ---------------------------------------------------------------------------

export const STAR_DATA_SOURCE = 'https://simbad.cds.unistra.fr/simbad/';

export interface ConstellationStar {
  name: string;
  ra: number;   // прямое восхождение, градусы (0-360), ICRS/J2000
  dec: number;  // склонение, градусы (-90..90), ICRS/J2000
  magnitude: number;
  color?: string;
}

export interface Constellation {
  name: string;
  abbreviation: string;
  stars: ConstellationStar[];
  lines: [number, number][]; // пары индексов звёзд, которые соединяет линия
  description: string;
}

export const CONSTELLATIONS: Constellation[] = [
  {
    name: 'Orion',
    abbreviation: 'Ori',
    description: 'The Hunter — one of the most recognizable constellations, visible from most of the world. Contains the Orion Nebula (M42).',
    stars: [
      { name: 'Betelgeuse', ra: 88.79, dec: 7.41, magnitude: 0.5, color: '#ff6b35' },
      { name: 'Rigel', ra: 78.63, dec: -8.20, magnitude: 0.13, color: '#a8d8ff' },
      { name: 'Bellatrix', ra: 81.28, dec: 6.35, magnitude: 1.64, color: '#c8e0ff' },
      { name: 'Mintaka', ra: 83.00, dec: -0.30, magnitude: 2.23, color: '#d0e8ff' },
      { name: 'Alnilam', ra: 84.05, dec: -1.20, magnitude: 1.69, color: '#c8e0ff' },
      { name: 'Alnitak', ra: 85.19, dec: -1.94, magnitude: 1.77, color: '#c8e0ff' },
      { name: 'Saiph', ra: 86.94, dec: -9.67, magnitude: 2.09, color: '#c8e0ff' },
    ],
    lines: [[0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 1], [1, 3], [0, 4]],
  },
  {
    name: 'Ursa Major',
    abbreviation: 'UMa',
    description: 'The Great Bear — contains the Big Dipper asterism, one of the most familiar star patterns in the northern sky.',
    stars: [
      { name: 'Dubhe', ra: 165.93, dec: 61.75, magnitude: 1.79, color: '#ffd699' },
      { name: 'Merak', ra: 165.46, dec: 56.38, magnitude: 2.37, color: '#d0e8ff' },
      { name: 'Phecda', ra: 178.46, dec: 53.69, magnitude: 2.44, color: '#d0e8ff' },
      { name: 'Megrez', ra: 183.86, dec: 57.03, magnitude: 3.31, color: '#d0e8ff' },
      { name: 'Alioth', ra: 193.51, dec: 55.96, magnitude: 1.77, color: '#d0e8ff' },
      { name: 'Mizar', ra: 200.98, dec: 54.93, magnitude: 2.27, color: '#d0e8ff' },
      { name: 'Alkaid', ra: 206.89, dec: 49.31, magnitude: 1.86, color: '#c8e0ff' },
    ],
    lines: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [3, 0]],
  },
  {
    name: 'Cassiopeia',
    abbreviation: 'Cas',
    description: 'The Queen — a distinctive W-shaped constellation circling the north celestial pole.',
    stars: [
      { name: 'Schedar', ra: 10.13, dec: 56.54, magnitude: 2.23, color: '#ffd699' },
      { name: 'Caph', ra: 2.29, dec: 59.15, magnitude: 2.27, color: '#ffffd0' },
      { name: 'Gamma Cas', ra: 14.18, dec: 60.72, magnitude: 2.47, color: '#c8e0ff' },
      { name: 'Ruchbah', ra: 21.45, dec: 60.24, magnitude: 2.68, color: '#d0e8ff' },
      { name: 'Segin', ra: 28.60, dec: 63.67, magnitude: 3.37, color: '#c8e0ff' },
    ],
    lines: [[0, 1], [0, 2], [2, 3], [3, 4]],
  },
  {
    name: 'Scorpius',
    abbreviation: 'Sco',
    description: 'The Scorpion — a zodiac constellation with the red supergiant Antares at its heart. Best seen in summer from the Northern Hemisphere.',
    stars: [
      { name: 'Antares', ra: 247.35, dec: -26.43, magnitude: 0.96, color: '#ff4500' },
      { name: 'Shaula', ra: 263.40, dec: -37.10, magnitude: 1.63, color: '#c8e0ff' },
      { name: 'Sargas', ra: 264.33, dec: -42.99, magnitude: 1.87, color: '#ffffd0' },
      { name: 'Dschubba', ra: 240.08, dec: -22.62, magnitude: 2.32, color: '#c8e0ff' },
      { name: 'Graffias', ra: 241.36, dec: -19.81, magnitude: 2.62, color: '#c8e0ff' },
      { name: 'Epsilon Sco', ra: 252.54, dec: -34.29, magnitude: 2.29, color: '#ffd699' },
    ],
    lines: [[4, 3], [3, 0], [0, 5], [5, 1], [1, 2]],
  },
  {
    name: 'Leo',
    abbreviation: 'Leo',
    description: 'The Lion — a zodiac constellation anchored by the bright star Regulus.',
    stars: [
      { name: 'Regulus', ra: 152.09, dec: 11.97, magnitude: 1.35, color: '#c8e0ff' },
      { name: 'Denebola', ra: 177.26, dec: 14.57, magnitude: 2.14, color: '#d0e8ff' },
      { name: 'Algieba', ra: 146.46, dec: 19.84, magnitude: 2.28, color: '#ffd699' },
      { name: 'Zosma', ra: 168.53, dec: 20.52, magnitude: 2.56, color: '#d0e8ff' },
      { name: 'Chertan', ra: 168.56, dec: 15.43, magnitude: 3.33, color: '#d0e8ff' },
    ],
    lines: [[0, 2], [2, 3], [3, 1], [0, 4], [4, 1]],
  },
  {
    name: 'Cygnus',
    abbreviation: 'Cyg',
    description: 'The Swan — also known as the Northern Cross. Contains Deneb and lies along the Milky Way.',
    stars: [
      { name: 'Deneb', ra: 310.36, dec: 45.28, magnitude: 1.25, color: '#d0e8ff' },
      { name: 'Sadr', ra: 305.56, dec: 40.26, magnitude: 2.20, color: '#ffffd0' },
      { name: 'Gienah', ra: 311.55, dec: 33.97, magnitude: 2.46, color: '#ffd699' },
      { name: 'Albireo', ra: 292.68, dec: 27.96, magnitude: 3.08, color: '#ffd699' },
      { name: 'Delta Cyg', ra: 296.24, dec: 45.13, magnitude: 2.87, color: '#c8e0ff' },
    ],
    lines: [[0, 1], [1, 2], [1, 3], [1, 4]],
  },
  {
    name: 'Lyra',
    abbreviation: 'Lyr',
    description: 'The Lyre — small but prominent. Contains Vega, part of the Summer Triangle.',
    stars: [
      { name: 'Vega', ra: 279.23, dec: 38.78, magnitude: 0.03, color: '#d0e8ff' },
      { name: 'Sheliak', ra: 282.52, dec: 33.36, magnitude: 3.52, color: '#d0e8ff' },
      { name: 'Sulafat', ra: 284.74, dec: 32.69, magnitude: 3.24, color: '#c8e0ff' },
      { name: 'Delta1 Lyr', ra: 281.08, dec: 36.98, magnitude: 5.58, color: '#c8e0ff' },
    ],
    lines: [[0, 1], [0, 2], [1, 2], [0, 3]],
  },
];
