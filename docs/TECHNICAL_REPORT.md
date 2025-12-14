# Phonomenal - Technical Report

## Executive Summary

Phonomenal is a web-based application designed for scientific phoneme-focused pronunciation practice and assessment. The application uses real-time speech recognition to provide immediate feedback on pronunciation accuracy, specifically targeting IPA (International Phonetic Alphabet) sounds for research and educational purposes.

**Version:** 1.0.0  
**Date:** December 2025  
**Technology Stack:** React 18, TypeScript, Vite, Web Speech API

---

## 1. Architecture Overview

### 1.1 System Architecture

```
┌─────────────────────────────────────────────────┐
│                  User Interface                  │
│  (React Components - State Management)           │
└──────────────────┬──────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                        │
┌───────▼────────┐      ┌────────▼────────┐
│  Practice Mode │      │   Test Mode     │
│  (Structured) │      │   (Randomized)  │
└───────┬────────┘      └────────┬───────┘
        │                        │
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │   Audio Processing     │
        │  - MediaRecorder API  │
        │  - Speech Recognition  │
        └───────────┬────────────┘
                    │
        ┌───────────▼────────────┐
        │  Accuracy Calculation  │
        │  - Word Matching       │
        │  - Phoneme Analysis    │
        └────────────────────────┘
```

### 1.2 Component Hierarchy

```
App
├── SpeechRecognitionWarning (Global)
├── LoginScreen
├── MainMenu
├── PracticeMode
│   ├── PhonemeGroupList
│   └── WordPractice
└── TestMode
    └── WordPractice (shared component)
```

---

## 2. Core Technologies

### 2.1 Frontend Framework
- **React 18.2.0**: Component-based UI library
- **TypeScript 5.3.3**: Type-safe JavaScript
- **Vite 5.0.8**: Build tool and dev server

### 2.2 APIs Used
- **Web Speech API (SpeechRecognition)**: Real-time speech-to-text transcription
- **MediaRecorder API**: Audio recording functionality
- **Web Audio API**: Audio playback

### 2.3 Styling
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **No CSS Framework**: Custom styling for full control

---

## 3. Data Models

### 3.1 Type Definitions

```typescript
interface Student {
  name: string;
  id: string;
}

interface Phoneme {
  symbol: string;      // IPA symbol (e.g., "/θ/")
  name: string;         // Human-readable name
  description?: string; // Example words
}

interface PhonemeGroup {
  id: string;
  name: string;         // e.g., "Fricatives"
  phonemes: Phoneme[];
}

interface Word {
  id: string;
  word: string;         // Target word (e.g., "sheep")
  phoneme: string;      // IPA symbol (e.g., "/i:/")
  phonemeGroup: string; // Group ID
}
```

### 3.2 Data Structure

**Phoneme Groups:** 7 groups
- Long Vowels (5 phonemes)
- Short Vowels (6 phonemes)
- Fricatives (9 phonemes)
- Plosives (6 phonemes)
- Affricates (2 phonemes)
- Nasals (3 phonemes)
- Liquids & Glides (4 phonemes)

**Words Database:** 71 words
- Each word mapped to a specific IPA phoneme
- Organized by phoneme groups
- Used for both practice and testing

---

## 4. Key Features Implementation

### 4.1 Speech Recognition

**Implementation:** `src/utils/audio.ts`

```typescript
class AudioRecorder {
  - startRecording(): Initializes MediaRecorder + SpeechRecognition
  - stopRecording(): Stops both, waits for final recognition result
  - getRecognizedText(): Returns transcribed text
  - getRecognitionConfidence(): Returns confidence score (0-1)
}
```

**Features:**
- Continuous recognition with interim results
- Automatic result collection (final + interim)
- Error handling for unsupported browsers
- 300ms delay to ensure final result capture

### 4.2 Accuracy Calculation

**Algorithm:** `calculateAccuracy()` function

**Process:**
1. **Word-Level Matching:**
   - Exact match: 100%
   - Substring match: 85%
   - Levenshtein distance: Similarity score (0-100%)

2. **Phoneme-Level Analysis:**
   - Perfect word match: 100%
   - Phoneme pattern detection: +15% boost
   - Pattern matching for common phonemes (th, sh, ch, ng, etc.)

3. **Final Score:**
   - Weighted: 40% word accuracy + 60% phoneme accuracy
   - Adjusted by recognition confidence (30% weight)
   - Final range: 0-100%

**Phoneme Pattern Mapping:**
```typescript
{
  'θ': ['th'],      // think, bath
  'ð': ['th'],      // this, that
  'ʃ': ['sh', 'ti', 'ci'],  // ship, wish
  'tʃ': ['ch', 'tch'],      // chair, watch
  'dʒ': ['j', 'ge', 'dge'], // joy, judge
  'ŋ': ['ng'],      // sing, ring
}
```

### 4.3 User Flow

**Practice Mode:**
1. Select phoneme group → 2. Select phoneme → 3. Practice words sequentially
4. Record pronunciation → 5. Get immediate feedback → 6. Navigate between words

**Test Mode:**
1. Random 10 words selected → 2. Record each word → 3. View completion summary
4. Average accuracy calculated

---

## 5. Browser Compatibility

### 5.1 Speech Recognition Support

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome | Full | Native `SpeechRecognition` |
| Edge | Full | Native `SpeechRecognition` |
| Safari | Full | `webkitSpeechRecognition` |
| Firefox | None | Only supports speech synthesis |

### 5.2 Detection & Fallback

- **Browser Detection:** User agent analysis
- **API Detection:** Tests for `SpeechRecognition` or `webkitSpeechRecognition`
- **Fallback:** Graceful degradation with clear user messaging
- **Warning System:** Automatic notification for unsupported browsers

