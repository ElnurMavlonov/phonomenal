# Project Structure

## Directory Overview

```
phonomenal/
├── docs/                    # Documentation
│   ├── README.md           # Documentation index
│   ├── TECHNICAL_REPORT.md # Complete technical documentation
│   ├── ARCHITECTURE.md     # System design and architecture
│   └── API_REFERENCE.md    # API documentation
│
├── src/                     # Source code
│   ├── components/         # React components
│   │   ├── LoginScreen.tsx/css
│   │   ├── MainMenu.tsx/css
│   │   ├── PracticeMode.tsx/css
│   │   ├── TestMode.tsx/css
│   │   ├── WordPractice.tsx/css
│   │   ├── PhonemeGroupList.tsx/css
│   │   └── SpeechRecognitionWarning.tsx/css
│   │
│   ├── data/              # Static data
│   │   ├── phonemes.ts    # Phoneme groups and definitions
│   │   └── words.ts       # Word database with IPA mappings
│   │
│   ├── utils/             # Utility functions
│   │   └── audio.ts       # Audio recording and speech recognition
│   │
│   ├── types.ts           # TypeScript type definitions
│   ├── App.tsx            # Root component
│   ├── App.css            # Root styles
│   ├── main.tsx           # Application entry point
│   ├── index.css          # Global styles
│   └── vite-env.d.ts      # Vite type definitions
│
├── index.html              # HTML entry point
├── package.json           # Dependencies and scripts
├── package-lock.json      # Locked dependency versions
├── tsconfig.json          # TypeScript configuration
├── tsconfig.node.json     # TypeScript config for Node
├── vite.config.ts        # Vite build configuration
├── .gitignore            # Git ignore rules
├── README.md             # Main project README
└── PROJECT_STRUCTURE.md   # This file
```

## File Descriptions

### Documentation (`docs/`)

- **README.md**: Index and overview of all documentation
- **TECHNICAL_REPORT.md**: Comprehensive technical documentation (15 sections)
- **ARCHITECTURE.md**: System design, data flow, and architecture patterns
- **API_REFERENCE.md**: Complete API reference with examples

### Source Code (`src/`)

#### Components (`src/components/`)

**LoginScreen**
- Purpose: User authentication/identification
- Props: `onLogin: (student: Student) => void`
- State: Name and ID inputs

**MainMenu**
- Purpose: Navigation hub
- Props: Student info, navigation callbacks
- Features: Practice/Test mode selection

**PracticeMode**
- Purpose: Structured phoneme practice
- Flow: Group → Phoneme → Words
- State: Selected group, phoneme, words, recordings

**TestMode**
- Purpose: Randomized assessment
- Features: 10 random words, completion summary
- State: Words, current index, recordings

**WordPractice**
- Purpose: Shared word practice component
- Features: Recording, accuracy display, playback
- Used by: PracticeMode and TestMode

**PhonemeGroupList**
- Purpose: Display phoneme groups for selection
- Features: Grid layout of groups

**SpeechRecognitionWarning**
- Purpose: Browser compatibility notification
- Features: Auto-detects unsupported browsers

#### Data (`src/data/`)

**phonemes.ts**
- Exports: `phonemeGroups: PhonemeGroup[]`
- Contains: 7 groups, 35 phonemes with descriptions

**words.ts**
- Exports: `wordsDatabase: Word[]`, helper functions
- Contains: 71 words mapped to IPA phonemes
- Functions: `getWordsByPhoneme()`, `getRandomWords()`

#### Utilities (`src/utils/`)

**audio.ts**
- Classes: `AudioRecorder`
- Functions: `calculateAccuracy()`, `playAudio()`
- Features: Speech recognition, audio recording, accuracy calculation

#### Root Files

**types.ts**
- All TypeScript interfaces and types
- Student, Phoneme, PhonemeGroup, Word, etc.

**App.tsx**
- Root component with state management
- Handles navigation between screens

**main.tsx**
- React application entry point
- Renders App component

### Configuration Files

**package.json**
- Dependencies and scripts
- Project metadata

**tsconfig.json**
- TypeScript compiler options
- Strict mode enabled

**vite.config.ts**
- Vite build configuration
- React plugin setup

**index.html**
- HTML entry point
- Root div for React

## Code Organization Principles

### 1. Separation of Concerns
- **Components**: UI and user interaction
- **Data**: Static data and data access functions
- **Utils**: Reusable business logic
- **Types**: Type definitions centralized

### 2. Component Structure
- Each component has its own `.tsx` and `.css` file
- Components are self-contained
- Props interface defined at top of file

### 3. Data Management
- Static data in separate files
- Helper functions for data access
- Type-safe data structures

### 4. Utility Functions
- Pure functions where possible
- Reusable across components
- Well-documented with JSDoc

## Naming Conventions

### Files
- **Components**: PascalCase (e.g., `WordPractice.tsx`)
- **Utilities**: camelCase (e.g., `audio.ts`)
- **Data**: camelCase (e.g., `phonemes.ts`)
- **Types**: camelCase (e.g., `types.ts`)

### Code
- **Components**: PascalCase (e.g., `WordPractice`)
- **Functions**: camelCase (e.g., `calculateAccuracy`)
- **Types/Interfaces**: PascalCase (e.g., `Student`)
- **Constants**: UPPER_SNAKE_CASE or camelCase

## Import Organization

```typescript
// 1. React imports
import { useState } from 'react';

// 2. Third-party imports
import { SomeLibrary } from 'some-library';

// 3. Local type imports
import { Student, Word } from '../types';

// 4. Local component imports
import WordPractice from './WordPractice';

// 5. Local utility imports
import { calculateAccuracy } from '../utils/audio';

// 6. Style imports
import './Component.css';
```

## Future Organization Improvements

### Potential Additions
- `src/hooks/` - Custom React hooks
- `src/constants/` - Application constants
- `src/services/` - API services (if backend added)
- `src/store/` - State management (if Redux/Zustand added)
- `src/tests/` - Test files
- `src/assets/` - Images, fonts, etc.


## File Size Guidelines

- **Components**: Keep under 200 lines when possible
- **Utils**: Keep functions focused and under 100 lines
- **Data files**: Can be larger (current ~200 lines each)
- **Types**: Centralized, can grow as needed

## Documentation Standards

- **Component files**: Props interface documented
- **Functions**: JSDoc comments for complex functions
- **Types**: Comments for complex types
- **README**: Updated with new features

