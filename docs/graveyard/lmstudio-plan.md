# NotesAI Multi-Page Feature with LM Studio Support - Dexie.js Plan

## 📋 **Project Overview**

This plan outlines the implementation of a multi-page note-taking system using **Dexie.js** (IndexedDB wrapper) while maintaining the current **Vite + React + TypeScript** architecture. The system will support hierarchical pages, drag-and-drop reordering, favorites, full-text search, and **dual AI engine support** with toggling between WebLLM (browser-based) and LM Studio (local server).

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

- **Full-Text Search**: Search page names and content using Dexie.js full-text search
- **Real-time Results**: Instant search as you type
- **Highlighted Results**: Show matching text with highlighting

### **4. Dual AI Engine Support** ⭐ **NEW**

- **WebLLM Mode**: Browser-based AI\*\* (default)
  - Runs entirely in browser using WebGPU
  - No server required
  - Fully private and secure
- **LM Studio Mode**: Local AI server\*\* (new option)
  - Connect to local LM Studio server running on localhost
  - OpenAI-compatible API at `http://localhost:1234/v1`
  - Use OpenAI-compatible SDK (`@lmstudio/sdk`)
  - Support for larger models with better performance
  - More powerful models available

- **Toggle in Settings**:
  - AI engine selection dropdown
  - LM Studio connection status indicator
  - Local server URL configuration
  - Model selection when using LM Studio
  - Fallback to WebLLM if LM Studio unavailable

---

## 🛠️ **Technical Architecture**

### **Current Stack (Maintained)**

- **Frontend**: Vite + React 18.2.0 + TypeScript 5.2.2
- **Editor**: BlockNote 0.12.4
- **AI Engine (WebLLM)**: WebLLM 0.2.35 (existing)
- **AI Engine (LM Studio)**: @lmstudio/sdk (new)
- **State Management**: Zustand 4.5.2
- **Styling**: Inline styles (no CSS framework conflicts)

### **New Additions**

- **Database**: Dexie.js 4.0.0+ (IndexedDB wrapper)
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- **Search**: Dexie.js full-text search capabilities
- **AI Toggle**: Settings page with engine selection
- **Settings Storage**: Dexie.js for storing AI preferences

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

### **Settings Table** ⭐ **NEW**

```typescript
interface Settings {
  id: string; // UUID (always "settings")
  aiEngine: 'webllm' | 'lmstudio'; // AI engine selection
  lmStudioUrl: string; // LM Studio server URL
  lmStudioModel?: string; // Selected LM Studio model
  preferredModel?: string; // Preferred WebLLM model
  fallbackEnabled: boolean; // Fallback to WebLLM if LM Studio fails
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

### **Phase 1: Database Foundation + AI Engine Abstraction** (Week 1)

**Goal**: Set up Dexie.js database, AI engine abstraction layer, and basic page CRUD operations

#### **Tasks**

1. **Install Dependencies**

   ```bash
   npm install dexie @types/dexie @lmstudio/sdk
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

2. **Create Database Service**
   - `src/database/index.ts` - Database configuration
   - `src/database/types.ts` - TypeScript interfaces
   - `src/database/migrations.ts` - Schema versioning
   - `src/database/repositories/PageRepository.ts` - Page CRUD operations
   - `src/database/repositories/SettingsRepository.ts` - Settings operations

3. **AI Engine Abstraction Layer** ⭐ **NEW**
   - `src/ai/AIEngine.ts` - Base abstract class for AI engines
   - `src/ai/WebLLMEngine.ts` - WebLLM implementation
   - `src/ai/LMStudioEngine.ts` - LM Studio implementation
   - `src/ai/AIEngineFactory.ts` - Factory pattern for engine selection
   - `src/ai/types.ts` - Common AI interfaces

4. **Implement Page Operations**
   - Create page
   - Read page
   - Update page
   - Delete page
   - List pages

5. **Unit Tests**
   - Database service tests
   - Page repository tests
   - Settings tests
   - AI engine abstraction tests

#### **Deliverables**

- ✅ Working database with page storage
- ✅ AI engine abstraction layer
- ✅ Settings storage
- ✅ Basic page CRUD operations
- ✅ Unit tests (95%+ coverage)

#### **Manual Testing**

- Create, edit, delete pages
- Test AI engine switching
- Verify settings persistence
- Test data persistence across browser sessions

---

### **Phase 2: Settings UI + LM Studio Integration** (Week 2)

**Goal**: Create settings page with AI engine toggle and integrate LM Studio

#### **Tasks**

1. **Create Settings Components**
   - `src/components/Settings.tsx` - Main settings page
   - `src/components/AIEngineSelector.tsx` - Engine selection dropdown
   - `src/components/LMStudioConnection.tsx` - LM Studio connection status
   - `src/components/WebLLMSettings.tsx` - WebLLM configuration
   - `src/components/LMStudioSettings.tsx` - LM Studio configuration

