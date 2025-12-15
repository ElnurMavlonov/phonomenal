// Web Speech API types
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognition;
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionErrorEvent {
  error: string;
  message: string;
}

export class AudioRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private stream: MediaStream | null = null;
  private speechRecognition: SpeechRecognition | null = null;
  private recognizedText: string = '';
  private recognitionConfidence: number = 0;
  private recognitionResolve: ((value: void) => void) | null = null;

  async startRecording(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.stream = stream;
      
      // Determine the best MIME type for the current browser
      let mimeType = 'audio/webm';
      const options: MediaRecorderOptions = {};
      
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus';
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/ogg;codecs=opus')) {
        mimeType = 'audio/ogg;codecs=opus';
      }
      
      options.mimeType = mimeType;
      this.mediaRecorder = new MediaRecorder(stream, options);
      this.audioChunks = [];
      this.recognizedText = '';
      this.recognitionConfidence = 0;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      // Start speech recognition
      await this.startSpeechRecognition();

      this.mediaRecorder.start();
    } catch (error) {
      console.error('Error starting recording:', error);
      throw new Error('Failed to access microphone');
    }
  }

  private startSpeechRecognition(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Test for actual support, not just browser detection
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        const userAgent = navigator.userAgent.toLowerCase();
        const isFirefox = userAgent.includes('firefox');
        
        if (isFirefox) {
          console.error(
            'Speech recognition is not supported in Firefox. ' +
            'Firefox only supports speech synthesis (text-to-speech), not speech recognition. ' +
            'Please use Chrome, Edge, or Safari for speech recognition features.'
          );
          // Don't reject, just resolve without recognition - we'll handle this in the UI
        } else {
          console.warn('Speech recognition not supported in this browser');
        }
        resolve();
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true; // Enable interim results to capture text faster
      recognition.lang = 'en-US';

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        // Collect all results and use the most recent final result
        let finalTranscript = '';
        let finalConfidence = 0;

        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal && result[0]) {
            finalTranscript = result[0].transcript.trim().toLowerCase();
            finalConfidence = result[0].confidence || 0;
          } else if (!result.isFinal && result[0]) {
            // Use interim result if no final result yet
            if (!finalTranscript) {
              finalTranscript = result[0].transcript.trim().toLowerCase();
              finalConfidence = result[0].confidence || 0;
            }
          }
        }

        // Update with the latest result (prefer final over interim)
        if (finalTranscript) {
          this.recognizedText = finalTranscript;
          this.recognitionConfidence = finalConfidence;
          console.log('Recognized:', finalTranscript, 'Confidence:', finalConfidence);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error, event.message);
        if (event.error === 'no-speech') {
          // This is common when user hasn't spoken yet, not a critical error
          console.log('No speech detected yet');
        } else {
          reject(new Error(`Speech recognition error: ${event.error}`));
        }
      };

      recognition.onend = () => {
        // Recognition ended - resolve if we were waiting
        if (this.recognitionResolve) {
          this.recognitionResolve();
          this.recognitionResolve = null;
        }
      };

      recognition.onstart = () => {
        console.log('Speech recognition started');
        resolve();
      };

      this.speechRecognition = recognition;
      
      try {
        recognition.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        reject(error);
      }
    });
  }

  async stopRecording(): Promise<Blob> {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }

      // Wait for speech recognition to finish processing
      const waitForRecognition = (): Promise<void> => {
        return new Promise((recognitionResolve) => {
          if (!this.speechRecognition) {
            recognitionResolve();
            return;
          }

          // Set up resolve for onend event
          this.recognitionResolve = recognitionResolve;

          // Stop recognition and wait for it to finish
          try {
            this.speechRecognition.stop();
          } catch (error) {
            console.error('Error stopping recognition:', error);
            recognitionResolve();
          }

          // Timeout after 2 seconds if recognition doesn't end
          setTimeout(() => {
            if (this.recognitionResolve) {
              this.recognitionResolve();
              this.recognitionResolve = null;
            }
          }, 2000);
        });
      };

      // Stop media recorder
      this.mediaRecorder.onstop = async () => {
        // Wait a bit for recognition to process final result
        await waitForRecognition();
        
        // Give a small delay to ensure final result is captured
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Use the actual MIME type from MediaRecorder, or fallback to webm
        const mimeType = this.mediaRecorder?.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });
        this.cleanup();
        resolve(audioBlob);
      };

      this.mediaRecorder.stop();
    });
  }

  getRecognizedText(): string {
    return this.recognizedText;
  }

  getRecognitionConfidence(): number {
    return this.recognitionConfidence;
  }

  private cleanup(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    if (this.speechRecognition) {
      this.speechRecognition.stop();
      this.speechRecognition = null;
    }
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  cancelRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      this.mediaRecorder.stop();
    }
    if (this.speechRecognition) {
      this.speechRecognition.stop();
      this.speechRecognition = null;
    }
    this.cleanup();
  }
}

// Phonetic comparison using Levenshtein distance and phonetic rules
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  const len1 = str1.length;
  const len2 = str2.length;

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1[i - 1] === str2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + 1
        );
      }
    }
  }

  return matrix[len1][len2];
}

