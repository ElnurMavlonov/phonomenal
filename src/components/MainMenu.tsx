import { Student } from '../types';
import './MainMenu.css';

interface MainMenuProps {
  student: Student;
  onPractice: () => void;
  onTest: () => void;
}

export default function MainMenu({ student, onPractice, onTest }: MainMenuProps) {
  return (
    <div className="main-menu">
      <div className="menu-card">
        <div className="welcome-section">
          <h1>Welcome, {student.name}!</h1>
          <p className="student-id">ID: {student.id}</p>
        </div>
        
        <div className="menu-options">
          <button onClick={onPractice} className="menu-button practice-button">
            <span className="button-icon"></span>
            <span className="button-text">
              <strong>Practice Mode</strong>
              <small>Learn specific sounds</small>
            </span>
          </button>
          
          <button onClick={onTest} className="menu-button test-button">
            <span className="button-icon"></span>
            <span className="button-text">
              <strong>Test Mode</strong>
              <small>Random assessment</small>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

