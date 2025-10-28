# NotesAI Multi-Page Feature - 2-Phase Next.js + LM Studio Plan

## 📋 **Project Overview**

This plan outlines the implementation of a multi-page note-taking system in **two phases** using **Next.js 15** with **Prisma ORM** and **SQLite** database for server-side storage. Phase 1 implements the core multi-page features with export/backup capabilities, and Phase 2 adds **LM Studio integration** for dual AI engine support. This architecture addresses image storage, large note handling, and comprehensive export/backup functionality.

---

## 🎯 **Core Features Overview**

### **Phase 1: Multi-Page System with Export/Backup**
- **Modern Sidebar**: Collapsible/resizable with hierarchical page listing
- **Page Management**: Create, edit, delete pages with parent/child relationships
- **Drag & Drop**: Reorder pages and create subpages by dragging
- **Favorites**: Drag pages to favorites section
- **Search**: Full-text search using SQLite FTS5
- **Image Storage**: Images stored in public/uploads directory
- **Export**: Individual pages as JSON and Markdown with images
- **Backup/Restore**: Full backup of all pages and images
- **WebLLM Only**: Browser-based AI (existing functionality)

### **Phase 2: LM Studio Integration**
- **Dual AI Support**: Toggle between WebLLM and LM Studio
- **Settings Page**: AI engine selection and configuration
- **LM Studio Connection**: Local AI server integration
- **Model Selection**: Choose models within LM Studio
- **Fallback Handling**: Graceful fallback to WebLLM if LM Studio unavailable

---

## 🚀 **PHASE 1: Multi-Page System with Export/Backup (8 Weeks)**

### **Week 1-2: Next.js Migration**

#### **Goal**: Migrate from Vite to Next.js while preserving all existing functionality

