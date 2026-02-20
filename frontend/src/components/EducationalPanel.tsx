import { BookOpen, Sparkles } from 'lucide-react';

interface EducationalPanelProps {
  category?: string;
}

const EDUCATIONAL_CONTENT: Record<string, {
  title: string;
  content: string;
  facts: string[];
  howToIdentify: string;
}> = {
  galaxy: {
    title: 'Galaxies',
    content:
      'Galaxies are massive systems of stars, stellar remnants, interstellar gas, dust, and dark matter, bound together by gravity. Our own Milky Way is just one of billions of galaxies in the observable universe.',
    facts: [
      'The Milky Way contains 100-400 billion stars',
      'Galaxies can be spiral, elliptical, or irregular in shape',
      'The nearest major galaxy to us is Andromeda, 2.5 million light-years away',
      'Supermassive black holes exist at the centers of most galaxies',
    ],
    howToIdentify:
      'Look for spiral arms, bright central bulges, or fuzzy elliptical shapes. Galaxies often appear as distinct structures separate from the star field.',
  },
  nebula: {
    title: 'Nebulae',
    content:
      'Nebulae are vast clouds of gas and dust in space. Some are stellar nurseries where new stars are born, while others are the remnants of dying stars.',
    facts: [
      'The word "nebula" comes from Latin meaning "cloud"',
      'Emission nebulae glow by ionized gas, appearing red or pink',
      'Reflection nebulae reflect light from nearby stars, appearing blue',
      'The Orion Nebula is the closest star-forming region to Earth',
    ],
    howToIdentify:
      'Look for colorful, cloud-like structures. Nebulae often have irregular shapes and may show red, blue, or green colors depending on their type.',
  },
  star_cluster: {
    title: 'Star Clusters',
    content:
      'Star clusters are groups of stars that formed from the same molecular cloud and are gravitationally bound. Open clusters are younger and loosely bound, while globular clusters are ancient and tightly packed.',
    facts: [
      'Globular clusters can contain millions of stars',
      'Open clusters typically have hundreds to thousands of stars',
      'Pleiades (Seven Sisters) is one of the most famous open clusters',
      'Globular clusters orbit in the halo around galaxies',
    ],
    howToIdentify:
      'Open clusters appear as loose groupings of bright stars. Globular clusters are dense, spherical concentrations of stars.',
  },
  supernova: {
    title: 'Supernovae',
    content:
      'A supernova is the explosive death of a massive star. These cosmic explosions briefly outshine entire galaxies and create most of the heavy elements in the universe.',
    facts: [
      'Supernovae can be as bright as 10 billion suns',
      'They create and disperse elements heavier than iron',
      'The last nearby supernova visible to the naked eye was in 1604',
      'Supernova remnants can be visible for thousands of years',
    ],
    howToIdentify:
      'Look for expanding shell structures, bright central points, or filamentary patterns. Supernova remnants often show complex, wispy structures.',
  },
  black_hole: {
    title: 'Black Holes & Accretion Disks',
    content:
      'Black holes are regions of spacetime where gravity is so strong that nothing, not even light, can escape. We detect them by observing their effects on nearby matter.',
    facts: [
      'The first image of a black hole was captured in 2019',
      'Supermassive black holes can be billions of times the Sun\'s mass',
      'Matter falling into a black hole forms an accretion disk',
      'Accretion disks can reach millions of degrees',
    ],
    howToIdentify:
      'Look for bright accretion disks, jets of material, or gravitational lensing effects. Black holes themselves are invisible but affect their surroundings.',
  },
  asteroid: {
    title: 'Asteroids & Trails',
    content:
      'Asteroids are rocky objects orbiting the Sun. In long-exposure images, they appear as streaks or trails due to their motion relative to background stars.',
    facts: [
      'Most asteroids orbit in the asteroid belt between Mars and Jupiter',
      'Over 1 million asteroids have been discovered',
      'Some asteroids are actually extinct comets',
      'Asteroids range from small rocks to objects hundreds of kilometers wide',
    ],
    howToIdentify:
      'Look for straight or slightly curved lines across the image. These trails stand out against the static star field.',
  },
  quasar: {
    title: 'Quasars',
    content:
      'Quasars are extremely luminous active galactic nuclei powered by supermassive black holes consuming material. They are among the most distant and energetic objects in the universe.',
    facts: [
      'Quasars can be 100 times brighter than the Milky Way',
      'They are powered by black holes millions to billions of solar masses',
      'Most quasars formed in the early universe',
      'The light from distant quasars has traveled for billions of years',
    ],
    howToIdentify:
      'Appear as very bright point sources, sometimes with jets. They may be indistinguishable from stars without spectroscopic analysis.',
  },
  anomaly: {
    title: 'Anomalies & Unknowns',
    content:
      'These are objects or patterns that don\'t fit neatly into known categories. They might be unusual cosmic phenomena, rare events, or artifacts worth investigating further.',
    facts: [
      'Many discoveries started as "anomalies"',
      'Citizen scientists have discovered new types of galaxies',
      'Transient events like novae appear as temporary bright spots',
      'Your observation might lead to a scientific discovery!',
    ],
    howToIdentify:
      'Anything unusual, unexpected, or that doesn\'t match known patterns. Trust your instincts - if it looks interesting, mark it!',
  },
};

export default function EducationalPanel({ category }: EducationalPanelProps) {
  if (!category || !EDUCATIONAL_CONTENT[category]) return null;

  const content = EDUCATIONAL_CONTENT[category];

  return (
    <div className="card bg-gradient-to-br from-purple-900/30 to-blue-900/30">
      <div className="flex items-center space-x-2 mb-4">
        <BookOpen className="w-6 h-6 text-purple-400" />
        <h3 className="text-xl font-semibold">{content.title}</h3>
      </div>

      <p className="text-gray-300 mb-4 leading-relaxed">{content.content}</p>

      <div className="mb-4">
        <h4 className="font-semibold text-sm text-purple-400 mb-2 flex items-center">
          <Sparkles className="w-4 h-4 mr-1" />
          How to Identify
        </h4>
        <p className="text-sm text-gray-400">{content.howToIdentify}</p>
      </div>

      <div>
        <h4 className="font-semibold text-sm text-purple-400 mb-2">
          Fascinating Facts
        </h4>
        <ul className="space-y-2">
          {content.facts.map((fact, index) => (
            <li key={index} className="text-sm text-gray-400 flex items-start">
              <span className="text-purple-400 mr-2">•</span>
              <span>{fact}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
