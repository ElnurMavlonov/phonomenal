import { useState, useEffect } from 'react';
import { Student, Word } from '../types';
import { getRandomWords } from '../data/words';
import WordPractice from './WordPractice';
import './TestMode.css';

interface TestModeProps {
  onBack: () => void;
}

export default function TestMode({ onBack }: TestModeProps) {
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [recordings, setRecordings] = useState<Record<number, { audioBlob: Blob; accuracy: number }>>({});
  const [testComplete, setTestComplete] = useState(false);

  useEffect(() => {
    // Initialize test with 10 random words
    const testWords = getRandomWords(10);
    setWords(testWords);
    setCurrentWordIndex(0);
    setRecordings({});
    setTestComplete(false);
  }, []);

  const handleRecordingComplete = async (audioBlob: Blob, accuracy: number) => {
    setRecordings(prev => ({
      ...prev,
      [currentWordIndex]: { audioBlob, accuracy }
    }));
  };

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      setTestComplete(true);
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
    }
  };

  const handleRestartTest = () => {
    const testWords = getRandomWords(10);
    setWords(testWords);
    setCurrentWordIndex(0);
    setRecordings({});
    setTestComplete(false);
  };

  if (words.length === 0) {
    return (
      <div className="test-mode">
        <div className="loading">Loading test...</div>
      </div>
    );
  }

  if (testComplete) {
    const totalAccuracy = Object.values(recordings).reduce((sum, r) => sum + r.accuracy, 0) / words.length;
    const completedCount = Object.keys(recordings).length;

    return (
      <div className="test-mode">
        <div className="test-complete-card">
          <div className="complete-header">
            <h1>Test Complete!</h1>
            <p>You've completed all {words.length} words</p>
          </div>
          
          <div className="test-results">
            <div className="result-stat">
              <span className="stat-label">Words Completed</span>
              <span className="stat-value">{completedCount} / {words.length}</span>
            </div>
            {completedCount > 0 && (
              <div className="result-stat">
                <span className="stat-label">Average Accuracy</span>
                <span className="stat-value">{Math.round(totalAccuracy)}%</span>
              </div>
            )}
          </div>

          <div className="test-actions">
            <button onClick={handleRestartTest} className="btn-primary">
              Start New Test
            </button>
            <button onClick={onBack} className="btn-secondary">
              ← Back to Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentWord = words[currentWordIndex];
  const recording = recordings[currentWordIndex];
  
  // Create a mock phoneme for the word (for WordPractice component compatibility)
  const mockPhoneme = {
    symbol: currentWord.phoneme,
    name: currentWord.phoneme,
  };

  return (
    <div className="test-mode">
      <div className="test-header">
        <button onClick={onBack} className="back-button">← Back</button>
        <div>
          <h1>Test Mode</h1>
          <p className="test-subtitle">Random Assessment - Word {currentWordIndex + 1} of {words.length}</p>
        </div>
      </div>

      <WordPractice
        word={currentWord}
        phoneme={mockPhoneme}
        wordNumber={currentWordIndex + 1}
        totalWords={words.length}
        onRecordingComplete={handleRecordingComplete}
        previousRecording={recording}
      />

      <div className="navigation-buttons">
        <button
          onClick={handlePreviousWord}
          disabled={currentWordIndex === 0}
          className="nav-button"
        >
          ← Previous
        </button>
        <span className="word-counter">
          {currentWordIndex + 1} / {words.length}
        </span>
        <button
          onClick={handleNextWord}
          className="nav-button"
        >
          {currentWordIndex === words.length - 1 ? 'Finish Test' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

