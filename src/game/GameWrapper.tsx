import { useState, useCallback } from 'react';
import { Pressable, Modal } from 'react-native';
import styled from 'styled-components/native';
// Descope not compatible with React Native web yet - removed
import SudokuGame from './SudokuGame';
import type { Difficulty } from '../shared/types.ts';

interface GameWrapperProps {
    onLoginOverride?: () => void;
    onLogoutOverride?: () => void;
    startWithDifficulty?: Difficulty;
    darkMode?: boolean;
}

const Container = styled.View<{ darkMode: boolean }>`
  flex: 1;
  background-color: ${props => props.darkMode ? '#1e293b' : '#f3f4f6'};
`;

const DifficultyModal = styled(Modal)``;

const ModalOverlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.View<{ darkMode: boolean }>`
  background-color: ${props => props.darkMode ? '#1e293b' : '#ffffff'};
  padding: 32px;
  border-radius: 24px;
  width: 90%;
  max-width: 400px;
  align-items: center;
`;

const ModalTitle = styled.Text<{ darkMode: boolean }>`
  font-size: 28px;
  font-weight: 700;
  color: ${props => props.darkMode ? '#f1f5f9' : '#0f172a'};
  margin-bottom: 24px;
  text-align: center;
`;

const DifficultyButton = styled(Pressable) <{ darkMode: boolean }>`
  width: 100%;
  padding: 16px;
  background-color: ${props => props.darkMode ? 'rgba(124, 58, 237, 0.2)' : 'rgba(124, 58, 237, 0.15)'};
  border-radius: 12px;
  border-width: 2px;
  border-color: ${props => props.darkMode ? 'rgba(124, 58, 237, 0.4)' : 'rgba(124, 58, 237, 0.3)'};
  align-items: center;
  margin-bottom: 12px;
`;

const DifficultyButtonText = styled.Text<{ darkMode: boolean }>`
  font-size: 18px;
  font-weight: 600;
  color: ${props => props.darkMode ? '#c4b5fd' : '#7c3aed'};
`;

const SkipButton = styled(Pressable) <{ darkMode: boolean }>`
  margin-top: 16px;
  padding: 12px;
`;

const SkipButtonText = styled.Text<{ darkMode: boolean }>`
  font-size: 14px;
  color: ${props => props.darkMode ? '#94a3b8' : '#64748b'};
  text-decoration: underline;
`;

export default function GameWrapper(props: GameWrapperProps) {
    const { onLoginOverride, onLogoutOverride, startWithDifficulty, darkMode: darkModeProp = false } = props;

    // Descope not supported on React Native web yet
    const isAuthenticated = false;
    const userName = undefined;
    const userEmail = undefined;

    const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | null>(startWithDifficulty || null);
    const [showDifficultyPopup, setShowDifficultyPopup] = useState(!startWithDifficulty);
    const [darkMode, setDarkMode] = useState(darkModeProp);

    const toggleTheme = useCallback(() => {
        setDarkMode(prev => !prev);
    }, []);

    const handleDifficultySelect = useCallback((difficulty: Difficulty) => {
        setSelectedDifficulty(difficulty);
        setShowDifficultyPopup(false);
    }, []);

    const handleNewGame = useCallback(() => {
        // Show difficulty selection popup when New Game is clicked
        setShowDifficultyPopup(true);
    }, []);

    return (
        <Container darkMode={darkMode}>
            {selectedDifficulty && (
                <SudokuGame
                    key={selectedDifficulty} // Force remount when difficulty changes
                    difficulty={selectedDifficulty}
                    isAuthenticated={isAuthenticated}
                    userName={userName}
                    userEmail={userEmail}
                    darkMode={darkMode}
                    onToggleTheme={toggleTheme}
                    onLogin={onLoginOverride}
                    onNewGame={handleNewGame} // Pass the handleNewGame that shows popup
                    onLogout={onLogoutOverride || (() => {
                        setSelectedDifficulty(null);
                        setShowDifficultyPopup(true);
                    })}
                />
            )}

            {/* Difficulty Selection Modal */}
            <DifficultyModal
                visible={showDifficultyPopup}
                transparent
                animationType="fade"
                onRequestClose={() => {
                    if (selectedDifficulty) {
                        setShowDifficultyPopup(false);
                    }
                }}
            >
                <ModalOverlay>
                    <ModalContent darkMode={darkMode}>
                        <ModalTitle darkMode={darkMode}>Choose Difficulty</ModalTitle>

                        <DifficultyButton
                            darkMode={darkMode}
                            onPress={() => handleDifficultySelect('easy')}
                        >
                            <DifficultyButtonText darkMode={darkMode}>
                                Easy
                            </DifficultyButtonText>
                        </DifficultyButton>

                        <DifficultyButton
                            darkMode={darkMode}
                            onPress={() => handleDifficultySelect('medium')}
                        >
                            <DifficultyButtonText darkMode={darkMode}>
                                Medium
                            </DifficultyButtonText>
                        </DifficultyButton>

                        <DifficultyButton
                            darkMode={darkMode}
                            onPress={() => handleDifficultySelect('hard')}
                        >
                            <DifficultyButtonText darkMode={darkMode}>
                                Hard
                            </DifficultyButtonText>
                        </DifficultyButton>

                        {selectedDifficulty && (
                            <SkipButton
                                darkMode={darkMode}
                                onPress={() => setShowDifficultyPopup(false)}
                            >
                                <SkipButtonText darkMode={darkMode}>
                                    Cancel
                                </SkipButtonText>
                            </SkipButton>
                        )}
                    </ModalContent>
                </ModalOverlay>
            </DifficultyModal>
        </Container>
    );
}
