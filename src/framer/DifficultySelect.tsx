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
      background: darkMode
        ? 'linear-gradient(135deg, #1a0b2e 0%, #16213e 30%, #0f3443 60%, #0d3b3f 100%)'
        : 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 30%, #e0f7fa 60%, #e0f2f1 100%)',
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      width: '100%',
      minHeight: '100%',
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
            color: darkMode ? '#94a3b8' : '#64748b',
            marginBottom: 'clamp(32px, 6vh, 48px)',
            fontWeight: '500'
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
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
                  border: hoveredDifficulty === level
                    ? (darkMode
                      ? '2px solid rgba(99, 102, 241, 0.5)'
                      : '2px solid rgba(59, 130, 246, 0.4)')
                    : (darkMode
                      ? '2px solid rgba(99, 102, 241, 0.25)'
                      : '2px solid rgba(59, 130, 246, 0.25)'),
                  borderRadius: '12px',
                  padding: 'clamp(16px, 3vh, 20px) clamp(24px, 5vw, 32px)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  fontSize: 'clamp(18px, 4vw, 20px)',
                  fontWeight: '600',
                  color: darkMode ? '#a5b4fc' : '#2563eb',
                  width: '100%',
                  maxWidth: 'min(320px, 80vw)',
                  boxShadow: hoveredDifficulty === level
                    ? (darkMode
                      ? '0 8px 20px rgba(99, 102, 241, 0.4)'
                      : '0 8px 20px rgba(59, 130, 246, 0.35)')
                    : (darkMode
                      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(59, 130, 246, 0.15)'),
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  transform: hoveredDifficulty === level ? 'translateY(-2px) scale(1.02)' : 'translateY(0) scale(1)'
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
