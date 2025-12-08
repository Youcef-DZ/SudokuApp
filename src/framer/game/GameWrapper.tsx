import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useDescope, useSession, useUser } from '@descope/react-sdk';
import SudokuGame from './SudokuGame.tsx';
import LoginPage from '../components/LoginPage.tsx';
import Leaderboard from '../components/Leaderboard.tsx';
import { fetchPuzzlesFromNotion } from '../data/Database.tsx';
import type { SudokuGameProps, Difficulty } from '../types/types.ts';

const projectId = "P35AlPWcTE6gN9hXrEFjboLuqX8T";


interface GameWrapperProps extends Omit<SudokuGameProps, 'isAuthenticated' | 'userName' | 'onLogin' | 'onLogout' | 'difficulty'> {
  // Optional: Allow overriding auth handlers from parent (for local dev)
  onLoginOverride?: () => void;
  onLogoutOverride?: () => void;
  // Optional: Skip difficulty selection and start directly with a difficulty
  startWithDifficulty?: Difficulty;
  // Optional: Enable dark mode
  darkMode?: boolean;
}

// Helper function to extract username from Descope user object or session token
const getUserName = (user: any, sessionToken: any): string | undefined => {
  console.log('🔍 getUserName DEBUG:');
  console.log('  user value:', user);
  console.log('  user type:', typeof user);
  console.log('  sessionToken value:', sessionToken);
  console.log('  sessionToken type:', typeof sessionToken);

  // First try to get from user object
  if (user) {
    console.log('✅ User object exists!');
    console.log('  Full user object:', JSON.stringify(user, null, 2));
    console.log('  user.givenName:', user.givenName);
    console.log('  user.name:', user.name);
    console.log('  user.email:', user.email);
    console.log('  user.loginIds:', user.loginIds);

    const username = user.givenName || user.name || user.email || user.loginIds?.[0];
    if (username) {
      console.log('✅ Extracted username from user:', username);
      return username;
    }
  }

  // If user object is null, try to extract from session token claims
  if (sessionToken && typeof sessionToken === 'object') {
    console.log('✅ SessionToken exists!');
    console.log('  Full session token:', sessionToken);
    // JWT tokens have claims that might include user info
    // Common claims: email, name, given_name, family_name, sub (subject/userId)
    const tokenObj = sessionToken as any;
    const username = tokenObj.given_name || tokenObj.name || tokenObj.email || tokenObj.sub;
    if (username) {
      console.log('✅ Extracted username from session token:', username);
      return username;
    }
  }

  console.log('❌ Could not extract username - both user and sessionToken are empty/invalid');
  return undefined;
};

