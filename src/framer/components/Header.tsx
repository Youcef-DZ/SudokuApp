import React from 'react';
import { getTheme, createGradientTextStyle } from '../shared/theme.ts';
import ThemeToggle from './ThemeToggle.tsx';
import GameTimer from './GameTimer.tsx';
import UserProfile from './UserProfile.tsx';
import NewGameButton from './NewGameButton.tsx';

interface GameHeaderProps {
  onNewGame?: (difficulty?: string) => void;
  onLogin?: () => void;
  onLogout?: () => void;
  primaryColor?: string;
  responsiveCellSize?: number;
  isAuthenticated?: boolean;
  userName?: string;
  userEmail?: string;
  elapsedTime?: number; // in seconds
  darkMode?: boolean;
  onToggleTheme?: () => void;
  title?: string;
  showTimer?: boolean;
  showNewGameButton?: boolean;
  showDivider?: boolean;
  puzzleId?: number;
  difficulty?: string;
  onShowLeaderboard?: () => void;
}

export default function GameHeader({
  onNewGame,
  onLogin,
  onLogout,
  responsiveCellSize = 50,
  isAuthenticated = false,
  userName,
  userEmail,
  elapsedTime = 0,
  darkMode = false,
  onToggleTheme,
  title,
  showTimer = true,
  showNewGameButton = true,
  puzzleId,
  difficulty,
  onShowLeaderboard
}: GameHeaderProps) {
  const theme = getTheme(darkMode);

  // Simple layout for pages without game controls (like difficulty select)
  if (!showTimer && !showNewGameButton && title) {
    return (
      <>
        <div style={{
          padding: '16px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Title - Left */}
          <div style={{
            fontWeight: '700',
            fontSize: '24px',
            ...createGradientTextStyle(theme),
            letterSpacing: '0.5px',
            display: 'inline-block'
          }}>
            {title}
          </div>

          {/* Right Side Buttons */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {onToggleTheme && (
              <ThemeToggle
                darkMode={darkMode}
                onToggle={onToggleTheme}
                responsiveCellSize={responsiveCellSize}
              />
            )}
            <UserProfile
              isAuthenticated={isAuthenticated}
              userName={userName}
              userEmail={userEmail}
              onLogin={onLogin}
              onLogout={onLogout}
              responsiveCellSize={responsiveCellSize}
              darkMode={darkMode}
            />
          </div>
        </div>
      </>
    );
  }

  // Full game layout with timer and controls
  return (
    <>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        alignItems: 'center',
        width: '100%',
        gap: '16px'
      }}>
        {/* Left: New Game Button */}
        <div style={{
          display: 'flex',
          alignItems: 'center'
        }}>
          {showNewGameButton && onNewGame && (
            <NewGameButton
              onNewGame={onNewGame}
              responsiveCellSize={responsiveCellSize}
              darkMode={darkMode}
            />
          )}
        </div>

        {/* Center: Puzzle Info and Timer */}
        {showTimer && (
          <GameTimer
            elapsedTime={elapsedTime}
            puzzleId={puzzleId}
            difficulty={difficulty}
            responsiveCellSize={responsiveCellSize}
            darkMode={darkMode}
          />
        )}

        {/* Right: User Settings */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          {/* Leaderboard Button */}
          {onShowLeaderboard && (
            <button
              onClick={onShowLeaderboard}
              style={{
                padding: `${Math.max(4, responsiveCellSize * 0.12)}px ${Math.max(12, responsiveCellSize * 0.3)}px`,
                fontSize: `${Math.max(16, responsiveCellSize * 0.36)}px`,
                borderRadius: theme.borderRadius.md,
                border: darkMode
                  ? '2px solid rgba(251, 191, 36, 0.4)'
                  : '2px solid rgba(124, 58, 237, 0.3)',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(124, 58, 237, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%)',
                color: darkMode ? '#fbbf24' : '#7c3aed',
                cursor: 'pointer',
                transition: theme.transitions.normal,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '44px',
                height: '44px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                e.currentTarget.style.boxShadow = darkMode
                  ? '0 4px 16px rgba(251, 191, 36, 0.4)'
                  : '0 4px 16px rgba(124, 58, 237, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = darkMode
                  ? '0 2px 8px rgba(251, 191, 36, 0.2)'
                  : '0 2px 8px rgba(124, 58, 237, 0.15)';
              }}
              title="Leaderboard"
            >
              🏆
            </button>
          )}

          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <ThemeToggle
              darkMode={darkMode}
              onToggle={onToggleTheme}
              responsiveCellSize={responsiveCellSize}
            />
          )}

          {/* Auth Section */}
          <UserProfile
            isAuthenticated={isAuthenticated}
            userName={userName}
            userEmail={userEmail}
            onLogin={onLogin}
            onLogout={onLogout}
            responsiveCellSize={responsiveCellSize}
            darkMode={darkMode}
          />
        </div >
      </div >
    </>
  );
}
