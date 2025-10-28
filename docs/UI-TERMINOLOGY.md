# NotesAI UI Terminology

This document establishes consistent naming for all UI areas and components in the NotesAI application to ensure clear communication between developers, users, and in documentation.

## Layout Areas

### 1. **Top Toolbar** (Main Header)

- **Location**: Top of the application, full width
- **Contains**: NotesAI logo, AI action buttons (Translate, Correct, Summarize, Develop), Clear button, Stop button
- **Component**: `Header.tsx`
- **Also known as**: Top header, main header, toolbar
- **Preferred**: **Top Toolbar**

### 2. **Left Sidebar** (Pages Panel)

- **Location**: Left side of the application, collapsible
- **Contains**: Pages header, search field, page list
- **Component**: `Sidebar.tsx`
- **Also known as**: Sidebar, pages sidebar, navigation panel
- **Preferred**: **Left Sidebar**

### 3. **Main Content Area** (Editor Area)

- **Location**: Center/right of the application
- **Contains**: Page title field, BlockNote editor
- **Component**: `App.tsx` (content area)
- **Also known as**: Editor area, content area, main area
- **Preferred**: **Main Content Area**

### 4. **Footer** (Status Bar)

- **Location**: Bottom of the application
- **Contains**: Loading progress, model status, runtime stats
- **Component**: `Footer.tsx`
- **Also known as**: Status bar, bottom bar
- **Preferred**: **Footer**

## Left Sidebar Components

### 5. **Pages Header** (Sidebar Header)

- **Location**: Top of the Left Sidebar
- **Contains**: "Pages" label, New Page button (+), Collapse button (◀)
- **Component**: Part of `Sidebar.tsx`
- **Also known as**: Sidebar header, pages title
- **Preferred**: **Pages Header**

### 6. **Search Field** (Search Input)

- **Location**: Below Pages Header in Left Sidebar
- **Contains**: Search input box with clear button (X)
- **Component**: Part of `Sidebar.tsx`
- **Also known as**: Search box, search input, search bar
- **Preferred**: **Search Field**

### 7. **Page List** (Pages List)

- **Location**: Below Search Field in Left Sidebar
- **Contains**: Hierarchical list of all pages, collapsible folders
- **Component**: Part of `Sidebar.tsx`
- **Also known as**: Pages list, page tree, navigation list
- **Preferred**: **Page List**

## Page List Items

### 8. **Page Item** (Individual Page)

- **Location**: Within Page List
- **Contains**: Page title, collapse/expand icon for subpages, delete button on hover, drag handle
- **Component**: `renderPageItem` function in `Sidebar.tsx`
- **Also known as**: Page row, page entry, page node
- **Preferred**: **Page Item**

### 9. **Collapse Button** (Expand/Collapse Icon)

- **Location**: Next to Page Item title
- **Contains**: ChevronRight (▶) when collapsed, ChevronDown (▼) when expanded
- **Purpose**: Show/hide subpages
- **Also known as**: Expand button, fold button, toggle button
- **Preferred**: **Collapse Button**

### 10. **Delete Button** (Trash Icon)

- **Location**: Right side of Page Item, visible on hover
- **Contains**: Trash2 icon
- **Purpose**: Delete the page
- **Also known as**: Trash button, remove button, delete icon
- **Preferred**: **Delete Button**

### 11. **Subpage** (Child Page)

- **Location**: Indented under a parent page in Page List
- **Contains**: Same as Page Item but indented
- **Purpose**: Hierarchical organization
- **Also known as**: Child page, nested page, sub-page
- **Preferred**: **Subpage**

## Main Content Area Components

### 12. **Page Title Field** (Title Input)

- **Location**: Top of Main Content Area
- **Contains**: Input field for page title, synchronized with sidebar
- **Component**: Part of `App.tsx`
- **Also known as**: Title input, page title, title field
- **Preferred**: **Page Title Field**

### 13. **Editor** (BlockNote Editor)

