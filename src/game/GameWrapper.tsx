import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useDescope, useSession, useUser } from '@descope/react-sdk';
import SudokuGame from './SudokuGame.tsx';
import Leaderboard from '../components/Leaderboard.tsx';
import DifficultySelector from '../components/DifficultySelector.tsx';
import LoginModal from '../components/LoginModal.tsx';
import { fetchPuzzlesFromNotion } from '../data/Database.tsx';
import type { SudokuGameProps, Difficulty } from '../shared/types.ts';
import { getTheme, createPopupOverlayStyle } from '../shared/theme.ts';

const projectId = "P35AlPWcTE6gN9hXrEFjboLuqX8T";

interface GameWrapperProps extends Omit<SudokuGameProps, 'isAuthenticated' | 'userName' | 'onLogin' | 'onLogout' | 'difficulty'> {
  onLoginOverride?: () => void;
  onLogoutOverride?: () => void;
  startWithDifficulty?: Difficulty;
  darkMode?: boolean;
}

// Helper function to extract username from Descope user object or session token
const getUserName = (user: any, sessionToken: any): string | undefined => {
  console.log('🔍 getUserName DEBUG:');
  console.log('  user value:', user);
  console.log('  user type:', typeof user);
  console.log('  sessionToken value:', sessionToken);
  console.log('  sessionToken type:', typeof sessionToken);

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

  if (sessionToken && typeof sessionToken === 'object') {
    console.log('✅ SessionToken exists!');
    console.log('  Full session token:', sessionToken);
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
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const userName = getUserName(user, sessionToken);
  const userEmail = user?.email || (sessionToken as any)?.email;
  const theme = getTheme(darkMode);

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

  // Handle OAuth redirect
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.has('code') || urlParams.has('state');

    if (hasOAuthParams) {
      console.log('🔄 OAuth redirect detected, ensuring login popup is shown...');

      if (!showLoginPopup) {
        setShowLoginPopup(true);
      }

      const timer = setTimeout(() => {
        console.log('🔄 Cleaning OAuth params from URL...');
        window.history.replaceState({}, document.title, window.location.pathname);

        refresh().then(() => {
          console.log('✅ Session refreshed after OAuth');
        });
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [refresh, showLoginPopup]);

  // Close login popup when auth completes
  useEffect(() => {
    if (isAuthenticated && showLoginPopup) {
      console.log('✅ Auth successful, closing login popup and showing difficulty...');
      setShowLoginPopup(false);
      if (!selectedDifficulty) {
        setShowDifficultyPopup(true);
      }
    }
  }, [isAuthenticated, showLoginPopup, selectedDifficulty]);

  // Show login popup on initial load if not authenticated
  useEffect(() => {
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

  const handleLoginSuccess = useCallback(async (e: any) => {
    console.log('🎉 Descope Login successful!');
    console.log('User from event:', e.detail.user);
    console.log('Waiting for session refresh...');

    await refresh();

    console.log('Session refresh complete');
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

  // Show game board only after difficulty is selected, with popups overlaid
  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      background: theme.gradients.background
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
            setSelectedDifficulty(null);
            setShowDifficultyPopup(true);
          })}
        />
      )}

      {/* Login Popup */}
      {showLoginPopup && (
        <LoginModal
          onSuccess={handleLoginSuccess}
          onError={(e) => {
            console.error('❌ Descope Login error:', e);
            console.error('Error detail:', e.detail);
          }}
          onSkip={handleSkipLogin}
          darkMode={darkMode}
        />
      )}

      {/* Difficulty Selection Popup */}
      {showDifficultyPopup && !showLoginPopup && (
        <div style={createPopupOverlayStyle()}>
          <DifficultySelector
            onSelect={handleDifficultySelect}
            onShowLeaderboard={() => setShowLeaderboard(true)}
            darkMode={darkMode}
          />
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
