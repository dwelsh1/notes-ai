import { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Trash2, Plus, X, ChevronRight, ChevronDown, ChevronLeft } from 'lucide-react';
import { highlightSearchTerm } from '../utils/searchHighlight';

interface Page {
  id: string;
  title: string;
  parentId: string | null;
  order: number;
  isFavorite: boolean;
  children?: Page[];
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  currentPageId?: string;
  onPageSelect: (pageId: string) => void;
  onNewPage: () => void;
  onDeletePage?: (pageId: string) => void;
  onNewSubpage?: (parentId: string) => void;
  onReorderPages?: (pageId: string, newOrder: number, newParentId: string | null) => void;
}

export interface SidebarRef {
  refreshPages: () => void;
}

export const Sidebar = forwardRef<SidebarRef, SidebarProps>(({
  isOpen,
  onToggle,
  currentPageId,
  onPageSelect,
  onNewPage,
  onDeletePage,
  onNewSubpage,
  onReorderPages,
}, ref) => {
  const [pages, setPages] = useState<Page[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredPageId, setHoveredPageId] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);
  const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<Page[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [collapsedPages, setCollapsedPages] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchPages();
  }, []);

  // Search effect
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await fetch(
          `http://localhost:4000/api/search?q=${encodeURIComponent(searchQuery)}`
        );
        if (response.ok) {
          const data = await response.json();
          setSearchResults(organizeHierarchy(data));
        }
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(performSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchPages = async () => {
    try {
      const response = await fetch('http://localhost:4000/api/pages');
      if (response.ok) {
        const data = await response.json();
        setPages(organizeHierarchy(data));
      }
    } catch (error) {
      console.error('Failed to fetch pages:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refreshPages: fetchPages,
  }));

  const organizeHierarchy = (flatPages: Page[]): Page[] => {
    const pageMap = new Map<string, Page>();
    const rootPages: Page[] = [];

    // First pass: create map of all pages
    flatPages.forEach((page) => {
      pageMap.set(page.id, { ...page, children: [] });
    });

    // Second pass: organize hierarchy
    flatPages.forEach((page) => {
      const pageWithChildren = pageMap.get(page.id)!;
      if (page.parentId && pageMap.has(page.parentId)) {
        pageMap.get(page.parentId)!.children?.push(pageWithChildren);
      } else {
        rootPages.push(pageWithChildren);
      }
    });

    return rootPages;
  };

  const [dropPosition, setDropPosition] = useState<'top' | 'middle' | 'bottom' | null>(null);

  const handleDragStart = (pageId: string) => {
    setDraggedPageId(pageId);
    setDropPosition(null);
  };

  const handleDragOver = (e: React.DragEvent, pageId: string, pageIndex: number) => {
    e.preventDefault();
    
    // Calculate drop position based on cursor Y position relative to the page item
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const itemHeight = rect.height;
    
    if (relativeY < itemHeight * 0.3) {
      setDropPosition('top');
    } else if (relativeY > itemHeight * 0.7) {
      setDropPosition('bottom');
    } else {
      setDropPosition('middle');
    }
    
    setDragOverId(pageId);
  };

  const handleDrop = async (e: React.DragEvent, targetPage: Page) => {
    e.preventDefault();
    if (!draggedPageId || !onReorderPages) {
      setDraggedPageId(null);
      setDragOverId(null);
      setDropPosition(null);
      return;
    }

    // Prevent dropping on itself or its own children
    if (draggedPageId === targetPage.id) {
      setDraggedPageId(null);
      setDragOverId(null);
      setDropPosition(null);
      return;
    }

    let newParentId = targetPage.parentId;
    let newOrder = targetPage.order;

    // If dropping in the middle of a page item, make it a subpage
    if (dropPosition === 'middle') {
      newParentId = targetPage.id;
      newOrder = 0; // Put it at the start of children
    } else if (dropPosition === 'top') {
      // Drop above the target page - use target's order
      newOrder = targetPage.order;
    } else if (dropPosition === 'bottom') {
      // Drop below the target page - use target's order + 1
      newOrder = targetPage.order + 1;
    }

    // Update the dragged page
    await onReorderPages(draggedPageId, newOrder, newParentId);
    
    // Refresh the pages
    await fetchPages();
    
    setDraggedPageId(null);
    setDragOverId(null);
    setDropPosition(null);
  };

  const handleDragEnd = () => {
    setDraggedPageId(null);
    setDragOverId(null);
    setDropPosition(null);
  };

  const toggleCollapse = (pageId: string) => {
    setCollapsedPages((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(pageId)) {
        newSet.delete(pageId);
      } else {
        newSet.add(pageId);
      }
      return newSet;
    });
  };

  const isCollapsed = (pageId: string) => collapsedPages.has(pageId);

  const renderPageItem = (page: Page, depth: number = 0, index: number = 0) => {
    const isActive = page.id === currentPageId;
    const hasChildren = page.children && page.children.length > 0;
    const isDragging = draggedPageId === page.id;
    const isDragOver = dragOverId === page.id;
    const showTopLine = dropPosition === 'top' && isDragOver;
    const showBottomLine = dropPosition === 'bottom' && isDragOver;
    const showMiddle = dropPosition === 'middle' && isDragOver;
    const collapsed = isCollapsed(page.id);

    return (
      <div key={page.id}>
        {/* Drop indicator line for "top" position */}
        {showTopLine && (
          <div
            style={{
              height: '2px',
              backgroundColor: '#2563eb',
              marginLeft: `${16 + depth * 16}px`,
              marginRight: '16px',
            }}
          />
        )}
        
        <div
          draggable
          onDragStart={() => handleDragStart(page.id)}
          onDragOver={(e) => handleDragOver(e, page.id, index)}
          onDrop={(e) => handleDrop(e, page)}
          onDragEnd={handleDragEnd}
          style={{
            padding: '4px 16px',
            paddingLeft: `${16 + depth * 16}px`,
            cursor: 'grab',
            backgroundColor: isActive ? '#e0e7ff' : 'transparent',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            borderRadius: '4px',
            fontSize: '14px',
            opacity: isDragging ? 0.5 : 1,
            border: showMiddle ? '2px solid #2563eb' : 'none',
            outline: isDragOver && dropPosition !== 'middle' ? '1px solid #dbeafe' : 'none',
          }}
          onClick={() => onPageSelect(page.id)}
          onMouseEnter={() => {
            setHoveredPageId(page.id);
          }}
          onMouseLeave={() => {
            setHoveredPageId(null);
          }}
        >
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleCollapse(page.id);
              }}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {collapsed ? (
                <ChevronRight style={{ width: '16px', height: '16px', color: '#6b7280' }} />
              ) : (
                <ChevronDown style={{ width: '16px', height: '16px', color: '#6b7280' }} />
              )}
            </button>
          ) : (
            <div style={{ width: '16px' }} />
          )}
          {hasChildren ? '📁' : '📄'}
          <span
            style={{
              flex: 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            dangerouslySetInnerHTML={{
              __html: highlightSearchTerm(page.title || 'Untitled', searchQuery)
            }}
          />
          {hoveredPageId === page.id && onNewSubpage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onNewSubpage(page.id);
              }}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '4px',
              }}
              title="Create subpage"
            >
              <Plus style={{ width: '18px', height: '18px', color: '#6b7280' }} />
            </button>
          )}
          {hoveredPageId === page.id && onDeletePage && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeletePage(page.id);
              }}
              style={{
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title="Delete page"
            >
              <Trash2 style={{ width: '18px', height: '18px', color: '#6b7280' }} />
            </button>
          )}
        </div>
        {/* Drop indicator line for "bottom" position */}
        {showBottomLine && (
          <div
            style={{
              height: '2px',
              backgroundColor: '#2563eb',
              marginLeft: `${16 + depth * 16}px`,
              marginRight: '16px',
            }}
          />
        )}
        {hasChildren && !collapsed && page.children?.map((child, childIndex) => renderPageItem(child, depth + 1, childIndex))}
      </div>
    );
  };

  // Use search results if searching, otherwise use all pages
  const displayPages = searchQuery.trim() !== '' ? searchResults : pages;

  // Resize handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      const newWidth = e.clientX;
      if (newWidth >= 200 && newWidth <= 600) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing]);

  if (!isOpen) {
    return (
      <button
        style={{
          position: 'fixed',
          left: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '32px',
          height: '60px',
          backgroundColor: 'white',
          color: '#6b7280',
          border: '1px solid #e5e7eb',
          borderLeft: 'none',
          borderRadius: '0 8px 8px 0',
          cursor: 'pointer',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }}
        onClick={onToggle}
        title="Open sidebar"
      >
        <span style={{ fontSize: '20px', color: '#6b7280', fontWeight: 'bold' }}>→</span>
      </button>
    );
  }

  return (
    <div
      style={{
        width: `${sidebarWidth}px`,
        height: '100vh',
        backgroundColor: '#ffffff',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}
    >
      {/* Header */}
      <div
        style={{
          backgroundColor: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '8px 16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 600, color: '#111827', lineHeight: '1', padding: 0 }}>
          Pages
        </h2>
        <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
          <button
            onClick={onNewPage}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: 0,
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="New page"
          >
            <Plus style={{ width: '20px', height: '20px' }} />
          </button>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#6b7280',
              padding: 0,
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={onToggle}
            title="Close sidebar"
          >
            <ChevronLeft style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '12px 16px', borderBottom: '1px solid #e5e7eb', position: 'relative' }}>
        <input
          ref={(input) => {
            // Store reference for focus
            if (input) window.searchInputRef = input;
          }}
          type="text"
          placeholder="Search pages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setSearchQuery('');
              e.currentTarget.focus();
            }
          }}
          style={{
            width: '100%',
            maxWidth: '100%',
            padding: '8px 12px',
            paddingRight: searchQuery ? '32px' : '12px',
            border: '1px solid #d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
        {searchQuery && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setSearchQuery('');
              // Re-focus the input after clearing
              setTimeout(() => {
                if (window.searchInputRef) {
                  window.searchInputRef.focus();
                }
              }, 0);
            }}
            style={{
              position: 'absolute',
              right: '28px',
              top: '20px',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            title="Clear search"
          >
            <X style={{ width: '16px', height: '16px', color: '#ef4444' }} />
          </button>
        )}
      </div>

      {/* Page List */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
            Loading...
          </div>
        ) : displayPages.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: '#6b7280' }}>
            {searchQuery ? (isSearching ? 'Searching...' : 'No pages found') : 'No pages yet'}
          </div>
        ) : (
          displayPages.map((page, index) => renderPageItem(page, 0, index))
        )}
      </div>

      {/* Resize Handle */}
      <div
        onMouseDown={() => setIsResizing(true)}
        onMouseEnter={(e) => {
          if (!isResizing) {
            e.currentTarget.style.backgroundColor = '#2563eb';
          }
        }}
        onMouseLeave={(e) => {
          if (!isResizing) {
            e.currentTarget.style.backgroundColor = 'transparent';
          }
        }}
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '4px',
          height: '100%',
          cursor: 'col-resize',
          backgroundColor: isResizing ? '#2563eb' : 'transparent',
          zIndex: 10,
          transition: isResizing ? 'none' : 'background-color 0.15s ease',
        }}
      />
    </div>
  );
});

export default Sidebar;

