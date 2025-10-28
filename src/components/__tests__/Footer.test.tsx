import React from 'react';
import { render, screen } from '@testing-library/react';
import { Footer } from '../Footer';

describe('Footer', () => {
  const defaultProps = {
    progress: '',
    progressPercentage: 0,
    output: '',
    error: '',
    errorBrowserMessage: '',
    runtimeStats: '',
    isFetching: false,
  };

  it('should render footer with no content by default', () => {
    render(<Footer {...defaultProps} />);

    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should display progress message when provided', () => {
    render(<Footer {...defaultProps} progress="Loading model..." />);

    expect(screen.getByText('Loading model...')).toBeInTheDocument();
  });

  it('should display output message when provided', () => {
    render(<Footer {...defaultProps} output="Translation complete" />);

    expect(screen.getByText('Translation complete')).toBeInTheDocument();
  });

  it('should display error message when provided', () => {
    render(<Footer {...defaultProps} error="Something went wrong" />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('should display browser error message when provided', () => {
    render(
      <Footer {...defaultProps} errorBrowserMessage="WebGPU not supported" />
    );

    expect(screen.getByText(/WebGPU not supported/)).toBeInTheDocument();
    expect(screen.getByText('this page')).toBeInTheDocument();
  });

  it('should display runtime stats when provided', () => {
    render(<Footer {...defaultProps} runtimeStats="2.5s" />);

    expect(screen.getByText('Performance: 2.5s')).toBeInTheDocument();
  });

  it('should show progress bar when isFetching is true and progressPercentage > 0', () => {
    render(
      <Footer {...defaultProps} isFetching={true} progressPercentage={0.5} />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
  });

  it('should not show progress bar when isFetching is false', () => {
    render(
      <Footer {...defaultProps} isFetching={false} progressPercentage={0.5} />
    );

    const progressBar = screen.queryByRole('progressbar');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('should not show progress bar when progressPercentage is 0', () => {
    render(
      <Footer {...defaultProps} isFetching={true} progressPercentage={0} />
    );

    const progressBar = screen.queryByRole('progressbar');
    expect(progressBar).not.toBeInTheDocument();
  });

  it('should display multiple messages simultaneously', () => {
    render(
      <Footer
        {...defaultProps}
        progress="Loading..."
        output="Processing..."
        error="Error occurred"
        runtimeStats="1.2s"
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.getByText('Processing...')).toBeInTheDocument();
    expect(screen.getByText('Error occurred')).toBeInTheDocument();
    expect(screen.getByText('Performance: 1.2s')).toBeInTheDocument();
  });

  it('should have proper styling for footer', () => {
    const { container } = render(<Footer {...defaultProps} />);

    const footer = container.querySelector('footer');
    expect(footer).toHaveStyle({
      backgroundColor: '#f9fafb',
      borderTop: '1px solid #e5e7eb',
      padding: '4px 16px',
    });
  });

  it('should have proper styling for progress bar', () => {
    render(
      <Footer {...defaultProps} isFetching={true} progressPercentage={0.3} />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveStyle({
      width: '30%',
      backgroundColor: '#2563eb',
    });
  });

  it('should have proper styling for different message types', () => {
    render(
      <Footer
        {...defaultProps}
        progress="Progress message"
        output="Output message"
        error="Error message"
      />
    );

    const progressMessage = screen.getByText('Progress message');
    const outputMessage = screen.getByText('Output message');
    const errorMessage = screen.getByText('Error message');

    expect(progressMessage).toHaveStyle({ color: '#4b5563' });
    expect(outputMessage).toHaveStyle({ color: '#2563eb' });
    expect(errorMessage).toHaveStyle({ color: '#dc2626' });
  });

  it('should have proper link styling in browser error message', () => {
    render(<Footer {...defaultProps} errorBrowserMessage="WebGPU error" />);

    const link = screen.getByText('this page');
    expect(link).toHaveStyle({ textDecoration: 'underline' });
    expect(link).toHaveAttribute(
      'href',
      'https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API#browser_compatibility'
    );
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });
});
