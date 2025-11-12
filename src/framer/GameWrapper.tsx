import { useState, useCallback } from 'react';
import { AuthProvider, useDescope, useSession, useUser } from '@descope/react-sdk';
import SudokuGame from './SudokuGame.tsx';
import DifficultySelect from './DifficultySelect.tsx';
import type { SudokuGameProps, Difficulty } from './types.ts';

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

// Internal component that uses Descope hooks
function GameWithAuth(props: GameWrapperProps) {
  const { onLoginOverride, onLogoutOverride, startWithDifficulty, darkMode: darkModeProp = false, ...gameProps } = props;
  const { isAuthenticated } = useSession();
  const { user } = useUser();
  const { logout } = useDescope();
  
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(startWithDifficulty || null);
  const [showGame, setShowGame] = useState(!!startWithDifficulty);
  const [darkMode, setDarkMode] = useState(darkModeProp);

  const toggleTheme = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Show difficulty selection first
  if (!showGame) {
    return (
      <DifficultySelect
        onSelectDifficulty={(difficulty) => {
          setSelectedDifficulty(difficulty);
          setShowGame(true);
        }}
        onLogin={onLoginOverride || (() => {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
        })}
        isAuthenticated={isAuthenticated}
        userName={user?.name || user?.email}
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
      userName={user?.name || user?.email}
      darkMode={darkMode}
      onToggleTheme={toggleTheme}
      onLogin={onLoginOverride || (() => {
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
      })}
      onLogout={onLogoutOverride || (() => {
        logout();
        // Optionally go back to difficulty selection
        // setShowGame(false);
      })}
    />
  );
}

// This wrapper works identically in both local dev and Framer
// It automatically wraps with AuthProvider and connects Descope auth
// By default, starts with difficulty selection
export default function GameWrapper(props: GameWrapperProps) {
  return (
    <AuthProvider projectId={projectId}>
      <GameWithAuth {...props} />
    </AuthProvider>
  );
}