2. **Implement LM Studio Integration** ⭐ **NEW**
   - Initialize LM Studio SDK
   - Connect to local server at `http://localhost:1234/v1`
   - Test connection and availability
   - Handle connection errors gracefully
   - Implement fallback to WebLLM

3. **Settings State Management**
   - Add settings to Zustand store
   - Persist settings to database
   - Load settings on app startup
   - Update AI engine based on settings

4. **AI Engine Routing**
   - Route AI requests to selected engine
   - Handle engine switching
   - Maintain conversation context per engine
   - Error handling and fallback

5. **Unit Tests**
   - Settings component tests
   - LM Studio integration tests
   - Engine routing tests
   - Error handling tests

#### **Deliverables**

- ✅ Settings page with AI toggle
- ✅ LM Studio connection functionality
- ✅ AI engine switching
- ✅ Settings persistence
- ✅ Fallback handling

#### **Manual Testing**

- Toggle AI engines in settings
- Test LM Studio connection
- Verify fallback to WebLLM
- Test settings persistence

---

### **Phase 3: Sidebar UI Foundation** (Week 3)

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

### **Phase 4: Drag & Drop System** (Week 4)

**Goal**: Implement drag-and-drop for page reordering and hierarchy

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

### **Phase 5: Favorites System** (Week 5)

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

### **Phase 6: Search Functionality + AI Integration** (Week 6)

**Goal**: Implement full-text search and ensure AI features work on all pages

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

3. **AI Features per Page** ⭐ **NEW**
   - Ensure AI features work on all pages
   - Update AI context for current page
   - Maintain AI state per page
   - Support both WebLLM and LM Studio modes

4. **Performance Optimization**
   - Debounced search input
   - Indexed search queries
   - Result caching

5. **Unit Tests**
   - Search functionality tests
   - AI integration tests
   - Performance tests

#### **Deliverables**

- ✅ Full-text search
- ✅ AI features on all pages
- ✅ Real-time results
- ✅ Text highlighting

#### **Manual Testing**

- Search page titles and content
- Test AI features on different pages
- Verify search performance
- Test AI engine switching per page

---

### **Phase 7: Integration & Polish** (Week 7)

**Goal**: Final integration, polish, and comprehensive testing

#### **Tasks**

1. **AI Feature Refinement** ⭐ **NEW**
   - Ensure all AI features work with both engines
   - Optimize AI context for current page
   - Improve error handling
   - Add AI status indicators

2. **Performance Optimization**
   - Lazy load page content
   - Optimize database queries
   - Implement caching strategies
   - Optimize AI response handling

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
- ✅ All AI features working on all pages
- ✅ Optimized performance
- ✅ Polished UI/UX

#### **Manual Testing**

- Test all AI features on different pages
- Verify performance with many pages
- Test AI engine switching
- Complete user workflow testing

---

## 📈 **Additional Features (Future Enhancements)**

### **Phase 8: Advanced Features** (Future)

- **Page Templates**: Pre-defined page layouts
- **Page Tags**: Categorization system
- **Page Export/Import**: Backup and restore
- **Page Sharing**: Export individual pages
- **Page History**: Version control
- **Page Analytics**: Usage statistics
- **Page Collaboration**: Multi-user editing
- **LM Studio Model Management**: Download and manage LM Studio models
- **AI Model Switching**: Switch models within same engine
- **AI Response Comparison**: Compare WebLLM vs LM Studio responses

---

## ✅ **Pros of Dexie.js + LM Studio Approach**

### **Architecture Benefits**

- **Maintains Current Stack**: No major refactoring needed
- **Dual AI Support**: WebLLM (browser) + LM Studio (local server)
- **Client-Side Storage**: No backend complexity for data storage
- **Flexible AI**: Choose between browser AI or local server AI
- **Fast Development**: Leverages existing codebase

### **Technical Benefits**

- **TypeScript Integration**: Full type safety across all components
- **Promise-Based API**: Modern async/await patterns
- **Schema Versioning**: Easy database migrations
- **Full-Text Search**: Built-in search capabilities
- **AI Abstraction**: Clean separation between AI engines

### **User Experience**

- **Offline First**: Works without internet (WebLLM)
- **Local AI Option**: Use powerful local models via LM Studio
- **Fast Performance**: Local database access
- **Privacy Focused**: Both options keep data local
- **Flexible**: User chooses AI engine based on needs

### **Development Experience**

- **Familiar Tools**: Same Vite + React setup
- **Easy Testing**: Can mock IndexedDB and AI engines
- **Debugging**: Browser dev tools integration
- **Maintenance**: Simple, single codebase

### **AI Engine Advantages** ⭐ **NEW**

- **WebLLM Benefits**:
  - Browser-based, no external dependencies
  - Works offline
  - Fully private (no data leaves device)
  - Fast for smaller models
