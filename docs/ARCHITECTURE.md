# Architecture Documentation

## System Design

### Component Architecture

```
┌─────────────────────────────────────────────┐
│                  App.tsx                   │
│  (State: login | menu | practice | test)   │
└───────────────┬─────────────────────────────┘
                │
    ┌───────────┼───────────┐
    │           │           │
┌───▼───┐  ┌────▼────┐  ┌───▼────┐
│Login  │  │  Menu   │  │Practice│
└───────┘  └────┬────┘  └───┬────┘
                │           │
                │      ┌────┴────┐
                │      │  Test   │
                │      └─────────┘
                │
        ┌───────▼──────────┐
        │ WordPractice     │
        │ (Shared Component)│
        └───────────────────┘
```

## Data Flow

### Practice Mode Flow
```
User → Select Group → Select Phoneme → Practice Words
                                              ↓
                                    Record Audio
                                              ↓
                                    Speech Recognition
                                              ↓
                                    Calculate Accuracy
                                              ↓
                                    Display Feedback
```

### Test Mode Flow
```
User → Start Test → Random 10 Words
                          ↓
                    Record Each Word
                          ↓
                    Calculate Accuracy
                          ↓
                    Store Results
                          ↓
                    Show Summary
```

## State Management

### App-Level State
- `state`: Current screen (login/menu/practice/test)
- `student`: Current student information

### Component-Level State
- **PracticeMode**: Selected group, phoneme, words, recordings
- **TestMode**: Words, current index, recordings, completion status
- **WordPractice**: Recording state, accuracy, recognized text

## API Integration

### Web Speech API
```typescript
// Browser API (no external dependencies)
SpeechRecognition | webkitSpeechRecognition
  - continuous: true
  - interimResults: true
  - lang: 'en-US'
```

### MediaRecorder API
```typescript
// Browser API
MediaRecorder
  - Records audio as Blob
  - Format: audio/wav
```

## Accuracy Calculation Pipeline

```
Audio Recording
      ↓
Speech Recognition (Web Speech API)
      ↓
Transcribed Text
      ↓
┌─────────────┬──────────────┐
│             │              │
Word Match    Phoneme Match  Confidence
(40%)         (60%)          (30% adjustment)
      │             │              │
      └─────┬───────┘              │
            │                      │
      Combined Score               │
            │                      │
            └──────────┬───────────┘
                       │
                 Final Accuracy
                 (0-100%)
```

## Error Handling

### Browser Compatibility
- Detection: User agent + API availability check
- Warning: Automatic notification for unsupported browsers
- Fallback: Graceful degradation with user messaging

### Speech Recognition Errors
- `no-speech`: Non-critical, logged only
- Other errors: Logged and user notified
- Timeout: 2-second timeout for recognition end event

### Recording Errors
- Microphone access denied: User alert
- Recording failure: Error logged, user notified
- Processing failure: User alert with retry option

## Performance Optimization

### Current Optimizations
- Component-level state (no unnecessary re-renders)
- Audio URL cleanup after playback
- Efficient state updates (only changed values)

### Future Optimizations
- Lazy loading for components
- Audio compression before storage
- Result caching
- Virtual scrolling for large word lists

## Security Considerations

### Permissions
- Microphone access: User-granted, browser-managed
- No persistent storage: All data in-memory
- HTTPS required: Secure context for media APIs

### Data Privacy
- No external API calls: All processing client-side
- No data transmission: Audio stays in browser
- No tracking: No analytics or user tracking

## Scalability

### Current Limitations
- In-memory storage only
- No user accounts
- No data persistence
- Single session only

### Scalability Path
1. **Phase 1:** localStorage for session persistence
2. **Phase 2:** Backend API for multi-device sync
3. **Phase 3:** Database for historical data
4. **Phase 4:** Multi-user support with authentication

