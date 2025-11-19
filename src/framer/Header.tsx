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
  primaryColor = '#3b82f6', 
  responsiveCellSize = 50,
  isAuthenticated = false,
  userName,
  elapsedTime = 0,
  darkMode = false,
  onToggleTheme,
  title,
  showTimer = true,
  showNewGameButton = true,
  showDivider = true,
  puzzleId,
  difficulty
}: GameHeaderProps) {
  const headerBorder = darkMode ? '#374151' : '#e5e7eb';
  // Simple layout for pages without game controls (like difficulty select)
  if (!showTimer && !showNewGameButton && title) {
    return (
      <>
        <div style={{
        backgroundColor: darkMode ? '#111827' : 'white',
        padding: '12px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Spacer for balance */}
        <div style={{ flex: '1' }} />

        {/* Title - Centered */}
        <div style={{ 
          fontWeight: '600', 
          fontSize: '18px', 
          color: darkMode ? '#f9fafb' : '#1f2937',
          flex: '1',
          textAlign: 'center'
        }}>
          {title}
        </div>

        {/* Right Side Buttons */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '12px',
          flex: '1',
          justifyContent: 'flex-end'
        }}>
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              style={{
                padding: '6px 12px',
                borderRadius: '6px',
                border: darkMode ? '1px solid #4b5563' : '1px solid #d1d5db',
                backgroundColor: darkMode ? '#374151' : 'white',
                color: darkMode ? '#f9fafb' : '#1f2937',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s'
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
                  padding: '6px 12px',
                  borderRadius: '6px',
                  border: darkMode ? '1px solid #4b5563' : '1px solid #d1d5db',
                  backgroundColor: darkMode ? '#374151' : 'white',
                  color: darkMode ? '#f9fafb' : '#1f2937',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500',
                  transition: 'all 0.2s'
                }}
                title="Sign In"
              >
                🔐
              </button>
            )
          ) : (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px' 
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: primaryColor,
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '14px'
              }}>
                {userName ? userName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span style={{ 
                fontSize: '14px', 
                color: darkMode ? '#f9fafb' : '#1f2937',
                fontWeight: '500'
              }}>
                {userName || 'User'}
              </span>
            </div>
          )}
        </div>
      </div>
      {showDivider && (
        <div style={{
          height: '1px',
          background: headerBorder,
          width: '100%'
        }} />
      )}
      </>
    );
  }

  // Full game layout with timer and controls
  return (
    <>
      <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      gap: '12px',
      flexWrap: 'wrap'
    }}>
      {/* Left Side: Game Controls */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* New Game Button */}
        {showNewGameButton && onNewGame && (
          <button
            onClick={onNewGame}
            style={{
              padding: `${Math.max(6, responsiveCellSize * 0.16)}px ${Math.max(12, responsiveCellSize * 0.32)}px`,
              backgroundColor: darkMode ? '#374151' : 'white',
              color: darkMode ? '#f9fafb' : '#1f2937',
              border: darkMode ? '1px solid #4b5563' : '1px solid #d1d5db',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: `${Math.max(14, responsiveCellSize * 0.32)}px`,
              fontWeight: '500',
              transition: 'all 0.2s'
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
        gap: '16px'
      }}>
        {/* Puzzle Info */}
        {(difficulty || puzzleId) && (
          <div style={{
            fontSize: `${Math.max(16, responsiveCellSize * 0.4)}px`,
            color: darkMode ? '#9ca3af' : '#6b7280',
            fontWeight: '500'
          }}>
            {difficulty && <span style={{ textTransform: 'capitalize' }}>{difficulty}</span>}
            {difficulty && puzzleId && <span> • </span>}
            {puzzleId && <span>#{puzzleId}</span>}
          </div>
        )}
        {/* Timer */}
        {showTimer && (
          <div style={{
            fontSize: `${Math.max(16, responsiveCellSize * 0.4)}px`,
            color: darkMode ? '#d1d5db' : '#374151',
            fontWeight: '600'
          }}>
            {<span>⏱︎ </span>}
            {formatTime(elapsedTime)}
          </div>
        )}
      </div>

      {/* Right Side: User Settings */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        {/* Theme Toggle Button */}
        {onToggleTheme && (
          <button
            onClick={onToggleTheme}
            style={{
              padding: `${Math.max(6, responsiveCellSize * 0.16)}px ${Math.max(12, responsiveCellSize * 0.32)}px`,
              borderRadius: '6px',
              border: darkMode ? '1px solid #4b5563' : '1px solid #d1d5db',
              backgroundColor: darkMode ? '#374151' : 'white',
              color: darkMode ? '#f9fafb' : '#1f2937',
              cursor: 'pointer',
              fontSize: `${Math.max(14, responsiveCellSize * 0.32)}px`,
              fontWeight: '500',
              transition: 'all 0.2s'
            }}
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        )}

        {/* Auth Section */}
      {!isAuthenticated ? (
        <button
          onClick={onLogin}
          style={{
            padding: `${Math.max(6, responsiveCellSize * 0.16)}px ${Math.max(12, responsiveCellSize * 0.32)}px`,
            backgroundColor: darkMode ? '#374151' : 'white',
            color: darkMode ? '#f9fafb' : '#1f2937',
            border: darkMode ? '1px solid #4b5563' : '1px solid #d1d5db',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: `${Math.max(14, responsiveCellSize * 0.32)}px`,
            fontWeight: '500',
            transition: 'all 0.2s'
          }}
          title="Sign In"
        >
          🔐
        </button>
      ) : (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <div style={{
              width: `${Math.max(24, responsiveCellSize * 0.6)}px`,
              height: `${Math.max(24, responsiveCellSize * 0.6)}px`,
              borderRadius: '50%',
              backgroundColor: primaryColor,
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: `${Math.max(10, responsiveCellSize * 0.25)}px`
            }}>
              {userName ? userName.charAt(0).toUpperCase() : 'U'}
            </div>
            <span style={{ 
              fontSize: `${Math.max(12, responsiveCellSize * 0.28)}px`,
              color: '#374151',
              fontWeight: '500'
            }}>
              {userName || 'User'}
            </span>
          </div>
          <button
            onClick={onLogout}
            style={{
              padding: `${Math.max(4, responsiveCellSize * 0.12)}px ${Math.max(8, responsiveCellSize * 0.2)}px`,
              backgroundColor: 'transparent',
              color: '#6b7280',
              border: '1px solid #d1d5db',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: `${Math.max(13, responsiveCellSize * 0.3)}px`,
              fontWeight: '500'
            }}
            title="Sign Out"
          >
            🚪
          </button>
        </div>
      )}
      </div>
    </div>
    {showDivider && (
      <div style={{
        height: '1px',
        background: headerBorder,
        width: '100%'
      }} />
    )}
    </>
  );
}
