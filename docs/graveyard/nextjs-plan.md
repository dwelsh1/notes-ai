# NotesAI Multi-Page Feature - Next.js Plan

## 📋 **Project Overview**

This plan outlines the implementation of a multi-page note-taking system using **Next.js 15** with **Prisma ORM** and **SQLite** database. This approach would transform NotesAI from a client-side only application to a full-stack application with server-side rendering and API routes.

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

- **Full-Text Search**: Search page names and content using SQLite FTS5
- **Real-time Results**: Instant search as you type
- **Highlighted Results**: Show matching text with highlighting

---

## 🛠️ **Technical Architecture**

### **New Full-Stack Stack**

- **Frontend**: Next.js 15 + React 19 + TypeScript 5.2.2
- **Backend**: Next.js API Routes + Node.js 22 LTS
- **Database**: Prisma 6.16.2 + SQLite + better-sqlite3 12.4.1
- **Search**: SQLite FTS5 (Full-Text Search)
- **Validation**: Zod 4.1.12
- **Editor**: BlockNote 0.12.4 (client-side)
- **AI Engine**: WebLLM 0.2.35 (client-side)
- **State Management**: Zustand 4.5.2
- **Styling**: Tailwind CSS + CSS Modules

### **Architecture Changes**

- **Client-Side → Full-Stack**: Add server-side rendering
- **Static → Dynamic**: Add API routes and database
- **Vite → Next.js**: Complete build system migration
- **IndexedDB → SQLite**: Server-side database storage

---

## 📊 **Database Schema**

### **Prisma Schema**

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = "file:./notesai.db"
}

model Page {
  id          String   @id @default(cuid())
  title       String
  content     String   // JSON string of BlockNote blocks
  parentId    String?
  order       Int      @default(0)
  isFavorite  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  tags        String[] // Array of tags

  // Relations
  parent      Page?    @relation("PageHierarchy", fields: [parentId], references: [id])
  children    Page[]   @relation("PageHierarchy")

  // Indexes
  @@index([parentId])
  @@index([isFavorite])
  @@index([order])
  @@index([createdAt])
  @@index([updatedAt])
}

