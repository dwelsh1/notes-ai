import React from 'react';
import { render, screen } from '@testing-library/react';
import Progress from '../Progress';

describe('Progress', () => {
  it('should render progress component with correct percentage', () => {
    render(<Progress percentage={0.5} />);

    const progressBar = screen.getByText('Placeholder');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveStyle({ width: '50.00%' });
  });

  it('should handle zero percentage', () => {
    render(<Progress percentage={0} />);

    const progressBar = screen.getByText('Placeholder');
    expect(progressBar).toHaveStyle({ width: '0.00%' });
  });

  it('should handle 100% percentage', () => {
    render(<Progress percentage={1} />);

    const progressBar = screen.getByText('Placeholder');
    expect(progressBar).toHaveStyle({ width: '100.00%' });
  });

  it('should handle decimal percentages', () => {
    render(<Progress percentage={0.333} />);

    const progressBar = screen.getByText('Placeholder');
    expect(progressBar).toHaveStyle({ width: '33.30%' });
  });

  it('should handle negative percentage', () => {
    render(<Progress percentage={-0.5} />);

    const progressBar = screen.getByText('Placeholder');
    expect(progressBar).toHaveStyle({ width: '-5000.00%' });
  });

  it('should handle percentage greater than 1', () => {
    render(<Progress percentage={1.5} />);

    const progressBar = screen.getByText('Placeholder');
    expect(progressBar).toHaveStyle({ width: '150.00%' });
  });

  it('should have proper CSS classes', () => {
    const { container } = render(<Progress percentage={0.5} />);

    expect(container.querySelector('.progress-container')).toBeInTheDocument();
    expect(container.querySelector('.progress-bar')).toBeInTheDocument();
  });

  it('should display placeholder text', () => {
    render(<Progress percentage={0.5} />);

    expect(screen.getByText('Placeholder')).toBeInTheDocument();
  });
});
