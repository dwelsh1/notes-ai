# Developer Guide - NotesAI

This comprehensive guide will help junior developers understand and contribute to the NotesAI project.

## Table of Contents

1. [UI Terminology](#ui-terminology)
2. [Project Overview](#project-overview)
3. [Tech Stack](#tech-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [Development Workflow](#development-workflow)
7. [Key Components](#key-components)
8. [AI Integration](#ai-integration)
9. [Styling & UI](#styling--ui)
10. [State Management](#state-management)
11. [Testing](#testing)
12. [Troubleshooting](#troubleshooting)
13. [Contributing Guidelines](#contributing-guidelines)

## UI Terminology

To ensure clear communication between developers, users, and in documentation, we use standardized names for all UI areas and components. This terminology is also documented in `docs/UI-TERMINOLOGY.md`.

### Layout Areas

#### **Top Toolbar** (Main Header)

- **Location**: Top of the application, full width
- **Contains**: NotesAI logo, AI action buttons (Translate, Correct, Summarize, Develop), Clear button, Stop button
- **Component**: `Header.tsx`
- **Preferred**: **Top Toolbar**

#### **Left Sidebar** (Pages Panel)

- **Location**: Left side of the application, collapsible
- **Contains**: Pages Header, Search Field, Page List
- **Component**: `Sidebar.tsx`
- **Preferred**: **Left Sidebar**

#### **Main Content Area** (Editor Area)

- **Location**: Center/right of the application
- **Contains**: Page Title Field, BlockNote Editor, AI Chat UI
- **Component**: `App.tsx` (orchestrates these), `BlockNoteEditor.tsx`, `ChatUI.tsx`
- **Preferred**: **Main Content Area**

#### **Footer** (Status Bar)

- **Location**: Bottom of the application, full width
- **Contains**: Status messages, potentially other global controls
- **Preferred**: **Footer**

### Left Sidebar Components

#### **Pages Header**

- **Location**: Top section of the **Left Sidebar**
- **Contains**: "Pages" label, New Page Button (+ icon), Collapse/Expand Sidebar Button (Chevron icon)
- **Component**: Part of `Sidebar.tsx`
- **Preferred**: **Pages Header**

#### **Search Field**

- **Location**: Below the **Pages Header** in the **Left Sidebar**
- **Contains**: Input field for searching pages, Clear Search Button (X icon)
- **Component**: Part of `Sidebar.tsx`
- **Preferred**: **Search Field**

#### **Page List**

- **Location**: Below the **Search Field** in the **Left Sidebar**
- **Contains**: Hierarchical list of **Page Items**
- **Component**: Part of `Sidebar.tsx`
- **Preferred**: **Page List**

#### **Page Item**

- **Location**: Within the **Page List**
- **Contains**: Page title, Collapse/Expand Page Button (Chevron icon for subpages), New Subpage Button (+ icon on hover), Delete Page Button (Trash icon on hover)
- **Component**: Part of `Sidebar.tsx` (rendered recursively)
- **Preferred**: **Page Item**

#### **Collapse/Expand Page Button**

- **Location**: To the left of a **Page Item** title (if it has subpages)
- **Contains**: `ChevronRight` (collapsed) or `ChevronDown` (expanded) icon
- **Component**: Part of `Sidebar.tsx`
- **Preferred**: **Collapse/Expand Page Button**

#### **New Page Button**

- **Location**: In the **Pages Header**
- **Contains**: `Plus` icon
- **Component**: Part of `Sidebar.tsx`
- **Preferred**: **New Page Button**

#### **Delete Page Button**

- **Location**: Appears on hover over a **Page Item**
- **Contains**: `Trash2` icon
- **Component**: Part of `Sidebar.tsx`
- **Preferred**: **Delete Page Button**

#### **New Subpage Button**

- **Location**: Appears on hover over a **Page Item**
- **Contains**: `Plus` icon
- **Component**: Part of `Sidebar.tsx`
- **Preferred**: **New Subpage Button**

#### **Collapse/Expand Sidebar Button**

- **Location**: Right side of the **Pages Header** (when sidebar is open) or fixed on the left edge (when sidebar is closed)
- **Contains**: `ChevronLeft` (open) or arrow → (closed) icon
- **Component**: Part of `Sidebar.tsx`
- **Preferred**: **Collapse/Expand Sidebar Button**

#### **Clear Search Button**

- **Location**: Right side of the **Search Field**
- **Contains**: `X` icon
- **Component**: Part of `Sidebar.tsx`
- **Preferred**: **Clear Search Button**

### Main Content Area Components

#### **Page Title Field**

- **Location**: Top of the **Main Content Area**, above the editor
- **Contains**: Input field for the current page's title
- **Component**: Part of `App.tsx`
- **Preferred**: **Page Title Field**

#### **BlockNote Editor**

- **Location**: Below the **Page Title Field** in the **Main Content Area**
- **Contains**: Rich text editing interface, slash menu (`/`) with block commands
- **Component**: `BlockNoteEditor.tsx`
- **Preferred**: **BlockNote Editor**

#### **AI Chat UI**

- **Location**: Right side of the **Main Content Area**, collapsible
- **Contains**: Chat input, AI responses, model selection
- **Component**: `ChatUI.tsx`
- **Preferred**: **AI Chat UI**

For more detailed terminology, see `docs/UI-TERMINOLOGY.md`.

## Project Overview

NotesAI is a modern, privacy-first note-taking application that runs entirely in the browser. It combines the power of the BlockNote rich text editor with large language models (LLMs) to provide AI-assisted writing features.

### Key Features

- **Privacy-First**: All AI processing happens locally in your browser
- **Offline Capable**: Works without internet connection after initial model download
- **Modern UI**: Clean, responsive interface with NotesAI branding
- **AI-Powered**: Translation, grammar correction, summarization, and text development
- **Editor Enhancements**:
  - Slash menu item: **Divider** under Basic blocks (beneath Paragraph)
  - Keyboard shortcut: type `---` on an empty paragraph to insert a divider
  - Custom block: `divider` implemented in `src/blocks/DividerBlock.tsx`

### Target Users

- Writers and content creators
- Students and researchers
- Anyone needing AI-assisted writing tools
- Privacy-conscious users

## Tech Stack

### Frontend Framework

- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript for better development experience
- **Vite** - Fast build tool and development server (for UI)

### UI & Styling

- **BlockNote** - Rich text editor based on ProseMirror
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Modern icon library
- **Radix UI** - Accessible component primitives
- **Inline Styles** - Used for complex styling to avoid CSS conflicts

### Backend Framework

- **Next.js 16** - Full-stack React framework with API routes
- **Prisma 6** - Modern ORM for database management
- **SQLite** - Lightweight, serverless database
- **better-sqlite3** - Native SQLite driver for Node.js

### AI & Processing

- **WebLLM** - Browser-based LLM inference with WebGPU acceleration
- **Llama-3.2-1B-Instruct** - Lightweight language model (~1.2GB)
- **Web Workers** - Non-blocking AI processing
- **IndexedDB** - Local model caching

### State Management

- **Zustand** - Lightweight state management
- **React Hooks** - Local component state

### Development Tools

- **Jest** - Unit testing framework
- **React Testing Library** - Component testing utilities
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **PostCSS** - CSS processing

## Project Structure

```
notes-ai/
├── src/                   # Frontend (Vite)
│   ├── components/              # React components
│   │   ├── Header.tsx          # Main header with AI buttons
│   │   ├── Footer.tsx          # Status and performance display
│   │   ├── Sidebar.tsx         # Multi-page sidebar with drag-and-drop
│   │   ├── CustomFormattingToolbar.tsx  # Editor toolbar
│   │   ├── TranslateToolbarButton.tsx   # Translation button
│   │   ├── CorrectToolbarButton.tsx     # Grammar correction button
│   │   ├── DevelopToolbarButton.tsx     # Text development button
│   │   ├── ModelsDropdown.tsx           # Model selection
│   │   ├── Progress.tsx                # Loading indicators
│   │   └── ChatUI.ts                   # Chat interface
│   ├── config/                 # Configuration files
│   │   ├── app-config.ts       # WebLLM app configuration
│   │   ├── models.ts          # Model definitions and metadata
│   │   └── prompt.ts          # AI system prompts
│   ├── hooks/                 # Custom React hooks
│   │   └── useChatStore.ts    # Zustand store for chat state
│   ├── styles/                # CSS stylesheets
│   │   ├── App.css           # Main application styles
│   │   └── index.css         # Global styles with Tailwind
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts          # Shared type definitions
│   ├── utils/                 # Utility functions
│   │   ├── blockManipulation.ts    # Block editor utilities
│   │   ├── correctSingleBlock.ts   # Grammar correction logic
│   │   ├── diffText.ts            # Text diff utilities
│   │   ├── ParserBlockToString.ts # Block parsing utilities
│   │   ├── tokenizer.ts           # Text tokenization
│   │   └── WebLLMFunctions.ts     # WebLLM helper functions
│   ├── App.tsx              # Main application component (Vite)
│   ├── main.tsx             # Vite entry point
│   └── worker.ts           # Web Worker for AI processing
├── pages/                  # Backend (Next.js API Routes)
│   └── api/                # API endpoints
│       ├── pages/           # Pages CRUD operations
│       │   ├── index.ts     # GET all, POST create
│       │   └── [id].ts      # GET, PUT, DELETE by ID
│       ├── images/          # Images CRUD operations
│       │   ├── index.ts    # GET all, POST create
│       │   └── [id].ts      # GET, PUT, DELETE by ID
│       └── settings/        # Settings management
│           └── index.ts     # GET, PUT settings
├── app/                    # Next.js app directory
│   ├── layout.tsx           # Next.js layout
│   ├── page.tsx             # Next.js page (client)
│   └── components/
│       └── NotesAI.tsx      # Next.js version of App
├── lib/                    # Shared utilities
│   └── prisma.ts           # Prisma client singleton
├── prisma/                  # Database schema and migrations
│   ├── schema.prisma        # Database schema definition
│   ├── migrations/          # Database migration files
│   └── notesai.db          # SQLite database file
└── tests/                   # Test files
    ├── src/**/__tests__/    # Frontend unit tests
    └── pages/**/__tests__/  # Backend API tests
```

## Getting Started

### Prerequisites

- **Node.js** >= 20 (Download from [nodejs.org](https://nodejs.org/))
- **npm** (comes with Node.js)
- **Modern Browser** with WebGPU support (Chrome, Edge, Firefox Nightly)
- **Git** for version control

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/numerique-gouv/blocknote-llm.git
   cd blocknote-llm
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup database**

   ```bash
   # Generate Prisma client
   npm run prisma:generate

   # Run database migrations
   npm run prisma:migrate
   ```

4. **Start development servers**

   ```bash
   # Terminal 1: Start Vite frontend
   npm run dev:vite

   # Terminal 2: Start Next.js backend
   npm run dev
   ```

5. **Open in browser**
   - Frontend: `http://localhost:5173/NotesAI/`
   - Backend API: `http://localhost:4000/api/`
   - Wait for the AI model to load (first time takes longer)

### First-Time Setup Issues

**WebGPU Not Supported?**

- Use Chrome or Edge (most reliable)
- Firefox: Enable `dom.webgpu.enabled` in about:config
- Safari: Enable WebGPU experimental feature

**Model Loading Fails?**

- Check browser console for errors
- Ensure sufficient RAM (~2GB free)
- Try refreshing the page

## Development Workflow

### Daily Development

1. **Start the dev server**

   ```bash
   npm run dev
   ```

2. **Make changes** to source files
   - Changes auto-reload in browser
   - Check browser console for errors

3. **Test AI features**
   - Load a model
   - Test translation, correction, summarization
   - Verify UI responsiveness

4. **Commit changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

### Code Quality

**Linting**

```bash
npm run lint
```

**Type Checking**

```bash
npx tsc --noEmit
```

**Build Test**

```bash
npm run build
npm run preview
```

## Key Components

### 1. Demo.tsx (Main App Component)

**Purpose**: Main application component that orchestrates everything

**Key Responsibilities**:

- Initialize WebLLM engine
- Manage AI model loading
- Handle AI operations (translate, correct, summarize, develop)
- Coordinate between editor and AI
- Manage application state

**Important State**:

```typescript
const [isGenerating, setIsGenerating] = useState(false);
const [isFetching, setIsFetching] = useState(false);
const [currentProcess, setCurrentProcess] = useState<
  'translation' | 'correction' | 'summary' | 'develop' | null
>(null);
const [output, setOutput] = useState('');
const [error, setError] = useState('');
```

### 2. Header.tsx

**Purpose**: Top navigation with AI action buttons

**Key Features**:

- NotesAI branding with blue "N" icon
- AI action buttons (Translate, Correct, Summarize, Develop)
- Utility buttons (Clear, Stop, Settings)
- Responsive design with inline styles

**Button States**:

- Disabled when AI is processing
- Hover effects for better UX
- Tooltips for accessibility

### 3. Footer.tsx

**Purpose**: Status display and performance metrics

**Key Features**:

- Loading progress bar
- Status messages (progress, output, errors)
- Performance statistics
- Single-line layout for space efficiency

### 4. Sidebar.tsx

**Purpose**: Multi-page management with drag-and-drop reordering

**Key Features**:

- **Page List**: Hierarchical display of pages (parent/child relationships)
- **Search**: Filter pages by title in real-time
- **Drag & Drop**:
  - Drag between pages to reorder (blue lines indicate drop position)
  - Drag onto a page to make it a subpage (blue border)
  - Visual feedback during drag (opacity, borders, lines)
- **Resizable**: Drag the right edge to adjust width (200px-600px)
- **Quick Actions** (on hover):
  - Create subpage button (+ icon)
  - Delete page button (trash icon)

**State Management**:

```typescript
const [pages, setPages] = useState<Page[]>([]);
const [sidebarWidth, setSidebarWidth] = useState(280);
const [draggedPageId, setDraggedPageId] = useState<string | null>(null);
const [dropPosition, setDropPosition] = useState<
  'top' | 'middle' | 'bottom' | null
>(null);
```

**Usage**:

```typescript
<Sidebar
  ref={sidebarRef}
  isOpen={sidebarOpen}
  onToggle={() => setSidebarOpen(!sidebarOpen)}
  currentPageId={currentPageId}
  onPageSelect={loadPageContent}
  onNewPage={createNewPage}
  onDeletePage={handleDeletePage}
  onNewSubpage={handleCreateSubpage}
  onReorderPages={handleReorderPages}
/>
```

### 5. CustomFormattingToolbar.tsx

**Purpose**: BlockNote editor toolbar with AI integration

**Key Features**:

- Standard editor formatting
- AI action buttons
- Send button for AI processing
- Integration with main editor

## AI Integration

### WebLLM Setup

**Engine Initialization**:

```typescript
const engine = await CreateWebWorkerMLCEngine(
  new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' }),
  'Llama-3.2-1B-Instruct-q4f16_1-MLC',
  { initProgressCallback: initProgressCallback }
);
```

**Model Loading Process**:

1. Check if model exists in IndexedDB cache
2. Download model if not cached
3. Initialize WebGPU adapter
4. Load model weights and metadata
5. Ready for inference

### AI Operations

**Translation**:

- Takes entire document content
- Uses translation prompt from `prompt.ts`
- Creates new editor with translated content

**Grammar Correction**:

- Processes selected text or entire document
- Uses diff highlighting to show changes
- Preserves original formatting

**Summarization**:

- Analyzes document content
- Generates concise summary
- Maintains key information

**Text Development**:

- Takes bullet points or outline
- Expands into full paragraphs
- Maintains logical flow

### Error Handling

**Common Issues**:

- Model loading failures
- WebGPU compatibility
- Memory limitations
- Network timeouts

**Error Recovery**:

- Graceful degradation
- User-friendly error messages
- Retry mechanisms

## Styling & UI

### Current Approach: Inline Styles

**Why Inline Styles?**

- Avoids CSS conflicts between frameworks
- Ensures consistent rendering
- Easier debugging and maintenance
- No build-time CSS processing issues

**Example**:

```typescript
<button
  style={{
    padding: '4px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    // ... more styles
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = '#f3f4f6';
  }}
>
```

### Design System

**Colors**:

- Primary Blue: `#2563eb`
- Gray Text: `#6b7280`
- Error Red: `#dc2626`
- Success Green: `#10b981`
- Background: `#ffffff`

**Typography**:

- Font Family: Inter, system-ui, sans-serif
- Header: 20px, font-weight 600
- Footer: 11px
- Icons: 18px

**Spacing**:

- Header padding: 8px 16px
- Footer padding: 4px 16px
- Button padding: 4px
- Gap between elements: 8px

### Responsive Design

**Breakpoints**:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Responsive Features**:

- Flexible layouts with flexbox
- Text truncation for long content
- Icon-only buttons on small screens
- Horizontal scrolling for overflow

## State Management

### Zustand Store (useChatStore.ts)

**Purpose**: Global state for chat and AI operations

**Key State**:

```typescript
interface ChatState {
  messages: Message[];
  isGenerating: boolean;
  currentModel: string;
  // ... more state
}
```

**Actions**:

- Add messages
- Update generation status
- Handle AI responses
- Manage model selection

### Local Component State

**React Hooks Used**:

- `useState` - Component state
- `useEffect` - Side effects
- `useCallback` - Memoized functions
- `useMemo` - Memoized values

**State Patterns**:

```typescript
const [isLoading, setIsLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);
```

## Testing

### Current Testing Status

- **Unit Tests**: ✅ Implemented (60%+ coverage, goal: 80%+)
  - Frontend components (Header, Footer, Toolbar buttons)
  - Utility functions (tokenizer, diffText, ParserBlockToString)
  - Backend API routes (pages, images)
- **Integration Tests**: ⏳ Planned
- **E2E Tests**: ⏳ Planned with Playwright

### Testing Strategy

**Unit Tests** (Jest + React Testing Library):

- ✅ Component rendering and props
- ✅ User interactions and event handlers
- ✅ State management (Zustand store)
- ✅ Utility functions
- ✅ API route handlers

**Test Coverage**:

- 194 tests passing, 1 skipped
- 25 test suites
- 60%+ code coverage threshold (current target: 80%+)

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- src/components/__tests__/Header.test.tsx

# Run API tests only
npm test -- pages/api/__tests__
```

### Test Structure

```
src/**/__tests__/           # Frontend component tests
pages/**/__tests__/         # Backend API tests
src/utils/__tests__/        # Utility function tests
src/config/__tests__/       # Configuration tests
```

## Backend API

### Architecture

NotesAI uses a **hybrid architecture**:

- **Vite** handles the frontend UI (BlockNote editor and AI features)
- **Next.js** provides the backend API (database operations via Prisma)

### API Endpoints

All API endpoints are available at `http://localhost:4000/api/`

#### Pages API

**GET /api/pages** - Get all pages

```typescript
interface Page {
  id: string;
  title: string;
  content: string; // JSON string of BlockNote blocks
  parentId: string | null;
  order: number;
  isFavorite: boolean;
  tags: string[];
  images: Image[];
  children: Page[];
}
```

**POST /api/pages** - Create new page

```typescript
const response = await fetch('http://localhost:4000/api/pages', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ title, content, parentId, order, isFavorite }),
});
```

**GET /api/pages/[id]** - Get single page
**PUT /api/pages/[id]** - Update page
**DELETE /api/pages/[id]** - Delete page

#### Images API

**GET /api/images** - Get all images
**POST /api/images** - Upload new image
**GET /api/images/[id]** - Get single image
**PUT /api/images/[id]** - Update image
**DELETE /api/images/[id]** - Delete image

#### Settings API

**GET /api/settings** - Get application settings
**PUT /api/settings** - Update settings

### Database Schema

The database uses SQLite with the following models:

- **Page**: Notes with hierarchical relationships
- **Image**: Images attached to pages
- **Settings**: Application configuration (AI engine, LM Studio settings)

See `prisma/schema.prisma` for complete schema definitions.

### Database Operations

**Prisma Client**:

```typescript
import { prisma } from '../../../lib/prisma';

// Get all pages
const pages = await prisma.page.findMany();

// Create page
const page = await prisma.page.create({
  data: { title, content, parentId, order, isFavorite },
});
```

**Migrations**:

```bash
# Create new migration
npm run prisma:migrate

# Generate Prisma client
npm run prisma:generate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

### API Testing

Unit tests for API routes are located in `pages/api/__tests__/`:

```bash
# Run all tests
npm test

# Run only API tests
npm test -- pages/api/__tests__
```

See [API Documentation](./api.md) for complete API specifications.

## Troubleshooting

### Common Issues

**1. Tailwind CSS Not Working**

- **Symptom**: Styles not applying
- **Solution**: Use inline styles (current approach)
- **Prevention**: Avoid mixing CSS frameworks

**2. WebLLM Errors**

- **Symptom**: `adapter.requestAdapterInfo is not a function`
- **Solution**: Update to latest WebLLM version
- **Check**: Browser WebGPU support

**3. Model Loading Fails**

- **Symptom**: Model never loads
- **Solution**: Check RAM availability, browser compatibility
- **Debug**: Check browser console for errors

**4. Build Errors**

- **Symptom**: `Cannot apply unknown utility class`
- **Solution**: Remove problematic CSS classes
- **Prevention**: Use inline styles for complex styling

### Debugging Tips

**Browser DevTools**:

- Console for errors and logs
- Network tab for model downloads
- Performance tab for memory usage
- Application tab for IndexedDB

**React DevTools**:

- Component tree inspection
- State and props debugging
- Performance profiling

**Vite DevTools**:

- Hot module replacement status
- Build errors and warnings
- Dependency analysis

## Contributing Guidelines

### Code Style

**TypeScript**:

- Use strict type checking
- Define interfaces for props and state
- Avoid `any` type
- Use meaningful variable names

**React**:

- Use functional components with hooks
- Extract reusable components
- Use proper prop types
- Follow React best practices

**File Organization**:

- One component per file
- Group related utilities
- Use descriptive file names
- Keep components small and focused

### Git Workflow

**Branch Naming**:

- `feature/description` - New features
- `fix/description` - Bug fixes
- `docs/description` - Documentation
- `refactor/description` - Code refactoring

**Commit Messages**:

- Use semantic commit format
- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `test:` - Adding tests
- `chore:` - Maintenance tasks

**Pull Request Process**:

1. Create feature branch
2. Make changes with tests
3. Update documentation
4. Create pull request
5. Code review
6. Merge to main

### Performance Guidelines

**React Performance**:

- Use `useMemo` for expensive calculations
- Use `useCallback` for event handlers
- Avoid unnecessary re-renders
- Optimize component updates

**AI Performance**:

- Cache model in IndexedDB
- Use Web Workers for processing
- Implement progress indicators
- Handle errors gracefully

**Bundle Size**:

- Tree-shake unused code
- Lazy load components
- Optimize images and assets
- Monitor bundle size

### Security Considerations

**Client-Side Security**:

- No sensitive data in client code
- Validate user inputs
- Sanitize AI outputs
- Use HTTPS in production

**AI Safety**:

- Filter inappropriate content
- Limit AI response length
- Implement rate limiting
- Monitor for abuse

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev:vite     # Start Vite frontend (port 5173)
npm run dev          # Start Next.js backend (port 4000)

# Database
npm run prisma:generate  # Generate Prisma client
npm run prisma:migrate   # Run database migrations
npm run prisma:studio    # Open database GUI

# Testing
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Generate coverage report

# Build & Lint
npm run build        # Build for production
npm run build:vite    # Build Vite frontend
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

### Key Files

**Frontend (Vite)**:

- `src/App.tsx` - Main app component
- `src/components/Header.tsx` - Header with AI buttons
- `src/components/Footer.tsx` - Status display
- `src/config/prompt.ts` - AI system prompts
- `src/utils/WebLLMFunctions.ts` - AI helper functions

**Backend (Next.js)**:

- `pages/api/pages/` - Pages API routes
- `pages/api/images/` - Images API routes
- `pages/api/settings/` - Settings API routes
- `lib/prisma.ts` - Prisma client singleton
- `prisma/schema.prisma` - Database schema

### Important URLs

- Frontend: `http://localhost:5173/NotesAI/`
- Backend API: `http://localhost:4000/api/`
- Prisma Studio: `http://localhost:5555` (after `npm run prisma:studio`)
- WebGPU Test: `https://webgpureport.org/`

---

This guide should help you understand and contribute to the NotesAI project. For additional help, check the [main README](../README.md) or create an issue in the repository.