---

## 6. Performance Considerations

### 6.1 Audio Processing
- **Recording Format:** WAV (Blob storage)
- **Recognition Latency:** ~300-500ms for final result
- **Memory Management:** Audio URLs revoked after playback

### 6.2 State Management
- **Local State:** React useState hooks
- **No Global State:** Component-level state management
- **Data Flow:** Props down, callbacks up pattern

### 6.3 Optimization
- **Component Lazy Loading:** Not implemented (future enhancement)
- **Audio Compression:** Not implemented (future enhancement)
- **Result Caching:** Previous recordings stored in component state

---

## 7. Security & Privacy

### 7.1 Microphone Access
- **Permission Required:** Browser prompts for microphone access
- **HTTPS Required:** MediaRecorder API requires secure context
- **No Data Storage:** Audio recordings not persisted (in-memory only)

### 7.2 Speech Recognition
- **Client-Side Processing:** Web Speech API processes locally (Chrome/Edge)
- **Privacy:** No audio sent to external servers (browser-dependent)
- **Data Retention:** No persistent storage of recordings

---

## 8. Known Limitations

### 8.1 Browser Support
- Firefox completely unsupported for speech recognition
- Safari requires `webkit` prefix
- Chrome/Edge recommended for best experience

### 8.2 Accuracy Limitations
- **Simplified Algorithm:** Pattern-based phoneme detection (not ML-based)
- **No Phonetic Dictionary:** Relies on string matching
- **Confidence Dependency:** Accuracy tied to recognition confidence

### 8.3 Feature Gaps
- No data persistence (localStorage/backend)
- No progress tracking across sessions
- No export functionality for test results
- Limited phoneme coverage (35 phonemes, 71 words)

---

## 9. Testing & Quality Assurance

### 9.1 Manual Testing
- Cross-browser testing (Chrome, Safari, Edge, Firefox)
- Speech recognition accuracy validation
- UI/UX flow testing
- Error handling verification

### 9.2 Test Coverage
- **Unit Tests:** Not implemented
- **Integration Tests:** Not implemented
- **E2E Tests:** Not implemented

**Recommendation:** Implement Jest + React Testing Library for unit tests

---

## 10. Deployment

### 10.1 Build Process
```bash
npm run build  # TypeScript compilation + Vite bundling
```

**Output:** `dist/` directory with optimized production build

### 10.2 Requirements
- **HTTPS:** Required for microphone access
- **Modern Browser:** Chrome/Edge/Safari recommended
- **Microphone:** Hardware microphone required

### 10.3 Hosting
- Compatible with any static hosting (Vercel, Netlify, GitHub Pages)
- No backend required
- No database required

---

## 11. Future Enhancements

### 11.1 Short-Term
- [ ] Data persistence (localStorage)
- [ ] Progress tracking per student
- [ ] Export test results (CSV/JSON)
- [ ] More words and phonemes

### 11.2 Medium-Term
- [ ] Backend integration for data storage
- [ ] User accounts and authentication
- [ ] Analytics dashboard
- [ ] Advanced phonetic analysis

### 11.3 Long-Term
- [ ] ML-based pronunciation analysis
- [ ] Real-time waveform visualization
- [ ] Multi-language support
- [ ] Mobile app (React Native)

---

## 12. File Structure

```
phonomenal/
├── docs/
│   └── TECHNICAL_REPORT.md
├── src/
│   ├── components/        # React components
│   │   ├── LoginScreen.tsx
│   │   ├── MainMenu.tsx
│   │   ├── PracticeMode.tsx
│   │   ├── TestMode.tsx
│   │   ├── WordPractice.tsx
│   │   ├── PhonemeGroupList.tsx
│   │   └── SpeechRecognitionWarning.tsx
│   ├── data/              # Static data
│   │   ├── phonemes.ts
│   │   └── words.ts
│   ├── utils/             # Utilities
│   │   └── audio.ts
│   ├── types.ts           # TypeScript definitions
│   ├── App.tsx            # Root component
│   └── main.tsx           # Entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 13. Dependencies

### 13.1 Production Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.20.0"  // Not currently used
}
```

### 13.2 Development Dependencies
```json
{
  "@types/react": "^18.2.43",
  "@types/react-dom": "^18.2.17",
  "@vitejs/plugin-react": "^4.2.1",
  "typescript": "^5.3.3",
  "vite": "^5.0.8"
}
```

---

## 14. Metrics & Statistics

### 14.1 Codebase
- **Total Files:** ~20 TypeScript/TSX files
- **Lines of Code:** ~2,000+ lines
- **Components:** 7 main components
- **Data Points:** 35 phonemes, 71 words

### 14.2 Features
- **Modes:** 2 (Practice, Test)
- **Phoneme Groups:** 7
- **Accuracy Algorithm:** 3-stage (word, phoneme, confidence)

---

## 15. Conclusion

Phonomenal successfully implements a phoneme-focused pronunciation practice application with real-time speech recognition and accuracy scoring. The application provides a scientific approach to pronunciation assessment by isolating specific IPA sounds for targeted practice and research.

**Key Achievements:**
- Real-time speech recognition integration
- Phoneme-level accuracy calculation
- Clean, intuitive user interface
- Cross-browser compatibility (where supported)

**Areas for Improvement:**
- Data persistence and progress tracking
- More comprehensive phoneme coverage
- Advanced phonetic analysis algorithms
- Automated testing suite

---

**Report Generated:** December 2025  
**Maintained By:** Development Team  
**Contact:** See README.md for project information

