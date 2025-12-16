import { phonemeGroups } from '../data/phonemes';
import './PhonemeGroupList.css';

interface PhonemeGroupListProps {
  onSelect: (groupId: string) => void;
  onBack: () => void;
}

export default function PhonemeGroupList({ onSelect, onBack }: PhonemeGroupListProps) {
  return (
    <div className="phoneme-group-list">
      <div className="group-list-header">
        <button onClick={onBack} className="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Back
        </button>
        <div className="header-content">
          <h1>Select Phoneme Group</h1>
          <p className="subtitle">Choose a group to practice specific sounds</p>
        </div>
      </div>
      
      <div className="group-grid">
        {phonemeGroups.map((group) => (
          <button
            key={group.id}
            onClick={() => onSelect(group.id)}
            className="group-button"
          >
            <h3>{group.name}</h3>
            <p className="group-count">{group.phonemes.length} sounds</p>
          </button>
        ))}
      </div>
    </div>
  );
}

