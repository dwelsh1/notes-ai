# NotesAI Multi-Page Feature - Dexie.js Plan

## 📋 **Project Overview**

This plan outlines the implementation of a multi-page note-taking system using **Dexie.js** (IndexedDB wrapper) while maintaining the current **Vite + React + TypeScript** architecture. The system will support hierarchical pages, drag-and-drop reordering, favorites, and full-text search.

---

## 🎯 **Core Features**

### **1. Modern Sidebar**

- **Collapsible/Expandable**: Toggle between collapsed and expanded states
- **Resizable**: Drag to adjust width
- **Three Sections**:
  - **Favorites** (top)
  - **Pages** (middle)
  - **Search** (bottom)

### **2. Page Management**

- **Hierarchical Structure**: Parent pages with unlimited subpages
- **Drag & Drop**: Reorder pages, create subpages by dropping
- **Favorites System**: Drag pages to favorites, remove from main list
- **Page Creation**: Add new pages with custom names

### **3. Search Functionality**

- **Full-Text Search**: Search page names and content
- **Real-time Results**: Instant search as you type
- **Highlighted Results**: Show matching text with highlighting

---

## 🛠️ **Technical Architecture**

### **Current Stack (Maintained)**

- **Frontend**: Vite + React 18.2.0 + TypeScript 5.2.2
- **Editor**: BlockNote 0.12.4
- **AI Engine**: WebLLM 0.2.35
- **State Management**: Zustand 4.5.2
- **Styling**: Inline styles (no CSS framework conflicts)

### **New Additions**

- **Database**: Dexie.js 4.0.0+ (IndexedDB wrapper)
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- **Search**: Dexie.js full-text search capabilities
- **Icons**: @tabler/icons-react (already included)

---

## 📊 **Database Schema**

### **Pages Table**

```typescript
interface Page {
  id: string; // UUID
  title: string; // Page title
  content: BlockNoteBlock[]; // BlockNote editor content
  parentId?: string; // Parent page ID (for subpages)
  order: number; // Display order
  isFavorite: boolean; // Is in favorites
  createdAt: Date; // Creation timestamp
  updatedAt: Date; // Last modified timestamp
  tags?: string[]; // Optional tags for categorization
}
```

### **Database Indexes**

- **Primary**: `id`
- **Hierarchy**: `parentId`
- **Ordering**: `order`
- **Favorites**: `isFavorite`
- **Search**: `title`, `content` (full-text)
- **Timestamps**: `createdAt`, `updatedAt`

---

## 🚀 **Implementation Phases**

### **Phase 1: Database Foundation** (Week 1)

**Goal**: Set up Dexie.js database and basic page CRUD operations

#### **Tasks**

1. **Install Dependencies**

   ```bash
   npm install dexie @types/dexie
   ```

2. **Create Database Service**
   - `src/database/index.ts` - Database configuration
   - `src/database/types.ts` - TypeScript interfaces
   - `src/database/migrations.ts` - Schema versioning

3. **Implement Page Operations**
   - Create page
   - Read page
   - Update page
   - Delete page
   - List pages

4. **Unit Tests**
   - Database service tests
   - CRUD operation tests
   - Error handling tests

#### **Deliverables**

- ✅ Working database with page storage
- ✅ Basic page CRUD operations
- ✅ Unit tests (95%+ coverage)
- ✅ TypeScript types

#### **Manual Testing**

- Create, edit, delete pages
- Verify data persistence across browser sessions
- Test error handling

---

### **Phase 2: Sidebar UI Foundation** (Week 2)

**Goal**: Create the collapsible sidebar with basic page listing

#### **Tasks**

1. **Create Sidebar Components**
   - `src/components/Sidebar.tsx` - Main sidebar container
   - `src/components/SidebarToggle.tsx` - Collapse/expand button
   - `src/components/PageList.tsx` - Page listing component

2. **Implement Sidebar State**
   - Add sidebar state to Zustand store
   - Collapsed/expanded state
   - Width management

3. **Basic Page Display**
   - List pages in sidebar
   - Show page hierarchy (indentation)
   - Page selection functionality

4. **Unit Tests**
   - Sidebar component tests
   - State management tests
   - Page listing tests

#### **Deliverables**

- ✅ Collapsible sidebar
- ✅ Page listing with hierarchy
- ✅ Page selection
- ✅ Responsive design