- **Location**: Below Page Title Field in Main Content Area
- **Contains**: Rich text editor with formatting toolbar
- **Component**: `BlockNoteView` from `@blocknote/react`
- **Also known as**: Text editor, content editor, block editor
- **Preferred**: **Editor**

### 14. **Formatting Toolbar** (Toolbar)

- **Location**: Floating above selected text in Editor
- **Contains**: Bold, italic, underline, etc. formatting buttons
- **Component**: `CustomFormattingToolbar.tsx`
- **Also known as**: Text toolbar, formatting bar
- **Preferred**: **Formatting Toolbar**

## Top Toolbar Buttons

### 15. **Translate Button**

- **Location**: Top Toolbar
- **Purpose**: Translate selected text or entire document
- **Also known as**: Translation button, translate icon
- **Preferred**: **Translate Button**

### 16. **Correct Button** (Grammar Check)

- **Location**: Top Toolbar
- **Purpose**: Grammar and spell-check selected text or entire document
- **Also known as**: Correct icon, fix button
- **Preferred**: **Correct Button**

### 17. **Summarize Button**

- **Location**: Top Toolbar
- **Purpose**: Generate summary of selected text or entire document
- **Also known as**: Summary button, summarize icon
- **Preferred**: **Summarize Button**

### 18. **Develop Button**

- **Location**: Top Toolbar
- **Purpose**: Expand and develop selected text or entire document
- **Also known as**: Expand button, develop icon
- **Preferred**: **Develop Button**

### 19. **Clear Button** (Clear Content)

- **Location**: Top Toolbar
- **Purpose**: Clear editor content
- **Also known as**: Clear icon, erase button
- **Preferred**: **Clear Button**

### 20. **Stop Button**

- **Location**: Top Toolbar
- **Purpose**: Stop ongoing AI operation
- **Also known as**: Cancel button, stop icon
- **Preferred**: **Stop Button**

## Sidebar Controls

### 21. **New Page Button** (+ Button)

- **Location**: Pages Header, right side
- **Purpose**: Create a new page
- **Also known as**: Plus button, add page button, new page icon
- **Preferred**: **New Page Button**

### 22. **Collapse Sidebar Button** (◀ Button)

- **Location**: Pages Header, right side
- **Purpose**: Collapse/hide the entire Left Sidebar
- **Also known as**: Sidebar toggle, collapse button, hide sidebar
- **Preferred**: **Collapse Sidebar Button**

### 23. **Expand Sidebar Button** (▶ Button)

- **Location**: Right edge of collapsed sidebar
- **Purpose**: Expand/show the Left Sidebar
- **Also known as**: Show sidebar, expand button
- **Preferred**: **Expand Sidebar Button**

## Footer Components

### 24. **Progress Bar**

- **Location**: Footer, left side
- **Purpose**: Show model loading progress
- **Also known as**: Loading bar, progress indicator
- **Preferred**: **Progress Bar**

### 25. **Status Text**

- **Location**: Footer, center
- **Purpose**: Display current model status (Loaded, Not loaded, etc.)
- **Also known as**: Status indicator, status message
- **Preferred**: **Status Text**

### 26. **Runtime Stats**

- **Location**: Footer, right side
- **Purpose**: Display AI processing statistics
- **Also known as**: Stats, runtime info
- **Preferred**: **Runtime Stats**

## Summary

Use this terminology consistently in:

- Bug reports
- Feature requests
- Documentation
- Code comments
- User guides
- Communication

### Quick Reference

| Current Term  | Preferred Term     |
| ------------- | ------------------ |
| Search box    | Search Field       |
| Pages section | Left Sidebar       |
| Main header   | Top Toolbar        |
| Right header  | Pages Header       |
| Editor area   | Main Content Area  |
| Content area  | Main Content Area  |
| Title input   | Page Title Field   |
| Toolbar       | Formatting Toolbar |
| Sidebar       | Left Sidebar       |
