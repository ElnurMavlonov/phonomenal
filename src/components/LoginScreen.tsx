import { useState } from 'react';
import { Student } from '../types';
import './LoginScreen.css';

interface LoginScreenProps {
  onLogin: (student: Student) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
  const [name, setName] = useState('');
  const [id, setId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && id.trim()) {
      onLogin({ name: name.trim(), id: id.trim() });
    }
  };

  return (
    <div className="login-screen">
      <div className="login-card">
        <h1>Phonomenal</h1>
        <p className="subtitle">IPA Sound Practice & Assessment</p>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Student Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label htmlFor="id">Student ID</label>
            <input
              id="id"
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="Enter your ID"
              required
            />
          </div>
          <button type="submit" className="btn-primary" disabled={!name.trim() || !id.trim()}>
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

