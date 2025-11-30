interface GameHeaderProps {
  onNewGame?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  primaryColor?: string;
  responsiveCellSize?: number;
  isAuthenticated?: boolean;
  userName?: string;
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
  responsiveCellSize = 50,
  isAuthenticated = false,
  userName,
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
            background: darkMode
              ? 'linear-gradient(135deg, #a5b4fc 0%, #38bdf8 100%)'
              : 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.5px'
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
                  title="Settings & Login"
                >
                  ⚙️
                </button>
              )
            ) : (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '8px 16px',
                borderRadius: '10px',
                background: darkMode
                  ? 'rgba(99, 102, 241, 0.1)'
                  : 'rgba(59, 130, 246, 0.08)',
                border: darkMode
                  ? '1px solid rgba(99, 102, 241, 0.2)'
                  : '1px solid rgba(59, 130, 246, 0.15)'
              }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: darkMode
                    ? 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)'
                    : 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
                }}>
                  {userName ? userName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span style={{
                  fontSize: '15px',
                  color: darkMode ? '#a5b4fc' : '#2563eb',
                  fontWeight: '600'
                }}>
                  {userName || 'User'}
                </span>
              </div>
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
              onClick={onNewGame}
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
                title="Settings & Login"
              >
                ⚙️
              </button >
            )
          ) : (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: `${Math.max(10, responsiveCellSize * 0.2)}px`,
              padding: `${Math.max(8, responsiveCellSize * 0.16)}px ${Math.max(16, responsiveCellSize * 0.32)}px`,
              borderRadius: '10px',
              background: darkMode
                ? 'rgba(99, 102, 241, 0.1)'
                : 'rgba(59, 130, 246, 0.08)',
              border: darkMode
                ? '1px solid rgba(99, 102, 241, 0.2)'
                : '1px solid rgba(59, 130, 246, 0.15)'
            }}>
              <div style={{
                width: `${Math.max(28, responsiveCellSize * 0.6)}px`,
                height: `${Math.max(28, responsiveCellSize * 0.6)}px`,
                borderRadius: '50%',
                background: darkMode
                  ? 'linear-gradient(135deg, #6366f1 0%, #38bdf8 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #0ea5e9 100%)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: `${Math.max(12, responsiveCellSize * 0.28)}px`,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}>
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{
                fontSize: `${Math.max(14, responsiveCellSize * 0.3)}px`,
                color: darkMode ? '#a5b4fc' : '#2563eb',
                fontWeight: '600'
              }}>
                {userName || 'User'}
              </span>
            </div>
          )
          }
        </div >
      </div >
    </>
  );
}
