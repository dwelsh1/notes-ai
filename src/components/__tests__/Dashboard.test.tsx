import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { Dashboard } from '../Dashboard';

// Mock fetch globally
global.fetch = jest.fn();

const mockDashboardData = {
  pages: [
    { id: '2', title: 'Recent Page 2', updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
    { id: '1', title: 'Recent Page 1', updatedAt: new Date().toISOString(), createdAt: new Date().toISOString() },
  ],
};

describe('Dashboard', () => {
  const defaultProps = {
    onNewPage: jest.fn(),
    onSelectPage: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockDashboardData.pages,
    });
  });

  it('should render loading state initially', () => {
    render(<Dashboard {...defaultProps} />);
    expect(screen.getByText('Loading dashboard...')).toBeInTheDocument();
  });

  it('should render the dashboard after data fetching', async () => {
    render(<Dashboard {...defaultProps} />);

    await screen.findByText('Welcome to NotesAI');
    expect(screen.getByText('Total Pages')).toBeInTheDocument();
    expect(screen.getByText('Recent Pages')).toBeInTheDocument();
  });

  it('should display correct stats', async () => {
    render(<Dashboard {...defaultProps} />);

    await screen.findByText('Welcome to NotesAI');
    // Total Pages should be 2 based on mock data
    const totalPagesStat = screen.getByText('Total Pages').nextElementSibling;
    expect(totalPagesStat?.textContent).toBe('2');
  });

  it('should display recent pages', async () => {
    render(<Dashboard {...defaultProps} />);

    await screen.findByText('Recent Page 1');
    expect(screen.getByText('Recent Page 2')).toBeInTheDocument();
  });

  it('should call onNewPage when "New Page" button is clicked', async () => {
    render(<Dashboard {...defaultProps} />);

    const newPageButton = await screen.findByText('New Page');
    fireEvent.click(newPageButton);
    expect(defaultProps.onNewPage).toHaveBeenCalledTimes(1);
  });

  it('should call onSelectPage when an "Open" button is clicked', async () => {
    render(<Dashboard {...defaultProps} />);

    // Find the title node for 'Recent Page 2' and then its closest container's Open button
    const titleNode = await screen.findByText('Recent Page 2');
    const container = titleNode.closest('div');
    const row = container?.parentElement; // title is inside a child div within the row
    const openButton = row?.querySelector('button');
    if (openButton) {
      fireEvent.click(openButton);
    }
    expect(defaultProps.onSelectPage).toHaveBeenCalledWith('2');
  });

  it('should handle fetch error gracefully', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API error'));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    render(<Dashboard {...defaultProps} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
      expect(consoleSpy).toHaveBeenCalledWith('Error fetching dashboard data:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
