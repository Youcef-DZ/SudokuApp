import { useState } from 'react';
import Header from './Header.tsx';

interface DifficultySelectProps {
  onSelectDifficulty: (difficulty: 'easy' | 'medium' | 'hard') => void;
  onLogin: () => void;
  isAuthenticated: boolean;
  userName?: string;
  darkMode?: boolean;
  onToggleTheme?: () => void;
}

export default function DifficultySelect({ 
  onSelectDifficulty, 
  onLogin,
  isAuthenticated,
  userName,
  darkMode = false,
  onToggleTheme
}: DifficultySelectProps) {
  const [hoveredDifficulty, setHoveredDifficulty] = useState<string | null>(null);

  const difficulties = [
    { 
      level: 'easy' as const, 
      title: 'Easy', 
      description: 'Perfect for beginners',
      color: '#10b981'
    },
    { 
      level: 'medium' as const, 
      title: 'Medium', 
      description: 'A balanced challenge',
      color: '#3b82f6'
    },
    { 
      level: 'hard' as const, 
      title: 'Hard', 
      description: 'For experienced players',
      color: '#ef4444'
    }
  ];

  const colors = {
    bg: darkMode ? '#1f2937' : '#f3f4f6',
    headerBg: darkMode ? '#111827' : 'white',
    headerBorder: darkMode ? '#374151' : '#e5e7eb',
    headerText: darkMode ? '#f9fafb' : '#1f2937',
    text: darkMode ? '#e5e7eb' : '#1f2937',
    textSecondary: darkMode ? '#9ca3af' : '#6b7280',
    buttonBg: darkMode ? '#374151' : 'white',
    buttonBorder: darkMode ? '#4b5563' : '#e5e7eb',
    buttonHoverBorder: darkMode ? '#60a5fa' : '#3b82f6',
    buttonText: darkMode ? '#f9fafb' : '#1f2937',
    primary: '#3b82f6'
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      padding: '20px',
      backgroundColor: 'transparent',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%',
      height: '100%',
      boxSizing: 'border-box'
    }}>

      <Header
        title="Sudoku"
        onLogin={onLogin}
        isAuthenticated={isAuthenticated}
        userName={userName}
        darkMode={darkMode}
        onToggleTheme={onToggleTheme}
        showTimer={false}
        showNewGameButton={false}
      />

      {/* Main Content */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
      }}>
        <div style={{
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: 'clamp(16px, 4vw, 18px)',
            color: colors.textSecondary,
            marginBottom: 'clamp(24px, 5vh, 48px)'
          }}>
            Select a difficulty level to start playing
          </p>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 'clamp(12px, 2vh, 16px)',
            marginBottom: 'clamp(16px, 3vh, 32px)',
            alignItems: 'center'
          }}>
            {difficulties.map(({ level, title }) => (
              <button
                key={level}
                onClick={() => onSelectDifficulty(level)}
                onMouseEnter={() => setHoveredDifficulty(level)}
                onMouseLeave={() => setHoveredDifficulty(null)}
                style={{
                  backgroundColor: colors.buttonBg,
                  border: `2px solid ${hoveredDifficulty === level ? colors.buttonHoverBorder : colors.buttonBorder}`,
                  borderRadius: '8px',
                  padding: 'clamp(12px, 2.5vh, 16px) clamp(24px, 5vw, 32px)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: 'clamp(16px, 3.5vw, 18px)',
                  fontWeight: '500',
                  color: colors.buttonText,
                  width: '100%',
                  maxWidth: 'min(300px, 80vw)',
                  boxShadow: hoveredDifficulty === level 
                    ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' 
                    : '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
                }}
              >
                {title}
              </button>
            ))}
          </div>

          {!isAuthenticated && (
            <p style={{
              fontSize: 'clamp(12px, 2.5vw, 14px)',
              color: colors.textSecondary,
              marginTop: 'clamp(12px, 2vh, 24px)'
            }}>
              💡 Sign in to save your progress
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
