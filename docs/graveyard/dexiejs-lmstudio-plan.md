# NotesAI Multi-Page Feature - 2-Phase Dexie.js Plan with LM Studio

## 📋 **Project Overview**

This plan outlines the implementation of a multi-page note-taking system in **two phases**: Phase 1 implements the core multi-page features using **Dexie.js** while maintaining the current **Vite + React + TypeScript** architecture, and Phase 2 adds **LM Studio integration** for dual AI engine support. This approach allows for incremental development with stable releases at each phase.

---

## 🎯 **Core Features Overview**

### **Phase 1: Multi-Page System**
- **Modern Sidebar**: Collapsible/resizable with hierarchical page listing
- **Page Management**: Create, edit, delete pages with parent/child relationships
- **Drag & Drop**: Reorder pages and create subpages by dragging
- **Favorites**: Drag pages to favorites section
- **Search**: Full-text search in page titles and content
- **WebLLM Only**: Browser-based AI (existing functionality)

### **Phase 2: LM Studio Integration**
- **Dual AI Support**: Toggle between WebLLM and LM Studio
- **Settings Page**: AI engine selection and configuration
- **LM Studio Connection**: Local AI server integration
- **Model Selection**: Choose models within LM Studio
- **Fallback Handling**: Graceful fallback to WebLLM if LM Studio unavailable

---

## 🚀 **PHASE 1: Multi-Page System (6 Weeks)**

### **Week 1: Database Foundation**

#### **Goal**: Set up Dexie.js database and basic page CRUD operations

