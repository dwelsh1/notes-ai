# Week 1-2: Next.js Migration - Detailed Checklist

## Goal

Original plan: migrate from Vite to Next.js app directory.

Decision for Week 1–2: maintain Vite UI and add a Next.js pages API (hybrid). The hybrid setup is complete; the full Next.js app‑dir migration remains deferred for later consideration. This checklist is updated to reflect what was completed for the hybrid approach and what stays deferred.

## Current Status

- ✅ Hybrid architecture in place (Vite frontend + Next.js pages API backend)
- ✅ Week 1–2 objectives completed for the hybrid setup
- 🟡 Full Next.js app‑dir migration deferred (not in current scope)

---

## Task 1: Install Dependencies (completed)

### Steps

- [x] Install Next.js and React 18.2.0
- [x] Install Prisma and related packages
- [x] Install SQLite packages
- [x] Install Tailwind CSS
- [x] Install Drag & Drop packages
- [x] Verify installations don't break existing setup

### Commands

```bash
npm install next@latest react@18.2.0 react-dom@18.2.0 prisma @prisma/client zod
npm install better-sqlite3 @types/better-sqlite3
npm install tailwindcss postcss autoprefixer
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## Task 2: Project Structure Migration (deferred)

Note: app‑dir migration is intentionally deferred; minimal `app/` scaffolding exists, but full component moves are not part of Week 1–2.

### Steps

- [ ] Create `app/` directory structure
- [ ] Create `app/components/` directory
- [ ] Create `app/api/` directory
- [ ] Create `app/layout.tsx`
- [ ] Move components from `src/components/` to `app/components/`
- [ ] Update all import paths

### Files to Create/Move

- [ ] `app/layout.tsx` - Root layout
- [ ] `app/page.tsx` - Main page component
- [ ] `app/components/Header.tsx`
- [ ] `app/components/Footer.tsx`
- [ ] `app/components/Progress.tsx`
- [ ] `app/components/CustomFormattingToolbar.tsx`
- [ ] All other components

---

## Task 3: Build System Migration (deferred)

### Steps

- [ ] Create `next.config.js`
- [ ] Create `tailwind.config.js`
- [ ] Create `postcss.config.js`
- [ ] Update `package.json` scripts
- [ ] Update TypeScript configuration

### Configuration Files

- [ ] `next.config.js` - Next.js configuration
- [ ] `tailwind.config.js` - Tailwind configuration
- [ ] `postcss.config.js` - PostCSS configuration
- [ ] Update `tsconfig.json` for Next.js

---

## Task 4: Update Package.json Scripts (deferred)

### New Scripts

- [ ] `dev:next` - Start Next.js dev server (port 4000)
- [ ] `build:next` - Build Next.js app
- [ ] `start:next` - Start Next.js production server
- [ ] Keep existing scripts for Vite (temporarily)

---

## Task 5: Preserve Existing Features (completed for hybrid)

### BlockNote Editor

- [x] Import BlockNote components correctly
- [x] Test editor rendering
- [x] Test all block types work

### WebLLM AI

- [x] Test AI engine initialization
- [x] Test all AI features
- [x] Verify WebLLM works in hybrid (Web Worker + Vite UI)

### Components

- [x] Verify Header component works
- [x] Verify Footer behavior works (hidden when idle)
- [x] Verify all toolbar buttons work
- [x] Test responsive design

---

## Task 6: Update Tests for Next.js (deferred)

### Steps

- [ ] Update Jest configuration for Next.js
- [ ] Update test imports
- [ ] Migrate existing tests
- [ ] Run tests to verify nothing broke

### Test Configuration

- [ ] Update `jest.config.js` for Next.js
- [ ] Configure `@testing-library/next` if needed
- [ ] Verify all tests still pass after migration (deferred)

---

## Verification Checklist (for future migration)

### Before Starting

- [x] All tests passing (current suite passing; coverage thresholds enforced)

### After Migration

- [ ] All tests still passing
- [ ] App runs on localhost:4000
- [ ] BlockNote editor works
- [ ] WebLLM AI works
- [ ] All existing features functional
- [ ] Responsive design maintained
- [ ] No console errors

---

## Rollback Plan (if migration resumed later)

If anything breaks:

1. Keep Vite setup as backup
2. Can revert to Vite at any time
3. Commit frequently for easy rollback

---

## Success Criteria

- ✅ Hybrid app running (Vite UI on localhost:5173, Next.js API on localhost:4000)
- ✅ All existing features work (Dashboard, Breadcrumbs, Sidebar, Toolbar, AI)
- ✅ All tests passing with coverage threshold
- ✅ No regressions
- 🟡 Full Next.js app‑dir migration remains a future task
