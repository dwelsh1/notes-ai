# NotesAI Documentation

Welcome to the NotesAI documentation. This directory contains additional documentation for the project.

## Available Documentation

- **[DEVELOPER.md](./DEVELOPER.md)** - Comprehensive developer guide for contributing to NotesAI
- **[RESTRUCTURE.md](./RESTRUCTURE.md)** - Detailed guide about the project restructuring process
- **[../CHANGELOG.md](../CHANGELOG.md)** - Complete version history and changes
- **[../README.md](../README.md)** - Main project documentation

## Project Overview

NotesAI is a modern AI-powered note-taking application that runs entirely in the browser. It combines the power of the BlockNote rich text editor with large language models (LLMs) to provide AI-assisted writing features.

### Key Features

- **Privacy-First**: All AI processing happens locally in your browser
- **Offline Capable**: Works without internet connection after initial model download
- **Modern UI**: Clean, responsive interface with NotesAI branding
- **AI-Powered**: Translation, grammar correction, summarization, and text development

### Technical Stack

- **Frontend**: React 18 + TypeScript
- **Editor**: BlockNote (ProseMirror-based)
- **AI**: WebLLM with Llama-3.2-1B-Instruct model
- **Styling**: Inline styles (avoiding CSS framework conflicts)
- **Build**: Vite
- **Testing**: Jest + React Testing Library (95%+ coverage)
- **Code Quality**: ESLint + Prettier
- **State Management**: Zustand

## Development

For development setup and contribution guidelines, see the main [README.md](../README.md).

### Testing & Code Quality

The project includes comprehensive testing and code quality tools:

- **Unit Tests**: Jest + React Testing Library with 95%+ coverage requirements
- **Code Formatting**: Prettier for consistent code style
- **Linting**: ESLint with TypeScript and React rules
- **Component Testing**: Full test coverage for all utility functions and components
- **Professional Structure**: Follows React best practices with proper naming conventions

### Recent Improvements

- **v0.3.0**: Complete testing infrastructure setup
- **Component Renaming**: `Demo.tsx` → `App.tsx` for better clarity
- **Code Quality**: ESLint + Prettier integration
- **Test Coverage**: Comprehensive unit tests for all utilities and components

## Support

If you encounter any issues or have questions, please check the changelog for recent fixes or create an issue in the project repository.
