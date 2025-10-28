<div align="center">

# NotesAI

[![CI/CD Pipeline](https://github.com/dwelsh1/notes-ai/workflows/CI/CD%20Pipeline/badge.svg)](https://github.com/dwelsh1/notes-ai/actions)
[![Test Coverage](https://img.shields.io/badge/coverage-95%25-brightgreen.svg)](https://github.com/dwelsh1/notes-ai)
[![Code Quality](https://img.shields.io/badge/code%20style-prettier-ff69b4.svg)](https://prettier.io/)
[![ESLint](https://img.shields.io/badge/linted%20by-eslint-blue.svg)](https://eslint.org/)

</div>

## 🚀 Tech Stack

![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.2.0-646CFF?logo=vite&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-16.0.0-000000?logo=next.js&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6.18.0-2D3748?logo=prisma&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-12.4.1-003B57?logo=sqlite&logoColor=white)
![BlockNote](https://img.shields.io/badge/BlockNote-0.12.4-000000?logo=blocknote&logoColor=white)
![WebLLM](https://img.shields.io/badge/WebLLM-0.2.35-FF6B6B?logo=webllm&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-4.5.2-FF6B6B?logo=zustand&logoColor=white)
![Jest](https://img.shields.io/badge/Jest-30.2.0-C21325?logo=jest&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-8.57.0-4B32C3?logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-3.6.2-F7B93E?logo=prettier&logoColor=white)

## Overview

A modern AI-powered note-taking application built with BlockNote editor and LLM running entirely in the browser

- Fully private = No data ever leaves your computer
- Runs in the browser = No server needed and no install needed!
- Works offline
- Easy-to-use interface

This tool is built on top of [WebLLM](https://github.com/mlc-ai/web-llm), a package that brings language model inference directly onto web browsers with hardware acceleration.

## System Requirements

To run this, you need a modern browser with support for WebGPU. According to [caniuse](https://caniuse.com/?search=WebGPU), WebGPU is supported on:

- Google Chrome
- Microsoft Edge
- All Chronium-based browsers

It's also available in Firefox Nightly, but it needs to be enabled manually through the dom.webgpu.enabled flag. Safari on MacOS also has experimental support for WebGPU which can be enabled through the WebGPU experimental feature.

In addition to WebGPU support, you need to have enough available RAM on your device to run the model (~2GB for the 1B parameter model).

You can check if your browser or your device support WebGPU by visiting [webgpureport](https://webgpureport.org/).

## Supported Models

We use [Llama-3.2-1B-Instruct-q4f16_1-MLC](https://huggingface.co/meta-llama/Meta-Llama-3.2-1B-Instruct), a lightweight 1B parameter language model. This model was developed by Meta and optimized for browser deployment, taking up approximately 1.2 GB of storage in the browser's cache.

The application supports multiple AI-powered features:

- **Translation**: Translate entire documents between languages
- **Grammar Correction**: Fix spelling and grammar errors with diff highlighting
- **Summarization**: Generate concise summaries of long texts
- **Text Development**: Expand bullet points into full paragraphs
 - **Divider**: Insert a horizontal rule via the slash menu (Divider under Basic blocks) or by typing `---` on an empty paragraph

You can also use other models. To do that, you can compile your own model and weights with [MLC LLM](https://github.com/mlc-ai/mlc-llm). Then you just need to update [app-config](./src/config/app-config.ts) with:

- The URL to model artifacts, such as weights and meta-data
- The URL to web assembly library (i.e. wasm file) that contains the executables to accelerate the model computations
- The name of the model

You also need to change the custom prompt added before the user's text in the [prompt](./src/config/prompt.ts) file.

If you need further information, you can check the [MLC LLM documentation](https://llm.mlc.ai/docs/deploy/javascript.html) on how to add new model weights and libraries to WebLLM.

**Disclaimer**: We use the chat version of Llama-3.2, specifically fine-tuned for chat interactions rather than our specific use cases. Hence, you may encounter some limitations or inaccuracies in the response. Additionally, as with any LLM, it's possible to encounter hallucinations or inaccuracies in generated text.

## Try it out

You can run the project locally and contribute to improve the interface, speed up initial model loading time and fix bugs, by following these steps:

### Prerequisite

- NodeJS >= 20 - https://nodejs.org/
- NPM

### Setup & Run The Project

If you're looking to make changes, run the development environment with live reload:

```sh
# Clone the repository
git clone https://github.com/dwelsh1/notes-ai.git

# Enter the project folder
cd ./notes-ai

# Install dependencies
npm install

# Start the project for development
npm run dev
```

### Building the project for production

To compile the React code yourself, run:

```sh
# Compile and minify the project for publishing, outputs to `dist/`
npm run build

# Build the project for publishing and preview it locally. Do not use this as a production server as it's not designed for it
npm run preview
```

This repository has a workflow that automatically deploys the site to GitHub Pages whenever the main branch is modified

## Project Structure

The project has been restructured for better maintainability and follows React best practices:

```
src/
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
├── components/          # React components
│   ├── Header.tsx      # Modern header with AI buttons
│   ├── Footer.tsx      # Status and performance display
│   ├── Progress.tsx    # Progress bar component
│   └── ...             # Other UI components
├── config/             # Configuration files
│   ├── app-config.ts   # WebLLM configuration
│   ├── models.ts      # Model definitions
│   └── prompt.ts      # AI system prompts
├── utils/              # Utility functions
│   ├── WebLLMFunctions.ts    # AI helper functions
│   ├── blockManipulation.ts  # Editor manipulation utilities
│   ├── diffText.ts           # Text comparison utilities
│   └── ...                   # Other utilities
├── hooks/              # Custom React hooks
│   └── useChatStore.ts # Zustand state management
├── styles/             # CSS stylesheets
└── types/              # TypeScript type definitions
```

## Development & Testing

The project includes comprehensive testing setup:

### Testing Framework

- **Jest**: JavaScript testing framework
- **React Testing Library**: Component testing utilities
- **95%+ Test Coverage**: Comprehensive test coverage requirements

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run unit tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage report
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Code Quality

- **ESLint**: Code linting with TypeScript support
- **Prettier**: Code formatting for consistency
- **TypeScript**: Strict type checking
- **Inline Styles**: Avoiding CSS framework conflicts

## Recent Updates

- **v0.3.0**: Comprehensive testing infrastructure and code quality improvements
- **v0.2.0**: Complete UI modernization with NotesAI branding
- **v0.1.0**: Initial release with BlockNoteLLM functionality
- Full repository restructuring for better organization
- Complete translation from French to English
- Modern responsive design implementation
- Professional component naming (`Demo.tsx` → `App.tsx`)
- Jest + React Testing Library integration
- ESLint + Prettier code quality tools
- 95%+ test coverage requirements

See [CHANGELOG.md](./CHANGELOG.md) for detailed version history.

## Documentation

- [Project Restructuring Guide](./docs/RESTRUCTURE.md)
- [Changelog](./CHANGELOG.md)

## License

This work is released under the MIT License (see [LICENSE](./LICENSE)).