#### **Manual Testing**

- Toggle sidebar collapse/expand
- Select different pages
- Verify responsive behavior
- Test on different screen sizes

---

### **Phase 3: Drag & Drop System** (Week 3)

**Goal**: Implement drag-and-drop for page reordering and hierarchy

#### **Tasks**

1. **Install Drag & Drop Dependencies**

   ```bash
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

2. **Create Drag & Drop Components**
   - `src/components/DragDropProvider.tsx` - DnD context
   - `src/components/DraggablePage.tsx` - Draggable page item
   - `src/components/DropZone.tsx` - Drop target

3. **Implement Drag Logic**
   - Page reordering
   - Subpage creation (drop on parent)
   - Visual feedback during drag

4. **Update Database Operations**
   - Reorder pages
   - Update parent-child relationships
   - Maintain order consistency

5. **Unit Tests**
   - Drag & drop logic tests
   - Database update tests
   - Visual feedback tests

#### **Deliverables**

- ✅ Drag & drop page reordering
- ✅ Subpage creation via drag & drop
- ✅ Visual drag feedback
- ✅ Database consistency

#### **Manual Testing**

- Drag pages to reorder
- Drop pages on other pages to create subpages
- Verify hierarchy updates
- Test edge cases (dropping on self, etc.)

---

### **Phase 4: Favorites System** (Week 4)

**Goal**: Implement favorites section with drag-and-drop functionality

#### **Tasks**

1. **Create Favorites Components**
   - `src/components/FavoritesSection.tsx` - Favorites container
   - `src/components/FavoriteItem.tsx` - Individual favorite item

2. **Implement Favorites Logic**
   - Add/remove from favorites
   - Drag pages to favorites
   - Remove from main list when favorited
   - Maintain subpage relationships

3. **Update Sidebar Layout**
   - Favorites section at top
   - Pages section below
   - Visual separation

4. **Database Updates**
   - Update `isFavorite` field
   - Handle subpage relationships in favorites

5. **Unit Tests**
   - Favorites logic tests
   - Drag & drop to favorites tests
   - Subpage relationship tests

#### **Deliverables**

- ✅ Favorites section in sidebar
- ✅ Drag & drop to favorites
- ✅ Subpage relationship handling
- ✅ Visual favorites indicators

#### **Manual Testing**

- Drag pages to favorites
- Verify subpages move with parent
- Remove from favorites
- Test favorites persistence

---

### **Phase 5: Search Functionality** (Week 5)

**Goal**: Implement full-text search with real-time results

#### **Tasks**

1. **Create Search Components**
   - `src/components/SearchBar.tsx` - Search input
   - `src/components/SearchResults.tsx` - Results display
   - `src/components/SearchHighlight.tsx` - Text highlighting

2. **Implement Search Logic**
   - Full-text search using Dexie.js
   - Real-time search as you type
   - Search both titles and content
   - Highlight matching text

3. **Search Results UI**
   - Show matching pages
   - Highlight search terms
   - Navigate to selected page
   - Clear search functionality

4. **Performance Optimization**
   - Debounced search input
   - Indexed search queries
   - Result caching

5. **Unit Tests**
   - Search functionality tests
   - Performance tests
   - UI interaction tests

#### **Deliverables**

- ✅ Full-text search
- ✅ Real-time results
- ✅ Text highlighting
- ✅ Search navigation

#### **Manual Testing**

- Search page titles
- Search page content
- Verify highlighting
- Test search performance

---

### **Phase 6: Integration & Polish** (Week 6)

**Goal**: Integrate multi-page system with existing AI features and polish

#### **Tasks**

1. **AI Features Integration**
   - Ensure AI features work on all pages
   - Update AI context for current page
   - Maintain AI state per page

2. **Performance Optimization**
   - Lazy load page content
   - Optimize database queries
   - Implement caching strategies

3. **UI/UX Polish**
   - Smooth animations
   - Loading states
   - Error handling
   - Accessibility improvements

4. **Data Migration**
   - Migrate existing single page to new system
   - Preserve existing content
   - Handle edge cases

5. **Comprehensive Testing**
   - Integration tests
   - E2E tests
   - Performance tests
   - Accessibility tests

#### **Deliverables**

- ✅ Fully integrated multi-page system
- ✅ AI features working on all pages
- ✅ Optimized performance
- ✅ Polished UI/UX

#### **Manual Testing**

- Test all AI features on different pages
- Verify performance with many pages
- Test accessibility features
- Complete user workflow testing

---

## 📈 **Additional Features (Future Enhancements)**

### **Phase 7: Advanced Features** (Future)

- **Page Templates**: Pre-defined page layouts
- **Page Tags**: Categorization system
- **Page Export/Import**: Backup and restore
- **Page Sharing**: Export individual pages
- **Page History**: Version control
- **Page Analytics**: Usage statistics
- **Page Collaboration**: Multi-user editing
- **Page Sync**: Cloud synchronization

---

## ✅ **Pros of Dexie.js Approach**

### **Architecture Benefits**

- **Maintains Current Stack**: No major refactoring needed
- **Client-Side Only**: No backend complexity
- **Fast Development**: Leverages existing codebase
- **Simple Deployment**: Static hosting only

### **Technical Benefits**

- **TypeScript Integration**: Full type safety
- **Promise-Based API**: Modern async/await patterns
- **Schema Versioning**: Easy database migrations
- **Full-Text Search**: Built-in search capabilities

### **User Experience**

- **Offline First**: Works without internet
- **Fast Performance**: Local database access
- **Privacy Focused**: Data stays on user's device
- **Cross-Session Persistence**: Data survives browser restarts

### **Development Experience**

- **Familiar Tools**: Same Vite + React setup
- **Easy Testing**: Can mock IndexedDB
- **Debugging**: Browser dev tools integration
- **Maintenance**: Simple, single codebase

---

## ❌ **Cons of Dexie.js Approach**

### **Limitations**

- **Storage Quotas**: Browser limits (usually 50MB-1GB)
- **No Cross-Device Sync**: Data stays on one device
- **Browser Dependency**: Only works in modern browsers
- **No Backup/Restore**: Harder to backup data

### **Search Limitations**

- **Client-Side Only**: Search performance depends on data size
- **Memory Usage**: Large datasets loaded into memory
- **No Advanced Search**: Limited compared to server-side solutions

### **Data Management**

- **No Data Sharing**: Can't easily share pages between users
- **Migration Complexity**: Schema changes can be tricky
- **No Cloud Sync**: No automatic backup to cloud

---

## 🤔 **Clarifying Questions**

### **Data & Storage**

1. **Storage Limits**: Are you comfortable with browser storage quotas (50MB-1GB)?
2. **Data Backup**: Do you need built-in backup/restore functionality?
3. **Cross-Device**: Do you need access to pages on multiple devices?
4. **Data Sharing**: Any plans to share pages between users?

### **User Experience**

1. **Page Limits**: Any maximum number of pages/subpages?
2. **Search Scope**: Should search include page metadata (tags, dates)?
3. **Favorites Limit**: Any limit on number of favorites?
4. **Offline Usage**: Is offline-first approach acceptable?

### **Technical Requirements**

1. **Performance**: What's the expected maximum number of pages?
2. **Search Performance**: Acceptable search delay for large datasets?
3. **Browser Support**: Which browsers need to be supported?
4. **Mobile Support**: Do you need mobile/touch drag & drop?

### **Integration**

1. **AI Features**: Should AI features work on all pages or selected pages?
2. **Page Types**: Will all pages be BlockNote editors or different types?
3. **Existing Content**: What happens to current single page content?
4. **Migration**: Should existing content become the first page?

---

## 📋 **Success Metrics**

### **Technical Metrics**

- **Test Coverage**: 95%+ unit test coverage
- **Performance**: <100ms page load time
- **Search Speed**: <200ms search results
- **Memory Usage**: <50MB for 1000 pages

### **User Experience Metrics**

- **Page Creation**: <2 seconds to create new page
- **Drag & Drop**: Smooth 60fps animations
- **Search**: Real-time results as you type
- **Accessibility**: WCAG 2.1 AA compliance

### **Quality Metrics**

- **Zero Breaking Changes**: Existing functionality preserved
- **Error Rate**: <1% error rate in production
- **User Satisfaction**: Positive feedback on new features
- **Performance**: No regression in existing features

---

This plan provides a comprehensive roadmap for implementing the multi-page feature using Dexie.js while maintaining the current architecture and ensuring high quality through phased development and extensive testing.
