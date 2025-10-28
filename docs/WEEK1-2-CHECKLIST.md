# Week 1-2: Next.js Migration - Detailed Checklist

## Goal
Migrate from Vite to Next.js while preserving all existing functionality.

## Current Status
- ✅ All tests passing (148 passed, 5 skipped)
- ✅ Current Vite app functional
- 🟡 Starting Next.js migration

---

## Task 1: Install Dependencies

### Steps
- [ ] Install Next.js and React 18.2.0
- [ ] Install Prisma and related packages
- [ ] Install SQLite packages
- [ ] Install Tailwind CSS
- [ ] Install Drag & Drop packages
- [ ] Verify installations don't break existing setup

### Commands
```bash
npm install next@latest react@18.2.0 react-dom@18.2.0 prisma @prisma/client zod
npm install better-sqlite3 @types/better-sqlite3
npm install tailwindcss postcss autoprefixer
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

---

## Task 2: Project Structure Migration

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

## Task 3: Build System Migration

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

## Task 4: Update Package.json Scripts

### New Scripts
- [ ] `dev:next` - Start Next.js dev server (port 4000)
- [ ] `build:next` - Build Next.js app
- [ ] `start:next` - Start Next.js production server
- [ ] Keep existing scripts for Vite (temporarily)

---

## Task 5: Preserve Existing Features

### BlockNote Editor
- [ ] Import BlockNote components correctly
- [ ] Test editor rendering
- [ ] Test all block types work

### WebLLM AI
- [ ] Test AI engine initialization
- [ ] Test all AI features
- [ ] Verify WebLLM works in Next.js

### Components
- [ ] Verify Header component works
- [ ] Verify Footer component works
- [ ] Verify all toolbar buttons work
- [ ] Test responsive design

---

## Task 6: Update Tests for Next.js

### Steps
- [ ] Update Jest configuration for Next.js
- [ ] Update test imports
- [ ] Migrate existing tests
- [ ] Run tests to verify nothing broke

### Test Configuration
- [ ] Update `jest.config.js` for Next.js
- [ ] Configure `@testing-library/next` if needed
- [ ] Verify all 148 tests still pass

---

## Verification Checklist

### Before Starting
- [x] All tests passing (148 passed, 5 skipped)

### After Migration
- [ ] All tests still passing
- [ ] App runs on localhost:4000
- [ ] BlockNote editor works
- [ ] WebLLM AI works
- [ ] All existing features functional
- [ ] Responsive design maintained
- [ ] No console errors

---

## Rollback Plan

If anything breaks:
1. Keep Vite setup as backup
2. Can revert to Vite at any time
3. Commit frequently for easy rollback

---

## Success Criteria

- ✅ Next.js app running on localhost:4000
- ✅ All existing features work
- ✅ All tests passing
- ✅ No regressions
- ✅ Ready for Week 3 (Database setup)

