import { useState } from 'react';
import { Student } from './types';
import LoginScreen from './components/LoginScreen';
import MainMenu from './components/MainMenu';
import PracticeMode from './components/PracticeMode';
import TestMode from './components/TestMode';
import SpeechRecognitionWarning from './components/SpeechRecognitionWarning';
import './App.css';

type AppState = 'login' | 'menu' | 'practice' | 'test';

function App() {
  const [state, setState] = useState<AppState>('login');
  const [student, setStudent] = useState<Student | null>(null);

  const handleLogin = (loggedInStudent: Student) => {
    setStudent(loggedInStudent);
    setState('menu');
  };

  const handlePractice = () => {
    setState('practice');
  };

  const handleTest = () => {
    setState('test');
  };

  const handleBackToMenu = () => {
    setState('menu');
  };

  return (
    <div className="app">
      <SpeechRecognitionWarning />
      {state === 'login' && <LoginScreen onLogin={handleLogin} />}
      {state === 'menu' && student && (
        <MainMenu
          student={student}
          onPractice={handlePractice}
          onTest={handleTest}
        />
      )}
      {state === 'practice' && student && (
        <PracticeMode onBack={handleBackToMenu} student={student} />
      )}
      {state === 'test' && student && (
        <TestMode onBack={handleBackToMenu} student={student} />
      )}
    </div>
  );
}

export default App;