// FTS5 Virtual Table for Full-Text Search
model PageSearch {
  id      String
  title   String
  content String

  @@map("pages_fts")
}
```

### **Database Features**

- **Hierarchical Queries**: Recursive CTEs for parent-child relationships
- **Full-Text Search**: SQLite FTS5 for fast content search
- **Transactions**: ACID compliance for data consistency
- **Indexes**: Optimized for common queries

---

## 🚀 **Implementation Phases**

### **Phase 1: Next.js Migration** (Week 1-2)

**Goal**: Migrate from Vite to Next.js while preserving all existing functionality

#### **Tasks**

1. **Install Dependencies**

   ```bash
   npm install next@latest react@latest react-dom@latest
   npm install prisma @prisma/client zod
   npm install better-sqlite3 @types/better-sqlite3
   npm install tailwindcss postcss autoprefixer
   ```

2. **Project Structure Migration**
   - Convert `src/` to Next.js app directory structure
   - Move components to `app/components/`
   - Create `app/api/` for API routes
   - Update imports and file paths

3. **Build System Migration**
   - Replace Vite config with Next.js config
   - Update TypeScript configuration
   - Migrate CSS and styling approach
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

### **Phase 2: Database Foundation** (Week 3)

**Goal**: Set up Prisma with SQLite and implement basic page CRUD operations

#### **Tasks**

1. **Database Setup**
   - Initialize Prisma
   - Create database schema
   - Set up SQLite database
   - Configure FTS5 for search

2. **API Routes**
   - `app/api/pages/route.ts` - CRUD operations
   - `app/api/pages/[id]/route.ts` - Individual page operations
   - `app/api/pages/search/route.ts` - Search functionality

3. **Database Service**
   - `lib/database.ts` - Database connection
   - `lib/prisma.ts` - Prisma client
   - `lib/validations.ts` - Zod schemas

4. **Page Operations**
   - Create page
   - Read page
   - Update page
   - Delete page
   - List pages with hierarchy

5. **Unit Tests**
   - API route tests
   - Database operation tests
   - Validation tests

#### **Deliverables**

- ✅ Working SQLite database
- ✅ Prisma ORM integration
- ✅ CRUD API endpoints
- ✅ Database tests

#### **Manual Testing**

- Test API endpoints
- Verify database operations
- Check data persistence
- Test error handling

---

### **Phase 3: Sidebar UI Foundation** (Week 4)

**Goal**: Create the collapsible sidebar with server-side page loading

#### **Tasks**

1. **Create Sidebar Components**
   - `app/components/Sidebar.tsx` - Main sidebar container
   - `app/components/SidebarToggle.tsx` - Collapse/expand button
   - `app/components/PageList.tsx` - Page listing component

2. **Server Components**
   - `app/components/ServerPageList.tsx` - Server-side page loading
   - `app/components/ServerFavorites.tsx` - Server-side favorites

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

### **Phase 4: Drag & Drop System** (Week 5)

**Goal**: Implement drag-and-drop with server-side updates

#### **Tasks**

1. **Install Drag & Drop Dependencies**

   ```bash
   npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
   ```

2. **Create Drag & Drop Components**
   - `app/components/DragDropProvider.tsx` - DnD context
   - `app/components/DraggablePage.tsx` - Draggable page item
   - `app/components/DropZone.tsx` - Drop target

3. **API Integration**
   - `app/api/pages/reorder/route.ts` - Reorder pages
   - `app/api/pages/hierarchy/route.ts` - Update hierarchy
   - Real-time updates with optimistic UI

4. **Client-Server Sync**
   - Optimistic updates
   - Error handling and rollback
   - Conflict resolution

5. **Unit Tests**
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

### **Phase 5: Favorites System** (Week 6)

**Goal**: Implement favorites with server-side persistence

#### **Tasks**

1. **Create Favorites Components**
   - `app/components/FavoritesSection.tsx` - Favorites container
   - `app/components/FavoriteItem.tsx` - Individual favorite item

2. **API Routes**
   - `app/api/favorites/route.ts` - Favorites CRUD
   - `app/api/favorites/[id]/route.ts` - Individual favorite operations

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

### **Phase 6: Search Functionality** (Week 7)

**Goal**: Implement full-text search using SQLite FTS5

#### **Tasks**

1. **Create Search Components**
   - `app/components/SearchBar.tsx` - Search input
   - `app/components/SearchResults.tsx` - Results display
   - `app/components/SearchHighlight.tsx` - Text highlighting

2. **Search API**
   - `app/api/search/route.ts` - Full-text search endpoint
   - SQLite FTS5 integration
   - Search result ranking

3. **Search Features**
   - Full-text search in titles and content
   - Real-time search as you type
   - Search result highlighting
   - Search history

4. **Performance Optimization**
   - Database query optimization
   - Search result caching
   - Debounced search input

5. **Unit Tests**
   - Search API tests
   - Component tests
   - Performance tests

#### **Deliverables**

- ✅ Full-text search API
- ✅ Real-time search
- ✅ Search result highlighting
- ✅ Optimized performance

#### **Manual Testing**

- Test search functionality
- Verify search performance
- Test with large datasets
- Check search accuracy

---

### **Phase 7: Integration & Polish** (Week 8)

**Goal**: Integrate multi-page system with AI features and polish

#### **Tasks**

1. **AI Features Integration**
   - Ensure AI features work on all pages
   - Update AI context for current page
   - Maintain AI state per page
   - Server-side AI processing (optional)

2. **Performance Optimization**
   - Database query optimization
   - Caching strategies
   - Image optimization
   - Bundle optimization

3. **UI/UX Polish**
   - Smooth animations
   - Loading states
   - Error boundaries
   - Accessibility improvements

4. **Data Migration**
   - Migrate existing single page
   - Preserve existing content
   - Handle edge cases

5. **Comprehensive Testing**
   - Integration tests
   - E2E tests
   - Performance tests
   - Security tests

#### **Deliverables**

- ✅ Fully integrated system
- ✅ AI features on all pages
- ✅ Optimized performance
- ✅ Polished UI/UX

#### **Manual Testing**

- Test all features
- Verify performance
- Check accessibility
- Complete user workflow

---

## 📈 **Additional Features (Future Enhancements)**

### **Phase 8: Advanced Features** (Future)

- **User Authentication**: Multi-user support
- **Page Sharing**: Share pages between users
- **Page Templates**: Pre-defined layouts
- **Page History**: Version control
- **Page Analytics**: Usage statistics
- **Page Collaboration**: Real-time editing
- **Cloud Sync**: Cross-device synchronization
- **API Documentation**: OpenAPI/Swagger docs

---

## ✅ **Pros of Next.js Approach**

### **Architecture Benefits**

- **Full-Stack Solution**: Complete server-side capabilities
- **Server-Side Rendering**: Better SEO and performance
- **API Routes**: Built-in backend functionality
- **Scalability**: Can handle large datasets and users

### **Technical Benefits**

- **SQLite FTS5**: Powerful full-text search
- **Prisma ORM**: Type-safe database operations
- **Server Components**: Optimized rendering
- **Built-in Optimization**: Image, font, and bundle optimization

### **User Experience**

- **Fast Loading**: Server-side rendering
- **Better SEO**: Search engine optimization
- **Offline Support**: Service worker integration
- **Cross-Device Sync**: Server-side data storage

### **Development Experience**

- **Modern Stack**: Latest React and Next.js features
- **Type Safety**: End-to-end TypeScript
- **Hot Reloading**: Fast development cycle
- **Built-in Testing**: Jest and React Testing Library

---

## ❌ **Cons of Next.js Approach**

### **Complexity**

- **Major Refactoring**: Complete architecture change
- **Learning Curve**: New Next.js concepts
- **Deployment Complexity**: Server-side deployment needed
- **Database Management**: SQLite file management

### **Development Overhead**

- **Longer Development**: 8 weeks vs 6 weeks
- **More Dependencies**: Additional packages and complexity
- **Testing Complexity**: Server-side testing
- **Debugging**: More complex debugging

### **Deployment Requirements**

- **Server Hosting**: Need server-side hosting
- **Database Management**: SQLite file persistence
- **Environment Setup**: More complex deployment
- **Cost**: Higher hosting costs

### **Migration Risks**

- **Breaking Changes**: Risk of losing existing functionality
- **Performance Impact**: Potential performance regression
- **User Experience**: Possible disruption during migration
- **Rollback Complexity**: Harder to rollback changes

---

## 🤔 **Clarifying Questions**

### **Architecture & Migration**

1. **Migration Risk**: Are you comfortable with major refactoring?
2. **Timeline**: Is 8-week timeline acceptable?
3. **Breaking Changes**: Can we afford potential temporary disruption?
4. **Rollback Plan**: Do you need a rollback strategy?

### **Deployment & Hosting**

1. **Server Hosting**: Do you have server hosting capabilities?
2. **Database Management**: Comfortable with SQLite file management?
3. **Environment Setup**: Can you handle more complex deployment?
4. **Cost**: Acceptable higher hosting costs?

### **Technical Requirements**

1. **Performance**: Need server-side rendering benefits?
2. **SEO**: Do you need search engine optimization?
3. **Scalability**: Planning for multiple users?
4. **Cross-Device**: Need cross-device synchronization?

### **Development Team**

1. **Next.js Experience**: Team familiar with Next.js?
2. **Full-Stack Skills**: Comfortable with server-side development?
3. **Database Experience**: Experience with Prisma/SQLite?
4. **Testing**: Can handle more complex testing requirements?

### **User Requirements**

1. **Offline Usage**: Is offline-first approach required?
2. **Data Privacy**: Need client-side only data storage?
3. **Performance**: Acceptable server-side rendering delays?
4. **Features**: Need advanced search capabilities?

---

## 📋 **Success Metrics**

### **Technical Metrics**

- **Test Coverage**: 95%+ unit test coverage
- **Performance**: <200ms page load time
- **Search Speed**: <100ms search results
- **API Response**: <50ms API response time

### **User Experience Metrics**

- **Page Creation**: <1 second to create new page
- **Drag & Drop**: Smooth 60fps animations
- **Search**: Real-time results as you type
- **Accessibility**: WCAG 2.1 AA compliance

### **Quality Metrics**

- **Zero Breaking Changes**: Existing functionality preserved
- **Error Rate**: <0.5% error rate in production
- **User Satisfaction**: Positive feedback on new features
- **Performance**: No regression in existing features

---

## 🚨 **Risk Assessment**

### **High Risk**

- **Migration Complexity**: Complete architecture change
- **Timeline**: 8-week development cycle
- **Breaking Changes**: Risk of losing functionality
- **Deployment**: More complex hosting requirements

### **Medium Risk**

- **Performance**: Potential performance regression
- **Testing**: More complex testing requirements
- **Debugging**: Server-side debugging complexity
- **Cost**: Higher hosting and development costs

### **Low Risk**

- **Feature Completeness**: All features achievable
- **User Experience**: Good user experience possible
- **Scalability**: Can handle growth
- **Maintenance**: Good long-term maintainability

---

This plan provides a comprehensive roadmap for implementing the multi-page feature using Next.js with full-stack capabilities, but requires significant architectural changes and longer development time.