// Calculate word-level accuracy
function calculateWordAccuracy(targetWord: string, recognizedWord: string): number {
  const target = targetWord.toLowerCase().trim();
  const recognized = recognizedWord.toLowerCase().trim();

  if (target === recognized) {
    return 100;
  }

  // Check if recognized word contains target word or vice versa
  if (recognized.includes(target) || target.includes(recognized)) {
    return 85;
  }

  // Use Levenshtein distance for similarity
  const maxLen = Math.max(target.length, recognized.length);
  if (maxLen === 0) return 0;

  const distance = levenshteinDistance(target, recognized);
  const similarity = 1 - distance / maxLen;
  
  return Math.max(0, Math.round(similarity * 100));
}

// Calculate phoneme-level accuracy
function calculatePhonemeAccuracy(targetWord: string, targetPhoneme: string, recognizedWord: string): number {
  // For phoneme accuracy, we check:
  // 1. If the recognized word matches the target word (100%)
  // 2. If the recognized word contains the target phoneme sound
  // 3. Word-level similarity as a base
  
  const wordAccuracy = calculateWordAccuracy(targetWord, recognizedWord);
  
  // If word is perfect match, phoneme is also perfect
  if (wordAccuracy === 100) {
    return 100;
  }

  // Check if recognized word likely contains the target phoneme
  // This is a simplified check - in production, you'd use a phonetic dictionary
  const targetPhonemeClean = targetPhoneme.replace(/[\/\[\]]/g, '');
  
  // Common word patterns for phonemes
  const phonemePatterns: Record<string, string[]> = {
    'θ': ['th'],
    'ð': ['th'],
    'ʃ': ['sh', 'ti', 'ci'],
    'ʒ': ['si', 'ge'],
    'tʃ': ['ch', 'tch'],
    'dʒ': ['j', 'ge', 'dge'],
    'ŋ': ['ng'],
  };

  const patterns = phonemePatterns[targetPhonemeClean] || [];
  const recognizedLower = recognizedWord.toLowerCase();
  
  // Check if recognized word contains phoneme patterns
  const hasPhonemePattern = patterns.some(pattern => recognizedLower.includes(pattern));
  
  if (hasPhonemePattern) {
    // Boost accuracy if phoneme pattern is found
    return Math.min(100, wordAccuracy + 15);
  }

  // Base accuracy on word similarity
  return Math.max(0, wordAccuracy - 10);
}

export async function calculateAccuracy(
  targetWord: string,
  targetPhoneme: string,
  _recordedAudio: Blob,
  recognizedText: string,
  recognitionConfidence: number
): Promise<number> {
  return new Promise((resolve) => {
    // If no recognized text, return low accuracy
    if (!recognizedText || recognizedText.trim().length === 0) {
      resolve(0);
      return;
    }

    // Calculate word-level accuracy
    const wordAccuracy = calculateWordAccuracy(targetWord, recognizedText);
    
    // Calculate phoneme-level accuracy
    const phonemeAccuracy = calculatePhonemeAccuracy(targetWord, targetPhoneme, recognizedText);
    
    // Combine both accuracies (weighted: 40% word, 60% phoneme for phoneme-focused app)
    const combinedAccuracy = Math.round(wordAccuracy * 0.4 + phonemeAccuracy * 0.6);
    
    // Adjust based on recognition confidence if available
    let finalAccuracy = combinedAccuracy;
    if (recognitionConfidence > 0) {
      // Blend with confidence score
      finalAccuracy = Math.round(combinedAccuracy * 0.7 + recognitionConfidence * 100 * 0.3);
    }

    // Ensure accuracy is within bounds
    finalAccuracy = Math.max(0, Math.min(100, finalAccuracy));
    
    resolve(finalAccuracy);
  });
}

export function playAudio(audioBlob: Blob): void {
  // Validate blob
  if (!audioBlob || audioBlob.size === 0) {
    console.error('Invalid audio blob');
    alert('No audio data available to play.');
    return;
  }
  
  const audioUrl = URL.createObjectURL(audioBlob);
  const audio = new Audio(audioUrl);
  
  // iOS Safari requires audio to be loaded before playing
  audio.preload = 'auto';
  
  // Set volume (iOS sometimes requires this)
  audio.volume = 1.0;
  
  // Handle errors
  audio.onerror = (error) => {
    console.error('Error playing audio:', error);
    URL.revokeObjectURL(audioUrl);
    alert('Failed to play audio. Please try again.');
  };
  
  // Clean up URL when audio ends
  audio.onended = () => {
    URL.revokeObjectURL(audioUrl);
  };
  
  // Load and play audio
  audio.load();
  
  // Play audio - iOS Safari requires this to be in response to user gesture
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        // Audio started playing successfully
        console.log('Audio playback started');
      })
      .catch((error) => {
        console.error('Error playing audio:', error);
        // On iOS, this might fail if not in response to user gesture
        // Try again with a slight delay
        setTimeout(() => {
          audio.play().catch((err) => {
            console.error('Retry failed:', err);
            URL.revokeObjectURL(audioUrl);
            alert('Failed to play audio. Please ensure you clicked the play button.');
          });
        }, 100);
      });
  } else {
    // Fallback for older browsers where play() returns undefined
    // Don't call .catch() since undefined has no catch method
    try {
      audio.play();
    } catch (err) {
      console.error('Play failed:', err);
      URL.revokeObjectURL(audioUrl);
      alert('Failed to play audio. Please try again.');
    }
  }
}
