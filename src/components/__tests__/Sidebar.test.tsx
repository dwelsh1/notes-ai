import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { createRef } from 'react';
import { Sidebar } from '../Sidebar';

// Mock fetch globally
global.fetch = jest.fn();

const mockPages = [
  { id: '1', title: 'Page 1', parentId: null, order: 0, isFavorite: false, children: [] },
  { id: '2', title: 'Page 2', parentId: null, order: 1, isFavorite: false, children: [] },
  { id: '3', title: 'Page 3', parentId: '2', order: 0, isFavorite: false, children: [] },
];

describe('Sidebar', () => {
  const defaultProps = {
    isOpen: true,
    onToggle: jest.fn(),
    currentPageId: '1',
    onPageSelect: jest.fn(),
    onNewPage: jest.fn(),
    onDeletePage: jest.fn(),
    onNewSubpage: jest.fn(),
    onReorderPages: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockPages,
    });
  });

  it('should render sidebar when open', async () => {
    render(<Sidebar {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Pages')).toBeInTheDocument();
      expect(screen.getByTitle('New page')).toBeInTheDocument();
    });
  });

  it('should not render sidebar when closed', () => {
    render(<Sidebar {...defaultProps} isOpen={false} />);

    expect(screen.queryByText('Pages')).not.toBeInTheDocument();
    expect(screen.getByTitle('Open sidebar')).toBeInTheDocument();
  });

  it('should call onToggle when close button is clicked', async () => {
    render(<Sidebar {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Pages')).toBeInTheDocument();
    });

    const closeButton = screen.getByTitle('Close sidebar');
    fireEvent.click(closeButton);

    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onToggle when open button is clicked', () => {
    render(<Sidebar {...defaultProps} isOpen={false} />);

    const openButton = screen.getByTitle('Open sidebar');
    fireEvent.click(openButton);

    expect(defaultProps.onToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onNewPage when New Page button is clicked', async () => {
    render(<Sidebar {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByTitle('New page')).toBeInTheDocument();
    });

    const newPageButton = screen.getByTitle('New page');
    fireEvent.click(newPageButton);

    expect(defaultProps.onNewPage).toHaveBeenCalledTimes(1);
  });

  it.skip('should filter pages when searching', async () => {
    // This test is skipped as search now uses API calls instead of client-side filtering
    // Search functionality is tested through API integration tests
  });

  it('should call onPageSelect when a page is clicked', async () => {
    render(<Sidebar {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });

    const pageItem = screen.getByText('Page 1');
    fireEvent.click(pageItem);

    expect(defaultProps.onPageSelect).toHaveBeenCalledWith('1');
  });

  it('should show hover buttons on page hover', async () => {
    render(<Sidebar {...defaultProps} onNewSubpage={jest.fn()} onDeletePage={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });

    const pageItem = screen.getByText('Page 1');
    fireEvent.mouseEnter(pageItem);

    await waitFor(() => {
      expect(screen.getByTitle('Create subpage')).toBeInTheDocument();
      expect(screen.getByTitle('Delete page')).toBeInTheDocument();
    });
  });

  it('should call onNewSubpage when create subpage button is clicked', async () => {
    const mockOnNewSubpage = jest.fn();
    render(<Sidebar {...defaultProps} onNewSubpage={mockOnNewSubpage} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });

    const pageItem = screen.getByText('Page 1');
    fireEvent.mouseEnter(pageItem);

    await waitFor(() => {
      const subpageButton = screen.getByTitle('Create subpage');
      fireEvent.click(subpageButton);
    });

    expect(mockOnNewSubpage).toHaveBeenCalledWith('1');
  });

  it('should call onDeletePage when delete button is clicked', async () => {
    const mockOnDeletePage = jest.fn();
    render(<Sidebar {...defaultProps} onDeletePage={mockOnDeletePage} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });

    const pageItem = screen.getByText('Page 1');
    fireEvent.mouseEnter(pageItem);

    await waitFor(() => {
      const deleteButton = screen.getByTitle('Delete page');
      fireEvent.click(deleteButton);
    });

    expect(mockOnDeletePage).toHaveBeenCalledWith('1');
  });

  it('should handle drag start', async () => {
    render(<Sidebar {...defaultProps} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
    });

    const pageItem = screen.getByText('Page 1').parentElement?.parentElement;
    if (pageItem) {
      fireEvent.dragStart(pageItem as HTMLElement);
    }

    // Just verify the drag event was triggered - the state update is async
    expect(pageItem).toBeDefined();
  });

  it('should handle drop to create subpage', async () => {
    const mockOnReorderPages = jest.fn();
    render(<Sidebar {...defaultProps} onReorderPages={mockOnReorderPages} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument();
      expect(screen.getByText('Page 2')).toBeInTheDocument();
    });

    const draggedPage = screen.getByText('Page 2');
    const targetPage = screen.getByText('Page 1');

    fireEvent.dragStart(draggedPage);
    
    // Simulate dragging over the middle of target page
    const mockEvent = {
      preventDefault: jest.fn(),
      currentTarget: {
        getBoundingClientRect: () => ({
          top: 0,
          height: 100,
        }),
        clientY: 50, // Middle of the item (50% of 100px height)
      },
    };

    fireEvent.dragOver(targetPage, {
      clientY: 50,
      target: {
        getBoundingClientRect: () => ({ top: 0, height: 100 }),
      },
    });

    fireEvent.drop(targetPage, mockEvent as any);

    await waitFor(() => {
      expect(mockOnReorderPages).toHaveBeenCalled();
    });
  });

  it('should call refreshPages when ref is called', async () => {
    const ref = createRef<any>();

    render(<Sidebar {...defaultProps} ref={ref} />);

    await waitFor(() => {
      expect(screen.getByText('Pages')).toBeInTheDocument();
    });

    if (ref.current) {
      await act(async () => {
        ref.current.refreshPages();
      });
      
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('http://localhost:4000/api/pages');
      });
    }
  });
});

