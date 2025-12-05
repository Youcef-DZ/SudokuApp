import { useState, useCallback, useEffect } from 'react';
import { AuthProvider, useDescope, useSession, useUser } from '@descope/react-sdk';
import SudokuGame from './SudokuGame.tsx';
import DifficultySelect from '../components/DifficultySelect.tsx';
import LoginPage from '../components/LoginPage.tsx';
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
  const [showGame, setShowGame] = useState(!!startWithDifficulty);
  const [showLogin, setShowLogin] = useState(false);
  const [darkMode, setDarkMode] = useState(darkModeProp);

  // Extract username with proper fallback logic from both user object and session token
  const userName = getUserName(user, sessionToken);

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

  // Additional debug: log whenever showLogin or showGame changes
  useEffect(() => {
    console.log('📍 View State: showLogin =', showLogin, ', showGame =', showGame);
  }, [showLogin, showGame]);

  // Handle OAuth redirect: When user returns from OAuth provider (like Google),
  // we need to show the login page so Descope component can process the callback
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const hasOAuthParams = urlParams.has('code') || urlParams.has('state');
    
    if (hasOAuthParams) {
      console.log('🔄 OAuth redirect detected, ensuring login page is shown...');
      
      // CRITICAL: Show login page so Descope component can process OAuth callback
      if (!showLogin) {
        setShowLogin(true);
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
  }, [refresh, showLogin]);
  
  // Separate effect to close login modal when auth completes
  useEffect(() => {
    // If we're authenticated and login page is showing, close it
    if (isAuthenticated && showLogin) {
      console.log('✅ Auth successful, closing login modal...');
      setShowLogin(false);
    }
  }, [isAuthenticated, showLogin]);


  const toggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  const handleLogin = useCallback(() => {
    if (onLoginOverride) {
      onLoginOverride();
    } else {
      setShowLogin(true);
    }
  }, [onLoginOverride]);
  // Effect to watch for auth changes after login (for non-OAuth flows)
  useEffect(() => {
    if (isAuthenticated && showLogin) {
      console.log('✅ Auth state detected, closing login page...');
      setShowLogin(false);
    }
  }, [isAuthenticated, showLogin]);

  const handleLoginSuccess = useCallback(async () => {
    console.log('🔄 Login successful, waiting for auth state to update...');
    
    // The Descope component has already persisted tokens
    // Just refresh the session and the useEffect above will close the modal when auth updates
    await refresh();
    
    console.log('✅ Session refreshed, waiting for auth hooks to update...');
  }, [refresh]);

  // Show login page
  if (showLogin) {
    return (
      <LoginPage
        darkMode={darkMode}
        onSuccess={handleLoginSuccess}
        onBack={() => setShowLogin(false)}
      />
    );
  }

  // Show difficulty selection first
  if (!showGame) {
    return (
      <DifficultySelect
        onSelectDifficulty={(difficulty) => {
          setSelectedDifficulty(difficulty);
          setShowGame(true);
        }}
        onLogin={handleLogin}
        onLogout={() => {
          logout();
          // Stay on difficulty select after logout
        }}
        isAuthenticated={isAuthenticated}
        userName={userName}
        darkMode={darkMode}
        onToggleTheme={toggleTheme}
      />
    );
  }

  // Show game after difficulty is selected
  return (
    <SudokuGame
      {...gameProps}
      difficulty={selectedDifficulty || 'medium'}
      isAuthenticated={isAuthenticated}
      userName={userName}
      darkMode={darkMode}
      onToggleTheme={toggleTheme}
      onLogin={handleLogin}
      onLogout={onLogoutOverride || (() => {
        console.log('🚪 Logout button clicked');
        logout();
        console.log('✅ Logout completed');
        // Optionally go back to difficulty selection
        // setShowGame(false);
      })}
    />
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
