import React from 'react';

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

function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
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
  const [showDifficultyPopup, setShowDifficultyPopup] = React.useState(false);
  const [showUserPopup, setShowUserPopup] = React.useState(false);
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
            backgroundImage: darkMode
              ? 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 100%)'
              : 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            color: 'transparent',
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
              <button
                onClick={onToggleTheme}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: darkMode
                    ? '2px solid rgba(251, 191, 36, 0.4)'
                    : '2px solid rgba(124, 58, 237, 0.3)',
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(67, 56, 202, 0.1) 100%)',
                  color: darkMode ? '#fcd34d' : '#7c3aed',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: darkMode
                    ? '0 2px 8px rgba(251, 191, 36, 0.2)'
                    : '0 2px 8px rgba(124, 58, 237, 0.15)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.05) rotate(15deg)';
                  e.currentTarget.style.boxShadow = darkMode
                    ? '0 4px 16px rgba(251, 191, 36, 0.4)'
                    : '0 4px 16px rgba(124, 58, 237, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                  e.currentTarget.style.boxShadow = darkMode
                    ? '0 2px 8px rgba(251, 191, 36, 0.2)'
                    : '0 2px 8px rgba(124, 58, 237, 0.15)';
                }}
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            )}
            {!isAuthenticated ? (
              onLogin && (
                <button
                  onClick={onLogin}
                  style={{
                    padding: '10px 16px',
                    borderRadius: '10px',
                    border: darkMode
                      ? '2px solid rgba(99, 102, 241, 0.4)'
                      : '2px solid rgba(59, 130, 246, 0.35)',
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
                    color: darkMode ? '#a5b4fc' : '#2563eb',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: '600',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: darkMode
                      ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                      : '0 2px 8px rgba(59, 130, 246, 0.2)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = darkMode
                      ? '0 4px 16px rgba(99, 102, 241, 0.45)'
                      : '0 4px 16px rgba(59, 130, 246, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = darkMode
                      ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                      : '0 2px 8px rgba(59, 130, 246, 0.2)';
                  }}
                  title="Login"
                >
                  Login
                </button>
              )
            ) : (
              <button
                onClick={() => setShowUserPopup(true)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '10px',
                  border: darkMode
                    ? '2px solid rgba(99, 102, 241, 0.4)'
                    : '2px solid rgba(59, 130, 246, 0.35)',
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
                  color: darkMode ? '#a5b4fc' : '#2563eb',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: darkMode
                    ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                    : '0 2px 8px rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = darkMode
                    ? '0 4px 16px rgba(99, 102, 241, 0.45)'
                    : '0 4px 16px rgba(59, 130, 246, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = darkMode
                    ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                    : '0 2px 8px rgba(59, 130, 246, 0.2)';
                }}
                title={userName || 'User Profile'}
              >
                {userName ? userName.split(' ').map(n => n.charAt(0).toUpperCase()).join('') : 'U'}
              </button>
            )}
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
          {/* New Game Button */}
          {showNewGameButton && onNewGame && (
            <button
              onClick={() => setShowDifficultyPopup(true)}
              style={{
                padding: `${Math.max(4, responsiveCellSize * 0.12)}px ${Math.max(12, responsiveCellSize * 0.3)}px`,
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
                color: darkMode ? '#a5b4fc' : '#2563eb',
                border: darkMode
                  ? '1px solid rgba(99, 102, 241, 0.4)'
                  : '1px solid rgba(59, 130, 246, 0.35)',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: `${Math.max(14, responsiveCellSize * 0.32)}px`,
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: darkMode
                  ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                  : '0 2px 8px rgba(59, 130, 246, 0.2)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = darkMode
                  ? '0 4px 16px rgba(99, 102, 241, 0.45)'
                  : '0 4px 16px rgba(59, 130, 246, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = darkMode
                  ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                  : '0 2px 8px rgba(59, 130, 246, 0.2)';
              }}
              title="New Puzzle"
            >
              🔄
            </button>
          )}
        </div>

        {/* Center: Puzzle Info and Timer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}>
          {/* Puzzle Info */}
          {(difficulty || puzzleId) && (
            <div style={{
              fontSize: `${Math.max(12, responsiveCellSize * 0.3)}px`,
              color: darkMode ? '#a5b4fc' : '#2563eb',
              fontWeight: '600',
              background: darkMode
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(56, 189, 248, 0.12) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(14, 165, 233, 0.1) 100%)',
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid transparent',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              whiteSpace: 'nowrap'
            }}>
              {difficulty && <span style={{ textTransform: 'capitalize' }}>{difficulty}</span>}
              {difficulty && puzzleId && <span> • </span>}
              {puzzleId && <span>#{puzzleId}</span>}
            </div>
          )}

          {/* Timer */}
          {showTimer && (
            <div style={{
              fontSize: `${Math.max(13, responsiveCellSize * 0.32)}px`,
              color: darkMode ? '#f0abfc' : '#c026d3',
              fontWeight: '700',
              background: darkMode
                ? 'linear-gradient(135deg, rgba(244, 114, 182, 0.15) 0%, rgba(192, 38, 211, 0.15) 100%)'
                : 'linear-gradient(135deg, rgba(244, 114, 182, 0.1) 0%, rgba(192, 38, 211, 0.1) 100%)',
              padding: '4px 12px',
              borderRadius: '6px',
              border: '1px solid transparent',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              whiteSpace: 'nowrap'
            }}>
              {<span>⏱︎ </span>}
              {formatTime(elapsedTime)}
            </div>
          )}
        </div>

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
                borderRadius: '10px',
                border: darkMode
                  ? '1px solid rgba(251, 191, 36, 0.4)'
                  : '1px solid rgba(124, 58, 237, 0.3)',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(67, 56, 202, 0.1) 100%)',
                color: darkMode ? '#fcd34d' : '#7c3aed',
                cursor: 'pointer',
                fontSize: `${Math.max(16, responsiveCellSize * 0.36)}px`,
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: darkMode
                  ? '0 2px 8px rgba(251, 191, 36, 0.2)'
                  : '0 2px 8px rgba(124, 58, 237, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
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
            <button
              onClick={onToggleTheme}
              style={{
                padding: `${Math.max(4, responsiveCellSize * 0.12)}px ${Math.max(12, responsiveCellSize * 0.3)}px`,
                borderRadius: '10px',
                border: darkMode
                  ? '1px solid rgba(251, 191, 36, 0.4)'
                  : '1px solid rgba(124, 58, 237, 0.3)',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(245, 158, 11, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(124, 58, 237, 0.1) 0%, rgba(67, 56, 202, 0.1) 100%)',
                color: darkMode ? '#fcd34d' : '#7c3aed',
                cursor: 'pointer',
                fontSize: `${Math.max(16, responsiveCellSize * 0.36)}px`,
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: darkMode
                  ? '0 2px 8px rgba(251, 191, 36, 0.2)'
                  : '0 2px 8px rgba(124, 58, 237, 0.15)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.05) rotate(15deg)';
                e.currentTarget.style.boxShadow = darkMode
                  ? '0 4px 16px rgba(251, 191, 36, 0.4)'
                  : '0 4px 16px rgba(124, 58, 237, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1) rotate(0deg)';
                e.currentTarget.style.boxShadow = darkMode
                  ? '0 2px 8px rgba(251, 191, 36, 0.2)'
                  : '0 2px 8px rgba(124, 58, 237, 0.15)';
              }}
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          )}

          {/* Auth Section */}
          {!isAuthenticated ? (
            onLogin && (
              <button
                onClick={onLogin}
                style={{
                  padding: `${Math.max(4, responsiveCellSize * 0.12)}px ${Math.max(12, responsiveCellSize * 0.3)}px`,
                  borderRadius: '10px',
                  border: darkMode
                    ? '1px solid rgba(99, 102, 241, 0.4)'
                    : '1px solid rgba(59, 130, 246, 0.35)',
                  background: darkMode
                    ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
                    : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
                  color: darkMode ? '#a5b4fc' : '#2563eb',
                  cursor: 'pointer',
                  fontSize: `${Math.max(16, responsiveCellSize * 0.36)}px`,
                  fontWeight: '600',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: darkMode
                    ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                    : '0 2px 8px rgba(59, 130, 246, 0.2)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                  e.currentTarget.style.boxShadow = darkMode
                    ? '0 4px 16px rgba(99, 102, 241, 0.45)'
                    : '0 4px 16px rgba(59, 130, 246, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = darkMode
                    ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                    : '0 2px 8px rgba(59, 130, 246, 0.2)';
                }}
                title="Login"
              >
                Login
              </button >
            )
          ) : (
            <button
              onClick={() => setShowUserPopup(true)}
              style={{
                padding: `${Math.max(4, responsiveCellSize * 0.12)}px ${Math.max(12, responsiveCellSize * 0.3)}px`,
                borderRadius: '10px',
                border: darkMode
                  ? '1px solid rgba(99, 102, 241, 0.4)'
                  : '1px solid rgba(59, 130, 246, 0.35)',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
                color: darkMode ? '#a5b4fc' : '#2563eb',
                cursor: 'pointer',
                fontSize: `${Math.max(16, responsiveCellSize * 0.36)}px`,
                fontWeight: '600',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: darkMode
                  ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                  : '0 2px 8px rgba(59, 130, 246, 0.2)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                e.currentTarget.style.boxShadow = darkMode
                  ? '0 4px 16px rgba(99, 102, 241, 0.45)'
                  : '0 4px 16px rgba(59, 130, 246, 0.35)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                e.currentTarget.style.boxShadow = darkMode
                  ? '0 2px 8px rgba(99, 102, 241, 0.25)'
                  : '0 2px 8px rgba(59, 130, 246, 0.2)';
              }}
              title={userName || 'User Profile'}
            >
              {userName ? userName.split(' ').map(n => n.charAt(0).toUpperCase()).join('') : 'U'}
            </button>
          )
          }
        </div >
      </div >

      {/* Difficulty Selection Popup */}
      {showDifficultyPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            padding: '32px',
            borderRadius: '24px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
            backdropFilter: 'blur(10px)',
            maxWidth: '90%',
            width: '400px',
            position: 'relative'
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowDifficultyPopup(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                color: darkMode ? '#94a3b8' : '#64748b',
                cursor: 'pointer',
                padding: '4px 8px',
                lineHeight: '1',
                transition: 'color 0.2s',
                fontWeight: '300'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = darkMode ? '#fff' : '#000'}
              onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#94a3b8' : '#64748b'}
              aria-label="Close"
            >
              ✕
            </button>

            <h2 style={{
              fontSize: '28px',
              marginBottom: '16px',
              background: darkMode
                ? 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '800'
            }}>
              Select Difficulty
            </h2>

            <p style={{
              fontSize: '16px',
              color: darkMode ? '#94a3b8' : '#64748b',
              marginBottom: '24px',
              fontWeight: '500'
            }}>
              Choose a difficulty level for your next puzzle
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {['Easy', 'Medium', 'Hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => {
                    setShowDifficultyPopup(false);
                    onNewGame?.(level.toLowerCase());
                  }}
                  style={{
                    padding: '16px 32px',
                    fontSize: '18px',
                    fontWeight: '600',
                    background: darkMode
                      ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(56, 189, 248, 0.15) 100%)'
                      : 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(14, 165, 233, 0.12) 100%)',
                    border: darkMode
                      ? '2px solid rgba(99, 102, 241, 0.25)'
                      : '2px solid rgba(59, 130, 246, 0.25)',
                    color: darkMode ? '#a5b4fc' : '#2563eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    boxShadow: darkMode
                      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(59, 130, 246, 0.15)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.border = darkMode
                      ? '2px solid rgba(99, 102, 241, 0.5)'
                      : '2px solid rgba(59, 130, 246, 0.4)';
                    e.currentTarget.style.boxShadow = darkMode
                      ? '0 8px 20px rgba(99, 102, 241, 0.4)'
                      : '0 8px 20px rgba(59, 130, 246, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.border = darkMode
                      ? '2px solid rgba(99, 102, 241, 0.25)'
                      : '2px solid rgba(59, 130, 246, 0.25)';
                    e.currentTarget.style.boxShadow = darkMode
                      ? '0 2px 8px rgba(0, 0, 0, 0.3)'
                      : '0 2px 8px rgba(59, 130, 246, 0.15)';
                  }}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Profile Popup */}
      {showUserPopup && isAuthenticated && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: darkMode ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: darkMode ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            padding: '32px',
            borderRadius: '24px',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
            border: darkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.05)',
            backdropFilter: 'blur(10px)',
            maxWidth: '90%',
            width: '400px',
            position: 'relative'
          }}>
            {/* Close button */}
            <button
              onClick={() => setShowUserPopup(false)}
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'transparent',
                border: 'none',
                fontSize: '24px',
                color: darkMode ? '#94a3b8' : '#64748b',
                cursor: 'pointer',
                padding: '4px 8px',
                lineHeight: '1',
                transition: 'color 0.2s',
                fontWeight: '300'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = darkMode ? '#fff' : '#000'}
              onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#94a3b8' : '#64748b'}
              aria-label="Close"
            >
              ✕
            </button>

            {/* User Avatar */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: darkMode
                ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.3) 0%, rgba(56, 189, 248, 0.3) 100%)'
                : 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(14, 165, 233, 0.2) 100%)',
              border: darkMode
                ? '3px solid rgba(99, 102, 241, 0.5)'
                : '3px solid rgba(59, 130, 246, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '32px',
              fontWeight: '700',
              color: darkMode ? '#a5b4fc' : '#2563eb',
              margin: '0 auto 20px'
            }}>
              {userName ? userName.split(' ').map(n => n.charAt(0).toUpperCase()).join('') : 'U'}
            </div>

            <h2 style={{
              fontSize: '24px',
              marginBottom: '8px',
              background: darkMode
                ? 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 100%)'
                : 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: '700'
            }}>
              {userName || 'User'}
            </h2>

            {userEmail && (
              <p style={{
                fontSize: '16px',
                color: darkMode ? '#94a3b8' : '#64748b',
                marginBottom: '24px',
                fontWeight: '500'
              }}>
                {userEmail}
              </p>
            )}

            <button
              onClick={() => {
                setShowUserPopup(false);
                onLogout?.();
              }}
              style={{
                padding: '14px 32px',
                fontSize: '16px',
                fontWeight: '600',
                background: darkMode
                  ? 'linear-gradient(135deg, rgba(239, 68, 68, 0.2) 0%, rgba(220, 38, 38, 0.2) 100%)'
                  : 'linear-gradient(135deg, rgba(254, 202, 202, 0.8) 0%, rgba(252, 165, 165, 0.8) 100%)',
                color: darkMode ? '#fca5a5' : '#dc2626',
                border: darkMode
                  ? '2px solid rgba(239, 68, 68, 0.4)'
                  : '2px solid rgba(220, 38, 38, 0.3)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: darkMode
                  ? '0 2px 8px rgba(239, 68, 68, 0.2)'
                  : '0 2px 8px rgba(220, 38, 38, 0.15)',
                width: '100%'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)';
                e.currentTarget.style.boxShadow = darkMode
                  ? '0 8px 20px rgba(239, 68, 68, 0.35)'
                  : '0 8px 20px rgba(220, 38, 38, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = darkMode
                  ? '0 2px 8px rgba(239, 68, 68, 0.2)'
                  : '0 2px 8px rgba(220, 38, 38, 0.15)';
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </>
  );
}
