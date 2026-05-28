import SpaceShooter from '@/components/SpaceShooter';

export default function Arcade() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
          Star Defender
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto">
          A fast arcade break from the science. Blast through escalating waves,
          dodge enemy fire, and chase the top of the local leaderboard.
        </p>
      </div>
      <SpaceShooter />
    </div>
  );
}
