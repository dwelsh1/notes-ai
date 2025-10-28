# BlockNoteLLM - Restructured

This is the restructured version of BlockNoteLLM with improved organization and maintainability.

## 📁 Project Structure

```
blocknote-llm/
├── src/                          # Source code directory
│   ├── components/              # React components
│   │   ├── ChatUI.ts           # Chat interface component
│   │   ├── CorrectToolbarButton.tsx    # Grammar correction button
│   │   ├── CustomFormattingToolbar.tsx # Main toolbar component
│   │   ├── DevelopToolbarButton.tsx    # Text development button
│   │   ├── ModelsDropdown.tsx          # Model selection dropdown
│   │   ├── Progress.tsx                # Progress indicator
│   │   └── TranslateToolbarButton.tsx  # Translation button
│   ├── config/                 # Configuration files
│   │   ├── app-config.ts       # WebLLM app configuration
│   │   ├── models.ts          # Model definitions and metadata
│   │   └── prompt.ts          # System prompts for AI tasks
│   ├── hooks/                 # Custom React hooks
│   │   └── useChatStore.ts    # Zustand store for chat state
│   ├── styles/                # CSS stylesheets
│   │   ├── App.css           # Main application styles
│   │   └── index.css         # Global styles
│   ├── types/                 # TypeScript type definitions
│   │   └── index.ts          # Shared type definitions
│   ├── utils/                 # Utility functions
│   │   ├── blockManipulation.ts    # Block editor utilities
│   │   ├── correctSingleBlock.ts   # Grammar correction logic
│   │   ├── diffText.ts            # Text diff utilities
│   │   ├── ParserBlockToString.ts # Block parsing utilities
│   │   ├── tokenizer.ts           # Text tokenization
│   │   └── WebLLMFunctions.ts     # WebLLM helper functions
│   ├── Demo.tsx              # Main application component
│   ├── main.tsx             # Application entry point
│   └── worker.ts           # Web Worker for AI processing
├── public/                  # Static assets
│   ├── dinum.ico           # Favicon
│   ├── react.svg           # React logo
│   ├── special_tokens_map.json  # Tokenizer configuration
│   ├── tokenizer_config.json     # Tokenizer config
│   ├── tokenizer.json           # Tokenizer data
│   └── vite.svg            # Vite logo
├── scripts/                 # Build and utility scripts
│   ├── Pipeline-CroissantLLM.py  # CroissantLLM pipeline
│   └── Pipeline-llamaLLM.py      # LlamaLLM pipeline
├── dist/                    # Build output (generated)
├── node_modules/           # Dependencies (generated)
├── package.json            # Project configuration
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite build configuration
├── gh-pages.yml           # GitHub Pages deployment
└── README.md              # Project documentation
```

## 🚀 Key Improvements

### 1. **Organized Directory Structure**

- **`src/`** - All source code in one place
- **`src/components/`** - React components separated by functionality
- **`src/utils/`** - Utility functions grouped together
- **`src/config/`** - Configuration files centralized
- **`src/styles/`** - CSS files organized
- **`src/types/`** - TypeScript definitions
- **`src/hooks/`** - Custom React hooks

### 2. **Better Maintainability**

- Clear separation of concerns
- Easy to find and modify specific functionality
- Scalable structure for future development
- Follows React best practices

### 3. **Improved Developer Experience**

- Intuitive file organization
- Clear import paths
- Better code discovery
- Easier debugging and testing

## 🔧 Development

### Prerequisites

- Node.js >= 20
- npm

### Setup

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### File Organization Guidelines

- **Components**: Place reusable UI components in `src/components/`
- **Utilities**: Put helper functions in `src/utils/`
- **Configuration**: Store config files in `src/config/`
- **Styles**: Keep CSS files in `src/styles/`
- **Types**: Define TypeScript interfaces in `src/types/`
- **Hooks**: Create custom hooks in `src/hooks/`

## 📝 Migration Notes

This restructure maintains full backward compatibility while improving organization:

- All import paths have been updated
- Build process remains unchanged
- Functionality is preserved
- Performance is maintained

The restructured codebase is now ready for:

- Team collaboration
- Feature expansion
- Code maintenance
- Testing implementation