#### **Tasks**
1. **Install Dependencies**
   ```bash
   npm install dexie @types/dexie @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

2. **Create Database Service**
   - `src/database/index.ts` - Database configuration
   - `src/database/types.ts` - TypeScript interfaces
   - `src/database/migrations.ts` - Schema versioning
   - `src/database/repositories/PageRepository.ts` - Page CRUD operations

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

### **Week 2: Sidebar UI Foundation**

#### **Goal**: Create the collapsible sidebar with basic page listing

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

### **Week 3: Drag & Drop System**

#### **Goal**: Implement drag-and-drop for page reordering and hierarchy

#### **Tasks**
1. **Create Drag & Drop Components**
   - `src/components/DragDropProvider.tsx` - DnD context
   - `src/components/DraggablePage.tsx` - Draggable page item
   - `src/components/DropZone.tsx` - Drop target

2. **Implement Drag Logic**
   - Page reordering
   - Subpage creation (drop on parent)
   - Visual feedback during drag

3. **Update Database Operations**
   - Reorder pages
   - Update parent-child relationships
   - Maintain order consistency

4. **Unit Tests**
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
- Test edge cases

---

### **Week 4: Favorites System**

#### **Goal**: Implement favorites section with drag-and-drop functionality

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

### **Week 5: Search Functionality**

#### **Goal**: Implement full-text search with real-time results

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
- Search page titles and content
- Verify highlighting
- Test search performance

---

### **Week 6: Integration & Polish + PHASE 1 RELEASE**

#### **Goal**: Integrate multi-page system with existing AI features, polish, and release Phase 1

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

6. **Phase 1 Release Preparation**
   - Version bump to v0.2.0
   - Update documentation
   - Create release notes
   - Tag and deploy

#### **Deliverables**
- ✅ Fully integrated multi-page system
- ✅ All AI features working on all pages
- ✅ Optimized performance
- ✅ Polished UI/UX
- ✅ **PHASE 1 RELEASE**

#### **Manual Testing**
- Test all AI features on different pages
- Verify performance with many pages
- Test accessibility features
- Complete user workflow testing
- **User acceptance testing**

---

## 🚀 **PHASE 2: LM Studio Integration (3 Weeks)**

### **Week 7: Database Schema Update + AI Engine Abstraction**

#### **Goal**: Extend database to support settings and create AI engine abstraction layer

#### **Tasks**
1. **Extend Database Schema**
   - Add `Settings` table to Dexie.js
   - Update database migrations
   - Create SettingsRepository

2. **Create AI Engine Abstraction**
   - `src/ai/AIEngine.ts` - Base abstract class
   - `src/ai/WebLLMEngine.ts` - WebLLM implementation
   - `src/ai/LMStudioEngine.ts` - LM Studio implementation (stub)
   - `src/ai/AIEngineFactory.ts` - Factory pattern
   - `src/ai/types.ts` - Common interfaces

3. **Update Existing AI Code**
   - Refactor current AI code to use WebLLMEngine
   - Maintain backward compatibility
   - Ensure all AI features still work

4. **Unit Tests**
   - AI engine abstraction tests
   - Settings database tests
   - Existing AI feature tests (ensure no regression)

#### **Deliverables**
- ✅ Extended database schema
- ✅ AI engine abstraction layer
- ✅ WebLLM engine implementation
- ✅ All existing AI features working
- ✅ Unit tests (95%+ coverage)

#### **Manual Testing**
- Verify all AI features still work
- Test WebLLM engine wrapper
- Test settings persistence
- No regression in functionality

---

### **Week 8: LM Studio Integration + Settings UI**

#### **Goal**: Integrate LM Studio and create settings page for AI engine selection

#### **Tasks**
1. **Install LM Studio Dependencies**
   ```bash
   npm install @lmstudio/sdk
   ```

2. **Implement LM Studio Engine**
   - Complete `LMStudioEngine.ts` implementation
   - Initialize LM Studio SDK
   - Connect to localhost:1234/v1
   - Implement all AI operations
   - Error handling and fallback

3. **Create Settings Components**
   - `src/components/Settings.tsx` - Main settings page
   - `src/components/AIEngineSelector.tsx` - Engine selection dropdown
   - `src/components/LMStudioConnection.tsx` - Connection status indicator
   - `src/components/WebLLMSettings.tsx` - WebLLM configuration
   - `src/components/LMStudioSettings.tsx` - LM Studio configuration

4. **Settings State Management**
   - Add settings to Zustand store
   - Persist settings to database
   - Load settings on app startup
   - Update AI engine based on settings

5. **AI Engine Routing**
   - Route AI requests to selected engine
   - Handle engine switching
   - Maintain conversation context per engine
   - Implement fallback to WebLLM

6. **Unit Tests**
   - LM Studio engine tests
   - Settings component tests
   - Engine routing tests
   - Error handling tests

#### **Deliverables**
- ✅ LM Studio engine fully integrated
- ✅ Settings page with AI engine toggle
- ✅ Engine switching functionality
- ✅ Fallback to WebLLM
- ✅ All tests passing

#### **Manual Testing**
- Toggle AI engines in settings
- Test LM Studio connection
- Verify fallback to WebLLM
- Test all AI features with both engines
- Test settings persistence

---

### **Week 9: Integration, Testing & Release**

#### **Goal**: Final integration, comprehensive testing, and Phase 2 release

#### **Tasks**
1. **AI Features Integration**
   - Ensure all AI features work with both engines
   - Test engine switching per page
   - Verify context handling
   - Error handling improvements

2. **Performance Optimization**
   - Optimize LM Studio connection handling
   - Improve fallback logic
   - Cache LM Studio availability
   - Optimize settings loading

3. **UI/UX Polish**
   - Settings page styling
   - Connection status indicators
   - Loading states
   - Error messages
   - Help tooltips

4. **Comprehensive Testing**
   - Integration tests for both engines
   - E2E tests
   - Performance tests
   - Accessibility tests
   - Error scenario tests

5. **Documentation**
   - Update README with LM Studio setup
   - Create LM Studio setup guide
   - Document new features
   - Create migration guide

6. **Phase 2 Release Preparation**
   - Version bump to v0.3.0
   - Update changelog
   - Create release notes
   - Tag and deploy
   - User testing

#### **Deliverables**
- ✅ Fully functional dual AI engine support
- ✅ All features working with both engines
- ✅ Optimized performance
- ✅ Comprehensive documentation
- ✅ **PHASE 2 RELEASE**

#### **Manual Testing**
- Test all AI features with WebLLM
- Test all AI features with LM Studio
- Test engine switching during workflows
- Test LM Studio unavailable scenarios
- Test with different LM Studio models
- Complete user acceptance testing

---

## 📊 **Database Schema**

### **Pages Table (Phase 1)**
```typescript
interface Page {
  id: string;                    // UUID
  title: string;                 // Page title
  content: BlockNoteBlock[];     // BlockNote editor content
  parentId?: string;             // Parent page ID (for subpages)
  order: number;                 // Display order
  isFavorite: boolean;           // Is in favorites
  createdAt: Date;               // Creation timestamp
  updatedAt: Date;               // Last modified timestamp
  tags?: string[];               // Optional tags for categorization
}
```

### **Settings Table (Phase 2)** ⭐
```typescript
interface Settings {
  id: string;                     // UUID (always "settings")
  aiEngine: 'webllm' | 'lmstudio'; // AI engine selection
  lmStudioUrl: string;           // LM Studio server URL
  lmStudioModel?: string;        // Selected LM Studio model
  preferredModel?: string;       // Preferred WebLLM model
  fallbackEnabled: boolean;      // Fallback to WebLLM if LM Studio fails
}
```

---

## 🛠️ **Technical Architecture**

### **Phase 1 Stack (Maintained)**
- **Frontend**: Vite + React 18.2.0 + TypeScript 5.2.2
- **Editor**: BlockNote 0.12.4
- **AI Engine**: WebLLM 0.2.35 (existing)
- **Database**: Dexie.js 4.0.0+ (IndexedDB)
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **State Management**: Zustand 4.5.2
- **Styling**: Inline styles

### **Phase 2 Additions** ⭐
- **AI Engine (LM Studio)**: @lmstudio/sdk
- **Settings Storage**: Extend Dexie.js for settings
- **AI Abstraction**: Engine factory pattern

---

## ✅ **Pros of 2-Phase Dexie.js + LM Studio Approach**

### **Phase 1 Benefits**
- **Low Risk**: Establishes solid foundation
- **Fast Implementation**: 6 weeks to working multi-page system
- **Incremental Value**: Users get value at each milestone
- **Easy Testing**: Can test Phase 1 independently
- **Rollback Safety**: Can release Phase 1 standalone

### **Phase 2 Benefits**
- **Lower Risk**: Builds on stable foundation
- **Gradual Enhancement**: Adds power without breaking existing functionality
- **User Choice**: Users can adopt LM Studio at their own pace
- **Separate Concerns**: AI engine logic isolated from page management

### **Overall Architecture Benefits**
- **Maintains Current Stack**: No major refactoring
- **Client-Side Storage**: No backend complexity for data
- **Dual AI Support**: Best of both worlds
- **Simple Deployment**: Static hosting
- **Easy Rollback**: Each phase is independently functional

### **Development Benefits**
- **Incremental**: Deliver value quickly
- **Testable**: Each phase fully testable
- **Manageable**: Smaller scope per phase
- **Flexible**: Can delay/adjust Phase 2 based on feedback

### **User Experience**
- **Phase 1 Users**: Get multi-page features immediately
- **Phase 2 Users**: Can upgrade to LM Studio when ready
- **Choice**: Use WebLLM or LM Studio based on needs
- **No Disruption**: Existing functionality preserved

---

## ❌ **Cons of 2-Phase Approach**

### **Implementation Complexity**
- **Two Releases**: Need to coordinate two release cycles
- **Coordination**: Ensure Phase 1 doesn't block Phase 2
- **Dependencies**: Phase 2 depends on Phase 1 structure

### **Timeline**
- **Longer Total Time**: 9 weeks vs 6-7 weeks for single phase
- **Delayed LM Studio**: Users wait longer for dual AI support
- **Two Development Cycles**: Two sets of tests, deployments, docs

### **User Expectations**
- **Phased Rollout**: Users may want everything at once
- **Delayed Features**: Some features come in Phase 2
- **Migration**: Possible data migration between phases

### **Testing Overhead**
- **Two Test Cycles**: Comprehensive testing for each phase
- **Regression Testing**: Ensure Phase 1 still works in Phase 2
- **Integration Testing**: Test both phases together

---

## 🤔 **Clarifying Questions**

### **Phase Planning**
1. **Release Strategy**: Release Phase 1 as v0.2.0 before starting Phase 2?
2. **Timeline**: Is 9-week total timeline acceptable?
3. **Phased Rollout**: Separate user testing for each phase?
4. **Documentation**: Separate docs for Phase 1 and Phase 2 features?

### **Data & Storage**
1. **Storage Limits**: Comfortable with browser quotas (50MB-1GB)?
2. **Data Backup**: Need built-in backup/restore functionality?
3. **Cross-Device**: Need access to pages on multiple devices?
4. **Migration**: Handle data migration from Phase 1 to Phase 2?

### **User Experience**
1. **Page Limits**: Maximum number of pages/subpages?
2. **Search Scope**: Include metadata in search?
3. **Favorites Limit**: Limit on number of favorites?
4. **Offline Usage**: Offline-first approach acceptable?

### **LM Studio Specific (Phase 2)**
1. **Installation**: Expect users to have LM Studio installed?
2. **Auto-Detection**: Auto-detect LM Studio or manual URL entry?
3. **Model Selection**: Show available models in LM Studio?
4. **Fallback**: Auto-fallback to WebLLM if LM Studio unavailable?
5. **Error Handling**: How to handle connection failures?
6. **System Requirements**: Minimum specs for LM Studio models?

### **AI Features**
1. **Default Engine**: Which should be default (WebLLM or LM Studio)?
2. **Context Per Page**: Each page has its own AI context/conversation?
3. **AI Features**: All features work with both engines?
4. **Model Selection**: Select specific models within each engine?

### **Technical Requirements**
1. **Performance**: Expected maximum number of pages?
2. **Search Performance**: Acceptable search delay for large datasets?
3. **Browser Support**: Which browsers need to be supported?
4. **Mobile Support**: Need mobile/touch drag & drop?

---

## 📋 **Success Metrics**

### **Phase 1 Metrics**
- **Test Coverage**: 95%+ unit test coverage
- **Performance**: <100ms page load time
- **Search Speed**: <200ms search results
- **Memory Usage**: <50MB for 1000 pages
- **Zero Breaking Changes**: All existing features work

### **Phase 2 Metrics**
- **AI Response Time**: <2s for LM Studio, <5s for WebLLM
- **Engine Switching**: <1 second to switch engines
- **Fallback Success**: 100% fallback to WebLLM if LM Studio unavailable
- **No Regression**: All Phase 1 features still work

### **Overall Quality Metrics**
- **Error Rate**: <1% in production
- **User Satisfaction**: Positive feedback
- **Performance**: No regression in existing features
- **Accessibility**: WCAG 2.1 AA compliance

---

## 📅 **Timeline Summary**

### **Phase 1 (6 Weeks)**
- Week 1: Database foundation
- Week 2: Sidebar UI
- Week 3: Drag & drop
- Week 4: Favorites
- Week 5: Search
- Week 6: Integration, polish, and **Phase 1 Release**

### **Phase 2 (3 Weeks)**
- Week 7: AI engine abstraction
- Week 8: LM Studio integration
- Week 9: Testing, polish, and **Phase 2 Release**

### **Total: 9 Weeks** for complete implementation

---

This plan provides a comprehensive roadmap for implementing the multi-page feature in two phases, allowing for stable releases and incremental value delivery while minimizing risk and maintaining development momentum.
