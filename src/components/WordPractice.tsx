import { useState, useRef } from 'react';
import { Phoneme, Word, Student } from '../types';
import { AudioRecorder, calculateAccuracy, playAudio } from '../utils/audio';
import { logAttemptToSheets } from '../utils/sheetsLogger';
import './WordPractice.css';

interface WordPracticeProps {
  word: Word;
  phoneme: Phoneme;
  wordNumber: number;
  totalWords: number;
  onRecordingComplete: (audioBlob: Blob, accuracy: number) => void;
  previousRecording?: { audioBlob: Blob; accuracy: number };
  student: Student;
}

export default function WordPractice({
  word,
  phoneme,
  wordNumber,
  totalWords,
  onRecordingComplete,
  previousRecording,
  student,
}: WordPracticeProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAccuracy, setCurrentAccuracy] = useState<number | null>(
    previousRecording?.accuracy ?? null
  );
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [confidenceScore, setConfidenceScore] = useState<number | null>(null);
  const recorderRef = useRef<AudioRecorder | null>(null);
  const recordingStartTimeRef = useRef<number | null>(null);

  const handleStartRecording = async () => {
    try {
      const recorder = new AudioRecorder();
      recorderRef.current = recorder;
      recordingStartTimeRef.current = Date.now(); // Track start time
      await recorder.startRecording();
      setIsRecording(true);
      setCurrentAccuracy(null);
      setRecognizedText('');
      setConfidenceScore(null);
    } catch (error) {
      alert('Failed to access microphone. Please check permissions.');
      console.error(error);
    }
  };

  const handleListenToModel = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(word.word);
      utterance.lang = 'en-US'; // Use en-US for accurate phoneme modeling
      utterance.rate = 0.9; // Slightly slower for clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    } else {
      alert('Speech synthesis is not supported in this browser.');
    }
  };

  const handleTryAgain = () => {
    setCurrentAccuracy(null);
    setRecognizedText('');
    setConfidenceScore(null);
    setIsRecording(false);
    setIsProcessing(false);
    recorderRef.current = null;
    recordingStartTimeRef.current = null;
  };

  const handleStopRecording = async () => {
    if (!recorderRef.current) return;

    setIsRecording(false);
    setIsProcessing(true);

    try {
      const audioBlob = await recorderRef.current.stopRecording();
      const text = recorderRef.current.getRecognizedText();
      const recognitionConfidence = recorderRef.current.getRecognitionConfidence();
      const alternatives = recorderRef.current.getRecognitionAlternatives();
      
      // Calculate time taken
      const timeTakenMs = recordingStartTimeRef.current 
        ? Date.now() - recordingStartTimeRef.current 
        : 0;
      
      console.log('Recognized text:', text);
      console.log('Target word:', word.word);
      console.log('Confidence:', recognitionConfidence);
      console.log('Alternatives:', alternatives);
      
      setRecognizedText(text);
      setConfidenceScore(recognitionConfidence);
      
      // Check if speech recognition is supported
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const userAgent = navigator.userAgent.toLowerCase();
      const isFirefox = userAgent.includes('firefox');
      
      if (isFirefox || !SpeechRecognition) {
        const browserName = isFirefox ? 'Firefox' : 'this browser';
        alert(
          `Speech recognition is not supported in ${browserName}.\n\n` +
          `Please use Chrome, Edge, or Safari for speech recognition to work.`
        );
        setCurrentAccuracy(0);
        onRecordingComplete(audioBlob, 0);
        return;
      }
      
      if (!text || text.trim().length === 0) {
        alert('No speech detected. Please make sure your microphone is working and try speaking again.');
        setCurrentAccuracy(0);
        onRecordingComplete(audioBlob, 0);
        return;
      }
      
      const accuracy = await calculateAccuracy(
        word.word,
        phoneme.symbol,
        audioBlob,
        text,
        recognitionConfidence,
        alternatives
      );
      setCurrentAccuracy(accuracy);
      onRecordingComplete(audioBlob, accuracy);

      // Log to Google Sheets
      await logAttemptToSheets({
        studentName: student.name,
        studentId: student.id,
        targetPhoneme: phoneme.symbol,
        targetWord: word.word,
        recognizedText: text,
        accuracyScore: accuracy,
        confidenceScore: recognitionConfidence,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        timeTakenMs: timeTakenMs,
      });
    } catch (error) {
      console.error('Error processing recording:', error);
      alert('Failed to process recording. Please try again.');
    } finally {
      setIsProcessing(false);
      recorderRef.current = null;
      recordingStartTimeRef.current = null;
    }
  };

  const handlePlayRecording = () => {
    if (previousRecording) {
      playAudio(previousRecording.audioBlob);
    }
  };

  const getAccuracyColor = (accuracy: number | null) => {
    if (accuracy === null) return '#CBD5E1';
    if (accuracy >= 80) return '#10B981'; // Emerald Green - Success
    if (accuracy >= 60) return '#F59E0B'; // Amber - Warning
    return '#EF4444'; // Rose Red - Error
  };

  return (
    <div className="word-practice">
      <div className="word-card">
        <div className="word-header">
          <span className="word-number">Word {wordNumber} of {totalWords}</span>
          <span className="phoneme-badge phoneme-badge-header">{phoneme.symbol}</span>
        </div>
        
        {/* Compact Header: Phoneme badge above (mobile), word and listen button side-by-side */}
        <div className="word-display">
          <div className="phoneme-badge-container">
            <span className="phoneme-badge">{phoneme.symbol}</span>
          </div>
          <div className="word-and-model-row">
            <h2 className="target-word">{word.word}</h2>
            <button
              onClick={handleListenToModel}
              className="listen-model-button-icon"
              type="button"
              aria-label="Listen to model pronunciation"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
              </svg>
            </button>
          </div>
          <p className="phoneme-info">Practice the sound: {phoneme.symbol}</p>
        </div>

        <div className="content-section">
          {/* Desktop: Regular recording buttons */}
          <div className="recording-section">
            {!isRecording && !isProcessing && (
              <button
                onClick={handleStartRecording}
                className="record-button"
              >
                Start Recording
              </button>
            )}

            {isRecording && (
              <div className="recording-active">
                <div className="recording-indicator">
                  <span className="pulse-dot"></span>
                  Recording...
                </div>
                <button
                  onClick={handleStopRecording}
                  className="stop-button"
                >
                  Stop Recording
                </button>
              </div>
            )}

            {isProcessing && (
              <div className="processing">
                <div className="spinner"></div>
                <p>Processing...</p>
              </div>
            )}
          </div>

          {/* Unified Feedback Card */}
          {!recognizedText && currentAccuracy === null && !isRecording && !isProcessing && (
            <div className="feedback-card-placeholder">
              <p className="placeholder-text">Record your pronunciation to see results</p>
            </div>
          )}

          {(recognizedText || currentAccuracy !== null) && (
            <div 
              className="unified-feedback-card"
              style={{ 
                borderColor: currentAccuracy !== null ? getAccuracyColor(currentAccuracy) : '#E2E8F0',
                borderWidth: currentAccuracy !== null ? '3px' : '2px'
              }}
            >
              {recognizedText && (
                <div className="recognized-text-unified">
                  <span className="recognized-label-unified">Recognized:</span>
                  <span className="recognized-value-unified">"{recognizedText}"</span>
                </div>
              )}
              
              {currentAccuracy !== null && (
                <div 
                  className="accuracy-badge"
                  style={{ backgroundColor: getAccuracyColor(currentAccuracy) }}
                >
                  <span className="accuracy-value-badge">{currentAccuracy}%</span>
                  {confidenceScore !== null && (
                    <span className="confidence-badge">Confidence: {Math.round(confidenceScore * 100)}%</span>
                  )}
                </div>
              )}

              {/* Secondary buttons container */}
              <div className="secondary-buttons-container">
                {previousRecording && recognizedText && (
                  <button
                    onClick={handlePlayRecording}
                    className="play-recording-button-unified"
                    type="button"
                  >
                    <span className="play-icon">▶</span>
                    <span>Play Your Recording</span>
                  </button>
                )}

                {currentAccuracy !== null && (
                  <button
                    onClick={handleTryAgain}
                    className="try-again-button-unified"
                    type="button"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Mobile: Thumb Zone Recording Button - Fixed at bottom */}
        <div className="recording-button-container">
          {!isRecording && !isProcessing && (
            <button
              onClick={handleStartRecording}
              className="record-button-thumb"
            >
              Start Recording
            </button>
          )}

          {isRecording && (
            <button
              onClick={handleStopRecording}
              className="stop-button-thumb"
            >
              Stop Recording
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

