# API Reference

## Audio Utilities

### `AudioRecorder` Class

#### Methods

##### `startRecording(): Promise<void>`
Initializes audio recording and speech recognition.

**Returns:** Promise that resolves when recording starts

**Throws:** Error if microphone access is denied

**Example:**
```typescript
const recorder = new AudioRecorder();
await recorder.startRecording();
```

##### `stopRecording(): Promise<Blob>`
Stops recording and speech recognition, returns audio blob.

**Returns:** Promise<Blob> - Audio recording as WAV blob

**Example:**
```typescript
const audioBlob = await recorder.stopRecording();
```

##### `getRecognizedText(): string`
Gets the transcribed text from speech recognition.

**Returns:** string - Recognized text (lowercase, trimmed)

**Example:**
```typescript
const text = recorder.getRecognizedText();
console.log(text); // "sheep"
```

##### `getRecognitionConfidence(): number`
Gets the confidence score from speech recognition.

**Returns:** number - Confidence score (0-1)

**Example:**
```typescript
const confidence = recorder.getRecognitionConfidence();
console.log(confidence); // 0.95
```

##### `cancelRecording(): void`
Cancels ongoing recording and cleans up resources.

**Example:**
```typescript
recorder.cancelRecording();
```

---

### `calculateAccuracy()` Function

#### Signature
```typescript
calculateAccuracy(
  targetWord: string,
  targetPhoneme: string,
  recordedAudio: Blob,
  recognizedText: string,
  recognitionConfidence: number
): Promise<number>
```

#### Parameters
- `targetWord`: The word user should pronounce (e.g., "sheep")
- `targetPhoneme`: IPA symbol of target phoneme (e.g., "/i:/")
- `recordedAudio`: Audio blob (not used in calculation, kept for future use)
- `recognizedText`: Text transcribed by speech recognition
- `recognitionConfidence`: Confidence score from recognition (0-1)

#### Returns
Promise<number> - Accuracy score (0-100)

#### Algorithm
1. Word-level accuracy (40% weight)
   - Exact match: 100%
   - Substring match: 85%
   - Levenshtein distance: Similarity percentage

2. Phoneme-level accuracy (60% weight)
   - Perfect word match: 100%
   - Phoneme pattern found: word accuracy + 15%
   - No pattern: word accuracy - 10%

3. Confidence adjustment (30% of final score)
   - Blends combined accuracy with confidence score

#### Example
```typescript
const accuracy = await calculateAccuracy(
  "sheep",
  "/i:/",
  audioBlob,
  "sheep",
  0.95
);
console.log(accuracy); // 98
```

---

### `playAudio()` Function

#### Signature
```typescript
playAudio(audioBlob: Blob): void
```

#### Parameters
- `audioBlob`: Audio blob to play

#### Example
```typescript
playAudio(previousRecording.audioBlob);
```

---

## Data Functions

### `getWordsByPhoneme()`

#### Signature
```typescript
getWordsByPhoneme(phoneme: string): Word[]
```

#### Parameters
- `phoneme`: IPA symbol (e.g., "/θ/")

#### Returns
Array of words containing the specified phoneme

#### Example
```typescript
const words = getWordsByPhoneme("/θ/");
// Returns: [{ word: "think", phoneme: "/θ/", ... }, ...]
```

---

### `getRandomWords()`

#### Signature
```typescript
getRandomWords(count?: number): Word[]
```

#### Parameters
- `count`: Number of words to return (default: 10)

#### Returns
Array of randomly selected words

#### Example
```typescript
const words = getRandomWords(10);
// Returns: 10 random words from database
```

---

## Component Props

### `LoginScreen`

```typescript
interface LoginScreenProps {
  onLogin: (student: Student) => void;
}
```

### `MainMenu`

```typescript
interface MainMenuProps {
  student: Student;
  onPractice: () => void;
  onTest: () => void;
}
```

### `PracticeMode`

```typescript
interface PracticeModeProps {
  student: Student;
  onBack: () => void;
}
```

### `TestMode`

```typescript
interface TestModeProps {
  student: Student;
  onBack: () => void;
}
```

### `WordPractice`

```typescript
interface WordPracticeProps {
  word: Word;
  phoneme: Phoneme;
  wordNumber: number;
  totalWords: number;
  onRecordingComplete: (audioBlob: Blob, accuracy: number) => void;
  previousRecording?: { audioBlob: Blob; accuracy: number };
}
```

---

## Type Definitions

### `Student`
```typescript
interface Student {
  name: string;
  id: string;
}
```

### `Phoneme`
```typescript
interface Phoneme {
  symbol: string;      // "/θ/"
  name: string;         // "TH (voiceless)"
  description?: string; // "as in 'think', 'bath'"
}
```

### `PhonemeGroup`
```typescript
interface PhonemeGroup {
  id: string;           // "fricatives"
  name: string;         // "Fricatives"
  phonemes: Phoneme[];
}
```

### `Word`
```typescript
interface Word {
  id: string;           // "w28"
  word: string;         // "think"
  phoneme: string;      // "/θ/"
  phonemeGroup: string; // "fricatives"
  transcription?: string;
}
```

---

## Browser APIs Used

### Web Speech API

#### `SpeechRecognition`
```typescript
const recognition = new SpeechRecognition();
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = 'en-US';
recognition.start();
```

#### Events
- `onresult`: Fired when recognition result is available
- `onerror`: Fired on recognition errors
- `onend`: Fired when recognition ends
- `onstart`: Fired when recognition starts

### MediaRecorder API

```typescript
const recorder = new MediaRecorder(stream);
recorder.ondataavailable = (event) => {
  // Handle audio data
};
recorder.start();
recorder.stop();
```

