import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import EducationalPanel from '@/components/EducationalPanel';

describe('EducationalPanel', () => {
  it('should render nothing when no category is provided', () => {
    const { container } = render(<EducationalPanel />);
    expect(container.firstChild).toBeNull();
  });

  it('should render nothing for an unknown category', () => {
    const { container } = render(<EducationalPanel category="unknown_category" />);
    expect(container.firstChild).toBeNull();
  });

  it('should render galaxy educational content', () => {
    render(<EducationalPanel category="galaxy" />);

    expect(screen.getByText('Galaxies')).toBeInTheDocument();
    expect(
      screen.getByText(/massive systems of stars/i)
    ).toBeInTheDocument();
    expect(screen.getByText('How to Identify')).toBeInTheDocument();
    expect(screen.getByText('Fascinating Facts')).toBeInTheDocument();
  });

  it('should render nebula educational content', () => {
    render(<EducationalPanel category="nebula" />);

    expect(screen.getByText('Nebulae')).toBeInTheDocument();
    expect(
      screen.getByText(/vast clouds of gas and dust/i)
    ).toBeInTheDocument();
  });

  it('should render star_cluster educational content', () => {
    render(<EducationalPanel category="star_cluster" />);

    expect(screen.getByText('Star Clusters')).toBeInTheDocument();
  });

  it('should render supernova educational content with facts', () => {
    render(<EducationalPanel category="supernova" />);

    expect(screen.getByText('Supernovae')).toBeInTheDocument();
    expect(
      screen.getByText(/explosive death of a massive star/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/as bright as 10 billion suns/i)
    ).toBeInTheDocument();
  });

  it('should render black_hole content', () => {
    render(<EducationalPanel category="black_hole" />);

    expect(
      screen.getByText('Black Holes & Accretion Disks')
    ).toBeInTheDocument();
  });

  it('should render quasar content', () => {
    render(<EducationalPanel category="quasar" />);

    expect(screen.getByText('Quasars')).toBeInTheDocument();
    expect(
      screen.getByText(/extremely luminous active galactic nuclei/i)
    ).toBeInTheDocument();
  });

  it('should render anomaly content encouraging discovery', () => {
    render(<EducationalPanel category="anomaly" />);

    expect(screen.getByText('Anomalies & Unknowns')).toBeInTheDocument();
    expect(
      screen.getByText(/might lead to a scientific discovery/i)
    ).toBeInTheDocument();
  });
});
