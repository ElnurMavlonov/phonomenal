import { useState } from 'react';
import { Student, Phoneme, Word } from '../types';
import { phonemeGroups } from '../data/phonemes';
import { getWordsByPhoneme } from '../data/words';
import PhonemeGroupList from './PhonemeGroupList';
import WordPractice from './WordPractice';
import './PracticeMode.css';

interface PracticeModeProps {
  student: Student;
  onBack: () => void;
}

type PracticeState = 'select-group' | 'select-phoneme' | 'practicing';

export default function PracticeMode({ student, onBack }: PracticeModeProps) {
  const [state, setState] = useState<PracticeState>('select-group');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedPhoneme, setSelectedPhoneme] = useState<Phoneme | null>(null);
  const [words, setWords] = useState<Word[]>([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [recordings, setRecordings] = useState<Record<number, { audioBlob: Blob; accuracy: number }>>({});

  const handleGroupSelect = (groupId: string) => {
    setSelectedGroup(groupId);
    setState('select-phoneme');
  };

  const handlePhonemeSelect = (phoneme: Phoneme) => {
    const wordsForPhoneme = getWordsByPhoneme(phoneme.symbol);
    if (wordsForPhoneme.length > 0) {
      setSelectedPhoneme(phoneme);
      setWords(wordsForPhoneme);
      setCurrentWordIndex(0);
      setRecordings({});
      setState('practicing');
    }
  };

  const handleRecordingComplete = async (audioBlob: Blob, accuracy: number) => {
    setRecordings(prev => ({
      ...prev,
      [currentWordIndex]: { audioBlob, accuracy }
    }));
  };

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    }
  };

  const handlePreviousWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
    }
  };

  const handleBackToPhonemes = () => {
    setState('select-phoneme');
    setSelectedPhoneme(null);
    setWords([]);
    setCurrentWordIndex(0);
    setRecordings({});
  };

  const handleBackToGroups = () => {
    setState('select-group');
    setSelectedGroup(null);
    setSelectedPhoneme(null);
    setWords([]);
    setCurrentWordIndex(0);
    setRecordings({});
  };

  if (state === 'select-group') {
    return <PhonemeGroupList onSelect={handleGroupSelect} onBack={onBack} />;
  }

  if (state === 'select-phoneme' && selectedGroup) {
    const group = phonemeGroups.find(g => g.id === selectedGroup);
    if (!group) return null;
    
    return (
      <div className="practice-mode">
        <div className="practice-header">
          <button onClick={handleBackToGroups} className="back-button">← Back</button>
          <h2>{group.name}</h2>
        </div>
        <div className="phoneme-grid">
          {group.phonemes.map((phoneme) => (
            <button
              key={phoneme.symbol}
              onClick={() => handlePhonemeSelect(phoneme)}
              className="phoneme-button"
            >
              <span className="phoneme-symbol">{phoneme.symbol}</span>
              <span className="phoneme-name">{phoneme.name}</span>
              {phoneme.description && (
                <span className="phoneme-desc">{phoneme.description}</span>
              )}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (state === 'practicing' && selectedPhoneme && words.length > 0) {
    const currentWord = words[currentWordIndex];
    const recording = recordings[currentWordIndex];

    return (
      <div className="practice-mode">
        <div className="practice-header">
          <button onClick={handleBackToPhonemes} className="back-button">← Back</button>
          <div>
            <h2>Practice: {selectedPhoneme.symbol}</h2>
            <p className="phoneme-name">{selectedPhoneme.name}</p>
          </div>
        </div>
        
        <WordPractice
          word={currentWord}
          phoneme={selectedPhoneme}
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
            disabled={currentWordIndex === words.length - 1}
            className="nav-button"
          >
            Next →
          </button>
        </div>
      </div>
    );
  }

  return null;
}

