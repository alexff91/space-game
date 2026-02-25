import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import MissionCard from '@/components/MissionCard';

const baseMission = {
  id: 1,
  title: 'Galaxy Explorer',
  description: 'Find and annotate 10 spiral galaxies in deep space images.',
  objective: { type: 'annotate', target: 10 },
  reward: { points: 500, experience: 200 },
  difficulty: 3,
};

describe('MissionCard', () => {
  it('should render mission title and description', () => {
    render(<MissionCard mission={baseMission} />);

    expect(screen.getByText('Galaxy Explorer')).toBeInTheDocument();
    expect(
      screen.getByText(/Find and annotate 10 spiral galaxies/)
    ).toBeInTheDocument();
  });

  it('should display difficulty as Medium for level 3', () => {
    render(<MissionCard mission={baseMission} />);

    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('should display difficulty as Easy for level 1-2', () => {
    render(<MissionCard mission={{ ...baseMission, difficulty: 1 }} />);
    expect(screen.getByText('Easy')).toBeInTheDocument();
  });

  it('should display difficulty as Hard for level 4-5', () => {
    render(<MissionCard mission={{ ...baseMission, difficulty: 5 }} />);
    expect(screen.getByText('Hard')).toBeInTheDocument();
  });

  it('should show reward points', () => {
    render(<MissionCard mission={baseMission} />);

    expect(screen.getByText('+500')).toBeInTheDocument();
  });

  it('should show reward experience', () => {
    render(<MissionCard mission={baseMission} />);

    expect(screen.getByText('+200 XP')).toBeInTheDocument();
  });

  it('should display progress percentage', () => {
    render(<MissionCard mission={{ ...baseMission, progress: 75 }} />);

    expect(screen.getByText('75%')).toBeInTheDocument();
    expect(screen.getByText('Progress')).toBeInTheDocument();
  });

  it('should show Completed badge when progress is 100%', () => {
    render(<MissionCard mission={{ ...baseMission, progress: 100 }} />);

    expect(screen.getByText('Completed!')).toBeInTheDocument();
  });

  it('should display days left when endDate is provided', () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    render(
      <MissionCard
        mission={{ ...baseMission, endDate: futureDate.toISOString() }}
      />
    );

    expect(screen.getByText('5d left')).toBeInTheDocument();
  });

  it('should not show days left when no endDate', () => {
    render(<MissionCard mission={baseMission} />);

    expect(screen.queryByText(/d left/)).not.toBeInTheDocument();
  });
});