#### **Tasks**
1. **Install Dependencies**
   ```bash
   npm install next@latest react@18.2.0 react-dom@18.2.0 prisma @prisma/client zod
   npm install better-sqlite3 @types/better-sqlite3
   npm install tailwindcss postcss autoprefixer
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

2. **Project Structure Migration**
   - Convert to Next.js app directory structure
   - Move components to `app/components/`
   - Create `app/api/` for API routes
   - Update imports and file paths

3. **Build System Migration**
   - Replace Vite config with `next.config.js`
   - Update TypeScript configuration
   - Configure Tailwind CSS
   - Update package.json scripts

4. **Preserve Existing Features**
   - Ensure BlockNote editor works
   - Verify WebLLM AI integration
   - Test all existing functionality
   - Maintain responsive design

5. **Unit Tests**
   - Update test configuration for Next.js
   - Migrate existing tests
   - Add Next.js specific tests

#### **Deliverables**
- ✅ Working Next.js application
- ✅ All existing features preserved
- ✅ Updated build system
- ✅ Migrated tests

#### **Manual Testing**
- Verify all AI features work
- Test responsive design
- Check performance
- Validate build process

---

### **Week 3: Database Foundation + Image Storage**

#### **Goal**: Set up Prisma with SQLite, image storage, and basic page CRUD operations

#### **Tasks**
1. **Database Setup**
   - Initialize Prisma with SQLite
   - Create database schema with image support
   - Set up SQLite database file
   - Configure FTS5 for search

2. **Image Storage System** 🖼️
   - Create `public/uploads/` directory
   - Implement image upload API route
   - Generate unique filenames for images
   - Store image references in database

3. **Prisma Schema** (Enhanced)
   ```prisma
   model Page {
     id          String   @id @default(cuid())
     title       String
     content     String   // JSON string of BlockNote blocks
     parentId    String?
     order       Int      @default(0)
     isFavorite  Boolean  @default(false)
     createdAt   DateTime @default(now())
     updatedAt   DateTime @updatedAt
     tags        String[]
     images      Image[]  // Relation to images
     
     parent      Page?    @relation("PageHierarchy", fields: [parentId], references: [id])
     children    Page[]   @relation("PageHierarchy")
     
     @@index([parentId])
     @@index([isFavorite])
     @@index([order])
   }
   
   model Image {
     id          String   @id @default(cuid())
     filename    String   // Unique filename
     originalName String  // Original uploaded filename
     mimeType    String   // Image MIME type
     size        Int      // File size in bytes
     pageId      String
     page        Page     @relation(fields: [pageId], references: [id])
     createdAt   DateTime @default(now())
     
     @@index([pageId])
   }
   ```

4. **API Routes**
   - `app/api/pages/route.ts` - Page CRUD operations
   - `app/api/pages/[id]/route.ts` - Individual page operations
   - `app/api/images/route.ts` - Image upload
   - `app/api/images/[id]/route.ts` - Image management

5. **Database Service**
   - `lib/prisma.ts` - Prisma client
   - `lib/validations.ts` - Zod schemas
   - `lib/imageHandler.ts` - Image management utilities

6. **Unit Tests**
   - Database operation tests
   - Image upload tests
   - API route tests
   - Validation tests

#### **Deliverables**
- ✅ Working SQLite database
- ✅ Image storage system
- ✅ CRUD API endpoints
- ✅ Database tests

#### **Manual Testing**
- Test API endpoints
- Upload and manage images
- Verify image storage
- Test error handling

---

### **Week 4: Sidebar UI Foundation**

#### **Goal**: Create the collapsible sidebar with server-side page loading

#### **Tasks**
1. **Create Sidebar Components**
   - `app/components/Sidebar.tsx` - Main sidebar container
   - `app/components/SidebarToggle.tsx` - Collapse/expand button
   - `app/components/PageList.tsx` - Page listing component

2. **Server Components**
   - `app/components/ServerPageList.tsx` - Server-side page loading
   - `app/components/ServerFavorites.tsx` - Server-side favorites
   - `app/components/PageTree.tsx` - Hierarchical page tree

3. **Client-Server Integration**
   - Implement React Server Components
   - Add client-side interactivity
   - Handle loading states

4. **State Management**
   - Update Zustand store for Next.js
   - Add sidebar state
   - Implement page selection

5. **Unit Tests**
   - Component tests
   - Server component tests
   - Integration tests

#### **Deliverables**
- ✅ Collapsible sidebar
- ✅ Server-side page loading
- ✅ Page selection
- ✅ Responsive design

#### **Manual Testing**
- Test sidebar functionality
- Verify page loading
- Check responsive behavior
- Test server-side rendering

---

### **Week 5: Drag & Drop System**

#### **Goal**: Implement drag-and-drop with server-side updates

#### **Tasks**
1. **Create Drag & Drop Components**
   - `app/components/DragDropProvider.tsx` - DnD context
   - `app/components/DraggablePage.tsx` - Draggable page item
   - `app/components/DropZone.tsx` - Drop target

2. **API Integration**
   - `app/api/pages/reorder/route.ts` - Reorder pages
   - `app/api/pages/hierarchy/route.ts` - Update hierarchy
   - Real-time updates with optimistic UI

3. **Client-Server Sync**
   - Optimistic updates
   - Error handling and rollback
   - Conflict resolution

4. **Unit Tests**
   - Drag & drop logic tests
   - API integration tests
   - Error handling tests

#### **Deliverables**
- ✅ Drag & drop page reordering
- ✅ Server-side hierarchy updates
- ✅ Optimistic UI updates
- ✅ Error handling

#### **Manual Testing**
- Test drag & drop functionality
- Verify server updates
- Test error scenarios
- Check performance

---

### **Week 6: Favorites System**

#### **Goal**: Implement favorites with server-side persistence

#### **Tasks**
1. **Create Favorites Components**
   - `app/components/FavoritesSection.tsx` - Favorites container
   - `app/components/FavoriteItem.tsx` - Individual favorite item

2. **API Routes**
   - `app/api/favorites/route.ts` - Favorites CRUD
   - `app/api/favorites/[id]/route.ts` - Individual operations

3. **Favorites Logic**
   - Add/remove from favorites
   - Drag pages to favorites
   - Maintain subpage relationships
   - Server-side persistence

4. **Database Updates**
   - Update `isFavorite` field
   - Handle subpage relationships
   - Optimize favorites queries

5. **Unit Tests**
   - Favorites API tests
   - Component tests
   - Integration tests

#### **Deliverables**
- ✅ Favorites API endpoints
- ✅ Drag & drop to favorites
- ✅ Server-side persistence
- ✅ Subpage relationship handling

#### **Manual Testing**
- Test favorites functionality
- Verify server persistence
- Test subpage relationships
- Check performance

---

### **Week 7: Search Functionality + Export/Backup System**

#### **Goal**: Implement full-text search and comprehensive export/backup

#### **Tasks**
1. **Create Search Components**
   - `app/components/SearchBar.tsx` - Search input
   - `app/components/SearchResults.tsx` - Results display
   - `app/components/SearchHighlight.tsx` - Text highlighting

2. **Search API**
   - `app/api/search/route.ts` - Full-text search endpoint
   - SQLite FTS5 integration
   - Search result ranking

3. **Export System** 📤 **NEW**
   - **Individual Page Export**:
     - `app/api/export/page/[id]/json/route.ts` - Export as JSON
     - `app/api/export/page/[id]/markdown/route.ts` - Export as Markdown
     - Include images in export (embedded or zipped)
   
   - **Full Backup**:
     - `app/api/backup/export/route.ts` - Export all data
     - `app/api/backup/import/route.ts` - Import backup
     - `app/api/backup/validate/route.ts` - Validate backup file
   
   - **Export Features**:
     - Export page as JSON with BlockNote content
     - Export page as Markdown with text content
     - Export all pages as single JSON file
     - Include images in exports (zip or embedded)
     - Timestamp-based filenames

4. **Backup/Restore Implementation**
   - **Export Utilities**:
     - `lib/exportUtils.ts` - JSON and Markdown export logic
     - `lib/backupUtils.ts` - Full backup logic
     - `lib/imageExport.ts` - Image handling in exports
   
   - **Import Utilities**:
     - `lib/importUtils.ts` - Backup import logic
     - `lib/backupValidator.ts` - Validate backup files
     - Handle conflicts and duplicates

5. **Export Components** 📤 **NEW**
   - `app/components/ExportDialog.tsx` - Export options dialog
   - `app/components/BackupDialog.tsx` - Backup/restore dialog
   - Export/restore buttons in UI

6. **Unit Tests**
   - Search API tests
   - Export functionality tests
   - Backup/restore tests
   - Image export tests

#### **Deliverables**
- ✅ Full-text search
- ✅ Individual page export (JSON/Markdown)
- ✅ Full backup/restore
- ✅ Image export included
- ✅ Timestamped exports

#### **Manual Testing**
- Search functionality
- Export single page as JSON
- Export single page as Markdown
- Create full backup
- Restore from backup
- Verify image exports

---

### **Week 8: Integration & Polish + PHASE 1 RELEASE**

#### **Goal**: Final integration, polish, and Phase 1 release

#### **Tasks**
1. **AI Features Integration**
   - Ensure AI features work on all pages
   - Update AI context for current page
   - Maintain AI state per page

2. **Image Management Polish**
   - Image preview in BlockNote
   - Image deletion handling
   - Image optimization
   - Storage cleanup

3. **Export/Backup Polish** 📤
   - Polish export dialogs
   - Add export progress indicators
   - Improve backup validation
   - Add backup history tracking
   - Error messages and recovery

4. **Performance Optimization**
   - Database query optimization
   - Image caching strategies
   - Lazy loading for large pages
   - Search result caching

5. **UI/UX Polish**
   - Smooth animations
   - Loading states
   - Error boundaries
   - Accessibility improvements

6. **Comprehensive Testing**
   - Integration tests
   - E2E tests
   - Performance tests
   - Accessibility tests
   - Export/backup stress tests

7. **Phase 1 Release Preparation**
   - Version bump to v0.2.0
   - Update documentation
   - Create release notes
   - Tag and deploy
   - User acceptance testing

#### **Deliverables**
- ✅ Fully integrated multi-page system
- ✅ All AI features working
- ✅ Export/backup system complete
- ✅ Image management complete
- ✅ Optimized performance
- ✅ Polished UI/UX
- ✅ **PHASE 1 RELEASE**

#### **Manual Testing**
- All AI features on different pages
- Performance with many pages
- Accessibility features
- Complete user workflow
- Export/backup scenarios
- Image handling edge cases

---

## 🚀 **PHASE 2: LM Studio Integration (3 Weeks)**

### **Week 9: Database Schema Update + AI Engine Abstraction**

#### **Goal**: Extend database for settings and create AI engine abstraction layer

#### **Tasks**
1. **Extend Database Schema**
   ```prisma
   model Settings {
     id              String   @id @default("settings")
     aiEngine        String   @default("webllm") // 'webllm' or 'lmstudio'
     lmStudioUrl     String   @default("http://localhost:1234/v1")
     lmStudioModel   String?
     preferredModel   String?
     fallbackEnabled Boolean  @default(true)
     updatedAt       DateTime @updatedAt
   }
   ```

2. **Create AI Engine Abstraction**
   - `lib/ai/AIEngine.ts` - Base abstract class
   - `lib/ai/WebLLMEngine.ts` - WebLLM implementation
   - `lib/ai/LMStudioEngine.ts` - LM Studio implementation (stub)
   - `lib/ai/AIEngineFactory.ts` - Factory pattern
   - `lib/ai/types.ts` - Common interfaces

3. **Update Existing AI Code**
   - Refactor to use WebLLMEngine
   - Maintain backward compatibility
   - Ensure all AI features work

4. **Unit Tests**
   - AI engine abstraction tests
   - Settings database tests
   - Existing AI feature tests

#### **Deliverables**
- ✅ Extended database schema
- ✅ AI engine abstraction layer
- ✅ WebLLM engine implementation
- ✅ All existing features working
- ✅ Unit tests (95%+ coverage)

#### **Manual Testing**
- Verify all AI features still work
- Test WebLLM engine wrapper
- Test settings persistence
- No regression in functionality

---

### **Week 10: LM Studio Integration + Settings UI**

#### **Goal**: Integrate LM Studio and create settings page

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
   - `app/components/Settings.tsx` - Main settings page
   - `app/components/AIEngineSelector.tsx` - Engine selection
   - `app/components/LMStudioConnection.tsx` - Connection status
   - `app/components/WebLLMSettings.tsx` - WebLLM config
   - `app/components/LMStudioSettings.tsx` - LM Studio config

4. **Settings API Routes**
   - `app/api/settings/route.ts` - Get/update settings
   - `app/api/settings/engine/route.ts` - Switch engine
   - `app/api/settings/test-lmstudio/route.ts` - Test connection

5. **AI Engine Routing**
   - Route AI requests to selected engine
   - Handle engine switching
   - Maintain conversation context
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

### **Week 11: Integration, Testing & Release**

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

4. **Export/Backup Enhancement** 📤
   - Include AI settings in backup
   - Export AI preferences
   - Restore AI settings correctly

5. **Comprehensive Testing**
   - Integration tests for both engines
   - E2E tests
   - Performance tests
   - Accessibility tests
   - Export/backup tests with LM Studio

6. **Documentation**
   - Update README with LM Studio setup
   - Create LM Studio setup guide
   - Document export/backup features
   - Document image handling
   - Migration guide

7. **Phase 2 Release Preparation**
   - Version bump to v0.3.0
   - Update changelog
   - Create release notes
   - Tag and deploy
   - User testing

#### **Deliverables**
- ✅ Fully functional dual AI engine support
- ✅ All features working with both engines
- ✅ Optimized performance
   - ✅ Comprehensive export/backup
- ✅ Image handling complete
- ✅ Comprehensive documentation
- ✅ **PHASE 2 RELEASE**

#### **Manual Testing**
- All AI features with WebLLM
- All AI features with LM Studio
- Engine switching during workflows
- LM Studio unavailable scenarios
- Export with images
- Full backup and restore
- Different LM Studio models

---

## 📊 **Enhanced Database Schema**

### **Pages Table**
```prisma
model Page {
  id          String   @id @default(cuid())
  title       String
  content     String   // JSON string of BlockNote blocks
  parentId    String?
  order       Int      @default(0)
  isFavorite  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tags        String[]
  images      Image[]  // Relation to images
  
  parent      Page?    @relation("PageHierarchy", fields: [parentId], references: [id])
  children    Page[]   @relation("PageHierarchy")
  
  @@index([parentId])
  @@index([isFavorite])
  @@index([order])
}
```

### **Images Table** 🖼️
```prisma
model Image {
  id          String   @id @default(cuid())
  filename    String   // Unique filename in public/uploads/
  originalName String  // Original uploaded filename
  mimeType    String   // Image MIME type
  size        Int      // File size in bytes
  pageId      String
  page        Page     @relation(fields: [pageId], references: [id])
  createdAt   DateTime @default(now())
  
  @@index([pageId])
}
```

### **Settings Table** (Phase 2)
```prisma
model Settings {
  id              String   @id @default("settings")
  aiEngine        String   @default("webllm")
  lmStudioUrl     String   @default("http://localhost:1234/v1")
  lmStudioModel   String?
  preferredModel   String?
  fallbackEnabled Boolean  @default(true)
  updatedAt       DateTime @updatedAt
}
```

---

## 🛠️ **Technical Architecture**

### **Full-Stack Stack**
- **Frontend**: Next.js 15 + React 18.2.0 + TypeScript 5.2.2
- **Backend**: Next.js API Routes + Node.js 22 LTS
- **Database**: Prisma 6.16.2 + SQLite + better-sqlite3
- **Search**: SQLite FTS5 (Full-Text Search)
- **Validation**: Zod 4.1.12
- **Storage**: SQLite database + public/uploads/ for images
- **Editor**: BlockNote 0.12.4 (client-side)
- **AI Engine (WebLLM)**: WebLLM 0.2.35 (Phase 1)
- **AI Engine (LM Studio)**: @lmstudio/sdk (Phase 2)
- **State Management**: Zustand 4.5.2
- **Styling**: Tailwind CSS + CSS Modules
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable

---

## 📁 **File Structure**

```
notes-ai/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/
│   ├── uploads/              # Image storage
│   │   └── [timestamp]-[id].jpg
│   └── ...
├── app/
│   ├── api/
│   │   ├── pages/             # Page CRUD operations
│   │   ├── images/             # Image management
│   │   ├── export/             # Export endpoints
│   │   ├── backup/             # Backup/restore endpoints
│   │   ├── search/             # Full-text search
│   │   └── settings/          # Settings (Phase 2)
│   ├── components/            # React components
│   └── layout.tsx
├── lib/
│   ├── prisma.ts             # Prisma client
│   ├── validations.ts        # Zod schemas
│   ├── imageHandler.ts       # Image utilities
│   ├── exportUtils.ts        # Export logic
│   ├── backupUtils.ts        # Backup logic
│   └── ai/                   # AI engine abstraction (Phase 2)
└── ...
```

---

## ✅ **Pros of Next.js 2-Phase Approach**

### **Storage & Scalability**
- ✅ **No Browser Limits**: SQLite can handle GBs of data
- ✅ **Image Storage**: Files stored in public/uploads/
- ✅ **Scalable**: Can handle thousands of pages with images
- ✅ **Full Backup**: Complete database and images export

### **Export/Backup Benefits**
- ✅ **Individual Page Export**: JSON and Markdown formats
- ✅ **Image Export**: Images included in exports
- ✅ **Full Backup**: All pages, images, and settings
- ✅ **Easy Restore**: One-click backup restore
- ✅ **Format Support**: JSON, Markdown, zip archives

### **Phase Benefits**
- ✅ **Phase 1 Delivery**: Core features in 8 weeks
- ✅ **Phase 2 Enhancement**: Dual AI in 11 weeks total
- ✅ **Incremental Value**: Users get features gradually
- ✅ **Rollback Safety**: Each phase independently functional

### **Technical Benefits**
- ✅ **Full-Stack**: Server-side rendering and API routes
- ✅ **SQLite FTS5**: Powerful full-text search
- ✅ **Image Management**: Proper file handling
- ✅ **Backup System**: Complete data export/import
- ✅ **Professional**: Production-ready architecture

---

## ❌ **Cons of Next.js 2-Phase Approach**

### **Complexity**
- ❌ **Major Refactoring**: Vite → Next.js migration
- ❌ **Longer Development**: 11 weeks total timeline
- ❌ **Server Deployment**: Need server-side hosting
- ❌ **Database Management**: SQLite file management

### **Deployment**
- ❌ **Server Required**: Can't use static hosting
- ❌ **More Complex**: Environment setup needed
- ❌ **Higher Cost**: Server hosting costs
- ❌ **Backup Location**: Need to manage SQLite file location

### **Development Overhead**
- ❌ **Learning Curve**: Next.js concepts to learn
- ❌ **Testing Complexity**: Server-side testing
- ❌ **Debugging**: More complex debugging
- ❌ **Two Phases**: Longer total timeline

---

## ✅ **Confirmed Requirements**

### **Storage & Backup** ✅
1. **Database Location**: `./prisma/notesai.db` (default) ✅
2. **Image Storage**: `./public/uploads/` (default) ✅
3. **Backup Strategy**: Both manual exports in-app AND database/uploads folder zip ✅
4. **Image Formats**: jpg, png, gif, webp ✅
5. **Port**: localhost:4000 ✅
6. **Auto-Start**: Settings toggle for "Start with Windows" ✅

### **Export Features** ✅
1. **Markdown Images**: Embed in ZIP file ✅
2. **JSON Images**: References only (not base64) ✅
3. **Export Scope**: Three options:
   - Current page only
   - Current page + subpages
   - All pages ✅
4. **Export Location**: Download to user's device ✅

### **Deployment** ✅
1. **Environment**: Local-first desktop app ✅
2. **Server**: Runs locally on localhost:4000 ✅
3. **Database Backup**: Manual via in-app export + optional local backup scripts ✅
4. **Image Cleanup**: Orphan cleanup as future Phase 7 enhancement ✅

### **LM Studio (Phase 2)** ✅
1. **Setup**: Users expected to install LM Studio separately ✅
2. **Auto-Detection**: Auto-detect with manual URL override option ✅
3. **Model Selection**: Yes, show available models in dropdown ✅
4. **Fallback**: Yes, auto-fallback to WebLLM if LM Studio unavailable ✅

---

## 📋 **Success Metrics**

### **Phase 1 Metrics**
- **Test Coverage**: 95%+ unit test coverage
- **Performance**: <200ms page load time
- **Search Speed**: <100ms search results
- **Image Upload**: <1s for typical images
- **Export Speed**: <500ms for JSON export
- **Backup Size**: Reasonable file sizes

### **Phase 2 Metrics**
- **AI Response Time**: <2s for LM Studio, <5s for WebLLM
- **Engine Switching**: <1 second to switch
- **No Regression**: All Phase 1 features still work

### **Overall Quality**
- **Error Rate**: <1% in production
- **User Satisfaction**: Positive feedback
- **Performance**: No regression
- **Accessibility**: WCAG 2.1 AA compliance

---

## 📅 **Timeline Summary**

### **Phase 1 (8 Weeks)**
- Week 1-2: Next.js migration
- Week 3: Database + Image storage
- Week 4: Sidebar UI
- Week 5: Drag & drop
- Week 6: Favorites
- Week 7: Search + Export/Backup 🖼️📤
- Week 8: Integration, polish, and **Phase 1 Release**

### **Phase 2 (3 Weeks)**
- Week 9: AI engine abstraction
- Week 10: LM Studio integration
- Week 11: Testing, polish, and **Phase 2 Release**

### **Total: 11 Weeks** for complete implementation

---

This plan provides a comprehensive roadmap for implementing the multi-page feature with Next.js, addressing image storage, large dataset handling, and comprehensive export/backup functionality while maintaining professional development practices.

---

## 📝 **Implementation Summary**

### **Environment**
- **Local-First Desktop App**: Runs on localhost:4000
- **Database**: SQLite at `./prisma/notesai.db`
- **Images**: Stored at `./public/uploads/`
- **File Formats**: jpg, png, gif, webp
- **No External Hosting Required**: Fully self-contained

### **Key Features Confirmed**
- ✅ Collapsible/resizable sidebar with drag & drop
- ✅ Hierarchical pages (parent/child relationships)
- ✅ Favorites system
- ✅ Full-text search (SQLite FTS5)
- ✅ Image storage and management
- ✅ Export: Current page, page+subpages, or all pages
- ✅ Export formats: JSON (references) and Markdown (ZIP with images)
- ✅ Full backup: Database + images via in-app export
- ✅ LM Studio integration (Phase 2)
- ✅ Auto-start toggle in Settings

### **Export/Backup Implementation**
- **Export Options**: 
  - Current page only
  - Current page + subpages
  - All pages
  
- **Export Formats**:
  - JSON: Page data with image references
  - Markdown: Text content with images in ZIP
  - Backup: Complete database + images backup

- **Export Location**: Downloads to user's device

### **LM Studio Integration (Phase 2)**
- Auto-detect LM Studio on localhost:1234
- Manual URL override option
- Model selection dropdown
- Auto-fallback to WebLLM if unavailable

### **Development Port**
- Development: localhost:4000
- Next.js configured for port 4000
