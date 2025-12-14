# Phonomenal - IPA Sound Practice & Assessment App

A scientific phoneme-focused app for practicing and testing IPA (International Phonetic Alphabet) sounds.

**Documentation:** See [docs/](./docs/) directory for technical reports, architecture docs, and API reference.

## Features

### Practice Mode
- Browse phoneme groups (Long Vowels, Short Vowels, Fricatives, Plosives, etc.)
- Select specific phonemes to practice
- Practice words one by one with immediate accuracy feedback
- Visual feedback with color-coded accuracy scores (Green/Orange/Red)

### Test Mode
- Random assessment with 10 words from the database
- Mixed sounds for comprehensive evaluation
- Track accuracy across all words
- Complete test summary with average accuracy

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build

```bash
npm run build
```

## App Structure

1. **Login Screen**: Enter student name and ID
2. **Main Menu**: Choose between Practice Mode and Test Mode
3. **Practice Mode**: 
   - Select phoneme group
   - Select specific phoneme
   - Practice words with feedback
4. **Test Mode**: 
   - Random word assessment
   - Complete test and view results

## Technology Stack

- React 18
- TypeScript
- Vite
- CSS3 (Modern styling with gradients and animations)
- Web Speech API (for real-time speech recognition)

## Data Structure

- **Phoneme Groups**: Organized by sound type (vowels, consonants, etc.)
- **Words Database**: 70+ words mapped to specific IPA phonemes
- **Audio Recording**: Browser-based MediaRecorder API
- **Speech Recognition**: Web Speech API for real-time transcription
- **Accuracy Calculation**: Real phoneme-level accuracy using:
  - Word-level matching (Levenshtein distance)
  - Phoneme pattern recognition
  - Speech recognition confidence scores

## Browser Compatibility

**Speech Recognition Support:**
- Chrome: Full support (recommended)
- Edge: Full support (recommended)
- Safari: Full support (webkitSpeechRecognition)
- Firefox: **Not supported** - Firefox only supports speech synthesis (text-to-speech), not speech recognition

**Important:** 
- Firefox does **not** support the Web Speech API's `SpeechRecognition` interface (as of 2025)
- Firefox only supports `SpeechSynthesis` (text-to-speech), not speech recognition
- Some search results may incorrectly claim Firefox supports it, but this is not accurate
- Speech recognition and accuracy scoring will **not work in Firefox**
- Users will see a warning message and should switch to Chrome, Edge, or Safari for full functionality

The app requires microphone access and works best in Chrome/Edge/Safari browsers for optimal speech recognition accuracy.

## How Accuracy is Calculated

1. **Speech Recognition**: Uses Web Speech API to transcribe user's pronunciation
2. **Word-Level Accuracy**: Compares recognized text with target word using Levenshtein distance
3. **Phoneme-Level Accuracy**: Checks if recognized word contains target phoneme patterns
4. **Final Score**: Weighted combination (40% word accuracy, 60% phoneme accuracy) adjusted by recognition confidence

## Future Enhancements

- Data persistence (localStorage or backend)
- Progress tracking and analytics
- Export test results
- More words and phonemes
- Advanced phonetic analysis using ML models

