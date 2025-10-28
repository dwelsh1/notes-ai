## [Unreleased]

## [v0.1.1] - 2025-10-28

### Added

- Editor: Slash menu item "Divider" under Basic blocks (beneath Paragraph)
- Editor: Keyboard shortcut `---` on an empty paragraph inserts a divider and moves the caret below
- Custom block: `divider` implemented and registered in editor schema

# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [v0.1.0] - 2025-10-27

This release consolidates all prior work into a single baseline after resetting the repository history. It includes everything previously shipped plus recent UI/UX, testing, CI, and documentation updates.

### Added

- Full NotesAI UI: `Header`, `Sidebar`, `Dashboard`, `Footer`, and BlockNote editor integration
- AI features: translation, grammar correction, summarization, and text development via WebLLM (Llama-3.2-1B-Instruct)
- Database and API: Prisma + SQLite with Next.js routes — `/api/pages`, `/api/images`, `/api/settings`, `/api/search` (FTS5)
- Comprehensive testing setup: Jest + React Testing Library; extensive unit tests across components, utils, and API routes
- GitHub Actions CI: Node 20, type-check (`tsc --noEmit`), lint, tests with coverage enforcement, and Next.js + Vite build checks
- Codecov integration and dynamic coverage badge in `README.md`
- `Dashboard` view with statistics and recent pages

### Changed

- Breadcrumbs in `Header` now include the current page; each breadcrumb item is clickable for navigation
- `Dashboard` Recent Pages tightened: removed helper subtitle, single-line layout (icon, title, updated, Open), reduced row spacing
- Hybrid styling clarified: inline styles in components; Tailwind for global layout and containers
- Coverage thresholds updated and enforced in `jest.config.js`:
  - Statements ≥ 85%, Branches ≥ 80%, Functions ≥ 85%, Lines ≥ 85%
- Documentation updated (`docs/DEVELOPER.md`, `docs/UI-TERMINOLOGY.md`) and `README` now uses a Codecov badge

### Fixed

- `TranslateToolbarButton`: correctly handles multiple selected blocks using `Promise.all`
- `DevelopToolbarButton`: corrected BlockNote import paths and stabilized tests to avoid re-render loops
- `Header` tests: fixed Fragment usage/key warnings
- Search API tests: aligned mocks with `prisma.$queryRaw`
- `Sidebar` tests: added `dataTransfer` mocks for DnD, improved resize/collapse/search tests, and proper `act` handling
- `Dashboard` tests: stabilized ordering/selection and wrapped async state updates in `act`

### Notes

- Current coverage at release time: ~91% statements (meeting thresholds above)
- Repository history has been reset; older tags/releases will not be carried forward in the new history
