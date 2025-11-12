interface GameHeaderProps {
  onNewGame?: () => void;
  onLogin?: () => void;
  onLogout?: () => void;
  primaryColor?: string;
  responsiveCellSize?: number;
  boardSize?: number;
  isAuthenticated?: boolean;
  userName?: string;
  elapsedTime?: number; // in seconds
  darkMode?: boolean;
  onToggleTheme?: () => void;
  title?: string;
  showTimer?: boolean;
  showNewGameButton?: boolean;
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
  boardSize,
  isAuthenticated = false,
  userName,
  elapsedTime = 0,
  darkMode = false,
  onToggleTheme,
  title,
  showTimer = true,
  showNewGameButton = true
}: GameHeaderProps) {
  // Simple layout for pages without game controls (like difficulty select)
  if (!showTimer && !showNewGameButton && title) {
    return (
      <div style={{
        backgroundColor: darkMode ? '#111827' : 'white',
        borderBottom: darkMode ? '1px solid #374151' : '1px solid #e5e7eb',
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
    );
  }

  // Full game layout with timer and controls
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      maxWidth: boardSize,
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

      {/* Center: Timer */}
      {showTimer && (
        <div style={{
          fontSize: `${Math.max(16, responsiveCellSize * 0.4)}px`,
          color: darkMode ? '#d1d5db' : '#374151',
          fontWeight: '600'
        }}>
          {formatTime(elapsedTime)}
        </div>
      )}

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
  );
}
