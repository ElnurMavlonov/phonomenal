export interface Student {
  name: string;
  id: string;
}

export interface Phoneme {
  symbol: string;
  name: string;
  description?: string;
}

export interface PhonemeGroup {
  id: string;
  name: string;
  phonemes: Phoneme[];
}

export interface Word {
  id: string;
  word: string;
  phoneme: string; // IPA symbol
  phonemeGroup: string; // Group ID
  transcription?: string; // Full IPA transcription
}

export interface PracticeSession {
  student: Student;
  phoneme: Phoneme;
  words: Word[];
  currentWordIndex: number;
  recordings: Record<number, {
    audioBlob: Blob;
    accuracy: number;
    timestamp: Date;
  }>;
}

export interface TestSession {
  student: Student;
  words: Word[];
  currentWordIndex: number;
  recordings: Record<number, {
    audioBlob: Blob;
    accuracy: number;
    timestamp: Date;
  }>;
}