- **LM Studio Benefits**:
  - Access to larger, more powerful models
  - Better performance with GPU acceleration
  - More context window for longer conversations
  - Latest models support
  - Flexible model switching

---

## ❌ **Cons of Dexie.js + LM Studio Approach**

### **Limitations**

- **Storage Quotas**: Browser limits (usually 50MB-1GB)
- **LM Studio Dependency**: Requires LM Studio server running
- **No Cross-Device Sync**: Data stays on one device
- **No Backup/Restore**: Harder to backup data
- **Browser Dependency**: Only works in modern browsers

### **AI-Specific Limitations**

- **LM Studio Setup**: Requires users to install and run LM Studio
- **Server Management**: Users must manage local server
- **Model Download**: Users must download models separately
- **Resource Usage**: LM Studio requires more RAM/GPU resources

### **Search Limitations**

- **Client-Side Only**: Search performance depends on data size
- **Memory Usage**: Large datasets loaded into memory
- **No Advanced Search**: Limited compared to server-side solutions

### **Complexity**

- **AI Engine Switching**: More complex logic to handle two engines
- **Error Handling**: More scenarios to handle
- **Testing**: More test cases with dual AI support
- **User Education**: Users need to understand both AI options

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

### **LM Studio Specific** ⭐ **NEW**

1. **LM Studio Installation**: Will users be expected to have LM Studio installed?
2. **Server Configuration**: Should we detect LM Studio automatically or require manual URL entry?
3. **Model Selection**: Should we show available models in LM Studio?
4. **Fallback Strategy**: Should we auto-fallback to WebLLM if LM Studio unavailable?
5. **Error Handling**: How should we handle LM Studio connection failures?
6. **Performance**: What minimum system requirements for LM Studio models?

### **AI Features**

1. **AI Engine Default**: Which should be default (WebLLM or LM Studio)?
2. **Context Per Page**: Should each page have its own AI context/conversation?
3. **AI Features**: Should all AI features (translate, correct, etc.) work with both engines?
4. **Model Selection**: Should users be able to select specific models within each engine?

### **Technical Requirements**

1. **Performance**: What's the expected maximum number of pages?
2. **Search Performance**: Acceptable search delay for large datasets?
3. **Browser Support**: Which browsers need to be supported?
4. **Mobile Support**: Do you need mobile/touch drag & drop?

### **Integration**

1. **Existing Content**: What happens to current single page content?
2. **Migration**: Should existing content become the first page?
3. **Settings Migration**: How should we handle existing AI settings?
4. **Backward Compatibility**: Need to support older data formats?

---

## 📋 **Success Metrics**

### **Technical Metrics**

- **Test Coverage**: 95%+ unit test coverage
- **Performance**: <100ms page load time
- **Search Speed**: <200ms search results
- **Memory Usage**: <50MB for 1000 pages
- **AI Response**: <2s for LM Studio, <5s for WebLLM

### **User Experience Metrics**

- **Page Creation**: <2 seconds to create new page
- **Drag & Drop**: Smooth 60fps animations
- **Search**: Real-time results as you type
- **AI Switching**: <1 second to switch engines
- **Accessibility**: WCAG 2.1 AA compliance

### **Quality Metrics**

- **Zero Breaking Changes**: Existing functionality preserved
- **Error Rate**: <1% error rate in production
- **AI Availability**: 99%+ uptime for WebLLM, graceful LM Studio fallback
- **User Satisfaction**: Positive feedback on new features
- **Performance**: No regression in existing features

---

## 🎯 **LM Studio Integration Details**

### **LM Studio Setup Requirements**

- **User Prerequisites**:
  - Install LM Studio from https://lmstudio.ai/
  - Download desired AI models
  - Start local inference server
- **Application Requirements**:
  - Detect LM Studio server at `http://localhost:1234/v1`
  - Test connection on settings page load
  - Handle server unavailable gracefully
  - Fallback to WebLLM if connection fails

### **LM Studio API Integration**

```typescript
// Using @lmstudio/sdk
import LMStudio from '@lmstudio/sdk';

const client = new LMStudio({
  baseURL: 'http://localhost:1234/v1'
});

// Chat completion example
const response = await client.chat.completions.create({
  model: 'selected-model',
  messages: [...],
  temperature: 0.7
});
```

### **LM Studio Settings Page**

- **Connection Status**: Green/red indicator
- **Server URL**: Editable (default: localhost:1234)
- **Model Selection**: Dropdown of available models
- **Test Connection**: Button to test connection
- **Auto-Detect**: Checkbox to auto-detect server
- **Fallback**: Toggle to auto-fallback to WebLLM

This plan provides a comprehensive roadmap for implementing the multi-page feature with dual AI engine support using Dexie.js and LM Studio integration while maintaining the current architecture.