// Internal component that uses Descope hooks
function GameWithAuth(props: GameWrapperProps) {
  const { onLoginOverride, onLogoutOverride, startWithDifficulty, darkMode: darkModeProp = false, ...gameProps } = props;
  const { isAuthenticated, sessionToken } = useSession();
  const { user } = useUser();
  const { logout, refresh } = useDescope();

  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(startWithDifficulty || null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showDifficultyPopup, setShowDifficultyPopup] = useState(!startWithDifficulty);
  const [darkMode, setDarkMode] = useState(darkModeProp);

  // Extract username with proper fallback logic from both user object and session token
  const userName = getUserName(user, sessionToken);
  
  // Extract email from user object or session token
  const userEmail = user?.email || (sessionToken as any)?.email;

  // Preload puzzles immediately on component mount
  useEffect(() => {
    console.log('🎲 Preloading puzzles...');
    fetchPuzzlesFromNotion().then(() => {
      console.log('✅ Puzzles preloaded and cached');
    }).catch((error) => {
      console.error('❌ Failed to preload puzzles:', error);
    });
  }, []);

  // Debug log when auth state changes
  useEffect(() => {
    console.log('=== Auth State Changed ===');
    console.log('isAuthenticated:', isAuthenticated);
    console.log('userName:', userName);
    console.log('hasUser:', !!user);
    console.log('hasSessionToken:', !!sessionToken);
    if (sessionToken && typeof sessionToken === 'object') {
      console.log('sessionToken claims:', {
        sub: (sessionToken as any).sub,
        email: (sessionToken as any).email,
        name: (sessionToken as any).name,
        given_name: (sessionToken as any).given_name,
        family_name: (sessionToken as any).family_name
      });
    }
  }, [isAuthenticated, userName, user, sessionToken]);

  // Additional debug: log whenever popup states change
  useEffect(() => {
    console.log('📍 Popup State: showLoginPopup =', showLoginPopup, ', showDifficultyPopup =', showDifficultyPopup);
  }, [showLoginPopup, showDifficultyPopup]);

  // Handle OAuth redirect: When user returns from OAuth provider (like Google),
  // we need to show the login popup so Descope component can process the callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.has('code') || urlParams.has('state');
    
    if (hasOAuthParams) {
      console.log('🔄 OAuth redirect detected, ensuring login popup is shown...');
      
      // CRITICAL: Show login popup so Descope component can process OAuth callback
      if (!showLoginPopup) {
        setShowLoginPopup(true);
      }
      
      // Give Descope time to process the OAuth callback, then clean URL
      const timer = setTimeout(() => {
        console.log('🔄 Cleaning OAuth params from URL...');
        window.history.replaceState({}, document.title, window.location.pathname);
        
        // Trigger a refresh to ensure session is loaded
        refresh().then(() => {
          console.log('✅ Session refreshed after OAuth');
        });
      }, 2000); // Wait 2 seconds for Descope to fully process
      
      return () => clearTimeout(timer);
    }
  }, [refresh, showLoginPopup]);
  
  // Separate effect to close login popup when auth completes and show difficulty popup
  useEffect(() => {
    // If we're authenticated and login popup is showing, close it and show difficulty
    if (isAuthenticated && showLoginPopup) {
      console.log('✅ Auth successful, closing login popup and showing difficulty...');
      setShowLoginPopup(false);
      if (!selectedDifficulty) {
        setShowDifficultyPopup(true);
      }
    }
  }, [isAuthenticated, showLoginPopup, selectedDifficulty]);

  // Show login popup on initial load if not authenticated and no difficulty selected
  useEffect(() => {
    // Check if we're processing OAuth (don't auto-show login if OAuth is in progress)
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.has('code') || urlParams.has('state');
    
    if (!hasOAuthParams && !isAuthenticated && !showLoginPopup && !selectedDifficulty) {
      console.log('🔑 Not authenticated on initial load, showing login popup...');
      setShowLoginPopup(true);
    } else if (isAuthenticated && !selectedDifficulty && !showDifficultyPopup) {
      console.log('✅ Already authenticated, showing difficulty popup...');
      setShowDifficultyPopup(true);
    }
  }, [isAuthenticated]);


  const toggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const handleLogin = useCallback(() => {
    if (onLoginOverride) {
      onLoginOverride();
    } else {
      setShowLoginPopup(true);
    }
  }, [onLoginOverride]);
  // Effect to watch for auth changes after login (for non-OAuth flows)
  useEffect(() => {
    if (isAuthenticated && showLoginPopup) {
      console.log('✅ Auth state detected, closing login popup...');
      setShowLoginPopup(false);
      if (!selectedDifficulty) {
        setShowDifficultyPopup(true);
      }
    }
  }, [isAuthenticated, showLoginPopup, selectedDifficulty]);

  const handleLoginSuccess = useCallback(async () => {
    console.log('🔄 Login successful, waiting for auth state to update...');
    
    // The Descope component has already persisted tokens
    // Just refresh the session and the useEffect above will close the modal when auth updates
    await refresh();
    
    console.log('✅ Session refreshed, waiting for auth hooks to update...');
  }, [refresh]);

  const handleSkipLogin = useCallback(() => {
    console.log('⏭️ User skipped login');
    setShowLoginPopup(false);
    setShowDifficultyPopup(true);
  }, []);

  const handleDifficultySelect = useCallback((difficulty: Difficulty) => {
    console.log('🎯 Difficulty selected:', difficulty);
    setSelectedDifficulty(difficulty);
    setShowDifficultyPopup(false);
  }, []);

  const [hoveredDifficulty, setHoveredDifficulty] = useState<string | null>(null);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const difficulties = [
    { level: 'easy' as const, title: 'Easy' },
    { level: 'medium' as const, title: 'Medium' },
    { level: 'hard' as const, title: 'Hard' }
  ];

  // Show game board only after difficulty is selected, with popups overlaid
  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      background: darkMode
        ? 'linear-gradient(135deg, #1a0b2e 0%, #16213e 30%, #0f3443 60%, #0d3b3f 100%)'
        : 'linear-gradient(135deg, #eff6ff 0%, #e0f2fe 30%, #e0f7fa 60%, #e0f2f1 100%)'
    }}>
      {/* Game board (only rendered after difficulty is selected) */}
      {selectedDifficulty && (
        <SudokuGame
          {...gameProps}
          difficulty={selectedDifficulty}
          isAuthenticated={isAuthenticated}
          userName={userName}
          userEmail={userEmail}
          darkMode={darkMode}
          onToggleTheme={toggleTheme}
          onLogin={handleLogin}
          onLogout={onLogoutOverride || (() => {
            console.log('🚪 Logout button clicked');
            logout();
            console.log('✅ Logout completed');
            // Reset game state on logout
            setSelectedDifficulty(null);
            setShowDifficultyPopup(true);
          })}
        />
      )}

      {/* Login Popup */}
      {showLoginPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '450px',
            width: '100%',
            position: 'relative'
          }}>
            <LoginPage
              darkMode={darkMode}
              onSuccess={handleLoginSuccess}
              onBack={handleSkipLogin}
            />
          </div>
        </div>
      )}

      {/* Difficulty Selection Popup */}
      {showDifficultyPopup && !showLoginPopup && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          boxSizing: 'border-box'
        }}>
          <div style={{
            maxWidth: '500px',
            width: '100%',
            backgroundColor: darkMode ? '#1f2937' : 'white',
            borderRadius: '16px',
            padding: '40px',
            boxShadow: darkMode
              ? '0 20px 50px rgba(0, 0, 0, 0.5)'
              : '0 20px 50px rgba(0, 0, 0, 0.15)',
            boxSizing: 'border-box',
            textAlign: 'center',
            fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
          }}>
            <h2 style={{
              fontSize: '28px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: darkMode ? '#e5e7eb' : '#1f2937'
            }}>
              Select Difficulty
            </h2>
            
            <p style={{
              fontSize: '16px',
              color: darkMode ? '#9ca3af' : '#6b7280',
              marginBottom: '32px',
              fontWeight: '500'
            }}>
              Choose a difficulty level to start playing
            </p>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '24px',
              alignItems: 'center'
            }}>
              {difficulties.map(({ level, title }) => (
                <button
                  key={level}
                  onClick={() => handleDifficultySelect(level)}
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
                    padding: '18px 32px',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    fontSize: '20px',
                    fontWeight: '600',
                    color: darkMode ? '#a5b4fc' : '#2563eb',
                    width: '100%',
                    maxWidth: '320px',
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

              <button
                onClick={() => setShowLeaderboard(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '15px',
                  fontWeight: '600',
                  color: darkMode ? '#94a3b8' : '#64748b',
                  cursor: 'pointer',
                  marginTop: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  transition: 'all 0.2s',
                  justifyContent: 'center'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                🏆 View Leaderboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <Leaderboard
          darkMode={darkMode}
          onClose={() => setShowLeaderboard(false)}
        />
      )}
    </div>
  );
}

// This wrapper works in both local dev and Framer
// In local dev: nested AuthProviders with same projectId is safe
// In Framer: provides the required AuthProvider context
export default function GameWrapper(props: GameWrapperProps) {
  return (
    <AuthProvider
      projectId={projectId}
      persistTokens={true}
      sessionTokenViaCookie={true}
    >
      <GameWithAuth {...props} />
    </AuthProvider>
  );
}
